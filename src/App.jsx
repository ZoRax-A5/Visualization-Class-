import React from "react"
import * as d3 from "d3"
import "./App.css"
import { Col, Row } from "antd"
import Snapshots from "./snapshots"
import Graph from "./graph"
import Distribution from "./distribution"
import Command from "./command"

const startTime = new Date(2012,11,19,6,36,20)
const endTime = new Date(2012,11,27,16,18,20)

const timeScale = d3
            .scaleLinear()
            .domain([0,2017])
            .range([startTime, endTime])

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            index:0,
            snapshots: [],
            graph: {},
            distribution:[],
            display:"",
            reductionWay:"",
            file:d3.json("./data_TSNE.json")
        }
        this.changeReductionWay = this.changeReductionWay.bind(this)
        this.changeIndex = this.changeIndex.bind(this)
    }

    changeReductionWay(way) {
        d3.select("#snapshot").selectAll("line").remove()
        d3.select("#snapshot").selectAll("circle").remove()
        d3.select("#snapshot").selectAll(".labels").remove()
        d3.select("#graph").selectAll(".links").remove()
        d3.select("#graph").selectAll(".nodes").remove()
        d3.select("#graph").selectAll(".dateDisplay").remove()
        d3.select("#graph").selectAll(".labels").remove()
        d3.select("#distribution").selectAll(".lines").remove()
        d3.select("#distribution").selectAll(".points").remove()
        d3.select("#distribution").selectAll(".axes").remove()
        d3.select("#command").selectAll("select").remove()
        let i = this.state.index
        if(way == "TSNE"){
            d3.json("./data_TSNE.json").then(snapshots => {
                this.setState({
                    index:i,
                    snapshots: snapshots,
                    graph: snapshots[i].graph,
                    distribution:snapshots[i].Degree_distribution,
                    display:timeScale(i),
                    reductionWay:way,
                    file:d3.json("./data_TSNE.json")
                })
            })
        }
        else {
            d3.json("./data_PCA.json").then(snapshots => {
                this.setState({
                    index:i,
                    snapshots: snapshots,
                    graph: snapshots[i].graph,
                    distribution:snapshots[i].Degree_distribution,
                    display:timeScale(i),
                    reductionWay:way,
                    file:d3.json("./data_PCA.json")
                })
            })
        }
    }

    changeIndex(i) {
        d3.select("#snapshot").selectAll(".labels").remove()
        d3.select("#graph").selectAll(".links").remove()
        d3.select("#graph").selectAll(".nodes").remove()
        d3.select("#graph").selectAll(".dateDisplay").remove()
        d3.select("#graph").selectAll(".labels").remove()
        d3.select("#distribution").selectAll(".lines").remove()
        d3.select("#distribution").selectAll(".points").remove()
        d3.select("#distribution").selectAll(".axes").remove()
        d3.select("#command").selectAll("select").remove()
        this.state.file.then(snapshots => {
            this.setState({
                index:i,
                snapshots: snapshots,
                graph: snapshots[i].graph,
                distribution:snapshots[i].Degree_distribution,
                display:timeScale(i)
            })
        })
    }

    componentDidMount() {
        d3.selectAll(".ant-col")
            .attr("style","border:1.5px solid #ddd;background-color:#f3f3f3")

        d3.json("./data_TSNE.json").then(snapshots => {
            this.setState({
                index:0,
                snapshots: snapshots,
                graph: snapshots[0].graph,
                distribution:snapshots[0].Degree_distribution,
                display:timeScale(0),
                reductionWay:"TSNE"
            })
        })
    }

    render() {
        const snapshots = this.state.snapshots
        const graph = this.state.graph
        const distribution = this.state.distribution
        const display = this.state.display
        const reductionWay = this.state.reductionWay
        return (
            <div className="App">
                <Row>
                    <Col span={4}>
                        <Distribution distribution={distribution} />
                        <Command reductionWay={reductionWay} changeReductionWay={this.changeReductionWay}/>
                    </Col>
                    <Col span={10}>
                        <Snapshots snapshots={snapshots} reductionWay={reductionWay} changeIndex = {this.changeIndex} />
                    </Col>
                    <Col span={10}>
                        <Graph graph={graph} display={display} />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default App
