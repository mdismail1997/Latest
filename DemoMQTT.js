import React, {useEffect} from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import MQTTConnection from './helpers/MQTTConnection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Buffer} from 'buffer';
global.Buffer = Buffer;
const App = () =>{

    const [data, setData] = React.useState({
        username: 'huy',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });
    const textInputChange = () => {
            setData({
                ...data,
                username: 'huy change state',
                check_textInputChange: false,
                isValidUser: false
            });
    }
      onMQTTConnect = () => {
        console.log('App onMQTTConnect');
        this.mqttConnect.subscribeChannel('hanth2');
    }

    onMQTTLost = () => {
        console.log('App onMQTTLost');
    }

    onMQTTMessageArrived = (message) => {
         console.log('App onMQTTMessageArrived: ', message);
        console.log('App onMQTTMessageArrived payloadString1: ', message.payloadString);
        setData({
            ...data,
            username: message.payloadString,
            check_textInputChange: false,
            isValidUser: false
        });

    } 
    
    onMQTTMessageDelivered = (message) => {
        console.log('App onMQTTMessageDelivered: ', message);
    }
    useEffect(()=>{
   
            this.mqttConnect = new MQTTConnection();
            this.mqttConnect.onMQTTConnect = this.onMQTTConnect;
            this.mqttConnect.onMQTTLost = this.onMQTTLost;
            this.mqttConnect.onMQTTMessageArrived = this.onMQTTMessageArrived;
            this.mqttConnect.onMQTTMessageDelivered = this.onMQTTMessageDelivered;
            this.mqttConnect.connect('104.131.179.241', 80)
            return () => {
                this.mqttConnect.close();
            }

        
    }, []);

    return (
        <View style={styles.container}>
            <Text>{data.username}</Text>
            <Button title='Press me' onPress={() => this.mqttConnect.send('hanth2', 'message need send111')}/>
            <Button title='setstate' onPress={textInputChange}/>
        </View>
    )
}
export default App;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
