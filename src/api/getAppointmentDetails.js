import setting from "../constants/Setting";
import {Alert} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from "./api";
export async function getAppointmentDetails(token,id) {
    var appointment = await fetch(setting.apiUrl + api.appointmentGet + id, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,
        }
    }).then((response) => response.json()).then((responseJson) => {

        if (!responseJson.success) {
            fetchError(responseJson);
            //Alert.alert('Error', responseJson.message);
            return [];
        } else {
            return responseJson.data;
            // prepareData.technicians = responseJson.data;
            //checkIsLoaded();
        }
    }).catch((error) => {
        console.error(error);
        return [];
    });
    return appointment;
}

function fetchError(responseJson){
    if(responseJson.message == 'token_expired' || responseJson.message == 'token_invalid')
    {
        AsyncStorage.setItem(setting.jwtkey,'');
        this.props.navigation.push('login');
    }else
    {
        Alert.alert('Error', responseJson.message);
    }
}