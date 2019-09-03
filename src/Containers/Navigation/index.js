import React, { Component } from 'react'
import './index.css'
import SearchBar from '../../Components/SearchBar'

export default class Navigation extends Component {
    render(){
        return (
            <header>
                <nav>
                    <h3 className="logo">Demo</h3>
                    <SearchBar></SearchBar>
                </nav>
            </header>
        )
    }
}