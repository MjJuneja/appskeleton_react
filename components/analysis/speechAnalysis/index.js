import React, {Component} from "react";
import {StyleSheet, View, Text, Image, AsyncStorage, TouchableOpacity, ScrollView} from 'react-native';
import SplashScreen from "../../splashscreen";
import Toast, {DURATION} from 'react-native-easy-toast';
import axios from 'axios';


import BottomNavigation,{FullTab} from 'react-native-material-bottom-navigation';
import { Icon } from 'react-native-elements'
import moment from 'moment';

class SpeechAnalysis extends Component {

    constructor(props) {
        super(props);

        this._retrieveData();

        this.state = {
            userData: {},
            graphData : {},
            positivePercentage : 0,
            negativePercentage : 0,
            sentimentsPercentage : 0,
            mood : "",
            currentMood: "",
            scoreToday: 0,
            scoreMessage: "",
            splashScreenActive: true,
            startDate : moment().startOf('day').add(5, 'hours').add(30,'minutes').toDate().toISOString(),
            endDate: moment().startOf('day').add(5, 'hours').add(30,'minutes').add(1, "days").toDate().toISOString(),
            image: <Image style={analysisStyles.emotionImage} source={require ('../../../assets/images/logo/logo.png')} />
        }
    }

    _retrieveData = async () => {
        console.log("in retrieve data");
        try {
          const userData = await AsyncStorage.getItem('userData');
          let currentMood = await AsyncStorage.getItem('currentMood');
          console.log("current mood", currentMood);
        //   const micFlag = await AsyncStorage.getItem('micFlag');
          if (userData !== null) {
            // We have data!!
            userData = JSON.parse(userData);
            console.log(userData);
            this.checkToken(userData.sessionId);
            this.setState({userData});
            this.getChartData();
          } else {
              console.log("No data found");
          }
         } catch (error) {
           // Error retrieving data
           console.log(error);
         }
      }

      checkToken = token => {
      axios({
          method: 'post',
          url: 'http://13.238.16.112/answer/getAnswer',
          headers : {
              'Content-Type' : 'application/json',
              'Authorization' : 'token '+token
          },
          data: {
            "fromDate":"2018-08-19T00:00:00.000Z",
            "toDate":"2018-08-20T00:00:00.000Z"
          }
        }).then(data => {
            console.log(data.data);
            if(data.data.message=="Access denied") {
              this._removeData();
              this._handleNavigation('Home');
            } else {
                console.log("access granted");
            }
        }).catch(err=>{
              console.log(err);
        });
    }
    
    _removeData = async()=> {
      console.log("removing data");
      try {
        const userData = await AsyncStorage.removeItem('userData');
       } catch (error) {
         // Error retrieving data
         console.log(error);
       }
    }

    _handleNavigation = (navigateTo)=> {
        console.log(navigateTo);
        const { navigate } = this.props.navigation;
        navigate(navigateTo);
    }

    getChartData = () => {
        console.log('in get chart data');
        axios({
            method: 'post',
            url: 'http://13.238.16.112/words/getWords',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : 'token '+ this.state.userData.sessionId
            },
            data: {
                "fromDate" : this.state.startDate,
	            "toDate" : this.state.endDate
            }
          }).then(data => {
              console.log(data.data.data);
              let totalData = data.data.data;
              let sumP =  0;
              let sumN = 0;
              let sumNeu = 0;
              totalData.map(value=>{
                sumP+=value.positive;
                sumN+=value.negative;
                sumNeu+=value.neutral;
              });
              positivePercentage = parseInt(((sumP*100)/(sumN+sumP+sumNeu)).toFixed(0)) | 0;
              negativePercentage = parseInt(((sumN*100)/(sumN+sumP+sumNeu)).toFixed(0)) | 0;
              scoreToday = parseInt(((sumP*10)/(sumP+sumN)).toFixed(1)) | 0;
              let scoreMessage="Let's start spreading positivity.";

            if(totalData.length!=0) {
                if(scoreToday >=0 && scoreToday<=3) {
                    scoreMessage = "Please seek help, we love you here at Watch Your Talk!";
                } else if(scoreToday>3 && scoreToday<=5) {
                    scoreMessage = "There is a room for imporvement, we know you can do it! We love you here at Watch Your Talk";
                } else if(scoreToday>5 && scoreToday<=7) {
                    scoreMessage = "Average, continue to .... your words consciously. We love you at Watch Your Talk ";
                } else if(scoreToday>7 && scoreToday<=8) {
                    scoreMessage = "Good work, we are getting there, continue to monitor your words consciously ";
                } else if(scoreToday>8 && scoreToday<=9) {
                    scoreMessage = "Well Done, you are spreading positivity, continue.";
                } else if(scoreToday>9 && scoreToday<=10) {
                    scoreMessage = "You are our SuperStar! We are proud of your positivity at Watch Your Talk, continue spreading positivity!";
                }
            }

              console.log("positive", positivePercentage, " negative", negativePercentage, " score: ", scoreToday, scoreMessage);
              this.setState({positivePercentage, negativePercentage, scoreToday, splashScreenActive: false, scoreMessage});
          }).catch(err=>{
                console.log(err);  
          });
    }

    tabs = [
        {
          key: 'home',
          icon: 'home',
          navigate: 'HomeScreen',
          label: 'Home',
          barColor: '#388E3C',
          pressColor: 'rgba(255, 255, 255, 0.16)'
        },
        {
          key: 'analysis',
          icon: 'assessment',
          navigate: 'Analysis',
          label: 'Analysis',
          barColor: '#B71C1C',
          pressColor: 'rgba(255, 255, 255, 0.16)'
        },
        {
          key: 'kten',
          icon: 'assignment',
          navigate: 'KTenTest',
          label: 'K10',
          barColor: '#E64A19',
          pressColor: 'rgba(255, 255, 255, 0.16)'
        },
        {
          key: 'videos',
          icon: 'videocam',
          navigate: 'VideosList',
          label: 'Videos',
          barColor: '#388E3C',
          pressColor: 'rgba(255, 255, 255, 0.16)'
        },
        {
            key: 'settings',
            icon: 'settings',
            navigate: 'Settings',
            label: 'Settings',
            barColor: '#ff3782',
            pressColor: 'rgba(255, 255, 255, 0.16)'
        }
      ]

      renderIcon = icon => ({ isActive }) => (
        <Icon size={16} color="white" name={icon} />
      )
    
       renderTab = ({ tab, isActive }) => {
        return (
          <FullTab
            style = {{marginLeft:-10}} 
            key={tab.key}
            isActive={isActive}
            label={tab.label}
            renderIcon={this.renderIcon(tab.icon)}
          />
        )
      }




    render() {

        return(
        
            this.state.splashScreenActive ? <SplashScreen /> :
            <View>
                {/* <BottomNavigation
                renderTab={this.renderTab}
                tabs={this.tabs}
                onTabPress={activeTab => this._handleNavigation(activeTab.navigate)}
                // style={{marginBottom: 50}}
            /> */}
            <TouchableOpacity
                    onPress={this._handleNavigation.bind(this, "EmotionScreen")}
                    style={analysisStyles.emotionButton}
                >
                    <Image
                        style={analysisStyles.emotionButtonImage}
                        source={require ('../../../assets/images/mood/smilewhite.png')}
                    />
                </TouchableOpacity>
            
            <ScrollView>
            <View style={analysisStyles.container}>
            <Text style={{fontFamily:"Roboto-Bold", fontSize: 22, alignSelf: "center", color: "#333", marginBottom: 20, marginTop: 25}}>Speech Analysis</Text>
                <TouchableOpacity
                    onPress={this._handleNavigation.bind(this, "PositiveChart")}
                    style={analysisStyles.listButton}
                >
                    <View style={analysisStyles.moodList}>
                        <Text style={analysisStyles.cardText}>Positive Words</Text>
                        <Text style={analysisStyles.percentage}>{this.state.positivePercentage+"%"}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this._handleNavigation.bind(this, "NegativeChart")}
                    style={analysisStyles.listButton}
                >
                <View style={analysisStyles.moodList}>
                    <Text style={analysisStyles.cardText}>Negative Words</Text><Text style={analysisStyles.percentage}>{this.state.negativePercentage+"%"}</Text>
                </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this._handleNavigation.bind(this, "ScoreChart")}
                    style={analysisStyles.listButton}
                >
                <View style={analysisStyles.moodList}>
                    <Text style={analysisStyles.cardText}>Your Score for your speech today is</Text><Text style={analysisStyles.percentage}>{this.state.scoreToday}/10</Text>
                </View>
                <View style={analysisStyles.moodListMessage}>
                    <Text style={analysisStyles.cardTextMessage}>{this.state.scoreMessage}</Text>
                </View>
                </TouchableOpacity>

                </View>
                </ScrollView>
            </View>
        )
    }
}

const analysisStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingBottom: 200
    },
    emotionButton : {
        position: "absolute",
        bottom: 40,
        right: 20,
        backgroundColor : "rgb(255,68,34)",
        zIndex: 10,
        padding: 15,
        borderRadius: 35,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 7,
    },
    emotionButtonImage : {
        height: 30,
        width: 30
    },
    cardText : {
        fontSize: 17,
        fontFamily: "OpenSans-SemiBold",
        color: "#fff",
        // flex: 1
    },
    backgroundVideo : {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    moodListMessage : {
        marginHorizontal: 20,
        marginVertical: 15,
        borderRadius: 5,
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 10,
    },
    cardTextMessage : {
        fontSize: 15,
        fontFamily: "OpenSans-SemiBold",
        color: "#333",
        // flex: 1
    },
    listButton : {
        marginHorizontal: 20,
        marginVertical: 15,
        borderRadius: 5,
        backgroundColor: "rgb(255,68,34)",
        padding: 20,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 10,
    },
    percentage : {
        textAlign: "right",
        fontSize: 25,
        fontFamily: "Raleway-ExtraBold",
        color: "#Fff",
        marginTop: 10
        // position: "absolute",
        // right: 20,
        // top: 25,
        // flex: 1
    },
    moodImage : {
        height: 65,
        width: 65,
    },
    emotionImage : {
        height: 65,
        width: 65,
    }
});

export default SpeechAnalysis;