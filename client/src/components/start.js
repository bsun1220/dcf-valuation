import React, {useState} from "react";
import styles from "./global.module.css";

export default function Start(props){

    const [input, setInput] = useState("");

    const handleChange = (e) => {
        setInput(e.target.value);
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        if(input.replace(/\s/g, "") !== ""){
            props.setTicker(input.replace(/\s/g, ""));
            props.changePage("metrics");
        }
    }

    return(
        <div className = {styles.page}>
            <h1>Background Information</h1>
            <hr id = {styles.break}/>
            <p>
                Discounted cash flow valuation is an absolute valuation technique to value what a company
                will be worth in the future. Steps in this process include 1) projecting cash flows 2) 
                determining the discount rate 3) calculating your terminal value 4) discounting your cash flows
                5) finding the enterprise value and 6) determining your equity value per share.
            </p>
            <p>
                Monte Carlo simulations are used to model the probability of different outcomes by simulating random variables
                thousands if not millions of times to model their expected value and distribution. It is often used in fields
                like finance where uncertainty is common. This web application uses both DCF valuation and Monte Carlo
                simulation to value companies. 
            </p>
            <h1>How to use the DCF Valuation Calculator</h1>
            <hr id = {styles.break}/>
            <p>
                Enter in the ticker which you want to perform a discounted cash flow analysis.
                From here, you will receive fundamental data on its revenues, cost of goods sold,
                operating expenses, depreciation &amp; amortization, capital expenditures, 
                change in net working capital, and other financials in the last 4 years.
            </p>
            <p>
                Once you confirm this data, you will move towards choosing the various assumptions you want 
                in your model: revenue growth, cogs growth, opex growth, d&amp;a ratio, net capex ratio, 
                and nwc ratio, as well as your discount rate, tax rate, and gordon growth rate. You will
                choose from 3 different distributions (normal, uniform, and triangular) and metrics 
                like the mean and standard deviation. Each will come preloaded with a
                mean and standard deviation calculated automatically from the last 5 years.
            </p>

            <p id = {styles.ticker}> Ticker</p>
            <form className = {styles.form} onSubmit = {handleSubmit}>
                <input type = "text" className = {styles.formtext} onChange = {handleChange}>
                </input>
            </form>
            <div className = {styles.buttons}>
                <button className = {styles.button} onClick = {handleSubmit}>
                    Submit
                </button>
            </div>

        </div>
    )
}