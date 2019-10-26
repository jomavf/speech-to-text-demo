import React, {createRef, useState, useEffect} from 'react'
import firebase from '../../firebase'
import './index.css'

export default function UploadVideo(){
    let fileInput = createRef();
    let nameInput = createRef();
    let [files,setFiles] = useState(null)
    let [filename, setFilename] = useState('')
    let [message,setMessage] = useState('')
    let [loading, setLoading] = useState(false)
    let [videoName, setVideoName] = useState('')

    function onPickFile(){
        fileInput.current.click()
    }

    async function onUploadFirebase(){
        setLoading(true)
        try {
            await firebase.storage().ref(`dataset/ByMe/${videoName || filename}`).put(files[0])
            setMessage('Archivo subido al servidor de archivos correctamente')
        } catch (error) {
            setMessage('Ocurrio un error, por favor intenta denuevo')
        }
        setLoading(false)
        setFilename('')
        setFiles(null)
    }

    function onChangeName(event){
        setVideoName(`${event.target.value}${filename.slice(filename.lastIndexOf('.'))}`)
    }

    function onFilePicked(event){
        setFiles(event.target.files)
        setFilename(event.target.files[0].name)
    }

    return (
        <div className="upload-video">
            <h1>Subir video</h1>
            <div className="upload-video__input">
                <div className="upload-video__input-details">
                    <button className="upload-video__button" onClick={onPickFile}> Elegir Video </button>
                    <p>{videoName || filename}</p>
                </div>
                <input type="text" ref={nameInput} onChange={onChangeName} placeholder="Nombre de video"/>
            </div>
            <div className="upload-video__firebase">
                <button className="upload-video__button" onClick={onUploadFirebase}> Subir video </button>
                <p>{message}</p>
            </div>
            { loading ? "Subiendo video..." : ""}
            <input type="file" ref={fileInput} onChange={onFilePicked} style={{display: "none"}}/>
        </div>
    );
}