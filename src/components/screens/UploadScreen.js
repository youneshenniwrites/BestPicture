import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import Amplify from '@aws-amplify/core'
import API, { graphqlOperation } from '@aws-amplify/api'

import { Icon } from 'native-base'

import config from '../../aws-exports'
import Upload from '../Upload'
import { listPosts } from '../../graphql/GraphQL'

// configure the app with Amplify
Amplify.configure(config)

// Hours of events during a day
let events = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]

export default class UploadScreen extends React.Component {
  state = {
    timeUntilEvent: '',
    isUpload: true,
    posts: '',
    refreshing: false,
  }

  componentDidMount = async () => {
    this.timerID = await setInterval(() => { 
      this.countDownToEvent(),
      this.countPosts()
      }, 
    1000)
  }

  componentWillUnmount = async () => {
    await clearInterval(this.timerID)
  }

  // Get number of posts from the Upload Component
  countPosts = async () => {
    try {
      const graphqldata = await API.graphql(graphqlOperation(listPosts))
      this.setState({ 
        posts: graphqldata.data.listPosts.items, postContent: '' 
      })
      // console.log(this.state.posts.length)
    } 
    catch (err) {
      console.log('error: ', err)
    }
  }
  
  countDownToEvent = () => {
    let nextEventHourUTC // Hour of next event
    // Get current date
    let now = new Date()
    // Get current time HH:MM:SS
    let timeNow = now.toISOString().substr(11, 8)
    // Get current Hour
    let nowHourUTC = now.getUTCHours()  
    // Get hour for the next event
    for (let i = 0; i < events.length; i++) {
      if (nowHourUTC < events[i]) {
        nextEventHourUTC = events[i]
        break
      }
    }
    // Switch between upload and competition screens
    if (
      nextEventHourUTC === 4 || nextEventHourUTC === 8 || 
      nextEventHourUTC === 12 || nextEventHourUTC === 16 ||
      nextEventHourUTC === 20 || nextEventHourUTC === 24
      ) 
    {
      this.setState({ isUpload: false })
    } else if (
      nextEventHourUTC === 2|| nextEventHourUTC === 6 || 
      nextEventHourUTC === 10 || nextEventHourUTC === 14 || 
      nextEventHourUTC === 18 || nextEventHourUTC === 22
      ) 
    {
      this.setState({ isUpload: true })
    }
    // Correct time formatting for the UTC midnight challenge
    if (nextEventHourUTC === 24) {
      nextEventHourUTC = '00'
    }
    // Get date of the next event
    let nextEventTime = timeNow.replace(timeNow, nextEventHourUTC + ':00:00')
    let nextEventDate = now.toDateString() + ' ' + nextEventTime + ' UTC'
    nextEventDate = new Date(nextEventDate)
    let timeLeftToEvent = nextEventDate - now // in millisecs
    this.setState({
      timeUntilEvent: (new Date(timeLeftToEvent)).toISOString().substr(11, 8)
    })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Upload timer */}
          <View style={{ marginLeft: 12 }}>
            <Icon name='ios-stopwatch' style={{fontSize: 37, color: '#3d4147'}}/>
          </View>  
          {/* Competition timer */}
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.textStyle}>
              TIME REMAINING
            </Text>
            <Text style={styles.textTimerStyle}>
              {this.state.timeUntilEvent}
            </Text>
          </View>        
          {/* Number of entries until max */}
          {
            this.state.isUpload && 
            <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20 }}>
              <Text style={styles.textStyle}>
                ENTRIES
              </Text>
              <Text style={styles.textTimerStyle}>
                {this.state.posts.length} / 5000
              </Text>
            </View>
          }
        </View>
        {
          this.state.isUpload ? 
          (
            <Upload 
              countPosts={this.countPosts} 
              maxPosts={5000}
            />
          ) : 
          (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
    flex: 0.12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 0.3,
    borderBottomColor: '#a8abaf'
  },
  textStyle: {
    fontSize: 14,
    color: '#3d4147'
  },
  textTimerStyle: {
    fontSize: 14,
    color: '#fb7777',
    fontWeight: 'bold'
  },
  lockIconStyle: {
    color: '#5017ae', 
    fontSize: 45,
  }
})


