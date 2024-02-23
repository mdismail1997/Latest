import React from "react";
import { StyleSheet, Text, View, TouchableOpacity,Modal,Alert, Keyboard, ScrollView, Button, TextInput, SectionList, Pressable } from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import layout from "../../assets/styles/layout";
import setting from "../../constants/Setting";
import SubmitLoader from "../../helpers/submitloader";
import Colors from "../../constants/Colors";
import { color } from "../../assets/colors/colors";
import { gStrings } from "../staticStrings";
import { api } from "../../api/api";
export default class EgiftSold extends React.Component {

    state = {
        appIsReady: false,
        modalVisible: false,
        amount: '',
        idredeem:'',
        balance:'',
        datalist: []
    };
    UNSAFE_componentWillMount() {
        data = {};
        data.key = "header";
        data.data = this.props.data;
        this.state.datalist.push(data);
    }
    RefreshData = (datarefresh) =>{
        this.state.datalist = [];
        data = {};
        data.key = "header";
        data.data = datarefresh;
        this.state.datalist.push(data);
        this.setState({appIsReady: true});
    }
    _keyExtractor = (item, index) => "egiftsold-"+item.id;
    _renderSectionHeader = sectionHeader => {
        return (
            <View style={styles.sectionheadertext}>
                <View style={styles.sectionheadertextcontainer}>
                    <Text style={styles.sectionheadertextcontent}>
                        Type
                    </Text>
                </View>
                <View style={styles.sectionheadertextcontainer}>
                    <Text style={styles.sectionheadertextcontent}>
                        Buyer
                    </Text>
                </View>
                <View style={styles.sectionheadertextcontainer}>
                    <Text style={styles.sectionheadertextcontent}>
                    Receiver
                    </Text>
                </View>
            </View>
        );
    };
    _renderItem = ({ item }) => {  
        let typename = "";
        let Channel = "";
        let name = "";
        let emailbuyer = "";
        let phonebuyer = "";
        if(item.senderId != "" && item.senderId != null && item.senderId > 0){
             typename = "Buy for Friend";
             namebuyer = item.sender_firstname + ' ' + item.sender_lastname;
             emailbuyer = item.sender_email;
             phonebuyer = item.sender_phone;
        }else if(item.buyer_info != '' && item.buyer_info != null && item.redeemCode != '' && (item.recipientemail == '' || item.recipientemail == null)){
            typename = "Buy for Me";
            var jsonbuy = JSON.parse(item.buyer_info);
            namebuyer = jsonbuy.name_b;
            emailbuyer = jsonbuy.email_b;
            phonebuyer = jsonbuy.phone_b;
        }else if(item.buyer_info != '' && item.buyer_info != null && item.redeemCode != '' && item.recipientemail != '' && item.recipientemail != null){
            typename = "Buy for Friend";
            var jsonbuy = JSON.parse(item.buyer_info);
            namebuyer = jsonbuy.name_b;
            emailbuyer = jsonbuy.email_b;
            phonebuyer = jsonbuy.phone_b;
        }else{
             typename = "Buy for Me";
             namebuyer = item.buyer_firstname + ' ' + item.buyer_lastname;
             emailbuyer = item.buyer_email;
             phonebuyer = item.buyer_phone;
        }
        if(item.token == "sell-e-gift"){
           Channel= "In Salon";
        }else{
            Channel= "Online"; 
        }

        return (
            <ScrollView horizontal={true}>
            <View style={styles.clientrow}>
                <View style={[styles.bookingrow, {width: 120}]}>
                    <View style={styles.sectionheadertext}>
                        <Text style={[styles.clientlbltitle]}>{typename}</Text>
                    </View>
                    <View style={styles.boxcontent}>
                        <View style={{justifyContent: 'center'}}>
                            <Text style={[styles.clientlbl]}>Channel: {Channel}</Text>
                        </View>
                        {
                            (item.redeemCode != "" && item.redeemCode != null) &&
                            <View style={{justifyContent: 'center'}}>
                                <Text style={[styles.clientlbl]}>Code: {item.redeemCode}</Text>
                            </View>
                        }

                        { (item.isForRedeem == 0 && item.redeemCode != '') &&
                            <View style={{justifyContent: 'center'}}>
                                <Text style={[styles.clientlbl, styles.colorused]}>Used</Text>
                            </View>
                        }
                    </View>


                </View>
                <View style={[styles.bookingrow, {width: 150}]}>
                    <View style={styles.sectionheadertext}>
                        <Text style={[styles.clientlbltitle]}>Payment</Text>
                    </View>
                    <View style={styles.boxcontent}>
                        <View >
                            <Text style={styles.clientlbl}>Price: ${item.price}</Text>
                            <Text style={styles.clientlbl}>Balance: ${item.balance}</Text>
                            <Text style={styles.clientlbl}>Date: {moment(item.dateofpayment).format('MMM DD YYYY')}</Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.bookingrow , {width: 200}]}>
                    <View style={styles.sectionheadertext}>
                        <Text style={[styles.clientlbltitle]}>Buyer</Text>
                    </View>
                    <View style={styles.boxcontent}>
                        <View >
                            <Text style={styles.clientlbl}>{namebuyer} </Text>
                            <Text style={styles.clientlbl}>{phonebuyer}</Text>
                            <Text style={styles.clientlbl}>{emailbuyer}</Text>
                        </View>
                    </View>

                </View>
                
                <View style={[styles.bookingrow , {width: 200}]}>
                    <View style={styles.sectionheadertext}>
                        <Text style={[styles.clientlbltitle]}>Receiver</Text>
                    </View>
                    <View style={styles.boxcontent}>
                    { ((item.senderId != "" && item.senderId != null && item.senderId > 0) || (item.buyer_info != '' && item.buyer_info != null && item.redeemCode != '' && item.recipientemail != '' && item.recipientemail != null)) &&
                        <View >
                            <Text style={styles.clientlbl}>{item.recipientname}</Text>
                            <Text style={styles.clientlbl}>{item.recipient_phone}</Text>
                            <Text style={styles.clientlbl}>{item.recipientemail}</Text>
                           
                        </View>
                    }

                    </View>

                </View>
                {(item.isForRedeem == 1 && item.redeemCode != '') &&
                <View style={[styles.bookingrow, {width: 120}]}>
                <View style={styles.sectionheadertext}>
                    <Text style={[styles.clientlbltitle]}>Action</Text>
                </View>
                <View style={styles.boxcontent}>
                    <View >
                    <Button
                        onPress={() => this.onPressRedeem(item)}
                        title="Redeem"
                        color={color.darkMagenta}
                        accessibilityLabel="Redeem"
                        />
                    </View>
                </View>
            </View>
                }
                
            </View> 
            </ScrollView>
        );
    };
    onPressRedeem = (value) =>{
        this.setState({modalVisible: true, idredeem:value.id, balance: value.balance})
    }
    onPressModal = (value) =>{
        this.setState({modalVisible: value})
    }
    setTextClient = async(value) => {
        this.setState({amount: value});  
    }
    onPressSubmit = async()=>{
        let _this = this;
        if(parseFloat(this.state.amount) > parseFloat(this.state.balance)){
            Alert.alert('Error', gStrings.checkAmount);
        }else if(parseFloat(this.state.amount) <= parseFloat(this.state.balance) && parseFloat(this.state.amount) > 0 && parseFloat(this.state.balance) > 0){
            _this.setState({modalVisible: false})
            _this.refs.saveLoader.setState({ visible: true });
            
           await fetch(setting.apiUrl + api.eGiftSalonRedeem, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + this.props.token
                },
                body:JSON.stringify({
                    amount: this.state.amount,
                    id: this.state.idredeem,
                    redeemcode: 'redeemcode'
                })
            }).then((response) => response.json()).then((responseJson) => {
                setTimeout(function(){
                    _this.refs.saveLoader.setState({ visible: false });
                    if (responseJson.success) {
                        if(_this.state.datalist.length > 0){
                            if(_this.state.datalist[0].data.length > 0){
                                Object.values(_this.state.datalist[0].data).map(item => {
                                if(item.id == _this.state.idredeem){
                                    item.isForRedeem = 0;
                                }
                                });
                                    let abc = [..._this.state.datalist];
                                    _this.setState({datalist:abc, modalVisible: false})
                                    Alert.alert('Success', responseJson.message);
                            }
                        }
                    } else {
                        Alert.alert('Error', responseJson.message);
                    }
                },2000)
                
            }).catch((error) => {
                return [];
            });
            
        }else{
            Alert.alert('Error', 'Balance is not enough to redeem!');
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <SectionList
                    ref="egiftsold"
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtractor}
                    sections={this.state.datalist}
                />
                <Modal
                    animationType="slide"
                    transparent={true}  
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    }}
                >
                    <View style={styles.enteredView}>
                    <View style={styles.modalView}>
                    <TouchableOpacity style={styles.headerNavLeftContainer} activeOpacity={1} onPress={() => this.onPressModal(false)}>
                        <View style={layout.headerNavLeft}>
                            <Icon name={"close"} size={30} color={color.blackish} style={ Platform.OS === "android" ? layout.navIcon : layout.navIconIOS }/>
                        </View>
                    </TouchableOpacity>
                        <Text style={styles.modalText}>Enter amount to redeem</Text>
                        <TextInput
                            style={styles.input}
                            value={this.amount}
                            placeholder="amount redeem"
                            keyboardType="numeric"
                            onChangeText={(text) => {
                                this.setTextClient(text);
                                }}
                        />
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={async() =>{await  this.onPressSubmit()} }
                        >
                             
                        <Text style={styles.textStyle}>Redeem</Text>
                        </Pressable>
                    </View>
                    </View>
                </Modal>
                <SubmitLoader
                        ref="saveLoader"
                        visible={false}
                        textStyle={layout.textLoaderScreenSubmit}
                        textContent='processing...'
                        color={Colors.spinnerLoaderColorSubmit}
                    />
            </View>

        );
    }
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius:10,
        width:'100%'
      },
    headerNavLeftContainer:{
        position: 'absolute',right:5,top:0,flex:1
    },
    enteredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
      },
      modalView: {
        width:'90%',
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: color.black,
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonOpen: {
        backgroundColor: color.lightMagenta,
      },
      buttonClose: {
        backgroundColor: color.dodgerBlue,
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      },
    // -----
    sectionheadertext:{
        backgroundColor: color.darkCyan,
         height: 35,
         justifyContent: 'center',
        paddingLeft: 10,
          color: color.white
    },
    boxcontent:{
        paddingLeft: 10,
        paddingTop: 5
    },
    container: {
        flex: 1,
    },
    headerContainer:{
        height:90,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerTitle:{
        color:color.white,
        backgroundColor:'transparent',
        fontSize:22,
        fontFamily:'Futura',
        marginTop:10
    },
    row:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    booksuccesstext:{
        fontFamily:'Futura',
        fontSize:22,
        color: color.blackish,
        textAlign:'center',
        marginTop:10
    },
    confirmbtn:{
        justifyContent: "center",
        alignItems: "center",
        width: 350
    },
    btnSave: {
        height: 45,
        width: 230,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 15
    },
    btnSaveText: {
        color: color.white,
        fontSize: 20,
        zIndex: 1,
        backgroundColor: "transparent"
    },
    btnSaveWraper: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    btnLinear: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        overflow: "hidden",
        flex: 1,
    },
   
    columnWraperLeft:{
        backgroundColor:color.white,
        borderWidth: 0.5,
        borderColor: color.whitishBorder,
        marginBottom:15,
    },
    clientrow:{
        flexDirection:'row',
        backgroundColor:'#f5fafa',
        paddingBottom:15,
        position:'relative',
        // justifyContent: 'center',
        // alignItems: 'center',
        // justifyContent: 'space-between',
    },
    bookingrow:{
        position:'relative', 
    },
    bookingrow1:{
        position:'relative', 
        flex: 3,
        paddingLeft:10
    },
    line:{
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: color.whitishBorder,
        position:'relative'
    },
    clientlblheader:{
        fontSize:22,
  
        // textTransform: 'uppercase',

    },
    clientlbltitle: {
        fontWeight:'bold',
        fontSize: 14,
        color: color.white
    },
    clientlbl:{
        fontSize:12,
        marginBottom:5,
    },
    settings:{
        position: 'absolute',
        zIndex: 1,
        left: 10,
        top:40,
        alignItems: 'center', 
        justifyContent: 'center', 
        color:color.white
    },
    btnbooknow:{
        color:color.white,
        textAlign:'center',
        fontSize:10,
        padding:5, 

      },

      colorused:{
        color: color.reddish
    },
      
      righticon:{
          position:'absolute',
          right:0,
          top:8
      },
      removeservice:{
    
        backgroundColor:'red',
        justifyContent:'center',
        paddingRight:10,
        position:'absolute',
        alignItems: "center",
        width:100,
        height:79
    },
    removeservicebtnText:{
        color:color.white
    },
});
