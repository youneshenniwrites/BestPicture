import React from 'react'
import { View, TouchableOpacity } from 'react-native'

import { 
  createSwitchNavigator, 
  createStackNavigator,
  createDrawerNavigator,
  createMaterialTopTabNavigator } from 'react-navigation'

import { Icon } from 'native-base'

import { LinearGradient } from 'expo' 

// Auth stack
import WelcomeScreen from './src/components/screens/WelcomeScreen'
import SignInScreen from './src/components/screens/SignInScreen'
import SignUpScreen from './src/components/screens/SignUpScreen'
import ConfirmSignUpScreen from './src/components/screens/ConfirmSignUpScreen'
import ForgetPasswordScreen from './src/components/screens/ForgetPasswordScreen'
import ConfirmPasswordScreen from './src/components/screens/ConfirmPasswordScreen'
import AuthLoadingScreen from './src/components/screens/AuthLoadingScreen'

// App stack
import CompetitionScreen from './src/components/screens/CompetitionScreen'
import HallOfFameScreen from './src/components/screens/HallOfFameScreen'
import UploadScreen from './src/components/screens/UploadScreen'
import ProfileScreen from './src/components/screens/ProfileScreen'

// Amplify imports and config
import Amplify from '@aws-amplify/core'
import config from './src/aws-exports'
Amplify.configure(config)

// Configurations and options for the AppTabNavigator
const configurations = {
  Post: {
    screen: UploadScreen,
    navigationOptions: {
      tabBarLabel: 'Post',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-hourglass" style={{fontSize: 27, color: tintColor}} />
      )
    }
  },
  Vote: {
    screen: CompetitionScreen,
    navigationOptions: {
      tabBarLabel: 'Vote',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-heart" style={{fontSize: 27, color: tintColor}} />
      )
    }
  },
  Winners: {
    screen: HallOfFameScreen,
    navigationOptions: {
      tabBarLabel: 'Winners',
      tabBarIcon: ({tintColor}) => (
        <Icon name="md-trophy" style={{fontSize: 27, color: tintColor}} />
      )
    }
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="md-person" style={{fontSize: 27, color: tintColor}} />
      )
    }
  },
}

const options = {
  initialRouteName: 'Winners',
  tabBarPosition: 'bottom',
  swipeEnabled: false,
  animationEnabled: true,
  navigationOptions: {
    tabBarVisible: true // false
  },
  tabBarOptions: {
    showLabel: false, // true
    activeTintColor: '#fb7777',
    inactiveTintColor: '#a8abaf',
    style: {
      backgroundColor: '#fff',
      paddingBottom: 10, // Important for iPhone X
      // borderTopWidth: 0.3,
      // borderTopColor: '#000',
    },
    labelStyle: {
      fontSize: 9,
      fontWeight: 'bold',
      marginBottom: 8,
      marginTop: 10,
    },
    indicatorStyle: {
      height: 0,
    },
    showIcon: true,
  }
}

// Application Screens
const AppTabNavigator = createMaterialTopTabNavigator(configurations, options)

// Making the common header title dynamic in AppTabNavigator
AppTabNavigator.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index]
  let headerTitle = routeName
  return {
    headerTitle,
  }
}

const AppStackNavigator = createStackNavigator({
  AppTabNavigator: {
    screen: AppTabNavigator,
    navigationOptions: ({navigation}) => ({
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <View style={{paddingHorizontal: 10}}>
            <Icon name='md-menu' size={24} style={{color: '#fff'}}/>
          </View>
        </TouchableOpacity>
      ),
      headerRight: (
        <Icon name='md-trophy' size={24} style={{marginRight: 20, color: '#fff'}}/>
      ),
      headerBackground: (
        <LinearGradient
          colors={['#5017AE', '#B31366']}
          style={{ flex: 1 }}
          start={[0, 0]}
          end={[1, 0]}
        />
      ),
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 22
      },
    })
  }
})

// App stack
const AppDrawerNavigator = createDrawerNavigator(
  {
    Tabs: AppStackNavigator,
    Post: UploadScreen,
    Vote: CompetitionScreen,
    Winners: HallOfFameScreen,
    Profile: ProfileScreen,
  },
)

// Auth stack
const AuthStackNavigator = createStackNavigator({
  Welcome: {
    screen: WelcomeScreen,
    navigationOptions: () => ({
      title: `Sign in`,
      headerBackTitle: 'Back',
      headerLeft: (
        <Icon name='md-trophy' size={24} style={{marginLeft: 20, color: '#5017AE'}}/>
      )
    }),
  },
  SignIn: {
    screen: SignInScreen,
    navigationOptions: () => ({
      title: `Log in`,
      headerRight: (
        <Icon name='md-trophy' size={24} style={{marginRight: 20, color: '#5017AE'}}/>
      )
    }),
  },
  SignUp: {
    screen: SignUpScreen,
    navigationOptions: () => ({
      title: `Sign up`,
      headerRight: (
        <Icon name='md-trophy' size={24} style={{marginRight: 20, color: '#5017AE'}}/>
      )
    }),
  },
  ConfirmSignUp: {
    screen: ConfirmSignUpScreen,
    navigationOptions: () => ({
      title: `Enter code`,
      headerRight: (
        <Icon name='md-trophy' size={24} style={{marginRight: 20, color: '#5017AE'}}/>
      )
    }),
  },
  ForgetPassword: {
    screen: ForgetPasswordScreen,
    navigationOptions: () => ({
      title: `Forget password`,
      headerRight: (
        <Icon name='md-trophy' size={24} style={{marginRight: 20, color: '#5017AE'}}/>
      )
    }),
  },
  ConfirmPasswordScreen: {
    screen: ConfirmPasswordScreen,
    navigationOptions: () => ({
      title: `Confirm password`,
      headerRight: (
        <Icon name='md-trophy' size={24} style={{marginRight: 20, color: '#5017AE'}}/>
      )
    }),
  },
})

export default createSwitchNavigator({
  Authloading: AuthLoadingScreen,
  Auth: AuthStackNavigator,
  App: AppDrawerNavigator
})


