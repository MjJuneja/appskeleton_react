import React, {Component} from "react";
import {StyleSheet, View, Text, Image, TextInput, TouchableOpacity, ScrollView, AsyncStorage} from 'react-native';

class MessageScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            greatful : [],
            currentGreatfulValue: "",
            userData: {
                userInfo : {
                    firstName: ""
                }
            }
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
            this.setState({userData});
          } else {
              console.log("No data found");
          }
         } catch (error) {
           // Error retrieving data
           console.log(error);
         }
      }

    addGreatful = ()=> {
        if(this.state.currentGreatfulValue!="") {
            let greatful = this.state.greatful;
            greatful.push(this.state.currentGreatfulValue);
            this.setState({greatful, currentGreatfulValue: ""});
        }
    }

    handleNavigation = (navigateTo)=> {
        console.log(this.props);
        const { navigate } = this.props.navigation;
        navigate(navigateTo);
    }

    render() {
        return(
            <View style={messageScreenStyles.container}>
<Image
                    style={messageScreenStyles.backgroundImage}
                    source={require ('../../assets/images/gradients/redToOrange.jpg')}
                />
            <ScrollView>
            
                <Image
                    style={messageScreenStyles.logo}
                    source={require ('../../assets/images/logo/logo.png')}
                />
                <View style={messageScreenStyles.topContainer}></View>
                <Text style={messageScreenStyles.personalizedMessage}>
                Thank You {this.state.userData.userInfo.firstName} for taking the decision to creating an account with Watch Your Talk, it is in your moments of decision that your destiny is shaped. Now, let’s get you started…
                </Text>

                <Text style={messageScreenStyles.generalMessage}>
                According to Psychology today “Those people who practice gratitude experience a more positive mood than those who do not”.  So let us start by writing one thing that you are grateful for today.
                </Text>

                <View style={messageScreenStyles.greatfulContainer}>
                    <Text style={messageScreenStyles.greatfulHeading}>Today I'm greatful for:</Text>
                    <View style={messageScreenStyles.inputContainer}>
                        <TextInput style={messageScreenStyles.greatfulInput} value={this.currentGreatfulValue}
                        onChangeText={(currentGreatfulValue) => this.setState({currentGreatfulValue})}></TextInput>
                        <TouchableOpacity
                            style={messageScreenStyles.addButton}
                            onPress={this.addGreatful}
                        >
                            <Text style={messageScreenStyles.addButtonText}> + </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View>
                    {this.state.greatful.map((value, index)=>{
                        return (
                            <Text key={index} style={messageScreenStyles.greatfulList}>{(index+1)+". "+value}</Text>
                        )
                    })}
                </View>

                <TouchableOpacity
                            onPress={this.handleNavigation.bind(this, "HomeScreen")}
                        >
                    <Text style={{color: "#fff", fontSize: 20, width:"70%", padding:10, alignSelf: "center", textAlign:"center", backgroundColor:"rgba(0,0,0,0.2)", borderRadius: 3}}>Continue</Text>
                </TouchableOpacity>

            </ScrollView>
            </View>
        );
    }

}

const messageScreenStyles = StyleSheet.create({
    container : {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: "#f4f5f8"
    },
    backgroundImage : {
        position: 'absolute',
        width: '100%',
        height: '120%',
        left: 0,
        top: 0,
        zIndex: -1
    },
    logo : {
        height: 120,
        width: 100,
        alignSelf: "center",
        marginTop: 15,
        marginBottom: 10
    },
    topContainer : {
        // backgroundColor: "orangered",
        // height: 100,
    },
    personalizedMessage : {
        // backgroundColor: "#e3bb88",
        padding: 20,
        borderRadius: 2,
        fontSize: 17,
        color: "#fff",
        fontFamily: "Raleway-Bold",
        justifyContent: "center"
    },
    generalMessage : {
        // backgroundColor: "#db9864",
        // 644749
        padding: 20,
        borderRadius: 2,
        fontSize: 17,
        color: "#fff",
        fontFamily: "Raleway-Bold",
        justifyContent: "center"
    },
    greatfulContainer : {
        // backgroundColor: "#b1695a",
        alignSelf: "stretch",
        padding: 20
    },
    greatfulHeading : {
        fontSize: 16,
        fontFamily : "Roboto-Medium",
        color : "#fff",
        textAlign: "center"
    },
    inputContainer : {
        display : "flex",
        flexDirection : "row",
        marginTop: 20
    },
    greatfulInput : {
        borderBottomWidth: 1,
        borderColor: "#e1e1e1",
        flex: 5,
        width: "80%",
        color: "#fff"
    },
    addButton : {
        flex: 1,
        borderRadius: 2,
        alignItems : "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#e1e1e1"
    },
    addButtonText : {
        fontSize: 30,
        color: "#fff"
    },
    greatfulList: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 5,
        fontFamily: "Roboto-Medium",
        fontSize: 16,
        color: "#fff"
    }
});

export default MessageScreen;