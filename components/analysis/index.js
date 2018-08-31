import React, {Component} from "react";
import {StyleSheet, View, Text, Image, TextInput, TouchableOpacity} from 'react-native';
import SplashScreen from "../splashscreen";
import Toast, {DURATION} from 'react-native-easy-toast';
import axios from 'axios';

class Analysis extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={analysisStyles.container}>
                <View style={analysisStyles.moodList}>
                    <Text>Positive Words</Text><Text style={analysisStyles.percentage}>{"59%"}</Text>
                </View>
                <View style={analysisStyles.moodList}>
                    <Text>Negative Words</Text><Text style={analysisStyles.percentage}>{"10%"}</Text>
                </View>
                <View style={analysisStyles.moodList}>
                    <Text>Sentiments</Text><Text style={analysisStyles.percentage}>{"12%"}</Text>
                </View>
                <View style={analysisStyles.moodList}>
                    <Text>Mood</Text><Text style={analysisStyles.percentage}><Image
                        style={analysisStyles.moodImage}
                        source={require ('../../assets/images/mood/smile.png')}
                    /></Text>
                </View>
            </View>
        )
    }
}

const analysisStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f5f6"
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
        margin: 20,

    },
    percentage : {
        alignSelf: "flex-end",
        fontSize: 20,
        fontWeight: "500",
        color: "#ff3490",
        position: "absolute",
        right: 20,
        top: 16
    },
    moodImage : {
        height: 50,
        width: 50
    }
});

export default Analysis;