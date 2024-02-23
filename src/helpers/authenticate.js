import { Alert } from "react-native";
import setting from "../constants/Setting";
import jwtDecode from "jwt-decode";
import moment from "moment";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from "../api/api";

export async function isLogged() {
    var data = await AsyncStorage.getItem(setting.jwtkey).then(token => {
        if (token == null || token == "") {
            return false;
        } else {
            let tokenDecode = jwtDecode(token);
            let now = moment.utc();
            let tokenExp = moment.unix(tokenDecode.exp).utc();
            if (now > tokenExp) {
                return false;
            } else {
                return true;
            }
        }
    });
    return data;
}

export async function refreshJWTtoken(token) {
    let deviceid = await getDeviceId();
    let status = await fetch(setting.apiUrl + api.refreshToken + deviceid, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(responseJson => {
            if (!responseJson.success) {
                fetchError(responseJson);
            } else {
                let token = responseJson.data.token;
                let userData = {};
                userData.email = responseJson.data.email;
                userData.id = responseJson.data.id;
                userData.role = responseJson.data.role;
                userData.serviceprovider_id = responseJson.data.serviceprovider_id;
                userData.picture = responseJson.data.picture;
                userData.firstname = responseJson.data.firstname;
                userData.lastname = responseJson.data.lastname;
                userData.fullname = responseJson.data.fullname;
                userData.businessname = responseJson.data.businessname;
                userData.view_customer_information = responseJson.data.view_customer_information;
                userData.settings = responseJson.data.settings;
                userData.state = responseJson.data.state;
                userData.country = responseJson.data.country;
                userData.isPrimaryUser = responseJson.data.isPrimaryUser;
                userData.isAllowGuestBookAvailableTechnician = responseJson.data.isAllowGuestBookAvailableTechnician;
                userData.isAcceptAnyTechnician = responseJson.data.isAcceptAnyTechnician;
                userData.isManageTurn = responseJson.data.isManageTurn;
                userData.isDisableCheckInAppBooking = responseJson.data.isDisableCheckInAppBooking;
                userData.isDisableApplyRewardPointCheckIn = responseJson.data.isDisableApplyRewardPointCheckIn;
                userData.isDisableHowItWork = responseJson.data.isDisableHowItWork;
                userData.allow_multiple_location = responseJson.data.allow_multiple_location;
                userData.serviceSortType = responseJson.data.serviceSortType;
                userData.HideservicepriceApp = responseJson.data.HideservicepriceApp;
                userData.showLessServicesWhenDisableCheckInBooking = responseJson.data.showLessServicesWhenDisableCheckInBooking;
                userData.showLessServiceCount = responseJson.data.showLessServiceCount;
                userData.PrintOut = responseJson.data.PrintOut;
                userData.covid19 = responseJson.data.covid19;
                userData.street_number = responseJson.data.street_number;
                userData.street_name = responseJson.data.street_name;
                userData.city = responseJson.data.city;
                userData.zipcode = responseJson.data.zipcode;
                userData.phone = responseJson.data.phone;
                userData.domain = responseJson.data.domain;
                if (responseJson.data.allow_multiple_location) {
                    userData.locations = responseJson.data.locations;
                    isMultiLocation = true;
                    locations = responseJson.data.locations;
                    allow_multiple_location = responseJson.data.allow_multiple_location;
                }
                userData.isStartAppointmentForTech = responseJson.data.isStartAppointmentForTech;
                userData.isCheckoutAppointmentForTech = responseJson.data.isCheckoutAppointmentForTech;
                userData.isAddAppointmentForTech = responseJson.data.isAddAppointmentForTech;
                userData.isEditAppointmentForTech = responseJson.data.isEditAppointmentForTech;
                userData.rewardpointDailyCheckInType = responseJson.data.rewardpointDailyCheckInType;
                userData.plusPointForDailyCheckInWhenDisableBooking = responseJson.data.plusPointForDailyCheckInWhenDisableBooking;
                userData.rewardpointTotalBillType = responseJson.data.rewardpointTotalBillType;
                userData.rewardPointTypeBookingOnline = responseJson.data.rewardPointTypeBookingOnline;
                userData.rewardPointTotalBillBookingOnline = responseJson.data.rewardPointTotalBillBookingOnline;
                if (userData.rewardpointDailyCheckInType == "bytotalbill") {
                    userData.rewardpointtotalbillCheckin = responseJson.data.rewardpointtotalbillCheckin;
                }
                userData.rewardPointTypePlusBookingOnline = responseJson.data.rewardPointTypePlusBookingOnline;
                userData.rewardPointUseApplication = responseJson.data.rewardPointUseApplication;
                userData.rewardPointBirthday = responseJson.data.rewardPointBirthday;
                userData.rewardPointExpired = responseJson.data.rewardPointExpired;
                userData.rewardPointPercentBookingOnline = responseJson.data.rewardPointPercentBookingOnline;
                userData.MonthUseRewardPoint = responseJson.data.MonthUseRewardPoint;
                userData.isRewardPointTotalBill = responseJson.data.isRewardPointTotalBill;
                userData.rewardpointtotalbill = responseJson.data.rewardpointtotalbill;
                userData.checkinCategoryFontSize = responseJson.data.checkinCategoryFontSize;
                //console.log(userData);
                userData.isTechnicianPermissionAppointment = responseJson.data.isTechnicianPermissionAppointment;
                userData.TechnicianPermissionType = responseJson.data.TechnicianPermissionType;
                userData.isStartAppointment = responseJson.data.isStartAppointment;
                userData.isCheckoutAppointment = responseJson.data.isCheckoutAppointment;
                userData.isAddAppointment = responseJson.data.isAddAppointment;
                userData.isEditAppointment = responseJson.data.isEditAppointment;
                userData.percentPlusForGiftCard = responseJson.data.percentPlusForGiftCard;
                userData.planTotalCustomer = responseJson.data.planTotalCustomer;
                userData.smsUsed = responseJson.data.smsUsed;
                userData.MaximumApplyRewardPointType = responseJson.data.MaximumApplyRewardPointType;
                userData.MaximumApplyRewardPointVip = responseJson.data.MaximumApplyRewardPointVip;
                userData.MaximumApplyRewardPoint = responseJson.data.MaximumApplyRewardPoint;
                userData.smsMarketingTotal = responseJson.data.smsMarketingTotal;
                userData.smsMarketingUsed = responseJson.data.smsMarketingUsed;
                userData.GatewayPayment = responseJson.data.GatewayPayment;
                userData.notcalculatorServiceDuration = responseJson.data.notcalculatorServiceDuration;
                userData.disable_button_checkin = responseJson.data.disable_button_checkin;
                userData.disable_button_express = responseJson.data.disable_button_express;
                userData.service_app_checkin = responseJson.data.service_app_checkin;
                userData.fieldClient_app_checkin = responseJson.data.fieldClient_app_checkin;
                userData.TotalBillMoreThanOrEqualApplyRewardPoint = responseJson.data.TotalBillMoreThanOrEqualApplyRewardPoint;
                userData.total_points_redeem_online = responseJson.data.total_points_redeem_online;
                AsyncStorage.setItem(setting.jwtkey, token);
                AsyncStorage.setItem(setting.userkey, JSON.stringify(userData));
                return responseJson.data.status;
                //console.log(responseJson.data);
                //return responseJson.token;
                // prepareData.technicians = responseJson.data;
                //checkIsLoaded();
            }
        })
        .catch(error => {
            console.error(error);
        });
    return status;
}

export function recheckNotification(token, callback) {
    fetch(setting.apiUrl + "notificationcount", {
        method: "GET",
        headers: {
            Authorization: "Bearer " + token
        }
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

export async function jwtToken() {
    var data = await AsyncStorage.getItem(setting.jwtkey).then(token => {
        return token;
    });
    return data;
}

export async function getDeviceId() {
    var data = await AsyncStorage.getItem(setting.deviceid).then(token => {
        if (token == null || token == "" || token == "0") return 0;
        else return token;
    });
    return data;
}

export async function getUserData() {
    var data = await AsyncStorage.getItem(setting.userkey);
    var data = await AsyncStorage.getItem(setting.userkey).then(userdata => {
        return JSON.parse(userdata);
    });
    return data;
}

function fetchError(responseJson) {
    if (
        responseJson.message == "token_expired" ||
        responseJson.message == "token_invalid"
    ) {
        AsyncStorage.setItem(setting.jwtkey, "");
        //return false;
    } else {
        Alert.alert("Error", responseJson.message);
        //return false;
    }
}
