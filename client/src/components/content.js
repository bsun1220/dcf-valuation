import React, {useEffect, useState} from "react";
import styles from "./global.module.css";
import Start from "./start.js";
import Metrics from "./metrics.js"

import axios from "axios";


export default function Content(){

    const [ticker, setTicker] = useState("ktcc");
    const [page, changePage] = useState("start");

    const getData = async () => {
        const url = "https://query2.finance.yahoo.com/v10/finance/quoteSummary/NVDA?modules=assetProfile";
        const response = await axios.get(url);
        console.log(response);
    }

    useEffect(()=>{
        getData();
    }, [ticker]);

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