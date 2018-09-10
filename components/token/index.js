import axios from 'axios';
import {AsyncStorage} from 'react-native';

export default checkToken = token => {
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
            return false;
          }
          return true;
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