import React, {useState} from "react";
import styles from "./global.module.css";
import Start from "./start.js";
import Metrics from "./metrics.js"


export default function Content(){

    const [ticker, setTicker] = useState("ktcc");
    const [page, changePage] = useState("start");

    const ref = {
        "start":<Start setTicker = {setTicker} changePage = {changePage}/>,
        "metrics":<Metrics ticker = {ticker}/>
    }

    return(
        <div className = {styles.content}>
            {ref[page]}
        </div>
    )
}