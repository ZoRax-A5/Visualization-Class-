import React, { Component } from "react"
import * as d3 from "d3"

class Distribution extends Component {

    componentWillReceiveProps(props) {
        const distribution = props.distribution
        const distributionSVG = d3.select("#distribution")
        const padding = 28
        const width = distributionSVG.node().parentNode.clientWidth
        const height = 300
        const num = 10
        const rectWidth = width/num - 2

        const hScale = d3
            .scaleLinear()
            .domain([0,180])
            .range([0,height - padding - 30])
        
        const xScale = d3
            .scaleBand()
            .domain([0,1,2,4,8,16,32,64,128])
            .range([rectWidth * 0.5,rectWidth * 9.5])

        const hScaleAxis = d3
            .scaleLinear()
            .domain([0,180])
            .range([height - padding - 30,0])

        distributionSVG.attr("width", width).attr("height", height)

        const hAxis = d3.axisLeft(hScaleAxis)
            .ticks(9)

        const xAxis = d3.axisBottom(xScale)
            .ticks(9)

        const lineData = []
        for (let i = 0; i < distribution.length - 1; i++) {
            lineData.push([
                [padding + (i + 0.5) * rectWidth,hScale(180 - distribution[i]) + 20],
                [padding + (i + 1.5) * rectWidth,hScale(180 - distribution[i + 1]) + 20]
            ])
        }

        const lines = distributionSVG
            .append("g")
            .attr("class","lines")
            .selectAll("line")
            .data(lineData)
            .enter()
            .append("line")
            .attr("x1",d => d[0][0])
            .attr("x2",d => d[1][0])
            .attr("y1",hScale(180) + 20)
            .attr("y2",hScale(180) + 20)
            .transition()
            .duration(500)
            .attr("y1",d => d[0][1])
            .attr("y2",d => d[1][1])
            .attr("stroke-width",2)
            .attr("stroke", "#d9dde2")

        const points = distributionSVG
            .append("g")
            .attr("class","points")
            .selectAll("circle")
            .data(distribution)
            .enter()
            .append("circle")
            .attr("r",3)
            .attr("cx",function(d,i) {
                return padding + (i + 0.5) * rectWidth
            })
            .attr("fill","black")
            .attr("cy",hScale(180) + 20)
            .transition()
            .duration(500)
            .attr("cy",function(d) {
                return hScale(180 - d) + 20
            })
            
        
        distributionSVG
            .append("g")
            .attr("class","axes")
            .attr("transform","translate(" + padding + ",20)")
            .call(hAxis)
        
        distributionSVG
            .append("g")
            .attr("class","axes")
            .attr("transform","translate(17," + (height - padding - 10) + ")")
            .call(xAxis)

    }
    render() {
        return <svg id="distribution" />
    }
}

export default Distribution