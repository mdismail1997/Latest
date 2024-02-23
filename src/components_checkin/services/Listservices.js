import React from "react";
import {
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    TextInput,
    SectionList
} from "react-native";
import layout from "../../assets/styles/layout_checkin";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ScreenOrientation} from "expo";
import { LinearGradient } from 'expo-linear-gradient';
import BtnQuantity from "../../components_checkin/btnQuantity";
import sectionListGetItemLayout from "react-native-section-list-get-item-layout";
import { color } from "../../assets/colors/colors";
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').width.height;
//var orientation = (width > height) ? 'LANDSCAPE' : 'PORTRAIT';
var widthLeft = width * 0.7;
var columns = 1;
var serviceWidth = (widthLeft - 45) / columns;
var widthRight = 200;
var serviceRightWidth = widthRight;
var serviceLeftWidth = widthLeft - widthRight;
//const orientation = (width > height) ? 'LANDSCAPE' : 'PORTRAIT';

export default class Listservices extends React.Component{
    state = {
        selectedService:[],
        showCloseSearchBox: false,
        ServiceSectionList: []
    }

    columnWidth = width / columns;
    search = '';
    selectServices = [];
    selectServicesRenew = [];
    price = 0;

    UNSAFE_componentWillUnmount(){
        Dimensions.removeEventListener("change", () => {});
    }

    UNSAFE_componentWillMount(){
        width = Dimensions.get('window').width;
        height = Dimensions.get('window').width.height;
        widthLeft = width * 0.7;
        serviceWidth = (widthLeft - 45) / columns;

         serviceLeftWidth = widthLeft - widthRight;
        this.columnWidth = widthLeft / columns;

        let _this = this;
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
            serviceLeftWidth = widthLeft - widthRight;
            _this.columnWidth = widthLeft / columns;
            
            _this.setState({ appIsReady: true });
        });
        //this.ChangeListService(this.props.services);
    }

    ChangeListService = (services) =>{
        var _this = this;
        this.props.listCategories.map((category, i) => {
            let sectionService = {};
            sectionService.key = category.id;
            let cou = 1;
            let apptsByServices = services.filter(function(ItemService){
                return ItemService.category_id == category.id && ItemService.status == 'YES'; 
            }); 
            if(apptsByServices.length > 0){
                if(typeof(this.props.userData) != 'undefined'){
                    if(this.props.userData.serviceSortType == 'Alphabet'){
                        apptsByServices = apptsByServices.sort(function (a, b) {
                            if (a.service_name < b.service_name) return -1;
                            else if (a.service_name > b.service_name) return 1;
                            return 0;
                        });
                    }else if(this.props.userData.serviceSortType == 'Price'){
                        apptsByServices = apptsByServices.sort(function (a, b) {
                            if (a.price < b.price) return -1;
                            else if (a.price > b.price) return 1;
                            return 0;
                        });
                    }else{
                        apptsByServices = apptsByServices.sort(function (a, b) {
                            if (a.display_order < b.display_order) return -1;
                            else if (a.display_order > b.display_order) return 1;
                            return 0;
                        });
                    }
                }
                sectionService.data = apptsByServices;
             _this.state.ServiceSectionList.push(sectionService);
            }

        });
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

        this.selectServicesRenew = this.selectServices;
        this.onPressDataRightLayout(this.selectServicesRenew);
        this.props.onPress(this.selectServices);
        this.setState({selectedService: this.selectServices, ServiceSectionList: this.state.ServiceSectionList});  
        this.onRefreshService();
    }
    onPressDataRightLayout = (service) =>{
        this.props.onPressDataRightLayout(service);
    }
    setServices = (services) => {
        this.selectServices = services;
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
        this.onPressDataRightLayout(this.selectServicesRenew);
        this.setState({ appIsReady: true });
    }
    onQuantityCombo = (type, id) =>{

        let serviceItem = this.props.listcombo.filter(function(item){
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
        this.onPressDataRightLayout(this.selectServicesRenew);
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
        if(serviceInCategories.length){

            let firstService = serviceInCategories[0];
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
            }
                

            Service = serviceInCategories.map((x, i) => {
                if(x.id.toString().indexOf('service') < 0){
                    x.id = 'service_' + x.id;
                }
                let quantity = 1;
                if(typeof(x.quantity) != 'undefined'){
                    quantity = x.quantity;
                }
                let serviceTextColor = styles.defaultColor;
                let serviceDurationTextColor = styles.defaultColor;
                let isExists = this.selectServices.filter(function(item){
                    return item.id == x.id
                }).length;
        
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
                let showPrice = "";
                if(this.props.userData.HideservicepriceApp != 1){
                    showPrice = "- $" + x.price;
                }
                if(x.isVaryPriceApp == 1){
                    showPrice = "";
                }
                if(isShow){
                    isAny = true;
                    increase = i % columns;
                    return (
                        <TouchableOpacity key={x.id} activeOpacity={1} onPress={() => {this.onPressService(x)}}>
                            <View style={{ width: this.columnWidth, paddingLeft:50, paddingRight:50  }}>
                                { isExists == 0 &&
                                    <LinearGradient start={[0, 0]} end={[1, 0]} colors={[color.white, color.white]} 
                                    style={[styles.serviceItem]}>
                                    <View style={[styles.serviceLeft,{width: serviceLeftWidth}]}>
                                        <Text style={[styles.serviceName,serviceTextColor]}>{x.service_name} {showPrice}</Text>
                                    </View>

                                    <View style={styles.serviceRight}>
                                        <BtnQuantity quantity={quantity} id={x.id} onPress={this.onQuantityService} selected={true}/>
                                    </View>
                                </LinearGradient>  
                                }

                                { isExists > 0 &&
                                    <LinearGradient start={[0, 0]} end={[1, 0]} colors={['#d57c87', color.lightPink]} 
                                        style={[styles.containerItemSelected]}>
                                        <View style={[styles.serviceLeft,{width: serviceLeftWidth}]}>
                                            <Text style={[styles.serviceName,serviceTextColor]}>{x.service_name} {showPrice}</Text>
                                        </View>
                                        <View style={styles.serviceRight}>
                                            <BtnQuantity quantity={quantity} id={x.id} onPress={this.onQuantityService} selected={true}/>
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
        return Service;
    }

    renderServicesInCombo = () => {
        let arrKey = {};
        let categoryDisplay = this.props.categories.map((category, i) => {
            let service = this.renderServices(category);
            if(service != false){
                return (
                    <View key={category} style={{width: widthLeft}}>
                        <View style={[styles.categoryContainer,{width: widthLeft}]}>
                            <Text style={styles.categoryLabel}>{category}</Text>
                        </View>    
                        <View style={{flexDirection: 'row',flexWrap: 'wrap'}}>
                            {service}
                        </View>
                    </View>
                )
            }else {
                return false;
            }
            
        });
        return categoryDisplay;
    }
    _renderItem = ({ item }) => {
            let x = item;
            if(x.id.toString().indexOf('service') < 0){
                x.id = 'service_' + x.id;
            }
            let quantity = 1;
            if(typeof(x.quantity) != 'undefined'){
                quantity = x.quantity;
            }
            let serviceTextColor = styles.defaultColor;
            let serviceDurationTextColor = styles.defaultColor;
            let isExists = this.selectServices.filter(function(item){
                return item.id == x.id
            }).length;
    
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
            let showPrice = "";
            if(this.props.userData.HideservicepriceApp != 1){
                showPrice = "- $" + x.price;
            }
            if(x.isVaryPriceApp == 1){
                showPrice = "";
            }
            let i =0;
            if(isShow){
                isAny = true;
                increase = i % columns;
                return (
                    <TouchableOpacity key={x.id} activeOpacity={1} onPress={() => {this.onPressService(x)}}>
                        <View style={{ width: this.columnWidth  }}>
                            { isExists == 0 &&
                                <View style={[styles.serviceItem, i % columns == 0 ? styles.even : styles.odd]}>
                                    
                                    <View style={[styles.serviceLeft,{width: serviceLeftWidth}]}>
                                        <Text style={[styles.serviceName,serviceTextColor]}>{x.service_name} {showPrice}</Text>
                                    </View>
                                    <View style={styles.serviceRight}>
                                        {/* <Text style={[styles.servicePrice,serviceTextColor]}></Text> */}
                                        <BtnQuantity quantity={quantity} id={x.id} onPress={this.onQuantityService} />
                                    </View>
                                    
                                    
                                </View>
                            }

                            { isExists > 0 &&
                                <LinearGradient start={[0, 0]} end={[1, 0]} colors={[color.reddish, color.reddish]} 
                                    style={[styles.containerItemSelected,i % 2 == 0 ? styles.even : styles.odd]}>
                                    <View style={[styles.serviceLeft,{width: serviceLeftWidth}]}>
                            <Text style={[styles.serviceName,serviceTextColor]}>{x.service_name} {showPrice}</Text>
                                    </View>
                                    <View style={styles.serviceRight}>
                                        {/* <Text style={[styles.servicePrice,serviceTextColor]}></Text> */}
                                        <BtnQuantity quantity={quantity} id={x.id} onPress={this.onQuantityService} selected={true}/>
                                    </View>
                                </LinearGradient>  
                            }

                            
                        </View>
                    </TouchableOpacity>
                )            
            }else return false;
            

    };
    _renderSectionHeader = sectionHeader => {

        var sectionName = "";
        let sectionInfo = this.props.listCategories.filter(function(cat){
            return cat.id == sectionHeader.section.key;
        });

        sectionInfo = sectionInfo[0];
        return (
            <View>

                            <Text>
                                {sectionInfo.name}
                            </Text>

            </View>
        );
    };
    _keyExtractor = (item, index) => item.id;
    _getItemLayout = sectionListGetItemLayout({
        // The height of the row with rowData at the given sectionIndex and rowIndex
        getItemHeight: (rowData, sectionIndex, rowIndex) => 70,

        // These three properties are optional
        getSeparatorHeight: () => 0, // The height of your separators
        getSectionHeaderHeight: () => 35, // The height of your section headers
        getSectionFooterHeight: () => 0 // The height of your section footers
    });
    onRefreshService = () =>{
        
    }
    render() {
       
        this.price = 0;
        let increase = 0;
        
        let categoryDisplay = this.renderServicesInCombo();
        

        if(increase == 0) increase = 1;
        else increase = 0;
        let isAnyCombo = false;
        if(typeof(this.props.userData) != 'undefined' && this.props.listcombo.length > 0){
            if(this.props.userData.serviceSortType == 'Alphabet'){
                this.props.listcombo = this.props.listcombo.sort(function (a, b) {
                    if (a.comboname < b.comboname) return -1;
                    else if (a.comboname > b.comboname) return 1;
                    return 0;
                });
            }else if(this.props.userData.serviceSortType == 'Price'){
                this.props.listcombo = this.props.listcombo.sort(function (a, b) {
                    if (a.price < b.price) return -1;
                    else if (a.price > b.price) return 1;
                    return 0;
                });
            }
        }
        let listcombo = this.props.listcombo.map((x, i) => {
            if(x.id.toString().indexOf('combo') < 0){
                x.id = 'combo_' + x.id;
            }
            let quantity = 1;
            if(typeof(x.quantity) != 'undefined'){
                quantity = x.quantity;
            }
            let serviceTextColor = styles.defaultColor;
            let serviceDurationTextColor = styles.defaultColor;
            let isExists = this.selectServices.filter(function(item){
                return item.id == x.id
            }).length;
      
            if(isExists){
                this.price += (x.price * quantity);
                serviceTextColor = styles.whiteColor;
                serviceDurationTextColor =  styles.whiteDurationColor;
            }

            let isShow = true;
            if(this.search != ''){
                isShow = x.comboname.toLowerCase().indexOf(this.search.toLowerCase()) >= 0 || x.price == this.search;
            }

            if(isShow){
                isAnyCombo = true;
                return (
                    <TouchableOpacity key={x.id} activeOpacity={1} onPress={() => {this.onPressService(x)}}>
                        <View style={{ width: this.columnWidth, paddingLeft:50, paddingRight:50  }}>
                            { isExists == 0 &&
                                <View style={[styles.serviceItem, (i + increase) % columns == 0 ? styles.even : styles.odd]}>
                                    
                                    <View style={[styles.serviceLeft,{width: serviceLeftWidth}]}>
                                        <Text style={[styles.serviceName,serviceTextColor]}>{x.comboname} - ${x.price}</Text>
                                    </View>
                                    <View style={styles.serviceRight}>
                                            <BtnQuantity quantity={quantity} id={x.id} onPress={this.onQuantityCombo} />
                                    </View>
                                    
                                    
                                </View>
                            }

                            { isExists > 0 &&
                                <LinearGradient start={[0, 0]} end={[1, 0]} colors={['#d57c87', color.lightPink]} 
                                    style={[styles.containerItemSelected,(i + increase) % 2 == 0 ? styles.even : styles.odd]}>
                                    <View style={[styles.serviceLeft,{width: serviceLeftWidth}]}>
                                        <Text style={[styles.serviceName,serviceTextColor]}>{x.comboname} - ${x.price}</Text>
                                    </View>
                                    <View style={styles.serviceRight}>
                                        <BtnQuantity quantity={quantity} id={x.id} onPress={this.onQuantityCombo} />
                                    </View>
                                </LinearGradient>  
                            }

                            
                        </View>
                    </TouchableOpacity>
                    )            
                }else return false;
                
            }
        )

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
                    {/* <SectionList
                        ref="sectionAppointment"
                        renderItem={this._renderItem}
                        renderSectionHeader={this._renderSectionHeader}
                        keyExtractor={this._keyExtractor}
                        sections={this.state.ServiceSectionList}
                        getItemLayout={this._getItemLayout}
                        stickySectionHeadersEnabled={true}
                        onRefresh={() => this.onRefreshService()}
                    /> */}
                    <ScrollView contentContainerStyle={styles.dataContainer} keyboardShouldPersistTaps="always">
                        {categoryDisplay}
                        {this.props.listcombo.length > 0 && isAnyCombo &&
                            <View  style={{width: widthLeft}}>
                                <View style={[styles.categoryContainer,{width: widthLeft}]}>
                                    <Text style={styles.categoryLabel}>Combos</Text>
                                </View>    
                            </View>
                        }
                        {listcombo}
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
        color:color.white,
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
        // flexDirection: 'row',
        // flexWrap: 'wrap'
    },

    // even:{
    //     marginLeft:0,
    //     marginRight:7.5,        
    // },
    // odd:{
    //     marginLeft:15,
    //     marginRight:7.5,       
    // },
    whiteColor:{
        color:color.white,
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
        width:serviceRightWidth,
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
    serviceItem:{
        
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor:color.white,
        flexDirection: 'row',
        marginBottom:15,
        paddingTop:10,
        paddingBottom:10,
        borderRadius:4,
        shadowColor: color.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2

    },
    containerItemSelected:{
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor:color.white,
        flexDirection: 'row',
        marginBottom:15,
        paddingTop:10,
        paddingBottom:10,
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
    searchContainer: {
        height:65,
        paddingTop:15,
        paddingBottom:15,
        paddingLeft:50,
        paddingRight:50,
        justifyContent: 'center'

    },
    iconsearchbox:{
        position:'absolute',
        backgroundColor:'transparent',
        zIndex:1,
        left:65
    },
})