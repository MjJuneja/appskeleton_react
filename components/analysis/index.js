import React, {Component} from "react";
import {StyleSheet, View, Text, Image, AsyncStorage, TouchableOpacity, ScrollView} from 'react-native';
import SplashScreen from "../splashscreen";
import Toast, {DURATION} from 'react-native-easy-toast';
import axios from 'axios';


import BottomNavigation,{FullTab} from 'react-native-material-bottom-navigation';
import { Icon } from 'react-native-elements'
import moment from 'moment';

class Analysis extends Component {

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
            splashScreenActive: true,
            startDate : moment().startOf('day').add(5, 'hours').add(30,'minutes').toDate().toISOString(),
            endDate: moment().startOf('day').add(5, 'hours').add(30,'minutes').add(1, "days").toDate().toISOString(),
            image: <Image style={analysisStyles.emotionImage} source={require ('../../assets/images/logo/logo.png')} />
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
            this.getChartDataSentiment();
          } else {
              console.log("No data found");
          }
            let image;
            if(currentMood=="Very Good") {
                image = <Image style={analysisStyles.emotionImage} source={require ('../../assets/images/mood/very_good.png')} />;
            } else if (currentMood=="Good") {
                image = <Image style={analysisStyles.emotionImage} source={require ('../../assets/images/mood/good.png')} />;
            } else if (currentMood=="Moderate") {
                image = <Image style={analysisStyles.emotionImage} source={require ('../../assets/images/mood/moderate.png')} />;
            } else if (currentMood=="Bad") {
                image = <Image style={analysisStyles.emotionImage} source={require ('../../assets/images/mood/bad.png')} />;
            } else if (currentMood=="Very Bad") {
                image = <Image style={analysisStyles.emotionImage} source={require ('../../assets/images/mood/very_bad.png')} />;
            } else {
                image = <Image style={analysisStyles.emotionImage} source={require ('../../assets/images/logo/logo.png')} />;   
            }
            this.setState({image});
            console.log(image);
            if(currentMood !== null) {
                this.setState({currentMood});
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
              positivePercentage = ((sumP*100)/(sumN+sumP+sumNeu)).toFixed(0) | 0;
              negativePercentage = ((sumN*100)/(sumN+sumP+sumNeu)).toFixed(0) | 0;
              console.log("positive", positivePercentage, " negative", negativePercentage);
              this.setState({positivePercentage, negativePercentage});
            //   let tempGraphData = {"positive": [], "negative": []};
            //   for(let i=0; i<len; i++) {
            //     tempGraphData.positive.push(0);
            //     tempGraphData.negative.push(0);
            //     labels.push(date1+i);
            //   }
            //   this.setState({graphData:tempGraphData});
            //   let temp = data.data.data;
            // //   this.refs.toast.show(data.data.message, 1000, () => {
            // //     // something you want to do at close
            // // });
            // temp.map((value)=>{
            //     let tempDate = new Date(value.createdOn);
            //     tempDate = tempDate.getDate();
            //     let pos = tempDate - date1;
            //     tempGraphData.positive[pos]+=value.positive;
            //     tempGraphData.negative[pos]+=value.negative;
            // });
            // let dataNow = {
            //     labels,
            //     datasets: [{
            //         data : tempGraphData.positive
            //     }]
            // }
            // this.setState({graphData: tempGraphData, dataNow : dataNow});
            // console.log("final data", tempGraphData);
          }).catch(err=>{
                console.log(err);  
          });
    }

    getChartDataSentiment = () => {
        console.log('in get chart data');
        axios({
            method: 'post',
            url: 'http://13.238.16.112/sentiment/getSentiment',
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
              let sum =  0;
              totalData.map(value=>{
                sum+=value.score;
              });
              console.log("sum", sum);
              sentimentsPercentage = parseInt((sum*100).toFixed(2))|0;
              console.log("sentiment", sentimentsPercentage);
              this.setState({sentimentsPercentage, splashScreenActive: false});
            //   let tempGraphData = {"positive": [], "negative": []};
            //   for(let i=0; i<len; i++) {
            //     tempGraphData.positive.push(0);
            //     tempGraphData.negative.push(0);
            //     labels.push(date1+i);
            //   }
            //   this.setState({graphData:tempGraphData});
            //   let temp = data.data.data;
            // //   this.refs.toast.show(data.data.message, 1000, () => {
            // //     // something you want to do at close
            // // });
            // temp.map((value)=>{
            //     let tempDate = new Date(value.createdOn);
            //     tempDate = tempDate.getDate();
            //     let pos = tempDate - date1;
            //     tempGraphData.positive[pos]+=value.positive;
            //     tempGraphData.negative[pos]+=value.negative;
            // });
            // let dataNow = {
            //     labels,
            //     datasets: [{
            //         data : tempGraphData.positive
            //     }]
            // }
            // this.setState({graphData: tempGraphData, dataNow : dataNow});
            // console.log("final data", tempGraphData);
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
                <BottomNavigation
                renderTab={this.renderTab}
                tabs={this.tabs}
                onTabPress={activeTab => this._handleNavigation(activeTab.navigate)}
                // style={{marginBottom: 50}}
            />
            <TouchableOpacity
                    onPress={this._handleNavigation.bind(this, "EmotionScreen")}
                    style={analysisStyles.emotionButton}
                >
                    <Image
                        style={analysisStyles.emotionButtonImage}
                        source={require ('../../assets/images/mood/smilewhite.png')}
                    />
                </TouchableOpacity>
            
            <ScrollView>
            <View style={analysisStyles.container}>
            <Text style={{fontFamily:"Raleway-Bold", fontSize: 20, alignSelf: "center", marginBottom: 20, marginTop: 25}}>Today's Analysis</Text>
                <TouchableOpacity
                    onPress={this._handleNavigation.bind(this, "PositiveChart")}
                    style={analysisStyles.listButton}
                >
                    <View style={analysisStyles.moodList}>
                        <Text style={analysisStyles.cardText}>Positive Words</Text><Text style={analysisStyles.percentage}>{this.state.positivePercentage+"%"}</Text>
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
                    onPress={this._handleNavigation.bind(this, "SentimentChart")}
                    style={analysisStyles.listButton}
                >
                <View style={analysisStyles.moodList}>
                    <Text style={analysisStyles.cardText}>Sentiments</Text><Text style={analysisStyles.percentage}>{this.state.sentimentsPercentage+"%"}</Text>
                </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={analysisStyles.listButton}
                >
                    <View style={analysisStyles.moodList}>
                        <Text style={analysisStyles.cardText}>Mood</Text><Text style={analysisStyles.percentage}>
                            <Image
                                style={analysisStyles.moodImage}
                                source={require ('../../assets/images/mood/very_good.png')}
                            />
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[analysisStyles.listButton, {paddingBottom: 0}]}
                >
                    <View style={analysisStyles.moodList}>
                        <Text style={analysisStyles.cardText}>Emotion</Text>
                        <View style={{alignSelf: "flex-end"}}>
                            {this.state.image}
                        </View>
                        {/* <View>
                            {this.state.image}
                        </View> */}
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
        backgroundColor: "#f4f5f8",
        paddingBottom: 100
    },
    emotionButton : {
        position: "absolute",
        bottom: 60,
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
    cardText : {
        fontSize: 17,
        fontFamily: "OpenSans-SemiBold",
        color: "#333",
        position: "relative",
        top: 7
    },
    backgroundVideo : {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    moodList : {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 5
    },
    listButton : {
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 5,
        paddingBottom: 20,
        backgroundColor: "#fff"
    },
    percentage : {
        alignSelf: "flex-end",
        fontSize: 22,
        fontWeight: "500",
        color: "#FF7417",
        position: "absolute",
        right: 20,
        top: 25
    },
    moodImage : {
        height: 65,
        width: 65,
        marginTop: -18,
    },
    emotionImage : {
        height: 32,
        width: 32,
        marginTop: -14
    }
});

export default Analysis;