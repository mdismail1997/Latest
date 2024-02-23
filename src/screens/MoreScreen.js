import React, {useEffect} from "react";
import {
    StyleSheet,
    Text,
    View,
    Platform,
    TouchableOpacity,
    ScrollView,
    Alert
} from "react-native";
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { isLogged, jwtToken, getUserData } from "../helpers/authenticate";
import { fetchServices, fetchByTechnician } from "../helpers/fetchdata";
import SpinnerLoader from "../helpers/spinner";
import Colors from "../constants/Colors";
import layout from "../assets/styles/layout";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FloatLabelSelect from "../components/FloatSelectInputPriceMultiple";
import { getLanguageName, getLanguage, getTextByKey } from "../helpers/language";
import LanguageModal from "../components/LanguageModal";
import IconLoader from "../helpers/iconloader";
import setting from "../constants/Setting";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../components/context';
import * as Updates from 'expo-updates';
import EditStaff from "../components/EditStaff";
import { color } from "../assets/colors/colors";
import { api } from "../api/api";
const MoreScreen = ({navigation, route}) =>{
      
    
    const initialState = {
        isLoading: false,
        languageName: "",
        token: '',
        services: '',
        TechnicianData: '',
    }
    let tokenj = '';
    let servicesj = '';
    let TechnicianDataj = '';
    let languageName = '';
    const updateTechnciRef = React.createRef();  
    let LanguageModalRef = React.createRef();
    let spinnerRef = React.createRef();
    const [state, setState] = React.useState(initialState);
    const { signOut,  changeLanguage} = React.useContext(AuthContext);
    const logout = async()=> {
        spinnerRef.current.setState({
            visible: true
        });
        
        let expoToken = '';
        if (Constants.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
          }
          expoToken = (await Notifications.getExpoPushTokenAsync()).data;
        //   console.log(expoToken);
        }
        var isSuccess = await fetch(setting.apiUrl + api.signOut, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + route.params.userToken
            },
            body: JSON.stringify({
                expoToken: expoToken
            })
        })
        .then(response => response.json())
        .then(responseJson => {
            if (!responseJson.success) {
                return false;
            } else {
                return true;
            }
        })
        .catch(error => {
            console.error(error);
            return [];
        });
        spinnerRef.current.setState({ visible: false });
        if (isSuccess) {
            await AsyncStorage.clear();
            Notifications.setBadgeCountAsync(0);
            Updates.reloadAsync()
        } else {
            setTimeout(function(){
                Alert.alert(
                    "Error",
                    "Logout Failed. Please contact administrator."
                );
            },0)
        }
    }
    const SaveClientSuccess = (id, data) => {
        updateTechnciRef.current.close();
    };
    const changeapp = () =>{
        navigation.reset({
            index: 0,
            routes: [{ name: 'selectapp' }],
          });
    }
    const onPressLanguage = () => {
        LanguageModalRef.current.show(route.params.languageKey);
    };
    const onSelectLanguage = (languageName,languageKey) => {
        LanguageModalRef.current.close();
        changeLanguage(languageKey);
    }
    const actionTab = (tabname) =>{
        navigation.navigate(tabname);
    }
    const onEdit = () => {
        let data = state.TechnicianData;
        if (data.phone != "") {
            data.phone = data.phone
                .replace(/[^\d]+/g, "")
                .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
        }
        data.commissioncredit = data.commissioncredit.toString();
        data.commissioncash = data.commissioncash.toString();
        data.commissionegift = data.commissionegift.toString();
        data.commissionmember = data.commissionmember.toString();
        updateTechnciRef.current.clientData = data;
        updateTechnciRef.current.setState({ modalVisible: true });
    };
    useEffect(() => {
        setTimeout(async() => {
            languageName = await getLanguageName();
            let isLoggedIn = await isLogged();
            if (isLoggedIn) {
                tokenj = await jwtToken();
                
                servicesj = await fetchServices(tokenj);
                TechnicianDataj = await fetchByTechnician(tokenj);
            }
            setState({isLoading: true, languageName: languageName, token: tokenj, services: servicesj, TechnicianData: TechnicianDataj.data});
          }, 500);

      }, []);
      if(state.isLoading){
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container}>
                    <View style={[layout.floatGroup,styles.btniconleftcontainer]}>
                        <Icon
                            name={"web"}
                            size={24}
                            color={
                                "#bfbfbf"
                            }
                            style={
                               [
                                Platform.OS ===
                                "android"
                                    ? layout.navIcon
                                    : layout.navIconIOS,
                                    styles.btniconleft
                               ] 
                            }
                        />
                        <FloatLabelSelect
                            placeholder={state.languageName}
                            value={getTextByKey(route.params.languageKey,'language')}
                            onPress={onPressLanguage}
                            paddingStyle={styles.iconleftview}
                        />
                    </View>
                    {
                        route.params.role == 4 && 
                        <TouchableOpacity
                        style={styles.btnLogout}
                        activeOpacity={1}
                        onPress={async () => await changeapp()}
                    >
                        <View>
                            <Text style={styles.btnLogoutText}>
                                {getTextByKey(route.params.languageKey,'changeapp')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    }
                    {
                        route.params.role == 9 && 
                        <TouchableOpacity
                        style={styles.btnLogout}
                        activeOpacity={1}
                        onPress={async () => await onEdit()}
                    >
                        <View>
                            <Text style={styles.btnLogoutText}>
                                Update Profile
                            </Text>
                        </View>
                    </TouchableOpacity>
                    }
                    {
                        Platform.OS === 'android' &&
                        
                            <View>
                                                    <TouchableOpacity
                        style={styles.btnLogout}
                        activeOpacity={1}
                        onPress={async () => await actionTab('blockedtime')}
                    >
                        <View>
                            <Text style={styles.btnLogoutText}>
                                {getTextByKey(route.params.languageKey,'blockedtimetab')}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.btnLogout}
                        activeOpacity={1}
                        onPress={async () => await actionTab('ManageEgift')}
                    >
                        <View>
                            <Text style={styles.btnLogoutText}>
                                {getTextByKey(route.params.languageKey,'manageEgifttab')}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.btnLogout}
                        activeOpacity={1}
                        onPress={async () => await actionTab('service')}
                    >
                        <View>
                            <Text style={styles.btnLogoutText}>
                                {getTextByKey(route.params.languageKey,'servicetab')}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.btnLogout}
                        activeOpacity={1}
                        onPress={async () => await actionTab('clients')}
                    >
                        <View>
                            <Text style={styles.btnLogoutText}>
                                {getTextByKey(route.params.languageKey,'clientstab')}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.btnLogout}
                        activeOpacity={1}
                        onPress={async () => await actionTab('staff')}
                    >
                        <View>
                            <Text style={styles.btnLogoutText}>
                                {getTextByKey(route.params.languageKey,'stafftab')}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.btnLogout}
                        activeOpacity={1}
                        onPress={async () => await actionTab('salesreport')}
                    >
                        <View>
                            <Text style={styles.btnLogoutText}>
                                {getTextByKey(route.params.languageKey,'salesreporttab')}
                            </Text>
                        </View>
                    </TouchableOpacity>                    

                    <TouchableOpacity
                        style={styles.btnLogout}
                        activeOpacity={1}
                        onPress={async () => await actionTab('charged')}
                    >
                        <View>
                            <Text style={styles.btnLogoutText}>
                                {getTextByKey(route.params.languageKey,'chargedtab')}
                            </Text>
                        </View>
                    </TouchableOpacity>  

                    <TouchableOpacity
                        style={styles.btnLogout}
                        activeOpacity={1}
                        onPress={async () => await actionTab('sms')}
                    >
                        <View>
                            <Text style={styles.btnLogoutText}>
                                {getTextByKey(route.params.languageKey,'smstab')}
                            </Text>
                        </View>
                    </TouchableOpacity> 

                            </View>
                        
                    }

                    <TouchableOpacity
                        style={styles.btnLogout}
                        activeOpacity={1}
                        onPress={async () => await logout()}
                    >
                        <View>
                            <Text style={styles.btnLogoutText}>
                                {getTextByKey(route.params.languageKey,'logout')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>

                <SpinnerLoader
                    visible={false}
                    textStyle={layout.textLoaderScreen}
                    overlayColor={"rgba(255,255,255,0.3)"}
                    textContent={"Logging Out..."}
                    color={Colors.spinnerLoaderColor}
                    ref={spinnerRef}
                />
                <EditStaff
                    visible={false}
                    ref={updateTechnciRef}
                    token={state.token}
                    SaveClientSuccess={SaveClientSuccess}
                    language={route.params.languageKey}
                    services={state.services}
                />
                <LanguageModal 
                    visible={false} 
                    ref={LanguageModalRef}
                    onPress={onSelectLanguage}
                />                   
            </View>
        );
      }else{
        return (
            <View style={styles.container}>
                <SpinnerLoader
                    visible={true}
                    textStyle={layout.textLoaderScreen}
                    overlayColor={"transparent"}
                    textContent={"Loading..."}
                    color={Colors.spinnerLoaderColor}
                />
            </View>
        );
      }


}
export default MoreScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.lightWhite
    },
    profilepicture: {
        marginTop: 30
    },
    btnLogout: {
        height:50,
        backgroundColor: color.white,
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        marginTop: 25,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: color.whitishBorder,
    },
    btnLogoutText:{
        color: color.reddish
    },
    btniconleft:{
        position:'absolute',
        left:5,
        backgroundColor:'transparent'
    },
    iconleftview:{
        paddingLeft:35,
        
    },
    btniconleftcontainer:{
        justifyContent:'center'
    }
});
