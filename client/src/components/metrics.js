import React from "react";
import styles from "./global.module.css";

export default function Metrics(props){
    if(props.data === "Ticker info not complete"){
        const handleClick = (e) =>{
            e.preventDefault()
            props.setData("Loading");
            props.changePage("start");
        };

        return(
            <div className = {styles.page} id = {styles.error}>
                <h1>Error for {props.ticker.toUpperCase()}</h1>
                <div className = {styles.buttons}>
                <button className = {styles.button} onClick = {handleClick}>
                    Select Again
                </button>
                </div>
            </div>
        )
    }
    else if (props.data === "Loading"){
        return(
            <div className = {styles.page} id = {styles.error}>
                <h1>Loading for {props.ticker.toUpperCase()}</h1>
            </div>
        )
    }
    else{
        

        const handleClick = (e) => {
            e.preventDefault();
            props.changePage("select");
        };

        const is = props.data["DATA"]["incomeStatement"];
        const bs = props.data["DATA"]["balanceSheet"];
        const cf = props.data["DATA"]["cashFlowStatement"];

        const is_items = [];

        is.forEach((year) => {
            const year_items = [];
            for(const key of Object.keys(year)){
                if(key !== "interestExpense"){
                    const amount = key === "year" ? year[key] : "$" + year[key]/1000;
                    year_items.push(<td id = {styles.element}>{amount}</td>);
                }
            }
            is_items.push(<tbody><tr>{year_items}</tr></tbody>);
        })

        const cf_items = [];
        cf.forEach((year) => {
            const year_items = [];
            for(const key of Object.keys(year)){
                const amount = key === "year" ? year[key] : "$" + year[key]/1000;
                year_items.push(<td id = {styles.element} colSpan = "2">{amount}</td>);
            }
            cf_items.push(<tbody><tr>{year_items}</tr></tbody>);
        })

        const bs_items = [];
        bs.forEach((year) => {
            const year_items = [];
            for(const key of Object.keys(year)){
                const amount = key === "year" ? year[key] : "$" + year[key]/1000;
                year_items.push(<td id = {styles.element}>{amount}</td>);
            }
            bs_items.push(<tbody><tr>{year_items}</tr></tbody>);
        });

        const ufcf = props.data["UFCF_STATS"];
        const ufcf_items = [];

        const ufcf_rev = {
            "revenueGrowth": "Revenue Growth",
            "cogsGrowth": "COGS Growth",
            "opexGrowth" : "OpEx Growth",
            "changeWCRatio": "NWC Change Ratio",
            "netCapexRatio":"Net CapEx Ratio",
            "daRatio":"DA Ratio",
            "taxRate": "Tax Rate"
        }
        Object.keys(ufcf).forEach((item) =>{
            const items = [];
            items.push(<td id = {styles.element}>{ufcf_rev[item]}</td>);

            const avg = "" + Math.round(ufcf[item]["avg"] * 10000)/100+ "%";
            items.push(<td id = {styles.element}>{avg}</td>);
            const std = "" + Math.round(ufcf[item]["std"] * 10000)/100+ "%";
            items.push(<td id = {styles.element}>{std}</td>);
            ufcf_items.push(<tbody><tr>{items}</tr></tbody>)
        });


        return(
            <div className = {styles.page}>
                <h1>{props.ticker.toUpperCase()} Financial Information</h1>
                <hr id = {styles.break}/>
                <table>
                    <tbody>
                        <tr>
                        <td colSpan = "6" id = {styles.eltitle}>Income Statement (in thousands)</td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                        <td id = {styles.element} >Year</td>
                        <td id = {styles.element} >Revenue</td>
                        <td id = {styles.element}>COGS</td>
                        <td id = {styles.element}>Operating Expense</td>
                        <td id = {styles.element}>Pretax Income</td>
                        <td id = {styles.element}>Tax Expense</td>
                        </tr>
                    </tbody>
                    {is_items}
                    <tbody>
                        <tr>
                        <td colSpan = "6" id = {styles.eltitle}>Cash Flow Statement (in thousands)</td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                        <td colSpan = "2" id = {styles.element}>Year</td>
                        <td colSpan = "2" id = {styles.element}>Depreciation</td>
                        <td colSpan = "2" id = {styles.element}>Capital Expenditures</td>
                        </tr>
                    </tbody>
                    {cf_items}
                    <tbody>
                        <tr>
                        <td colSpan = "6" id = {styles.eltitle}>Balance Sheet (in thousands)</td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                        <td id = {styles.element}>Year</td>
                        <td id = {styles.element}>Cash</td>
                        <td id = {styles.element}>Current Assets</td>
                        <td id = {styles.element}>Capital Liabilities</td>
                        <td id = {styles.element}>Short Term Debt</td>
                        <td id = {styles.element}>Long Term Debt</td>
                        </tr>
                    </tbody>
                    {bs_items}
                </table>
                <h1>{props.ticker.toUpperCase()} Key Metrics</h1>
                <hr id = {styles.break}/>
                <table>
                    <tbody>
                        <td id = {styles.eltitle} colSpan = "3">Cash Flow Statistics</td>
                    </tbody>
                    <tbody>
                        <td id = {styles.element}>Metric</td>
                        <td id = {styles.element}>Average</td>
                        <td id = {styles.element}>Standard Deviation</td>
                    </tbody>
                    {ufcf_items}
                </table>
                <div className = {styles.buttons}>
                <button className = {styles.button} onClick = {handleClick}>
                    Confirm
                </button>
                </div>
            </div>
        
        )

    }
    
}