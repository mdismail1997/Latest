import React from "react";
import { StyleSheet ,Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { color } from "../assets/colors/colors";
//import layout from "../assets/styles/layout";

export default class TechnicianSearchItem extends React.Component {
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
                        color={(this.props.selected ? color.gray42 : color.cream)}
                    />
                    <Text style={styles.technicianname}>{this.props.name}</Text>
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
    }
});
