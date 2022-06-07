import React from "react";
import styles from "./global.module.css";

export default function Header(){
    return(
        <div className = {styles.homepage}>
            <h1 id = {styles.title}>DCF Valuation App</h1>
        </div>
    )
}