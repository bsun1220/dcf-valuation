/*
https://www.reddit.com/r/sheets/comments/ji52uk/yahoo_finance_api_url/
*/

import axios from "axios";


export async function apiCall(ticker, modules, category){
    const url = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${ticker}`;
    const data = await axios
        .get(url, {params : {modules}})
        .then(response => {
            return response.data.quoteSummary.result[0][modules][category];
        })
        .catch(() => {
        });
    return data;
}

async function getBalanceSheet(ticker){
    const bs = await apiCall(ticker, "balanceSheetHistory", "balanceSheetStatements");
    let arr = [];
    for (let i = 0; i < 4; i++){

        let shortLongTermDebt = 0; 
        try{ shortLongTermDebt = bs[i]["shortLongTermDebt"]["raw"]}
        catch(e){};

        let longTermDebt = 0;
        try{ longTermDebt = bs[i]["longTermDebt"]["raw"]}
        catch(e){};

        let cash = 0;
        try{ cash = bs[i]["cash"]["raw"]}
        catch(e){};

        let currentAsset = 0;
        try{ currentAsset = bs[i]["totalCurrentAssets"]["raw"]}
        catch(e){};

        let currentLiabilities = 0;
        try{ currentLiabilities= bs[i]["totalCurrentLiabilities"]["raw"]}
        catch(e){};

        arr[i] = {
            cash,
            currentAsset,
            currentLiabilities,
            shortLongTermDebt,
            longTermDebt
        }
    }

    return arr;
};

async function getCashFlowStatement(ticker){
    const cf = await apiCall(ticker, "cashflowStatementHistory", "cashflowStatements");
    let arr = [];
    for(let i = 0; i < 4; i++){
        let depreciation = 0; 
        try{ depreciation = cf[i]["depreciation"]["raw"]}
        catch(e){};

        let capex = 0; 
        try{ capex = cf[i]["capitalExpenditures"]["raw"]}
        catch(e){};

        arr[i] = {
            depreciation,
            capex
        }
    }
    return arr;
}

async function getIncomeStatement(ticker){
    const is = await apiCall(ticker, "incomeStatementHistory", "incomeStatementHistory");
    let arr = [];
    for(let i = 0; i < 4; i++){
        arr[i] = {
            "year":is[i]["endDate"]["fmt"].substring(0,4),
            "revenue":is[i]["totalRevenue"]["raw"],
            "cogs":is[i]["costOfRevenue"]["raw"],
            "operatingExpense":is[i]["totalOperatingExpenses"]["raw"],
            "pretaxIncome":is[i]["incomeBeforeTax"]["raw"],
            "taxExpense":is[i]["incomeTaxExpense"]["raw"],
            "interestExpense":is[i]["interestExpense"]["raw"]
        }
        if(arr[i]["interestExpense"] === undefined){
            arr[i]["interestExpense"] = 0;
        }
    }
    return arr;
}

async function getWACCData(ticker){
    const beta = await apiCall(ticker, "defaultKeyStatistics","beta");
    let beta_value = 1;
    
    if(beta["raw"] !== undefined){
        beta_value = beta["raw"];
    }

    const mktcap = await apiCall(ticker, "price", "marketCap");

    let mkt_cap = 1;
    
    if(mktcap["raw"] !== undefined){
        mkt_cap = mktcap["raw"];
    }
    return {"beta":beta_value, "mktcap":mkt_cap};
}

export async function getFinancials(ticker){
    try{
        const incomeStatement = await getIncomeStatement(ticker);
        const cashFlowStatement = await getCashFlowStatement(ticker);
        const balanceSheet = await getBalanceSheet(ticker);
        const WACCData = await getWACCData(ticker);
        return {incomeStatement, cashFlowStatement, balanceSheet, WACCData};
    }
    catch(e){
        return "Ticker info not complete";
    }
    
}
