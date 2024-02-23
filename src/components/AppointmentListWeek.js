import React from "react";
import { StyleSheet, Text, View, SectionList, Image, Platform } from "react-native";
import AppointmentItem from "./AppointmentItem";
import moment from "moment";
import sectionListGetItemLayout from "react-native-section-list-get-item-layout";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getTextByKey } from "../helpers/language";
import SpinnerLoader from "../helpers/spinner";
import layout from "../assets/styles/layout";
import Colors from "../constants/Colors";
import { color } from "../assets/colors/colors";
export default class AppointmentListWeek extends React.PureComponent {
    constructor(props) {
        super(props);
        this.sectionAppointmentRef = React.createRef();
        this.state = {
            visible: false,
            byday: false,
            data: [],
            itemIndex: 0,
            sectionIndex: 0,
            offset: 0,
            delay: 200
        };
    }


    currentTechId = 0;
    userData = this.props.userData;
    isAdd = false;
    isEdit = false;
    isStart = false;
    isCheckout = false;
    UNSAFE_componentWillMount(){
        if(this.userData.role == 4 || (this.userData.role == 9 && this.userData.isPrimaryUser)){
            this.isAdd = true;
            this.isEdit = true;
        }else if(this.userData.isTechnicianPermissionAppointment) {
            if(this.userData.TechnicianPermissionType == 'forall'){
                if(this.userData.isAddAppointment){
                    this.isAdd = true;               
                }
                if(this.userData.isEditAppointment){
                    this.isEdit = true;               
                }

                if(this.userData.isStartAppointment){
                    this.isStart = true;               
                }
                if(this.userData.isCheckoutAppointment){
                    this.isCheckout = true;               
                }
            }else{
                if(this.userData.isAddAppointmentForTech){
                    this.isAdd = true;
                }    

                if(this.userData.isEditAppointmentForTech){
                    this.isEdit = true;
                }

                if(this.userData.isStartAppointmentForTech){
                    this.isStart = true;               
                }
                if(this.userData.isCheckoutAppointmentForTech){
                    this.isCheckout = true;               
                }
            }
        }    
    }

    _keyExtractor = (item, index) => item.id;

    _onPressItem = id => {
        this.props.onPressItem(id);
    };

    _onViewItem = id => {
        this.props.onViewItem(id);
    };

    disableScrollOnSwipe = (isDisable) => {
        this.sectionAppointmentRef.current.getScrollResponder().setNativeProps({
            scrollEnabled: isDisable
        })
    }

    refresh = (starttime,appointmentId,data) => {
        this.props.refresh(starttime,appointmentId,data);
    }

    _renderItem = ({ item }) => {
        return (
            <AppointmentItem
                data={item}
                id={item.id}
                techId={this.currentTechId}
                byday={this.state.byday}
                onPressItem={this._onPressItem}
                onViewItem={this._onViewItem}
                userData={this.userData}
                token={this.props.token}
                onSwipe={this.disableScrollOnSwipe}
                refreshData={this.refresh}
                isEdit={this.isEdit}
                isStart={this.isStart}
                isCheckout={this.isCheckout}
                language={this.props.language}
            />
        );
    };

    AddAppointment = key => {
        this.props.addAppointment(key);
    };
    UNSAFE_componentWillUpdate() {
        if (!this.state.byday && this.state.visible) {
            this.scrollTo();
        }

    }
    scrollTo = () => {
        let _this = this;
        
        let sectionIndex = this.state.sectionIndex;
        let itemIndex = this.state.itemIndex;
        setTimeout(function() {
            _this.sectionAppointmentRef.current.scrollToLocation({
                animated: true,
                sectionIndex: sectionIndex,
                itemIndex: itemIndex,
                viewPosition: 0,
                viewOffset: 0
            });
        }, this.state.delay);
    };

    _getItemLayout = sectionListGetItemLayout({
        // The height of the row with rowData at the given sectionIndex and rowIndex
        getItemHeight: (rowData, sectionIndex, rowIndex) => 70,

        // These three properties are optional
        getSeparatorHeight: () => 0, // The height of your separators
        getSectionHeaderHeight: () => 35, // The height of your section headers
        getSectionFooterHeight: () => 0 // The height of your section footers
    });

    _renderSectionHeader = sectionHeader => {
        var sectionName = "";
        var profilepicture = false;
        var picture = "";
        if (this.state.byday) {
            let sectionInfo = this.props.sectiondata.first(tech => {
                return tech.id == sectionHeader.section.key;
            });
            this.currentTechId = sectionInfo.id;

            sectionName = sectionInfo.fullname;
            picture = sectionInfo.picture;
        } else {
            sectionName = moment(sectionHeader.section.key).format(
                "ddd DD MMM"
            );
            //console.log(sectionHeader);
        }
        //console.log(sectionHeader.section.data.length);

        return (
            <View>
                <View style={styles.sectionheader}>
                    <View style={styles.sectionheadertext}>
                        {this.state.byday &&
                            picture == "" &&
                            <View style={styles.profilepicture}>
                                <Icon
                                    name={"account-circle"}
                                    size={30}
                                    color={color.silver}
                                />
                            </View>}

                        {this.state.byday &&
                            picture != "" &&
                            <View style={styles.profilepicture}>
                                <Image
                                    style={(Platform.OS === 'android' ? styles.profileimageAndroid : styles.profileimage)}
                                    source={{
                                        uri:picture
                                    }}
                                />
                            </View>}

                        <View style={styles.sectionheadertextcontainer}>
                            <Text style={styles.sectionheadertextcontent}>
                                {sectionName}
                            </Text>
                        </View>
                    </View>
                    { this.isAdd
                     && 
                        <Text
                            onPress={() => {
                                this.AddAppointment(sectionHeader.section.key);
                            }}
                            style={styles.sectionheaderaction}
                        >
                            + {getTextByKey(this.props.language,'addnewappointmentitem')}
                        </Text>
                    }                        
                    
                </View>
            </View>
        );
    };

    render() {
        if (this.state.visible) {
            return (
                <SectionList
                    ref={this.sectionAppointmentRef}
                    renderItem={this._renderItem}
                    renderSectionHeader={this._renderSectionHeader}
                    keyExtractor={this._keyExtractor}
                    sections={this.state.data}
                    getItemLayout={this._getItemLayout}
                    stickySectionHeadersEnabled={true}
                />
            );
        } else {
            return (
                <View style={styles.container}>
                    <SpinnerLoader
                        visible={true}
                        textStyle={layout.textLoaderScreen}
                        overlayColor={"transparent"}
                        color="black"
                    />
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sectionheader: {
        height: 35,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: color.lightWhite
    },
    sectionheadertext: {
        marginLeft: 15,
        flexDirection: "row"
    },
    sectionheadertextcontainer: {
        height: 35,
        justifyContent: "center"
    },
    sectionheadertextcontent: {
        color: color.silver,
        fontSize:16
    },
    sectionheaderaction: {
        color: color.reddish,
        marginRight: 15
    },
    profilepicture: {
        width: 30,
        backgroundColor: "transparent",
        height: 30,
        justifyContent: "center",
        borderRadius:30,
        overflow: 'hidden',
        zIndex :2,
        marginTop:2,
        marginRight:5
    },
    profileimage: {
        width: 30,
        height: 30,
       // backgroundColor :"transparent",
       // borderRadius:30
        //zIndex :1
    },
    profileimageAndroid:{
         width: 30,
        height: 30,
        borderRadius:30
    }
});
