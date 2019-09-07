import React, { Component } from 'react'
import './index.css'
import { connect } from 'react-redux'
import VideoHolder from '../../Components/VideoHolder'
import actions from '../../redux/actions'
import firebase from '../../firebase'
import spinner from './spinner.svg'

console.log("Archivo Main")

class Main extends Component {
    constructor(props){
        super(props)
        this.state = {
            datasetReference: null
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

        // console.log(prefixesRef)

        let result = await Promise.all(prefixesRef)

        // console.log('result', result)

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

    render(){
        return (
            <div className="page">
                <p className="principal__label">Resultados</p>
                <section className="principal__list">
                    {
                        this.props.loadingFirebase ? <img className='spinner' src={spinner}/>  :
                        this.props.resultList
                        .filter(video => {
                            let title = video.title.toLocaleLowerCase()
                            let filterText = this.props.filterText.toLowerCase().trim()
                            let flag = title.includes(filterText)
                            return flag
                        })
                        .map((video, index) => {
                            return (
                                <VideoHolder key={index} url={video.url} title={video.title} onClickHandler={() => this.onClickList(video)}/>
                            )
                        })
                    }
                </section>
                <section className="principal__video">
                    <video className="principal__video_video" src={this.props.principalVideo} controls autoPlay />
                    <h2 className="principal__video_text">{this.props.principalTitle}</h2>
                </section>
            </div>
        )
    }
}

function mapStateToProps(state) {
    let { principalVideo, principalTitle, resultList, loadingFirebase } = state.principalPage
    let { filterText } = state.searchBar
    return {
        loadingFirebase,
        resultList,
        principalVideo,
        principalTitle,
        filterText,
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