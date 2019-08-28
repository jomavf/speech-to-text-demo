import React, { Component } from 'react';

import firebase from './firebase.js'

import Toolbar from './Components/ToolbarBootstrap/Toolbar'
import './App.css'
import microphone from './microphone.png'

var recorder
var audio_context

window.onload = function init(){
  try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
      window.URL = window.URL || window.webkitURL

      audio_context = new AudioContext()
  } catch (err) {
      console.error(err.name,err.message,err)
      alert('No hay soporte de audio web en este navegador!!')
  }

  navigator.mediaDevices.getUserMedia({audio: true})
  .then( stream => {
      let input = audio_context.createMediaStreamSource(stream)
      recorder = new window.Recorder(input)
  })
  .catch( err => console.log(err))
}

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      loading: false,
      listening: false,
      finalText: "",
      currentVideo: {},
      videos: [
        { 
          url:"https://firebasestorage.googleapis.com/v0/b/speech-to-text-6aea0.appspot.com/o/videos%2Fmochila%20chile.mp4?alt=media&token=8554cee9-edc8-40b0-9b0f-b4b2798d1ec1",
          title: "mochila chile",
        },
        { 
          url:"https://firebasestorage.googleapis.com/v0/b/speech-to-text-6aea0.appspot.com/o/videos%2Fdinero%20robado.mp4?alt=media&token=30245a2e-0d9c-4c5a-a8fa-ca8d3449b871",
          title: "chile",
        },
        { 
          url:"https://firebasestorage.googleapis.com/v0/b/speech-to-text-6aea0.appspot.com/o/videos%2Frobo%20en%20venezuela.mp4?alt=media&token=2d507d84-05da-4a3c-b709-cb9ce5897cd4",
          title: "robo chile",
        },
        { 
          url:"https://firebasestorage.googleapis.com/v0/b/speech-to-text-6aea0.appspot.com/o/videos%2Fmochila%20chile.mp4?alt=media&token=8554cee9-edc8-40b0-9b0f-b4b2798d1ec1",
          title: "mochila venezuela",
        },
        { 
          url:"https://firebasestorage.googleapis.com/v0/b/speech-to-text-6aea0.appspot.com/o/videos%2Fdinero%20robado.mp4?alt=media&token=30245a2e-0d9c-4c5a-a8fa-ca8d3449b871",
          title: "dinero venezuela",
        },
        { 
          url:"https://firebasestorage.googleapis.com/v0/b/speech-to-text-6aea0.appspot.com/o/videos%2Frobo%20en%20venezuela.mp4?alt=media&token=2d507d84-05da-4a3c-b709-cb9ce5897cd4",
          title: "robo venezuela",
        },
        { 
          url:"https://firebasestorage.googleapis.com/v0/b/speech-to-text-6aea0.appspot.com/o/videos%2Fmochila%20chile.mp4?alt=media&token=8554cee9-edc8-40b0-9b0f-b4b2798d1ec1",
          title: "mochila colombia",
        },
        { 
          url:"https://firebasestorage.googleapis.com/v0/b/speech-to-text-6aea0.appspot.com/o/videos%2Fdinero%20robado.mp4?alt=media&token=30245a2e-0d9c-4c5a-a8fa-ca8d3449b871",
          title: "dinero colombia",
        },
        { 
          url:"https://firebasestorage.googleapis.com/v0/b/speech-to-text-6aea0.appspot.com/o/videos%2Frobo%20en%20venezuela.mp4?alt=media&token=2d507d84-05da-4a3c-b709-cb9ce5897cd4",
          title: "robo colombia",
        },
      ]
    }
  }

  handleOnClickFirebase = async () => {
    let storage = firebase.storage()
    let pathReference = await storage.ref('videos').listAll();
    let urls = []
    pathReference.items.forEach( async (e) => {
      let url = await e.getDownloadURL()
      urls.push(url)
    })
    this.setState({videos: urls})
  }
  
  handleListen = async () => {
    if(this.state.listening){
      recorder && recorder.record()
    } else {
      recorder && recorder.stop()
      this.createDownloadLink()
      recorder && recorder.clear();
    }
  }

  createDownloadLink = () => {
      // var variable = "hola"
      // recorder && await recorder.exportWAV(async function (blob){
      //     let result = await new Promise((resolve, reject) => {
      //       const reader = new FileReader();
      //       reader.readAsDataURL(blob);
      //       reader.onload = () => resolve(reader.result);
      //       reader.onerror = error => reject(error);
      //     })
      //     let b64 = result.split(",")[1]
      //     let body = { data: b64 }
      //     let response = await fetch('http://localhost:8000/',{
      //         method: 'POST',
      //         headers: {
      //             'Content-Type': 'application/json',
      //         },
      //         body: JSON.stringify(body)
      //     })
      //     // console.log("response",response)
      //     let data = await response.json()
      //     console.log(data.result)
      //     console.log("Mi variable",variable)
      //     variable = data.result
      //     console.log("Mi variable",variable)
      //   })
      //   console.log("Mi variable fuera del contexto: ",variable)

      recorder.exportWAV(blob => {
          let result = new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
          })
          result.then(result => {
            let b64 = result.split(",")[1]
            let body = { data: b64 }
            return fetch('http://localhost:8000/',{
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify(body)
            })

          })
          .then(response => response.json())
          .then(data => {
            console.log(data.result)
            this.setState({ finalText: data.result})
          })
        })

      }

  toggleListen = () => {
    this.setState({
      listening: !this.state.listening
    }, this.handleListen)
  }

  handleOnChange = (event) => {
    this.setState({finalText: event.target.value})
  }

  handleClick = (video) => {
    this.setState({currentVideo: video})
  }

  render(){
    return (
      <div className="App">
        <Toolbar></Toolbar>
        <main className="container mt-5 text-white">
        {/* Boton para escuchar */}
        <div className="row input-group mb-3">
          <div className="input-group-prepend">
            <button className="btn btn-danger" type="button" onClick={this.toggleListen}><img src={microphone} height="20px"/></button>
          </div>
          <input type="text" className="form-control" placeholder="Búsqueda por voz" value={this.state.finalText.toLowerCase()} onChange={this.handleOnChange} aria-label="" aria-describedby="basic-addon1"/>
        </div>
        {/* <button className="btn btn-info m-1" onClick={this.handleOnClickFirebase}>Firebase download data</button> */}
        <div className="row">
          <div className="col-4"  >
            <div className="mt-3" style={{backgroundColor: "#343a40",borderRadius: "25px"}}>
              <h3 className="pb-2 pl-3 pt-4"><b>Resultados:</b></h3>
              {
                this.state.videos
                .filter(video => {
                  let title = video.title.toLocaleLowerCase()
                  let filterText = this.state.finalText.toLocaleLowerCase().trim()
                  let flag = title.includes(filterText)
                  return flag
                })
                .map( (video,index) => {
                  return (
                  <div className= "card pr-3 pl-3" key={index} onClick={() => this.handleClick(video)} style={{background: "transparent", border: "0px", cursor: "pointer"}}>
                    <video className = "card-img-top" src={video.url} width="80%" alt="Card image cap"/>
                      <p className="card-text pb-4">Descripción: { video.title }</p>
                  </div>
                  )
                })
              }
            </div>
          </div>
          <div className="col-8 d-flex flex-column justify-content-start pt-5 pl-5">
            <video className = "card-img-top" src={this.state.currentVideo.url} width="100%" height="400px" controls autoPlay style={{backgroundColor: "black"}}/>
            <h1 className="card-text"> { this.state.currentVideo.title }</h1>
          </div>
        </div>  
        </main>
      </div>
    );
  }
}

export default App;
