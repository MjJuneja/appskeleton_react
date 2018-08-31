import React from 'react';
import { StyleSheet, Text, View, Image, Button ,TouchableOpacity, FlatList } from 'react-native';
import BottomNavigation,{FullTab} from 'react-native-material-bottom-navigation';
import { Icon } from 'react-native-elements';
import FontAwesome, { Icons } from 'react-native-fontawesome';

export default class Settings extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
        username:'',
        message:'',
        options : [
                {key: 'Profile', icon: 'person'},
                {key: 'Microphone', icon: 'mic'},
                {key: 'About', icon: 'timeline'}
            ]
    };

    console.log(this.props);
  }
  
  static navigationOptions = {
    title: 'Welcome',
  };

  tabs = [
    {
      key: 'games',
      icon: 'rowing',
      label: 'Games',
      barColor: '#388E3C',
      pressColor: 'rgba(255, 255, 255, 0.16)'
    },
    {
      key: 'movies-tv',
      icon: 'movie',
      label: 'Movies',
      barColor: '#B71C1C',
      pressColor: 'rgba(255, 255, 255, 0.16)'
    },
    {
      key: 'music',
      icon: 'music-note',
      label: 'Music',
      barColor: '#E64A19',
      pressColor: 'rgba(255, 255, 255, 0.16)'
    },
    {
      key: 'Toys',
      icon: 'cake',
      label: 'Toys',
      barColor: '#388E3C',
      pressColor: 'rgba(255, 255, 255, 0.16)'
    }
  ]

  navigateSettings = key => {
      if(key=="Profile"){
        const { navigate } = this.props.navigation;
        navigate('Profile');
      }
  }

   renderIcon = icon => ({ isActive }) => (
    <Icon size={20} color="white" name={icon} />
  )

   renderTab = ({ tab, isActive }) => {
    return (
      <FullTab 
        key={tab.key}
        isActive={isActive}
        label={tab.label}
        renderIcon={this.renderIcon(tab.icon)}
      />
    )
  }

  render() {
    
    return (
       <View style={settingStyles.container}>
           <View>
               <View style={settingStyles.headingWrapper}>
                   <Text style={settingStyles.headingText}>APP SETTINGS</Text>
               </View>
               <View style={settingStyles.settingOptionsWrapper}>
               {this.state.options.map((item)=> {
                   return(
                        <TouchableOpacity
                            key={item.key}
                            style={settingStyles.settingOptionsButton}
                            onPress={this.navigateSettings.bind(this, item.key)}
                        >
                            <View style={settingStyles.icons}>
                                <Icon size={20}  color="#666" name={item.icon} />
                            </View>
                            <Text style={settingStyles.settingOptionsText}>{item.key}</Text>
                        </TouchableOpacity>
                   )
                })}
               </View>
                {/* <BottomNavigation
                    renderTab={this.renderTab}
                    tabs={this.tabs}
                    onTabPress={activeTab => this.call(activeTab.key)}
                /> */}
            </View>
      </View>
    );
  }
}

const settingStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f5f8"
    },
    headingWrapper : {
        paddingTop: 20,
        marginBottom: 20
    },
    headingText : {
        color: "#999",
        fontSize: 13,
        alignSelf: "center"
    },
    settingOptionsWrapper : {
        backgroundColor: "#fff"
    },
    settingOptionsButton : {
        padding: 15
    },
    settingOptionsText : {
        fontSize: 17,
        color: "#555"
    },
    icons : {
        position: "absolute",
        right: 15,
        top: 15,
    }
});