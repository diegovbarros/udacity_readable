import React from 'react'
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom'


const propTypes = {
    project             : PropTypes.string.isRequired,
    description         : PropTypes.string.isRequired
}

const defaultProps = {
    project: 'Udacity - Leitura',
    description : 'Bem vindos ao Udacity Leitura, onde podemos discutir assuntos variados com uma gama enorme de pessoas'
}

/**
* @description 
* Componente que representa o header genérico da aplicação
*
* @constructor
* @param {String} project       Nome do projeto
* @param {String} description   Breve descrição da página
* @param {String} img           Path da imagem a ser mostrada no header
*/
function Head({project,description,img}) {
    return (
        <Link to="/">
            <div className="main-header">
                <div className="content-bg-wrap bg-group"></div>
                <div className="container">
                    <div className="row">
                        <div className="col col-lg-8 m-auto col-md-8 col-sm-12 col-12">
                            <div className="main-header-content">
                                <h1>{project}</h1>
                                <p>{description}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <img className="img-bottom" src={img} alt="Blog"/>
            </div>
        </Link>
    )
}

Head.propTypes      = propTypes;
Head.defaultProps   = defaultProps;

export default Head
