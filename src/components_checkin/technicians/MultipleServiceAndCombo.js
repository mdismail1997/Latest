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
    Image, Alert
} from "react-native";
import layout from "../../assets/styles/layout_checkin";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import ModalTechnician from "./ModalTechnician";
import { color } from "../../assets/colors/colors";
import { gStrings } from "../../components/staticStrings";



var width = Dimensions.get('window').width;
var widthLeft = width * 0.7;
var columns = 1;
var columnWidthService = widthLeft / columns;
var columnWidth = widthLeft / 4;
var TechnicianWidth = (widthLeft - 75) / 4;
var serviceRightWidth = 80;
var serviceLeftWidth = serviceWidth - serviceRightWidth;
var serviceWidth = (widthLeft - 45) / columns;

export default class MultipleServiceAndCombo extends React.Component{
    state = {}
    
    search = '';
    technicianDataList = [];
    servicekey = '';
    incase = '';
    selectedServices = [];
    listServices = [];
    hour = '';
    selectedTechnician = {};
    endTime = '';
    title = '';
    servicesList = [];
    combosList = [];
    starthour = '';

    UNSAFE_componentWillUnmount(){
        Dimensions.removeEventListener("change", () => {});
    }

    UNSAFE_componentWillMount(){
        width = Dimensions.get('window').width;
        widthLeft = width * 0.7;
        TechnicianWidth = (widthLeft - 75) / 4;
        columnWidth = widthLeft / 4;
        columnWidthService = widthLeft / columns;

        serviceWidth = (widthLeft - 45) / columns;
        serviceLeftWidth = serviceWidth - serviceRightWidth;

        let _this = this;
        Dimensions.addEventListener('change',function(){
            var screen = Dimensions.get('window');
            width = screen.width;
            widthLeft = width * 0.7;
            columnWidth = widthLeft / 4;
            TechnicianWidth = (widthLeft - 75) / 4;
            columnWidthService = widthLeft / columns;
            serviceWidth = (widthLeft - 45) / columns;
            serviceLeftWidth = serviceWidth - serviceRightWidth;
            _this.setState({ appIsReady: true });
        })
    }


    onPressTechnician = (technicianSelectedModal,servicekeySelected,comboid) => {
        let technicianSelectedInCombo = this.selectedTechnician[comboid];
        if(Object.keys(technicianSelectedInCombo).length){    
            let techDataForAdded = {};
            techDataForAdded.fullname = technicianSelectedModal.fullname;
            techDataForAdded.id = technicianSelectedModal.id;
            techDataForAdded.start = technicianSelectedModal.start;
            techDataForAdded.end = technicianSelectedModal.end;
            techDataForAdded.duration = technicianSelectedModal.duration;
            this.selectedTechnician[comboid][servicekeySelected] = techDataForAdded;         
        }
        this.refs.ModalTechnician.setState({visible:false});
        this.setState({rerender: true});  
        this.props.onPress(this.selectedTechnician);          
    }

    calculateEndHour = () => {
        let arrTechEndHour = {};
        let end = 0;
        let _this = this;
        Object.keys(this.selectedTechnician).forEach(function(itemkeySerivice){
            let ListServiceSelected = _this.selectedTechnician[itemkeySerivice];
            Object.keys(ListServiceSelected).forEach(function(itemkey){
                let item = ListServiceSelected[itemkey];
                if(typeof(arrTechEndHour[item.id]) == 'undefined'){
                    arrTechEndHour[item.id] = parseInt(item.end.replace(':',''));
                }else{
                    arrTechEndHour[item.id] = _this.getEndHour(_this.formatHourFromNumber(arrTechEndHour[item.id]),item.duration);
                }
                if(end < arrTechEndHour[item.id]){
                    end = arrTechEndHour[item.id];
                }
            })
            
        })
        this.endTime = ' - Estimated end at ' + this.formatHour(this.formatHourFromNumber(end));
    }

    getTimeFromMins(mins) {
        if (mins >= 24 * 60 || mins < 0) {
            throw new RangeError(gStrings.validTimeMins);
        }
        var h = mins / 60 | 0,
            m = mins % 60 | 0;
        return (h * 100) + m;
    }

    getEndHour(startHour, duration) {
        var startInHour = startHour.split(':')[0] + "00";
        var startInMinute = startHour.split(':')[1];
        var totalMinute = parseInt(startInMinute) + parseInt(duration);
        var calculateEndHour = parseInt(startInHour) + parseInt(this.getTimeFromMins(totalMinute));
        return calculateEndHour;
    }

    formatHourFromNumber(calculateEndHour) {
        let prefix = '';
        if (calculateEndHour.toString().length == 4) {
            hour = calculateEndHour.toString().substring(0, 2);
            minute = calculateEndHour.toString().substring(2, 4);
        } else {
            hour = calculateEndHour.toString().substring(0, 1);
            minute = calculateEndHour.toString().substring(1, 3);
            prefix = '0';
        }
        return  prefix + hour + ':' + minute;
    }

    formatHour(hour) {
        var prefix = '';
        var split = hour.split(':');
        hour = parseInt(split[0]);
        minute = split[1];
        var hourformat = 'AM';
        if (parseInt(hour) >= 12) {
            if (parseInt(hour) > 12) {
                hour = parseInt(hour) - 12;
            }
            hourformat = 'PM';
        }
        if (hour.toString().length == 2) {
            prefix = '';
        } else {
            prefix = "0";
        }
        return prefix + hour + ":" + minute + " " + hourformat;
    }

    setData = (selectedServices,technicians,selectedTechnician,listServices,hour) => {
        let isService = false;
        let serviceTitle = '';
        let comboTitle = '';
        this.servicesList = [];
        this.combosList = [];
        let _this = this;
        selectedServices.forEach(function(service){
            if(service.id.indexOf('service') >= 0){
                _this.servicesList.push(service);
                serviceTitle = 'services';
            }else{
                _this.combosList.push(service);
                comboTitle = 'combos';
            }
        });
        if(serviceTitle != '' && comboTitle != ''){
            this.title = serviceTitle + ' and ' + comboTitle;
        }else  if(serviceTitle != '' && comboTitle == ''){ 
            this.title = 'services';
        }else  if(serviceTitle == '' && comboTitle != ''){ 
            this.title = 'combos';
        }
        this.technicianDataList = technicians;
        this.listServices = listServices;
        this.selectedServices = selectedServices;
        this.hour = hour;
        this.selectedTechnician = selectedTechnician;
        if(this.props.providerData.isManageTurn == 1){
            if(this.selectedServices.length > 0){
                this.starthour = this.hour;
                this.servicesList.map((service,i) => {
                    let quantity = 1;
                    if(typeof(service.quantity) != 'undefined'){
                        quantity = service.quantity;
                    }
                    this.renderItemAutoSelect(service,i,service.id, quantity);
    
                });
                this.combosList.map((combo,i) => {
                    let combosDisplay = [];
                    let quantity = 1;
                    if(typeof(combo.quantity) != 'undefined'){
                        quantity = combo.quantity;
                    }
                    combosDisplay = combo.services.map((x, index) => {
                        let serviceItemData = this.listServices.filter(function(item){
                            return item.id == 'service_' + x.serviceid;        
                        });
                        let serviceItem = serviceItemData[0];
                        this.renderItemAutoSelect(serviceItem,index,combo.id, quantity, x.duration);
                    })
                })
    
                this.props.onPress(this.selectedTechnician);   
            }
        }
        this.setState({rerender: true}); 
    }
    renderItemAutoSelect = (service,i,key, quantityService, duration_config = 0) =>{
        let quantity = 1;
        if(typeof(service.quantity) != 'undefined'){
            quantity = service.quantity;
        }
        let _this = this;
        let technicianSelectedInService = this.selectedTechnician[key];
        let dataValidHour = this.props.onCheckValidHour(this.starthour,service, quantityService, duration_config);
        let techniciansForService = dataValidHour.data[this.starthour + '_' + service.id];
        let techniciansForService1 = techniciansForService.filter(function(item){
            return  (typeof(item.checkinid) != 'undefined' && item.checkinid != 10000);
        })
        if(Object.keys(technicianSelectedInService).length && typeof(technicianSelectedInService[this.starthour + '_' + service.id]) != 'undefined'){            
            technician = technicianSelectedInService[this.starthour + '_' + service.id];
        }else{
            let isMatchHour = false;
            technician = techniciansForService1[i];
            if(typeof(technician) == 'undefined'){
                if(typeof(techniciansForService) == 'undefined'){
                    //Alert.alert('Error', 'No technician currently, please update technician or Active allow guest choose "Any Technician", ***Note: add technician skills!');
                    return true;
                }
                let anytechnician = techniciansForService[0];
                let techDataForAdded = {};
                techDataForAdded.fullname = 'Any Technician';
                techDataForAdded.id = 0;
                techDataForAdded.start = anytechnician.start;
                techDataForAdded.end = anytechnician.end;
                techDataForAdded.duration = anytechnician.duration;
                technicianSelectedInService[this.starthour + '_' + service.id] = techDataForAdded;
            }else{
                let techDataForAdded = {};
                techDataForAdded.fullname = technician.fullname;
                techDataForAdded.id = technician.id;
                techDataForAdded.start = technician.start;
                techDataForAdded.end = technician.end;
                techDataForAdded.duration = technician.duration;
                technicianSelectedInService[this.starthour + '_' + service.id] = techDataForAdded;
            }
        }
        this.starthour = dataValidHour.hour;

        this.selectedTechnician[service.id]= technicianSelectedInService;  
    }


    selectTechnician = (service_name,quantity,technicians,technicianSelectedId,servicekey,comboid) => {
        this.refs.ModalTechnician.setState({visible:true,servicename : service_name, quantity:quantity});
        let _this = this;
        setTimeout(function(){
            _this.refs.ModalTechnician.setData(technicians,technicianSelectedId,servicekey,comboid);
        },0)
    }

    renderItem = (service,i,key, quantityService, duration_config = 0) => {
        let _this = this;
        let technicianSelectedInService = this.selectedTechnician[key];
        let dataValidHour = this.props.onCheckValidHour(this.starthour,service, quantityService, duration_config);
        let techniciansForService = dataValidHour.data[this.starthour + '_' + service.id];
        if(Object.keys(technicianSelectedInService).length && typeof(technicianSelectedInService[this.starthour + '_' + service.id]) != 'undefined'){            
            technician = technicianSelectedInService[this.starthour + '_' + service.id];
        }else{
            let isMatchHour = false;
            if(typeof(techniciansForService) == 'undefined'){
                //Alert.alert('Error', 'No technician currently, please update technician or Active allow guest choose "Any Technician", ***Note: add technician skills!');
                return true;
            }
            technician = techniciansForService[0];
            if(typeof(technician) == 'undefined'){
                return true;
            }
            let techDataForAdded = {};
            techDataForAdded.fullname = technician.fullname;
            techDataForAdded.id = technician.id;
            techDataForAdded.start = technician.start;
            techDataForAdded.end = technician.end;
            techDataForAdded.duration = technician.duration;
            technicianSelectedInService[this.starthour + '_' + service.id] = techDataForAdded;
        }
        let starthourkey = this.starthour;
        let quantity = 1;
        if(typeof(service.quantity) != 'undefined'){
            quantity = service.quantity;
        }
        if(typeof(quantityService) != 'undefined'){
            quantity = quantityService;
        }
        var idtech = technician.id;
        let display = 
            <View key={key + '_' + service.id} style={{ width: columnWidthService }}>
                <View style={[styles.serviceItem, i % columns == 0 ? styles.even : styles.odd]}>
                    <View style={[styles.serviceLeft,{width: serviceLeftWidth}]}>
                        <Text style={[styles.serviceName]}>{service.service_name}</Text>
                        <View style={styles.servicetechnicianwraper}>
                            <Text style={[styles.serviceTechnicianlbl]}>Qty: </Text>
                            <Text style={[styles.serviceTechnician]}>{quantity}</Text>
                            <Text style={[styles.serviceTechnicianlbl,{marginLeft:15}]}>Technician: </Text>
                            <Text style={[styles.serviceTechnician]}>{technician.fullname}</Text>
                            <Text style={[styles.serviceTechnicianlbl,{marginLeft:15}]}>Start at: </Text>
                            <Text style={[styles.serviceTechnician]}>{this.formatHour(technician.start)}</Text>
                        </View>
                    </View>
                    <View style={styles.serviceRight}>
                        <TouchableOpacity style={styles.selectTechnician} activeOpacity={1}
                                    onPress={() => {this.selectTechnician(service.service_name, quantity,techniciansForService,idtech,starthourkey + '_' + service.id,key)}}>
                            <Icon
                                name={'chevron-down'}
                                size={30}
                                color={color.gray42}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        ;

        this.starthour = dataValidHour.hour;
        return display;
    }

    renderCombo = (combo,i) => {
        let combosDisplay = [];
        let quantity = 1;
        if(typeof(combo.quantity) != 'undefined'){
            quantity = combo.quantity;
        }
        combosDisplay = combo.services.map((x, index) => {
            let serviceItemData = this.listServices.filter(function(item){
                return item.id == 'service_' + x.serviceid;        
            });
            let serviceItem = serviceItemData[0];
            return this.renderItem(serviceItem,index,combo.id, quantity, x.duration);
        })
        
        return (
            <View key={combo.id + '_' + i} style={[{width : widthLeft},styles.comboBlock]}>
                <Text style={[{width : widthLeft},styles.displayheader]}>{combo.comboname +' (x'+quantity+")"}</Text> 
                {combosDisplay}
            </View>
        )
        
    }

    showSummary = () => {
        this.props.showSummary();
    }

    render() {

        let _this = this;
        let servicesDisplay = [];
        let combosDisplay = [];
        let estimateStart = this.formatHour(this.hour);
        this.starthour = this.hour;
        if(this.selectedServices.length > 0){
            servicesDisplay = this.servicesList.map((service,i) => {
                let quantity = 1;
                if(typeof(service.quantity) != 'undefined'){
                    quantity = service.quantity;
                }
                return this.renderItem(service,i,service.id, quantity);
            })
            combosDisplay = this.combosList.map((combo,i) => {
                return this.renderCombo(combo,i);
            })
        }
        this.calculateEndHour();
        return (
            <View style={styles.container}>
                <View style={{flex:1}}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.mainTitle}>We recommended best matching technicians for your selected {this.title}</Text>
                    </View>
                    <Text style={styles.mainSuggestTitle}>You can change technician by clicking on icon below</Text>
                    <ScrollView contentContainerStyle={styles.dataContainer} keyboardShouldPersistTaps="always">
                        <Text style={[{width : widthLeft},styles.displayheader]}>Services</Text>
                        {servicesDisplay}
                        {combosDisplay}
                    </ScrollView>
                   
                </View>
                <ModalTechnician visible={false} ref='ModalTechnician' onPress={this.onPressTechnician} providerData={this.props.providerData} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    titleContainer:{
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center'
    },
    mainTitle:{
        fontSize:20,
        fontFamily:'Futura',
        color: color.white,
        paddingLeft:15,
        marginRight:15,
        textAlign:'center'
    },
    highlightTitle:{
        fontSize:24,
        fontFamily:'Futura',
        color: color.reddish
    },
    mainSuggestTitle:{
        fontSize:16,
        fontFamily:'Futura',
        color: color.white,
        textAlign:'center',
        marginTop:10,
        marginBottom:20
    },
    dataContainer:{
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    comboBlock:{
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    serviceItem:{
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: color.white,
        flexDirection: 'row',
        marginBottom:15,
        paddingTop:20,
        paddingBottom:20,
        borderRadius:4,
        shadowColor: color.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2

    },
    even:{
        marginLeft:15,
        marginRight:7.5,        
    },
    odd:{
        marginLeft:7.5,
        marginRight:15,      
    },
    serviceRight:{
        width:serviceRightWidth,
        alignItems: 'flex-end',
        paddingRight:20
    },
    serviceLeft:{
        paddingLeft:20
    },
    serviceName:{
        fontSize:20,
        fontFamily:'Futura',
        color: color.silver
    },
    serviceTechnician:{
        color: color.reddish,
        fontSize:16,
        marginTop:5
    },
    serviceTechnicianlbl:{
        color: color.darkGray,
        fontSize:16,
        marginTop:5
    },
    servicetechnicianwraper:{
        flexDirection: 'row',
    },
    selectTechnician:{

    },
    selectedServices:{
        height:80,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedServicesCount:{
        fontSize:22,
        fontFamily:'Futura',
        color: color.white,
        backgroundColor:'transparent'
    },
    btnSave: {
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 0,
        marginBottom: 0,
        marginLeft:20,
        backgroundColor: color.whiteRGB,
        paddingLeft:15,
        paddingRight:15,
        paddingTop:5,
        paddingBottom:5,
        borderRadius:40
    },
    btnSaveText: {
        color: "#EF75A4",
        fontSize: 30,
        zIndex: 1,
        backgroundColor: "transparent",
        fontFamily:'Futura'
        
    },
    btnSaveWraper: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.whiteRGB,
        paddingLeft:15,
        paddingRight:15,
        paddingTop:5,
        paddingBottom:5,
        borderRadius:40
    },
    btnLinear: {
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        flex: 1
        
    },
    displayheader:{
        fontSize:24,
        fontFamily:'Futura',
        color: color.white,
        justifyContent: "center",
        marginTop:10,
        marginBottom:20,
        paddingLeft: 15
    }
})