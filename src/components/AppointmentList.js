import React from "react";
import { StyleSheet, Text, View, SectionList, Image, Platform, TextInput, Modal, TouchableOpacity, Alert } from "react-native";
import AppointmentItem from "./AppointmentItem";
import moment, { now } from "moment";
import sectionListGetItemLayout from "react-native-section-list-get-item-layout";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getLanguageName, getLanguage, getTextByKey } from "../helpers/language";
import layout from "../assets/styles/layout";
import SubmitLoader from "../helpers/submitloader";
import Colors from "../constants/Colors";
import Feather from 'react-native-vector-icons/Feather';
import setting from "../constants/Setting";
import { color } from "../assets/colors/colors";
export default class AppointmentList extends React.PureComponent {
    state = {
        modalVisible: false,
        visible: this.props.visible,
        byday: this.props.byday,
        data: this.props.data,
        propsdata: this.props.propsdata,
        itemIndex: 0,
        sectionIndex: 0,
        offset: 0,
        delay: 200,
        appIsReady: false,
        idAppointment: '',
        statusAppointment: '',
        itemAppointment: '',
        statusSort:'',
        valueSearch:'',
        appointment_by_day:this.props.byDayDate
    };

    currentTechId = 0;
    userData = this.props.userData;
    isAdd = false;
    isEdit = false;
    isStart = false;
    isCheckout = false;
    onPressModal = (value) => {
        this.setState({ modalVisible: value })
    }
    UNSAFE_componentWillMount() {
        // if(this.userData.role == 4 || (this.userData.role == 9 && this.userData.isPrimaryUser))
        if (this.userData.role == 4 || this.userData.role == 9) {
            this.isAdd = true;
            this.isEdit = true;
        } else if (this.userData.isTechnicianPermissionAppointment) {
            if (this.userData.TechnicianPermissionType == 'forall') {
                if (this.userData.isAddAppointment) {
                    this.isAdd = true;
                }
                if (this.userData.isEditAppointment) {
                    this.isEdit = true;
                }

                if (this.userData.isStartAppointment) {
                    this.isStart = true;
                }
                if (this.userData.isCheckoutAppointment) {
                    this.isCheckout = true;
                }
            } else {
                if (this.userData.isAddAppointmentForTech) {
                    this.isAdd = true;
                }

                if (this.userData.isEditAppointmentForTech) {
                    this.isEdit = true;
                }

                if (this.userData.isStartAppointmentForTech) {
                    this.isStart = true;
                }
                if (this.userData.isCheckoutAppointmentForTech) {
                    this.isCheckout = true;
                }
            }
        }
    }

    _keyExtractor = (item, index) => item.id;

    _onPressItem = (id, type, data = {}) => {
        if (this.props.bylist) {
            let filter = this.state.propsdata[0].data.filter(function (item) {
                return item.schedulerid == id;
            });
            let status = '';
            if (filter.length > 0) {
                status = filter[0].status;
            }
            this.setState({ idAppointment: id, statusAppointment: status, itemAppointment: data })
            this.onPressModal(true);
        } else {
            this.props.onPressItem(id, type);
        }


    };

    _onViewItem = id => {
        this.props.onViewItem(id);
    };

    disableScrollOnSwipe = (isDisable) => {
        this.refs.sectionAppointment.getScrollResponder().setNativeProps({
            scrollEnabled: isDisable
        })
    }

    refresh = (starttime, appointmentId, data) => {
        this.props.refresh(starttime, appointmentId, data);
    }

    _renderItem = ({ item }) => {
        return (
            <AppointmentItem
                data={item}
                id={item.schedulerid}
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
                bylist={this.props.bylist}
            />
        );
    };

    AddAppointment = key => {
        this.props.addAppointment(key);
    };

    UNSAFE_componentDidUpdate() {
        if (!this.state.byday && this.state.visible) {
            this.scrollTo();
        }
    }

    scrollTo = () => {
        let ref = this.refs.sectionAppointment;
        let sectionIndex = this.state.sectionIndex;
        let itemIndex = this.state.itemIndex;
        setTimeout(function () {
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
    _renderSectionHeaderSearch = sectionHeader => {
        return (
            <View>
                <View style={styles.sectionheader}>
                    <View style={[layout.searchContainer, styles.searchinput]}>
                        <Icon
                            name={'magnify'}
                            size={20}
                            color={color.gray42} style={layout.iconsearchbox}
                        />
                        <TextInput
                            placeholder="Search ** by name, email, phone" placeholderTextColor={color.gray42}
                            underlineColorAndroid={'transparent'}
                            style={layout.searchbox}
                            onChangeText={(searchtext) => this.changeSearchText(searchtext)}
                            ref={'searchtextinput'}
                            clearButtonMode="always"
                        />

                    </View>
                </View>
            </View>
        );
    }
    changeSearchText = (searchtext) => {
        let _this = this;
        let SearchData = [...this.state.propsdata[0].data];
        if (searchtext != "" && SearchData.length > 0) {
            SearchData = SearchData.filter(function (itemsearch) {
                let phone = '';
                if (typeof itemsearch.phone != 'undefined' && itemsearch.phone != '' && itemsearch.phone != null) {
                    phone = itemsearch.phone.replace(/[^\d]+/g, '');
                }
                return (typeof(itemsearch.email) != 'undefined' && itemsearch.email.indexOf(searchtext.toLowerCase()) >= 0) ||
                (typeof(itemsearch.client_full_name) != 'undefined' && (itemsearch.client_full_name).toLowerCase().indexOf(searchtext.toLowerCase())) >= 0 ||
                    phone.indexOf(searchtext) >= 0;
            });
        }
        if(_this.state.statusSort !== ''){
            SearchData = SearchData.filter(function (itemsearch) {
                return itemsearch.status === _this.state.statusSort;
            });
        }
        _this.state.data = [];
        let data = {};
        data.key = 0;
        data.data = SearchData;
        _this.setState({ data: [data], valueSearch: searchtext});
    }
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
                                        uri: picture
                                    }}
                                />
                            </View>}

                        <View style={styles.sectionheadertextcontainer}>
                            <Text style={styles.sectionheadertextcontent}>
                                {sectionName}
                            </Text>
                        </View>
                    </View>
                    {this.isAdd
                        &&
                        <Text
                            onPress={() => {
                                this.AddAppointment(sectionHeader.section.key);
                            }}
                            style={styles.sectionheaderaction}
                        >
                            + {getTextByKey(this.props.language, 'addnewappointmentitem')}
                        </Text>
                    }

                </View>
            </View>
        );
    };
    sortStatus = async(status)=>{
        let searchtext = this.state.valueSearch;
        let _this = this;
        let SearchData = [...this.state.propsdata[0].data];
        if (searchtext != "") {
            SearchData = SearchData.filter(function (itemsearch) {
                let phone = '';
                if (typeof itemsearch.phone != 'undefined' && itemsearch.phone != '' && itemsearch.phone != null) {
                    phone = itemsearch.phone.replace(/[^\d]+/g, '');
                }
                return itemsearch.email.indexOf(searchtext.toLowerCase()) >= 0 ||
                    (itemsearch.client_full_name).toLowerCase().indexOf(searchtext.toLowerCase()) >= 0 ||
                    phone.indexOf(searchtext) >= 0;
            });
        }
        if(status !== ''){
            SearchData = SearchData.filter(function (itemsearch) {
                return itemsearch.status === status;
            });
        }
        this.state.data = [];
        let data = {};
        data.key = 0;
        data.data = SearchData;
        this.setState({ data: [data],statusSort: status});
    }
    setSelection = async (status) => {
        let _this = this;
        if (status == this.state.statusAppointment) {
            _this.setState({ modalVisible: false })
        } else {
            _this.setState({ modalVisible: false })
            _this.refs.saveLoader.setState({ visible: true });
            let url = '';
            let strstatus = '';
            switch (status) {
                case 0:
                    strstatus = 'pending';
                    url = "appointment/pending";
                    break;
                case 1:
                    strstatus = 'confirmed';
                    url = "appointment/confirm";
                    break;
                case 2:
                    strstatus = 'completed';
                    url = "appointment/complete";
                    break;
                case 3:
                    strstatus = 'cancelled';
                    url = "appointment/cancel";
                    break;
            }

            await fetch(setting.apiUrl + url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + _this.props.token
                },
                body:
                    JSON.stringify({
                        id: _this.state.idAppointment,
                        status: status
                    })
            }).then((response) => response.json()).then((responseJson) => {
                setTimeout(function () {
                    _this.refs.saveLoader.setState({ visible: false });
                    if (responseJson.success) {
                        Object.values(_this.state.propsdata[0].data).map(item => {
                            if (item.schedulerid == _this.state.idAppointment) {
                                item.status = status;
                            }
                        });
                        let propsdatanew = [..._this.state.propsdata];
                        Object.values(_this.state.data[0].data).map(item => {
                            if (item.schedulerid == _this.state.idAppointment) {
                                item.status = status;
                            }
                        });
                        let dataNew = [..._this.state.data];
                        _this.setState({ propsdata: propsdatanew, data: dataNew })
                        Alert.alert('Success', 'Change status success');
                    } else {
                        Alert.alert('Error', responseJson.message);
                    }
                }, 2000)

            }).catch((error) => {
                return [];
            });


        }
    }
    render() {
        let byday = '';
        if(typeof(this.state.appointment_by_day) != 'undefined'){
            byday = this.state.appointment_by_day.format('MM-DD-YYYY');
        }
        if (this.state.visible) {
            if (this.props.bylist) {
                return (
                    <View >
                        <Text style={[{padding:10}]}>Appointments By Day: {byday}</Text>
                        <View style={[styles.btnGroup_g, styles.btnGroup_gcus]}>
                            <TouchableOpacity style={[styles.btn_g, { backgroundColor: "#f57f7f", width:10 }]} onPress={async () => { await this.sortStatus('') }}>
                                {this.state.statusSort === '' && <Feather name="check" size={20} color="white" />}
                                <Text style={[styles.btnText_gcus, { color: "white" }]}>All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn_g, { backgroundColor: "#6321CE" }]} onPress={async () => { await this.sortStatus(0) }}>
                                {this.state.statusSort === 0 && <Feather name="check" size={20} color="white" />}
                                <Text style={[styles.btnText_gcus, { color: "white" }]}>Pending</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn_g, { backgroundColor: "#097885" }]} onPress={async () => { await this.sortStatus(1) }}>
                                {this.state.statusSort == 1 && <Feather name="check" size={20} color="white" />}
                                <Text style={[styles.btnText_gcus, { color: "white" }]}>Confirmed</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn_g, { backgroundColor: "#BA0A98" }]} onPress={async () => { await this.sortStatus(2) }}>
                                {this.state.statusSort == 2 && <Feather name="check" size={20} color="white" />}
                                <Text style={[styles.btnText_gcus, { color: "white" }]}>Completed</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn_g, { backgroundColor: "#b1b1b1" }]} onPress={async () => { await this.sortStatus(3) }}>
                                {this.state.statusSort == 3 && <Feather name="check" size={20} color="white" />}
                                <Text style={[styles.btnText_gcus, { color: "white" }]}>Cancelled</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.sectionheader}>
                            <View style={[layout.searchContainer, styles.searchinput]}>
                                <Icon
                                    name={'magnify'}
                                    size={20}
                                    color={color.gray42} style={layout.iconsearchbox}
                                />
                                <TextInput
                                    placeholder="Search ** by name, email, phone" placeholderTextColor={color.gray42}
                                    underlineColorAndroid={'transparent'}
                                    style={layout.searchbox}
                                    onChangeText={(searchtext) => this.changeSearchText(searchtext)}
                                    ref={'searchtextinput'}
                                    clearButtonMode="always"
                                />

                            </View>
                        </View>
                        <SectionList
                            ref="sectionAppointment"
                            renderItem={this._renderItem}
                            keyExtractor={this._keyExtractor}
                            // renderSectionHeader={this._renderSectionHeaderSearch}
                            sections={this.state.data}
                            getItemLayout={this._getItemLayout}
                            stickySectionHeadersEnabled={true}
                            // Performance settings
                            removeClippedSubviews={true} // Unmount components when outside of window 
                            initialNumToRender={50} // Reduce initial render amount
                            maxToRenderPerBatch={50} // Reduce number in each render batch
                            updateCellsBatchingPeriod={50} // Increase time between renders
                            windowSize={50} // Reduce the window size
                        />
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.modalVisible}
                        >
                            <View style={styles.enteredView}>
                                <View style={styles.modalView}>
                                    <TouchableOpacity style={styles.headerNavLeftContainer} activeOpacity={1} onPress={() => this.onPressModal(false)}>
                                        <View style={layout.headerNavLeft}>
                                            <Icon name={"close"} size={30} color="#333" style={Platform.OS === "android" ? layout.navIcon : layout.navIconIOS} />
                                        </View>
                                    </TouchableOpacity>
                                    <Text style={styles.modalText}>Change Status</Text>
                                    <View style={styles.btnGroup_g}>
                                        <TouchableOpacity style={[styles.btn_g, { backgroundColor: "#6321CE" }]} onPress={async () => { await this.setSelection(0) }}>
                                            {this.state.statusAppointment === 0 && <Feather name="check" size={20} color="white" />}
                                            <Text style={[styles.btnText_g, { color: "white" }]}>Pending</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.btn_g, { backgroundColor: "#097885" }]} onPress={async () => { await this.setSelection(1) }}>
                                            {this.state.statusAppointment == 1 && <Feather name="check" size={20} color="white" />}
                                            <Text style={[styles.btnText_g, { color: "white" }]}>Confirmed</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.btn_g, { backgroundColor: "#BA0A98" }]} onPress={async () => { await this.setSelection(2) }}>
                                            {this.state.statusAppointment == 2 && <Feather name="check" size={20} color="white" />}
                                            <Text style={[styles.btnText_g, { color: "white" }]}>Completed</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.btn_g, { backgroundColor: "#b1b1b1" }]} onPress={async () => { await this.setSelection(3) }}>
                                            {this.state.statusAppointment == 3 && <Feather name="check" size={20} color="white" />}
                                            <Text style={[styles.btnText_g, { color: "white" }]}>Cancelled</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {/* <Pressable
                                        style={[styles.button, styles.buttonClose]}
                                        onPress={async () => { await this.onPressSubmit() }}
                                    >
                                        <Text style={styles.textStyle}>Redeem</Text>
                                    </Pressable> */}
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
            } else {
                return (
                    <SectionList
                        ref="sectionAppointment"
                        renderItem={this._renderItem}
                        renderSectionHeader={this._renderSectionHeader}
                        keyExtractor={this._keyExtractor}
                        sections={this.state.data}
                        getItemLayout={this._getItemLayout}
                        stickySectionHeadersEnabled={true}
                        // Performance settings
                        removeClippedSubviews={true} // Unmount components when outside of window 
                        initialNumToRender={50} // Reduce initial render amount
                        maxToRenderPerBatch={50} // Reduce number in each render batch
                        updateCellsBatchingPeriod={50} // Increase time between renders
                        windowSize={50} // Reduce the window size
                    />
                );
            }

        } else {
            return false;
        }
    }
}

const styles = StyleSheet.create({

    btnGroup_gcus: {
        padding: 10,
        backgroundColor: color.lightWhite,
    },
    btnGroup_g: {
        flexDirection: 'row',
        alignItems: "center",
        borderBottomWidth: 0,
        borderBottomColor: '#6B7280'
    },
    btn_g: {
        flex: 1,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderColor: 'white',
         flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnText_g: {
        textAlign: 'center',
        paddingVertical: 16,
        fontSize: 12,
        fontWeight: "bold"
    },
    btnText_gcus: {
        textAlign: 'center',
        paddingVertical: 10,
        fontSize: 10,
        fontWeight: "bold"
    },
    headerNavLeftContainer: {
        position: 'absolute', right: 5, top: 0, flex: 1
    },
    enteredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        width: '98%',
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 5,
        paddingTop: 35,
        paddingBottom: 35,
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
        textAlign: "center",
        fontSize: 18,
        fontWeight: 'bold'
    },
    // -----
    searchinput: {
        width: '100%',
        marginTop: 10
    },
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
        fontSize: 16
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
        borderRadius: 25,
        overflow: 'hidden',
        zIndex: 2,
        marginTop: 5,
        marginRight: 5
    },
    profileimage: {
        width: 25,
        height: 25,
        // backgroundColor :"transparent",
        // borderRadius:30
        //zIndex :1
    },
    profileimageAndroid: {
        width: 25,
        height: 25,
        borderRadius: 25
    }
});
