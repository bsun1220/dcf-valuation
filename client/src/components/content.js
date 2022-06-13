import React, {useState, useEffect} from "react";
import styles from "./global.module.css";
import Start from "./start.js";
import Metrics from "./metrics.js"
import Select from "./select.js";
import Final from "./final.js";

import simulate from "../scripts/simulate.js"
import axios from "axios";

export default function Content(){

    const [ticker, setTicker] = useState("");
    const [data, setData] = useState("Loading");
    const [page, changePage] = useState("start");
    const [params, setParams] = useState("");
    const [evList, setEvList] = useState([]);

    useEffect(()=>{
        const getData = async() =>{
            if(ticker !== ""){
                const request = await axios.get(`https://dcf-mc.herokuapp.com/yahoo/${ticker}`);
                setData(request.data);
            }
        }
        getData();
    },[ticker])

    useEffect(() => {
        if(params !== ""){
            const list = simulate(params);
            setEvList(list);
            changePage("final");
        }
    },[params]);

    const ref = {
        "start":<Start setTicker = {setTicker} changePage = {changePage}/>,
        "metrics":<Metrics ticker = {ticker} data = {data} changePage = {changePage} setData= {setData}/>,
        "select":<Select data = {data} setParams = {setParams} changePage = {changePage}/>,
        "final":<Final data = {evList} ticker = {ticker}/>
    }

    return(
        <div className = {styles.content}>
            {ref[page]}
        </div>
    )
}