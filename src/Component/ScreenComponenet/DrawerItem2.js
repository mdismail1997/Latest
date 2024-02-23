import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity, Image} from 'react-native';

import {calcH, calcW} from '../../utils/Common';
import {Font} from '../../utils/font';

const DrawerItem2 = ({onPress, icon, menuName, color}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <Image
        source={icon}
        style={{
          height: 20,
          width: 20,
          marginEnd: calcW(0.05),
          tintColor: color,
          resizeMode: 'contain',
        }}
      />
      <Text style={{color: color, fontFamily: Font.Medium}}>{menuName}</Text>
    </TouchableOpacity>
  );
};

export default DrawerItem2;

const styles = StyleSheet.create({
  item: {flexDirection: 'row', marginBottom: calcH(0.05), padding: 3},
});
