import React,{Fragment, Component} from 'react'
import {withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import Head from './presentational/Head'
import Footer from './presentational/Footer'
import AddPostButton from './presentational/AddPostButton'
import Post from './presentational/Post'
import CategoryOption from './presentational/CategoryOption'
import SearchNotFound from './presentational/SearchNotFound'

import {Creators as SharedCreators} from '../store/features/shared'
import {Creators as PostCreators} from '../store/features/post'
import {getPosts} from '../store/features/post'

/**
* @description 
* Componente que representa a página Home
*/
class Home extends Component {
    componentDidMount() {
        this.props.getAllData()
    }

    ShowComponent = () => {
        if(this.props.app.fetched && this.props.posts.length <= 0)
            return <SearchNotFound/>
        else{
            return (
                this.props.posts.map(post => (
                    <Post key={post.id} post={post}></Post>
                ))
            )
        }
    }

   render() {
       console.log(this.props)
        return (
            <Fragment>
                <Head></Head>
                <div className="container">
                    <div className="row">
                        <div className="col col-lg-12 col-md-12 col-sm-12 col-12">
                            <div className="clients-grid">
                                <CategoryOption currentCategory= {this.props.match.params.id} categories={this.props.categories}></CategoryOption>
                            </div>
                        </div>
                        {
                            this.ShowComponent()
                        }
                    </div>
                </div>
                <AddPostButton></AddPostButton>
                <Footer></Footer>
            </Fragment>
        )
    }
}

function mapStateToProps (state,ownProps) {
    const {categories,app} = state;
    const getPostsFiltered = getPosts(ownProps.match.params.id)
    return {
        categories,
        posts : getPostsFiltered(state),
        app 
    }
}

function mapDispatchToProps (dispatch) {
    return {
       getAllData: ()   =>  dispatch(SharedCreators.handleInitialData()),
       deletePost: (id) =>  dispatch(PostCreators.deletePost(id))
    }
}


export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Home))
