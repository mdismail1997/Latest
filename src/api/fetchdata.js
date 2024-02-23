import setting from "../constants/Setting";
import {  Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    getUserData
} from "../helpers/authenticate";
import { getRevisionByKey, updateRevisionData } from "./Revision";
import { api } from "./api";

export async function fetchTechniciansData(token, locationId) {
    let userData = await getUserData();
    let revisionData = await getRevisionByKey('technician','technician_revision',userData);
    let revision = revisionData.revision;
    let data_technician_revision = revisionData.data_revision;
    var checkcache = await AsyncStorage.getItem('list-technician-checkin_'+userData.id);
    if (data_technician_revision == ""
        || (data_technician_revision != "" && parseInt(data_technician_revision) < revision) || checkcache == null) {
        var technicianList = await fetch(setting.apiUrl + api.getTechnicians + locationId, {
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
                AsyncStorage.setItem('list-technician-checkin_'+userData.id, JSON.stringify(responseJson.data));
                updateRevisionData('technician_revision',revisionData,userData);
               
                return responseJson.data;
                // prepareData.technicians = responseJson.data;
                //checkIsLoaded();
            }
        }).catch((error) => {
            console.error(error);
            return [];
        });
        return technicianList;
    } else {
        var data_technician = await AsyncStorage.getItem('list-technician-checkin_'+userData.id).then(technician => {
            if (technician == null) return [];
            else {
                return JSON.parse(technician);
            }
        });
        return data_technician;
    }

}

export async function fetchClientsData(token) {
    let userData = await getUserData();
    let revisionData = await getRevisionByKey('client','client_revision',userData);
    let revision = revisionData.revision;
    let data_client_revision = revisionData.data_revision;
    var checkcache = await AsyncStorage.getItem('list-client-checkin');
    if (data_client_revision == ""
        || (data_client_revision != "" && parseInt(data_client_revision) < revision) || checkcache == null) {

        var clientList = await fetch(setting.apiUrl + api.getClients, {
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
                AsyncStorage.setItem('list-client-checkin', JSON.stringify(responseJson.data));
                updateRevisionData('client_revision',revisionData,userData);
                
                return responseJson.data;
                // prepareData.technicians = responseJson.data;
                //checkIsLoaded();
            }
        }).catch((error) => {
            console.error(error);
            return [];
        });
        return clientList;
    } else {
        var data_client = await AsyncStorage.getItem('list-client-checkin').then(client => {
            if (client == null) return [];
            else {
                return JSON.parse(client);
            }
        });
        return data_client;
    }
}
export async function fetchClientsDataByID(data,token) {
        var client = await fetch(setting.apiUrl + api.searchByClient, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(data)
        }).then((response) => response.json()).then((responseJson) => {
            if (!responseJson.success) {
                fetchError(responseJson);
                return [];
            } else {
                return responseJson.data;
            }
        }).catch((error) => {
            console.error(error);
            return [];
        });
        return client;

}
export async function fetchBusinesshours(token) {
    let userData = await getUserData();
    let revisionData = await getRevisionByKey('businesshour','businesshour_revision',userData);
    let revision = revisionData.revision;
    let data_businesshour_revision = revisionData.data_revision;
    var checkcache = await AsyncStorage.getItem('businesshours_checkin_' + userData.id);
    if (data_businesshour_revision == ""
        || (data_businesshour_revision != "" && parseInt(data_businesshour_revision) < revision) || checkcache == null) {

        var businesshours = await fetch(setting.apiUrl + api.getBusinessHours, {
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
                AsyncStorage.setItem('businesshours_checkin_' + userData.id, JSON.stringify(responseJson.data));
                updateRevisionData('businesshour_revision',revisionData,userData);
                
                return responseJson.data;
                // prepareData.technicians = responseJson.data;
                //checkIsLoaded();
            }
        }).catch((error) => {
            console.error(error);
            return [];
        });
        return businesshours;
    } else {
        var data_bussiness = await AsyncStorage.getItem('businesshours_checkin_' + userData.id).then(businesshours => {
            if (businesshours == null) return [];
            else {
                return JSON.parse(businesshours);
            }
        });
        return data_bussiness;
    }


}

export async function fetchBlockedTime(token,YM) {
    let userData = await getUserData();

    let revisionData = await getRevisionByKey('blockedtime_' + YM,'blockedtime_revision_' + YM,userData);
    let revision = revisionData.revision;
    let data_businesshour_revision = revisionData.data_revision;
    var checkcache = await AsyncStorage.getItem('blockedtime_' + YM+'_'+ userData.id);
    if (data_businesshour_revision == ""
        || (data_businesshour_revision != "" && parseInt(data_businesshour_revision) < revision) || checkcache == null) {

        var blockedtime = await fetch(setting.apiUrl + api.getBlockedTime + YM, {
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
                AsyncStorage.setItem('blockedtime_' + YM+'_'+ userData.id, JSON.stringify(responseJson.data));
                updateRevisionData('blockedtime_revision_' + YM,revisionData,userData);
                
                return responseJson.data;
                // prepareData.technicians = responseJson.data;
                //checkIsLoaded();
            }
        }).catch((error) => {
            console.error(error);
            return [];
        });
        return blockedtime;
    } else {
        var data_blockedtime = await AsyncStorage.getItem('blockedtime_' + YM+'_'+ userData.id).then(blockedtime => {
            if (blockedtime == null) return [];
            else {
                return JSON.parse(blockedtime);
            }
        });

        return data_blockedtime;
    }


}

export async function fetchTechniciansWorkingHour(token) {
    let userData = await getUserData();
    let revisionData = await getRevisionByKey('technician_workinghour_range','TechniciansWorkingHourRange_revision',userData);
    let revision = revisionData.revision;
    let data_businesshour_revision = revisionData.data_revision;
    var checkcache = await AsyncStorage.getItem('TechniciansWorkingHourRange-checkin_'+userData.id);

    if (data_businesshour_revision == ""
        || (data_businesshour_revision != "" && parseInt(data_businesshour_revision) < revision) || checkcache == null) {

        var TechniciansWorkingHour = await fetch(setting.apiUrl + api.getTechnicianWorkHoursRange, {
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
                AsyncStorage.setItem('TechniciansWorkingHourRange-checkin_'+userData.id, JSON.stringify(responseJson.data));
                updateRevisionData('TechniciansWorkingHourRange_revision',revisionData,userData);
                
                return responseJson.data;
                // prepareData.technicians = responseJson.data;
                //checkIsLoaded();
            }
        }).catch((error) => {
            console.error(error);
            return [];
        });
        return TechniciansWorkingHour;
    } else {
        var data_TechniciansWorkingHour = await AsyncStorage.getItem('TechniciansWorkingHourRange-checkin_'+userData.id).then(TechniciansWorkingHour => {
            if (TechniciansWorkingHour == null) return [];
            else {
                return JSON.parse(TechniciansWorkingHour);
            }
        });
        return data_TechniciansWorkingHour;
    }


}

export async function fetchServices(token, locationId) {
    let userData = await getUserData();
    let revisionData = await getRevisionByKey('service','service_revision',userData);
    let revision = revisionData.revision;
    let data_service_revision = revisionData.data_revision;
    var checkcache = await AsyncStorage.getItem('services-checkin_' + userData.id);

    if (data_service_revision == ""
        || (data_service_revision != "" && parseInt(data_service_revision) < revision) || checkcache == null) {
            
        var services = await fetch(setting.apiUrl + api.appGetServices + locationId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        })
        .then((response) => response.json())
        .then((responseJson) => {
            //console.log(responseJson);
            if (!responseJson.success) {
                fetchError(responseJson);
                //Alert.alert('Error', responseJson.message);
                return [];
            } else {
                //console.log(responseJson.data);
                AsyncStorage.setItem('services-checkin_' + userData.id, JSON.stringify(responseJson.data));
                updateRevisionData('service_revision',revisionData,userData);
                
                return responseJson.data;
                // prepareData.technicians = responseJson.data;
                //checkIsLoaded();
            }
        }).catch((error) => {
            console.error(error);
            return [];
        });
        return services;
    }else {
        var data_service = await AsyncStorage.getItem('services-checkin_' + userData.id).then(services => {
            if (services == null) return [];
            else {
                return JSON.parse(services);
            }
        });
        return data_service;
    }


}

export async function fetchListCombo(token) {
    let userData = await getUserData();
    let revisionData = await getRevisionByKey('combo','combo_revision',userData);
    let revision = revisionData.revision;
    let data_service_revision = revisionData.data_revision;
    var checkcache = await AsyncStorage.getItem('listcombo-checkin_' + userData.id);

    if (data_service_revision == ""
        || (data_service_revision != "" && parseInt(data_service_revision) < revision) || checkcache == null) {
            
        var services = await fetch(setting.apiUrl + api.getListCombo, {
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
                AsyncStorage.setItem('listcombo-checkin_' + userData.id, JSON.stringify(responseJson.data));
                updateRevisionData('combo_revision',revisionData,userData);
                
                return responseJson.data;
                // prepareData.technicians = responseJson.data;
                //checkIsLoaded();
            }
        }).catch((error) => {
            console.error(error);
            return [];
        });
        return services;
    }else {
        var data_service = await AsyncStorage.getItem('listcombo-checkin_' + userData.id).then(services => {
            if (services == null) return [];
            else {
                return JSON.parse(services);
            }
        });
        return data_service;
    }


}

export async function getCurrentLocation() {
    var data_location = await AsyncStorage.getItem('location').then(location => {
        if (location == null) return {};
        else {
            return JSON.parse(location);
        }
    });
    return data_location;
}

export function fetchError(responseJson) {
    if (responseJson.message == 'token_expired' || responseJson.message == 'token_invalid') {

        AsyncStorage.setItem(setting.jwtkey, '');
    } else {
        Alert.alert('Error', responseJson.message);
    }
}

export async function getSwitchMode() {
    var switchmode = await AsyncStorage.getItem('switchmode').then(response => {
        if (response == null) return true;
        else {
            var data = JSON.parse(response);
            if(data.mode == "express-checkin"){
                return false;
            }
            return true;
        }
    });
    return switchmode;
}