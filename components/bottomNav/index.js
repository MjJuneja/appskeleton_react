import React, {Component} from "react";
import BottomNavigation,{FullTab} from 'react-native-material-bottom-navigation';
import { Icon } from 'react-native-elements'

export default class BottomNav extends Component {

    constructor(props) {
        super(props);
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

      _handleNavigation = (navigateTo)=> {
        console.log(navigateTo);
        const { navigate } = this.props.navigation;
        navigate(navigateTo);
    }

      render() {
          return(
            <BottomNavigation
                renderTab={this.renderTab}
                tabs={this.tabs}
                onTabPress={activeTab => this._handleNavigation(activeTab.navigate)}
            /> 
          )
      }
}