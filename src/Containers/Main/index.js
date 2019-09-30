import React, { Component } from 'react'

import './index.css'
import './main.css'

import { connect } from 'react-redux'
import actions from '../../redux/actions'
import firebase from '../../firebase'
import spinner from './spinner.svg'

import FilterText from '../FilterBar/index'
import rolling from '../../images/rolling.svg'

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
            return dataset.list({maxResults: 1})
        })

        let result = await Promise.all(prefixesRef)

        let items = result.map(element => element.items);

        let itemsResult = []
        items.forEach(item => {
            item.forEach(i => {
                itemsResult.push(i)
            })
        })

        let names = itemsResult.map(item => item.name)
        let urlsPromise = itemsResult.map(e => e.getDownloadURL())
        let urls = await Promise.all(urlsPromise)
        let resultVideos = urls.map( (url,index) => ({title: names[index], url}))
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

    render(){
        return (
            // <div className="page">
            //     <p className="principal__label">Resultados</p>
            //     <section className="principal__list">
            //         {
            //             this.props.loadingFirebase ? <img className='spinner' src={spinner} alt="spinner"/>  :
            //             this.props.resultList
            //             .filter(video => {
            //                 let title = video.title.toLocaleLowerCase()
            //                 let filterText = typeof this.props.filterText === 'string' && this.props.filterText.toLowerCase().trim()
            //                 let flag = title.includes(filterText)
            //                 return flag
            //             })
            //             .map((video, index) => {
            //                 return (
            //                     <VideoHolder key={index} url={video.url} title={video.title} onClickHandler={() => this.onClickList(video)}/>
            //                 )
            //             })
            //         }
            //     </section>
            //     <section className="principal__video">
            //         <video id="principalVideo" className="principal__video_video" src={this.props.principalVideo} controls />
            //         <h2 className="principal__video_text">{this.props.principalTitle}</h2>
            //         {this.props.principalVideo !== '' && <FilterText execFunc={this.applyLogic}></FilterText>}
            //     </section>
            // </div>
            <div className="principal__search">
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
                        {
                            this.props.loadingFirebase ? (<img className='spinner' src={rolling} alt="spinner"/>)  :
                            this.props.resultList
                                .filter(video => {
                                    let title = video.title.toLocaleLowerCase()
                                    let filterText = typeof this.props.filterText === 'string' && this.props.filterText.toLowerCase().trim()
                                    let flag = title.includes(filterText)
                                    return flag
                                })
                                .map((video, index) => {
                                    return (
                                        <div className="playlist__details__video" key={index} onClick={() => this.onClickList(video)}>
                                            <div className="playlist__details__video-content">
                                                <video src={video.url} />
                                                <h3>{video.title}</h3>
                                            </div>
                                            <div className="playlist__details__video-break-line"></div>
                                        </div>
                                    )
                                })
                        }
                        
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