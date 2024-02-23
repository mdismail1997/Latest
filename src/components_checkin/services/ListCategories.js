import React from "react";
import {
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    TextInput,
    Alert
} from "react-native";
import layout from "../../assets/styles/layout_checkin";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ScreenOrientation} from "expo";
import { LinearGradient } from 'expo-linear-gradient';
import { color } from "../../assets/colors/colors";
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').width.height;
//var orientation = (width > height) ? 'LANDSCAPE' : 'PORTRAIT';
var widthLeft = width * 0.7;
var columns = 1;
var serviceWidth = (widthLeft - 45) / columns;
var serviceRightWidth = 80;
var serviceLeftWidth = serviceWidth - serviceRightWidth;
//const orientation = (width > height) ? 'LANDSCAPE' : 'PORTRAIT';
var btnWidth = width - 30;
export default class ListCategories extends React.Component{
    state = {
        selectedService:[],
        showCloseSearchBox: false
    }

    columnWidth = (widthLeft / columns) - 100;
    search = '';
    selectServices = [];
    price = 0;
    selectedServicesInCategory = [];

    UNSAFE_componentWillUnmount(){
        Dimensions.removeEventListener("change", () => {});
    }

    UNSAFE_componentWillMount(){
        width = Dimensions.get('window').width;
        height = Dimensions.get('window').width.height;
        widthLeft = width * 0.7;
        serviceWidth = (widthLeft - 45) / columns;
        serviceLeftWidth = serviceWidth - serviceRightWidth;
        this.columnWidth = (widthLeft / columns) - 100;

        let _this = this;
        btnWidth = width - 30;
        Dimensions.addEventListener('change',function(){
            var screen = Dimensions.get('window');
            width = screen.width;
            height = screen.height;
            widthLeft = width * 0.7;
            /*
            orientation = (width > height) ? 'LANDSCAPE' : 'PORTRAIT';
            if(orientation == 'LANDSCAPE'){
                columns = 3;
            }*/

            serviceWidth = (widthLeft - 45) / columns;
            serviceLeftWidth = serviceWidth - serviceRightWidth;
            _this.columnWidth = (widthLeft / columns) - 100;
            btnWidth = width - 30;
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

    onPressService = (service) => {
        //console.log(service);
        let serviceSelected = this.selectServices.filter(function(item){
            return item.id == service.id;
        });
        let newList = [];
        if(serviceSelected.length){
            if(typeof(this.props.isBooking) == 'undefined'){
                this.selectServices.forEach(function(item) {
                    if(item.id != service.id){
                        newList.push(item);
                    }
                });
                this.selectServices = newList;
            }
        }else{
            this.selectServices.push(service);
        }
        
        this.props.onPress(this.selectServices, service);  
        this.setState({selectedService: this.selectServices});      
    }

    saveAppointment = () => {
        let isValid = Object.keys(this.selectServices).length;
        if(!isValid){
            Alert.alert('Error','Please choose service');        
        }else{
            this.props.onSave();
        }
        
    }

    renderCategories = () => {
        let arrKey = {};
        let categoryDisplay = this.props.categories.map((x, i) => {
            let isExists = this.selectServices.filter(function(item){
                return item.id == x.id
            }).length;
          
            let serviceTextColor = styles.defaultColor;
            let serviceDurationTextColor = styles.defaultColor;
            

            let isShow = true;
            if(this.search != ''){
                isShow = x.name.toLowerCase().indexOf(this.search.toLowerCase()) >= 0;
            }
            if(isShow){
                let customStyle = {};
                let customFontSize = {};
                let isChangeBackound = false;
                if(typeof(x.category_backgroundcolor) != 'undefined' && x.category_backgroundcolor != null 
                    && String.prototype.trim.call(x.category_backgroundcolor) != ''){
                    customStyle.backgroundColor = x.category_backgroundcolor;
                    isChangeBackound = true;
                }

                if(typeof(this.props.userData) != 'undefined'){
                    if(typeof(this.props.userData.checkinCategoryFontSize) != 'undefined'
                    && this.props.userData.checkinCategoryFontSize != null 
                    && String.prototype.trim.call(this.props.userData.checkinCategoryFontSize) != ''){
                        //console.log(this.props.userData.checkinCategoryFontSize);
                        if(this.props.userData.checkinCategoryFontSize > 0){
                            customFontSize.fontSize = this.props.userData.checkinCategoryFontSize;
                            if(isChangeBackound){
                                customFontSize.color = 'black';
                            }
                        }
                        
                    }
                }

                let listServiceSelected = this.selectedServicesInCategory.filter(function(itemService){
                    if(typeof(itemService.category_customname) != 'undefined' && String.prototype.trim.call(itemService.category_customname) != ''){
                        return itemService.category_customname == x.name;
                    }else{
                        return itemService.category_name == x.name;
                    }
                })

                

                let countService = 0;
                let lblCountService = '1 service';
                if(listServiceSelected.length){
                    isExists = true;
                    countService = listServiceSelected.length;
                    if(countService > 1){
                        lblCountService = countService + ' services';
                    }
                }
                
                if(typeof(this.props.isBooking) != 'undefined'){
                    isExists = false;
                }

                if(isExists){
                    serviceTextColor = styles.whiteColor;
                    serviceDurationTextColor =  styles.whiteDurationColor;
                }

                //backgroundColor:x.category_backgroundcolor
                return (
                    <TouchableOpacity key={x.name} activeOpacity={1} onPress={() => {this.onPressService(x)}}>
                        <View style={{ width: this.columnWidth  }}>
                            { isExists == 0 &&
                                <View style={[styles.serviceItem, customStyle]}>
                                    
                                    <View style={[styles.serviceLeft]}>
                                        <Text style={[styles.serviceName,serviceTextColor,customFontSize]}>{x.name}</Text>
                                    </View>
                                    {
                                        countService > 0
                                        &&
                                        <View style={{paddingRight:15}}>
                                            <Text style={{color: color.black,backgroundColor:'transparent', fontSize:22}}>{lblCountService}</Text>
                                        </View>
                                    }
                                </View>
                            }

                            { isExists > 0 &&
                                <LinearGradient start={[0, 0]} end={[1, 0]} colors={[color.reddish, color.reddish]} 
                                    style={[styles.containerItemSelected]}>
                                    <View style={[styles.serviceLeft]}>
                                        <Text style={[styles.serviceName,customFontSize,serviceTextColor]}>{x.name}</Text>
                                    </View>
                                    {
                                        countService > 0
                                        &&
                                        <View style={{paddingRight:15}}>
                                            <Text style={{color: color.white,backgroundColor:'transparent', fontSize:22}}>{lblCountService}</Text>
                                        </View>
                                    }
                                </LinearGradient>  
                            }

                        </View>
                    </TouchableOpacity>    
                )
            }else{
                return false;
            }
            
        });
        return categoryDisplay;
    }

    reload = (selectedServicesInCategory) => {
        this.selectedServicesInCategory = selectedServicesInCategory;
        this.setState({rerender:true});
    }

    render() {
        //console.log(this.columnWidth);
        this.price = 0;
        let increase = 0;
  
        let categoryDisplay = this.renderCategories();
        let isBooking = typeof(this.props.isBooking) != 'undefined' ? true : false;

        
        return (
            <View style={styles.container}>
                <View style={styles.searchWrapper}>
                    <View style={layout.searchContainer}>
                        <Icon
                            name={'magnify'}
                            size={20}
                            color={color.gray42} style={layout.iconsearchbox}
                        />
                        <TextInput
                            placeholder='Search Service' placeholderTextColor={color.gray42}
                            underlineColorAndroid={'transparent'}
                            style={layout.searchbox}
                            onChangeText={(searchtext) => this.changeSearchText(searchtext)}
                            ref={'searchtextinput'}
                        />

                        {this.state.showCloseSearchBox &&
                        <TouchableOpacity style={layout.iconclosesearchbox} activeOpacity={1}
                                          onPress={() => this.clearSearch()}>
                            <Icon
                                name={'close-circle-outline'}
                                size={20}
                                color={color.gray42}
                            />
                        </TouchableOpacity>
                        }
                    </View>    
                </View>
                <View style={{flex:1}}>
                    <ScrollView contentContainerStyle={styles.dataContainer} keyboardShouldPersistTaps="always">
                        {categoryDisplay}
                
                    </ScrollView>
               
                    
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    categoryContainer:{
        height:40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:15
    },
    categoryLabel:{
        color:color.reddish,
        fontSize:24,
        fontFamily:'Futura'
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
        color:color.white,
        backgroundColor:'transparent'
    },
    selectedServicesPrice:{
        color:color.white,
        fontSize:22,
        fontFamily:'Futura',
        backgroundColor:'transparent'
    },
    searchWrapper:{
        //marginBottom:15
    },
    dataContainer:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingRight:50,
        paddingLeft:50
    },
    serviceItem:{
        
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor:color.white,
        flexDirection: 'row',
        marginBottom:15,
        paddingTop:8,
        paddingBottom:8,
        borderRadius:4,
        shadowColor: color.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,


    },
    whiteColor:{
        color:color.white,
        backgroundColor:'transparent'
    },
    whiteDurationColor:{
        color:'rgba(255,255,255,0.6)',
        backgroundColor:'transparent'
    },
    defaultColor:{
        backgroundColor:'transparent'
    },
    serviceName:{
        fontSize:20,
        fontFamily:'Futura',
        color: color.gray
    },
    servicePrice:{
        textAlign:'right',
        fontSize:22,
        paddingRight:20,
        color:color.reddish,
    },
    serviceRight:{
        width:serviceRightWidth
    },
    serviceLeft:{
        paddingLeft:20
    },
    serviceDuration:{
        color: color.darkGray,
        fontSize:16,
        marginTop:5
    },
    serviceItemSelected:{
        backgroundColor:'transparent',
    },
    containerItemSelected:{
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor:color.white,
        flexDirection: 'row',
        marginBottom:15,
        paddingTop:8,
        paddingBottom:8,
        borderRadius:4,
        shadowColor: color.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2
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
        color: color.lightishPink,
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
    btnBlockWraper:{
        height:60,
        marginLeft:15,
        marginBottom:15
    },
    btnSaveWraper: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    btnLinearConfirm: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        overflow: "hidden",
        flex: 1
        
    },
    btnSaveTextConfirm: {
        color: color.white,
        fontSize: 30,
        zIndex: 1,
        backgroundColor: "transparent",
        fontFamily:'Futura'
    }
    
})