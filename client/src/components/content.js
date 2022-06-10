import React, {useState, useEffect} from "react";
import styles from "./global.module.css";
import Start from "./start.js";
import Metrics from "./metrics.js"
import Select from "./select.js";
import axios from "axios";

export default function Content(){

    const [ticker, setTicker] = useState("");
    const [data, setData] = useState("Loading");
    const [page, changePage] = useState("start");
    const [params, setParams] = useState("");

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
        "metrics":<Metrics ticker = {ticker} data = {data} changePage = {changePage} setData= {setData}/>,
        "select":<Select data = {data} setParams = {setParams}/>
    }

    return(
        <div className = {styles.content}>
            {ref[page]}
        </div>
    )
}