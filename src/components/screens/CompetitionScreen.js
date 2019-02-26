import React from 'react'
import { 
  StyleSheet, 
  Text, 
  View } from 'react-native'

import { Icon } from 'native-base'

import Amplify from '@aws-amplify/core'

import API, { graphqlOperation } from '@aws-amplify/api'

import { listPosts } from '../../graphql/GraphQL'

import config from '../../aws-exports'
import Competition from '../Competition'

// configure the app with Amplify
Amplify.configure(config)

// Hours of events during a day
let events = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]

export default class UploadScreen extends React.Component {
  state = {
    timeUntilEvent: '',
    isCompetition: false,
    posts: '',
  }

  componentDidMount = async () => {
    //Pass this to competition as props
    this.listPosts()
    this.props.navigation.addListener('willFocus', this.listPosts)
    this.timerID = await setInterval(() => { 
      this.countDownToEvent(),
      this.executePlush()
      }, 
    1000)
  }

  componentWillUnmount = async () => {
    await clearInterval(this.timerID)
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
      this.setState({ isCompetition: true })
    } else if (
      nextEventHourUTC === 2|| nextEventHourUTC === 6 || 
      nextEventHourUTC === 10 || nextEventHourUTC === 14 || 
      nextEventHourUTC === 18 || nextEventHourUTC === 22
      ) 
    {
      this.setState({ isCompetition: false })
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

  // Call the plush method in Competition at the end of every competition cycle 
  executePlush = () => {
    let now = new Date()
    let currentTime = now.toTimeString().substr(0, 8)
    if (currentTime === '04:00:00' || currentTime === '08:00:00' || 
        currentTime === '12:00:00' || currentTime === '16:00:00' || 
        currentTime === '20:00:00' || currentTime === '00:00:00' ) {
      this.competition.flushPosts()
    }
  }

  // Navigate to the Hall Of Fame screen at the end of the competition
  goToHallOfFame = () => {
    this.props.navigation.navigate('Winners', { data: this.state.posts })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
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
        </View>
        <Competition
          goToHOF={this.goToHallOfFame}
          competition={this.state.isCompetition}
          ref={competition => { this.competition = competition }}
        />   
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
    color: '#3d4147',
  },
  textTimerStyle: {
    fontSize: 14,
    color: '#fb7777',
    fontWeight: 'bold'
  },
}) 
