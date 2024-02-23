const React = require('react');
const { ViewPropTypes } = ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    View,
    Animated,
} = ReactNative;
const Button = require('./Button');
import { LinearGradient } from 'expo-linear-gradient';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { color } from '../assets/colors/colors';

const DefaultTabBar = createReactClass({
    propTypes: {
        goToPage: PropTypes.func,
        activeTab: PropTypes.number,
        tabs: PropTypes.array,
        backgroundColor: PropTypes.string,
        activeTextColor: PropTypes.string,
        inactiveTextColor: PropTypes.string,
        textStyle: Text.propTypes.style,
        tabStyle: ViewPropTypes.style,
        renderTab: PropTypes.func,
        underlineStyle: ViewPropTypes.style,

    },

    getDefaultProps() {
        return {
            activeTextColor: color.blackish,
            inactiveTextColor: color.silver,
            backgroundColor: color.lightWhite,
        };
    },

    renderTabOption(name, page) {
    },

    renderTab(name, page, isTabActive, onPressHandler) {
        const { activeTextColor, inactiveTextColor, textStyle, } = this.props;
        const textColor = isTabActive ? activeTextColor : inactiveTextColor;
        const fontWeight = isTabActive ? 'normal' : 'normal';

        return <Button
            style={{flex: 1, }}
            key={name}
            accessible={true}
            accessibilityLabel={name}
            accessibilityTraits='button'
            onPress={() => onPressHandler(page)}
        >
            <View style={[styles.tab, this.props.tabStyle, ]}>
                <Text style={[{color: textColor, fontWeight, }, textStyle, ]}>
                    {name}
                </Text>
            </View>
        </Button>;
    },

    render() {
        const containerWidth = this.props.containerWidth;
        const numberOfTabs = this.props.tabs.length;
        const tabUnderlineStyle = {
            position: 'absolute',
            width: containerWidth / numberOfTabs,
            height: 2,
            backgroundColor: color.reddish,
            bottom: 0,
        };

        const translateX = this.props.scrollValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0,  containerWidth / numberOfTabs],
        });

        return (
            <View style={[styles.tabs, {backgroundColor: this.props.backgroundColor, }, this.props.style, ]}>
                {this.props.tabs.map((name, page) => {
                    const isTabActive = this.props.activeTab === page;
                    const renderTab = this.props.renderTab || this.renderTab;
                    return renderTab(name, page, isTabActive, this.props.goToPage);
                })}
                <Animated.View
                keyboardShouldPersistTaps='always'
                    style={[
                        tabUnderlineStyle,
                        {
                            transform: [
                                { translateX },
                            ]
                        },
                        this.props.underlineStyle,
                    ]}
                />
            </View>
        );
    },
});

const styles = StyleSheet.create({

    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabs: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-around',

        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: '#ddd',

    },
});

module.exports = DefaultTabBar;
