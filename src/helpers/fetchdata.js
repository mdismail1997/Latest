import setting from "../constants/Setting";
import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    getUserData,
    refreshJWTtoken
} from "../helpers/authenticate";
import moment from "moment";
import "../helpers/timezone";
import { getUSState2Digit, get_time_zone, getCountry2Digit } from "../helpers/Utils";
import { api } from "../api/api";
import { apiHeader } from "../api/apiHeader";
//import collect from "collect.js";

export async function prepareDataForCalendarScreen(token) {
    let prepareData = {};
    var technicianList = await fetchTechniciansData(token);
    prepareData.technicians = technicianList;
    return prepareData;
}

export async function fetchTechniciansData(token) {
    let userData = await getUserData();
    let idsalon = userData.id;
    if(userData.role == 9){
        idsalon = userData.serviceprovider_id;
    }
    let revisionData = await getRevisionByKey('technician','technician_revision',userData);
    let revision = revisionData.revision;
    let data_technician_revision = revisionData.data_revision;
    var checkcache = await AsyncStorage.getItem('list-technician_' + idsalon);
    if (data_technician_revision == ""
        || (data_technician_revision != "" && parseInt(data_technician_revision) < revision) || checkcache == null) {
        var technicianList = await fetch(setting.apiUrl + api.getTechnicians, {
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
                AsyncStorage.setItem('list-technician_' + idsalon, JSON.stringify(responseJson.data));
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
        var data_technician = await AsyncStorage.getItem('list-technician_' + idsalon).then(technician => {
            if (technician == null) return [];
            else {
                return JSON.parse(technician);
            }
        });
        return data_technician;
    }

}

export async function fetchTechniciansDataIsManageTurn(token) {
    var technicianList = await fetch(setting.apiUrl + api.getTechniciansIsManageTurn, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,
        }
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
    return technicianList;

}

export async function fetchCategoriesData(token) {
    var technicianList = await fetch(setting.apiUrl + api.categories, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,
        }
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
    return technicianList;
}
export async function fetchListCombo(token) {
    let userData = await getUserData();
    let idsalon = userData.id;
    if(userData.role == 9){
        idsalon = userData.serviceprovider_id;
    }
    let revisionData = await getRevisionByKey('combo','combo_revision',userData);
    let revision = revisionData.revision;
    let data_service_revision = revisionData.data_revision;
    var checkcache = await AsyncStorage.getItem('listcombo_'+idsalon);
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
                AsyncStorage.setItem('listcombo_'+idsalon, JSON.stringify(responseJson.data));
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
        var data_service = await AsyncStorage.getItem('listcombo_'+idsalon).then(services => {
            if (services == null) return [];
            else {
                return JSON.parse(services);
            }
        });
        return data_service;
    }


}

export async function fetchAppointments(token, date) {  
    var appointments = await fetch(setting.apiUrl + api.getAllAppointment, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            date: date
        })
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
    return appointments;
}
export async function fetch_appointments_cache(token, date, type) {  
    var appointments = await fetch(setting.apiUrl + api.getAllAppointmentCache, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            date: date,
            type: type
        })
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
    return appointments;
}
export async function fetchAppointmentsWaitList(token, date) {  
    var appointments = await fetch(setting.apiUrl + api.getAllWaitlistAppointment, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            date: date
        })
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

    return appointments;
}

export async function fetchCustomercheckins(token, date) {  

    var appointments = await fetch(setting.apiUrl + api.customerCheckinAll, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            date: date
        })
    }).then((response) => response.json()).then((responseJson) => {

        if (!responseJson.success) {
            fetchError(responseJson);
            return [];
        } else {
            AsyncStorage.setItem('customercheckins', JSON.stringify(responseJson.data));
            return responseJson.data;
        }
    }).catch((error) => {
        console.error(error);
        return [];
    });
    return appointments;
}
export async function fetchClientsData(token) {
    let userData = await getUserData();
    let revisionData = await getRevisionByKey('client','client_revision',userData);
    let revision = revisionData.revision;
    let data_client_revision = revisionData.data_revision;
    var checkcache = await AsyncStorage.getItem('list-client');
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
                AsyncStorage.setItem('list-client', JSON.stringify(responseJson.data));
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
        var data_client = await AsyncStorage.getItem('list-client').then(client => {
            if (client == null) return [];
            else {
                return JSON.parse(client);
            }
        });
        return data_client;
    }


}

export async function fetchBusinesshours(token) {
    let userData = await getUserData();
    let idsalon = userData.id;
    if(userData.role == 9){
        idsalon = userData.serviceprovider_id;
    }
    let revisionData = await getRevisionByKey('businesshour','businesshour_revision',userData);
    let revision = revisionData.revision;
    let data_businesshour_revision = revisionData.data_revision;
    var checkcache = await AsyncStorage.getItem('businesshours_' + idsalon);
    if (data_businesshour_revision == ""
        || (data_businesshour_revision != "" && parseInt(data_businesshour_revision) < revision) || checkcache == null) {

        var businesshours = await fetch(setting.apiUrl + api.get_Business_Hour, {
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
                AsyncStorage.setItem('businesshours_' + idsalon, JSON.stringify(responseJson.data));
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
        var data_bussiness = await AsyncStorage.getItem('businesshours_' + idsalon).then(businesshours => {
            if (businesshours == null) return [];
            else {
                return JSON.parse(businesshours);
            }
        });
        return data_bussiness;
    }


}

export async function fetchServices(token) {
    let userData = await getUserData();
    let idsalon = userData.id;
    if(userData.role == 9){
        idsalon = userData.serviceprovider_id;
    }
    let revisionData = await getRevisionByKey('service','service_revision',userData);
    let revision = revisionData.revision;
    let data_service_revision = revisionData.data_revision;
    var checkcache = await AsyncStorage.getItem('services_'+idsalon);
    if (data_service_revision == ""
        || (data_service_revision != "" && parseInt(data_service_revision) < revision) || checkcache == null) {
        var services = await fetch(setting.apiUrl + api.app_Get_Services, {
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
                AsyncStorage.setItem('services_'+idsalon, JSON.stringify(responseJson.data));
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
        var data_service = await AsyncStorage.getItem('services_'+idsalon).then(services => {
            if (services == null) return [];
            else {
                return JSON.parse(services);
            }
        });
        return data_service;
    }
}

export async function fetchTurns(token) {
    let userData = await getUserData();
    stateData = getUSState2Digit(userData.state);
    let country = getCountry2Digit(userData.country);
    timezone = get_time_zone(country,stateData);
    let now = moment().tz(timezone).format('YYYY-MM-DD');
    
    var dataKey = await AsyncStorage.getItem(setting.turnkeyday + '_' + now + '_' + userData.id).then(jsonData => {
        if (jsonData == null || jsonData == "") {
            return '';
        } else {
            return jsonData;
        }
    });

    if(dataKey != '' && dataKey != now){
        AsyncStorage.removeItem(setting.turnkeyday + '_' + userData.id);
    }
    
    var data = await AsyncStorage.getItem(setting.turnkey + '_' + userData.id).then(jsonData => {
        if (jsonData == null || jsonData == "") {
            return '';
        } else {
            return JSON.parse(jsonData);
        }
    });
    if(data == ''){
        var dataTurn = await fetch(setting.apiUrl + 'app_get_turns', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }).then((response) => response.json()).then((responseJson) => {
           
            AsyncStorage.setItem(setting.turnkeyday + '_' + userData.id,now);
            AsyncStorage.setItem(setting.turnkey + '_' + now + '_' + userData.id,JSON.stringify(responseJson.data));    
            return responseJson.data;
        }).catch((error) => {
            console.error(error);
            return [];
        });
        data = dataTurn;
    }
    return data;
}

async function getRevisionByKey(key,storage_key,userData){
   
    let storage_key_owner = userData.id;
    if(userData.role == 9){
        storage_key_owner = userData.serviceprovider_id;
    }

    
    let revision = 0;
    if (typeof (userData.settings[key]) != 'undefined') {
        revision = userData.settings[key] == "" ? 0 : parseInt(userData.settings[key]);
    }
    var data_revision = await AsyncStorage.getItem(storage_key + '_' + storage_key_owner).then(service_revision => {
        if (service_revision == null) return "";
        else return service_revision;
    });
    return {revision,data_revision};
}

function updateRevisionData(storage_key,data,userData){
    let storage_key_owner = userData.id;
    if(userData.role == 9){
        storage_key_owner = userData.serviceprovider_id;
    }
    if (data.data_revision == "") {
        AsyncStorage.setItem(storage_key + '_' + storage_key_owner, "0");
    } else AsyncStorage.setItem(storage_key + '_' + storage_key_owner, data.revision.toString());
}


function fetchError(responseJson) {
    if (responseJson.message == 'token_expired' || responseJson.message == 'token_invalid') {

        AsyncStorage.setItem(setting.jwtkey, '');
        this.props.navigation.push('login');
    } else {
        Alert.alert('Error', responseJson.message);
    }
}

export async function fetchNotification(data,token,callback) {
    fetch(setting.apiUrl + api.getAllNotificationClear + data, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: "Bearer " + token
        },
    })
    .then(response => response.json())
    .then(responseJson => {
        if (!responseJson.success) {
            callback();
        } else {
            callback(responseJson.data);
        }
    })
    .catch(error => {
        console.error(error);
    });
}
export async function fetchLoadingCouponAvailable(bookingday, clientid) {
    var slideList = await fetch(setting.apiUrl + api.loadCouponAvailMerchantApp + "bookingday="+bookingday+"&clientid="+clientid, {
        method: 'GET',
        headers: apiHeader,
    }).then((response) => response.json()).then((responseJson) => {
        if (!responseJson.success) {
            return [];
        } else {     
            
            return responseJson.data;
        }
    }).catch((error) => {
        console.error(error);
        return [];
    });

    return slideList;

}

export async function fetchBlockedTime(token, date) {  
    let userData = await getUserData();
    let idsalon = userData.id;
    if(userData.role == 9){
        idsalon = userData.serviceprovider_id;
    }
    var blockedtime = await fetch(setting.apiUrl + api.getAllBlockedTime, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            date: date
        })
    }).then((response) => response.json()).then((responseJson) => {
        if (!responseJson.success) {
            fetchError(responseJson);
            return [];
        } else {
            AsyncStorage.setItem('blockedtime_'+ idsalon, JSON.stringify(responseJson.data));
            return responseJson.data;
        }
    }).catch((error) => {
        console.error(error);
        return [];
    });
    return blockedtime;
}

export async function fetchBlockedTimeDetail(token, id) {  
    var blockedtime = await fetch(setting.apiUrl + api.blockedTimeGetDetail, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id
        })
    }).then((response) => response.json()).then((responseJson) => {
        if (!responseJson.success) {
            fetchError(responseJson);
            return {};
        } else {
            return responseJson.data;
        }
    }).catch((error) => {
        console.error(error);
        return {};
    });
    return blockedtime;
}

export async function fetchGetServicDetail(token, id) {  
    var service = await fetch(setting.apiUrl + api.getserviceDetailMerchantApp, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id
        })
    }).then((response) => response.json()).then((responseJson) => {
        if (!responseJson.success) {
            fetchError(responseJson);
            return {};
        } else {
            return responseJson.data;
        }
    }).catch((error) => {
        console.error(error);
        return {};
    });
    return service;
}

export async function fetchGetCommissionTachnician(token, id, type = '') {  

    var commission = await fetch(setting.apiUrl + api.getTechnicianCommission, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id, 
            date_range: type
        })
    }).then((response) => response.json()).then((responseJson) => {
        if (!responseJson.success) {
            fetchError(responseJson);
            return {};
        } else {
            return responseJson.data;
        }
    }).catch((error) => {
        console.error(error);
        return {};
    });
    return commission;
}
export async function fetchCustomercheckinsDetail(token, id) {  
    var appointments = await fetch(setting.apiUrl + api.customerCheckinGetDetails, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id
        })
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
    return appointments;
}
export async function fetchSellEgift(token) {

    var gift = await fetch(setting.apiUrl + api.getSellEGift, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,
        }
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
    return gift;

}
export async function fetchBalanceEgift(token) {

    var gift = await fetch(setting.apiUrl + api.getBalanceEGift, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,
        }
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
    return gift;

}

export async function fetchSmsTracking(token, fromdate, todate, timezone) {
    var sms = await fetch(setting.apiUrl + api.smsTracking, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fromdate: fromdate,
            todate: todate,
            timezone: timezone
        })
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
    return sms;

}
export async function fetchChargedNewClient(token, month, year) {
    var charged = await fetch(setting.apiUrl + api.chargedNewClient, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            month: month,
            year: year,
        })
    }).then((response) => response.json()).then((responseJson) => {
        if (!responseJson.success) {
            fetchError(responseJson);
            return [];
        } else {
            return responseJson;
        }
    }).catch((error) => {
        console.error(error);
        return [];
    });
    return charged;
}
export async function fetchByTechnician(token) {
    var charged = await fetch(setting.apiUrl + api.getByTechnician, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
    }).then((response) => response.json()).then((responseJson) => {
        if (!responseJson.success) {
            fetchError(responseJson);
            return [];
        } else {
            return responseJson;
        }
    }).catch((error) => {
        console.error(error);
        return [];
    });
    return charged;

}