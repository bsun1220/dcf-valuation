
/*
import yahooFinance from "yahoo-finance2";

const symbol = 'AAPL';
const queryOptions = { modules: ['balanceSheetHistory'] };
const result = await yahooFinance.quoteSummary(symbol, queryOptions);

console.log(result);
*/

import {getFinancials} from "./yahoo-calls.js";

console.log(await getFinancials("crox"));