import React from "react";
import { StyleSheet, Text, View, SectionList, Image, Platform } from "react-native";
import AppointmentItemWaitlist from "./AppointmentItemWaitlist";
//import layout from "../assets/styles/layout";
import moment from "moment";
import sectionListGetItemLayout from "react-native-section-list-get-item-layout";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getLanguageName, getLanguage, getTextByKey } from "../helpers/language";
import { color } from "../assets/colors/colors";

export default class AppointmentByDateWaitlist extends React.PureComponent {
    state = {
        visible: this.props.visible,
        byday: this.props.byday,
        data: this.props.data,
        expresscheckin: this.props.expresscheckin,
        itemIndex: 0,
        sectionIndex: 0,
        offset: 0,
        delay: 200
    };

    currentTechId = 0;
    userData = this.props.userData;
    //sectionCount = 0;
    //itemCount = 0;
    //currentIndex = 0;
    //countOffset = 0;
    //arrOffset = {};
    isAdd = false;
    isEdit = false;
    isStart = false;
    isCheckout = false;

    UNSAFE_componentWillMount(){
            //this.userData.isTechnicianPermissionAppointment
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
        // updater functions are preferred for transactional updates
        //console.log(id);
        //this.props.onSelectedTechnician(id);
        //this.props.selected = id;
        //this.setState({selected:id});
        //console.log(this.state);
        this.props.onPressItem(id);
    };
    _onPressItemAdd = (id, clientexpress) => {
        // updater functions are preferred for transactional updates
        //console.log(id);
        //this.props.onSelectedTechnician(id);
        //this.props.selected = id;
        //this.setState({selected:id});
        //console.log(this.state);
        this.props.onPressItemAdd(id, clientexpress);
    };
    _onViewItem = id => {
        this.props.onViewItem(id);
    };

    disableScrollOnSwipe = (isDisable) => {
        this.refs.sectionAppointment.getScrollResponder().setNativeProps({
            scrollEnabled: isDisable
        })
    }

    refresh = (starttime,appointmentId,data) => {
        this.props.refresh(starttime,appointmentId,data);
    }

    _renderItem = ({ item }) => {
        
        return (
            <AppointmentItemWaitlist
                data={item}
                id={item.id}
                techId={this.currentTechId}
                byday={this.state.byday}
                onPressItem={this._onPressItem}
                onPressItemAdd={this._onPressItemAdd}
                onViewItem={this._onViewItem}
                userData={this.userData}
                token={this.props.token}
                onSwipe={this.disableScrollOnSwipe}
                refreshData={this.refresh}
                isEdit={this.isEdit}
                isStart={this.isStart}
                isCheckout={this.isCheckout}
                language={this.props.language}
                //selected={(item.id == this.props.selected)}
                //name={item.fullname}
            />
        );
    };

    AddAppointment = key => {
        this.props.addAppointment(key);
    };

    componentDidUpdate() {
        if (!this.state.byday && this.state.visible) {
            this.scrollTo();
        }
    }

    scrollTo = () => {
        //this.refs.sectionAppointment.scrollToIndex({animated: true, index: index})
        //console.log('ok');
        let ref = this.refs.sectionAppointment;
        let sectionIndex = this.state.sectionIndex;
        let itemIndex = this.state.itemIndex;
        setTimeout(function() {
            ref.scrollToLocation({
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
        // console.log(sectionHeader.section);
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
                                    size={25}
                                    color={color.white}
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
                    
                </View>
            </View>
        );
    };

    render() {
        if (this.state.visible) {
            return (
                <SectionList
                    ref="sectionAppointment"
                    renderItem={this._renderItem}
                    renderSectionHeader={this._renderSectionHeader}
                    keyExtractor={this._keyExtractor}
                    sections={this.state.data}
                    getItemLayout={this._getItemLayout}
                    stickySectionHeadersEnabled={true}
                />
            );
        } else {
            return false;
        }
    }
}

const styles = StyleSheet.create({
    sectionheader: {
        height: 35,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: color.darkCyan
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
        color: color.white,
        fontSize:16
    },
    sectionheaderaction: {
        color: color.white,
        marginRight: 15
    },
    profilepicture: {
        width: 25,
        backgroundColor: "transparent",
        height: 25,
        justifyContent: "center",
        borderRadius:25,
        overflow: 'hidden',
        zIndex :2,
        marginTop:5,
        marginRight:5
    },
    profileimage: {
        width: 25,
        height: 25,
       // backgroundColor :"transparent",
       // borderRadius:30
        //zIndex :1
    },
    profileimageAndroid:{
         width: 25,
        height: 25,
        borderRadius:25
    }
});
