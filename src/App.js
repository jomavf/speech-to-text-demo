import React, { Component } from 'react';
import './App.css'

import Navigation from './Containers/Navigation'
import Main from './Containers/Main'
import SearchBar from './Containers/SearchBar'

console.log("Archivo App")

class App extends Component {
  constructor(props){
    console.log("Constructor App")
    super(props)
    this.state = {
    }
  }

  render(){
    return (
      <div className="principal">
        <Navigation/>
        <SearchBar/>
        <main>
          <Main/>
        </main>

          {/* Barra buscadora */}
          {/* <div className="row input-group mb-3">
            <div className="input-group-prepend">
              <button className="btn btn-danger" type="button" onClick={this.toggleListen}><img src={microphone} height="20px"/></button>
            </div>
            <input type="text" className="form-control" placeholder="Búsqueda por voz" value={this.state.finalText.toLowerCase()} onChange={this.handleOnChange} aria-label="" aria-describedby="basic-addon1"/>
          </div> */}

          {/* <button className="btn btn-info m-1" onClick={this.handleOnClickFirebase}>Firebase download data</button> */}


          {/* Lista y video principal */}
          {/* <div>
            <div>
              <div>
                <h3><b>Resultados:</b></h3>
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
            */}

      </div>
    );
  }
}

export default App;
