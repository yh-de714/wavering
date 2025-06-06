import React, { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment} from '@react-three/drei'
import './App.css';
import './css/style.css'
import model_size from './utils'
import Ring from './components/Ring'
import Pendant from './components/Pendant'

function App() {
    const [diameter, setDiameter] = useState(11);
    const [type, _setType] = useState(1);
    const [complex, _setComplexity] = useState(0);
    const [chamfer, _setChamfer] = useState(10);
    const [thickness, _setThickness] = useState(1.2);
    const [animate, _setAnimate] = useState(false);
    const [materialType, _setMaterial] = useState(0);
    const [ringthickness, setRingThickness] = useState(1.2);
    const [ringchamfer, setRingChamfer] = useState(10);
    const [ringtype, setRingType] = useState(1);
    const [ringcomplex, setRingComplexity] = useState(0);    
    const [ringanimate, setRingAnimate] = useState(false);
    const [ringmaterialType, setRingMaterial] = useState(0);
    const [pendantthickness, setPendantThickness] = useState(1.2);
    const [pendantchamfer, setPendantChamfer] = useState(0);
    const [pendanttype, setPendantType] = useState(1);
    const [pendantcomplex, setPendantComplexity] = useState(0);
    const [pendantanimate, setPendantAnimate] = useState(false);
    const [pendantmaterialType, setPendantMaterial] = useState(0);
    const [tab, setTab] = useState(1);
    const camera = { position: [50, 10, 0], fov: 30 }
    const camera1 = { position: [0, 10, 5], fov: 80 }

    const setType = (type) =>{
        if(tab==1){
            setRingType(type)
            _setType(type)
        }
        else{
            setPendantType(type)
            _setType(type)
        }
    }

    const setComplexity = (complexity)=>{
        if(tab==1){
            setRingComplexity(complexity)
            _setComplexity(complexity)
        }
        else{
            setPendantComplexity(complexity)
            _setComplexity(complexity)
        }
    }

    const setChamfer = (value) =>{
        if(tab==1){
            setRingChamfer(value)
            _setChamfer(value)
        }
        else{
            setPendantChamfer(value)
            _setChamfer(value)
        }
    }

    const setThickness = (value) =>{
        if(tab==1){
            setRingThickness(value)
            _setThickness(value)
        }
        else{
            setPendantThickness(value)
            _setThickness(value)
        }
    }

    const setAnimate = (value)=>{
        if(tab==1){
            setRingAnimate(value)
            _setAnimate(value)
        }
        else{
            setPendantAnimate(value)
            _setAnimate(value)
        }
    }

    const setMaterial = (value) =>{
        if(tab==1){
            setRingMaterial(value)
            _setMaterial(value)
        }
        else{
            setPendantMaterial(value)
            _setMaterial(value)
        }
    }

    useEffect(()=>{
        if(tab==1){
            _setType(ringtype);
            _setChamfer(ringchamfer);
            _setComplexity(ringcomplex);
            _setThickness(ringthickness);
            _setMaterial(ringmaterialType);
        }
        else{
            _setType(pendanttype);
            _setChamfer(pendantchamfer);
            _setComplexity(pendantcomplex);
            _setThickness(pendantthickness);
            _setMaterial(pendantmaterialType);
        }
        _setAnimate(false);
        setRingAnimate(false);
        setPendantAnimate(false);
    },[tab])

    return (
        <>
        <header>
              <h1>Wave Form Jewelry</h1>
        </header>
            <div className="container">
                <div className="container-main">
                    <div className="input-container input-pc">
                        <div className="input-box">
                            <p className="input-title">タイプ</p>
                            <div className="input-type-container">
                                <div className={`input-type ${type==2 && "active"}`} onClick={()=>{setType(2)}}>
                                    <img src="/hard.png" alt="hard"/>
                                </div>
                                <div className={`input-type ${type==1 && "active"}`}  onClick={()=>{setType(1)}}>
                                    <img src="/normal.png" alt="normal"/>
                                </div>
                                <div className={`input-type ${type==0 && "active"}`}  onClick={()=>{setType(0)}}>
                                    <img src="/easy.png" alt="easy"/>
                                </div>
                            </div>
                        </div>
                        <div className="input-box">
                            <p className="input-title">細かさ</p>
                            <div className="input-type-container">
                                <div className={`input-type ${complex==0 && "active"}`} onClick={()=>{setComplexity(0)}}>
                                    <img src="/hard.png" alt="hard"/>
                                </div>
                                <div className={`input-type ${complex==1 && "active"}`} onClick={()=>{setComplexity(1)}}>
                                    <img src="/normal.png" alt="normal"/>
                                </div>
                                <div className={`input-type ${complex==2 && "active"}`} onClick={()=>{setComplexity(2)}}>
                                    <img src="/easy.png" alt="easy"/>
                                </div>
                            </div>
                        </div>
                        <div className="input-box">
                            <label htmlFor="chamfer" className="input-title">角度</label>
                            <input type="text" name="chamfer" id="chamfer" onChange={(e)=>{e.target.value > 10 ? setChamfer(10) : setChamfer(e.target.value)}} value={chamfer} />
                            <span>px</span>
                        </div>
                        <div className="input-box">
                            <label htmlFor="thickness" className="input-title">厚さ</label>
                            <input type="text" name="thickness" id="thickness" onChange={(e)=>{setThickness(e.target.value)}} value={thickness} />
                            <span>px</span>
                        </div>
                    </div>
                    <div className="canvas-container">
                        <Canvas style={{width:'400px', height:'400px', display:tab==1?"block":"none"}} camera={camera} >
                            <Suspense fallback={null}>
                                <OrbitControls minDistance={40} maxDistance ={100}/>
                                <Environment preset="warehouse" />
                                <Ring animate={ringanimate} diameter={diameter} thickness={ringthickness} type={ringtype} chamfer={ringchamfer} complex={ringcomplex} materialType={ringmaterialType} tab={tab}/>
                                <ambientLight intensity={0.5} />
                                <pointLight  brightness={1} color={"white"} position={[-300, 0, -150]}/>
                                <pointLight  brightness={1} color={"white"} position={[300, 0, 150]}/>
                                <pointLight  brightness={1} color={"white"} position={[0, 300, 150]}/>
                                <pointLight  brightness={1} color={"white"} position={[0, -300, -150]}/>
                            </Suspense>
                        </Canvas>
                        <Canvas style={{width:'400px', height:'50vh', display:tab==2?"block":"none"}} camera={camera1} >
                            <Suspense fallback={null}>
                                <OrbitControls minDistance={40} maxDistance ={100}/>
                                <Environment preset="city" />
                                <Pendant animate={pendantanimate} thickness={pendantthickness} type={pendanttype} chamfer={pendantchamfer} complex={pendantcomplex} materialType={pendantmaterialType} tab={tab}/>
                                <ambientLight intensity={1} />
                                <pointLight  brightness={1} color={"white"} position={[-300, 0, -150]}/>
                                <pointLight  brightness={1} color={"white"} position={[300, 0, 150]}/>
                                <pointLight  brightness={1} color={"white"} position={[0, 300, 150]}/>
                                <pointLight  brightness={1} color={"white"} position={[0, -300, -150]}/>
                            </Suspense>
                        </Canvas>
                    </div>
                    
                    <div className={`table-container ${tab==2 && "unvisible"}`}>
                        <table>
                            <tbody>
                                <tr>
                                    <td>号</td>
                                    <td>直径</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="table-container1">
                            <table>
                                <tbody>
                                    {model_size.map(item=>(
                                        <tr key={item.id} className={diameter===item.id ? "active":""} onClick={()=>{setDiameter(item.id)}}>
                                            <td>{item.id}</td>
                                            <td>{item.diameter}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
               
                <div className="btn-container">
                    <div className='btn-container-price'>
                        <p></p>
                    </div>
                    <div className='btn-container-main'>
                        <button id="playbutton" onClick={()=>{setAnimate(!animate)}} className={animate ? "stop" : "play"}><div></div></button>
                        {tab==1 && <button id="ringexportbutton" className="export ringexportbutton"><img src='/download.png' /></button>}
                        {tab==2 && <button id ="neckleexportbutton"  className="export neckleexportbutton"><img src='/download.png' /></button>}
                    </div>
                    <div className='btn-container-spec'>
                        <div className='btn-container-spec-tab'>
                            <div className={`${tab==1 && "active"}`} onClick={()=>{setTab(1)}}><img src='/ring.png' /></div>
                            <div className={`${tab==2 && "active"}`} onClick={()=>{setTab(2)}}><img src='/pendant.png' /></div>
                        </div>
                        <div className="input-container">
                            <div className="input-sp">
                                <div className='input-item'>
                                    <div className="input-box">
                                        <p className="input-title">タイプ</p>
                                        <div className="input-type-container">
                                            <div className={`input-type ${type==2 && "active"}`} onClick={()=>{setType(2)}}>
                                                <img src="/hard.png" alt="hard"/>
                                            </div>
                                            <div className={`input-type ${type==1 && "active"}`}  onClick={()=>{setType(1)}}>
                                                <img src="/normal.png" alt="normal"/>
                                            </div>
                                            <div className={`input-type ${type==0 && "active"}`}  onClick={()=>{setType(0)}}>
                                                <img src="/easy.png" alt="easy"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-box">
                                        <p className="input-title">細かさ</p>
                                        <div className="input-type-container">
                                            <div className={`input-type ${complex==0 && "active"}`} onClick={()=>{setComplexity(0)}}>
                                                <img src="/hard.png" alt="hard"/>
                                            </div>
                                            <div className={`input-type ${complex==1 && "active"}`} onClick={()=>{setComplexity(1)}}>
                                                <img src="/normal.png" alt="normal"/>
                                            </div>
                                            <div className={`input-type ${complex==2 && "active"}`} onClick={()=>{setComplexity(2)}}>
                                                <img src="/easy.png" alt="easy"/>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className='input-item'>
                                    <div className="input-box">
                                        <label htmlFor="chamfer" className="input-title">角度</label>
                                        <input type="text" name="chamfer" id="chamfer" onChange={(e)=>{e.target.value > 10 ? setChamfer(10) : setChamfer(e.target.value)}} value={chamfer}/>
                                        <span>px</span>
                                    </div>
                                    <div className="input-box">
                                        <label htmlFor="thickness" className="input-title">厚さ</label>
                                        <input type="text" name="thickness" id="thickness" onChange={(e)=>{setThickness(e.target.value)}} value={thickness}/>
                                        <span>px</span>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                       
                        <div className='btn-container-spec-material'>
                            <div onClick={()=>setMaterial(0)} className={`btn-container-spec-material-btn ${materialType==0?"current":""}`}>
                                <div><div></div></div>
                                <p>Platinum</p>
                            </div>
                            <div onClick={()=>setMaterial(1)} className={`btn-container-spec-material-btn ${materialType==1?"current":""}`}>
                                <div><div></div></div>
                                <p>18K Gold</p>
                            </div>
                            <div onClick={()=>setMaterial(2)} className={`btn-container-spec-material-btn ${materialType==2?"current":""}`}>
                                <div><div></div></div>
                                <p>10KPG</p>
                            </div>
                            <div onClick={()=>setMaterial(3)} className={`btn-container-spec-material-btn ${materialType==3?"current":""}`}>
                                <div><div></div></div>
                                <p>Sliver</p>
                            </div>
                            <div onClick={()=>setMaterial(4)} className={`btn-container-spec-material-btn ${materialType==4?"current":""}`}>
                                <div><div></div></div>
                                <p>14K Plate</p>
                            </div>
                            <div onClick={()=>setMaterial(5)} className={`btn-container-spec-material-btn ${materialType==5?"current":""}`}>
                                <div><div></div></div>
                                <p>10KPG Plate</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default App;