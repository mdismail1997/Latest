import React from "react";
import { StyleSheet ,Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
    getUserData
} from "../helpers/authenticate";
import { color } from "../assets/colors/colors";

export default class StaffItemTab extends React.PureComponent {
    async UNSAFE_componentWillMount() {
        
        this.userData = await getUserData();
    }
    _onPress = () => {
        if((this.userData.view_customer_information != "" && this.userData.view_customer_information == 1)
        || this.userData.role == 4){
            this.props.onPressItem(this.props.id,this.props.name);
        }
        
    };
    onPressItemCommission = () =>{
        if((this.userData.view_customer_information != "" && this.userData.view_customer_information == 1)
        || this.userData.role == 4){
            this.props.onPressItemCommission(this.props.id,this.props.name);
        }
    }
    render() {
        return(
            <View style={styles.itemContainer}>
            <TouchableOpacity activeOpacity={1} onPress={() => this._onPress()}>
                <Text style={styles.technicianname}>{this.props.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} onPress={() => this.onPressItemCommission()}>
                <View style={styles.profilepicture}>
                    <Icon
                        name={"account-circle"}
                        size={30}
                        color={color.reddish}
                    />
                </View>
            </TouchableOpacity>
        </View>

        );
    }
}

const styles = StyleSheet.create({
    itemContainer: {
        height:50,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: color.cream,
        borderBottomWidth: 0.5,
        paddingLeft:10,
        paddingRight:10,
        backgroundColor: color.white,
        justifyContent: "space-between",
    },
    technicianname:{
        marginLeft:5,
        color: color.gray42,
        fontSize:16
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
        marginRight: 15
    },
});
