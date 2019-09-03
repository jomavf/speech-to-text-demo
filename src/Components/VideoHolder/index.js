import './index.css'
import React from 'react'

const VideoHolder = (props) => {
    // onClick={() => this.handleClick(video)}
    return (
        <div className="video-holder">
            <video width="100%" className="video-holder__video" src= {props.url}/>
            <p className="video-holder__text">{props.title}</p>
        </div>
    )
}

export default VideoHolder