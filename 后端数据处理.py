import networkx as nx
import numpy as np
from sklearn.decomposition import PCA
from networkx.readwrite import json_graph
from sklearn.manifold import TSNE
import json
import csv

def jsonGenerator(nodetemp,edgetemp,cnt):
    edgedic = []
    order = 0
    nodedics = []
    for node in nodetemp:
        nodedics.append({
            "id":"{}".format(node[0]),
            "group":"{}".format(node[1]),
            "degree":degOfSnapshot[cnt][order]
        })
        order += 1
    for edge in edgetemp:
        edgedic.append({
                "weight":edge[2],
                "source":"{}".format(edge[0]),
                "target":"{}".format(edge[1])
            }
        )
    thisjson = {
        "vector":list(X_pca[cnt]),
        "startTime":startTime,
        "Degree_distribution":alldises[cnt],
        "graph":
        {
            "directed":False,
            "multigraph":False,
            "graph":{},
            "nodes":nodedics,
            "links":edgedic
        }
    }
    return thisjson

def generator(nodetemp,edgetemp):
    graph = nx.Graph()
    graph.add_nodes_from(nodetemp)
    for edge in edgetemp:
        graph.add_edge(edge[0],edge[1],weight = edge[2])
    degOfNodes = []
    for node in nodetemp:
        deg = 0
        for edge in edgetemp:
            if int(node) == int(edge[0]) or int(node) == int(edge[1]):
                deg += edge[2]
        degOfNodes.append(deg)
    degdistmp = nx.degree_histogram(graph)
    degdis = [0] * 9
    for i in range(len(degdistmp)):
        if 0 <= i < 1:
            degdis[0] += degdistmp[i]
        elif 1 <= i < 2:
            degdis[1] += degdistmp[i]
        elif 2 <= i < 4:
            degdis[2] += degdistmp[i]
        elif 4 <= i < 8:
            degdis[3] += degdistmp[i]
        elif 8 <= i < 16:
            degdis[4] += degdistmp[i]
        elif 16 <= i < 32:
            degdis[5] += degdistmp[i]
        elif 32 <= i < 64:
            degdis[6] += degdistmp[i]
        elif 64 <= i < 128:
            degdis[7] += degdistmp[i]
        elif 128 <= i < 256:
            degdis[8] += degdistmp[i]
    A = nx.adjacency_matrix(graph).todense()
    vector = np.array([])
    for line in A:
        vector = np.append(vector,line)
    return (degOfNodes,degdis,vector)

with open("thiers_2012.csv") as f:
    thisfile = csv.reader(f,delimiter = '\t')
    trial = open("trial.txt","w+")
    fname = open("jsonTrial2.json","w+")
    nodetemp = []
    edgetemp = []
    snapshots = []
    vectors = []
    alldises = []
    degOfNodes = []
    degOfSnapshot = []
    nodedics = []
    startTime = 1353303380
    for row in thisfile:
        if not(row[1] in nodetemp):
            nodetemp.append(row[1])
        if not(row[2] in nodetemp):
            nodetemp.append(row[2])
    f.seek(0,0)
    line = f.readline()
    cnt = 0
    while line > "":
        row = line.split("\t")
        row[4] = row[4].strip('\n')
        if int(row[0]) < startTime:
            continue
        elif int(row[0]) >= startTime and int(row[0]) < startTime + 3600:
            if int(row[0]) < startTime + 360:
                position = f.tell()
            if edgetemp > []:
                notIn = 1
                for elem in edgetemp: 
                    if (row[1],row[2]) == (elem[0],elem[1]):
                        elem[2] += 1
                        notIn = 0
                        break
                if notIn:
                    edgetemp.append(["{}".format(row[1]),"{}".format(row[2]),1])
            else:
                edgetemp.append(["{}".format(row[1]),"{}".format(row[2]),1])
            line = f.readline()
        else:
            degOfNodes,degdis,vector = generator(nodetemp,edgetemp)
            degOfSnapshot.append(degOfNodes)
            alldises.append(degdis)
            vectors.append(vector)
            edgetemp = []
            f.seek(position,0)
            line = f.readline()
            cnt += 1
            startTime += 360
            print(cnt)
    else:
        degOfNodes,degdis,vector = generator(nodetemp,edgetemp)
        degOfSnapshot.append(degOfNodes)
        alldises.append(degdis)
        vectors.append(vector)
        edgetemp = []
        f.seek(position,0)
        line = f.readline()
        cnt += 1
        startTime += 360
        print(cnt)
    estimator = TSNE(n_components=2)
    X_pca = estimator.fit_transform(vectors)
    f.seek(0,0)
    thisfile = csv.reader(f,delimiter = '\t')   
    nodetemp = []
    cnt = 0
    for row in thisfile:
        if not([row[1],row[3]] in nodetemp):
            nodetemp.append([row[1],row[3]])
        if not([row[2],row[4]] in nodetemp):
            nodetemp.append([row[2],row[4]])
    f.seek(0,0)
    cnt = 0
    alljsons = []
    startTime = 1353303380
    line = f.readline()
    while line > "":
        row = line.split("\t")
        row[4] = row[4].strip('\n')
        if int(row[0]) < startTime:
            continue
        elif int(row[0]) >= startTime and int(row[0]) < startTime + 3600:
            if int(row[0]) < startTime + 360:
                position = f.tell()
            if edgetemp > []:
                notIn = 1
                for elem in edgetemp: 
                    if (row[1],row[2]) == (elem[0],elem[1]):
                        elem[2] += 1
                        notIn = 0
                        break
                if notIn:
                    edgetemp.append(["{}".format(row[1]),"{}".format(row[2]),1])
            else:
                edgetemp.append(["{}".format(row[1]),"{}".format(row[2]),1])
            line = f.readline()
        else:
            thisjson = jsonGenerator(nodetemp,edgetemp,cnt)
            alljsons.append(thisjson)
            edgetemp = []
            f.seek(position,0)
            line = f.readline()
            cnt += 1
            startTime += 360
            print(cnt)
    else:
        thisjson = jsonGenerator(nodetemp,edgetemp,cnt)
        alljsons.append(thisjson)
        cnt += 1
        startTime += 360
        print(cnt)
    fname.write('[')
    for text in alljsons:
        fname.write(str(text) + ',\n')
    fname.write(']')