import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Font} from '../utils/font';
import {calcW} from '../utils/Common';

const AppText = ({children, style, ...otherProps}) => {
  return (
    <View style={{padding: 8}}>
      <Text style={[styles.text, style]} {...otherProps}>
        {children}
      </Text>
    </View>
  );
};

export default AppText;

const styles = StyleSheet.create({
  text: {
    color: '#000',
    fontSize: calcW(0.03),
    fontFamily: Platform.OS === 'android' ? Font.Medium : 'Avenir',
    //textAlign: 'center',
  },
});
