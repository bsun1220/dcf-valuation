import React from "react";
import styles from "./global.module.css";

export default function Metrics(props){
    return(
        <div className = {styles.page}>
            <h1>{props.ticker.toUpperCase()} Information</h1>
            <hr id = {styles.break}/>
        </div>
    )
}