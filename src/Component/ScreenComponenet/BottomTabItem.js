import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {calcH, calcW} from '../../utils/Common';

export const tabBarIcon = name => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return <Icon name={name} size={15} color={'#fff'} />;
};
