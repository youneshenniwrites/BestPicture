import React from 'react'
import { 
  StyleSheet, 
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity} from 'react-native'

import { Card, Text, Icon } from 'native-base'

import Auth from '@aws-amplify/auth'

import API, { graphqlOperation } from '@aws-amplify/api'

import { listWinners } from '../../graphql/GraphQL'

export default class HallOfFameScreen extends React.Component { 
  state = {
    bestPosts: [],
    reputations: {},
    trophies: {},
    userSUB: '',
    winnersIDs: [],
  } 

  componentDidMount = async () => {
    this.listWinnersIDs()
    this._navListener = await this.props.navigation.addListener(
      'willFocus', this.listWinnersIDs
    )
    await Auth.currentAuthenticatedUser()
    .then(user => {
      this.setState({
        userSUB: user.attributes.sub,
      })
    })
    .catch(err => console.log(err))
  }

  componentWillUnmount = async () => {
    await this._navListener.remove()
  }

  listWinnersIDs = async () => {
    try {
      const graphqldata = await API.graphql(graphqlOperation(listWinners))
      const listIDs = await graphqldata.data.listWinners.items.map(post => post.postOwnerId)
      this.setState({ 
        winnersIDs: listIDs, 
        bestPosts: graphqldata.data.listWinners.items
      })
      await this.usersReputation()
    } 
    catch (err) {
      console.log('error: ', err)
    }
  }

  usersReputation = () => {
    let counts = {}, trophies = {}
    let { winnersIDs } = this.state
    for (let i = 0; i < winnersIDs.length; i++) {
        let reputation = winnersIDs[i]
        // First win for this user
        if (typeof counts[reputation] === "undefined") {
            counts[reputation] = 10
            trophies[reputation] = 1
        // Increase an already winner
        } else {
            counts[reputation] += 10
            trophies[reputation]++
        }
    }
    this.setState({
      reputations: counts, 
      trophies: trophies
    })
  }

  render() {
    let { reputations, trophies } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.headerStyle}>
          <View style={{ flexDirection: 'row'}}>
            <TouchableOpacity onPress={this.componentDidMount}>
              <Icon 
                active 
                name='trophy'
                style={styles.iconStyle}
              />
            </TouchableOpacity>
          </View>          
        </View> 
        <ScrollView contentContainerStyle={styles.container}>
          <View style={{flex: 1, alignItems: 'center'}}>          
            {
              this.state.bestPosts.map((post, index) => (
                <Card key={index} style={styles.cardStyle}>
                  <View style={styles.cardFooterStyle}>  
                    <View style={{flex:1, justifyContent: 'center', alignItems: 'flex-start'}}>
                      <Text style={styles.postUsername}>
                        {post.postOwnerUsername}
                      </Text>
                    </View> 
                    <View style={{flex:1, justifyContent: 'flex-start', alignItems: 'flex-end'}}>
                      <Text style={styles.postUsername}>
                        Repuation: {reputations[post.postOwnerId]}
                      </Text>
                      <Text style={styles.postUsername}>
                        Trophies: {trophies[post.postOwnerId]}
                      </Text>
                    </View> 
                  </View>    
                  <Text style={styles.postBody}>
                    {post.postContent}
                  </Text>
                  <View style={styles.cardFooterStyle}>  
                    <View style={{flex:1, justifyContent: 'center', alignItems: 'flex-start'}}>
                      <TouchableOpacity
                        onPress={() => this.toggleLikePost(post)}>
                        <Icon
                          name='md-heart'
                          style={{ fontSize: 40, color: '#fb7777' }}
                        />
                      </TouchableOpacity>
                    </View> 
                    <View style={{flex:1, justifyContent: 'flex-start', alignItems: 'flex-end'}}>
                      <Text style={styles.numberLikes}>
                        {post.maxlikes}
                      </Text> 
                    </View>    
                  </View>    
                </Card>
              ))
            }
          </View>     
        </ScrollView>
      </View>
    )
  }
}

let { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle : {
    color: '#B31366',
    fontSize: 50
  },
  postUsername: { 
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f267e'
  },
  numberLikes: { 
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FB7777'
  },
  postBody: { 
    fontSize: 20, 
    color: '#1f267e',
    padding: 15
  },
  cardStyle: {
    backgroundColor: '#d2caee',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: width,
  },
  headerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 13,
  },
  cardFooterStyle: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardHeaderStyle : {
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
})


