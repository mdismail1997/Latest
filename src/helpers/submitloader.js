
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
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    //position: 'absolute',
    //top: 0,
    //bottom: 0,
    //left: 0,
    //right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgba(0,0,0,0.7)',
    height:100,
    width:120,
    borderRadius:10
  },
  textContainer: {
    flex: 1,
    top: 0,
    bottom: 20,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute'
  },
  textContent: {
    top: 50,
    height: 50,
    fontSize: 20,
    fontWeight: 'bold'
  },
  Indicator:{
    flex: 1,
    top: 0,
    bottom: 20,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute'
  }
});

const SIZES = ['small', 'normal', 'large'];

export default class SubmitLoader extends React.Component {

  constructor(props) {
    super(props);
    //this.state = { visible: this.props.visible, textContent: this.props.textContent };
  }

  state = {
    visible: this.props.visible,
    textContent: this.props.textContent
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
    overlayColor: 'rgba(0, 0, 0, 0.25)'
  };

  close() {
    this.setState({ visible: false });
  }


  _handleOnRequestClose() {
    if (this.props.cancelable) {
      this.close();
    }
  }

  _renderDefaultContent() {
    if(typeof(this.props.physical) != 'undefined'){
      return(
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor:'rgba(0,0,0,0.7)',  width:350,height:140}}>
        <ActivityIndicator
          color={this.props.color}
          size={this.props.size}
          style={styles.Indicator}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.textContent, {color:'#fff', fontSize:13}]}>{this.state.textContent}</Text>
        </View>
      </View>);
    
    }else{
      return (
      
      <View style={styles.background}>
        <ActivityIndicator
          color={this.props.color}
          size={this.props.size}
          style={styles.Indicator}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.textContent, this.props.textStyle]}>{this.state.textContent}</Text>
        </View>
      </View>);
    }
    
  }

  _renderSpinner() {
    //const { visible } = this.state;

    if (!this.state.visible)
      return (
        <View display="none" />
      );

    const spinner = (
      <View style={[
        styles.container,
        
      ]} key={`spinner_${Date.now()}`}>
        {this.props.children ? this.props.children : this._renderDefaultContent()}
      </View>
    );

    return (
      <Modal
        onRequestClose={() => this._handleOnRequestClose()}
        supportedOrientations={['landscape', 'portrait']}
        transparent
        visible={this.state.visible}>
        {spinner}
      </Modal>
    );

  }

  render() {
    return this._renderSpinner();
  }

}
