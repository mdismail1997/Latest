import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
export const screenHeight = Dimensions.get('window').height;
export const screenWidth = Dimensions.get('window').width;

export const calcH = heightInPixel => {
  return screenHeight * heightInPixel;
};
export const calcW = widthInPixel => {
  return screenWidth * widthInPixel;
};
