import React, {useState} from "react";
import styles from "./global.module.css";
import Card from "./card.js"

export default function Select(props){

    const [data, setData] = useState({
        "FINANCIALS":{...props.data["DATA"]["incomeStatement"][0]},
        "PROJECTIONS":{}
    });

    const stats = props.data["UFCF_STATS"];

    const ref = {
        "revenueGrowth":"Revenue Growth %",
        "cogsGrowth":"COGS Growth %",
        "opexGrowth":"OpEx Growth %",
        "changeWCRatio":"Delta NWC Rev Ratio %",
        "netCapexRatio": "Capex Rev Ratio %",
        "daRatio":"DA Rev Ratio %",
        "taxRate": "Tax Rate %",
    }


    const items = [];
    Object.keys(stats).forEach((item)=>{
        const check = item === "taxRate" ? true : false;
        const mean = Math.round(stats[item]["avg"] * 1000)/10;
        const std = Math.round(stats[item]["std"] * 1000)/10;
        items.push(<Card key = {item} metric = {ref[item]} 
            setData = {setData}
            data = {data}
            no = {check} 
            mean = {mean} 
            std = {std}/>)
    })
    items.push(<Card key = {"gg"} setData = {setData} metric = {"Gordon Growth Rate %"} std = {1} no = {true} mean = {2}/>)
    items.push(<Card key = {"wacc"} setData = {setData} metric = {"WACC %"} std = {0.3}
            mean = {Math.round(props.data["WACC"] * 1000)/10}/>)

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        props.setParams(data);
    }

    return(
        <div className = {styles.page}>
            <div className = {styles.selectList}>
                {items}
                <div className = {styles.buttons}>
                <button className = {styles.button} onClick = {handleSubmit}>
                    Submit
                </button>
                </div>
            </div>
        </div>
    )
}