import React, {Component} from 'react';
import {Text, StyleSheet, View, TextInput} from 'react-native';
import {Input, FormControl} from 'native-base';
import {calcH, calcW} from '../utils/Common';
import {Font} from '../utils/font';
import {colorSet, mainColor} from '../utils/Color';

const TextInput2 = ({
  label,
  placeholder,
  keyboardType,
  onChangeText,
  value,
  InputRightElement,
  onBlur,
  secureTextEntry,
  isRequired,
  ...otherProps
}) => {
  return (
    <>
      <FormControl isRequired={isRequired}>
        <FormControl.Label _text={styles.placeholderTitle}>
          {label}
        </FormControl.Label>
        <Input
          onBlur={onBlur}
          secureTextEntry={secureTextEntry}
          InputRightElement={InputRightElement}
          keyboardType={keyboardType}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          color={'#fff'}
        />
      </FormControl>
    </>
  );
};

export default TextInput2;

const styles = StyleSheet.create({
  placeholderTitle: {
    fontFamily: Font.Bold,
    fontSize: calcW(0.05),
    color: '#fff',
  },
});
