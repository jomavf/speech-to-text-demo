import React, { useState, useEffect, useRef } from 'react';
import './index.css'

const Home = () => {
    let [mediaRecorder,setMediaRecorder] = useState(null);
    let videoTag = useRef(null);
    let videoSaveTag = useRef(null);

    const constraintObj = {
        audio: false,
        video: {
            facingMode: 'user',
            width: { min: 640, ideal: 1280, max: 1920},
            height: { min: 480, ideal: 720, max: 1080},
        }
    }
    function getUserMedia() {
        let video = videoTag.current;
        navigator.mediaDevices.getUserMedia(constraintObj)
            .then((mediaStreamObject) => {
                if ('srcObject' in video){
                    video.srcObject = mediaStreamObject;
                } else {
                    video.src = URL.createObjectURL(mediaStreamObject);
                }

                video.onloadedmetadata = () => {
                    video.play();
                }

                mediaRecorder = new MediaRecorder(mediaStreamObject);
                let chunks = [];

                mediaRecorder.ondataavailable = (ev) => {
                    chunks.push(ev.data);
                }
                mediaRecorder.onstop = (ev) => {
                    let blob = new Blob(chunks, {'type': 'video/mp4'});
                    chunks=[]
                    let videoUrl = window.URL.createObjectURL(blob);
                    videoSaveTag.current.href = videoUrl;
                } 
            })
            .catch(err => console.error(err));
    }
    function onClickStart(){
        mediaRecorder.start()
    }
    function onClickStop(){
        if(mediaRecorder.state === 'recording'){
            mediaRecorder.stop()
        }else {
            alert('Presionar el boton "Grabar" primero.')
        }
    }
    useEffect(()=>{
        getUserMedia();
    })
    return (
        <div className="record">
            <span className="record__title">Grabación</span>
            <video className="record__video-player" ref={videoTag} autoPlay/>
            <div className="record__controls">
                <button onClick={onClickStart}>Grabar</button> 
                <button onClick={onClickStop} >Parar</button> 
                <a ref={videoSaveTag} download >Descargar</a> 
            </div>    
        </div>
    )
};

export default Home;