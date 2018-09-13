import React, {Component} from "react";
import {StyleSheet, View, Text, Image, TextInput, TouchableOpacity, ScrollView, AsyncStorage} from 'react-native';

class MessageScreen extends Component {

    constructor(props) {
        super(props);

        this._retrieveData();

        this.state = {
            greatful : [],
            currentGreatfulValue: "",
            userData: {
                userInfo : {
                    firstName: ""
                }
            },
            duplicateError: ""
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
            this.getGreatfulAsync();
          } else {
              console.log("No data found");
              this.handleNavigation("Home");
          }
         } catch (error) {
           // Error retrieving data
           console.log(error);
         }
      }

    addGreatful = ()=> {
        if(this.state.currentGreatfulValue!="") {
            let greatful = this.state.greatful;
            let duplicateCheck = false;
            greatful.map((value)=>{
                if(value==this.state.currentGreatfulValue) {
                    duplicateCheck=true;
                }
            });
            if(!duplicateCheck) {
                greatful.push(this.state.currentGreatfulValue);
                this.setState({greatful, currentGreatfulValue: "", duplicateError: ""});
                this.setGreatfulAsyunc(greatful);
            } else {
                this.setState({duplicateError: "Already Exist"});
            }
        }
    }

    setGreatfulAsyunc = async (greatful)=> {
        try {
            greatful = JSON.stringify(greatful);
            await AsyncStorage.setItem("greatful", greatful);
            console.log("item set");
        } catch(err) {
            console.log(err);
        }
    }

    getGreatfulAsync = async ()=> {
        try {
            let greatful = await AsyncStorage.getItem("greatful");
            if(greatful!=null) {
                greatful = JSON.parse(greatful);
                this.setState({greatful});
            }
        } catch(err) {
            console.log(err);
        }
    }

    handleNavigation = (navigateTo)=> {
        console.log(this.props);
        const { navigate } = this.props.navigation;
        navigate(navigateTo);
    }

    deleteItem = (index)=> {
        let greatful = this.state.greatful;
        greatful.splice(index,1);
        console.log(greatful);
        this.setState({greatful});
        this.setGreatfulAsyunc(greatful);
        console.log("deleted", index);
    }

    render() {
        return(
            <View style={messageScreenStyles.container}>
{/* <Image
                    style={messageScreenStyles.backgroundImage}
                    source={require ('../../assets/images/gradients/redToOrange.jpg')}
                /> */}
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
                        onChangeText={(currentGreatfulValue) => this.setState({currentGreatfulValue})}
                        underlineColorAndroid='transparent'
                        ></TextInput>
                        <TouchableOpacity
                            style={messageScreenStyles.addButton}
                            onPress={this.addGreatful}
                        >
                            <Text style={messageScreenStyles.addButtonText}> + </Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={{fontSize: 15, "color": "red", marginTop: 5, marginLeft: 15, fontFamily:"Roboto-Bold"}}>{this.state.duplicateError}</Text>
                    </View>
                </View>

                <View>

                {this.state.greatful.map((value, index)=>{
                        return (
                            <View key={index} style={messageScreenStyles.greatfulListWrapper}>
                                <Text style={messageScreenStyles.greatfulList}>{index+1}. {value}</Text>
                                <TouchableOpacity
                                    onPress={this.deleteItem.bind(this, index)}
                                    style={messageScreenStyles.deleteButton}
                                >
                                    <Text style={messageScreenStyles.greatfulListClose}>X</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                </View>

                <TouchableOpacity
                            onPress={this.handleNavigation.bind(this, "HomeScreen")}
                            style={{marginTop: 20, marginBottom: 20}}
                        >
                    <Text style={{color: "#fff", fontSize: 16, marginTop: 10, fontFamily:"Roboto-Bold", width:"50%", padding:10, alignSelf: "center", textAlign:"center", backgroundColor:"#FF7417", borderRadius: 5}}>CONTINUE</Text>
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
        marginTop: 35,
        marginBottom: 10
    },
    topContainer : {
        // backgroundColor: "orangered",
        // height: 100,
    },
    personalizedMessage : {
        // backgroundColor: "#e3bb88",
        marginTop: 15,
        marginHorizontal: 20,
        padding: 20,
        paddingHorizontal: 30,
        borderRadius: 5,
        lineHeight: 25,
        fontSize: 16 ,
        color: "#fafafa",
        backgroundColor: "#FF7417",
        fontFamily: "OpenSans-SemiBold",
        justifyContent: "center",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 10
    },
    generalMessage : {
        // backgroundColor: "#db9864",
        // 644749
        marginTop: 25,
        marginHorizontal: 20,
        padding: 20,
        paddingHorizontal: 30,
        borderRadius: 5,
        lineHeight: 25,
        fontSize: 16,
        color: "#fafafa",
        backgroundColor: "#FF7417",
        fontFamily: "OpenSans-SemiBold",
        justifyContent: "center",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 10
    },
    greatfulContainer : {
        // backgroundColor: "#b1695a",
        alignSelf: "stretch",
        padding: 20
    },
    greatfulHeading : {
        fontSize: 16,
        marginTop: 15,
        fontFamily : "Roboto-Medium",
        color : "#FF7417",
        textAlign: "center"
    },
    inputContainer : {
        display : "flex",
        flexDirection : "row",
        marginTop: 20
    },
    greatfulInput : {
        borderWidth: 1,
        borderColor: "#f0f0f0",
        flex: 6,
        color: "#444",
        fontSize: 16,
        backgroundColor: "#fff",
        borderRadius: 50,
        paddingHorizontal: 20
    },
    addButton : {
        flex: 1,
        borderRadius: 50,
        alignItems : "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#e1e1e1",
        backgroundColor: "#FF7417"
    },
    addButtonText : {
        fontSize: 30,
        color: "#fff"
    },
    greatfulListWrapper : {
        marginTop: 20,
        marginHorizontal: 20,
        padding: 20,
        paddingHorizontal: 30,
        borderRadius: 5,
        backgroundColor: "#FF7417",
        justifyContent: "center",
        shadowColor: 'rgba(0,0,0,0.4)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 10
    },
    greatfulList: {
        fontFamily: "OpenSans-SemiBold",
        lineHeight: 25,
        fontSize: 16 ,
        color: "#fafafa"
    },
    greatfulListClose : {
        fontFamily: "OpenSans-Bold",
        fontSize: 16,
        color: "#e1e1e1",
    },
    deleteButton : {
        position: "absolute",
        right: 5,
        top: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        // backgroundColor: "red",
    }
});

export default MessageScreen;