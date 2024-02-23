import React from "react";
import { StyleSheet ,Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { color } from "../assets/colors/colors";
//import layout from "../assets/styles/layout";

export default class AppointmentTechnicianSearchItem extends React.Component {
    _onPress = () => {
        this.props.onPressItem(this.props.id,this.props.name);
    };

    render() {
        let turnCountDisplay = false;
        let isServingDisplay = false;
        if(this.props.userData.isManageTurn && this.props.data.id > 0){
            turnCountDisplay = (
                <Text style={styles.technicianturn}>
                    ({this.props.data.turn})
                </Text>    
            );
        }

        if(this.props.userData.isManageTurn && this.props.data.id > 0 && this.props.data.isServing){
            isServingDisplay = (
                <Text style={styles.technicianserving}>
                    Serving
                </Text>    
            );
        }else if(this.props.userData.isManageTurn && this.props.data.id > 0 && !this.props.data.isOnline){
            isServingDisplay = (
                <Text style={styles.technicianstatus}>
                    Not Online
                </Text>    
            );
        }

        
       
        return(
            <TouchableOpacity activeOpacity={1} onPress={() => this._onPress()}>
                <View style={styles.itemContainer}>
                    <Icon
                        name={'account-outline'}
                        size={20}
                        color={(this.props.selected ? color.reddish : color.gray42)}
                    />
                    <Text style={[styles.technicianname, {color: this.props.selected ? color.reddish : color.gray42}]}>
                        {this.props.name}
                    </Text>
                    {turnCountDisplay}
                    {isServingDisplay}
                </View>
            </TouchableOpacity>
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
        paddingRight:10
    },
    technicianname:{
        marginLeft:5,
        color:color.gray42,
        fontSize:16
    },
    technicianturn:{
        color:'red',
        fontSize:16,
        marginLeft:5
    },
    technicianserving:{
        color: color.white,
        fontSize:16,
        marginLeft:5,
        backgroundColor:'blue',
        paddingTop:2,
        paddingBottom:2,
        paddingLeft:5,
        paddingRight:5
    },
    technicianstatus:{
        color:'#7878',
        fontSize:16,
        marginLeft:5,
        
        paddingTop:2,
        paddingBottom:2,
        paddingLeft:5,
        paddingRight:5
    }
});
