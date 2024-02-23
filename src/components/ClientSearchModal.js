import React from "react";
import {StyleSheet, Text, TouchableOpacity, View, Modal, Platform, TextInput, FlatList,Dimensions, Alert, AsyncStorage, ActivityIndicator } from "react-native";
import ClientSearchItem from "./ClientSearchItem";
import { LinearGradient } from 'expo-linear-gradient';
import layout from "../assets/styles/layout";
import {
    fetchClientsData
} from "../helpers/fetchdata";
import { formatPhone } from "../helpers/Utils";
import {
    getUserData
} from "../helpers/authenticate";
import { getLanguageName, getLanguage, getTextByKey } from "../helpers/language";
import { color } from "../assets/colors/colors";

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var modalheight = height - (85 + (Platform.OS === "android" ? 60 : 70));
var topPosition = 85;
export default class ClientSearchModal extends React.Component {

    state = {
        modalVisible: false,
        isSearch: false,
        isPhone: false,
        isActive: false,
        refreshing: false
    }

    clients = [];
    value = '';
    userData = {}
    async UNSAFE_componentWillMount(){
        this.userData = await getUserData();
    }

    close() {
        this.props.onClose();
        this.setState({modalVisible: false});
    }

    show = (clientsFiltered,isPhone, isSearch, isActive,value) => {
        //this.clients = await fetchClientsData(this.props.token);
        //console.log(this.clients);
        this.clients = clientsFiltered;
        this.value = value;
        this.setState({modalVisible: true, isSearch: isSearch, isPhone: isPhone, isActive: isActive, refreshing: false});
    }
    

    /*
    _onPressItem = (id, name) => {
        // updater functions are preferred for transactional updates
        //console.log(id);

        this.props.onSelectedClient(id,name);
        //this.setState({modalVisible: false});
        //this.props.selected = id;
        //this.setState({selected:id});
        //console.log(this.state);
    };*/

    selectedClient = (client,lbl) => {
        this.props.onSelectedClient(client,lbl);
    }

    createAsNew = () => {
        if(!this.state.isActive){
            if(this.state.isPhone){
                Alert.alert('Error',getTextByKey(this.props.language,'clientphonerequire'));
            }else{
                Alert.alert('Error',getTextByKey(this.props.language,'clientemailequire'));
            }
        }else{
            this.props.createAsNewClient(this.value);
        }
    }

    refreshClients = async () => {
        if(!this.state.refreshing){
            this.setState({refreshing: true});
            await this.props.refresh();
        }
    }
    AddClient = () =>{
        this.props.open_add_client();
    }
    render() {
        let activeStyle = this.state.isActive ? {opacity:1} : {opacity:0.5};
        let display = this.clients.map((x, i) => {
            let lbl = '';
            let lblResult = '';
            if(x.fullname != null && String.prototype.trim.call(x.fullname) != ''){
                lbl = x.fullname;
                if(this.state.isPhone){
                    if(typeof x.phone != 'undefined' && x.phone != '' && x.phone != null){
                        lblResult = formatPhone(x.phone);

                        if(this.userData.role == 9){
                            let displayphoneSplit = lblResult.split('-');
                            if(displayphoneSplit.length > 1){
                                lblResult = '(xxx) xxx-' + displayphoneSplit[1];
                            }       
                        }

                        lbl += ' - ' + lblResult;
                    }else if(typeof x.email != 'undefined' && x.email != '' && x.email != null){
                        lblResult = x.email;
                        lbl += ' - ' + lblResult;
                    }
                }else{
                    if(typeof x.email != 'undefined' && x.email != '' && x.email != null){
                        lblResult = x.email;
                        lbl += ' - ' + lblResult;
                    }else if(typeof x.phone != 'undefined' && x.phone != '' && x.phone != null){
                        lblResult = formatPhone(x.phone);
                        if(this.userData.role == 9){
                            let displayphoneSplit = lblResult.split('-');
                            if(displayphoneSplit.length > 1){
                                lblResult = '(xxx) xxx-' + displayphoneSplit[1];
                            }       
                        }
                        lbl += ' - ' + lblResult;
                    }
                }  
            }else{
                if(this.state.isPhone){
                    if(typeof x.phone != 'undefined' && x.phone != '' && x.phone != null){
                        lblResult = formatPhone(x.phone);
                        if(this.userData.role == 9){
                            let displayphoneSplit = lblResult.split('-');
                            if(displayphoneSplit.length > 1){
                                lblResult = '(xxx) xxx-' + displayphoneSplit[1];
                            }       
                        }
                        lbl += lblResult;
                    }else if(typeof x.email != 'undefined' && x.email != '' && x.email != null){
                        lblResult = x.email;
                        lbl += x.email;
                    }
                }else{
                    if(typeof x.email != 'undefined' && x.email != '' && x.email != null){
                        lblResult = x.email;
                        lbl += x.email;
                    }else if(typeof x.phone != 'undefined' && x.phone != '' && x.phone != null){
                        lblResult = formatPhone(x.phone);
                        if(this.userData.role == 9){
                            let displayphoneSplit = lblResult.split('-');
                            if(displayphoneSplit.length > 1){
                                lblResult = '(xxx) xxx-' + displayphoneSplit[1];
                            }       
                        }
                        lbl += lblResult;
                    }
                }
            }
            return (
                <TouchableOpacity key={x.id}
                    activeOpacity={1}
                    onPress={() => {this.selectedClient(x,lblResult)}}
                >
                    <View  style={styles.clientrow}>
                        <Text style={styles.clientlbl}>{lbl}</Text>
                    </View> 
                </TouchableOpacity>
            )       
        });

        
        if(this.state.isSearch){
            let lblDisplay = getTextByKey(this.props.language,'useremailbookappointment');
            let lblDisplayAll = getTextByKey(this.props.language,'createclientwithemail');
            if(this.state.isPhone){
                lblDisplay = getTextByKey(this.props.language,'usephonebookappointment');
                lblDisplayAll =  getTextByKey(this.props.language,'createclientwithphone');
            }
            if(this.clients.length == 0){
                return(
                    <View style={styles.container} keyboardShouldPersistTaps='always'>
                        <View style={styles.foundresults}>
                            <View style={styles.titleheader}>
                                <View style={styles.titleheadercol}><Text style={styles.txtnoclient}>{getTextByKey(this.props.language,'noclientfound')}</Text></View>
                                <View style={styles.titleheadercol}>
                                    {/* <TouchableOpacity
                                        activeOpacity={1}
                                        style={styles.btnRefresh}
                                        onPress={async () => {await this.refreshClients()}}
                                    >
                                        <Text style={styles.txtRefresh}>{getTextByKey(this.props.language,'refresh')}</Text>
                                    </TouchableOpacity> */}
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={styles.btnRefresh}
                                        onPress={this.AddClient}
                                    >
                                        <Text style={styles.txtRefresh}>Add Client</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                    
                            <View style={styles.bottomSection}>
                                
                            </View>
                        </View>
                    </View>
                )         
            }else{
                return (
                    <View style={styles.container}>
                        <View style={styles.foundresults}>
                            <View style={styles.titleheader}>
                                <View style={styles.titleheadercol}>
                                    <Text style={styles.txtnoclient}>{getTextByKey(this.props.language,'matchedclient')}</Text>
                                </View>
                                
                            </View>
                            <View style={styles.listclientcontainer}>
                                {display}
                            </View>
                        </View>
                    </View>
                )
            }
                   
        }else{
            return <View></View>;
        }
        
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        position:'absolute',
        backgroundColor: color.white,
        top:topPosition,
        top:80,
        width:width,
        height:modalheight,
        zIndex:10000
        //flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center'
    },
    listclientcontainer:{
        flex:1
    },
    clientrow:{
        height:50,
        justifyContent: 'center',
        paddingLeft:15,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderColor: color.whitishBorder
    },
    clientlbl:{
        fontSize:16
    },
    foundresults:{
        flex:1,
        //backgroundColor:'blue',
        position:'relative'
    },
    bottomSection:{
        bottom: 0,
        position:'absolute',
        width:width,
        //backgroundColor:'yellow',
        zIndex:101
    },
    txtnoclient:{
        fontSize:16,
        color: color.silver,
        marginLeft:15
    },
    titleheader:{
        backgroundColor: color.lightWhite,
        height:35,
        
        position:'relative',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderColor: color.whitishBorder,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    titleheadercol:{
        justifyContent: 'center',
        height:35,
    },
    btnSave: {
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        marginBottom: 15
    },
    btnSaveText: {
        color:  color.white,
        fontSize: 16,
        zIndex: 1,
        backgroundColor: "transparent"
    },
    btnSaveWraper: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 15,
        right: 15,
        zIndex:1
    },
    btnLinear: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        overflow: "hidden",
        flex: 1
    },
    btnRefresh:{
        
    },
    txtRefresh:{
        color: color.reddish,
        textAlign:'right',
        paddingRight:15,
        fontSize:16
    },
    clientLoaderContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:20
    },
    clientLoader:{
        justifyContent: 'center',
        alignItems: 'center',
        height:100,
        width:120
    },
    textContent:{
        fontSize:16,
        marginTop:5,
        color:color.darkSilver   
    }
});
