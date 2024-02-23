import React from "react";
import {
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    TextInput,
    Modal
} from "react-native";
import layout from "../../assets/styles/layout_checkin";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {ScreenOrientation} from "expo";
import { LinearGradient } from 'expo-linear-gradient';
import BtnQuantity from "../../components_checkin/btnQuantity";
import { color } from "../../assets/colors/colors";

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').width.height;
//var orientation = (width > height) ? 'LANDSCAPE' : 'PORTRAIT';
var columns = 2;
var serviceWidth = (width - 45) / columns;
var serviceRightWidth = 95;
var serviceLeftWidth = serviceWidth - serviceRightWidth;
//const orientation = (width > height) ? 'LANDSCAPE' : 'PORTRAIT';

const maxServiceCount = 4;
export default class ListServicesInCategory extends React.Component{
    state = {
        selectedService:[],
        showCloseSearchBox: false,
        modalVisible: false
    }

    columnWidth = width / columns;
    search = '';
    selectServices = [];
    price = 0;
    category = "";
    
    maxCount = maxServiceCount;
    categoriesShow = {};

    UNSAFE_componentWillUnmount(){
        Dimensions.removeEventListener("change", () => {});
    }

    UNSAFE_componentWillMount(){
        width = Dimensions.get('window').width;
        height = Dimensions.get('window').width.height;
        serviceWidth = (width - 45) / columns;
        serviceLeftWidth = serviceWidth - serviceRightWidth;
        this.columnWidth = width / columns;

        let _this = this;
        Dimensions.addEventListener('change',function(){
            var screen = Dimensions.get('window');
            width = screen.width;
            height = screen.height;
            /*
            orientation = (width > height) ? 'LANDSCAPE' : 'PORTRAIT';
            if(orientation == 'LANDSCAPE'){
                columns = 3;
            }*/

            serviceWidth = (width - 45) / columns;
            serviceLeftWidth = serviceWidth - serviceRightWidth;
            _this.columnWidth = width / columns;
            
            _this.setState({ appIsReady: true });
        })
    }

    show = (category) => {
        this.category = category;
        if(typeof(this.categoriesShow[category]) != 'undefined'){
            this.isShowMore = false;
            this.maxCount = 9999;
        }else{
            this.isShowMore = true;
            this.maxCount = maxServiceCount;
        }
        this.setState({modalVisible: true });
    }

    close() {
        this.setState({modalVisible: false});
        this.props.close();
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
            this.selectServices.forEach(function(item) {
                if(item.id != service.id){
                    newList.push(item);
                }
            });
            this.selectServices = newList;
        }else{
            this.selectServices.push(service);
        }
        
        this.props.onPress(this.selectServices);  
        this.setState({selectedService: this.selectServices});      
    }

    setServices = (services) => {
        this.selectServices = services;
        //console.log(this.selectServices );
        this.setState({selectedService: this.selectServices}); 
    }

    onSelectedServices = () => {
        let isValid = Object.keys(this.selectServices).length;
        if(!isValid){
            Alert.alert('Error','Please choose service');        
        }else{
            this.props.onSelectedServices();  
        }
    }
    onQuantityService = (type, id) =>{

        let serviceItem = this.props.services.filter(function(item){
            return item.id == id;
        })[0];
        if(type == 'plus'){
            if(typeof(serviceItem.quantity) != 'undefined' && serviceItem.quantity > 1){
                serviceItem.quantity += 1;
            }else{
                serviceItem.quantity = 2;
            }
        }else{
            if(typeof(serviceItem.quantity) != 'undefined' && serviceItem.quantity > 1){
                serviceItem.quantity -= 1;
            }else{
                serviceItem.quantity = 1;
            }
        }
        this.setState({ appIsReady: true });
    }
    
    renderServices = (category) => {
        let increase = 0;
        let serviceInCategories = this.props.services.filter(function(item){
            if(typeof(item.category_customname) != 'undefined' && String.prototype.trim.call(item.category_customname) != ''){
                return item.category_customname == category;
            }else{
                return item.category_name == category;
            }
            
        });
        let Service = false;
        let isAny = false;
        let count = 0;
        if(serviceInCategories.length){
            
            let customFontSize = {};
            
            //let firstService = serviceInCategories[0];
            if(typeof(this.props.userData) != 'undefined'){
                if(this.props.userData.serviceSortType == 'Alphabet'){
                    serviceInCategories = serviceInCategories.sort(function (a, b) {
                        if (a.service_name < b.service_name) return -1;
                        else if (a.service_name > b.service_name) return 1;
                        return 0;
                    });
                }else if(this.props.userData.serviceSortType == 'Price'){
                    serviceInCategories = serviceInCategories.sort(function (a, b) {
                        if (a.price < b.price) return -1;
                        else if (a.price > b.price) return 1;
                        return 0;
                    });
                }else{
                    serviceInCategories = serviceInCategories.sort(function (a, b) {
                        if (a.display_order < b.display_order) return -1;
                        else if (a.display_order > b.display_order) return 1;
                        return 0;
                    });
                }


                if(typeof(this.props.userData.checkinCategoryFontSize) != 'undefined'
                && this.props.userData.checkinCategoryFontSize != null 
                && String.prototype.trim.call(this.props.userData.checkinCategoryFontSize) != ''){
                    //console.log(this.props.userData.checkinCategoryFontSize);
                    if(this.props.userData.checkinCategoryFontSize > 0){
                        customFontSize.fontSize = this.props.userData.checkinCategoryFontSize;
                    }
                    
                }
            }
            
            if(this.props.userData.showLessServiceCount == 'all'){
                this.maxCount = 9999;
                this.isShowMore = false;
            }
            
            if(this.maxCount == 9999){
                this.isShowMore = false;
                let serviceShowLess = serviceInCategories.filter(function(itemService){
                    return itemService.isHideShowLessOnCheckInApp == 0 || typeof(itemService.isHideShowLessOnCheckInApp) == 'undefined' && itemService.status == 'YES';
                });

                let serviceShowMore = serviceInCategories.filter(function(itemService){
                    return typeof(itemService.isHideShowLessOnCheckInApp) != 'undefined' && itemService.isHideShowLessOnCheckInApp == 1 && itemService.status == 'YES';
                });

                serviceShowLess.push(...serviceShowMore);
                serviceInCategories = serviceShowLess;
                //serviceShowLess.push(...serviceShowMore);
                //serviceInCategories = serviceShowLess;
                //console.log(serviceShowMore);
                //serviceInCategories = [];
                //serviceInCategories.push.apply(serviceShowLess, serviceShowMore);
            }else{
                this.isShowMore = true;
                let serviceShowLess = serviceInCategories.filter(function(itemService){
                    return typeof(itemService.isHideShowLessOnCheckInApp) == 'undefined' || (typeof(itemService.isHideShowLessOnCheckInApp) != 'undefined' && itemService.isHideShowLessOnCheckInApp == 0);
                });

                let activeServices = serviceShowLess.filter(function(itemService){
                    return typeof(itemService.status) == 'undefined' || itemService.status == 'YES';    
                })

                if(activeServices.length < this.maxCount){
                    //console.log('less');
                    let serviceMore = serviceInCategories.filter(function(itemService){
                        return typeof(itemService.isHideShowLessOnCheckInApp) != 'undefined' && itemService.isHideShowLessOnCheckInApp == 1 && itemService.status == 'YES';
                    });
                    serviceInCategories = serviceShowLess;
                    let remaining = this.maxCount - activeServices.length;
                    //console.log(remaining);
                    //console.log(activeServices.length);
                    let concatServices = serviceMore.slice(0, remaining);
                    serviceInCategories.push(...concatServices);
                    //console.log(concatServices);
                }else{
                    serviceInCategories = serviceShowLess;
                }
                //console.log(serviceInCategories);
            }
            
            //console.log(serviceInCategories);
            Service = serviceInCategories.map((x, i) => {
                if(x.status != 'NO'){
                    count++;
                }
               
                if(x.id.toString().indexOf('service') < 0){
                    x.id = 'service_' + x.id;
                }
                
                let serviceTextColor = styles.defaultColor;
                let serviceDurationTextColor = styles.defaultColor;
                let isExists = this.selectServices.filter(function(item){
                    return item.id == x.id
                }).length;
                let quantity = 1;
                if(typeof(x.quantity) != 'undefined'){
                    quantity = x.quantity;
                }
                if(isExists){
                    this.price += (x.price * quantity);
                    serviceTextColor = styles.whiteColor;
                    serviceDurationTextColor =  styles.whiteDurationColor;
                }

                let isShow = true;
                if(this.search != ''){
                    isShow = x.service_name.toLowerCase().indexOf(this.search.toLowerCase()) >= 0 || x.price == this.search;
                }

                if(isShow && x.status == 'NO'){
                    isShow = false;
                }

                if(count > this.maxCount){
                    
                    isShow = false;
                    
                }
                             let showPrice = "";
                if(this.props.userData.HideservicepriceApp != 1){
                    showPrice = "- $" + x.price;
                }
                if(x.isVaryPriceApp == 1){
                    showPrice = "";
                }
                //console.log(isShow);
                if(isShow){
                    isAny = true;
                    increase = i % columns;
                    return (
                        <TouchableOpacity key={x.id} activeOpacity={1} onPress={() => {this.onPressService(x)}}>
                            <View style={{ width: this.columnWidth  }}>
                                { isExists == 0 &&
                                    <View style={[styles.serviceItem, i % columns == 0 ? styles.even : styles.odd]}>
                                        
                                        <View style={[styles.serviceLeft,{width: serviceLeftWidth}]}>
                                <Text style={[styles.serviceName,serviceTextColor, customFontSize]}>{x.service_name} {showPrice}</Text>
                                        </View>
                                        <View style={styles.serviceRight}>
                                                <BtnQuantity quantity={quantity} id={x.id} onPress={this.onQuantityService} />
                                        </View>
                                        
                                        
                                    </View>
                                }

                                { isExists > 0 &&
                                    <LinearGradient start={[0, 0]} end={[1, 0]} colors={[color.reddish, color.reddish]} 
                                        style={[styles.containerItemSelected,i % 2 == 0 ? styles.even : styles.odd]}>
                                        <View style={[styles.serviceLeft,{width: serviceLeftWidth}]}>
                                <Text style={[styles.serviceName,serviceTextColor, customFontSize]}>{x.service_name} {showPrice}</Text>
                                        </View>
                                        <View style={styles.serviceRight}>
                                            <BtnQuantity quantity={quantity} id={x.id} onPress={this.onQuantityService} />
                                        </View>
                                    </LinearGradient>  
                                }

                                
                            </View>
                        </TouchableOpacity>
                    )            
                }else return false;
                
            });
        }
        if(!isAny) Service = false;
        
        /*
        if(count > this.maxCount){
            Service += (
                <View>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={[styles.btnLinear]}
                        onPress={this.onSelectedServices}
                    >
                            <Text style={styles.btnSaveText}>Show More</Text>
                    
                    </TouchableOpacity>
                </View>
            )
        }*/
        return Service;
    }

    renderServicesInCombo = (category) => {
        let arrKey = {};
        let service = this.renderServices(category);
        if(service != false){
            return (
                <View key={category} style={{width: width}}>
                   
                    <View style={{flexDirection: 'row',flexWrap: 'wrap'}}>
                        {service}
                    </View>
                </View>
            )
        }else {
            return false;
        }
        //return categoryDisplay;
    }

    showMore = (status) => {
        //this.isShowMore = status;
        if(!status){
            this.maxCount = 9999;
        }else{
            this.maxCount = maxServiceCount;
        }
        this.categoriesShow[this.category] = true;
        this.setState({rerender:true});
    }

    render() {
       
        this.price = 0;
        let increase = 0;
        this.isShowMore = false;
        let categoryDisplay = this.renderServicesInCombo(this.category);
        

        if(increase == 0) increase = 1;
        else increase = 0;
  
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => this.close()}
                supportedOrientations={['landscape']}
            >
                <View style={styles.container}>
                    <LinearGradient start={[0, 0]} end={[1, 0]} colors={[color.reddish, color.reddish]}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerTitle}>Select Service</Text>
                            
                            <TouchableOpacity style={styles.closebtnright} activeOpacity={1}
                                onPress={() => this.close()}>
                                <Icon
                                    name={'close'}
                                    size={30}
                                    color={color.whiteRBG1} style={styles.navIconIOS}
                                />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
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
                            {this.isShowMore
                                &&
                                <View style={{justifyContent:'center',alignItems:'center',width: width}}>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={[styles.btnLinear]}
                                        onPress={() => this.showMore(false)}
                                    >
                                            <Text style={styles.btnSaveText}>Show More</Text>
                                    </TouchableOpacity>
                                </View>
                            }                      
                        </ScrollView>
                        {
                            this.selectServices.length > 0 && 
                            <LinearGradient
                                        start={[0, 0]}
                                        end={[1, 0]}
                                        colors={[color.reddish, color.reddish]}
                                        style={[{width:width,height:80}]}
                                    >
                                <View style={[styles.selectedServices,{width:width}]}>
                                   
                                    <View style={[styles.btnSave,{width: 400}]}>
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            style={[styles.btnLinear]}
                                            onPress={this.onSelectedServices}
                                        >
                                                <Text style={styles.btnSaveText}>Choose Selected Services</Text>
                                        
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </LinearGradient>
                        }
                        
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.lightWhite
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
        color: color.white,
        backgroundColor:'transparent'
    },
    selectedServicesPrice:{
        color: color.white,
        fontSize:22,
        fontFamily:'Futura',
        backgroundColor:'transparent'
    },
    searchWrapper:{
        //marginBottom:15
    },
    dataContainer:{
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
    whiteColor:{
        color: color.white,
        backgroundColor:'transparent'
    },
    whiteDurationColor:{
        color: color.whiteRGB06,
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
        
    },headerContainer:{
        height:90,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerTitle:{
        color: color.white,
        backgroundColor:'transparent',
        fontSize:22,
        fontFamily:'Futura',
        marginTop:10
    },
    closebtn:{
        position:'absolute',
        left:20,
        backgroundColor:'transparent',
        top:35
    },
    closebtnright:{
        position:'absolute',
        right:20,
        backgroundColor:'transparent',
        top:35
    },
   
})