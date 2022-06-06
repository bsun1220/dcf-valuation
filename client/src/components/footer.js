import React from "react";
import styles from "./global.module.css";


export default function Footer(){
    return(
        <footer>
            <hr id = {styles.line}/>
            <p> &copy;  Benny Sun 2022</p>
        </footer>
    )
}