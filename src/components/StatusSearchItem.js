import React from "react";
import { StyleSheet ,Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getTextByKey } from "../helpers/language";
import { color } from "../assets/colors/colors";
//import layout from "../assets/styles/layout";

export default class StatusSearchItem extends React.Component {
    _onPress = () => {
        this.props.onPressItem(this.props.id,this.props.name);
    };

    getText(key){
        return getTextByKey(this.props.language,key);
    }

    render() {
        return(
            <TouchableOpacity activeOpacity={1} onPress={() => this._onPress()}>
                <View style={styles.itemContainer}>
                    
                    <Text style={styles.technicianname}>{this.getText(this.props.name)}</Text>
                    {this.props.selected &&
                        <Icon
                            name={'check'}
                            size={20}
                            color={color.reddish} style={styles.selected}
                        />
                    }
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
    selected:{
        position:'absolute',
        right:15,
    }
});
