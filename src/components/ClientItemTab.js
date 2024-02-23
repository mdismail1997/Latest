import React from "react";
import { StyleSheet ,Text, View, TouchableOpacity, Dimensions } from "react-native";
import {
    getUserData
} from "../helpers/authenticate";
import { color } from "../assets/colors/colors";
var {height, width} = Dimensions.get('window');
export default class ClientItemTab extends React.PureComponent {
    async UNSAFE_componentWillMount() {
        var screen = Dimensions.get('window');
        width = screen.width;
        height = screen.height;
        this.userData = await getUserData();
    }
    _onPress = () => {
        if((this.userData.view_customer_information != "" && this.userData.view_customer_information == 1)
        || this.userData.role == 4){
            this.props.onPressItem(this.props.id,this.props.name);
        }
        
    };

    render() {
        return(
            <TouchableOpacity activeOpacity={1} onPress={() => this._onPress()}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={[styles.itemContainer]} >
                        <Text style={styles.technicianname}>{this.props.name}</Text>
                        {/* <Text style={styles.technicianname}>{this.props.data.lastvisit}</Text> */}
                        <Text style={{marginTop: 5, marginLeft: 5,color: color.gray42,fontSize:16}}>Points: {this.props.data.reward_point} </Text>
                    </View>
                </View>
        </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    itemContainer: {
        height:55,
        borderBottomColor: color.cream,
        borderBottomWidth: 0.5,
        paddingLeft:10,
        paddingRight:10,
        backgroundColor: color.white,
        justifyContent:'center',
        width:"100%"
    },
    technicianname:{
        marginTop:10,
        marginLeft:5,
        color: color.gray42,
        fontSize:16
    }
});
