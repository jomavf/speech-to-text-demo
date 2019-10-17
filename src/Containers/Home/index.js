import React from 'react';

import './index.css'

const Home = () => {
    return (
        <div className="home__main">
            <h1>Sumarización de eventos en video consultados mediante el uso de speech recognition</h1>
            <div className="home__description">
                <h2>Descripción del proyecto</h2>
                <p>Esta aplicación web está enfocada al filtrado y reproducción de resúmenes de vídeos tomados de cámaras de vigilancia para facilitar la visualización de los eventos mas importantes, de esta forma los vecinos o dueños de las cámaras, tendrán conocimiento de lo ocurrido en un vídeo de poca duración y a su alcance en todo momento.</p>
            </div>
            <hr/>
            <div className="home__content">
                <h2>Funcionalidades</h2>
                <div className="home__content_card">
                    <div className="home__card">
                        <h3>Reproducción</h3>
                        <p>La aplicación cuenta con un reproductor de vídeos que permite la visualización de los resúmenes, además, brinda la posibilidad de descargar estos vídeos si es necesario.</p>
                    </div>
                    <div className="home__card">
                        <h3>Filtrado</h3>
                        <p>Para la búsqueda se cuenta con una barra superior que funciona mediante comandos de voz, se pulsa una vez el símbolo de micrófono y mediante el API de Google “Speech to text” se convierte el comando hablado a texto (ejem. "incendio”, “abuso”). Se necesita presionar nuevamente el símbolo de micrófono para realizar la búsqueda desea que será mostrada en un listado.</p>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Home;