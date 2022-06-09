import {getFinancials} from "./yahoo-calls.js";


const RFRATE = 0.0234;
const MKTRETURN = 0.07;

const calcGrowth = (df, index, content) => {
    const current = df["incomeStatement"][index][content];
    const prev = df["incomeStatement"][index + 1][content];

    const final_prev = prev !== 0 ? prev : 1;
    return (current - prev)/final_prev;
}

function ufcfMetrics(data){

    let arr = [];

    for (let i = 0; i < 4; i++){
        arr[i] = {};
        arr[i]["year"] = data["incomeStatement"][i]["year"];
        const rev = data["incomeStatement"][i]["revenue"];
        const final_rev = rev === 0 ? 1 : rev;

        if(i !== 3){
            arr[i]["revenueGrowth"] = calcGrowth(data, i, "revenue");
            arr[i]["cogsGrowth"] = calcGrowth(data, i, "cogs");
            arr[i]["opexGrowth"] = calcGrowth(data, i, "operatingExpense");

            const currentWC = 
                    (data["balanceSheet"][i]["currentAsset"] - data["balanceSheet"][i]["cash"]) - 
                    (data["balanceSheet"][i]["currentLiabilities"] - data["balanceSheet"][i]["shortLongTermDebt"]);
            
            const prevWC = 
                (data["balanceSheet"][i+1]["currentAsset"] - data["balanceSheet"][i+1]["cash"]) - 
                (data["balanceSheet"][i+1]["currentLiabilities"] - data["balanceSheet"][i+1]["shortLongTermDebt"]);
            
            arr[i]["changeWCRatio"] = (currentWC - prevWC)/final_rev;
            
        }
        arr[i]["netCapexRatio"] = 
                (-data["cashFlowStatement"][i]["capex"] - data["cashFlowStatement"][i]["depreciation"])
                /(final_rev);
        
        arr[i]["daRatio"] = data["cashFlowStatement"][i]["depreciation"]/final_rev;

        arr[i]["taxRate"] = data["incomeStatement"][i]["taxExpense"]/data["incomeStatement"][i]["pretaxIncome"];
        arr[i]["netDebt"] = data["balanceSheet"][i]["shortLongTermDebt"] + data["balanceSheet"][i]["longTermDebt"] - data["balanceSheet"][i]["cash"];
    }

    return arr;

}

const getAverage = (array) => array.reduce((a,b) => a + b)/array.length;

const getSTD = (array, mean) => {
    const n = array.length;
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
}

function getUFCFStats(data){
    let arr = {
        "revenueGrowth":{"avg":0,"std":0, "lst":[]},
        "cogsGrowth":{"avg":0,"std":0, "lst":[]},
        "opexGrowth":{"avg":0,"std":0, "lst":[]},
        "changeWCRatio":{"avg":0,"std":0, "lst":[]},
        "netCapexRatio":{"avg":0,"std":0, "lst":[]},
        "daRatio":{"avg":0,"std":0, "lst":[]},
        "taxRate":{"avg":0,"std":0, "lst":[]},
    };
    
    for(const key of Object.keys(arr)){
        for (let i = 0; i < 4; i++){
            if(data[i][key] !== undefined){
                arr[key]["lst"].push(data[i][key]);
            }
        }
        arr[key]["avg"] = getAverage(arr[key]["lst"]);
        arr[key]["std"] = getSTD(arr[key]["lst"], arr[key]["avg"]);
    }

    return arr;
}

function calculateWACC(data, ufcf){
    const debt = data["balanceSheet"][0]["shortLongTermDebt"] + data["balanceSheet"][0]["longTermDebt"];
    const final_debt = debt === 0 ? 1 : debt;

    const equity = data["WACCData"]["mktcap"];
    const beta = data["WACCData"]["beta"];

    const re = RFRATE + beta * (MKTRETURN - RFRATE);
    const rd = data["incomeStatement"][0]["interestExpense"] / final_debt * -1; 
    const tax = ufcf["taxRate"]["avg"];
    return (equity)/(debt + equity) * re + (debt)/(debt + equity) * rd * (1 - tax);
}

export async function calculateMetrics(ticker){
    const DATA = await getFinancials(ticker);
    if(DATA === "Ticker info not complete"){
        return DATA;
    }

    try{
        const UFCF = ufcfMetrics(DATA);
        const UFCF_STATS = getUFCFStats(UFCF);
        const WACC = calculateWACC(DATA, UFCF_STATS);
        return {DATA, UFCF_STATS, WACC};
    }
    catch{
        return "Ticker info not complete";
    }
}