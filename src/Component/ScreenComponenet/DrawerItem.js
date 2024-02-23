import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {calcH, calcW} from '../../utils/Common';
import {Font} from '../../utils/font';

const DrawerItem = ({onPress, name, menuName}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <Icon
        name={name}
        size={20}
        color={'#fff'}
        style={{marginEnd: calcW(0.05)}}
      />
      <Text style={{color: '#fff', fontFamily: Font.Medium}}>{menuName}</Text>
    </TouchableOpacity>
  );
};

export default DrawerItem;

const styles = StyleSheet.create({
  item: {flexDirection: 'row', marginBottom: calcH(0.05), padding: 3},
});
