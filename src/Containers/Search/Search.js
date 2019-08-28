import React, { Component } from 'react';

//  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
// const recognition = new window.SpeechRecognition() // why I have to put window here? react? 

// recognition.continous = true
// recognition.interimResults = true // as I am spaeking is populating if we set this to false we have to stop speaking before seeing the results
// recognition.lang = "es"

let recorder
let audio_context

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
      recorder = new Recorder(input)
  })
  .catch( err => console.log(err))
}

class Search extends Component {
  constructor(props){
    super(props)
    this.state = {
      listening: false,
      final: ""
    }
  }
  
  handleListen = () => {
    // if (this.state.listening){
    //   recognition.start()
    //   // recognition.onend = () => {
    //   //   console.log("...continue listening...")
    //   //   recognition.start()
    //   // }
    // } else {
    //   this.setState({
    //     final:""
    //   })
    //   recognition.stop()
    //   recognition.onend = () => {
    //     console.log("Stopped listening per click")
    //   }
    // }
    // recognition.onend = () => {
    //   console.log("Stopped listening per click")
    //   this.setState({
    //     listening: !this.state.listening
    //   })
    // }

    // recognition.onstart = () => {
    //   console.log("Listening!")
    // }

    // let finalTranscript = ''
    // recognition.onresult = event => {
    //   let interimTranscript = ''

    //   for (let i = event.resultIndex; i < event.results.length; i++) {
    //     const transcript = event.results[i][0].transcript;
    //     if (event.results[i].isFinal) finalTranscript += transcript + ' ';
    //     else interimTranscript += transcript;
    //   }

    //   this.setState({final: finalTranscript})
    // }
    if(this.state.listening){
      recorder && recorder.record()
    } else {
      recorder && recorder.stop()
      createDownloadLink()
      recorder && recorder.clear();
    }
  }

  toBase64 = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
  });

  async createDownloadLink() {
      recorder && await recorder.exportWAV(async function (blob){
          let url = URL.createObjectURL(blob)
          console.log("blob", blob)
          console.log("url", url)
          audio.controls = true
          audio.src = url
          let result = await toBase64(blob)
          let b64 = result.split(",")[1]
          let body = { data: b64 }
          console.log(JSON.stringify(body))
          let response = await fetch('http://localhost:8000/',{
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(body)
          })
          console.log("response",response)
          let data = await response.json()
          console.log(data.result)
          text.textContent = data.result

      })
  }

  toggleListen = () => {
    this.setState({
      listening: !this.state.listening
    }, this.handleListen)
    console.log("Here", this.state.listening)
  }


  render(){
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <button id="microphone-btn" onClick={this.toggleListen}>Empezar a escuchar</button>
          <span>{ this.state.final }</span>
        </header>
      </div>
    );
  }
}

export default Search;
