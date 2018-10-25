import React,{PureComponent} from 'react'
import {withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import  AddPost  from '../presentational/AddPost'

import {Creators as CategoryCreators,} from '../../store/features/category'
import {Creators as PostCreators,getPostById} from '../../store/features/post'

/**
* @description
* Componente que representa o container do formulário para inserção do Post
*/
export class AddPostContainer extends PureComponent {

		state = {
			post :{}
		}

    componentDidMount() {
				const {match:{params:{post_id}},fetchPost,getAllCategories} = this.props;
        (post_id && fetchPost(post_id));
        getAllCategories();
		}

		componentWillUnmount()
		{
			this.setState({post : {}});
		}

     /**
    * @description
    * Faz o bind do objeto post para realizar a inserção ou atualização
    * @param {Object} post  Post
    */
    onHandlePost = (post) =>{
        const {addPost,updatePost,history} = this.props ;
        const path = `/${post.category}/${post.id}`;
        if(post.is_new)
            addPost(post);
        else
            updatePost(post);


        this.setState({post : {}});
        history.push(path);


    }

    render() {
				const {categories,user,post} = this.props;
        return (
            <AddPost
                categories={categories}
                user={user}
                onHandlePost={this.onHandlePost}
                post={post}
            />
        )
   }
}

function mapStateToProps (state,ownProps) {
    const {categories,user} = state;
		const {match:{params:{post_id}}} = ownProps;
    return {
        categories : categories.map((cat) => ({
            'value' : cat.name,
            'label' : cat.name.toUpperCase()
        })),
        user,
        post : getPostById(post_id)(state),
    }
}

function mapDispatchToProps (dispatch) {
    return {
       getAllCategories: ()   =>  dispatch(CategoryCreators.fetch()),
       addPost: (post) => {
            dispatch(PostCreators.add(post))
        },
        updatePost: (post) => {
            dispatch(PostCreators.update(post))
        },
        fetchPost: (id) => {
            dispatch(PostCreators.fetchById(id))
        }
    }
}


export default withRouter(connect(mapStateToProps,mapDispatchToProps)(AddPostContainer))
