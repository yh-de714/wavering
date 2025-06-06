import React, { forwardRef, useEffect, useState } from 'react'
import { useGLTF} from '@react-three/drei'
import * as THREE from 'three';
import './../css/style.css'
import model_size from './../utils'
const exportSTL = require('threejs-export-stl');

const materialColors=["#E5E5E5","#ffe5a7", "#ffcab0", "#F1F1F1","#ffe5a7", "#ffcab0"]

const Ring = forwardRef((props, ref) => {    
    const { nodes } = useGLTF('ringconvert.glb')
    const geometry = nodes.mesh_0.geometry;
    const [randomness, setRandomness] = useState(Math.floor(Math.random() * 8) + 1);
    const [randomness1, setRandomness1] = useState(Math.random() * 8 + 1);
    const [randomness2, setRandomness2] = useState(Math.random() * 8 + 10);
    const [randomness3, setRandomness3] = useState(Math.random() * 8 + 20);
    const [materialType, setMaterialType] = useState(props.materialType)
    const [animation, setPlayanimation] = useState(false);
    const [thickness, setThickness] = useState(props.thickness);
    const [oldthickness, setOldThickness] = useState(1.2);
    const [type, setType] = useState(props.type);
    const [diameter, setDiameter] = useState(props.diameter);
    const [olddiameter, setOldDiameter] = useState(11);
    const [chamfer, setChamfer] = useState(props.chamfer);
    const [complexity, setComplexity] = useState(props.complex);
    const [t, setTime] = useState(0);
    const [increse, setIncrease] = useState(true);
    const [theta, setTheta] = useState(0);
    
    let positions = geometry.attributes.position.array;
    let tempdelta = [];
    let tempolddelta = [];
    let outerradius = 0;
    let innerradius = 999;
    for(let i = 0; i < positions.length; i+=3)
    {
        let radius = Math.sqrt(positions[i] * positions[i] + positions[i + 2] * positions[i + 2])
        if(radius > outerradius){
            outerradius = radius;
        }
        if(radius < innerradius && radius > 4){
            innerradius = radius;
        }
        tempdelta[i] = 0;
        tempdelta[i + 1] = 0;
        tempdelta[i + 2] = 0;
        tempolddelta[i] = 0;
        tempolddelta[i + 1] = 0;
        tempolddelta[i + 2] = 0;
    }
    const[maxradius, setMaxRadius]=useState(outerradius);
    const[minradius, setMinRadius]=useState(innerradius);
    const [deltaPositions, setDeltaPositions] = useState(tempdelta);
    const [olddeltaPositions, setOldDeltaPositions] = useState(tempolddelta);
    let exportbutton = document.getElementById("ringexportbutton");
    if(exportbutton)
    {
        exportbutton.onclick = function(){
            let geometryconvert = new THREE.Geometry().fromBufferGeometry(geometry)
            const buffer = exportSTL.fromGeometry(geometryconvert);
            const blob = new Blob([buffer], { type: exportSTL.mimeType });
            var stlURL = window.URL.createObjectURL(blob);
            let tempLink = document.createElement('a');
            tempLink.href = stlURL;
            tempLink.setAttribute('download', 'ring.stl');
            tempLink.click();
        }
    }
  
    useEffect(() => {
        let timerID;
        if(animation===true)
        {
            timerID = setInterval(() => {
                if(4 * 3.141592 < 0.25 * theta && increse){
                    setIncrease(false);
                    setRandomness(Math.random() * 8 + 1);
                    setRandomness1(randomness1 + (Math.random() - 0.5) * 8);
                    setRandomness2(randomness2 + (Math.random() - 0.5) * 8);
                    setRandomness3(randomness3 + (Math.random() - 0.5) * 8);
                }
                if(0 > 0.25 * theta && !increse){
                    setIncrease(true);
                }
                if(increse){
                    setTheta(theta + 1)
                }
                else{
                    setTheta(theta - 1);
                }
                setTime(t + 1)
            }, 30);
            return () => {
                clearInterval(timerID);
            };
        }
        else{
            clearInterval(timerID);
            timerID = null; 
        }
    }, [t,animation]);


    useEffect(()=>{
        if(animation)
        {
            let newDeltapositions=[];
            let positions = geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                let deltay
                let x = Math.asin(positions[i + 2] / Math.sqrt(Math.pow(positions[i],2) + Math.pow(positions[i + 2],2)));
                if(positions[i] < 0 && positions[i + 2] > 0){
                    x = - x;
                }
                if(positions[i] < 0 && positions[i + 2] < 0){
                    x = - x;
                }
                if(positions[i] > 0 && positions[i + 2] < 0){
                    x = 3.141592 + x;
                }
                if(positions[i] > 0 && positions[i + 2] > 0){
                    x = -3.141592 + x;
                }
                if(complexity===0)
                {
                    deltay = Math.sqrt(Math.abs(theta)) * (type + 1) * 0.15 * (3.1415 - Math.abs(x)) * 0.5 / (1 + Math.abs(x)) * Math.sin(randomness * x - 0.25 * t);
                }
                else if(complexity===1){
                    deltay = Math.sqrt(Math.abs(theta)) * (type + 1) * 0.15 * (3.1415 - Math.abs(x)) * 0.5 / (1 + Math.abs(x)) * Math.cos(randomness1 * x - 0.25 * t) + Math.sqrt(Math.abs(theta)) * (type + 1) * 0.075 * (3.1415 - Math.abs(x)) * 0.5 / (1 + Math.abs(x)) * Math.cos(randomness2 * x + 0.25 * t);
                }
                else{
                    deltay = Math.sqrt(Math.abs(theta)) * (type + 1) * 0.15 * (3.1415 - Math.abs(x)) * 0.5 / (1 + Math.abs(x)) * Math.sin(randomness1 * x - 0.25 * t) + Math.sqrt(Math.abs(theta)) * (type + 1) * 0.075 * (3.1415 - Math.abs(x)) * 0.5 / (1 + Math.abs(x)) * Math.cos(randomness2 * x + 0.25 * t) + Math.sqrt(Math.abs(theta)) * (type + 1) * 0.05 * (3.1415 - Math.abs(x)) * 0.5 / (1 + Math.abs(x)) * Math.sin(randomness3 * x - 0.25 * t);
                }
                
                newDeltapositions[i] = 0;
                newDeltapositions[i + 1] = deltay
                newDeltapositions[i + 2] = 0;
            }
            setOldDeltaPositions(deltaPositions);
            setDeltaPositions(newDeltapositions);
            geometry.attributes.position.needsUpdate = true;
        }
    },[t])

    useEffect(()=>{
        if(animation===true){
            let positions = geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i++) {
                positions[i] = positions[i] - olddeltaPositions[i] + deltaPositions[i];
            }
            geometry.attributes.position.needsUpdate = true;
        }
    },[deltaPositions])
    
    useEffect(() => {     
        setPlayanimation(props.animate);
        setType(props.type);
        setOldThickness(thickness);
        setOldDiameter(diameter);
        setDiameter(props.diameter);
        setComplexity(props.complex);
        setMaterialType(props.materialType)
        if(!props.thickness || props.thickness <= 0){
            setThickness(0.5);
        }
        else{
            setThickness(props.thickness);
        }
        setChamfer(props.chamfer);
    },[props])

    useEffect(()=>{
        let tempdelta = [];
        let tempolddelta = [];
        let outerradius = 0;
        let innerradius = 999;
        let positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] = positions[i] * (parseFloat(model_size[diameter - 1].diameter) / parseFloat(model_size[olddiameter - 1].diameter));
            positions[i + 2] = positions[i + 2] * (parseFloat(model_size[diameter - 1].diameter) / parseFloat(model_size[olddiameter - 1].diameter));
            let radius = Math.sqrt(positions[i] * positions[i] + positions[i + 2] * positions[i + 2])
            if(radius > outerradius){
                outerradius = radius;
            }
            if(radius < innerradius && radius > 4){
                innerradius = radius;
            }
            tempdelta[i] = 0;
            tempdelta[i + 1] = 0;
            tempdelta[i + 2] = 0;
            tempolddelta[i] = 0;
            tempolddelta[i + 1] = 0;
            tempolddelta[i + 2] = 0;
        }
        setMaxRadius(outerradius);
        setMinRadius(innerradius);
        geometry.attributes.position.needsUpdate = true;
    },[diameter])

    useEffect(()=>{
        let positions = geometry.attributes.position.array;
        for(let i = 0; i < positions.length; i+=3){
            let originx = positions[i] - deltaPositions[i];
            let originy = positions[i + 2] - deltaPositions[i + 2];
            let originz = positions[i + 1] - deltaPositions[i + 1];
            let innerx = minradius * originx / Math.sqrt(Math.pow(originx, 2) + Math.pow(originy, 2));
            let innery = minradius * originy / Math.sqrt(Math.pow(originx, 2) + Math.pow(originy, 2));
            let length = Math.sqrt((originx - innerx) * (originx - innerx) + (originy-innery) * (originy - innery));
                if(Math.pow(length / (maxradius - minradius),10 - chamfer + 2) < 1){
                    positions[i + 1] = Math.sign(originz) * Math.pow(1 - Math.pow(length / (maxradius - minradius), 10 - chamfer  + 2),1 / (10 - chamfer + 2)) * (maxradius - minradius) * (thickness / 1.2) + deltaPositions[i + 1]
                }
        }
        geometry.attributes.position.needsUpdate = true;
    },[chamfer])

    useEffect(()=>{
        let positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            let originheight = positions[i + 1] - deltaPositions[i + 1]
            positions[i + 1] = originheight * (thickness / oldthickness) + deltaPositions[i + 1];
        }
        geometry.attributes.position.needsUpdate = true;
    },[thickness])

    return <mesh ref={ref} args={[geometry]}>
            <meshStandardMaterial
                attach="material"
                color={materialColors[materialType]}
                transparent
                roughness={0.1}
                metalness={0.7}
            />
           </mesh>
})

export default Ring;