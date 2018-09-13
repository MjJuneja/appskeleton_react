import React, {Component} from "react";
import {StyleSheet, View, Text, Image, ScrollView, AsyncStorage, TouchableOpacity, FlatList} from 'react-native';
import SplashScreen from "../splashscreen";
import Toast, {DURATION} from 'react-native-easy-toast';
import axios from 'axios';
import Carousel from 'react-native-snap-carousel';

import { BarChart, Grid } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

import BottomNavigation,{FullTab} from 'react-native-material-bottom-navigation';
import { Icon } from 'react-native-elements'

class KTenTest extends Component {

    constructor(props) {
        super(props);

        this._retrieveData();

        this.state = {
            userData: {
                userInfo: {
                    firstName: ""
                }
            },
            questions : [
                "About how often did you feel tired out for no good reason",
                "About how often did you feel nervous",
                "About how often did you feel so nervous that nothing could calm you down",
                "About how often did you feel hopeless",
                "About how often did you feel restless or fidgety",
                "About how often did you feel so restless you could not sit still",
                "About how often did you feel depressed",
                "About how often did you feel that everything was an effort",
                "About how often did you feel so sad that nothing could cheer you up",
                "About how often did you feel worthless"
            ],
            currentQuestion: "About how often did you feel tired out for no good reason",
            currentQuestionCounter: 0,
            options: [
                "None of the time",
                "A little of the time",
                "Some of the time",
                "Most of the time",
                "All of the time"
            ],
            answers : [],
            currentAnswer: 1,
            buttonText: "Next",
            scoreView: false,
            score: 0,
            questionBarWidth: "10",
            splashScreenActive: true
        }
    }

    _retrieveData = async () => {
        console.log("in retrieve data");
        try {
          const userData = await AsyncStorage.getItem('userData');
          if (userData !== null) {
            // We have data!!
            userData = JSON.parse(userData);
            console.log(userData);
            this.checkToken(userData.sessionId);
            this.setState({
                userData
            });
            this.getTestStatus();
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

      getTestStatus = ()=> {

        console.log("loading test status...");
        axios({
            method: 'post',
            url: 'http://13.238.16.112/answer/check-test',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : 'token '+this.state.userData.sessionId
            },
            data: {
                "type":"question"
            }
          }).then(data => {
              console.log(data.data);
              if(data.data.message == "get ready for test") {
                  console.log("test dele bhai");
                  this.setState({scoreView: false})
              } else {
                  this.setState({scoreView: true, questionBarWidth: 100, score: data.data.previousScore});
              }
              this.setState({splashScreenActive: false});
              console.log("after splash screen");
              
          }).catch(err=>{
                console.log(err);  
          });
    }

    submitAnswer = ()=> {
        console.log("in submit", this.state.answers);
        axios({
            method: 'post',
            url: 'http://13.238.16.112/answer/create',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : 'token '+this.state.userData.sessionId
            },
            data: {
                "type":"question",
                "points":this.state.answers
            }
          }).then(data => {
              console.log(data.data);
              this.refs.toast.show(data.data.message, 1000, () => {
                // something you want to do at close
            });
          }).catch(err=>{
                console.log(err);  
          });
    }

    _handleNavigation = (navigateTo)=> {
        console.log(navigateTo);
        const { navigate } = this.props.navigation;
        navigate(navigateTo);
    }

    selectedAnswerHandle = value => {
        console.log(value);
        this.setState({currentAnswer: value});
    }

    responseHandle = ()=> {
        console.log(this.state.currentAnswer);
        if(this.state.currentAnswer != 0 && this.state.currentQuestionCounter!=10) {
            let temp = this.state.answers;
            temp.push(this.state.currentAnswer);
            this.setState({answers: temp});
            console.log(temp);
        }
        this.setState({currentAnswer: 1});
    }

    nextHandle = ()=> {
        let tempProgressBar = 1;
        tempProgressBar = ((100*(this.state.currentQuestionCounter+2))/(this.state.questions.length));
        if(this.state.buttonText == "Next") {
            this.responseHandle();
            let counter = this.state.currentQuestionCounter;
            if(counter!=9) {
                this.setState({currentQuestionCounter: counter+1, currentQuestion: this.state.questions[counter+1]})
            }
            if(counter==8) {
                this.setState({buttonText: "Submit"});
            }
        } else {
            let temp = this.state.answers;
            let sum = 0;
            temp.push(this.state.currentAnswer);
            temp.map((val) => {
                sum += val;
            });
            this.submitAnswer();
            this.setState({scoreView: true, score: sum});
        }
        this.setState({questionBarWidth: tempProgressBar});
    }

    // prevHandle = ()=> {
    //     let counter = this.state.currentQuestionCounter;
    //     if(counter!=0) {
    //         this.setState({currentQuestionCounter: counter-1, currentQuestion: this.state.questions[counter-1]})
    //     }
    // }

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
        if(this.state.splashScreenActive) {
            return <SplashScreen />
        } else {
        if(!this.state.scoreView) {
            return(
                <View style={kTenTestStyles.container}>
                <TouchableOpacity
                    onPress={this._handleNavigation.bind(this, "EmotionScreen")}
                    style={kTenTestStyles.emotionButton}
                >
                    <Image
                        style={kTenTestStyles.emotionButtonImage}
                        source={require ('../../assets/images/mood/smilewhite.png')}
                    />
                </TouchableOpacity>
                <BottomNavigation
                renderTab={this.renderTab}
                tabs={this.tabs}
                onTabPress={activeTab => this._handleNavigation(activeTab.navigate)}
            /> 
                <ScrollView>


                <Text style={kTenTestStyles.disclaimerTaken}>Disclaimer - This test is not intended to be a replacement for treatment nor any sort of medical intervention.{"\n"}You are only required to do this test once a day.</Text>

                 <Text style={kTenTestStyles.questionDescription}>Hey {this.state.userData.userInfo.firstName}, this is a K10 test to keep a record of your mood on a daily basis. You can take the test only once a day, anytime you want. We will keep a track of your mood on a daily basis to see whether practicing gratitude and monitoring your speech changes your results for your mood over time.</Text>

                    <View style={kTenTestStyles.questionWrapper}>
                        {/* <View style={kTenTestStyles.totalQuestionsBar}>
                            <View style={[kTenTestStyles.totalQuestionsBarStatus, {width: this.state.questionBarWidth+"%"}]}></View>
                        </View> */}
                        <View style={kTenTestStyles.q}>
                            <Text style={kTenTestStyles.question}>{"Q"+(this.state.currentQuestionCounter+1) + ") "+ this.state.currentQuestion+"?"}</Text>
                        </View>
                        <View style={kTenTestStyles.optionWrapper}>
                        <FlatList
                            data={[
                                {key: "option1", value: "0"},
                                {key: "option2", value: "1"},
                                {key: "option3", value: "2"},
                                {key: "option4", value: "3"},
                                {key: "option5", value: "4"},
                            ]}
                            renderItem={({item}) => 
                            <TouchableOpacity
                                style={this.state.currentAnswer==parseInt(item.value)+1 ? kTenTestStyles.optionButtonHighlight : kTenTestStyles.optionButtons}
                                onPress={this.selectedAnswerHandle.bind(this, parseInt(item.value)+1)}
                            >
                                <Text style={kTenTestStyles.optionButtonsText}>{this.state.options[item.value]}</Text>
                            </TouchableOpacity>
                            }
                        />

                            <TouchableOpacity  onPress={this.nextHandle} style={{alignSelf: "center", backgroundColor: "#FF7417", borderRadius: 5, marginTop: 25, paddingVertical: 7, paddingHorizontal: 25, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 50,
        elevation: 4,}}>
                                <Icon size={25} color="#fff" name="navigate-next"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* <View style={kTenTestStyles.prevNextButtonWrapper}>
                            {/* <View style={{flex: 1}}>
                                <TouchableOpacity
                                style={kTenTestStyles.prevNextButtons}
                                onPress={this.prevHandle}
                                >
                                    <Text style={kTenTestStyles.prevNextButtonText}>Previous</Text>
                                </TouchableOpacity>
                            </View> *
                            <View style={{flex: 1}}>
                                <TouchableOpacity
                                    style={kTenTestStyles.prevNextButtons}
                                    onPress={this.nextHandle}
                                >
                                    <Text style={kTenTestStyles.prevNextButtonText}>{this.state.buttonText}</Text>
                                </TouchableOpacity>
                            </View>
                    </View> */}
                </ScrollView>
                </View>
            )
        } else {
            return (
                <View style={kTenTestStyles.container}>
                <TouchableOpacity
                    onPress={this._handleNavigation.bind(this, "EmotionScreen")}
                    style={kTenTestStyles.emotionButton}
                >
                    <Image
                        style={kTenTestStyles.emotionButtonImage}
                        source={require ('../../assets/images/mood/smilewhite.png')}
                    />
                </TouchableOpacity>
                <BottomNavigation
                renderTab={this.renderTab}
                tabs={this.tabs}
                onTabPress={activeTab => this._handleNavigation(activeTab.navigate)}
            /> 
                <ScrollView>

                <Text style={kTenTestStyles.disclaimerTaken}>Disclaimer - This test is not intended to be a replacement for treatment nor any sort of medical intervention.{"\n"}You are only required to do this test once a day.</Text>

                <View style={kTenTestStyles.soluctionFocus}><Text style={kTenTestStyles.takenText}>Solution Focus Test Score</Text></View>

                <TouchableOpacity
                            onPress={this._handleNavigation.bind(this, "KTenTestQuestionChart")}
                        >


                    <View style={kTenTestStyles.questionWrapperTaken}>
                        {/* <View style={kTenTestStyles.totalQuestionsBar}>
                            <View style={[kTenTestStyles.totalQuestionsBarStatus, {width: this.state.questionBarWidth+"%"}]}></View>
                        </View> */}
                        <Text style={kTenTestStyles.scoreText}>Today's Score:</Text>
                        <Text style={kTenTestStyles.score}>{this.state.score}/50</Text>
                        {/* <Text>{this.state.timeRemaining}</Text> */}
                    </View>
                    </TouchableOpacity>

                    <View style={kTenTestStyles.scoreDetailWrapper}>
                        <Text style={kTenTestStyles.scoreDetail}>If you received a score between</Text>
                        <Text style={kTenTestStyles.scoreDetail}>10 - 19 You are likely to be well</Text>
                        <Text style={kTenTestStyles.scoreDetail}>20 - 24 Likely to have a mild issue with mood</Text>
                        <Text style={kTenTestStyles.scoreDetail}>25 - 29 Likely to have a moderate issue with mood</Text>
                        <Text style={kTenTestStyles.scoreDetail}>30 - 50 Likely to have a severe issue with mood</Text>
                    </View>
                </ScrollView>
                </View>
            )
        }
    }
    }
}

const kTenTestStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    emotionButton : {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor : "#FD6A02",
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
    disclaimer : {
        color: "#C21807",
        padding: 16,
        paddingBottom: 0,
        fontSize: 15,
        fontFamily: "OpenSans-Bold"
    },
    soluctionFocus : {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 50,
        elevation: 4,
        margin: 15,
        marginTop: 20,
        backgroundColor: "#FD6A02",
        borderRadius: 5
    },
    takenText : {
        fontSize: 20,
        fontFamily: "Raleway-Medium",
        textAlign: "center",
        margin: 20,
        marginHorizontal: 30,
        color: "#fff"
    },

    questionDescription : {
        marginTop: 15,
        marginHorizontal: 20,
        padding: 20,
        paddingHorizontal: 30,
        borderRadius: 5,
        backgroundColor: "#FF7417",
        lineHeight: 25,
        fontSize: 16 ,
        color: "#fafafa",
        fontFamily: "OpenSans-SemiBold",
        justifyContent: "center",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 10
    },
    questionWrapperTaken : {
        marginTop: 20,
        backgroundColor: "#FD6A02",
        borderRadius: 5,
        padding: 10,
        paddingTop: 0,
        paddingBottom: 16,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 50,
        elevation: 4,
        marginBottom: 40
    },
    disclaimerTaken : {
        marginTop: 20,
        marginBottom: 15,
        borderRadius: 5,
        padding: 20,
        paddingHorizontal: 30,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 50,
        elevation: 4,
        color: "#C21807",
        fontSize: 15,
        fontFamily: "OpenSans-Bold",
        backgroundColor: "#fff",

    },
    personalisedMsgWrapper : {
        marginVertical: 15,
        backgroundColor: "#fff",
        borderRadius: 5
    },
    personalisedMsgText : {
        padding: 16,
        color: "#444",
        fontSize: 15,
        fontFamily: "OpenSans-SemiBold"
    },

    optionWrapper : {
        marginHorizontal: 5,
        padding: 20,
        paddingBottom: 30,
        paddingHorizontal: 30,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: "#fff",
        justifyContent: "center",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 10,
        marginBottom: 55
    },
    questionWrapper : {
        marginTop: 20,
        marginBottom: 20,
        // backgroundColor: "#fff",
        borderRadius: 3,
        padding: 15
    },
    totalQuestionsBar : {
        height: 3,
        backgroundColor: "lightblue",
        marginBottom: 13,
        marginLeft: -15,
        marginRight: -15,
        marginTop: -15
    },
    totalQuestionsBarStatus : {
        height: 3,
        backgroundColor: "blue"
    },
    q  : {
        marginHorizontal: 5,
        padding: 20,
        paddingHorizontal: 30,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        backgroundColor: "#FF7417",
        justifyContent: "center",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 10
    },
    question : {
        lineHeight: 25,
        fontSize: 16 ,
        color: "#fafafa",
        fontFamily: "OpenSans-SemiBold",
    },
    optionButtons : {
        marginTop: 15,
        marginLeft: 5,
        marginRight: 5,
        padding: 15,
        backgroundColor: "orange",
        borderRadius: 10,
        width: "80%",
        alignSelf: "center"
    },
    optionButtonHighlight : {
        marginTop: 15,
        marginLeft: 5,
        marginRight: 5,
        padding: 15,
        backgroundColor: "green",
        borderRadius: 10,
        width: "auto"
    },
    optionButtonsText : {
        fontSize: 15,
        color: "#fff",
        textAlign: "center",
        fontFamily : "Roboto-Medium"
    },
    prevNextButtonWrapper : {
        display: "flex", 
        flexDirection: "row",
        marginBottom: 30
    },
    prevNextButtons : {
        backgroundColor: "#FD6A02",
        borderRadius: 3,
        padding: 12,
        marginRight: 20,
        marginLeft: 20,
        marginBottom: 80
    },
    prevNextButtonText : {
        alignSelf: "center",
        color: "#fff",
        fontFamily: "OpenSans-SemiBold"
    },
    score: {
        margin: 20,
        padding: 30,
        fontSize: 25,
        textAlign: "center",
        backgroundColor: "green",
        color: "#fff",
        borderRadius: 10
    },
    scoreDetailWrapper : {
        marginBottom: 100,
        borderRadius: 5,
        padding: 20,
        paddingHorizontal: 30,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 50,
        elevation: 4,
        backgroundColor: "#fff",
    },
    scoreText : {
        alignSelf: "flex-start",
        fontSize: 17,
        fontFamily: "OpenSans-SemiBold",
        marginTop: 20,
        marginBottom: 10,
        marginHorizontal: 20,
        color: "#Fff"
    },
    
    score: {
        alignSelf: "flex-end",
        color: "#fff",
        fontSize: 50,
        fontFamily: "Raleway-ExtraBold",
        marginHorizontal: 20,
    },
    scoreDetail : {
        fontSize: 16,
        fontWeight: "500",
        marginTop: 10
    }
});

export default KTenTest;