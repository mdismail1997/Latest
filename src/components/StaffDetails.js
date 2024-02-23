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
    Image,
    SafeAreaView
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import layout from "../assets/styles/layout";
import FloatLabelInput from "../components/FloatLabelInput";
import EditStaff from "../components/EditStaff";
import {
    getUserData
} from "../helpers/authenticate";
import { getTextByKey } from "../helpers/language";
import { color } from "../assets/colors/colors";

export default class StaffDetails extends React.Component {
    state = {
        modalVisible: this.props.visible
    };

    clientData = {};
    isRefresh = false;
    userData = {}
    close() {
        this.setState({ modalVisible: false });
        if (this.isRefresh) {
            this.props.refresh();
        }
    }

    async UNSAFE_componentWillMount(){
        this.userData = await getUserData();
    }

    show = () => {
        this.setState({ modalVisible: true });
    };

    onEdit = () => {
        let data = this.clientData;
        if (String.prototype.trim.call(data.phone) != "") {
            data.phone = data.phone
                .replace(/[^\d]+/g, "")
                .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
        }
        data.commissioncredit = data.commissioncredit.toString();
        data.commissioncash = data.commissioncash.toString();
        data.commissionegift = data.commissionegift.toString();
        data.commissionmember = data.commissionmember.toString();
        this.refs.AddClient.title = this.getText('updateclient');
        this.refs.AddClient.clientData = data;
        this.refs.AddClient.setState({ modalVisible: true });
    };

    SaveClientSuccess = (id, data) => {
        this.isRefresh = true;
        this.refs.AddClient.close();
        this.props.SaveClientSuccess(id, data);
    };

    getText(key){
        return getTextByKey(this.props.language,key);
    }

    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => this.close()}
            >
            <SafeAreaView style={{flex: 1}}>
                <View
                    style={{height:70}}
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
                                <View
                                    style={
                                        Platform.OS === "android"
                                            ? layout.headerNavRightProfileAndroidModal
                                            : layout.headerNavRightProfileModal
                                    }
                                >
                                    <Icon
                                        name={"arrow-left"}
                                        size={20}
                                        color={color.whiteRBG1}
                                        style={styles.profilepictureicon}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={layout.headertitle}>
                                    {this.clientData.fullname}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={layout.headerNavRightContainer}
                                activeOpacity={1}
                                onPress={this.onEdit}
                            >
                                <View
                                    style={
                                        Platform.OS === "android"
                                            ? layout.headerNavRightProfileAndroidModal
                                            : layout.headerNavRightProfileModal
                                    }
                                >
                                    <Text style={layout.headerNavText}>
                                        {this.getText('editlbl')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>

                {typeof this.clientData.email != "undefined" &&
                    <ScrollView style={styles.container}>
                        <FloatLabelInput
                            placeholder={this.getText('clientfirstname')}
                            value={this.clientData.firstname}
                        />
                        <FloatLabelInput
                            placeholder={this.getText('clientlastname')}
                            value={this.clientData.lastname}
                        />
                        <FloatLabelInput
                            placeholder={"Email"}
                            value={this.clientData.email}
                        />
                        <FloatLabelInput
                            placeholder={this.getText('clientphonelbl')}
                            value={this.clientData.phone
                                .replace(/[^\d]+/g, "")
                                .replace(
                                    /(\d{3})(\d{3})(\d{4})/,
                                    "($1) $2-$3"
                                )}
                        />
                        <FloatLabelInput
                            placeholder={'State issued'}
                            value={this.clientData.state_issued}
                        />
                        <FloatLabelInput
                            placeholder={'About me'}
                            value={this.clientData.details}
                        />
                        <FloatLabelInput
                            placeholder={'Commission Credit Card'}
                            value={this.clientData.commissioncredit}
                        />
                        <FloatLabelInput
                            placeholder={'Commission Membership'}
                            value={this.clientData.commissionmember}
                        />
                        <FloatLabelInput
                            placeholder={'Commission Egift'}
                            value={this.clientData.commissionegift}
                        />
                        <FloatLabelInput
                            placeholder={'Commission Cash'}
                            value={this.clientData.commissioncash}
                        />
                        <FloatLabelInput
                            placeholder={'How would you like to notify technician of new appointments'}
                            value={this.clientData.technician_notify_appointment}
                        />
                        <FloatLabelInput
                            placeholder={'Display staff'}
                            value={this.clientData.display_staff == 1 ? "On" : "Off"}
                        />
                        <FloatLabelInput
                            placeholder={'View customer information'}
                            value={this.clientData.view_customer_information == 1 ? "On" : "Off"}
                        />
                        <FloatLabelInput
                            placeholder={'Primary User'}
                            value={this.clientData.isPrimaryUser == 1 ? "On" : "Off"}
                        />
                        <FloatLabelInput
                            placeholder={'Disable technician booking online'}
                            value={this.clientData.disableTechnicianBookingOnline == 1 ? "On" : "Off"}
                        />
                        <FloatLabelInput
                            placeholder={'Start Appointment'}
                            value={this.clientData.isStartAppointment == 1 ? "On" : "Off"}
                        />
                        <FloatLabelInput
                            placeholder={'Checkout Appointment'}
                            value={this.clientData.isCheckoutAppointment == 1 ? "On" : "Off"}
                        />
                        <FloatLabelInput
                            placeholder={'Add Appointment'}
                            value={this.clientData.isAddAppointment == 1 ? "On" : "Off"}
                        />
                        <FloatLabelInput
                            placeholder={'Edit Appointment'}
                            value={this.clientData.isEditAppointment == 1 ? "On" : "Off"}
                        />
                        <FloatLabelInput
                            placeholder={'Status'}
                            value={this.clientData.status == 1 ? "On" : "Off"}
                        />
                    </ScrollView>}

                <EditStaff
                    visible={false}
                    ref="AddClient"
                    token={this.props.token}
                    SaveClientSuccess={this.SaveClientSuccess}
                    language={this.props.language}
                    services={this.props.services}
                />
                </SafeAreaView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    profilepicture: {
        marginTop: 15
    },
    profilepictureiconAndroid: {
        marginTop: 0
    }
});
