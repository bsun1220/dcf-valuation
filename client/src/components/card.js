import React, {useState} from "react";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./global.module.css";


export default function Info(props){
    const [selected, setSelected] = useState("Normal");
    const [mean, setMean] = useState(Math.max(Math.min(props.mean, 400),-100));
    const [std, setStd] = useState(Math.max(Math.min(props.std, 400),-100));
    
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

    return(
        <>
        <div className = {styles.card}>
            <h1>{props.metric}</h1>
            <hr id = {styles.cardbreak}></hr>
            <p>Distribution</p>
            <form className = {styles.metricForm}>
                <div>
                    <input type = "radio" name = "distribution" 
                        className = {styles.normal} value = "Normal" id = {"normal" +props.metric}
                        checked = {selected === "Normal"} onChange = {handleCheck}></input>
                    <label for = {"normal" +props.metric}>Normal</label>
                </div>
                <div>
                    <input type = "radio" name = "distribution" 
                        className = {styles.normal} value = "Uniform"  id = {"uni" +props.metric}
                        checked = {selected === "Uniform"} onChange = {handleCheck}></input>
                    <label for = {"uni" +props.metric}>Uniform</label>
                </div>
                <div>
                    <input type = "radio" name = "distribution" 
                        className = {styles.normal} value = "Triangular" id = {"tri" +props.metric}
                        checked = {selected === "Triangular"} onChange = {handleCheck}></input>
                    <label for = {"tri" +props.metric}>Triangular</label>
                </div>
            </form>
            
            <p>Mean</p>
            <form>
                <input type = "number" step = "0.1" 
                id = {styles.numinput} min = {-100} 
                max = {400}
                value = {mean}
                onChange = {handleMean}
                />
            </form>
            <p>Standard Deviation</p>
            <form>
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

        return(<>
            <div className = {styles.card}>
                <h1>{props.metric}</h1>
                <hr id = {styles.cardbreak}></hr>
                <p>Assumption</p>
                <form>
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