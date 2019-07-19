import React, { Component } from "react"
import * as d3 from "d3"

class Snapshots extends Component {
    constructor(props) {
        super(props)
    }

    componentWillReceiveProps(props) {
        const startTime = new Date(2012,11,19,6,36,20)
        const endTime = new Date(2012,11,27,16,18,20)
        const reductionWay = props.reductionWay
        const timeScale = d3
            .scaleLinear()
            .domain([0,2017])
            .range([startTime, endTime])
        const rainbow = d3
            .scaleSequential()
            .domain([0,2017])
            .interpolator(d3.interpolateReds)
        const snapshots = props.snapshots
        const snapshotSVG = d3.select("#snapshot")
        const labelnum = []
        for(let i = 0;i < 2017;i += 28) {
            labelnum.push(i)
        }
        const padding = 100
        const width = snapshotSVG.node().parentNode.clientWidth
        snapshotSVG.attr("width", width).attr("height", width)
        const max = {}
        const min = {}
        max.x = d3.max(snapshots, snpst => snpst.vector[0])
        max.y = d3.max(snapshots, snpst => snpst.vector[1])
        min.x = d3.min(snapshots, snpst => snpst.vector[0])
        min.y = d3.min(snapshots, snpst => snpst.vector[1])
        const yScale = d3
            .scaleLinear()
        let pointsData = []
        const snapshotLinkData = []
        const xScale = d3.scaleLinear()
        if(reductionWay == "PCA-time"){
            xScale 
                .domain([0,2017])
                .range([padding, width - padding])
            yScale
                .domain([min.x, max.x])
                .range([padding, width - padding])
            for (let i = 0; i < snapshots.length - 1; i++) {
                snapshotLinkData.push([
                    [i,snapshots[i].vector[0]],
                    [i+1,snapshots[i + 1].vector[0]]
                ])
            }
            for (let i = 0; i < snapshots.length; i++) {
                pointsData.push([i,snapshots[i].vector[0]])
            }
        }
        else{
            xScale
                .domain([min.x, max.x])
                .range([padding, width - padding])
            yScale
                .domain([min.y, max.y])
                .range([padding, width - padding])
            for (let i = 0; i < snapshots.length - 1; i++) {
                snapshotLinkData.push([
                    snapshots[i].vector,
                    snapshots[i + 1].vector
                ])
            }
            pointsData = snapshots.map(snpst => snpst.vector)
        }
        const snapshotLink = snapshotSVG
            .selectAll("line")
            .data(snapshotLinkData)
        snapshotLink.exit().remove()
        snapshotLink
            .enter()
            .append("line")
            .attr("x1", d => xScale(d[0][0]))
            .attr("x2", d => xScale(d[1][0]))
            .attr("y1", d => yScale(d[0][1]))
            .attr("y2", d => yScale(d[1][1]))
            .attr("stroke", "#d9dde2")
            .attr("stroke-width", 2)
        
        const points = snapshotSVG.selectAll("circle").data(pointsData)
        points.exit().remove()
        points
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d[0]))
            .attr("cy", d => yScale(d[1]))
            .attr("r", 5)
            .attr("fill", function(d,i) {
                return rainbow(i)
            })
            .attr("stroke", "#d9dde2")
            .on("mouseover", (d, i) => {        //重要
            })
            .on("click",(d,i) => {
                props.changeIndex(i)
            })
        snapshotSVG
            .append("g")
            .attr("class","labels")
            .selectAll("rect")
            .data(labelnum)
            .enter()
            .append("rect")
            .attr("fill",function(d) {
                return rainbow(d)
            })
            .attr("width",2)
            .attr("height",10)
            .attr("y",10)
            .attr("x",function(d,i) {
                return i + 450
            })
        snapshotSVG
            .append("text")
            .attr("class","labels")
            .text("2012.11.19")
            .attr("font-size",8)
            .attr("transform","translate(430,30)")
        snapshotSVG
            .append("text")
            .attr("class","labels")
            .text("2012.11.27")
            .attr("font-size",8)
            .attr("transform","translate(502,30)")
    }
    render() {
        return <svg id="snapshot" />
    }
}

export default Snapshots