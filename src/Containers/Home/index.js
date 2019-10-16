import React from 'react';

import './index.css'

const Home = () => {
    return (
        <div className="home__main">
            <h1>Sumarización de eventos en video consultados mediante el uso de speech recognition</h1>
            <div className="home__description">
                <h2>Descripción del proyecto</h2>
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Non repellat architecto odit voluptate, minima obcaecati nulla beatae accusantium earum dolorem accusamus quo consectetur quidem commodi, dolore eum! Voluptate, dignissimos eius!</p>
            </div>
            <hr/>
            <div className="home__content">
                <h2>Contenido</h2>
                <div className="home__content_card">
                    <div className="home__card">
                        <h3>Buscar</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta repellat nulla nam error non amet veritatis esse obcaecati optio consectetur.</p>
                    </div>
                    <div className="home__card">
                        <h3>Grabar</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta repellat nulla nam error non amet veritatis esse obcaecati optio consectetur.</p>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Home;