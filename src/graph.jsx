import React, { Component } from "react"
import * as d3 from "d3"

class Graph extends Component {
    componentWillReceiveProps(props) {
        const graph = props.graph
        const display = props.display
        const datetmp = new Date(display)
        const endDate = new Date(datetmp.setHours(display.getHours() + 1))
        const graphSVG = d3.select("#graph")
        const padding = 100
        const width = graphSVG.node().parentNode.clientWidth
        const classes = ["PC","PC*","PSI*","MP*1"]
        const weekdays = ["星期五","星期六","星期天","星期一","星期二","星期三","星期四"]
        graphSVG
            .attr("width", width)
            .attr("height", width)
        const color =d3.schemeCategory10
        const colorReflex = d3
                .scaleOrdinal()
                .domain(classes)
                .range([color[0],color[1],color[2],color[3]])
        const simulation = d3
            .forceSimulation()
            .force(
                "link",
                d3.forceLink().id(function(d) {
                    return d.id
                })
            )
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, width / 2))

        simulation.nodes(graph.nodes).on("tick", ticked)
        simulation.alpha(0.1)
        simulation.force("link").links(graph.links).distance(80)
        const link = graphSVG
            .append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter()
            .append("line")
            .attr("stroke", "#d9dde2")
        const node = graphSVG
            .append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter()
            .append("circle")
            .attr("r", function(d) {
                return Math.sqrt(d.degree)/2 + 3
            })
            .on("click",clicked)
            .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))

        graphSVG.append("g")
            .attr("class","labels")
            .selectAll("rect")
            .data(classes)
            .enter()
            .append("rect")
            .attr("width",20)
            .attr("height",10)
            .attr("x",function(d,i) {
                return i * 50 + 350
            })
            .attr("y",10)
            .attr("fill",function(d,i) {
                return colorReflex(d)
            })
        
        graphSVG.append("g")
            .attr("class","labels")
            .selectAll("text")
            .data(classes)
            .enter()
            .append("text")
            .text(function(d,i) {
                return d
            })
            .attr("transform",function(d,i){
                return "translate("+(i * 50 + 370) + ",20)"
            })

        graphSVG.append("text")
            .attr("class","dateDisplay")
            .text(`${display.getYear()+1900}.${display.getMonth()}.${display.getDate()}
            ${display.getHours()<10?"0"+display.getHours():display.getHours()}:${display.getMinutes()<10?"0"+display.getMinutes():display.getMinutes()}:${display.getSeconds()<10?"0"+display.getSeconds():display.getSeconds()}
            ${weekdays[display.getDay()]}
            ——${endDate.getYear()+1900}.${endDate.getMonth()}.${endDate.getDate()}
             ${endDate.getHours()<10?"0"+endDate.getHours():endDate.getHours()}:${endDate.getMinutes()<10?"0"+endDate.getMinutes():endDate.getMinutes()}:${endDate.getSeconds()<10?"0"+endDate.getSeconds():endDate.getSeconds()}
             ${weekdays[endDate.getDay()]}`)
            .attr("transform","translate(0,"+(width-2)+")")

        function ticked() {
            let max = {}
            let min = {}
            max.x = d3.max(graph.nodes, n => n.x)
            max.y = d3.max(graph.nodes, n => n.y)
            min.x = d3.min(graph.nodes, n => n.x)
            min.y = d3.min(graph.nodes, n => n.y)
            const xScale = d3
                .scaleLinear()
                .domain([min.x, max.x])
                .range([padding, width - padding])
            const yScale = d3
                .scaleLinear()
                .domain([min.y, max.y])
                .range([padding, width - padding])
            link.attr("x1", function(d) {
                return xScale(d.source.x)
            })
                .attr("y1", function(d) {
                    return yScale(d.source.y)
                })
                .attr("x2", function(d) {
                    return xScale(d.target.x)
                })
                .attr("y2", function(d) {
                    return yScale(d.target.y)
                })
                .attr("stroke-width",function(d) {
                    return Math.sqrt(d.weight)
                })
                .attr("stroke-opacity",1)
            node.attr("cx", function(d) {
                return xScale(d.x)
            }).attr("cy", function(d) {
                return yScale(d.y)
            }).attr("fill",function(d) {
                return colorReflex(d.group)
            })
        }

        function clicked(d) {
            console.log(d);
        }

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
          
        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }
        
        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    }
    render() {
        return <svg id="graph" />
    }
}

export default Graph