import React from "react";
import styles from "./global.module.css";
import Card from "./card.js"

export default function Select(props){


    const stats = props.data["UFCF_STATS"];

    const ref = {
        "revenueGrowth":"Revenue Growth %",
        "cogsGrowth":"COGS Growth %",
        "opexGrowth":"OpEx Growth %",
        "changeWCRatio":"Change NWC Rev Ratio",
        "netCapexRatio": "Capex Rev Ratio",
        "daRatio":"DA Rev Ratio",
        "taxRate": "Tax Rate",
    }


    const items = [];
    Object.keys(stats).forEach((item)=>{
        const check = item === "taxRate" ? true : false;
        items.push(<Card metric = {ref[item]} no = {check}/>)
    })
    items.push(<Card metric = {"Gordon Growth Rate"} no = {true}/>)
    items.push(<Card metric = {"WACC"}/>)



    return(
        <div className = {styles.page}>
            <div className = {styles.selectList}>
                {items}
            </div>
        </div>
    )
}