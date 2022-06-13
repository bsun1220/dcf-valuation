import React from "react";
import styles from "./global.module.css"
import Chart from 'react-google-charts'

export default function Final(props){
    const average = (array) => array.reduce((a, b) => a + b) / array.length;
    const getSTD = (array, mean) => {
        const n = array.length;
        return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
    }
    const dataMean = average(props.data);
    const dataSTD = getSTD(props.data, dataMean);

    const transform = (arr) => {
        let new_arr = [];
        for(let i = 0; i < arr.length; i++){
            new_arr.push([arr[i]]);
        }
        return new_arr;
    }
    const transformedData = transform(props.data)

    const HistogramData = [
        [`${props.ticker.toUpperCase()} EVS`], ...transformedData
      ]
    
    const chartOptions = {
        title: `Equity Value per Share Distribution for ${props.ticker.toUpperCase()}`,
        legend: { position: 'top', maxLines: 2 },
        colors: ['#D04E4E'],
        interpolateNulls: false,
    }

    const sortArr = arr => {
        return [...arr].sort((a, b) => a - b);
    }
    const sorted_data = sortArr(props.data);

    const _25pe = sorted_data[Math.floor(sorted_data.length * 0.25)]
    const _50pe = sorted_data[Math.floor(sorted_data.length * 0.5)]
    const _75pe = sorted_data[Math.floor(sorted_data.length * 0.75)]
    const IQR = _75pe - _25pe;

    return(<div className = {styles.page} id = {styles.final}>
        <h1>Distribution</h1>
        <hr id = {styles.break}/>
        <p> This data reflects the distribution from the Monte Carlo Simulation.
        </p>
        <div id = {styles.chart}>
        <Chart
          width={'600px'}
          height={'240px'}
          chartType="Histogram"
          loader={<div>Loading Chart...</div>}
          data={HistogramData}
          options={chartOptions}
        />
        </div>
        <p> A Monte Carlo simulation was conducted 100,000 times to create the distribution for the projected 
            equity value per share. The following random variables were selected in this simulation to 
            conduct a discounted cash flow analysis many times: revenue growth, cost of goods sold growth, 
            operating expenses growth, depreciation and amortization ratio, change in net working capital ratio, 
            gordon growth rate, discount rate, and net capital expenditures ratio. From here, the user could choose
            the distribution of the random variable, the mean of the distribution, and the standard deviation of 
            the distribution.
        </p>
        <h1>Metrics</h1>
        <hr id = {styles.break}/>
        <p> The mean of the distribution was ${Math.floor(dataMean * 100)/100 }. 
            The standard deviation was ${Math.floor(dataSTD * 100)/100}. 
            When analyzing the outlier-resistant metrics, the median of the distribution was
            ${Math.floor(_50pe * 100)/100} with an interquartile range of ${Math.floor(IQR*100)/100}.
        </p>
        <a href = "/" style = {{"textDecoration":"none"}}>
        <div className = {styles.buttons} style = {{"marginTop":"0px"}}>
                <button className = {styles.button} style = {{"marginTop":"0px", "marginBottom":"0px"}}>
                    Home
                </button>
            </div>
        </a>
        </div>)
}