
//     react-native-loading-spinner-overlay
//     Copyright (c) 2016- Nick Baugh <niftylettuce@gmail.com>
//     MIT Licensed

// * Author: [@niftylettuce](https://twitter.com/#!/niftylettuce)
// * Source:
// <https://github.com/niftylettuce/react-native-loading-spinner-overlay>

// # react-native-loading-spinner-overlay
//
// <https://github.com/facebook/react-native/issues/2501>
// <https://rnplay.org/apps/1YkBCQ>
// <https://github.com/facebook/react-native/issues/2501>
// <https://github.com/brentvatne/react-native-overlay>
//

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  textContent: {
    fontSize: 16
  }
});

const SIZES = ['small', 'normal', 'large'];

export default class Spinner extends React.Component {

  constructor(props) {
    super(props);

    this.state = { visible: this.props.visible, textContent: this.props.textContent };
  }

  static propTypes = {
    visible: PropTypes.bool,
    cancelable: PropTypes.bool,
    textContent: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.oneOf(SIZES),
    overlayColor: PropTypes.string
  };

  static defaultProps = {
    visible: false,
    cancelable: false,
    textContent: '',
    color: 'white',
    size: 'large', // 'normal',
    overlayColor: 'transparent'
  };

  close() {
    this.setState({ visible: false });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { visible, textContent } = nextProps;
    this.setState({ visible, textContent });
  }

  _handleOnRequestClose() {
    if (this.props.cancelable) {
      this.close();
    }
  }

  _renderDefaultContent() {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          color={this.props.color}
          size={this.props.size}

        />
      </View>
    );
  }

  _renderSpinner() {
    const { visible } = this.state;

    if (!visible)
    {
      return (
        <View style={styles.textContainer}>
          <Text style={[styles.textContent, this.props.textStyle]}>{this.state.textContent}</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <ActivityIndicator
          color={this.props.color}
          size={this.props.size}
        />
      </View>
    );

  }

  render() {
    return this._renderSpinner();
  }

}
