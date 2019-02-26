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
  Icon,
} from 'native-base'

export default class SignInScreen extends React.Component {
  state = {
    username: '',
    password: '',
    userSUB: '',
    authCode: ''
  }

  onChangeText = (key, value) => {
    this.setState({
      [key]: value
    })
  }

  signIn = async () => {
    const { username, password } = this.state
    await Auth.signIn(username, password)
    .then(user => {
      this.setState({ user })
      this.props.handleRoute('Authloading')
    })
    .catch(err => {
      if (! err.message) {
        console.log('Error when signing in: ', err)
        Alert.alert('Error when signing in: ', err)
      } else {
        console.log('Error when signing in: ', err.message)
        Alert.alert('Error when signing in: ', err.message)
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
                      returnKeyType='go'
                      autoCapitalize='none'
                      autoCorrect={false}
                      secureTextEntry={true}
                      ref='SecondInput'
                      onChangeText={value => this.onChangeText('password', value)}
                    />
                  </Item>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                      onPress={() => this.props.handleRoute('SignUp')}
                      style={[styles.twinButtonStyle, {backgroundColor: '#f16f69'}]}>
                      <Text style={styles.buttonText}>
                        Sign up
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.signIn()}
                      style={[styles.twinButtonStyle, {backgroundColor: '#5017AE'}]}>
                      <Text style={styles.buttonText}>
                        Login
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity 
                    onPress={() => this.props.handleRoute('ForgetPassword')}>
                    <Text style={styles.textStyle}>Forget password ?</Text>
                  </TouchableOpacity>
                  <Text style={styles.separator}></Text>
                  {/* Social sign in */}
                  {/* <TouchableOpacity
                    style={[styles.socialButtonStyle, {backgroundColor: '#507CC0'}]}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon 
                        active 
                        name='logo-facebook' 
                        style={{marginRight: 12, color: '#fff', fontSize: 28}}/>
                      <Text style={styles.buttonText}>Continue with Facebook</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.socialButtonStyle, {backgroundColor: '#4285F4'}]}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon 
                        active 
                        name='logo-google' 
                        style={{marginRight: 12, color: '#fff', fontSize: 24}}/>
                      <Text style={styles.buttonText}>Continue with Google</Text>
                    </View>
                  </TouchableOpacity> */}
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
    justifyContent: 'center', // important to make the keyboardavoiding view works
    flexDirection: 'column',
    alignContent: 'center'
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#5017AE',
  },
  infoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    marginTop: 30,
    backgroundColor: '#fff1',
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
  buttonContainer: {
    paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  twinButtonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 10,
    width: 130,
    height: 48,
  },
  socialButtonStyle: {
    alignItems: 'center',
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
    fontSize: 16,
    padding: 5,
    color: '#4A4A4A'
  },
  separator: {
    flexDirection: 'row',
    backgroundColor: '#f16f69',
    height: 1.5,
    marginTop: 20,
    marginBottom: 20
  },
})