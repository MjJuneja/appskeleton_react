import React from 'react';
import axios from 'axios';
import moment from 'moment';
import {StyleSheet, Button, View, AsyncStorage, Text, ScrollView, TouchableOpacity, ProgressBarAndroid, Dimensions} from "react-native";
import { Icon } from 'react-native-elements';

import { BarChart,LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

import SplashScreen from "../splashscreen";
 
export default class NegativeChart extends React.PureComponent {

    constructor(props) {
        super(props);

        this._retrieveData();

        this.state = {
            userData: {},
            graphData : {},
            startDate: moment().startOf('day').add(5, 'hours').add(30,'minutes').toDate().toISOString(),
            endDate: moment().startOf('day').add(5, 'hours').add(30,'minutes').add(1, "days").toDate().toISOString(),
            valueType: 0,
            monthPart: 2,
            graphYear: "",
            graphDate: "",
            graphWeek: "",
            dataNow: {
                labels: [0],
                datasets: [{
                    data : [0]
                }]
            },
            splashScreenActive: true,
            progressBarActive: true,
            deviceWidth: Dimensions.get('window').width
        }

    }

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
            let startDate = this.state.startDate;
            let endDate = this.state.endDate;
            this.getChartDataUpdate(startDate, endDate);
            this.setState({splashScreenActive: false});
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

      getChartDataUpdate= (startDate, endDate) => {
        console.log('in get chart data');
        axios({
            method: 'post',
            url: 'http://13.238.16.112/words/getWords',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : 'token '+ this.state.userData.sessionId
            },
            data: {
                "fromDate" : startDate,
	            "toDate" : endDate
            }
          }).then(data => {
              console.log(data.data.data);
              let date1 = new Date(startDate);
              let date2 = new Date(endDate);
              date1 = date1.getDate();
              date2 = date2.getDate();
              dateTemp = moment(startDate).toDate();
              if(this.state.valueType==0) {
                endDateMoment = moment(endDate).toDate();
              } else {
                    dateTemp = moment(startDate).add(1, "days").toDate();
                  endDateMoment = moment(endDate).add(1, "days").toDate();
              }
            //   console.log("start", dateTemp);
            //   console.log("end", endDateMoment);
            //   for(;moment(dateTemp).isBefore(endDateMoment);){
            //       console.log(moment(dateTemp).toDate());
            //       dateTemp = moment(dateTemp).add(1, "days").toDate();
            //   }

              let labels = [];
              let tempDate1 = "";
              let tempGraphData = {"positive": [], "negative": [], "neutral": []};

            //   console.log("start date", dateTemp);
            //   console.log("end date", endDateMoment);
            if(this.state.valueType == 0) {
                // 12,3,6,9,12,3,6,9,12
                labels = ["12AM", "3AM", "6AM", "9AM", "12PM", "3PM", "6PM", "9PM", "12AM"];
                tempGraphData.positive= [0,0,0,0,0,0,0,0,0];
                tempGraphData.negative= [0,0,0,0,0,0,0,0,0];
                tempGraphData.neutral= [0,0,0,0,0,0,0,0,0];
            } else {
              for(;moment(dateTemp).isBefore(endDateMoment);) {
                tempGraphData.positive.push(0);
                tempGraphData.negative.push(0);
                tempGraphData.neutral.push(0);
                labels.push(moment(dateTemp).toDate().getDate()+"/"+(moment(dateTemp).toDate().getMonth()+1));
                // console.log("current date", dateTemp);
                dateTemp = moment(dateTemp).add(1, "days").toDate();
              }
            }
              let tempGraphDataPercentage = [];
            //   console.log("graph data",tempGraphData);

              if(tempGraphData.negative.length==0) {
                //   console.log("********** length 0 h");
                labels.push(moment(startDate).toDate().getDate()+"/"+(moment(startDate).toDate().getMonth()+1));
                tempGraphDataPercentage.push(0);
            } else {

                // console.log("********** length 0 nhi h");
              this.setState({graphData:tempGraphData});
              let temp = data.data.data;
            //   this.refs.toast.show(data.data.message, 1000, () => {
            //     // something you want to do at close
            // });


            if(this.state.valueType==0) { 

                tempDate1 = moment(startDate).subtract(5, "hours").subtract(30, "minutes").toDate();
                tempDate1 = tempDate1.getDate()+"/"+(tempDate1.getMonth()+1)+"/"+tempDate1.getFullYear();

                temp.map((value)=>{
                    let tempDate = moment(value.createdOn).subtract(5, "hours").subtract(30, "minutes").toDate();

                    console.log(value.createdOn);
                    let tempHours = parseInt(tempDate.getHours());
                    console.log("created on 24, ", tempHours);
                    
                    console.log("*#############*");
    
                    if(tempHours == 0) {
                        tempIndex = 0;
                    } else if(tempHours<3) {
                        tempIndex = 1;
                    } else if (tempHours>=3 && tempHours<6) {
                        tempIndex = 2;
                    } else if (tempHours>=6 && tempHours<9) {
                        tempIndex = 3;
                    } else if (tempHours>=9 && tempHours<12) {
                        tempIndex = 4;
                    } else if (tempHours>=12 && tempHours<15) {
                        tempIndex = 5;
                    } else if (tempHours>=15 && tempHours<18) {
                        tempIndex = 6;
                    } else if (tempHours>=18 && tempHours<21) {
                        tempIndex = 7;
                    } else {
                        tempIndex = 8;
                    }

                    tempGraphData.positive[tempIndex]+=value.positive;
                    tempGraphData.negative[tempIndex]+=value.negative;
                    tempGraphData.neutral[tempIndex]+=value.neutral;
    
                });
              } else {
            temp.map((value)=>{
                let tempDate = moment(value.createdOn).subtract(5, "hours").subtract(30, "minutes").toDate();
                tempD = tempDate.getDate();
                tempM = tempDate.getMonth()+1;
                tempDM = tempD+"/"+tempM;
                tempIndex = labels.indexOf(tempDM);

                tempGraphData.positive[tempIndex]+=value.positive;
                tempGraphData.negative[tempIndex]+=value.negative;
                tempGraphData.neutral[tempIndex]+=value.neutral;

            });
        }
            if(labels.length==0) {
                labels.push(moment(startDate).toDate().getDate()+"/"+(moment(startDate).toDate().getMonth()+1));
            }

            // console.log("**temp grpah data" , tempGraphData);

                tempGraphData.negative.map((value,index)=> {
                    // console.log("value is", value);
                    percentage = (parseInt(( (value*100) / (tempGraphData.positive[index]+tempGraphData.negative[index]+tempGraphData.neutral[index]) ).toFixed(0)  )) | 0;
                    tempGraphDataPercentage.push(percentage);
                });

            console.log("===========", tempGraphDataPercentage);
            }

            let dataNow = {
                labels,
                datasets: [{
                    data : tempGraphDataPercentage
                }]
            }
            
            let graphYear = moment(startDate).add(1, "days").toDate().getFullYear();
            this.setState({graphYear});
            let graphWeek = labels[0]+"/"+graphYear+" - "+labels[6]+"/"+graphYear;
            this.setState({graphData: tempGraphDataPercentage, dataNow : dataNow, graphDate: tempDate1, graphYear, graphWeek});
            // console.log("final data", tempGraphDataPercentage);
            this.setState({progressBarActive: false});
          }).catch(err=>{
                console.log(err);  
          });
    }

    getChartDataMonth = (startDate, endDate, part) => {
        // console.log('in get chart data');
        // console.log(part);
        axios({
            method: 'post',
            url: 'http://13.238.16.112/words/getWords',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : 'token '+ this.state.userData.sessionId
            },
            data: {
                "fromDate" : startDate,
	            "toDate" : endDate
            }
          }).then(data => {
              console.log(data.data.data);

              let monthPart1 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
              let monthPart2 = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

              let date1 = new Date(startDate);
              let date2 = new Date(endDate);
              date1 = date1.getDate();
              date2 = date2.getDate();
              dateTemp = moment(startDate);
              endDateMoment = moment(endDate);
            //   console.log("end", endDateMoment);
            //   for(;moment(dateTemp).isBefore(endDateMoment);){
            //       console.log(moment(dateTemp).toDate());
            //       dateTemp = moment(dateTemp).add(1, "days").toDate();
            //   }

            let graphYear = moment(startDate).add(1, "days").toDate().getFullYear();
            this.setState({graphYear});

              let labels = [];
              let tempGraphData = {"positive": [], "negative": [], "neutral": []};
              for(i=0;i<6;i++) {
                tempGraphData.positive.push(0);
                tempGraphData.negative.push(0);
                tempGraphData.neutral.push(0);
                labels.push(dateTemp);
              }

              this.setState({graphData:tempGraphData});
              let temp = data.data.data;
            //   this.refs.toast.show(data.data.message, 1000, () => {
            //     // something you want to do at close
            // });


            let tempGraphDataPercentage = [];

            if(part==1) {
                labels=monthPart1;
                temp.map((value)=>{
                    let tempDate = new Date(value.createdOn);
                    tempM = tempDate.getMonth();
                    tempGraphData.positive[tempM]+=value.positive;
                    tempGraphData.negative[tempM]+=value.negative;
                    tempGraphData.neutral[tempM]+=value.neutral;
                });

            } else {
                labels=monthPart2;
                temp.map((value)=>{
                    let tempDate = new Date(value.createdOn);
                    tempM = tempDate.getMonth();
                    tempGraphData.positive[tempM-6]+=value.positive;
                    tempGraphData.negative[tempM-6]+=value.negative;
                    tempGraphData.neutral[tempM-6]+=value.neutral;
                });
            }
            tempGraphData.negative.map((value, index)=> {
                let tempP = parseInt(((value*100)/(value+tempGraphData.negative[index]+tempGraphData.neutral[index])).toFixed(0)) | 0;
                tempGraphDataPercentage.push(tempP);
            });
            console.log("graph data", tempGraphData);
            console.log(labels);
            let dataNow = {
                labels,
                datasets: [{
                    data : tempGraphDataPercentage
                }]
            }
            this.setState({graphData: tempGraphData, dataNow : dataNow});
            console.log("final data", tempGraphData);
            this.setState({progressBarActive: false});
          }).catch(err=>{
                console.log(err);  
          });
    }

    graphDataHandle = (value)=> {
        this.setState({progressBarActive: true});
        this.setState({valueType: value});
        if(value==0) {
            let startDate = moment().startOf('day').add(5, 'hours').add(30,'minutes').toDate().toISOString();
            let endDate = moment().startOf('day').add(5, 'hours').add(30,'minutes').add(1, "days").toDate().toISOString();
            this.setState({startDate, endDate});
            this.getChartDataUpdate(startDate, endDate);
        } else if (value==1) {
            var startDate = moment().subtract(7, 'days').toDate().toISOString();
            var endDate = moment().toDate().toISOString();
            this.setState({startDate, endDate});

            console.log("startDate" , startDate);
            console.log("ednDate", endDate);
            this.getChartDataUpdate(startDate, endDate);
        } else if (value==2) {
            var startDate = moment().startOf('year').add(6, "months").toDate().toISOString();
            var endDate = moment().endOf('year').toDate().toISOString();
            this.setState({startDate, endDate});
            let part = 2;

            console.log("startDate" , startDate);
            console.log("ednDate", endDate);
            this.getChartDataMonth(startDate, endDate, part);
        } else {
            console.log("something went wrong");
        }
    }

    _nextHandle = ()=> {
        this.setState({progressBarActive: true});
        if(this.state.valueType==0) {
            let startDate = this.state.startDate;
            let endDate = this.state.endDate;
            console.log("before", startDate, endDate);
            startDate = moment(startDate).add(1, "days").toDate().toISOString();
            endDate = moment(endDate).add(1, "days").toDate().toISOString();
            console.log("after", startDate, endDate);
            this.setState({startDate, endDate});
            this.getChartDataUpdate(startDate, endDate);
        } else if(this.state.valueType==1) {
            
            let startDate = this.state.startDate;
            let endDate = this.state.endDate;
            console.log("before", startDate, endDate);
            startDate = moment(startDate).add(7, "days").toDate().toISOString();
            endDate = moment(endDate).add(7, "days").toDate().toISOString();
            console.log("after", startDate, endDate);
            this.setState({startDate, endDate});
            this.getChartDataUpdate(startDate, endDate);

        } else if(this.state.valueType==2) {

            let startDate = this.state.startDate;
            let endDate = this.state.endDate;
            console.log("before", startDate, endDate);
            startDate = moment(startDate).add(6, "months").toDate().toISOString();
            endDate = moment(endDate).add(6, "months").toDate().toISOString();
            console.log("after", startDate, endDate);
            this.setState({startDate, endDate});
            if(this.state.monthPart==1) {
                monthPart = 2;
                this.setState({monthPart});
            } else {
                monthPart = 1;
                this.setState({monthPart});
            }
            this.getChartDataMonth(startDate, endDate, monthPart);

        } else {
            console.log("somthing went wrong");
        }
    }
    _previousHandle = ()=> {
        this.setState({progressBarActive: true});
        if(this.state.valueType==0) {
            let startDate = this.state.startDate;
            let endDate = this.state.endDate;
            console.log("before", startDate, endDate);
            startDate = moment(startDate).subtract(1, "days").toDate().toISOString();
            endDate = moment(endDate).subtract(1, "days").toDate().toISOString();
            console.log("after", startDate, endDate);
            this.setState({startDate, endDate});
            this.getChartDataUpdate(startDate, endDate);
        } else if(this.state.valueType==1) {
            let startDate = this.state.startDate;
            let endDate = this.state.endDate;
            console.log("before", startDate, endDate);
            startDate = moment(startDate).subtract(7, "days").toDate().toISOString();
            endDate = moment(endDate).subtract(7, "days").toDate().toISOString();
            console.log("after", startDate, endDate);
            this.setState({startDate, endDate});
            this.getChartDataUpdate(startDate, endDate);
        } else if(this.state.valueType==2) {
            let startDate = this.state.startDate;
            let endDate = this.state.endDate;
            console.log("before", startDate, endDate);
            startDate = moment(startDate).subtract(6, "months").toDate().toISOString();
            endDate = moment(endDate).subtract(6, "months").toDate().toISOString();
            console.log("after", startDate, endDate);
            this.setState({startDate, endDate});
            if(this.state.monthPart==1) {
                monthPart = 2;
                this.setState({monthPart});
            } else {
                monthPart = 1;
                this.setState({monthPart});
            }
            this.getChartDataMonth(startDate, endDate, monthPart);
        } else {
            console.log("somthing went wrong");
        }
    }
 
    render() {

        const fill = 'rgb(134, 65, 244)'
        const data   = [ 50, 10, 40, 95, -4, -24, null, 85, undefined, 0, 35, 53, -53, 24, 50, -20, -80 ];

        return (
            this.state.splashScreenActive ? <SplashScreen /> : <ScrollView>

            <View style={chartStyles.daySelectWrapper}>
            <TouchableOpacity
                style={this.state.valueType==0 ? chartStyles.buttonDaySelected : chartStyles.buttonDay }
                onPress= {this.graphDataHandle.bind(this, 0)}
            >
                <Text style={this.state.valueType == 0 ? chartStyles.buttonDaySelectedText : chartStyles.buttonDayText }>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={this.state.valueType==1 ? chartStyles.buttonDaySelected :  chartStyles.buttonDay}
                onPress= {this.graphDataHandle.bind(this, 1)}
            >
                <Text style={this.state.valueType == 1 ? chartStyles.buttonDaySelectedText : chartStyles.buttonDayText }>Week</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={this.state.valueType==2 ? chartStyles.buttonDaySelected :  chartStyles.buttonDay}
                onPress= {this.graphDataHandle.bind(this, 2)}
            >
                <Text style={this.state.valueType == 2 ? chartStyles.buttonDaySelectedText : chartStyles.buttonDayText }>Month</Text>
            </TouchableOpacity>
            </View>

            <View style={{display: "flex", flexDirection: "row", justifyContent: "center", marginBottom: 20}}>
            <TouchableOpacity
                style={{padding: 10, paddingTop: 13, paddingHorizontal: 20, borderRadius: 3, marginRight: 25}}
                onPress= {this._previousHandle}
            >
                {/* <Text style={{fontFamily: "Roboto-Medium", color: "#fff", alignSelf: "center"}}>Previous</Text> */}
                <Icon size={25} color="#FF7417" name="navigate-before"/>
            </TouchableOpacity>
            {this.state.valueType==0 ?
                <Text style={{textAlign: "center", "fontFamily": "Roboto-Bold", marginTop: 15, fontSize: 18}}>{this.state.graphDate}</Text> : <Text></Text>
            }

            { this.state.valueType==1 ?
                <Text style={{textAlign: "center", "fontFamily": "Roboto-Bold", marginTop: 15, fontSize: 18}}>{this.state.graphWeek}</Text> : <Text></Text>
            }

            { this.state.valueType==2 ?
                <Text style={{textAlign: "center", "fontFamily": "Roboto-Bold", marginTop: 15, fontSize: 18}}>{this.state.graphYear}</Text> : <Text></Text>
            }
            <TouchableOpacity
                style={{padding: 10, paddingTop: 13, paddingHorizontal: 20, borderRadius: 3, marginLeft: 25}}
                onPress= {this._nextHandle}
            >
                {/* <Text style={{fontFamily: "Roboto-Medium", color: "#fff", alignSelf: "center"}}>Next</Text> */}
                <Icon size={25} color="#FF7417" name="navigate-next"/>
            </TouchableOpacity>
            </View>

            <View style={this.state.progressBarActive? {marginBottom: -6}: {marginBottom: 10}}>
            {this.state.progressBarActive ?
            <ProgressBarAndroid styleAttr="Horizontal" color="#FF7417" />
            : <View></View>}
            </View>

            <View style= {{shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
        backgroundColor: "#fff",
        marginHorizontal: 12,
        borderRadius: 5, marginBottom: 10, paddingTop: 10}}>
<View style={{ height: 400, flexDirection: 'row', padding: 7, width: this.state.deviceWidth-30, marginBottom: 5 }}>
                <YAxis
                data={ [0,...this.state.dataNow.datasets[0].data] }
                contentInset={{ left: 7, top: 5, bottom: 5 }}
                svg={{
                    fill: 'black',
                    fontSize: 10,
                }}
                style={{marginLeft:0, width: 18}}
                numberOfTicks={ 10 }
                formatLabel={ value => `${value}%` }
        />
        <BarChart
            style={{ flex: 1, marginLeft: 16 }}
            data={ this.state.dataNow.datasets[0].data }
            svg={{ fill: '#FF7417' }}
            >
             <Grid direction={Grid.Direction.HORIZONTAL}/>
                {/* <Labels/> */}
        </BarChart>
            </View>
            
            <View style={{marginHorizontal: 12, marginVertical: 2}}>
                <XAxis
                        data={ this.state.dataNow.labels }
                        scale={shape.scaleBand}
                        formatLabel={ (value, index) => this.state.dataNow.labels[index]}
                        style={{ marginBottom: 10}}
                        contentInset={{ top: 10, bottom: 10, left: 50, right: 20 }}
                        labelStyle={ { color: 'black' } }
                    />
                </View>
                </View>

            <View style={{marginBottom:40, marginTop: 15}}>
                  <Text style={{textAlign: "center", fontSize: 17, fontFamily: "Roboto-Bold"}}>Negative Words</Text>
            </View>

            </ScrollView>
        )
    }
 
}

const chartStyles = StyleSheet.create({
    daySelectWrapper : {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        margin: 20,
        marginTop: 30,
        marginBottom: 10,
    },
    buttonDaySelected : {
        shadowColor: '#000',
        borderRadius: 2,
        shadowOffset: { width : 2, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 10,
        width: 100, 
        backgroundColor: "#FF7417", 
        padding: 12
    },
    buttonDay : {
        width: 100, 
        backgroundColor: "#fff", 
        padding: 12
    },
    buttonDaySelectedText : {
        fontFamily: "Roboto-Medium", color: "#fff", alignSelf: "center"
    },
    buttonDayText :{
        fontFamily: "Roboto-Medium", color: "#FF7417", alignSelf: "center"
    }
});