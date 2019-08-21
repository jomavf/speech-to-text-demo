import React, { Component } from 'react';

//  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
// const recognition = new window.SpeechRecognition() // why I have to put window here? react? 

// recognition.continous = true
// recognition.interimResults = true // as I am spaeking is populating if we set this to false we have to stop speaking before seeing the results
// recognition.lang = "es"

class Search extends Component {
  constructor(props){
    super(props)
    this.state = {
      listening: false,
      final: ""
    }
  }
  
  handleListen = () => {
    if (this.state.listening){
      recognition.start()
      // recognition.onend = () => {
      //   console.log("...continue listening...")
      //   recognition.start()
      // }
    } else {
      this.setState({
        final:""
      })
      recognition.stop()
      recognition.onend = () => {
        console.log("Stopped listening per click")
      }
    }
    recognition.onend = () => {
      console.log("Stopped listening per click")
      this.setState({
        listening: !this.state.listening
      })
    }

    recognition.onstart = () => {
      console.log("Listening!")
    }

    let finalTranscript = ''
    recognition.onresult = event => {
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + ' ';
        else interimTranscript += transcript;
      }

      this.setState({final: finalTranscript})
    }
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
