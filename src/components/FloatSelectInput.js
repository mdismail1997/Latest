import React, {Component} from "react";
import {StyleSheet, Text, View, TextInput, Animated, Platform, TouchableOpacity} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { color } from "../assets/colors/colors";

class FloatingLabel extends Component {
    constructor(props) {
        super(props);

        let initialPadding = 9;
        let initialOpacity = 0;

        if (this.props.visible) {
            initialPadding = 5;
            initialOpacity = 1;
        }

        this.state = {
            paddingAnim: new Animated.Value(initialPadding),
            opacityAnim: new Animated.Value(initialOpacity)
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        Animated.timing(this.state.paddingAnim, {
            toValue: newProps.visible ? 5 : 9,
            duration: 230,
            useNativeDriver: false
        }).start();

        return Animated.timing(this.state.opacityAnim, {
            toValue: newProps.visible ? 1 : 0,
            duration: 230,
            useNativeDriver: false
        }).start();
    }

    render() {
        return (
            <Animated.View
                style={[styles.floatingLabel, {paddingTop: this.state.paddingAnim, opacity: this.state.opacityAnim}]}>
                {this.props.children}
            </Animated.View>
        );
    }
}

class TextFieldHolder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            marginAnim: new Animated.Value(this.props.withValue ? 20 : 0)
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        return Animated.timing(this.state.marginAnim, {
            toValue: newProps.withValue ? 20 : 0,
            duration: 230,
            useNativeDriver: false
        }).start();
    }

    render() {
        return (
            <Animated.View style={{marginTop: this.state.marginAnim}}>
                {this.props.children}
            </Animated.View>
        );
    }
}

class FloatLabelSelectField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false,
            text: this.props.value,
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
            <View style={styles.container}>
                <View style={[styles.viewContainer,this.withBorder()]}>
                    <View style={styles.paddingView}/>
                    <View style={[styles.fieldContainer]}>
                        {
                            (this.props.placeholder != "") &&
                            <FloatingLabel visible={this.state.text}>
                                <Text style={[styles.fieldLabel, this.labelStyle()]}>{this.placeholderValue()}</Text>
                            </FloatingLabel>
                        }

                        <TextFieldHolder withValue={(this.state.text && this.props.placeholder)} style={[styles.valueContainer]}>
                            <TouchableOpacity activeOpacity={1} onPress={this.onPress}>
                                <View>
                                    <Text style={[(this.state.text ? styles.valueText :  styles.valueTextPlaceHolder)]}>
                                        {this.state.text ? this.state.text  : this.props.placeholder }
                                    </Text>

                                </View>
                            </TouchableOpacity>
                        </TextFieldHolder>
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
        );
    }



    labelStyle() {
        if (this.state.focused) {
            return styles.focused;
        }
    }

    placeholderValue() {
        if (this.state.text) {
            return this.props.placeholder;
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 70,
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
        left: 0
    },
    fieldLabel: {
        height: 25,
        fontSize: 16,
        color: color.reddish
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
        color:"#333"
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