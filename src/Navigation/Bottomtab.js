import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import BottomTabItem from '../Component/ScreenComponenet/BottomTabItem';
import {colorSet} from '../utils/Color';

const Bottomtab = () => {
  return (
    <View style={styles.container}>
      <BottomTabItem name={'pentagon-outline'} menuName={'Home'} />
      <BottomTabItem name={'shopping-outline'} menuName={'Shopping'} />
      <BottomTabItem name={'card-search-outline'} menuName={'Search'} />
      <BottomTabItem name={'account-box-outline'} menuName={'Account'} />
    </View>
  );
};

export default Bottomtab;
const styles = StyleSheet.create({
  container: {
    flex: 0.1,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colorSet.backgroundColor,
  },
});
