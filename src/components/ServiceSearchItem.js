import React from "react";
import { StyleSheet ,Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { color } from "../assets/colors/colors";
//import layout from "../assets/styles/layout";

export default class ServiceSearchItem extends React.Component {
    _onPress = () => {
   
        //this.props.onPressItem(this.props.id,this.props.name,this.props.price,this.props.duration,this.props.rewardpoint, this.props.isCombo);
        this.props.onPressItem(this.props.id,this.props.name,this.props.price,this.props.duration,this.props.isCombo, this.props.rewardpoint);
    };

    render() {
        return(
            <TouchableOpacity activeOpacity={1} onPress={() => this._onPress()}>
                <View style={styles.itemContainer}>
                    {this.props.selected &&
                        <Icon
                            name={'check'}
                            size={20}
                            color={color.reddish} 
                        />
                    }
                    <Text style={styles.technicianname}>{this.props.name}</Text>
                    <Text style={styles.serviceprice}>${this.props.price}</Text>
                    <Text style={styles.servicepoint}>{this.props.point} Points</Text>
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
        color: color.gray42,
        fontSize:16
    },
    serviceprice:{
        position:'absolute',
        right:100,
        color:color.reddish,
        fontSize:16
    },
    servicepoint:{
        position:'absolute',
        right:15,
        color:color.reddish,
        fontSize:16
    }
});
