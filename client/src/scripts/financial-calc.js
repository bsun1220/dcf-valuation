import {getFinancials} from "./yahoo-calls.js";


const RFRATE = 0.0234;
const MKTRETURN = 0.07;

const calcGrowth = (df, index, content) => {
    const current = df["incomeStatement"][index][content];
    const prev = df["incomeStatement"][index + 1][content];
    return (current - prev)/prev;
}

function ufcfMetrics(data){

    let arr = [];

    for (let i = 0; i < 4; i++){
        arr[i] = {};
        arr[i]["year"] = data["incomeStatement"][i]["year"];

        if(i != 3){
            arr[i]["revenueGrowth"] = calcGrowth(data, i, "revenue");
            arr[i]["cogsGrowth"] = calcGrowth(data, i, "cogs");
            arr[i]["opexGrowth"] = calcGrowth(data, i, "operatingExpense");

            const currentWC = 
                    (data["balanceSheet"][i]["currentAsset"] - data["balanceSheet"][i]["cash"]) - 
                    (data["balanceSheet"][i]["currentLiabilities"] - data["balanceSheet"][i]["shortLongTermDebt"]);
            
            const prevWC = 
                (data["balanceSheet"][i+1]["currentAsset"] - data["balanceSheet"][i]["cash"]) - 
                (data["balanceSheet"][i+1]["currentLiabilities"] - data["balanceSheet"][i]["shortLongTermDebt"]);
            
            arr[i]["changeWCRatio"] = (currentWC - prevWC)/data["incomeStatement"][i]["revenue"];
            
        }


        arr[i]["netCapexRatio"] = 
                (-data["cashFlowStatement"][i]["capex"] + data["cashFlowStatement"][i]["depreciation"])
                /(data["incomeStatement"][i]["revenue"]);
        
        arr[i]["daRatio"] = data["cashFlowStatement"][i]["depreciation"]/data["incomeStatement"][i]["revenue"];

        arr[i]["taxRate"] = data["incomeStatement"][i]["taxExpense"]/data["incomeStatement"][i]["pretaxIncome"];
        arr[i]["netDebt"] = data["balanceSheet"][i]["shortLongTermDebt"] + data["balanceSheet"][i]["longTermDebt"] - data["balanceSheet"][i]["cash"];
    }

    return arr;

}

function getUFCFAverage(data){
    let arr = {
        "revenueGrowth":0,
        "cogsGrowth":0,
        "opexGrowth":0,
        "changeWCRatio":0,
        "taxRate":0,
        "netCapexRatio":0,
        "daRatio":0,
        "taxRate":0
    };

    for (let i = 0; i < 3; i++){
        arr["revenueGrowth"] += data[i]["revenueGrowth"]/3;
        arr["cogsGrowth"] += data[i]["cogsGrowth"]/3;
        arr["opexGrowth"] += data[i]["opexGrowth"]/3;
        arr["changeWCRatio"] += data[i]["changeWCRatio"]/3;
    }
    
    for(let i = 0; i < 4; i++){
        arr["netCapexRatio"] += data[i]["netCapexRatio"]/4;
        arr["daRatio"] += data[i]["daRatio"]/4;
        arr["taxRate"] += data[i]["taxRate"]/4;
    }
    return arr;
}

function calculateWACC(data, ufcf){
    const debt = data["balanceSheet"][0]["shortLongTermDebt"] + data["balanceSheet"][0]["longTermDebt"];
    const equity = data["WACCData"]["mktcap"];
    const beta = data["WACCData"]["beta"];

    const re = RFRATE + beta * (MKTRETURN - RFRATE);
    const rd = data["incomeStatement"][0]["interestExpense"] / debt * -1; 
    const tax = ufcf["taxRate"];

    return (equity)/(debt + equity) * re + (debt)/(debt + equity) * rd * (1 - tax);
}

async function calculateMetrics(ticker){
    const data = await getFinancials(ticker);

    const UFCF = ufcfMetrics(data);

    const avg = getUFCFAverage(UFCF);

    const WACC = calculateWACC(data, avg);
    return {UFCF, avg, WACC};
}

console.log(await calculateMetrics("crox"));
