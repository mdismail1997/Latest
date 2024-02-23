import React from 'react';
import {StyleSheet} from 'react-native';
import AppText from '../AppText.js';
import {calcW} from '../../utils/Common.js';

const ErrorMessage = ({error, visible}) => {
  if (!visible || !error) return null;
  if (error !== undefined) {
    return <AppText style={styles.error}>{error}</AppText>;
  }
};

export default ErrorMessage;

const styles = StyleSheet.create({
  error: {color: 'red', fontSize: calcW(0.04)},
});
