import React from 'react'
import { 
  Alert, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  View } from 'react-native'

import { Card, Icon, Text } from 'native-base'

import API, { graphqlOperation } from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import Amplify from '@aws-amplify/core'

import config from '../aws-exports'
import { 
  createLike, 
  deleteLike, 
  deletePost, 
  listPosts } from '../graphql/GraphQL'

// configure the app with Amplify 
Amplify.configure(config)

export default class Competition extends React.Component {
  state = { 
    posts: [],
    postOwnerId: '',
    postOwnerUsername: '',
		likeOwnerUsername: '',
    likeOwnerId: '',
  }

  componentDidMount = async () => {
    await Auth.currentAuthenticatedUser()
    .then(user => {
      this.setState(
        {  
          postOwnerUsername: user.username,
          likeOwnerUsername: user.username,
          postOwnerId: user.attributes.sub,
          likeOwnerId: user.attributes.sub,
        }
      )
    })
    .catch(err => console.log(err))
    await this.listPosts()
  }

  // Flush everting else: posts, likes, state.
  flushPosts = async () => {
    // Delete all posts and their likes from the database
    await this.state.posts.map(this.deletePost)
    await this.state.posts.map(
      post => post.likes.items.map(
        like => this.deleteLikesOfPost(like.id)
      )
    )
    // Navigate to the Hall of Fame screen
    this.props.goToHOF()  
  }

  listPosts = async () => {
    try {
      const graphqldata = await API.graphql(graphqlOperation(listPosts))
      this.setState({ posts: graphqldata.data.listPosts.items })
      // console.log(this.state.posts)
    } 
    catch (err) {
      console.log('error: ', err)
    }
  }

  deletePostAlert = async (post) => {
    await Alert.alert(
      'Delete Post',
      'Are you sure you wanna delete this post?',
      [
        {text: 'Cancel', onPress: () => console.log('Canceled'), style: 'cancel'},
        {text: 'OK', onPress: () => this.deletePost(post)},
      ],
      { cancelable: false }
    )
  }

  deletePost = async (post) => {
    const postId = await post['id'] 
    try {
      await API.graphql(graphqlOperation(deletePost, { id: postId }))
      await this.componentDidMount()
      // console.log('Post successfully deleted.')
    } catch (err) {
      console.log('Error deleting post.', err)
    }
  }

  toggleLikePost = async (post) => {
    const loggedInUser = await this.state.postOwnerId
    // Get the like instance of the logged in user
    const likeUserObject = await post.likes.items.filter(
      obj => obj.likeOwnerId === loggedInUser
    )
    // If there is a like instance fire a delete action
    if (likeUserObject.length !== 0) {
      await this.deleteLike(likeUserObject)
      return
    }
    // Otherwise create a like instance
    await this.createLike(post)
  }

  createLike = async (post) => {
    const postId = await post['id']
    this.setState({numberLikes: 1})
    const like = {
      likeOwnerId: this.state.likeOwnerId,
      numberLikes: this.state.numberLikes,
      likeOwnerUsername: this.state.likeOwnerUsername,
      id: postId,
    }
    try {
      await API.graphql(graphqlOperation(createLike, like))
      await this.componentDidMount()
    } catch (err) {
      console.log('Error creating like.', err)
    }
  }
  
  deleteLike = async (likeUserObject) => {
    const likeId = await likeUserObject[0]['id']
    try {
      await API.graphql(graphqlOperation(deleteLike, { id: likeId }))
      await this.componentDidMount()
    } catch (err) {
      console.log('Error deleting like.', err)
    }
  }

  // Cascading delete for the posts and their associated likes 
  deleteLikesOfPost = async (likeId) => {
    try {
      await API.graphql(graphqlOperation(deleteLike, { id: likeId }))
    } catch (err) {
      console.log('Error deleting like.', err)
    }
  }

  render() {		
    let loggedInUser = this.state.postOwnerId
    return (
      <View style={{flex: 1}}>
        <View style={styles.headerStyle}>
          <TouchableOpacity onPress={this.listPosts}>
            <Icon 
              active 
              name='refresh'
              style={styles.iconStyle}
            />
          </TouchableOpacity>
        </View> 
        {
          this.props.competition ? 
          (
            <ScrollView contentContainerStyle={styles.container}>
              <View style={{flex: 1, alignItems: 'center'}}>          
                {
                  this.state.posts.map((post, index) => (
                    <Card key={index} style={styles.cardStyle}>
                      {/* Show delete Icon if logged in user is the post owner */}
                      <View style={styles.cardHeaderStyle}>
                        { post.postOwnerId === loggedInUser &&
                          <View style={{flex:1, justifyContent: 'center', alignItems: 'flex-start'}}>
                            <TouchableOpacity
                              onPress={() => this.deletePostAlert(post)}>
                              <Icon name='md-more' style={{color: '#1f267e'}}/>
                            </TouchableOpacity>
                          </View> 
                        }
                      </View>                      
                      <TouchableOpacity>
                        <Text style={styles.postBody}>
                          {post.postContent}
                        </Text>                                    
                      </TouchableOpacity>                   
                      <View style={styles.cardFooterStyle}>
                        <View style={{flex:1, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                          <Text style={styles.postUsername}>
                            {post.postOwnerUsername}
                          </Text> 
                        </View>
                        {/* Logged in user liked this post */}
                        {
                          post.likes.items.length !== 0 &&
                          post.likes.items.filter(obj => obj.likeOwnerId === loggedInUser).length === 1 &&
                          <View style={{flex:1, justifyContent: 'center', alignItems: 'flex-end'}}>
                            <TouchableOpacity
                              onPress={() => this.toggleLikePost(post)}>
                              <Icon
                                name='md-heart'
                                style={{ fontSize: 40, color: '#fb7777' }}
                              />
                            </TouchableOpacity>
                          </View>       
                        }
                        {/* Logged in user did not like this post */}
                        {
                          post.likes.items.length !== 0 && 
                          post.likes.items.filter(obj => obj.likeOwnerId === loggedInUser).length === 0 &&
                          <View style={{flex:1, justifyContent: 'center', alignItems: 'flex-end'}}>
                            <TouchableOpacity
                              onPress={() => this.toggleLikePost(post)}>
                              <Icon
                                name='md-heart'
                                style={{ fontSize: 40, color: '#69ff' }}
                              />
                            </TouchableOpacity>
                          </View>              
                        }
                        {/* Post has no likes */}
                        {
                          post.likes.items.length === 0 && 
                          <View style={{flex:1, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                            <TouchableOpacity
                              onPress={() => this.toggleLikePost(post)}>
                              <Icon
                                name='md-heart'
                                style={{ fontSize: 40, color: '#69ff' }}
                              />
                            </TouchableOpacity>
                          </View>                  
                        }                                      
                      </View>
                    </Card>
                  ))
                }
              </View>     
            </ScrollView>
          ) 
          : 
          (
            <View style={[styles.container, {flex: 1}]}>
              <Icon name='md-lock' style={styles.lockIconStyle}/>
            </View>
          )
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerStyle: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postUsername: { 
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f267e'
  },
  postBody: { 
    fontSize: 18, 
    color: '#1f267e',
    padding: 15
  },
  iconStyle : {
    color: '#5017ae',
    fontSize: 38
  },
  cardStyle: {
    backgroundColor: '#eadee4',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFooterStyle: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderStyle : {
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  lockIconStyle: {
    color: '#5017ae', 
    fontSize: 45,
  }
})


