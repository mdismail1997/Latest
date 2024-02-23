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
    Image,
    Alert
} from "react-native";
import layout from "../../assets/styles/layout_checkin";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import collect from "collect.js";
import { color } from "../../assets/colors/colors";

var width = Dimensions.get('window').width;
var withLeft = width * 0.7;
var col = 4;
var columnWidth = (withLeft / col) -1;
var TechnicianWidth = (withLeft - 75) / col;

export default class OneService extends React.Component{
    state = {
        selectedTechnician:0,
        showCloseSearchBox: false
    }
    
    search = '';
    technicianDataList = [];
    servicekey = '';


    UNSAFE_componentWillUnmount(){
        Dimensions.removeEventListener("change", () => {});
    }

    
   async UNSAFE_componentWillMount(){
        width = Dimensions.get('window').width;
        withLeft = width * 0.7;
        TechnicianWidth = (withLeft - 75) / col;
        columnWidth = (withLeft / col) -1;

        let _this = this;
        Dimensions.addEventListener('change',function(){
            var screen = Dimensions.get('window');
            width = screen.width;
            withLeft = width * 0.7;
            //height = screen.height;
            columnWidth = (withLeft / col) -1;
            TechnicianWidth = (withLeft - 75) / col;
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

    onPressTechnician = (technician) => {
        let techDataForAdded = {};
        techDataForAdded.fullname = technician.fullname;
        techDataForAdded.id = technician.id;
        techDataForAdded.start = technician.start;
        techDataForAdded.end = technician.end;
        techDataForAdded.duration = technician.duration;
        this.props.onPress(techDataForAdded,this.servicekey,'oneservice');  
        this.setState({selectedTechnician: technician.id});           
    }

    setData = (technicians,selectedTechnician,servicekey) => {
        this.technicianDataList = technicians;
        var techs = collect(this.technicianDataList);
        var technician = techs.where('id', '!=' , 0).where('checkinid', '!=', 10000);
        technician = technician.first();
         this.servicekey = servicekey;
         if(this.props.providerData.isManageTurn == 1){
            if(selectedTechnician == 0 && typeof(technician) != 'undefined'){
                let techDataForAdded = {};
                techDataForAdded.fullname = technician.fullname;
                techDataForAdded.id = technician.id;
                techDataForAdded.start = technician.start;
                techDataForAdded.end = technician.end;
                techDataForAdded.duration = technician.duration;
                this.props.onPress(techDataForAdded,this.servicekey,'oneservice');  
                this.setState({selectedTechnician: technician.id});
            }else{
                this.setState({selectedTechnician: selectedTechnician}); 
            }
         }else{
            this.setState({selectedTechnician: selectedTechnician}); 
         }

        //this.setState({selectedTechnician: selectedTechnician});      
        /*
        let _this = this;
        let techniciansSelected = technicians.filter(function(item){
            return item.id == _this.state.selectedTechnician;
        });
        if(!techniciansSelected.length){
            this.setState({selectedTechnician: 0});      
        }*/
    }

    render() {
        let count = 0;
        let contents = (x,technicianStyle,technicianBackgroundColor) => {
            var texttile = "Not Checked in";
            if(x.checkout == 1){
                texttile = "Checked out";
            }
            var textTurn = "";
            if(x.TurnBook != 10000 && typeof(x.TurnBook) != 'undefined'){
                textTurn = "(" + x.TurnBook + ")";
            }
            return (
                <View style={{ alignItems: 'center',justifyContent: "center"}}>
                    { x.checkinid == 10000 &&
                        <Text style={styles.textnot}>{texttile}</Text>
                    }
                    
                    { x.picture == "" &&
                        <View style={styles.profilepictureIcon}>
                            <Icon
                                name={"account-circle"}
                                size={90}
                                color={technicianBackgroundColor}
                            />
                        </View>
                    }

                    { x.picture != "" &&
                        <View style={styles.profilepicture}>
                            <Image
                                style={(Platform.OS === 'android' ? styles.profileimageAndroid : styles.profileimage)}
                                source={{
                                    uri:x.picture
                                }}
                            
                            />
                        </View>
                    }
        <Text style={[styles.technicianName,technicianStyle]}>{x.fullname} {textTurn}</Text>
                </View>
            )
        }

        let technicianDataListQuantity = this.technicianDataList;
        // if(this.props.quantity > 1){
        //     technicianDataListQuantity = this.technicianDataList.filter(function(item){
        //         return item.id == 0;
        //     })
        // }
        if(typeof(technicianDataListQuantity) == 'undefined' || technicianDataListQuantity.length == 0){
            // Alert.alert('Error', 'No technician currently, please update technician or Active allow guest choose "Any Technician", ***Note: add technician skills!');
            return true;
        }
        let TechnicianData = technicianDataListQuantity.map((x, i) => {

                let technicianTextColor = this.state.selectedTechnician == x.id ? styles.whiteColor : styles.defaultColor;
                let technicianBackgroundColor = this.state.selectedTechnician == x.id ? color.whiteRGB05 : color.placeHolderColor;
                //let serviceDurationTextColor = this.state.selectedService == x.id ? styles.whiteDurationColor : styles.defaultColor;
                //let servicestyle = this.state.selectedService == x.id ? styles.serviceSelected : styles.service;
                //let serviceTextstyle = this.state.selectedService == x.id ? styles.serviceTextSelected : styles.serviceText;
               
                let columnStyle = styles.middle;
                if(count == 0){
                    columnStyle = styles.even;
                }
                count++;
                if(count == 4){
                    columnStyle = styles.last;
                    count = 0;
                }

                let isShow = true;
                if(this.search != ''){
                    isShow = x.fullname.toLowerCase().indexOf(this.search.toLowerCase()) >= 0;
                }
                if(isShow){
             
                    return (
                        <TouchableOpacity key={x.id} activeOpacity={1} onPress={() => {this.onPressTechnician(x)}}>
                            <View style={{ width: columnWidth, justifyContent: "center",alignItems: 'center'  }}>
                                { this.state.selectedTechnician != x.id &&
                                    <View style={[styles.technicianWrapper,columnStyle,{width: TechnicianWidth, height: TechnicianWidth}]}>
                                        {contents(x,technicianTextColor,technicianBackgroundColor)}
                                    </View>
                                }

                                { this.state.selectedTechnician == x.id &&
                                    <LinearGradient start={[0, 0]} end={[1, 1]} colors={['#db7b87', color.lightPink]} 
                                         style={[styles.technicianWrapper,columnStyle,{width: TechnicianWidth, height: TechnicianWidth}]}>
                                         {contents(x,technicianTextColor,technicianBackgroundColor)}
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
                            placeholder='Search Technician' placeholderTextColor={color.gray42}
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
                        {TechnicianData}
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
    searchWrapper:{
        //marginBottom:15
    },
    dataContainer:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: "center",
        alignItems: 'center',
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
        /*borderRadius:80*/
    },
    technicianName: {
        fontSize: 16,
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
    },
    textnot:{
        color: color.brownish,
        position: 'absolute',
        right:-5,
        top:-18,
        bottom:0,
        fontFamily:'Futura',
        textAlign:'center',
    }
})