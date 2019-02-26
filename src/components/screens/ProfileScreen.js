import React from 'react'
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  SafeAreaView,
  Text,
  StatusBar,
  Keyboard,
  View,
  Alert,
  ScrollView
} from 'react-native'

import {
  Container,
  Item,
  Input,
  Icon,
} from 'native-base'

import Auth from '@aws-amplify/auth'

import API, { graphqlOperation } from '@aws-amplify/api'

import { listWinners } from '../../graphql/GraphQL'

export default class ProfileScreen extends React.Component {
  state = {
    username: '',
    userId: '',
    winners: [],
    myReputation: 0,
    myTrophies: 0,
    password1: '',
    password2: '',
  }

  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }

  componentDidMount = async () => {
    this.listWinners()
    this._navListener = await this.props.navigation.addListener('willFocus', this.listWinners)
    await Auth.currentAuthenticatedUser()
    .then(user => {
      this.setState({
        userId: user.attributes.sub,
        username: user.username
      })
    })
    .catch(err => console.log(err))
  }

  componentWillUnmount = async () => {
    await this._navListener.remove()
  }
  
  listWinners = async () => {
    try {
      const graphqldata = await API.graphql(graphqlOperation(listWinners))
      this.setState({ winners: graphqldata.data.listWinners.items })
      await this.myReputation()
    } 
    catch (err) {
      console.log('error: ', err)
    }
  }

  myReputation = () => {
    let myWins = this.state.winners.filter(
      winner => winner.postOwnerId === this.state.userId
    )
    const reputation = 10 * myWins.length
    const trophies = reputation / 10
    this.setState({myReputation: reputation, myTrophies: trophies})
  }

  // Change user password for the app
  changePassword = async () => {
    const { password1, password2 } = this.state
    await Auth.currentAuthenticatedUser()
    .then(user => {
      return Auth.changePassword(user, password1, password2)
    })
    .then(data => console.log('Password changed successfully', data))
    .catch(err => {
      if (! err.message) {
        console.log('Error changing password: ', err)
        Alert.alert('Error changing password: ', err)
      } else {
        console.log('Error changing password: ', err.message)
        Alert.alert('Error changing password: ', err.message)
      }
    })
  }

  // Sign out from the app
  signOutAlert = async () => {
    await Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out from the app?',
      [
        {text: 'Cancel', onPress: () => console.log('Canceled'), style: 'cancel'},
        {text: 'OK', onPress: () => this.signOut()},
      ],
      { cancelable: false }
    )
  }

  signOut = async () => {
    await Auth.signOut()
    .then(() => {
      console.log('Sign out complete')
      this.props.navigation.navigate('Authloading')
    })
    .catch(err => console.log('Error while signing out!', err))
  }

  render() {
    return (
      <SafeAreaView>
        <StatusBar/>
        <ScrollView contentContainerStyle={styles.container}>         
          <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
            {/*Infos*/}
            <Container style={styles.infoContainer}>
              <View style={styles.container}>
                <View style={{alignItems: 'center',justifyContent: 'center'}}>
                  <View style={styles.avatarStyle}>
                    <Icon name='ios-person' style={styles.iconStyle2}/>
                  </View>
                  <Text style={styles.textStyle}>My username: {this.state.username}</Text>
                  <Text style={styles.textStyle}>My reputation: {this.state.myReputation}</Text>
                  <Text style={styles.textStyle}>My trophies: {this.state.myTrophies}</Text>
                </View>
                <View><Text style={styles.separator}></Text></View>     
                <View style={[styles.buttonStyle, {borderRadius: 4}]}>
                  <Text style={styles.buttonText}>Change password</Text>              
                </View>
                {/* Old password */}
                <Item rounded style={styles.itemStyle}>
                  <Icon
                    active
                    name='lock'
                    style={styles.iconStyle}
                  />
                  <Input
                    style={styles.input}
                    placeholder='Old password'
                    placeholderTextColor='#adb4bc'
                    returnKeyType='next'
                    autoCapitalize='none'
                    autoCorrect={false}
                    secureTextEntry={true}
                    onSubmitEditing={(event) => { this.refs.SecondInput._root.focus() }}
                    onChangeText={value => this.onChangeText('password1', value)}
                  />
                </Item>    
                {/* New password */}              
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
                    returnKeyType='go'
                    autoCapitalize='none'
                    autoCorrect={false}
                    secureTextEntry={true}
                    ref='SecondInput'
                    onChangeText={value => this.onChangeText('password2', value)}
                  />
                </Item>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    onPress={this.signOutAlert}
                    style={[styles.twinButtonStyle, {backgroundColor: '#f16f69'}]}>
                    <Icon name='md-log-out' style={{color: '#fff', fontSize: 22}}/>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this.changePassword}
                    style={[styles.twinButtonStyle, {backgroundColor: '#5017AE'}]}>
                    <Text style={styles.buttonText}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Container>
          </TouchableWithoutFeedback>
        </ScrollView>        
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    flexDirection: 'column',
  },
  textStyle: {
    fontSize: 16,
    color: '#1F267E'
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1F267E',
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff0'
  },
  itemStyle: {
    marginTop: 20,
    borderRadius: 10,
    borderColor: '#F16F69',
  },
  iconStyle2: {
    color: '#fff9', 
    fontSize: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconStyle: {
    color: '#1F267E',
    fontSize: 28,
    marginLeft: 15
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#5017AE',
    padding: 14,
    marginTop: 20,
    borderRadius: 24,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#fff",
  },
  avatarStyle: {
    backgroundColor: '#0066',
    padding: 20,
    width: 140,
    height: 140,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20,
    borderWidth: 3,
    borderColor: '#fff7',
  },
  separator: {
    flexDirection: 'row',
    backgroundColor: '#f16f69',
    height: 2,
    marginTop: 20,
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
    flexDirection: 'row'
  },
})


