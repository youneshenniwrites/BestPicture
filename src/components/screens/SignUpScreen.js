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

import {
  Container,
  Item,
  Input,
  Icon
} from 'native-base'

// AWS Amplify
import Auth from '@aws-amplify/auth'

export default class SignUpScreen extends React.Component {
  state = {
    username: '',
    password: '',
    email: '',
  }

  // Get user input
  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }

  // Sign up user with AWS Amplify Auth
  signUp = async () => {
    const { username, password, email } = this.state
    await Auth.signUp({
      username,
      password,
      attributes: { email }
    })
    .then(() => {
      console.log('sign up successful!')
      this.props.navigation.navigate(
        'ConfirmSignUp', 
        {username: this.state.username}
      )
    })
    .catch(err => {
      if (! err.message) {
        console.log('Error when signing up: ', err)
        Alert.alert('Error when signing up: ', err)
      } else {
        console.log('Error when signing up: ', err.message)
        Alert.alert('Error when signing up: ', err.message)
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
                {/* username section  */}
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
                    returnKeyType='next'
                    autoCapitalize='none'
                    autoCorrect={false}
                    onSubmitEditing={(event) => {this.refs.SecondInput._root.focus()}}
                    onChangeText={value => this.onChangeText('username', value)}
                  />
                </Item>
                {/*  password section  */}
                <Item rounded style={styles.itemStyle}>
                  <Icon
                    active
                    name='lock'
                    style={styles.iconStyle}
                  />
                  <Input
                    style={styles.input}
                    placeholder='Password'
                    placeholderTextColor='#adb4bc'
                    returnKeyType='next'
                    autoCapitalize='none'
                    autoCorrect={false}
                    secureTextEntry={true}
                    // ref={c => this.SecondInput = c}
                    ref='SecondInput'
                    onSubmitEditing={(event) => {this.refs.ThirdInput._root.focus()}}
                    onChangeText={value => this.onChangeText('password', value)}
                  />
                </Item>
                {/* email section */}
                <Item rounded style={styles.itemStyle}>
                  <Icon
                    active
                    name='mail'
                    style={styles.iconStyle}
                  />
                  <Input
                    style={styles.input}
                    placeholder='Email'
                    placeholderTextColor='#adb4bc'
                    keyboardType={'email-address'}
                    returnKeyType='done'
                    autoCapitalize='none'
                    autoCorrect={false}
                    secureTextEntry={false}
                    ref='ThirdInput'
                    onChangeText={value => this.onChangeText('email', value)}
                  />
                </Item> 
                <TouchableOpacity
                  onPress={() => this.signUp()}
                  style={styles.buttonStyle}>
                  <Text style={styles.buttonText}>
                    Create account
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
