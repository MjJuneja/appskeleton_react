import React, {Component} from "react";
import {StyleSheet, View, Text, Image, ScrollView, AsyncStorage, TouchableOpacity, FlatList} from 'react-native';
import SplashScreen from "../splashscreen";
import Toast, {DURATION} from 'react-native-easy-toast';
import axios from 'axios';
import Carousel from 'react-native-snap-carousel';

class KTenTest extends Component {

    constructor(props) {
        super(props);

        this._retrieveData();

        this.state = {
            userData: {},
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
            currentAnswer: 0,
            buttonText: "Next",
            scoreView: false,
            score: 0
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
            this.setState({
                userData
            });
          } else {
              console.log("No data found");
          }
         } catch (error) {
           // Error retrieving data
           console.log(error);
         }
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
        this.setState({currentAnswer: 0});
    }

    nextHandle = ()=> {
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
    }

    // prevHandle = ()=> {
    //     let counter = this.state.currentQuestionCounter;
    //     if(counter!=0) {
    //         this.setState({currentQuestionCounter: counter-1, currentQuestion: this.state.questions[counter-1]})
    //     }
    // }

    render() {
        if(!this.state.scoreView) {
            return(
                <View style={kTenTestStyles.container}>
                <ScrollView>
                    <View style={kTenTestStyles.personalisedMsgWrapper}>
                        <Text style={kTenTestStyles.personalisedMsgText}>Hey Vishal, this is a K10 test to keep a record of your mood on a daily basis. You can take the test only once a day, anytime you want. We will keep a track of your mood on a daily basis to see whether practicing gratitude and monitoring your speech changes your results for your mood over time.</Text>
                    </View>

                    <View style={kTenTestStyles.questionWrapper}>
                        <Text style={kTenTestStyles.question}>{this.state.currentQuestion+"?"}</Text>
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
                    </View>
                    <View style={kTenTestStyles.prevNextButtonWrapper}>
                            {/* <View style={{flex: 1}}>
                                <TouchableOpacity
                                style={kTenTestStyles.prevNextButtons}
                                onPress={this.prevHandle}
                                >
                                    <Text style={kTenTestStyles.prevNextButtonText}>Previous</Text>
                                </TouchableOpacity>
                            </View> */}
                            <View style={{flex: 1}}>
                                <TouchableOpacity
                                    style={kTenTestStyles.prevNextButtons}
                                    onPress={this.nextHandle}
                                >
                                    <Text style={kTenTestStyles.prevNextButtonText}>{this.state.buttonText}</Text>
                                </TouchableOpacity>
                            </View>
                    </View>
                </ScrollView>
                </View>
            )
        } else {
            return (
                <View style={kTenTestStyles.container}>
                <ScrollView>
                    <View>
                        <Text style={kTenTestStyles.score}>Today's Score: {this.state.score}/50</Text>
                    </View>
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

const kTenTestStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f3f4f5"
    },
    personalisedMsgWrapper : {
        margin: 15,
        backgroundColor: "#fff",
        borderRadius: 5
    },
    personalisedMsgText : {
        padding: 15,
        color: "#555",
        fontSize: 15
    },
    questionWrapper : {
        margin: 20,
        backgroundColor: "#fff",
        borderRadius: 3,
        padding: 15
    },
    question : {
        fontSize: 23,
        fontWeight: "700",
    },
    optionButtons : {
        marginTop: 15,
        marginLeft: 5,
        marginRight: 5,
        padding: 15,
        backgroundColor: "orange",
        borderRadius: 10
    },
    optionButtonHighlight : {
        marginTop: 15,
        marginLeft: 5,
        marginRight: 5,
        padding: 15,
        backgroundColor: "green",
        borderRadius: 10
    },
    optionButtonsText : {
        fontSize: 15,
        color: "#fff"
    },
    prevNextButtonWrapper : {
        display: "flex", 
        flexDirection: "row",
        marginBottom: 30
    },
    prevNextButtons : {
        backgroundColor: "green",
        borderRadius: 3,
        padding: 12,
        marginRight: 20,
        marginLeft: 20
    },
    prevNextButtonText : {
        textAlign: "center",
        color: "#fff"
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
        padding: 30,
    },
    scoreDetail : {
        fontSize: 16,
        fontWeight: "500",
        marginTop: 10
    }
});

export default KTenTest;