import React from "react";
import {StyleSheet, Text, TouchableOpacity, View, Modal, Platform, TextInput, FlatList,Dimensions, Alert, ScrollView, ActivityIndicator } from "react-native";
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
export default class MailModal extends React.Component {

    state = {
        modalVisible: false,
        isSearch: false,
        widthCus: width, 
        top: this.props.top
    }

    mails = [];
    value = '';
    close() {
        this.props.onClose();
        this.setState({modalVisible: false});
    }

    show = (arrMails, isSearch, widthcus = width) => {
        this.mails = arrMails;
        this.setState({modalVisible: true, isSearch: isSearch, widthCus: widthcus});
    }
    customTop = (topcus) =>{
        this.setState({top: topcus});
    }

    selectedMail = (mail) => {
        this.props.onSelectedMail(mail);
    }


    render() {

        let display = this.mails.map((x, i) => {
            return (
                <TouchableOpacity key={i}
                    activeOpacity={1}
                    onPress={() => {this.selectedMail(x)}}
                >
                    <View  style={styles.clientrow}>
                        <Text style={styles.clientlbl}>{x}</Text>
                    </View> 
                </TouchableOpacity>
            )       
        });

        
        if(this.state.isSearch){
            if(this.mails.length > 0){
                return (
                    <ScrollView style={[styles.container, {top: this.state.top, width: this.state.widthCus}]}>
                        <View style={styles.foundresults}>
                            <View style={styles.listclientcontainer}>
                                {display}
                            </View>
                        </View>
                    </ScrollView>
                )        
            }      
        }else{
            return null;
        }
        
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        position:'absolute',
        backgroundColor: color.white,
        height:240,
        zIndex:100
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
        color: color.darkSilver    
    }
});
