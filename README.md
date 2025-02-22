# Visualization-Class

**The homework of Zhejiang University Vis Summer Course(2019)**

------

## Introduction

This project is the homework of Zhejiang University Vis Summer Course. The datasets we used contain the temporal network of contacts between students in a high school in Marseilles, France. Then we try some methods which reduce snapshots to points to express the information about the students. 
In order to open our project, you can enter the vis. Then open the windows powershell and input as follow:

```cmdEnvironment
  npm -i
  npm run start
```

## Algorithm implementation

First of all, We use python to write the back end of the project. We read the data line-by-line and create 2018 snapshots in total. Each snapshot contains the data about the contacts between students in an hour. The interval of each snapshot is 6 minutes. Then we generate adjacency matrix to express the frequency of the contacts by networkx and record the degree of the node of each snapshot. Then the graph is generated by using  high dimension vectors.  After that, we can use some the descending dimension algorithm, such as TSNE, PCA, to get the two-dimensional coordinate of each snapshot. The detail is in the file "后端数据处理.py"

The structure of the data is showed as follow:

```python
  vector:
  starttime:
  Degree_distribution:
  graph:{
  	directed: False
  	multigraph: False
  	graph: {}
  	nodes:
  	{
  		id:
  		group:
  		degree:
  	}
  	links:
  	{
  		weight:
  		source:
  		target:
  	}
  }
```

## Environment

Before running the program, you had better check out the environment of your computer.

- [Node.js](https://nodejs.org/zh-cn/)
- [npm](https://www.jianshu.com/p/f311a3a155ff)
- d3

## Reference

The source of Dataset: http://www.sociopatterns.org/datasets/high-school-dynamic-contact-networks/

The principle of algorithm: http://www.cad.zju.edu.cn/home/vagblog/old/

## Programmer

**Leader: Long Qian**

**Member: Lechen Yang**

**Member: Weixu Zong**
