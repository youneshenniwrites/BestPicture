import React from "react"
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

import {
  Container,
  Item,
  Input,
  Icon
} from 'native-base'

import Auth from '@aws-amplify/auth'

export default class ConfirmSignUpScreen extends React.Component {
  state = {
    authCode: '',
  }

  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }

  // Confirm users and redirect them to the SignIn page
  confirmSignUp = async () => {
    const { authCode } = this.state
    const { navigation } = this.props
    const username = await navigation.getParam('username')
    await Auth.confirmSignUp(username, authCode)
    .then(() => {
      this.props.navigation.navigate('Authloading')
      console.log('Confirm sign up successful')
    })
    .catch(err => {
      if (!err.message) {
        console.log('Error when entering confirmation code: ', err)
        Alert.alert('Error when entering confirmation code: ', err)
      } else {
        console.log('Error when entering confirmation code: ', err.message)
        Alert.alert('Error when entering confirmation code: ', err.message)
      }
    })
  }

  // Resend code if not received already
  resendSignUp = async () => {
    const { navigation } = this.props
    const username = await navigation.getParam('username')
    await Auth.resendSignUp(username)
      .then(() => console.log('Confirmation code resent successfully'))
      .catch(err => {
        if (!err.message) {
          console.log('Error requesting new confirmation code: ', err)
          Alert.alert('Error requesting new confirmation code: ', err)
        } else {
          console.log('Error requesting new confirmation code: ', err.message)
          Alert.alert('Error requesting new confirmation code: ', err.message)
        }
      })
  }
  
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar />
        <TouchableWithoutFeedback
          style={styles.container}
          onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Container style={styles.infoContainer}>
              <View style={styles.container}>
                <Item rounded style={styles.itemStyle}>
                  <Icon
                    active
                    name='md-apps'
                    style={styles.iconStyle}
                  />
                  <Input
                    style={styles.input}
                    placeholder='Confirmation code'
                    placeholderTextColor='#adb4bc'
                    keyboardType={'numeric'}
                    returnKeyType='done'
                    autoCapitalize='none'
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeText={value => this.onChangeText('authCode', value)}
                  />
                </Item>
                <TouchableOpacity
                  onPress={this.confirmSignUp}
                  style={styles.buttonStyle}>
                  <Text style={styles.buttonText}>
                    Confirm Sign Up
              </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.resendSignUp}
                  style={styles.buttonStyle}>
                  <Text style={styles.buttonText}>
                    Resend code
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
    marginBottom: 180,
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
  textStyle: {
    padding: 5,
    fontSize: 18
  },
  countryStyle: {
    flex: 1,
    backgroundColor: '#99ff',
    borderTopColor: '#211f',
    borderTopWidth: 1,
    padding: 12,
  },
  closeButtonStyle: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#211f',
    backgroundColor: '#fff3',
  }
})
