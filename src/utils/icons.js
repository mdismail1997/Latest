import React from 'react';
import {Image, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {COLORS} from '../constants/';

const AppIcon = ({
  name,
  size = 20,
  backgroundColor = '#5B7DC2',
  iconColor = '#fff',
  style,
}) => {
  return (
    <MaterialCommunityIcons name={name} color={iconColor} size={size * 0.5} />
  );
};

export default AppIcon;
