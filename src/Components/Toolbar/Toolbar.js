import React from 'react'
import './Toolbar.css'

const toolbar = (props) => (
    <header className="toolbar">
        <nav className="toolbar__navigation">
            <div className="toolbar__logo"><a href="/">DEMO</a></div>
            <div className="spacer" />
            <div className="toolbar__navigation-items">
                <ul>
                    <li><a href="/">Product</a></li>
                    <li><a href="/">Users</a></li>
                </ul>
            </div>
        </nav>
    </header>
)

export default toolbar;