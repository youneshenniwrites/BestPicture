import React from 'react'
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  Keyboard,
  View,
  Alert,
} from 'react-native'

import Auth from '@aws-amplify/auth'

import {
  Container,
  Item,
  Input,
  Icon
} from 'native-base'

export default class ForgetPasswordScreen extends React.Component {
  state = {
    username: '',
  }

  onChangeText = (key, value) => {
    this.setState({
      [key]: value
    })
  }
  // Request a new password
  forgotPassword = async () => {
    const { username } = this.state
    await Auth.forgotPassword(username)
    .then(data => {
      console.log('New code sent', data)
      this.props.navigation.navigate('ConfirmPasswordScreen', {username: this.state.username})
    })
    .catch(err => {
      if (! err.message) {
        console.log('Error while setting up the new password: ', err)
        Alert.alert('Error while setting up the new password: ', err)
      } else {
        console.log('Error while setting up the new password: ', err.message)
        Alert.alert('Error while setting up the new password: ', err.message)
      }
    })
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar/>
        <TouchableWithoutFeedback 
          style={styles.container} 
          onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Container style={styles.infoContainer}>
              <View style={styles.container}>
                <Item rounded style={styles.itemStyle}>
                  <Icon
                    active
                    name='person'
                    style={styles.iconStyle}
                  />
                  <Input
                    style={styles.input}
                    placeholder='Username'
                    placeholderTextColor='#adb4bc'
                    keyboardType={'email-address'}
                    returnKeyType='go'
                    autoCapitalize='none'
                    autoCorrect={false}
                    onChangeText={value => this.onChangeText('username', value)}
                  />
                </Item>
                <TouchableOpacity
                  onPress={this.forgotPassword}
                  style={styles.buttonStyle}>
                  <Text style={styles.buttonText}>
                    Send code
                  </Text>
                </TouchableOpacity>              
              </View>
            </Container>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column'
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#5a52a5',
  },
  infoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    backgroundColor: '#fff1',
    marginBottom: 70,
  },
  itemStyle: {
    marginBottom: 20,
    borderRadius: 10,
    borderColor: '#F16F69',
  },
  iconStyle: {
    color: '#5017AE',
    fontSize: 28,
    marginLeft: 15
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#5017AE',
    padding: 14,
    marginBottom: 20,
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#fff",
  },
})