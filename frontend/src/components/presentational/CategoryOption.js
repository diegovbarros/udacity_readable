import React from 'react'
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom'

const propTypes = {
    categories : PropTypes.arrayOf(PropTypes.shape({
        name : PropTypes.string.isRequired,
        path : PropTypes.string.isRequired,
    })).isRequired,
    currentCategory         : PropTypes.string
}

const defaultProps  = {
    currentCategory: 'all',
    categories: [],
}

/**
* @description
* Componente que mostra as categorias cadastradas para filtrar os posts
*
* @constructor
* @param {Array} categories              Coleção de Categorias
* @param {String} currentCategory         Categoria atual
*/
function CategoryOption({currentCategory, categories}) {
    return (
        <ul className="cat-list-bg-style align-center sorting-menu">
            <li key={"all"} className={`cat-list__item ${currentCategory === "all" ? 'active' : ''}`} data-filter="*">
                <Link to="/all">Todos</Link>
            </li>
                {categories.map(category => (
                    <li key={category.name} className={`cat-list__item ${currentCategory === category.name ? 'active' : ''}`} data-filter="*">
                        <Link to={`/${category.name}`}>{category.name}</Link>
                    </li>
                ))}
        </ul>
    )
}

CategoryOption.propTypes    = propTypes;
CategoryOption.defaultProps = defaultProps;

export default CategoryOption
