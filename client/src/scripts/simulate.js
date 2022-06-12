import {randomNorm, randomUnif, randomTri}  from "./random.js";

const NUMSIM = 100000;

const template = {
    "revenue":0,
    "cogs":0,
    "opex":0,
};

const ref = {
    "Normal":randomNorm,
    "Uniform":randomUnif,
    "Triangular":randomTri
};


export default function simulate(data){
    let list = [];

    const year_zero = {...template};
    year_zero["revenue"] = data["FINANCIALS"]["revenue"];
    year_zero["cogs"] = data["FINANCIALS"]["cogs"];
    year_zero["opex"] = data["FINANCIALS"]["operatingExpense"];

    const tax = data["PROJECTIONS"]["Tax Rate %"]["mean"]/100;
    const ggr = data["PROJECTIONS"]["Gordon Growth Rate %"]["mean"]/100;
    const netDebt = data["FINANCIALS"]["shortLongTermDebt"] + data["FINANCIALS"]["longTermDebt"] - data["FINANCIALS"]["cash"];

    for(let i = 0; i < NUMSIM; i++){
        const projection = [year_zero];
        
        const wacc_data = data["PROJECTIONS"]["WACC %"];
        const wacc = ref[wacc_data["dist"]](wacc_data["mean"], wacc_data["std"])/100;

        const ufcf = [];
        
        for(let year = 1; year <= 5; year++){
            const year_data = {...template};

            const revG_data = data["PROJECTIONS"]["Revenue Growth %"];
            const revG = ref[revG_data["dist"]](revG_data["mean"], revG_data["std"])/100;
            year_data["revenue"] = projection[year - 1]["revenue"] * (1 + revG);

            const cogsG_data = data["PROJECTIONS"]["COGS Growth %"];
            const cogsG = ref[cogsG_data["dist"]](cogsG_data["mean"], cogsG_data["std"])/100;
            year_data["cogs"] = projection[year - 1]["cogs"] * (1 + cogsG);
            
            const opexG_data = data["PROJECTIONS"]["OpEx Growth %"];
            const opexG = ref[opexG_data["dist"]](opexG_data["mean"], opexG_data["std"])/100;
            year_data["opex"] = projection[year - 1]["opex"] * (1 + opexG);

            const da_data = data["PROJECTIONS"]["DA Rev Ratio %"];
            const da = ref[da_data["dist"]](da_data["mean"], da_data["std"])/100 * year_data["revenue"];
            
            const capex_data = data["PROJECTIONS"]["Capex Rev Ratio %"];
            const capex = ref[capex_data["dist"]](capex_data["mean"], capex_data["std"])/100 * year_data["revenue"];

            const nwc_data = data["PROJECTIONS"]["Delta NWC Rev Ratio %"];
            const nwc = ref[nwc_data["dist"]](nwc_data["mean"], nwc_data["std"])/100 * year_data["revenue"];

            const cashFlow = 
                (year_data["revenue"] - year_data["cogs"] - year_data["opex"] - da) * (1 - tax) 
                + da - capex - nwc; 
            
            projection.push(year_data);
            ufcf.push(cashFlow);
        }

        const tv = (ufcf[4] * (1 + ggr) / (wacc - ggr))/Math.pow(1 + wacc, 5);
        for(let k = 0; k < 5; k++){
            ufcf[k] = ufcf[k]/Math.pow(1 + wacc, k + 1);
        }
        const pv = ufcf.reduce((a, b) => a + b, 0) + tv;
        const evPerShare = (pv - netDebt)/data["FINANCIALS"]["so"];
        list.push(evPerShare);
    }
    return list;
}


