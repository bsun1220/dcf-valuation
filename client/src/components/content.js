import React from "react";
import styles from "./global.module.css";
import Start from "./start.js";

export default function Content(){
    return(
        <div className = {styles.content}>
            <Start/>
        </div>
    )
}