import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    Platform,
    TextInput,
    ScrollView,
    Dimensions,
    Alert,
    SafeAreaView
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import layout from "../assets/styles/layout";
import Colors from "../constants/Colors";
import SubmitLoader from "../helpers/submitloader";
import IconLoader from "../helpers/iconloader";
import { Table, TableWrapper, Row, Col, Cell} from 'react-native-table-component';
import { getTextByKey } from "../helpers/language";
import SpinnerLoader from "../helpers/spinner";
import moment from "moment";
import ModalSelector from 'react-native-modal-selector';
import {fetchGetCommissionTachnician } from "../helpers/fetchdata";
import { color } from "../assets/colors/colors";
export default class CommissionTechnician extends React.Component {
    state = {
        modalVisible: this.props.visible,
        appIsReady: false,
        textInputValue: 'thisweek'
    };
    title = "";
    techid = 0;
    columnWidth = Dimensions.get("window").width / 6;
    columnWidthDetail = Dimensions.get("window").width / 7;
    height = (Dimensions.get("window").height - 150) / 2 ;
    close() {
        this.setState({ modalVisible: false });
    }

    show = () => {
        this.setState({ modalVisible: true });
    };

    getText(key){
        return getTextByKey(this.props.language,key);
    }
    roundprice = (num) =>{
        return Math.round(num * 100) / 100;
    }
    async getcommission (type){
        this.refs.clientLoader.setState({ visible: true });   
        this.commission = await fetchGetCommissionTachnician(this.props.token, this.techid, type);
        this.setState({textInputValue: type});
        this.refs.clientLoader.setState({ visible: false });
    }
    render() {
        let columnWidthsummary = this.columnWidth;
        if(columnWidthsummary < 100){
            columnWidthsummary = 100;
        }
        if(typeof(this.commission) == "undefined"){
            return false;
        }
        const tableHeader = {
            tableHead: ['Type', 'No. Services', 'Total Services', 'Commission', 'Tips', 'Total'],
            widthArr: [columnWidthsummary, columnWidthsummary, columnWidthsummary, columnWidthsummary, columnWidthsummary, columnWidthsummary]
          };
        const tableData = [];
        let _this = this;
        let totalsummary = 0;
        this.commission.summary.map((row, index)=>{
            let rowData = [];
            rowData = [row.paymentMethod, row.count, _this.roundprice(row.totalServices), "$"+_this.roundprice(row.sumcommission), "$"+row.tips, "$"+_this.roundprice(row.tips + row.sumcommission)];
            totalsummary += row.tips + row.sumcommission;
            tableData.push(rowData);
        })
        totalsummary = _this.roundprice(totalsummary);

        
        let columnWidthDetail = this.columnWidthDetail;
        if(columnWidthDetail < 100){
            columnWidthDetail = 100;
        }
        const tableHeaderDetail = {
            tableHead: ['Type', 'Booking code', 'Amount', 'Commission percent', 'Commission', 'Tips', 'Date'],
            widthArr: [columnWidthDetail, columnWidthDetail, columnWidthDetail, columnWidthDetail, columnWidthDetail, columnWidthDetail, columnWidthDetail]
          };
          const tableDataDetail = [];
          let totalDetail = 0;
          this.commission.details.map((row, index)=>{
              let rowData = [];
              rowData = [row.paymentMethod, row.bookingcode, "$"+row.Amount, row.commissionPercent+"%", "$"+row.commissionAmount, "$"+row.tips, moment(row.created_at).format("MM-DD-Y")];
              totalDetail += row.tips + row.sumcommission;
              tableDataDetail.push(rowData);
          })
          totalDetail = _this.roundprice(totalDetail);

          const data = [
              { key: "today", section: this.state.textInputValue == "today" ? true : false,label: 'To Day' },
              { key: "yesterday",section: this.state.textInputValue == "yesterday" ? true : false, label: 'Yesterday' },
              { key: "thisweek",section: this.state.textInputValue == "thisweek" ? true : false,label: 'This Week' },
              { key: "week",section: this.state.textInputValue == "week" ? true : false, label: 'Last 7 day' },
              { key: "month",section: this.state.textInputValue == "month" ? true : false, label: '1 months'},
              { key: "3month",section: this.state.textInputValue == "3month" ? true : false, label: '3 months'},
              { key: "6month",section: this.state.textInputValue == "6month" ? true : false, label: '6 months'},
              { key: "year",section: this.state.textInputValue == "year" ? true : false, label: '1 Year'}
          ];
        if(this.state.appIsReady){
            return (
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => this.close()}
                >
                    <SafeAreaView style={{flex:1}}>
                    <View
                        style={
                            Platform.OS === "android"
                                ? layout.headercontainerAndroid
                                : layout.headercontainer
                        }
                    >
                        <LinearGradient
                            start={[0, 0]}
                            end={[1, 0]}
                            colors={[color.reddish, color.reddish]}
                            style={
                                Platform.OS === "android"
                                    ? layout.headerAndroid
                                    : layout.header
                            }
                        >
                            <View style={layout.headercontrols}>
                                <TouchableOpacity
                                    style={layout.headerNavLeftContainer}
                                    activeOpacity={1}
                                    onPress={() => this.close()}
                                >
                                    <View style={layout.headerNavLeft}>
                                        <Icon
                                            name={"close"}
                                            size={30}
                                            color={color.whiteRBG1}
                                            style={
                                                Platform.OS === "android"
                                                    ? layout.navIcon
                                                    : layout.navIconIOS
                                            }
                                        />
                                    </View>
                                </TouchableOpacity>
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <Text style={layout.headertitle}>
                                        {this.title}
                                    </Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                <View style={{padding:10}}>


                    <ModalSelector
                        data={data}
                        initValue="This Week"
                        onChange={async (option)=>{ await this.getcommission(option.key)}} />
                    </View>

                    <View style={styles.container}>

                        <View style={styles.boxtitlecm}>
                            <Text style={styles.titlecm}>Commission summary</Text>
                        </View>

                        <ScrollView horizontal={true} style={{marginBottom:20}}>

                            <View>
                                <Table borderStyle={{borderColor: '#C1C0B9'}}>
                                <Row data={tableHeader.tableHead} widthArr={tableHeader.widthArr} style={styles.header} textStyle={styles.text}/>
                                </Table>
                                <ScrollView style={styles.dataWrapper}>
                                    <Table borderStyle={{borderColor: '#C1C0B9'}}>
                                        {
                                        tableData.map((rowData, index) => (
                                            <Row
                                            key={index}
                                            data={rowData}
                                            widthArr={tableHeader.widthArr}
                                            style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}
                                            textStyle={styles.text}
                                            />
                                        ))
                                        }
                                        <TableWrapper style={{flexDirection: 'row'}}>
                                            <Cell data="Commission total" style={{width: columnWidthsummary*5, height: 40, backgroundColor: '#c8e1ff'}} textStyle={{marginLeft: 10}} />
                                            <Cell data={"$"+totalsummary} style={{ width: columnWidthsummary, height: 40, backgroundColor: '#c8e1ff'}} textStyle={{textAlign: 'center'}} />
                                        </TableWrapper>
                                    </Table>
                                </ScrollView>
                            </View>
                        </ScrollView>
                        <View style={styles.boxtitlecm}>
                            <Text style={styles.titlecm}>Commission details</Text>
                        </View>
                        
                        <ScrollView horizontal={true}>
                            <View>
                                <Table borderStyle={{borderColor: '#C1C0B9'}}>
                                <Row data={tableHeaderDetail.tableHead} widthArr={tableHeaderDetail.widthArr} style={styles.header} textStyle={styles.text}/>
                                </Table>
                                <ScrollView style={styles.dataWrapper}>
                                    <Table borderStyle={{borderColor: '#C1C0B9'}}>
                                        {
                                        tableDataDetail.map((rowData, index) => (
                                            <Row
                                            key={index}
                                            data={rowData}
                                            widthArr={tableHeaderDetail.widthArr}
                                            style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}
                                            textStyle={styles.text}
                                            />
                                        ))
                                        }
                                    </Table>
                                </ScrollView>
                            </View>
                        </ScrollView>
                    </View> 
      
                    <SubmitLoader
                            ref="clientLoader"
                            visible={false}
                            textStyle={layout.textLoaderScreenSubmit}
                            textContent={this.getText('processing')}
                            color={Colors.spinnerLoaderColorSubmit}
                        />
                    <IconLoader
                        ref="clientSuccessLoader"
                        visible={false}
                        textStyle={layout.textLoaderScreenSubmitSucccess}
                        textContent={this.getText('clientsavedlbl')}
                        color={Colors.spinnerLoaderColorSubmit}
                    />
                    </SafeAreaView>
                </Modal>
            );
        }else{
            return (
                <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => this.close()}
            >
                <SafeAreaView style={{flex:1}}>
                <View
                    style={
                        Platform.OS === "android"
                            ? layout.headercontainerAndroid
                            : layout.headercontainer
                    }
                >
                    <LinearGradient
                        start={[0, 0]}
                        end={[1, 0]}
                        colors={[color.reddish, color.reddish]}
                        style={
                            Platform.OS === "android"
                                ? layout.headerAndroid
                                : layout.header
                        }
                    >
                        <View style={layout.headercontrols}>
                            <TouchableOpacity
                                style={layout.headerNavLeftContainer}
                                activeOpacity={1}
                                onPress={() => this.close()}
                            >
                                <View style={layout.headerNavLeft}>
                                    <Icon
                                        name={"close"}
                                        size={30}
                                        color={color.whiteRBG1}
                                        style={
                                            Platform.OS === "android"
                                                ? layout.navIcon
                                                : layout.navIconIOS
                                        }
                                    />
                                </View>
                            </TouchableOpacity>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <Text style={layout.headertitle}>
                                    {this.title}
                                </Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>
                <View style={styles.container}>
                    <SpinnerLoader
                        visible={true}
                        textStyle={layout.textLoaderScreen}
                        overlayColor={"transparent"}
                        textContent={"Loading..."}
                        color={Colors.spinnerLoaderColor}
                    />
                </View>
                </SafeAreaView>
            </Modal>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    twocolumn: {
        flexDirection: "row",
        flexWrap: "wrap"
    },
    seperatecolumn: {
        borderWidth: 1,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderColor: color.whitishBorder,
        backgroundColor: "red",
        height: 45
    },
    btnSave: {
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        marginBottom: 15
    },
    btnSaveText: {
        color: color.white,
        fontSize: 16,
        zIndex: 1,
        backgroundColor: "transparent"
    },
    btnSaveWraper: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 15,
        right: 15
    },
    btnLinear: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        overflow: "hidden",
        flex: 1
    },
    text: { textAlign: 'center', fontWeight: '100' },
    row: { height: 40, backgroundColor: '#E7E6E1' },
    titlecm:{
        color: color.silver,
        fontSize:18,
        //fontFamily:'Futura',
        color:color.reddish,
    },
    boxtitlecm:{
        padding:10
    }
});
