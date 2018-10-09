import { getAllPosts,deletePost,upOrDownPostVote } from '../../utilities/api'
import { Creators as SharedCreators} from './shared'
import { Types as CommentTypes} from './comment'
import { createSelector } from 'reselect'
import _ from 'lodash'

import { normalize } from 'normalizr';
import PostSchema  from '../schemas/posts';


/* Action Types */
export const Types = {
    FETCH           : 'POSTS/FETCH',
    FETCH_SUCCESS   : 'POSTS/FETCH_SUCCESS',
    VOTE            : 'POSTS/VOTE',
    VOTE_SUCCESS    : 'POSTS/VOTE_SUCCESS',
    DELETE          : 'POSTS/DELETE',
    DELETE_SUCCESS  : 'POSTS/DELETE_SUCCESS'
}

const INITIAL_STATE = {}

/* Action Creators */
export const Creators = {
    /**
    * @description Executa a api buscando todos os posts cadastrados.
    * Step 1 - Sucesso - Dispacha a ação de FETCH_SUCCESS
    * Step 2 - Falha   - Dispacha a ação de FAILURE
    */
    fetch:() => {
        return (dispatch) => {
            dispatch(SharedCreators.loading(true));
            return getAllPosts()
              .then((posts) => {
                const normalized = normalize(posts,PostSchema);
                dispatch(Creators.fetchSuccess(normalized.entities.posts))
              })
              .catch(function(error) {
                dispatch(SharedCreators.failure(error))
              });
          }
    },
    /**
    * @description Retorna a ação de FETCH_SUCCESS
    */
    fetchSuccess:(posts) => ({
        type: Types.FETCH_SUCCESS,
        posts
    }),
    /**
    * @description Executa a api vote com up or down do post.
    * Step 1 - Sucesso - Dispacha a ação de DELETE_SUCCESS
    * Step 2 - Falha   - Dispacha a ação de FAILURE
    */
   vote:(id,user,option) => {
    return (dispatch) => {
         return upOrDownPostVote(id,user,option)
          .then((post) => {
              dispatch(Creators.voteSuccess(post.id,post.votes))
          })
          .catch(function(error) {
            dispatch(SharedCreators.failure(error))
          });
      }
    },
    /**
    * @description Retorna a ação de VOTE_SUCCESS
    */
   voteSuccess:(id,votes) => ({
        type: Types.VOTE_SUCCESS,
        id,
        votes
    }),
     /**
    * @description Executa a api deletando o post.
    * Step 1 - Sucesso - Dispacha a ação de DELETE_SUCCESS
    * Step 2 - Falha   - Dispacha a ação de FAILURE
    */
   delete:(id) => {
    return (dispatch) => {
        dispatch(SharedCreators.loading(true));
         return deletePost(id)
            .then((post) =>{
                dispatch(Creators.deleteSuccess(post.id))
            }
            ).catch(function(error) {
              console.log(error)
            dispatch(SharedCreators.failure(error))
          });
      }
    },
    /**
    * @description Retorna a ação de DELETE_SUCCESS
    */
   deleteSuccess:(id) => ({
        type: Types.DELETE_SUCCESS,
        id
    })
}


/* Reducer */
export default function reducer(state = INITIAL_STATE,action)
{
   
    switch(action.type){
        case CommentTypes.ADD_SUCCESS:{
            return {
                ...state,
                [action.comment.parentId] :{
                    ...state[action.comment.parentId],...{commentCount:state[action.comment.parentId].commentCount + 1}
                }
            }
        }
        case Types.FETCH_SUCCESS:
            return {
                ...state,
                ...action.posts,
            }
            case Types.VOTE_SUCCESS:
            return {
                ...state,
                [action.id] : {
                    ...state[action.id],...{votes : [...action.votes]}
                } 
            }
        case Types.DELETE_SUCCESS:
            return _.omit(state, action.id);
        default:
            return state
    }
}


/* Selectors */

const postsEntitiesSelector = state => state.posts


/**
* @description          
* Filtras os posts através dos filtros passados
*
* @param   {String} category    Categoria
* @param   {String} filter      Filtro
* @param   {String} order       Ordenação
* @returns {Function}           Retorna uma função que recebe o state e faz o filtro dos posts pelo category, filter e order
*/
export const getPostByFilter = (category = 'all',filter='timestamp',order='asc') => {
    return createSelector(
        postsEntitiesSelector,
        (posts) => {
            return posts &&  _.orderBy(Object.keys(posts)
            .map(id => posts[id])
            .filter(post => category === 'all' || post.category === category),[filter],[order])
        } 
    )
}

/**
* @description          
* Busca um post especifico
*
* @param   {Number} id      Id do post
* @returns {Function}       Retorna uma função que recebe o state e faz o filtro dos comments pelo postID
*/
export const getPostById = (id) => {
    return createSelector(
        postsEntitiesSelector,
        (posts) => {
            return posts && posts[id]
        } 
    )
}


