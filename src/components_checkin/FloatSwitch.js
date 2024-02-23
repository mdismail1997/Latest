import React, {Component} from "react";
import {StyleSheet, Text, View, TextInput, Animated, Platform, Switch} from "react-native";
import { color } from "../assets/colors/colors";

class FloatingLabel extends Component {
    constructor(props) {
        super(props);

        let initialPadding = 5;
        let initialOpacity = 1;

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
            toValue: newProps.visible ? 5 : 5,
            duration: 230,
            useNativeDriver: false
        }).start();

        return Animated.timing(this.state.opacityAnim, {
            toValue: newProps.visible ? 1 : 1,
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
            marginAnim: new Animated.Value(0)
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        return Animated.timing(this.state.marginAnim, {
            toValue: 0,
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

class FloatLabelSwitchField extends Component {
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

    _handleToggleSwitch = () => {
        this.props.onPress();
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
                            <View style={{paddingTop:25, paddingBottom:5,}}>
                                <Switch
                                    onValueChange={this._handleToggleSwitch}
                                    value={this.state.text}
                                    style={{ transform: [{ scaleX: .7 }, { scaleY: .7 }] }}
                                />
                            </View>
                        </TextFieldHolder>
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
        }else return this.props.placeholder;
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 60,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    viewContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    paddingView: {

    },
    floatingLabel: {
        position: 'absolute',
        top: 0,
        left: 0
    },
    fieldLabel: {
        height: 25,
        fontSize: 15,
        color: '#9E9E9E'
    },
    fieldContainer: {
        flex: 1,
        justifyContent: 'center',
        position: 'relative'
    },
    withBorder: {
        borderBottomWidth: 1 / 2,
        borderColor: '#C8C7CC',
    },
    valueContainer:{
        height: (Platform.OS == 'ios' ? 20 : 60),
        backgroundColor:'red',
    },
    valueText: {
        /*height: (Platform.OS == 'ios' ? 20 : 60),
        fontSize: 16,
        color: '#111111',
        backgroundColor:'red'*/
        fontSize:16,
        color: color.blackish
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

export default FloatLabelSwitchField;