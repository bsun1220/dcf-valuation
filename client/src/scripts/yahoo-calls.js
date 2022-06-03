/*
https://www.reddit.com/r/sheets/comments/ji52uk/yahoo_finance_api_url/
*/

import axios from "axios";


async function apiCall(ticker, modules, category){
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
    for (let i = 0; i < bs.length; i++){

        let shortLongTermDebt = 0; 
        try{ shortLongTermDebt = bs[i]["shortLongTermDebt"]["raw"]}
        catch(e){};

        let longTermDebt = 0;
        try{ longTermDebt = bs[i]["longTermDebt"]["raw"]}
        catch(e){};

        arr[i] = {
            "year":bs[i]["endDate"]["fmt"].substring(0,4),
            "cash": bs[i]["cash"]["raw"],
            "currentAsset": bs[i]["totalCurrentAssets"]["raw"],
            "currentLiabilities": bs[i]["totalCurrentLiabilities"]["raw"],
            shortLongTermDebt,
            longTermDebt
        }
    }

    return arr;
};

async function getCashFlowStatement(ticker){
    const cf = await apiCall(ticker, "cashflowStatementHistory", "cashflowStatements");
    let arr = [];
    for(let i = 0; i < cf.length; i++){

        arr[i] = {
            "year":cf[i]["endDate"]["fmt"].substring(0,4),
            "depreciation":cf[i]["depreciation"]["raw"],
            "capex":cf[i]["capitalExpenditures"]["raw"]
        }
    }
    return arr;
}

async function getIncomeStatement(ticker){
    const is = await apiCall(ticker, "incomeStatementHistory", "incomeStatementHistory");
    let arr = [];
    for(let i = 0; i < is.length; i++){
        arr[i] = {
            "year":is[i]["endDate"]["fmt"].substring(0,4),
            "revenue":is[i]["totalRevenue"]["raw"],
            "cogs":is[i]["costOfRevenue"]["raw"],
            "operatingExpense":is[i]["totalOperatingExpenses"]["raw"],
            "pretaxIncome":is[i]["incomeBeforeTax"]["raw"],
            "taxExpense":is[i]["incomeTaxExpense"]["raw"],
        }
    }
    return arr;
}

export async function getFinancials(ticker){
    try{
        const incomeStatement = await getIncomeStatement(ticker);
        const cashFlowStatement = await getCashFlowStatement(ticker);
        const balanceSheet = await getBalanceSheet(ticker);
        return {incomeStatement, cashFlowStatement, balanceSheet};
    }
    catch(e){
        return "Ticker not found";
    }

    
}


