import React from "react";
import { StyleSheet ,Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { color } from "../assets/colors/colors";
//import layout from "../assets/styles/layout";

export default class CategoryCheckinSearch extends React.Component {
    _onPress = () => {
        this.props.onPressItem(this.props.id,this.props.name);
    };

    render() {
        return(
            <TouchableOpacity activeOpacity={1} onPress={() => this._onPress()}>
                <View style={styles.itemContainer}>
                    <Icon
                        name={'account-outline'}
                        size={20}
                        color={(this.props.selected ? color.reddish : color.reddish)}
                    />
                    <Text style={[styles.technicianname, {color:(this.props.selected ? color.reddish : color.reddish)}]}>
                        {this.props.name}
                    </Text>
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