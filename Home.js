import React from 'react';
import { StyleSheet, Text, View, Image, Button ,TextInput } from 'react-native';
import BottomNavigation,{FullTab} from 'react-native-material-bottom-navigation'
import { Icon } from 'react-native-elements'

export default class HomeScreen extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
        username:'',
        message:''
    };
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
      icon: 'gamepad-variant',
      label: 'Toys',
      barColor: '#388E3C',
      pressColor: 'rgba(255, 255, 255, 0.16)'
    }
  ]
 
 

  submit(){
      var url = 'https://api.tinkersale.com/commonroutes/check-username';
      var data = {username: this.state.username};

    fetch(url, {
    method: 'POST', // or 'PUT'
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers:{
        'Content-Type': 'application/json'
    }
    }).then(res => res.json())
    .then(response => this.setState({message:response.message}))
    .catch(error => console.error('Error:', error));
  }

  call(key){
      
      if(key=="Toys"){
        const { navigate } = this.props.navigation;
        navigate('Profile', { name: 'Jane' })
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
        // <View style={{padding: 10}}>
        //     <Button
        //         title="Go to Jane's profile"
        //         onPress={() =>
        //             navigate('Profile', { name: 'Jane' })
        //         }
        //     />
        //     <TextInput
        //         style={{height: 40,marginTop:20}}
        //         placeholder="Type here to translate!"
        //         onChangeText={(text) => {this.setState({username:text})}}
        //     />
        //     <Button
        //         title="Check Username"
        //         onPress = {()=>this.submit()}
        //     />
        //     <Text>{this.state.message}</Text>
        // </View>
       <View>
        <BottomNavigation
        renderTab={this.renderTab}
        tabs={this.tabs}
        onTabPress={activeTab => this.call(activeTab.key)}
        
        />
      </View>
    );
  }

 


}