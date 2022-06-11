import {randomNorm, randomUnif, randomTri}  from "./random.js";

const NUMSIM = 1;

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

const test = {
    "FINANCIALS":{
        "cogs":476659000,
        "revenue":518698000,
        "operatingExpense":32513000
    },
    "PROJECTIONS":{
        "Revenue Growth %":{
            "mean":5,
            "std":2,
            "dist":"Triangular"
        },
        "Delta NWC Rev Ratio %":{
            "mean":4.8,
            "std":2.1,
            "dist":"Normal"
        },
        "COGS Growth %":{
            "mean":4.7,
            "std":3,
            "dist":"Normal"
        },
        "DA Rev Ratio %":{
            "mean":5.2,
            "std":7.5,
            "dist":"Uniform"
        },
        "Capex Rev Ratio %":{
            "mean":0.2,
            "std":0.6,
            "dist":"Normal"
        },
        "WACC %":{
            "mean":5.5,
            "std":0.3,
            "dist":"Uniform"
        },
        "Gordon Growth Rate %":{
            "mean":2,
            "std":0.3,
            "dist":"Uniform"
        },
        "Tax Rate %":{
            "mean":8.3,
            "std":0.3,
            "dist":"Uniform"
        },
        "OpEx Growth %":{
            "mean":5,
            "std":5,
            "dist":"Normal"
        }
    }
}

export default function simulate(data){
    let list = [];

    const year_zero = {...template};
    year_zero["revenue"] = data["FINANCIALS"]["revenue"];
    year_zero["cogs"] = data["FINANCIALS"]["cogs"];
    year_zero["opex"] = data["FINANCIALS"]["operatingExpense"];

    for(let i = 0; i < NUMSIM; i++){
        const projection = [year_zero];
        
        const wacc_data = data["PROJECTIONS"]["WACC %"];
        const wacc = ref[wacc_data["dist"]](wacc_data["mean"], wacc_data["std"])/100;

        const tax = data["PROJECTIONS"]["Tax Rate %"]["mean"]/100;
        const ggr = data["PROJECTIONS"]["Gordon Growth Rate %"]["mean"]/100;

        const ufcf = [];
        
        for(let year = 1; year <= 5; year++){
            const year_data = {...template};

            const revG_data = data["PROJECTIONS"]["Revenue Growth %"];
            const revG = ref[revG_data["dist"]](revG_data["mean"], revG_data["std"])/100;
            year_data["revenue"] = projection[year - 1]["revenue"] * (1 + revG);

            const cogsG_data = data["PROJECTIONS"]["COGS Growth %"];
            const cogsG = ref[cogsG_data["dist"]](cogsG_data ["mean"], cogsG_data["std"])/100;
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
            console.log(cashFlow);
            projection.push(year_data);
            ufcf.push(cashFlow);
        }
    }
    return list;
}

simulate(test);