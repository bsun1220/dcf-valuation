import React, {useState, useEffect} from "react";
import styles from "./global.module.css";
import Start from "./start.js";
import Metrics from "./metrics.js"
import axios from "axios";

export default function Content(){

    const [ticker, setTicker] = useState("");
    const [data, setData] = useState("Loading");
    const [page, changePage] = useState("start");

    useEffect(()=>{
        const getData = async() =>{
            if(ticker !== ""){
                const request = await axios.get(`http://localhost:9010/yahoo/${ticker}`);
                setData(request.data);
            }
        }
        getData();
    },[ticker])

    const ref = {
        "start":<Start setTicker = {setTicker} changePage = {changePage}/>,
        "metrics":<Metrics ticker = {ticker} data = {data}/>
    }

    return(
        <div className = {styles.content}>
            {ref[page]}
        </div>
    )
}