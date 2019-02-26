import React from 'react'
import {  View  } from 'react-native'

import SignInScreen from './SignInScreen'

export default class WelcomeScreen extends React.Component {
  handleRoute = async (screen) => {
    await this.props.navigation.navigate(screen)
  }
  render() {
    return (
      <View style={{flex:1}}>
        <SignInScreen handleRoute={this.handleRoute}/>
      </View>
    )
  }
}