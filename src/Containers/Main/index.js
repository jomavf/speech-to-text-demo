import React, { Component } from 'react'

import './main.css'

import axios from 'axios'

import { connect } from 'react-redux'
import actions from '../../redux/actions'
import firebase from '../../firebase'

import FilterText from '../FilterBar/index'
import rolling from '../../images/rolling.svg'

import notFound from '../SearchBar/audio/no-resultados.mp3'

class Main extends Component {
    constructor(props){
        super(props)
        this.state = {
            datasetReference: null,
            valueFilterInput: ""
        }
    }

    onClickList = (video) => {
        this.props.setPrincipalVideoAction(video.url)
        this.props.setPrincipalTitleAction(video.title)
    }

    capitalize = (string) =>
      string[0] ? `${string[0].toUpperCase()}${string.substring(1)}` : '';

    contains = (list,word) => {
        let flag = false
        list.forEach(element => {
            if( element === word ){
                flag = true
            }
        })
        return flag
    }

    componentDidMount = async () => {
        // Establecer un loading para esta logica
        this.props.setLoadingFirebase(true)
        let storage = firebase.storage()
        let storageRef = storage.ref()
        let datasetReference = await storageRef.child(`dataset`)
        let datasetList = await datasetReference.listAll()
        let prefixes = datasetList.prefixes.map( prefix => prefix.name)

        let prefixesRef = prefixes.map(prefix => {
            let dataset = datasetReference.child(prefix)
            return dataset.list()
        })

        let result = await Promise.all(prefixesRef)

        let items = result.map(element => element.items);

        let itemsResult = []
        items.forEach(item => {
            item.forEach(i => {
                itemsResult.push(i)
            })
        })
        let parents = itemsResult.map(item => item.parent)
        let names = itemsResult.map(item => item.name)
        let urlsPromise = itemsResult.map(e => e.getDownloadURL())
        let urls = await Promise.all(urlsPromise)
        let resultVideos = urls.map( (url,index) => ({title: names[index], url, category: parents[index].name}))
        console.log('result', resultVideos)
        this.props.setResultListAction(resultVideos)
        this.props.setLoadingFirebase(false)
    }

    applyLogic = () => {
        /*
        Logica simple para filtrar un video por segundos
        El formato tiene que ser << %filter1inSeconds% to %filter2inSeconds% >>
        */
       
        //Funcion para validar si los argumentos de filtrado son correctos
        let principalVideo = document.getElementById('principalVideo') // Nativo por mejorar
        let valid = (arg) => {
           if(arg > 0 && arg < principalVideo.duration){
               return true;
           } else {
               return false;
           }
        }

        // Si existe algun valor en el filtro entonces proceder a recortar el video
        // let { valueFilterInput } = this.state
        let { filterTextVideo } = this.props
        

        if(filterTextVideo !== ''){
            let words = filterTextVideo.split(" ")

            let firstValue = valid(words[0]) ? words[0] : 0; 
            let secondValue = valid(words[2]) ? words[2] : principalVideo.duration;
            console.log(firstValue,'to',secondValue)

            principalVideo.currentTime = firstValue
            principalVideo.play()

            let durationFilter = Math.abs(secondValue - firstValue) * 1000 // ms

            console.log('durationFilter', durationFilter)
            
            if(!(secondValue > principalVideo.duration || Number(firstValue) >= Number(secondValue) || firstValue < 0)){
                setTimeout(() => {
                    principalVideo.pause()
                }, durationFilter);
            }else{
                console.log("Valores de filtro incorrectos");
                return;
            }
        } else {
            console.log("No existe valores para filtro!")
        }
    }

    show = () => {
        let notFound = document.getElementById('notFound')

        let resultList = this.props.resultList
                        .filter(video => {
                            let title = video.title.toLocaleLowerCase()
                            let filterText = typeof this.props.filterText === 'string' && this.props.filterText.toLowerCase().trim()
                            let flag = title.includes(filterText)
                            return flag
                        })
        let listaFiltrada = resultList                        
        let toShow = listaFiltrada.map((video, index) => {

                            return (
                                <div className="playlist__details__video" key={index}>
                                    <div className="playlist__details__video-content" onClick={() => this.onClickList(video)}>
                                            <video src={video.url} />
                                            <div className="playlist__details__video-content-description">
                                                <h3 className="playlist__details__video-titulo">{video.title}</h3>
                                                <p>{video.category}</p>
                                            </div>
                                    </div>
                                    {/* <a href={video.url} download onClick={(e) => this.linkOnClick(e,video.url)}><i className="fa fa-download" aria-hidden="true"></i></a> */}
                                    <div className="playlist__details__video-break-line"></div>
                                    
                                </div>
                            )
                        })
        if(this.props.filterText !== "" && toShow.length !== 0){
            this.props.setPrincipalVideoAction(listaFiltrada[0].url)
            this.props.setPrincipalTitleAction(listaFiltrada[0].title)
            // console.log("Umm", this.props.filterText, listaFiltrada)

        } else if(toShow.length === 0 && this.props.filterText !== "") {
                console.log(toShow.length)
                console.log(this.props.filterText)
                notFound && notFound.play()
        }
        return this.props.loadingFirebase ? (<img className='spinner' src={rolling} alt="spinner"/>)  : toShow
    }

    render(){
        return (
            <div className="principal__search">
                <audio id="notFound" style={{ display: 'none'}} src={notFound}></audio>
                <section className="video-player">
                    <div className="video-player-container">
                        <video id="principalVideo" src={this.props.principalVideo} controls autoPlay width="100%"></video>
                    </div>
                    <h2>{this.props.principalTitle}</h2>
                    {this.props.principalVideo !== '' && <FilterText execFunc={this.applyLogic}/>}
                </section>

                <section className="playlist">
                    <div className="playlist__info">
                    <span>Lista de videos obtenidos: </span>
                    </div>
                    <div className="playlist__details">
                        { this.show() }
                    </div>
                </section>

            </div>
        )
    }
}

function mapStateToProps(state) {
    let { principalVideo, principalTitle, resultList, loadingFirebase } = state.principalPage
    let { filterText } = state.searchBar
    let { filterTextVideo } = state.filterBar
    return {
        loadingFirebase,
        resultList,
        principalVideo,
        principalTitle,
        filterText,
        filterTextVideo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setPrincipalVideoAction(principalVideoUrl){
            dispatch(actions.setPrincipalVideoAction(principalVideoUrl))
        },
        setPrincipalTitleAction(principalTitle){
            dispatch(actions.setPrincipalTitleAction(principalTitle))
        },
        setResultListAction(resultList){
            dispatch(actions.setResultListAction(resultList))
        },
        setLoadingFirebase(payload){
            dispatch(actions.setLoadingFirebase(payload))
        },
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Main)