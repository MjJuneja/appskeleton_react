import {StackActions, createStackNavigator} from 'react-navigation';
import React from 'react';
import { StyleSheet, Text, View,Image,Button} from 'react-native';
import Home from './components/home';

import LinkToRegister from './components/intializing';
import RegisterOptions from './components/intializing/registerOptions';
import EmailRegister from './components/intializing/emailRegistration';
import Login from './components/login';
import ForgotPassword from './components/forgotPassword';
import Profile from './components/profile';
import Settings from './components/settings';
import ChangePassword from './components/profile/changePassword';
import ChangeUsername from './components/profile/changeUsername';
import ChangeMobile from './components/profile/changeMobile';
import VideosList from './components/videos';
import KTenTest from './components/kTenTest';
import Analysis from './components/analysis';
import Audio from './components/audio';
import MessageScreen from './components/intializing/messageScreen';
import PositiveChart from './components/analysis/positiveChart';
import NegativeChart from './components/analysis/negativeChart';
import SentimentChart from './components/analysis/sentimentChart';
import EmotionScreen from './components/emotions';
import HomeQuestionChart from './components/home/homeQuestionChart';
import KTenTestQuestionChart from './components/kTenTest/kTenTestQuestionChart';
import AboutScreen from './components/about';
import Privacy from './components/privacy';


class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Watch Your Talk',
  };
  render() {
    const { navigate } = this.props.navigation;
    return(<Text></Text>);
  }
}

let MyTransition = (index, position) => {
    const inputRange = [index - 1, index, index + 1];
    const opacity = position.interpolate({
        inputRange,
        outputRange: [.8, 1, 1], 
    });

    const scaleY = position.interpolate({
        inputRange,
        outputRange: ([0.8, 1, 10]),
    });

    return {
        opacity,
        transform: [
            {scaleY}
        ]
    };
};

let TransitionConfiguration = () => {
    return {
        // Define scene interpolation, eq. custom transition
        screenInterpolator: (sceneProps) => {

            const {position, scene} = sceneProps;
            const {index} = scene;

            return MyTransition(index, position);
        }
    }
};

// export const resetStack = (routeName, dispatch, Config = {}) => {
//     Config = {...defaultNavConfig, ...Config};
//     dispatch (
//         StackActions.reset({
//             index: 0,
//             actions: [
//                 NavigationActions.navigate({
//                     routeName,
//                     ...Config
//                 })
//             ]
//         })
//     );
// };

const Navigate = createStackNavigator({
    Home: {
        screen: Login,
    },
    PositiveChart : {
        screen: PositiveChart
    },
    NegativeChart : {
        screen: NegativeChart
    },
    SentimentChart : {
        screen: SentimentChart
    },
    EmotionScreen : {
        screen: EmotionScreen
    },
    HomeQuestionChart : {
        screen: HomeQuestionChart
    },
    KTenTestQuestionChart : {
        screen: KTenTestQuestionChart
    },
    Privacy : {
        screen: Privacy
    },
    RegisterOptions : {
        screen: RegisterOptions,
        navigationOptions: () => ({
            title: `Register Using`,
            headerBackTitle: null
        }),
    },
    HomeScreen : {
        screen: Home,
        navigationOptions: () => ({
            title: `Watch Your Talk`,
            headerBackTitle: null
        }),
    },
    EmailRegister : {
        screen: EmailRegister,
        navigationOptions: () => ({
            title: `Email Registration`,
            headerBackTitle: null
        }),
    },
    MessageScreen : {
        screen: MessageScreen
    },
    AboutScreen : {
        screen: AboutScreen
    },
    ForgotPassword : {
        screen: ForgotPassword,
        navigationOptions: () => ({
            title: `Forgot Password`,
            headerBackTitle: null
        }),
    },
    Profile: { screen: Profile,
        navigationOptions: () => ({
            title: `Profile Settings`,
            headerBackTitle: null
          }),
     },
     Login: { screen: Login,
        navigationOptions: () => ({
            title: `Login`,
            headerBackTitle: null
          }),
     },
     KTenTest: { screen: KTenTest,
        navigationOptions: () => ({
            title: `K10 Test`,
            headerBackTitle: null
          }),
     },
     Analysis: { screen: Analysis,
        navigationOptions: () => ({
            title: `Analysis`,
            headerBackTitle: null
          }),
     },
     VideosList: { screen: VideosList,
        navigationOptions: () => ({
            title: `Videos`,
            headerBackTitle: null
          }),
     },
     Settings: { screen: Settings,
        navigationOptions: () => ({
            title: `Settings`,
            headerBackTitle: null
          }),
     },
     ChangePassword: { screen: ChangePassword,
        navigationOptions: () => ({
            title: `Change Password`,
            headerBackTitle: null
          }),
     },
     ChangeMobile: { screen: ChangeMobile,
        navigationOptions: () => ({
            title: `Change Mobile`,
            headerBackTitle: null
          }),
     },
     ChangeUsername: { screen: ChangeUsername,
        navigationOptions: () => ({
            title: `Change Username`,
            headerBackTitle: null
          }),
     },
     
    LinkToRegister: {screen : LinkToRegister},
},
{
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
}
);
//chl gya?
export default Navigate;