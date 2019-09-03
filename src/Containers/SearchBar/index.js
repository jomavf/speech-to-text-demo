import './index.css'
import microphone from './microphone.png'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../redux/actions'

class SearchBar extends Component {
    constructor(){
        super()
        this.state = {
            listening: false,
            recorder: null,
            audio_context: null
        }
    }

    init(){
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
            window.URL = window.URL || window.webkitURL
            let audio_context = new AudioContext()
            this.setState({ audio_context })
        } catch (err) {
            console.error(err.name,err.message,err)
            alert('No hay soporte de audio web en este navegador!!')
        }
        navigator.mediaDevices.getUserMedia({audio: true})
        .then( stream => {
            let input = this.state.audio_context.createMediaStreamSource(stream)
            let recorder = new window.Recorder(input)
            this.setState({ recorder })
        })
        .catch( err => console.log(err))
    }

    componentDidMount = () => {
        this.init() 
    }

    toggleListen = () => {
        this.setState({
            listening: !this.state.listening
        }, this.handleListen)
    }

    handleListen = async () => {
        let { recorder } = this.state
        if(this.state.listening){
            recorder && recorder.record()
        } else {
            recorder && recorder.stop()
            this.createDownloadLink()
            recorder && recorder.clear();
        }
    }

    createDownloadLink = () => {
        this.props.setLoadingFilterTextAction(true)
        let { recorder } = this.state
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
                this.props.setFilterTextAction(data.result)
                this.props.setLoadingFilterTextAction(false)
            })
        })
    }

    render(){
        let { listening } = this.state
        let searchBoxBtnListening = listening ? 'search-box__btn-listening' : 'search-box__btn'
        return (
            <div className="search-box">
                <button className={searchBoxBtnListening} onClick={this.toggleListen}>
                    <img src={microphone} height="50%" width="50%" alt="microphone-img"/>
                </button>
                <input className="search-box__txt" type="text" placeholder="Empieza a buscar" value={this.props.searchBar.filterText}/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        searchBar: state.searchBar
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setFilterTextAction(filterText){
            dispatch(actions.setFilterTextAction(filterText))
        },
        setLoadingFilterTextAction(payload){
            dispatch(actions.setLoadingFilterTextAction(payload))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar)