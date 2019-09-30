import './index.css'
import './main.css'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import actions from '../../redux/actions'

import resultSuccessAudio from './audio/resultado-encontrado.mp3'
import errorAudio from './audio/error.mp3'
import waitPleaseAudio from './audio/espere-porfavor.mp3'

import microphoneSvg from '../../images/microphone.svg'
import rolling from '../../images/rolling.svg'



class SearchBar extends Component {
    constructor(props){
        super(props)

        this.searchBtn = null;
        this.search = null;
        this.tip = null;
        
        this.searchBtnRef = React.createRef();
        this.searchRef = React.createRef();
        this.tipRef = React.createRef();
        
        this.styleVar = {
            i: 0,
            speed: 100,
            message: 'Escuchando...',
            searchBtn: null,
            search: null,
            tip: null,
        }

        this.state = {
            listening: false,
            recorder: null,
            audioContext: null
        }
    }
    
    typeWriter = () => {
        let msg = ''
        if(this.styleVar.i< this.styleVar.message.length){   
            msg = this.search.getAttribute('placeholder') + this.styleVar.message.charAt(this.styleVar.i);
            this.search.setAttribute('placeholder',msg);
            this.styleVar.i +=1
            setTimeout(this.typeWriter, this.styleVar.speed);
        }
    };

    addStyle= () => {
        this.searchBtn = this.searchBtnRef.current;
        this.search = this.searchRef.current;
        this.tip = this.tipRef.current;
        
        this.tip.style.visibility = 'visible';
        this.tip.style.opacity = '1';
        this.search.style.cursor = 'text';
        this.typeWriter();
        this.searchBtn.classList.toggle('img_listening');
    }


    async init(){
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
            window.URL = window.URL || window.webkitURL
            let audioContext = new AudioContext()

            this.setState({ audioContext })
            } catch (err) {
            console.error(err.name,err.message,err)
            alert('No hay soporte de audio web en este navegador!!')
        }
        let stream = await navigator.mediaDevices.getUserMedia({audio: true})
        console.log('ESTADO audio-context',this.state.audioContext.state)
        let input = this.state.audioContext.createMediaStreamSource(stream)
        let recorder = new window.Recorder(input)
        this.setState({ recorder })
    }

    componentDidUpdate = async () => {
        if(this.state.audioContext.state === 'suspended'){
            await this.state.audioContext.resume()
        }
    }

    componentDidMount = async () => {
        await this.init() 
    }

    toggleListen = () => {
        this.setState({
            listening: !this.state.listening
        }, this.handleListen)
    }

    handleListen = async () => {
        this.addStyle()
        let waitPlease = document.getElementById('waitPlease')
        if(this.state.audioContext.state === 'suspended') {
            await this.state.audioContext.resume()
            console.log('Ahora esta',this.state.audioContext.state)
            // this.setState({ audioContext })
        }
        let { recorder } = this.state
        if(this.state.listening){
            console.log('Entre al if')
            recorder.record()
        } else {
            console.log('Al else')
            waitPlease.play()
            recorder.stop()
            this.createDownloadLink()
            recorder.clear();
        }
    }

    createDownloadLink = async() => {
        let sucessAud = document.getElementById('resultSuccess')
        let errorAud = document.getElementById('errorFail')
        let waitPlease = document.getElementById('waitPlease')

        this.props.setLoadingFilterTextAction(true)
        let { recorder } = this.state
        await recorder.exportWAV(async blob => {
            console.log('blob',blob)
            let result = new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            })
            try {
                let audio = await result
                console.log(audio)
                let b64 = audio.split(",")[1]
                let body = { data: b64 }
                let response = await fetch('https://rest-speech-to-text.herokuapp.com/',{
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify(body)
                })
                let data = await response.json()
                console.log(audio)
                console.log(data.result)
                this.props.setFilterTextAction(data.result)
                this.props.setLoadingFilterTextAction(false)
                waitPlease.pause()
                if(data.result === ''){
                    errorAud.play();    
                } else {
                    sucessAud.play();
                }
            } catch (error) {
                errorAud.play()
                console.log(error)
            }
        })
    }

    onChangeHandler = (event) => {
        this.props.setFilterTextAction(event.target.value)
    }

    render(){
        let { listening } = this.state
        let searchBoxBtnListening = listening ? 'search-box__btn-listening' : 'search-box__btn'
        return (
            // <div className="search-box">
            //     <button className={searchBoxBtnListening} onClick={this.toggleListen}>
            //         {!this.props.searchBar.loading ? <img src={microphone} height="50%" width="50%" alt="microphone-img"/> :
            //         <img src={rolling} height="50%" width="50%" alt="rolling"/>}
            //     </button>
            //     <input className="search-box__txt" type="text" placeholder="Reproducir video de ..." value={this.props.searchBar.filterText} onChange={this.onChangeHandler}/>

            //     <audio id="waitPlease" style={{ diaplay: 'none'}} src={waitPleaseAudio}></audio>
            //     <audio id="resultSuccess" style={{ diaplay: 'none'}} src={resultSuccessAudio}></audio>
            //     <audio id="errorFail" style={{ diaplay: 'none'}} src={errorAudio}></audio>
            // </div>
            <div className="search">
                <div className="search__contain">
                    <div className='search__icon' onClick={this.toggleListen}>
                        {!this.props.searchBar.loading ? <img ref={this.searchBtnRef} className="" src={this.props.icon || microphoneSvg} alt="search button"/> :
                            <img ref={this.searchBtnRef} className="" src={rolling} alt="search button"/>}
                    </div>
                    <input ref={this.searchRef} className="search__input" type="text" placeholder="" onChange={this.onChangeHandler} value={this.props.searchBar.filterText}/>
                </div>
                <p className="search__tip" ref={this.tipRef}>{this.props.tip || "Presione el botón para hablar y vuelva a presionarlo para buscar"}</p>
                
                <audio id="waitPlease" style={{ diaplay: 'none'}} src={waitPleaseAudio}></audio>
                <audio id="resultSuccess" style={{ diaplay: 'none'}} src={resultSuccessAudio}></audio>
                <audio id="errorFail" style={{ diaplay: 'none'}} src={errorAudio}></audio>
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
        updateVideoListAction(payload){
            dispatch(actions.updateVideoListAction(payload))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar)