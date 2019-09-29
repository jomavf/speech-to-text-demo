import React from 'react'
import logo from '../../images/upc.png'
import './index.css'

import { NavLink } from 'react-router-dom'

const NavBar = () => {
    let navLinks = React.createRef();

    function handleClick () {
        let navLinksElement = navLinks.current;
        let links = navLinksElement.querySelectorAll('li');

        navLinksElement.classList.toggle("open")
        links.forEach( link => link.classList.toggle("fade"));
    }

    return (
        <nav>
            <div class="logo">
                <img src={logo} alt="logito_upc" height="48px"/>
                <span>UPC</span>
            </div>
            <div class="hamburger" onClick={handleClick}>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
            </div>
            <ul class="nav-links" ref={navLinks}>
                <li><NavLink to="/home">Inicio</NavLink></li>
                <li><NavLink to="/search">Buscar</NavLink></li>
                <li><NavLink to="/record">Grabar</NavLink></li>
            </ul>
        </nav>
    )
}

export default NavBar;