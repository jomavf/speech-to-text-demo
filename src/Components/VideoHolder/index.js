import './index.css'
import React from 'react'

const VideoHolder = (props) => {
    return (
        <div className="video-holder" onClick={props.onClickHandler}>
            <video width="100%" height="100%" className="video-holder__video" src= {props.url}/>
            <p className="video-holder__text">{props.title}</p>
        </div>
    )
}

export default VideoHolder