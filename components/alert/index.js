import React, {Component} from "react";
import {StyleSheet, View, Text, Image, AsyncStorage, TouchableOpacity} from 'react-native';

export default class AlertBox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showAlert: this.props.showAlert
        }
    }

    hideAlertFunc = ()=> {
        this.setState({showAlert: false})
    }

    render() {
        if(this.state.showAlert===true) {
        return(
            <View style={alertBoxStyles.shadow}>
                <View style={alertBoxStyles.container}>
                    <Text style={alertBoxStyles.mainText}>You're not alone. Confidential help is available for free.</Text>
                    <Text style={alertBoxStyles.subText}>Need help?</Text>
                    <Text style={alertBoxStyles.number}>022 2754 6669</Text>
                    <TouchableOpacity
                        onPress={this.hideAlertFunc}
                        style={alertBoxStyles.closeButton}
                    >
                        <Text style={alertBoxStyles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )} else {
            return <View></View>
        }
    }

}


const alertBoxStyles = StyleSheet.create({
    shadow : {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        zIndex: 9
    },
    container : {
        backgroundColor: "#fff",
        padding: 20,
        position: "absolute",
        top: "40%",
        zIndex: 10,
        alignSelf: "center"
    },
    mainText: {
        fontFamily: "OpenSans-SemiBold",
        fontSize: 18,
        color: "#222"
    },
    subText : {
        fontFamily: "Roboto-Medium",
        marginTop: 10
    },
    number: {
        fontSize: 22,
        color: "rgb(255,68,34)",
        fontFamily: "Roboto-Bold"
    },
    closeButton: {
        alignSelf: "center",
        backgroundColor: "rgb(255,68,34)",
        marginTop: 15,
        padding: 8,
        borderRadius: 3
    },
    closeButtonText : {
        color: "#fff",
        fontFamily: "Roboto-Medium"
    }
})