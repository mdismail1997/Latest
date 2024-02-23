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
    SafeAreaView
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import layout from "../assets/styles/layout";
import FloatLabelInput from "../components/FloatLabelInput";
import AddClient from "../components/AddClient";
import FloatSelectInput from "../components/FloatSelectInput";
import ClientStatistic from "../components/ClientStatistic";
import {
    getUserData
} from "../helpers/authenticate";
import moment from "moment";
import { getTextByKey } from "../helpers/language";
import { color } from "../assets/colors/colors";

export default class ClientDetails extends React.Component {
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
        //this.props.onEdit(this.clientData.id);

        let data = this.clientData;
        data.month = "";
        data.day = "";

        if (data.birthdate != null && String.prototype.trim.call(data.birthdate) != "") {
            if (data.birthdate.indexOf("/") >= 0) {
                let birthdate = data.birthdate.split("/");
                if (birthdate.length > 1) {
                    data.month = birthdate[0];
                    data.day = birthdate[1];
                }
            }
        }
        if (String.prototype.trim.call(data.phone) != "") {
            data.phone = data.phone
                .replace(/[^\d]+/g, "")
                .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
        }
        this.refs.AddClient.title = this.getText('updateclient');
        this.refs.AddClient.clientData = data;
        this.refs.AddClient.setState({ modalVisible: true });
    };

    SaveClientSuccess = (id, data) => {
        this.isRefresh = true;
        this.refs.AddClient.close();
        this.props.SaveClientSuccess(id, data);
    };

    showStatistic = (type) => {
        console.log(type);
        switch(type){
            case 'gift':
                this.refs.ClientStatistic.url = 'history-gift';
            break;
            case 'statistic':
                this.refs.ClientStatistic.url = 'statistic-lient';
            break;
            case 'rewardpoint':
                this.refs.ClientStatistic.url = 'history-reward-point';
            break; 
        }
        this.refs.ClientStatistic.clientId = this.clientData.id;
        this.refs.ClientStatistic.clientName = this.clientData.fullname;
        this.refs.ClientStatistic.show();
    };

    getText(key){
        return getTextByKey(this.props.language,key);
    }

    render() {
        if(typeof(this.clientData.lastvisit) != "undefined" && this.clientData.lastvisit != ""){
            this.clientData.lastvisit = moment(this.clientData.lastvisit).format('MM-DD-YYYY hh:mm A');
        }
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
                            ? layout.headercontainerprofileAndroidModal
                            : layout.headercontainerprofileModal
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
                            <View
                                style={{
                                    flex: 1,
                                    alignItems: "center"
                                }}
                            >
                                <View>
                                    <TouchableOpacity
                                        style={styles.profilepicture}
                                        activeOpacity={1}
                                    >
                                        <Icon
                                            name={"account-circle"}
                                            size={100}
                                            color={color.whiteRGB06}
                                            style={
                                                Platform.OS === "android"
                                                    ? styles.profilepictureiconAndroid
                                                    : styles.profilepictureicon
                                            }
                                        />
                                    </TouchableOpacity>
                                </View>
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
                        {typeof(this.userData.role) != 'undefined' && this.userData.role == 4 &&
                            <FloatLabelInput
                                placeholder={"Email"}
                                value={this.clientData.email}
                            />
                        }
                        {typeof(this.userData.role) != 'undefined' && this.userData.role == 4 &&
                            <FloatLabelInput
                                placeholder={this.getText('clientphonelbl')}
                                value={this.clientData.phone
                                    .replace(/[^\d]+/g, "")
                                    .replace(
                                        /(\d{3})(\d{3})(\d{4})/,
                                        "($1) $2-$3"
                                    )}
                            />}

                        {typeof(this.userData.role) != 'undefined' && this.userData.role == 4 &&
                            <FloatLabelInput
                                placeholder={this.getText('clientbirthdatelbl')}
                                value={this.clientData.birthdate}
                            />
                        }

                        {typeof(this.userData.role) != 'undefined' && this.userData.role == 4 &&
                            <FloatLabelInput
                                placeholder={"Reward point"}
                                value={this.clientData.reward_point}
                            />
                        }
                        {typeof(this.userData.role) != 'undefined' && this.userData.role == 4 &&
                            <FloatLabelInput
                                placeholder={"Gift balance"}
                                value={this.clientData.gift}
                            />
                        }
                        {typeof(this.userData.role) != 'undefined' && this.userData.role == 4 &&
                            <FloatLabelInput
                                placeholder={"Last visit"}
                                value={this.clientData.lastvisit}
                            />
                        }
                        {typeof(this.userData.role) != 'undefined' && this.userData.role == 4 &&
                        <FloatSelectInput
                            placeholder={""}
                            value="Statistic"
                            onPress={() =>this.showStatistic('statistic')}
                        
                        />
                        }
                        <FloatSelectInput
                            placeholder={""}
                            value="Gift Balance"
                            onPress={() =>this.showStatistic('gift')}
                        
                        />
                        <FloatSelectInput
                            placeholder={""}
                            value="Reward points"
                            onPress={() =>this.showStatistic('rewardpoint')}

                        />
                    </ScrollView>}

                <AddClient
                    visible={false}
                    ref="AddClient"
                    token={this.props.token}
                    SaveClientSuccess={this.SaveClientSuccess}
                    language={this.props.language}
                />

                <ClientStatistic visible={false} ref="ClientStatistic"/>
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
        /*backgroundColor:'navy',*/
        marginTop: 15
    },
    profilepictureiconAndroid: {
        marginTop: 0
    }
});
