import React, {useEffect, useState} from "react";
import styles from "./global.module.css";
import axios from "axios";

export default function Metrics(props){

    const [data, setData] = useState("");

    useEffect(()=>{
        const getData = async() => {
            const ticker = props.ticker;
            const request = await axios.get(`http://localhost:9010/yahoo/${ticker}`);
            setData(JSON.stringify(request.data));
        }

        getData();
    }, [props.ticker]);

    return(
        <div className = {styles.page}>
            <h1>{props.ticker.toUpperCase()} Information</h1>
            <hr id = {styles.break}/>
            <p>
                {data}
            </p>
        </div>
    )
}