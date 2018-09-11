import React, {Component} from "react";
import {StyleSheet, View, Text, Slider, Image, ScrollView, BackHandler, ProgressBarAndroid, TouchableOpacity, FlatList, AsyncStorage, Button} from 'react-native';
import SplashScreen from "../splashscreen";
import Toast, {DURATION} from 'react-native-easy-toast';
import axios from 'axios';
import Carousel from 'react-native-snap-carousel';
import BottomNavigation,{FullTab} from 'react-native-material-bottom-navigation'
import { Icon } from 'react-native-elements'
import Voice from 'react-native-voice';
import moment from 'moment';

import AlertBox from '../alert';

const fill = 'rgb(134, 65, 244)'
const data   = [ 50, 10, 40, 95, -4, -24, null, 85, undefined, 0, 35, 53, -53, 24, 50, -20, -80 ]

class Home extends Component {

    constructor(props) {
        super(props);
        let quoteDate = moment().toDate().getDate();
        if(quoteDate==31) {
            quoteDate = 1;
        }
        this._retrieveData();

        this.state = {
            quotes : [
                {
                    quote: "We can complain because rose bushes have thorns, or rejoice because thorns have roses.",
                    author : "Alphonse Karr"
                },
                {
                    quote: "Do just once what others say you can't do, and you will never pay attention to their limitations again.",
                    author: "James R. Cook"
                },
                {
                    quote: "Don't let life discourage you; everyone who got where he is had to begin where he was.",
                    author: "Richard L. Evan"
                },
                {
                    quote: "Twenty years from now you will be more disappointed by the things you didn't do, than by the ones you did. So throw off the bowlines. Sail away from the safe harbor. Catch the trade winds in your sails. Explore, Dream, Discover.",
                    author: "Mark Twain"
                },
                {
                    quote: "Many of life's failures are experienced by people who did not realize how close they were to success when they gave up.",
                    author: "Thomas Edison"
                },
                {
                    quote: "When one door closes, another opens. But we often look so regretfully upon the closed door that we don't see the one that has opened for us.",
                    author: "Alexander Graham Bell"
                },
                {
                    quote: "Forget past mistakes. Forget failures. Forget about everything except what you're going to do now - and do it.",
                    author: "William Durant"
                },
                {
                    quote: "Man is fond of counting his troubles, but he does not count his joys. If he counted them up as he ought to, he would see that every lot has enough happiness provided for it.",
                    author: "Fyodor Dostoevsky"
                },
                {
                    quote: "If you could only sense how important you are to the lives of those you meet; how important you can be to the people you may never even dream of. There is something of yourself that you leave at every meeting with another person.",
                    author: "Fred Rogers"
                },
                { 
                    quote: "Sometimes your joy is the source of your smile, but sometimes your smile can be the source of your joy.",
                    author: "Thich Nhat Hanh"
                },
                {
                    quote: "The greatest degree of inner tranquility comes from the development of love and compassion. The more we care for the happiness of others, the greater is our own sense of well-being.",
                    author: "Tenzin Gyatso"
                },
                {
                    quote: "Every blade of grass has its angel that bends over it and whispers, 'Grow, grow.'",
                    author: "The Talmud"
                },
                {
                    quote: "When you follow your bliss... doors will open where you would not have thought there would be doors; and where there wouldn't be a door for anyone else.",
                    author: "Joseph Campbell"
                },
                {
                    quote: "The future belongs to those who believe in the beauty of their dreams.",
                    author: "Eleanor Roosevelt"
                },
                {
                    quote: "There will be obstacles. There will be doubters. There will be mistakes. But with hard work, there are no limits",
                    author: "Michael Phelps"
                },
                {
                    quote: "The Way Get Started Is To Quit Talking And Begin Doing.",
                    author: "Walt Disney"
                },
                {
                    quote: "It’s Not Whether You Get Knocked Down, It’s Whether You Get Up.",
                    author: "Inspirational Quote By Vince Lombard"
                },
                {
                    quote: "Be mindful. Be grateful. Be positive. Be true. Be kind.",
                    author: "Roy T. Bennett"
                },
                {
                    quote: "Let us be grateful to the people who make us happy; they are the charming gardeners who make our souls blossom.",
                    author: "Marcel Proust"
                },
                {
                    quote: "Always remember people who have helped you along the way, and don’t forget to lift someone up.",
                    author: "Roy T. Bennett"
                },
                {
                    quote: "Being grateful does not mean that everything is necessarily good. It just means that you can accept it as a gift.",
                    author: "Roy T. Bennett"
                },
                {
                    quote: "When one has a grateful heart, life is so beautiful.",
                    author: "Roy T. Bennett"
                },
                {
                    quote: "‘Thank you’ is the best prayer that anyone could say. I say that one a lot. Thank you expresses extreme gratitude, humility, understanding.",
                    author: "Alice Walker"
                },
                {
                    quote: "The roots of all goodness lie in the soil of appreciation for goodness.",
                    author: "Dalai Lama"
                },
                {
                    quote: "He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has.",
                    author: "Epictetus"
                },
                {
                    quote: "Gratitude is more of a compliment to yourself than someone else.",
                    author: "Raheel Farooq"
                },
                {
                    quote: "I would maintain that thanks are the highest form of thought, and that gratitude is happiness doubled by wonder.",
                    author: "Gilbert K. Chesterton"
                },
                {
                    quote: "Be thankful for what you have; you’ll end up having more. If you concentrate on what you don’t have, you will never, ever have enough.",
                    author: "Oprah Winfrey"
                },
                {
                    quote: "We can only be said to be alive in those moments when our hearts are conscious of our treasures.",
                    author: "Thornton Wilder"
                },
                {
                    quote: "The deepest craving of human nature is the need to be appreciated.",
                    author: "William James"
                }
            ],
            quoteDate,
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
            score: 0,
            sliderValue: [1,1,1],
            userData: {
                userInfo: {
                    firstName: ""
                }
            },
            loading: false,
            questionBarWidth: "33.333333",
            questions : [
                "If 10 is the most gratitude you have ever felt and 1 is the most hopelessness, what number would you put yourself now",
                "If 1 is the most depressed you have ever felt and 10 is the most happiest you have every felt, what number would you put yourself now",
                "If 1 is the most anxious you have ever felt and 10 is the most relaxed you have ever felt, what number would you put yourself now"
            ],
            showAlert: false,
            splashScreenActive: true,
            timeRemaining: 0
        }
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

    _retrieveData = async () => {
        console.log("in retrieve data");
        try {
          const userData = await AsyncStorage.getItem('userData');
        //   const micFlag = await AsyncStorage.getItem('micFlag');
          if (userData !== null) {
            // We have data!!
            userData = JSON.parse(userData);
            console.log(userData);
            this.checkToken(userData.sessionId);
            this.setState({userData});
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

    componentDidMount() {
        console.log("component mounted");
        const { navigate } = this.props.navigation;
        console.log(this.props);
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
                "type":"home"
            }
          }).then(data => {
              console.log(data.data);
              if(data.data.message == "get ready for test") {
                  console.log("test dele bhai");
                  this.setState({scoreView: false})
              } else {
                  this.setState({scoreView: true, questionBarWidth: 100, score: data.data.previousScore});
              }
            //   this.refs.toast.show(data.data.message, 1000, () => {
            //     // something you want to do at close
            // });
            this.setState({splashScreenActive: false});
          }).catch(err=>{
                console.log(err);  
          });
    }

    submitAnswer = ()=> {
        console.log("in submit", this.state.sliderValue);
        axios({
            method: 'post',
            url: 'http://13.238.16.112/answer/create',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : 'token '+this.state.userData.sessionId
            },
            data: {
                "type":"home",
                "points":this.state.sliderValue
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

    submitHandle = ()=> {
            let sum = 0;
            let temp = this.state.sliderValue;
            temp.map((val) => {
                sum += val;
            });
            this.submitAnswer();
            this.setState({scoreView: true, score: sum});
    }

    sliderValueHandler = (i, value) => {
        console.log("i= ",i, " value= ",value);
        let temp = this.state.sliderValue;
        temp[i] = value;
        console.log(temp);
        this.setState({sliderValue: temp})
    }

    _handleNavigation = (navigateTo)=> {
        console.log(navigateTo);
        const { navigate } = this.props.navigation;
        navigate(navigateTo);
    }

    nextHandle = ()=> {
        let tempProgressBar = 1;
        tempProgressBar = ((100*(this.state.currentQuestionCounter+2))/(this.state.questions.length));
        if(this.state.buttonText == "Next") {
            // this.responseHandle();
            let counter = this.state.currentQuestionCounter;
            if(counter!=2) {
                this.setState({currentQuestionCounter: counter+1, currentQuestion: this.state.questions[counter+1]})
            }
            if(counter==1) {
                this.setState({buttonText: "Submit"});
            }
        } else {
            this.submitHandle();
        }
        console.log("width", tempProgressBar);
        this.setState({questionBarWidth: tempProgressBar});
    }

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
        const {showAlert} = this.state;
        // const fill = 'rgb(134, 65, 244)';
        // const data   = [ 50, 10, 40, 95, -4, -24, null, 85, undefined, 0, 35, 53, -53, 24, 50, -20, -80 ];

            return(
                this.state.splashScreenActive ? <SplashScreen /> : 
                <View style={kTenTestStyles.container}>
                
                <AlertBox showAlert={this.state.showAlert}/>
                 <BottomNavigation
                    renderTab={this.renderTab}
                    tabs={this.tabs}
                    onTabPress={activeTab => this._handleNavigation(activeTab.navigate)}
                /> 
                <Toast ref="toast"  position='top'/>
               
                <TouchableOpacity
                    onPress={this._handleNavigation.bind(this, "EmotionScreen")}
                    style={kTenTestStyles.emotionButton}
                >
                    <Image
                        style={kTenTestStyles.emotionButtonImage}
                        source={require ('../../assets/images/mood/smilewhite.png')}
                    />
                </TouchableOpacity>
                <ScrollView>
                    
                <View style={kTenTestStyles.personalisedMsgWrapper}>
                        <View style={kTenTestStyles.tipOfTheDayHeadingContainer}>
                            <Text style={kTenTestStyles.tipOfTheDayHeading}>Quote of the Day</Text>
                            <Icon size={30} color="#FD6A02" containerStyle={kTenTestStyles.tipOfTheDayIcon} name={"flag"} />
                        </View>
                        <Text style={kTenTestStyles.tipOfTheDayQuote}>"{this.state.quotes[this.state.quoteDate].quote}"</Text>
                        <Text style={kTenTestStyles.tipOfTheDayAuthor}> {'- '+this.state.quotes[this.state.quoteDate].author}</Text>
                    </View>
                    {!this.state.scoreView ?
                   ( 
                   <View>

                    <View style={kTenTestStyles.questionWrapper}>
                        <View style={kTenTestStyles.totalQuestionsBar}>
                            <View style={[kTenTestStyles.totalQuestionsBarStatus, {width: this.state.questionBarWidth+"%"}]}></View>
                        </View>
                        <Text style={kTenTestStyles.questionDescription}>Hey {this.state.userData.userInfo.firstName}, for us to be able to help you focus on abundance through positive speech, we would like to help you monitor your progress. If you can answer the three questions below, we can help you keep a track of your progress: on a scale of 1-10.</Text>
                        <View style={kTenTestStyles.q}>
                   <Text style={kTenTestStyles.question}>{"Q"+(this.state.currentQuestionCounter+1) + ") " + this.state.questions[this.state.currentQuestionCounter]}?</Text>
                            
                        </View>
                    </View>
                    <Text style={{ color: "#999", fontFamily:"Roboto-Medium", padding: 10}}>Use the slider below to choose between 1 to 10.</Text>
                    <View style={kTenTestStyles.sliderStyle}>
                        <Slider
                            minimumValue={1}
                            maximumValue={10}
                            step={1}
                            minimumTrackTintColor={"#FD6A02"}
                            maximumTrackTintColor={"#FD6A02"}
                            thumbTintColor={"#FD6A02"}
                            value={this.state.sliderValue[this.state.currentQuestionCounter]}
                            onValueChange={this.sliderValueHandler.bind(this, this.state.currentQuestionCounter)}
                        />
                    </View>
                    <Text style={{alignSelf:"flex-end", fontSize: 50, fontFamily:"Raleway-ExtraBold", padding: 20, color: "#FD6A02"}}>{this.state.sliderValue[this.state.currentQuestionCounter]}</Text>

                    <View style={kTenTestStyles.prevNextButtonWrapper}>
                            <View style={{flex: 1}}>
                                <TouchableOpacity
                                    style={kTenTestStyles.prevNextButtons}
                                    onPress={this.nextHandle}
                                >
                                    <Text style={kTenTestStyles.prevNextButtonText}>{this.state.buttonText}</Text>
                                </TouchableOpacity>
                            </View>
                        </View> 
                        </View>)
                    : 
                   (
                    <View>   
                        <TouchableOpacity
                            onPress={this._handleNavigation.bind(this, "HomeQuestionChart")}
                        >
                    <View style={[kTenTestStyles.questionWrapper, kTenTestStyles.questionWrapperTaken]}>
                        <View style={kTenTestStyles.totalQuestionsBar}>
                            <View style={[kTenTestStyles.totalQuestionsBarStatus, {width: this.state.questionBarWidth+"%"}]}></View>
                        </View>
                        <View><Text style={kTenTestStyles.takenText}>Solution Focus Test Score</Text></View>
                        <Text style={kTenTestStyles.scoreText}>Today's Score:</Text>
                        <Text style={kTenTestStyles.score}>{this.state.score}/30</Text>
                        {/* <Text>{this.state.timeRemaining}</Text> */}
                    </View>
                    </TouchableOpacity>


                        </View>)
                    }
                </ScrollView>
                
                </View>
            )
    }
}

const kTenTestStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f5f8"
    },
    emotionButton : {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor : "orangered",
        zIndex: 10,
        padding: 15,
        borderRadius: 35
    },
    emotionButtonImage : {
        height: 30,
        width: 30
    },
    personalisedMsgWrapper : {
        position: "relative",
        margin: 15,
        backgroundColor: "#fff",
        borderRadius: 5,
        borderRadius: 8,
        zIndex: 2
    },
    tipOfTheDayBackground : {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: -1,
        height: "100%",
        borderRadius: 8
    },
    tipOfTheDayIcon : {
        backgroundColor: "#fff",
        alignSelf: "center",
        paddingBottom: 5
    },
    tipOfTheDayHeadingContainer : {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderWidth: 1,
        borderColor: "#e9e9e9",
        borderBottomColor: "#f2f2f2"
    },
    tipOfTheDayHeading : {
        backgroundColor: "#fff",
        fontSize: 16,
        paddingTop: 10,
        paddingLeft: 25,
        paddingRight: 25,
        fontFamily: "Roboto-Medium",
        borderRadius: 8,
        color: "#333",
        textAlign: "center"
    },
    tipOfTheDayQuote : {
        paddingTop: 12,
        paddingLeft: 25,
        paddingRight: 25,
        color: "#333",
        fontSize: 16,
        backgroundColor: "#fafafa",
        borderColor: "#e9e9e9",
        borderLeftWidth: 1,
        borderRightWidth: 1,
        fontFamily: "OpenSans-Regular"
    },
    tipOfTheDayAuthor : {
        paddingLeft: 25,
        paddingRight: 25,
        paddingBottom: 12,
        color: "#555",
        fontSize: 15,
        backgroundColor: "#fafafa",
        borderColor: "#e9e9e9",
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        fontFamily: "Roboto-Medium",
        paddingTop: 5
    },
    questionWrapper : {
        backgroundColor: "#fff",
        padding: 10,
        paddingTop: 0,
        paddingBottom: 13,
        marginTop: 10
    },
    totalQuestionsBar : {
        height: 3,
        backgroundColor: "lightblue",
        marginBottom: 13,
        marginLeft: -10,
        marginRight: -10
    },
    totalQuestionsBarStatus : {
        height: 3,
        backgroundColor: "blue"
    },
    q  : {
        // backgroundColor: "#FD6A02",
        // borderRadius: 8,
        // padding: 10,
        marginTop: 10
    },
    question : {
        fontSize: 18,
        fontFamily: "OpenSans-SemiBold",
        color: "#222"
    },
    optionButtons : {
        marginTop: 15,
        marginLeft: 5,
        marginRight: 5,
        padding: 15,
        backgroundColor: "orange",
        borderRadius: 10,
        alignSelf: "center"
    },
    optionButtonHighlight : {
        marginTop: 15,
        marginLeft: 5,
        marginRight: 5,
        padding: 15,
        backgroundColor: "#FD6A02",
        borderRadius: 10,
        width: "30%"
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
        backgroundColor: "#FD6A02",
        borderRadius: 3,
        padding: 12,
        marginRight: 20,
        marginLeft: 20
    },
    prevNextButtonText : {
        alignSelf: "center",
        color: "#fff",
        fontFamily: "OpenSans-SemiBold"
    },
    questionWrapperTaken : {
        marginTop: 40
    },
    takenText : {
        fontSize: 30,
        fontFamily: "Raleway-Medium",
        textAlign: "center",
        margin: 20
    },
    scoreText : {
        alignSelf: "flex-start",
        fontSize: 16,
        fontFamily: "Roboto-Medium",
        marginTop: 20
    },
    score: {
        alignSelf: "flex-end",
        color: "#FD6A02",
        fontSize: 50,
        fontFamily: "Raleway-ExtraBold"
    },
    scoreDetailWrapper : {
        padding: 30,
    },
    scoreDetail : {
        fontSize: 16,
        fontWeight: "500",
        marginTop: 10
    },
    questionDescription : {
        color: "#999",
        fontSize: 16,
        fontFamily: "Roboto-Medium"
    },
    sliderStyle: {
        margin: 10, 
        padding: 10, 
        // backgroundColor: "#FFF", 
        borderRadius: 2,
    }
});

export default Home;