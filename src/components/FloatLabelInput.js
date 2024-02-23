import React, {Component} from "react";
import {StyleSheet, Text, View, TextInput, Animated, Platform} from "react-native";
import { color } from "../assets/colors/colors";

class FloatingLabel extends Component {
    constructor(props) {
        super(props);

        let initialPadding = 9;
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
            marginAnim: new Animated.Value(15)
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        return Animated.timing(this.state.marginAnim, {
            toValue: newProps.withValue ? 10 : 0,
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

class FloatLabelTextField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false,
            text: this.props.value
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

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.viewContainer,this.withBorder()]}>
                    <View style={styles.paddingView}/>
                    <View style={[styles.fieldContainer]}>
                        <FloatingLabel visible={this.state.text}>
                            <Text style={[styles.fieldLabel, this.labelStyle()]}>{this.placeholderValue()}</Text>
                        </FloatingLabel>
                        <TextFieldHolder withValue={this.state.text}>
                            <Text style={{paddingTop:15,paddingBottom:5,}} >{this.state.text}</Text>
                        </TextFieldHolder>
                    </View>
                </View>
            </View>
        );
    }

    inputRef() {
        return this.refs.input;
    }

    focus() {
        this.inputRef().focus();
    }

    blur() {
        this.inputRef().blur();
    }

    isFocused() {
        return this.inputRef().isFocused();
    }

    clear() {
        this.inputRef().clear();
    }

    setFocus() {
        this.setState({
            focused: true
        });
        try {
            return this.props.onFocus();
        } catch (_error) {
        }
    }

    unsetFocus() {
        this.setState({
            focused: false
        });
        try {
            return this.props.onBlur();
        } catch (_error) {
        }
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

    setText(value) {
        this.setState({
            text: value
        });
        try {
            return this.props.onChangeTextValue(value);
        } catch (_error) {
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        color: '#8e8e8e'
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
    valueText: {
        height: (Platform.OS == 'ios' ? 20 : 60),
        fontSize: 16,
        color: color.dark
    },
    focused: {
        color: color.reddish
    }
});

export default FloatLabelTextField;