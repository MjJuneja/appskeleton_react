import {createStackNavigator} from 'react-navigation';
import React from 'react';
import { StyleSheet, Text, View,Image,Button, ToastAndroid } from 'react-native';
import HomeScreen from './Home';
import Voice from 'react-native-voice';
// import SpeechAndroid from 'react-native-android-voice';

class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };
  constructor() {
    super();
    this.state = {
        results : []
    }
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
  }

  onSpeechResults(e){
    this.setState({
        results:e.value[0]
    })
    // ToastAndroid.show(e.value , ToastAndroid.LONG);
  }

//     // Voice.onSpeechStart = this.onSpeechStartHandler.bind(this);
//     // Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
//     // Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
//   }
    onSpeechStart(){
        // alert("inside");
         Voice.start('en-US');
        //  ToastAndroid.show(spokenText , ToastAndroid.LONG);
    }

    onSpeechEnd(){
        Voice.stop();
    }
    
  render() {
    const { navigate } = this.props.navigation;
    return(<View><Button title="Start speech"
               onPress={this.onSpeechStart.bind()}
                 />
                 <Button title="Stop speech"
               onPress={this.onSpeechEnd.bind()}
                 />
                 {/*{
                     this.state.results.map((text,index)=>{
                         return(<Text key={index}>{text}</Text>)
                     })
                 }*/}
                 <Text>{this.state.results}</Text>
                 </View>)
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


const Navigate = createStackNavigator({
  Home: { screen: HomeScreen },
  Profile: { screen: ProfileScreen },
    },{
        // navigationOptions:{
        //     headerStyle:{
        //         marginTop:Expo.Constants.statusBarHeight
        //     }
        // }
        transitionConfig: TransitionConfiguration
    }
);

export default Navigate;