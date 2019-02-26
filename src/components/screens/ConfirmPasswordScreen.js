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

export default class ConfirmPasswordScreen extends React.Component {
  state = {
    authCode: '',
    newPassword: '',
  }

  onChangeText = (key, value) => {
    this.setState({
      [key]: value
    })
  }

  // Upon confirmation redirect the user to the Sign In page
  forgotPasswordSubmit = async () => {
    const { authCode, newPassword } = this.state
    const { navigation } = this.props
    const username = await navigation.getParam('username')
    await Auth.forgotPasswordSubmit(username, authCode, newPassword)
    .then(() => {
      this.props.navigation.navigate('Authloading')
      console.log('the New password submitted successfully')
    })
    .catch(err => {
      if (! err.message) {
        console.log('Error while confirming the new password: ', err)
        Alert.alert('Error while confirming the new password: ', err)
      } else {
        console.log('Error while confirming the new password: ', err.message)
        Alert.alert('Error while confirming the new password: ', err.message)
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
            {/* Infos */}
            <Container style={styles.infoContainer}>
              <View style={styles.container}>
                <Item rounded style={styles.itemStyle}>
                  <Icon
                    active
                    name='lock'
                    style={styles.iconStyle}
                  />
                  <Input
                    style={styles.input}
                    placeholder='New password'
                    placeholderTextColor='#adb4bc'
                    returnKeyType='next'
                    autoCapitalize='none'
                    autoCorrect={false}
                    secureTextEntry={true}
                    onSubmitEditing={(event) => { this.refs.SecondInput._root.focus() }}
                    onChangeText={value => this.onChangeText('newPassword', value)}
                  />
                </Item>
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
                    ref='SecondInput'
                    onChangeText={value => this.onChangeText('authCode', value)}
                  />
                </Item>
                <TouchableOpacity
                  onPress={this.forgotPasswordSubmit.bind(this)}
                  style={styles.buttonStyle}>
                  <Text style={styles.buttonText}>
                    Confirm new password
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
})