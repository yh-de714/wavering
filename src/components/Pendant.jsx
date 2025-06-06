import React, { forwardRef, useEffect, useState } from 'react'
import { useGLTF} from '@react-three/drei'
import * as THREE from 'three';
import './../css/style.css'
import model_size from './../utils'
const exportSTL = require('threejs-export-stl');

const materialColors=["#E5E5E5","#ffe5a7", "#ffcab0", "#F1F1F1","#ffe5a7", "#ffcab0"]

const Pendant = forwardRef((props, ref) => {    
    const { nodes } = useGLTF('pendants.glb')
    console.log(nodes)
    const [randomness, setRandomness] = useState(Math.floor(Math.random() * 4) + 1);
    const [randomness1, setRandomness1] = useState(Math.random() * 4 + 1);
    const [randomness2, setRandomness2] = useState(Math.random() * 4 + 4);
    const [randomness3, setRandomness3] = useState(Math.random() * 4 + 6);
    const [materialType, setMaterialType] = useState(props.materialType)
    const [animation, setPlayanimation] = useState(false);
    const [thickness, setThickness] = useState(props.thickness);
    const [oldthickness, setOldThickness] = useState(1.2);
    const [type, setType] = useState(props.type);
    const [chamfer, setChamfer] = useState(props.chamfer);
    const [complexity, setComplexity] = useState(props.complex);
    const [t, setTime] = useState(0);
    const [increse, setIncrease] = useState(true);
    const [theta, setTheta] = useState(0);
    const geometry = nodes.pendant.geometry;
    const circle1 = nodes.circle2.geometry;
    const circle2 = nodes.circle3.geometry;
    
    let positions = geometry.attributes.position.array;
    let tempdelta = [];
    let tempolddelta = [];
    let __minx = 999, __maxx = 0;
    let __miny = 999, __maxy = 0;
    let __minz = 999, __maxz = 0;
    
    for(let i = 0; i < positions.length; i+=3)
    {
        if(positions[i] < __minx){ 
            __minx = positions[i]
        }
        if(positions[i] > __maxx){ 
            __maxx = positions[i]
        }
        if(positions[i + 1] < __miny){ 
            __miny = positions[i + 1]
        }
        if(positions[i + 1] > __maxy){ 
            __maxy = positions[i + 1]
        }
        if(positions[i + 2] < __minz){ 
            __minz = positions[i + 2]
        }
        if(positions[i + 2] > __maxz){ 
            __maxz = positions[i + 2]
        }

        tempdelta[i] = 0;
        tempdelta[i + 1] = 0;
        tempdelta[i + 2] = 0;
        tempolddelta[i] = 0;
        tempolddelta[i + 1] = 0;
        tempolddelta[i + 2] = 0;
    }
    const [maxX, setmaxX] = useState(__maxx)
    const [minX, setminX] = useState(__minx)
    const [maxY, setmaxY] = useState(__maxy)
    const [minY, setminY] = useState(__miny)
    const [maxZ, setmaxZ] = useState(__maxz)
    const [minZ, setminZ] = useState(__minz)
    
    const [deltaPositions, setDeltaPositions] = useState(tempdelta);
    const [olddeltaPositions, setOldDeltaPositions] = useState(tempolddelta);
    const [curvePositions, setCurvePositions] = useState(tempdelta);
    const [oldcurvePositions, setOldCurvePositions] = useState(tempolddelta);

    let exportbutton = document.getElementById("neckleexportbutton");
    if(exportbutton)
    {
        exportbutton.onclick = function(){
            let geometryconvert = new THREE.Geometry().fromBufferGeometry(geometry);
            let circle1geometry = new THREE.Geometry().fromBufferGeometry(circle1);
            let circle2geometry = new THREE.Geometry().fromBufferGeometry(circle2);
            let circle1mesh = new THREE.Mesh(circle1geometry);
            let circle2mesh = new THREE.Mesh(circle2geometry);
            geometryconvert.merge(circle1mesh.geometry, circle1mesh.matrix);
            geometryconvert.merge(circle2mesh.geometry, circle2mesh.matrix);
            const buffer = exportSTL.fromGeometry(geometryconvert);
            const blob = new Blob([buffer], { type: exportSTL.mimeType });
            var stlURL = window.URL.createObjectURL(blob);
            let tempLink = document.createElement('a');
            tempLink.href = stlURL;
            tempLink.setAttribute('download', 'pendant.stl');
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
                    setRandomness(Math.random() * 4 + 1);
                    setRandomness1(randomness1 + (Math.random() - 0.5) * 4);
                    setRandomness2(randomness2 + (Math.random() - 0.5) * 4);
                    setRandomness3(randomness3 + (Math.random() - 0.5) * 4);
                }
                setTime(t + 1)
                if(0 > 0.25 * theta && !increse){
                    setIncrease(true);
                }
                if(increse){
                    setTheta(theta + 1)
                }
                else{
                    setTheta(theta - 1);
                }

            }, 75);
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
                let deltaz
                let x  = positions[i]  / maxX * 2 * 3.1415 ;
            
                if(complexity===0)
                {
                    let k = Math.sqrt(Math.abs(theta)) * (type + 1) * .75;
                    let a = randomness;
                    let b = - 0.25 * t;
                    let d = maxY;
                    //f(x) = sin(x) * k / (1 + x ^ 2) * sin(a * x + b)
                    let fdot = Math.cos(x) * k / (1 + x * x) * Math.sin(a * x + b) - 2 * k * x / ((1 + x * x) *(1 + x * x)) * Math.sin(a * x + b) * Math.sin(x) + a * Math.sin(x) * k / (1 + x * x) * Math.cos(a * x + b);
                    let xdot = x + d * fdot / Math.sqrt(1 + fdot * fdot);
                    deltaz = Math.sin(x) * k / (1 + x * x) * Math.sin(a * x + b);
                    //deltaz = Math.sin(xdot) * k / (1 + xdot * xdot) * Math.sin(a * xdot + b) + d / Math.sqrt(1 + fdot * fdot) - d;
                }
                else if(complexity===1){
                    deltaz = Math.sin(x) *(Math.sqrt(Math.abs(theta)) * (type + 1) * .75  / (1 + x * x) * Math.sin(randomness1 * x - 0.25 * t) + Math.sqrt(Math.abs(theta)) * (type + 1) * 0.375  / (1 + x * x) * Math.sin(randomness2 * x + 0.25 * t));
                }
                else{
                    deltaz = Math.sin(x) * (Math.sqrt(Math.abs(theta)) * (type + 1) * .75  / (1 + x * x) * Math.sin(randomness1 * x - 0.25 * t) + Math.sqrt(Math.abs(theta)) * (type + 1) * 0.375   / (1 + x * x) * Math.sin(randomness2 * x + 0.25 * t) + Math.sqrt(Math.abs(theta)) * (type + 1) * 0.25   / (1 + x * x) * Math.sin(randomness3 * x - 0.25 * t));
                }
                // if(x < -2.5 || x > 2.5) deltaz = 0;
                newDeltapositions[i] = 0;
                newDeltapositions[i + 1] = 0
                newDeltapositions[i + 2] = deltaz;
            }
            setOldDeltaPositions(deltaPositions);
            setDeltaPositions(newDeltapositions);
            geometry.attributes.position.needsUpdate = true;
        }

    },[t, type, randomness, randomness1, randomness2, randomness3, complexity,theta, maxX, minX])

    useEffect(()=>{
        if(animation===true){
            let positions = geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i++) {
                positions[i] = positions[i] - olddeltaPositions[i] + deltaPositions[i];
            }
            geometry.attributes.position.needsUpdate = true;
        }
    },[deltaPositions])

    useEffect(()=>{
            let positions = geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i++) {
                positions[i] = positions[i] + curvePositions[i] -oldcurvePositions[i];
            }
            geometry.attributes.position.needsUpdate = true;
    },[curvePositions])

    useEffect(() => {
      
        setPlayanimation(props.animate);
        setType(props.type);
        setOldThickness(thickness);
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
        let newCurvepositions=[];
        for(let i = 0; i < positions.length; i+=3){
            
            let originx = positions[i] - deltaPositions[i];
            let originy = positions[i + 2] - deltaPositions[i + 2];
            let originz = positions[i + 1] - deltaPositions[i + 1];
            let curve = 0;
            if(maxX - originx > 0.05 && originx - minX > 0.05 && originz!=minY){
                let a = - 0.1 * chamfer / 49;
                let d = - minY;
                let b = minX / 7 * minX / 7 * chamfer * 0.1;
                let fdot = 2 * a * originx;
                let xdot = originx +  d * fdot / Math.sqrt(1 + fdot * fdot);
                curve = a * xdot * xdot + b + d / Math.sqrt(1 + fdot * fdot) - d ;
                // curve = Math.sqrt(minX * minX  - originx * originx) * (chamfer / (- minX));
                // curve = - originx / 5 * originx / 5 * chamfer * 0.1 + minX / 5 * minX / 5 * chamfer * 0.1
                // positions[i + 2] = positions[i + 2] + curve
                // positions[i + 2] = Math.sign(originy) * (Math.pow(1 - Math.abs(Math.pow(originz / maxY, (10 - chamfer + 2))), 1 / (10 - chamfer + 2)) - maxY / 2) + deltaPositions[i + 2];
            }
            newCurvepositions[i] = 0;
            newCurvepositions[i + 1] = 0
            newCurvepositions[i + 2] = curve;
        }
        setOldCurvePositions(curvePositions);
        setCurvePositions(newCurvepositions);
        geometry.attributes.position.needsUpdate = true;
    },[chamfer])

    useEffect(()=>{
        let positionsgeometry = geometry.attributes.position.array;
        let positionscircle1 = circle1.attributes.position.array;
        let positionscircle2 = circle2.attributes.position.array;
        for (let i = 0; i < positionsgeometry.length; i += 3) {
            let originheight = positionsgeometry[i + 1] - deltaPositions[i + 1]
            positionsgeometry[i + 1] = originheight * (thickness / oldthickness) + deltaPositions[i + 1];
        }
        for (let i = 0; i < positionscircle1.length; i += 3) {
            let originheight = positionscircle1[i + 1]
            positionscircle1[i + 1] = originheight * (thickness / oldthickness);
        }
        for (let i = 0; i < positionscircle2.length; i += 3) {
            let originheight = positionscircle2[i + 1];
            positionscircle2[i + 1] = originheight * (thickness / oldthickness);
        }
        geometry.attributes.position.needsUpdate = true;
        circle1.attributes.position.needsUpdate = true;
        circle2.attributes.position.needsUpdate = true;
    },[thickness])

    return <>
     <mesh ref={ref} args={[geometry]}>
     <meshStandardMaterial
         attach="material"
         color={materialColors[materialType]}
         transparent
         roughness={0.1}
         metalness={0.9}
     />
    </mesh>
    <mesh ref={ref} args={[circle1]} >
        <meshStandardMaterial
            attach="material"
            color={materialColors[materialType]}
            transparent
            roughness={0.1}
            metalness={0.85}
        />
   </mesh>
   <mesh ref={ref} args={[circle2]} >
        <meshStandardMaterial
            attach="material"
            color={materialColors[materialType]}
            transparent
            roughness={0.1}
            metalness={0.85}
        />
    </mesh>
    </>
})

export default Pendant;