import React, {Component} from "react";
import {StyleSheet, View, Text, Image, TextInput, TouchableOpacity, Linking} from 'react-native';

class MessageScreen extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={messageScreenStyles.container}>
                <Text style={messageScreenStyles.personalizedMessage}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </Text>

                <Text style={messageScreenStyles.generalMessage}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </Text>

                <View style={messageScreenStyles.greatfulContainer}>
                    <Text style={messageScreenStyles.greatfulHeading}>Today I'm greatful for</Text>
                    <View style={messageScreenStyles.inputContainer}>
                        <TextInput style={messageScreenStyles.greatfulInput}></TextInput>
                        <TouchableOpacity
                            style={messageScreenStyles.addButton}
                        >
                            <Text style={messageScreenStyles.addButtonText}> + </Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        );
    }

}

const messageScreenStyles = StyleSheet.create({
    container : {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#f3f7f7"
    },
    personalizedMessage : {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 2,
        marginBottom: 20,
        fontSize: 15,
        color: "#222"
    },
    generalMessage : {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 2,
        fontSize: 15,
        color: "#222"
    },
    greatfulContainer : {
        backgroundColor: "#fff",
        alignSelf: "stretch",
        padding: 10,
        marginTop: 30
    },
    greatfulHeading : {
        fontSize: 18,
        fontFamily : "OpenSans-SemiBold",
        color : "#222"
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
        width: "80%"
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
        color: "#444"
    }
});

export default MessageScreen;