import React from "react";
import {
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    TextInput,
    Platform,
    Image
} from "react-native";
import layout from "../../assets/styles/layout_checkin";
import { LinearGradient } from 'expo-linear-gradient';
import OneService from "./OneService";
import OneCombo from "./OneCombo";
import MultipleServiceAndCombo from "./MultipleServiceAndCombo";
import { color } from "../../assets/colors/colors";

var width = Dimensions.get('window').width;


var columnWidth = width / 6;
var TechnicianWidth = (width - 75) / 6;

export default class ListTechnician extends React.Component{
    state = {
        selectedTechnician:0,
        showCloseSearchBox: false
    }
    
    search = '';
    technicianDataList = [];
    technicianSelectedList = [];
    servicesSelected = [];
    selectedHour = '';

    UNSAFE_componentWillUnmount(){
        Dimensions.removeEventListener("change", () => {});
    }

    UNSAFE_componentWillMount(){
        width = Dimensions.get('window').width;
        TechnicianWidth = (width - 75) / 6;
        columnWidth = width / 6;

        let _this = this;
        Dimensions.addEventListener('change',function(){
            var screen = Dimensions.get('window');
            width = screen.width;
            //height = screen.height;
            columnWidth = width / 6;
            TechnicianWidth = (width - 75) / 6;
            _this.setState({ appIsReady: true });
        })
    }

    changeSearchText = (searchtext) => {
        this.search = searchtext;
        if (String.prototype.trim.call(searchtext) == '') {
            this.setState({showCloseSearchBox: false});
        } else {
            this.setState({showCloseSearchBox: true});
        }
    }

    clearSearch = () => {
        this.search = '';
        this.refs['searchtextinput'].clear();
        this.setState({showCloseSearchBox: false});
    }

    onPressTechnician = (technician,servicekey, oncase = '') => {
        this.technicianSelectedList[servicekey][this.convertTo24Hour(this.selectedHour) + '_' + servicekey] = technician;
        //console.log(this.technicianSelectedList);
        this.props.onPress(this.technicianSelectedList,oncase);  
        //this.setState({selectedTechnician: technician.id});      
    }

    onPressTechnicianCombo = (technicians) => {
        this.technicianSelectedList = technicians;
        this.props.onPress(this.technicianSelectedList);  
        //this.setState({selectedTechnician: technician.id});      
    }

    setData = (technicians,techniciansSelected,services,hour) => {
        let _this = this;
        this.technicianDataList = technicians;
        this.technicianSelectedList = techniciansSelected;
        this.servicesSelected = services;
        this.selectedHour = hour;
     
        if(this.servicesSelected.length == 1){
            
            let servicekey = this.servicesSelected[0].id;
            
            if(servicekey.indexOf('service') >= 0){
                let selectedTechnicianOneService = techniciansSelected[servicekey];  
                let selectedTechnician = 0;
                if(Object.keys(selectedTechnicianOneService).length && typeof(selectedTechnicianOneService[String.prototype.trim.call(_this.convertTo24Hour(hour)) + '_' + servicekey]) != 'undefined'){            
                    let TechDataSelected = selectedTechnicianOneService[String.prototype.trim.call(_this.convertTo24Hour(hour)) + '_' + servicekey];
                    selectedTechnician = TechDataSelected.id;
                }
                //let selectedTechnician = techniciansSelected[servicekey];  
                this.setState({rerender: true});   
                setTimeout(function(){
                    //let techniciansForOneService = technicians[String.prototype.trim.call(_this.convertTo24Hour(hour)) + '_' + services[0].id];
                    let techniciansList = _this.checkValidHour(String.prototype.trim.call(_this.convertTo24Hour(hour)),services[0]);

                    let techniciansForOneService = techniciansList.data[String.prototype.trim.call(_this.convertTo24Hour(hour)) + '_' + services[0].id];
    
                    //  console.log(techniciansForOneService);
                    //console.log(_this.convertTo24Hour(hour));
                    _this.refs.OneService.setData(techniciansForOneService,selectedTechnician,servicekey);
                },0)
            }else{
                //console.log(_this.props.services);
                this.setState({rerender: true});   
                setTimeout(function(){
                    _this.refs.OneCombo.setData(_this.servicesSelected,technicians,techniciansSelected,servicekey,_this.props.services,String.prototype.trim.call(_this.convertTo24Hour(hour)));
                },0)
            }
        }else{
            this.setState({rerender: true});   
            setTimeout(function(){
                _this.refs.MultipleServiceAndCombo.setData(_this.servicesSelected,technicians,techniciansSelected,_this.props.services,String.prototype.trim.call(_this.convertTo24Hour(hour)));
            },0)
        }
    }

    convertTo24Hour(time) {
        time = time.toLowerCase();
        var hours = time.substr(0, 2);
        if(time.length == 7){
            hours = time.substr(0, 1);
        }
        if (time.indexOf("am") != -1 && hours == 12) {
            time = time.replace("12", "0");
        }
        if (time.indexOf("pm") != -1 && parseInt(hours) < 12) {
            time = time.replace(hours, parseInt(hours) + 12);
        }
        return String.prototype.trim.call(time.replace(/(am|pm)/, ""));
    }

    checkValidHour = (hour,service, quantity, duration_config = 0) => {
        return this.props.onCheckValidHour(hour,service, quantity, duration_config);
    }

    render() {
        let display = '';

        if(this.servicesSelected.length == 1 && this.servicesSelected[0].id.indexOf('service') >= 0){
            let quantity = 1;
            if(typeof(this.servicesSelected[0].quantity) != 'undefined'){
                quantity = this.servicesSelected[0].quantity;
            }
            return (
                <OneService ref='OneService' onPress={this.onPressTechnician} quantity={quantity} providerData={this.props.providerData}  />
            )
        }else if(this.servicesSelected.length == 1 && this.servicesSelected[0].id.indexOf('combo') >= 0){
            return (
                <OneCombo ref='OneCombo' onCheckValidHour={this.checkValidHour} onPress={this.onPressTechnicianCombo} showSummary={this.props.showSummary} providerData={this.props.providerData} />
            )
        }else{
            return (
                <MultipleServiceAndCombo ref='MultipleServiceAndCombo' onCheckValidHour={this.checkValidHour} onPress={this.onPressTechnicianCombo} showSummary={this.props.showSummary} providerData={this.props.providerData} />
            )
        }

        
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    searchWrapper:{
        //marginBottom:15
    },
    dataContainer:{
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    technicianWrapper:{
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: color.white,
        marginBottom:15,
        paddingTop:10,
        paddingBottom:10,
        borderRadius:4,
        shadowColor: color.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 1
    },
    profilepicture: {
        width: 80,
        backgroundColor: "transparent",
        height: 80,
        justifyContent: "center",
        borderRadius:80,
        overflow: 'hidden',
        zIndex :2,
        marginTop:2,
        marginRight:5,
       
    },
    profilepictureIcon: {
        width: 90,
        backgroundColor: "transparent",
        height: 90,
        justifyContent: "center",
        borderRadius:90,
        overflow: 'hidden',
        zIndex :2,
        marginTop:2,
        marginRight:5
    },
    profileimage: {
        width: 80,
        height: 80
    },
    profileimageAndroid:{
         width: 80,
        height: 80,
        borderRadius:80
    },
    technicianName: {
        fontSize: 20,
        marginTop:10,
        backgroundColor:'transparent',
        textAlign:'center',
        fontFamily:'Futura',
        color: color.silver
    },
    even:{
        marginLeft:15,
        marginRight:7.5,        
    },
    middle:{
        marginLeft:7.5,
        marginRight:7.5,      
    },
    last:{
        marginLeft:7.5,
        marginRight:15,
    },
    whiteColor:{
        color: color.white
    }
})