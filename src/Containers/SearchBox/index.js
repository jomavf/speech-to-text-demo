import React, { useState, useEffect, useRef } from 'react';

import './index.css'
import microphoneSvg from '../../images/microphone.svg'

const SearchBox = (props) => {
    // Logica
    const [loading, setLoading] = useState(false);
    const [listening, setListening] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [recorder, setRecorder] = useState(null);
    const [audioContext, setAudioContext] = useState(null);
    // Estilos
    const searchBtnRef = useRef(null);
    const searchRef = useRef(null);
    const tipRef = useRef(null);

    let i = 0;
    let speed =  100;
    let message = props.message || 'Escuchando...';

    let searchBtn = null;
    let search = null;
    let tip = null;

    function typeWriter() {
        let msg = ''
        if(i< message.length){   
            msg = search.getAttribute('placeholder') + message.charAt(i);
            search.setAttribute('placeholder',msg);
            i+=1;
            setTimeout(typeWriter, speed);
        }
    };

    function addStyle(){
        searchBtn = searchBtnRef.current;
        search = searchRef.current;
        tip = tipRef.current;
        
        tip.style.visibility = 'visible';
        tip.style.opacity = '1';
        search.style.cursor = 'text';
        typeWriter();
        searchBtn.classList.toggle('img_listening');
    }

    async function clickHandler () {
        debugger
        console.log('Ejecutando el click')
        addStyle();
        console.log('Listening 1',listening)
        setListening(!listening);
        console.log('Listening 2',listening)
        await handleListen();
    };

    async function handleListen() {
        // let waitPlease = document.getElementById('waitPlease')
        if(audioContext === 'suspended') {
            await audioContext.resume()
            console.log('AudioContext en handleListen',audioContext.state)
        }
        if(listening){
            recorder && recorder.record()
        } else {
            // waitPlease.play()
            recorder.stop()
            await createDownloadLink()
            recorder.clear();
        }
    }

    let createDownloadLink = async () => {
        // let sucessAud = document.getElementById('resultSuccess')
        // let errorAud = document.getElementById('errorFail')
        // let waitPlease = document.getElementById('waitPlease')

        setLoading(true);
        await recorder.exportWAV(async blob => {
            let result = new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            })
            try {
                let audio = await result
                let b64 = audio.split(",")[1]
                let body = { data: b64 }
                let response = await fetch('https://rest-speech-to-text.herokuapp.com/',{
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify(body)
                })
                let data = await response.json();
                console.log('data',data)
                setLoading(false);
                // waitPlease.pause()
                // if(data.result === ''){
                //     errorAud.play();    
                // } else {
                //     sucessAud.play();
                // }
            } catch (error) {
                // errorAud.play()
                console.log(error)
            }
        })
    }

    //Logica funciones

    async function init(){
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
            window.URL = window.URL || window.webkitURL;
            let audioContext = new AudioContext();
            setAudioContext(audioContext);
            let stream = await navigator.mediaDevices.getUserMedia({audio: true});
            let input = audioContext.createMediaStreamSource(stream);
            let recorder = new window.Recorder(input);
            setRecorder(recorder);
        } catch (err) {
            console.error(err);
            alert('No hay soporte de audio en este navegador!');
        }
    }

    useEffect(()=>{
        (async function(){
            await init();
            console.log('Listening',listening)
            // audioContext && (audioContext.state === 'suspended') && audioContext.resume() && console.log('resuming')
        })();
    },[])

    // Renderizado
    return (
        <div className="search">
            <div className="search__contain">
                <div className='search__icon' onClick={clickHandler}>
                    <img ref={searchBtnRef} className="" src={props.icon || microphoneSvg} alt="search button"/>
                </div>
                <input ref={searchRef} className="search__input" type="text" placeholder=""/>
            </div>
            <p className="search__tip" ref={tipRef}>{props.tip || "Presione el botón para hablar y vuelva a presionarlo para buscar"}</p>
        </div>
    )
};

export default SearchBox;