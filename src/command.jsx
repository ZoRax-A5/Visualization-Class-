import React, { Component } from "react"
import * as d3 from "d3"
import { changeConfirmLocale } from "antd/lib/modal/locale";

class Command extends Component {

    componentWillReceiveProps(props) {
        const command = props.command
        const commandDiv = d3.select("#command")
        const reductionWay = props.reductionWay
        const width = commandDiv.node().parentNode.clientWidth
        const height = 279

        const select = commandDiv
            .attr("style","width:"+width+"px;height:"+height+"px")
            .append("select")
            .attr("id","reductionWay")

        function selected(){
            console.log("selected")
        }

        select
            .on("change",function(){
                const sel = document.getElementById("reductionWay");
                props.changeReductionWay(sel.options[sel.selectedIndex].value)
                
            })
        const TSNE = select
            .append("option")
            .text("TSNE")
            .attr("value","TSNE")
        const PCA = select
            .append("option")
            .text("PCA")
            .attr("value","PCA")
        const PCA_time = select
            .append("option")
            .text("PCA-time")
            .attr("value","PCA-time")
        if(reductionWay == "TSNE"){
            TSNE.attr("selected","selected")
        }
        else if(reductionWay == "PCA"){
            PCA.attr("selected","selected")
        }
        else if(reductionWay == "PCA-time") {
            PCA_time.attr("selected","selected")
        }
            
    }
    render() {
        return <div id="command" />
    }
}

export default Command