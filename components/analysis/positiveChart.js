import React from 'react';
import axios from 'axios';
import moment from 'moment';
import SplashScreen from "../splashscreen";
import {Button, View, AsyncStorage, Text, ScrollView, TouchableOpacity, ProgressBarAndroid, Dimensions} from "react-native";

import { BarChart,LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
 
export default class PositiveChart extends React.PureComponent {

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
        // console.log("in retrieve data");
        try {
          const userData = await AsyncStorage.getItem('userData');
        //   const micFlag = await AsyncStorage.getItem('micFlag');
          if (userData !== null) {
            // We have data!!
            userData = JSON.parse(userData);
            // console.log(userData);
            this.checkToken(userData.sessionId);
            this.setState({userData});
            let startDate = this.state.startDate;
            let endDate = this.state.endDate;
            // console.log(startDate);
            // console.log(endDate);
            this.getChartDataUpdate(startDate, endDate);
            this.setState({splashScreenActive: false});
          } else {
            //   console.log("No data found");
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
        console.log('in get chart data first wala');
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
            //   let date1 = new Date(startDate);
            //   let date2 = new Date(endDate);
            //   date1 = date1.getDate();
            //   date2 = date2.getDate();
              dateTemp = moment(startDate).toDate();
              if(this.state.valueType==0) {
                endDateMoment = moment(endDate).toDate();
              } else {
                    dateTemp = moment(startDate).add(1, "days").toDate();
                  endDateMoment = moment(endDate).add(1, "days").toDate();
              }
              console.log("start", dateTemp);
              console.log("end", endDateMoment);
              console.log("end k baad first wale m");
            //   for(;moment(dateTemp).isBefore(endDateMoment);){
            //       console.log(moment(dateTemp).toDate());
            //       dateTemp = moment(dateTemp).add(1, "days").toDate();
            //   }

              let labels = [];
              let tempGraphData = {"positive": [], "negative": [], "neutral": []};

            //   console.log("start date", dateTemp);
            //   console.log("end date", endDateMoment);
              for(;moment(dateTemp).isBefore(endDateMoment);) {
                //   console.log("inside ...");
                tempGraphData.positive.push(0);
                tempGraphData.negative.push(0);
                tempGraphData.neutral.push(0);
                labels.push(moment(dateTemp).toDate().getDate()+"/"+(moment(dateTemp).toDate().getMonth()+1));
                // console.log("current date", dateTemp);
                dateTemp = moment(dateTemp).add(1, "days").toDate();
              }
              let tempGraphDataPercentage = [];
            //   console.log("graph data",tempGraphData);

              if(tempGraphData.positive.length==0) {
                //   console.log("********** length 0 h");
                labels.push(moment(startDate).toDate().getDate()+"/"+(moment(startDate).toDate().getMonth()+1));
                tempGraphDataPercentage.push(0);
            } else {

              this.setState({graphData:tempGraphData});
              let temp = data.data.data;



            temp.map((value)=>{
                let tempDate = moment(value.createdOn).subtract(5, "hours").subtract(30, "minutes").toDate();
                tempD = tempDate.getDate();
                tempM = tempDate.getMonth()+1;
                tempDM = tempD+"/"+tempM;
                tempIndex = labels.indexOf(tempDM);
                console.log("created on", value.createdOn);
                console.log("tempDM", tempDM);
                console.log(tempIndex);
                console.log("*#############*");

                tempGraphData.positive[tempIndex]+=value.positive;
                tempGraphData.negative[tempIndex]+=value.negative;
                tempGraphData.neutral[tempIndex]+=value.neutral;

            });
            
            // console.log("tesst date", moment("2018-09-10T19:10:25.542Z").subtract(5, "hours").subtract(30, "minutes").toDate());

            if(labels.length==0) {
                labels.push(moment(startDate).toDate().getDate()+"/"+(moment(startDate).toDate().getMonth()+1));
            }

            // console.log("**temp grpah data" , tempGraphData);

                tempGraphData.positive.map((value,index)=> {
                    // console.log("value is", value);
                    // console.log(tempGraphData.positive[index]);
                    // console.log(tempGraphData.negative[index]);
                    // console.log(tempGraphData.neutral[index]);
                    // console.log("*#############*");
                //   console.log("inside ... percentage wala");
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
            this.setState({graphData: tempGraphDataPercentage, dataNow : dataNow});
            this.setState({progressBarActive: false});
            console.log("final data", dataNow);
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
            tempGraphData.positive.map((value, index)=> {
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
        console.log("++++++++++in graph data handle");
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
            console.log("end date k baadd/");
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
        // const CUT_OFF = 20
        // const data = this.state.dataNow.datasets[0].data;
        // const Labels = ({ x, y, bandwidth,data }) => (
        //     data.map((value, index) => (
        //         <Text
        //             key={ index }
        //             x={ x(index) + (bandwidth / 2) }
        //             y={ value < CUT_OFF ? y(value) - 10 : y(value) + 15 }
        //             fontSize={ 14 }
        //             fill={ value >= CUT_OFF ? 'white' : 'black' }
        //             alignmentBaseline={ 'middle' }
        //             textAnchor={ 'middle' }
        //         >
        //             {value}
        //         </Text>
        //     ))
        // )
        
        // const fill = 'rgb(134, 65, 244)';

        return (
            this.state.splashScreenActive ? <SplashScreen /> : <ScrollView>
            {/* <BarChart
                style={{ height: 200 }}
                data={ data }
                svg={{ fill }}
                contentInset={{ top: 30, bottom: 30 }}
            >
                <Grid/>
            </BarChart> */}

            <View style={{display: "flex", flexDirection: "row", justifyContent: "center", margin: 20, marginBottom: 10}}>
            <TouchableOpacity
                style={{width: 100, backgroundColor: "#379be5", padding: 10, borderRadius: 3, marginHorizontal: 5}}
                onPress= {this.graphDataHandle.bind(this, 0)}
            >
                <Text style={{fontFamily: "Roboto-Medium", color: "#fff", alignSelf: "center"}}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{width: 100, backgroundColor: "#379be5", padding: 10, borderRadius: 3, marginHorizontal: 5}}
                onPress= {this.graphDataHandle.bind(this, 1)}
            >
                <Text style={{fontFamily: "Roboto-Medium", color: "#fff", alignSelf: "center"}}>Week</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{width: 100, backgroundColor: "#379be5", padding: 10, borderRadius: 3, marginHorizontal: 5}}
                onPress= {this.graphDataHandle.bind(this, 2)}
            >
                <Text style={{fontFamily: "Roboto-Medium", color: "#fff", alignSelf: "center"}}>Month</Text>
            </TouchableOpacity>
            </View>

            <View style={{display: "flex", flexDirection: "row", justifyContent: "center", marginBottom: 20}}>
            <TouchableOpacity
                style={{width: 100, backgroundColor: "#FF7417", padding: 10, borderRadius: 3, marginHorizontal: 5}}
                onPress= {this._previousHandle}
            >
                <Text style={{fontFamily: "Roboto-Medium", color: "#fff", alignSelf: "center"}}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{width: 100, backgroundColor: "#FF7417", padding: 10, borderRadius: 3, marginHorizontal: 5}}
                onPress= {this._nextHandle}
            >
                <Text style={{fontFamily: "Roboto-Medium", color: "#fff", alignSelf: "center"}}>Next</Text>
            </TouchableOpacity>
            </View>

            <View style={this.state.progressBarActive? {marginBottom: -6}: {marginBottom: 10}}>
            {this.state.progressBarActive ?
            <ProgressBarAndroid styleAttr="Horizontal" color="#FF7417" />
            : <View></View>}
            </View>
                {this.state.valueType==0 ? 
<View style={{ height: 400, flexDirection: 'row', padding: 10, width: this.state.deviceWidth }}>
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
            data={ [...this.state.dataNow.datasets[0].data,0,0,0,0,0,0] }
            svg={{ fill: '#FF7417' }}
            >
             <Grid direction={Grid.Direction.HORIZONTAL}/>
                {/* <Labels/> */}
        </BarChart>
            </View>
                :
                <View style={{ height: 400, flexDirection: 'row', padding: 10, width: this.state.deviceWidth }}>
                <YAxis
                    data={ this.state.dataNow.datasets[0].data }
                    style={{marginLeft:0, width: 18}}
                    contentInset={{ left: 17, top: 5, bottom: 5 }}
                    svg={{
                        fill: 'black',
                        fontSize: 10,
                    }}
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
                }
            
            <View style={{marginHorizontal: 10, marginVertical: 5}}>
                <XAxis
                        data={ this.state.dataNow.labels }
                        scale={shape.scaleBand}
                        formatLabel={ (value, index) => this.state.dataNow.labels[index]}
                        style={{ marginBottom: 20}}
                        contentInset={{ top: 15, bottom: 10, left: 50, right: 20 }}
                        labelStyle={ { color: 'black' } }
                    />
                </View>

            {this.state.valueType==2 ?
                <Text style={{textAlign: "center", "fontFamily": "Roboto-Bold", marginTop: 15, fontSize: 18}}>{this.state.graphYear}</Text> : <Text></Text>
            }

            <View style={{marginBottom:40, marginTop: 15}}>
                  <Text style={{textAlign: "center", fontSize: 17, fontFamily: "Roboto-Bold"}}>Positive Words</Text>
            </View>

            </ScrollView>
        )
    }
 
}