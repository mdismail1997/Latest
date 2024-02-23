import React, {Component} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {mainColor} from './Color';

var hud;

class Hud extends Component {
  constructor() {
    super();
    this.state = {
      visibility: false,
      msg: '',
    };
    hud = this;
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    this.setState({visibility: nextProps.visibility});
  }

  static setHud(ref) {
    hud = ref;
  }

  static toggleHud() {
    hud.setState({
      visibility: !hud.state.isVisible,
    });
  }

  static showHud() {
    hud.setState({
      visibility: true,
    });
  }

  static hideHud() {
    hud.setState({
      visibility: false,
    });
  }

  render() {
    if (!this.state.visibility) return null;
    return (
      <View style={styles.container} zIndex={500}>
        {console.log('fhdrfh')}
        <ActivityIndicator size="large" color={mainColor} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 500,
  },
  loader: {
    width: 80,
    height: 80,
    zIndex: 500,
  },
  loadingText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    paddingVertical: 12,
  },
});

export default Hud;
