import React, {useState, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./global.module.css";


export default function Info(props){
    const [selected, setSelected] = useState("Normal");
    const [mean, setMean] = useState(Math.max(Math.min(props.mean, 400),-100));
    const [std, setStd] = useState(Math.max(Math.min(props.std, 400),-100));

    useEffect(()=>{
        props.setData((prev) => {
            const newMean = Math.max(Math.min(mean === "" ? 0 : mean, 400), -100);
            const newSTD = Math.max(Math.min(std === "" ? 0 : std, 400),-100);

            prev["PROJECTIONS"][props.metric] = {
                "mean":newMean,
                "std":newSTD,
                "dist":selected
            }
            return prev;
        })

    },[selected, mean, std, props])
    
    if(!props.no){

        const handleCheck = (e) => {
            setSelected(e.target.value);
        };

        const handleMean = (e) => {
            setMean(e.target.value);
        }

        const handleStd = (e) => {
            setStd(e.target.value);
        }

        const handleSubmit = (e) =>{
            e.preventDefault();
        }

        return(
            <>
            <div className = {styles.card}>
                <h1>{props.metric}</h1>
                <hr id = {styles.cardbreak}></hr>
                <p>Distribution</p>
                <form className = {styles.metricForm} onSubmit = {handleSubmit}>
                    <div>
                        <input type = "radio" name = "distribution" 
                            className = {styles.normal} value = "Normal" id = {"normal" +props.metric}
                            checked = {selected === "Normal"} onChange = {handleCheck}></input>
                        <label htmlFor = {"normal" +props.metric}>Normal</label>
                    </div>
                    <div>
                        <input type = "radio" name = "distribution" 
                            className = {styles.normal} value = "Uniform"  id = {"uni" +props.metric}
                            checked = {selected === "Uniform"} onChange = {handleCheck}></input>
                        <label htmlFor = {"uni" +props.metric}>Uniform</label>
                    </div>
                    <div>
                        <input type = "radio" name = "distribution" 
                            className = {styles.normal} value = "Triangular" id = {"tri" +props.metric}
                            checked = {selected === "Triangular"} onChange = {handleCheck}></input>
                        <label htmlFor = {"tri" +props.metric}>Triangular</label>
                    </div>
                </form>
                
                <p>Mean</p>
                <form onSubmit = {handleSubmit}>
                    <input type = "number" step = "0.1" 
                    id = {styles.numinput} min = {-100} 
                    max = {400}
                    value = {mean}
                    onChange = {handleMean}
                    />
                </form>
                <p>Standard Deviation</p>
                <form onSubmit = {handleSubmit}>
                    <input type = "number" step = "0.1" 
                    id = {styles.numinput} min = {-100} 
                    max = {400}
                    value = {std}
                    onChange = {handleStd}
                    />
                </form>
            </div>
            </>);
    }
    else{
        const handleAssumption = (e) => {
            setMean(e.target.value);
        }

        const handleSubmit = (e) =>{
            e.preventDefault();
        }

        return(<>
            <div className = {styles.card}>
                <h1>{props.metric}</h1>
                <hr id = {styles.cardbreak}></hr>
                <p>Assumption</p>
                <form onSubmit = {handleSubmit}>
                    <input type = "number" step = "0.1" 
                    id = {styles.numinput} min = {-100} 
                    max = {400}
                    value = {mean}
                    onChange = {handleAssumption}
                    />
                </form>
            </div>
            </>)
    }
    

}