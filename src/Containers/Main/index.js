import React, { Component } from 'react'
import './index.css'
import { connect } from 'react-redux'
import VideoHolder from '../../Components/VideoHolder'
import actions from '../../redux/actions'

console.log("Archivo Main")

class Main extends Component {
    constructor(props){
        console.log("Constructor Main")
        super(props)
        this.state = {
            listVideos: [
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
            ],
            filterText: "",
        }
    }

    onClickList = (video) => {
        this.props.setPrincipalVideoAction(video.url)
        this.props.setPrincipalTitleAction(video.title)
    }

    render(){
        return (
            <div className="page">
                <section className="principal__list">
                    {
                        this.state.listVideos
                        .filter(video => {
                            let title = video.title.toLocaleLowerCase()
                            let filterText = this.props.filterText.toLocaleLowerCase().trim()
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
                    <video src={this.props.principalVideo} width="100%" controls autoPlay/>
                    <h1>{this.props.principalTitle}</h1>
                </section>
            </div>
        )
    }
}

function mapStateToProps(state) {
    let { principalVideo, principalTitle } = state.principalPage
    let { filterText } = state.searchBar
    return {
        principalVideo,
        principalTitle,
        filterText
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
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Main)