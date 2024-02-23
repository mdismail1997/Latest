import React, {Component} from "react";
import {StyleSheet, Text, View, TextInput, Animated, Platform, TouchableOpacity} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { color } from "../assets/colors/colors";

class FloatingLabel extends Component {
    
    render() {
        return (
            <View
                style={[styles.floatingLabel]}>
                {this.props.children}
            </View>
        );
    }
}

class TextFieldHolder extends Component {
    
    render() {
        return (
            <View>
                {this.props.children}
            </View>
        );
    }
}

class FloatLabelSelectField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false,
            text: this.props.value,
            placeholder: this.props.placeholder
            //id: this.props.id,
            //refdata: this.props.refdata
        };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.hasOwnProperty('value') && newProps.value !== this.state.text) {
            this.setState({text: newProps.value})
        }
    }

    withBorder() {
        if (!this.props.noBorder) {
            return styles.withBorder;
        }
    }

    onPress = () => {
        if(this.props.hasOwnProperty('onPress'))
        {
            this.props.onPress();
        }

        if(this.props.hasOwnProperty('onPressDynamic'))
        {
            this.props.onPressDynamic(this.props.id,this.props.refdata);
        }
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={1} onPress={this.onPress} style={styles.container}>
            <View style={{flex:1}}>
                <View style={[styles.viewContainer,this.withBorder()]}>
                    <View style={styles.paddingView}/>
                    <View style={[styles.fieldContainer]}>
                        

                        <TextFieldHolder withValue={(this.state.text && this.state.placeholder)} style={[styles.valueContainer]}>
                            
                                <View>
                                    <Text style={[(this.state.text ? styles.valueText :  styles.valueTextPlaceHolder)]}>
                                        {this.state.text ? this.state.text  : this.state.placeholder }
                                    </Text>

                                </View>
                            
                        </TextFieldHolder>
                        {
                            (this.state.placeholder != "") &&
                            <FloatingLabel visible={this.state.text}>
                                <Text style={[styles.fieldLabel, this.labelStyle()]}>{this.placeholderValue()}</Text>
                            </FloatingLabel>
                        }
                        <View style={styles.iconRight}>
                            <Icon
                                name={'chevron-right'}
                                size={22}
                                color={color.blackRGB6}
                            />
                        </View>
                    </View>
                </View>
            </View>
            </TouchableOpacity>
        );
    }



    labelStyle() {
        if (this.state.focused) {
            return styles.focused;
        }
    }

    placeholderValue() {
        if (this.state.text) {
            return this.state.placeholder;
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 45,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    viewContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    paddingView: {
        width: 15
    },
    floatingLabel: {
        position: 'absolute',
        top: 0,
        right:55,
        bottom:0,
        justifyContent: 'center',
    },
    fieldLabel: {
        fontSize: 16,
    },
    fieldContainer: {
        flex: 1,
        justifyContent: 'center',
        position: 'relative'
    },
    withBorder: {
        borderBottomWidth: 1 / 2,
        borderColor: color.grayishBlue,
    },
    valueContainer:{
        height: (Platform.OS == 'ios' ? 20 : 60),
        backgroundColor:'red'
    },
    valueText: {
        /*height: (Platform.OS == 'ios' ? 20 : 60),
        fontSize: 16,
        color: color.dark,
        backgroundColor:'red'*/
        fontSize:16,
        color:"#333",
        marginRight:100
    },
    valueTextPlaceHolder:{
        color: color.silver,
        fontSize:16
    },
    focused: {
        color: color.reddish
    },
    iconRight: {
        position:'absolute',
        right:10,
        bottom:0,
        top:0,
        justifyContent: 'center'
    }
});

export default FloatLabelSelectField;