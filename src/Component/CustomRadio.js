import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {colorSet, mainColor} from '../utils/Color';
import {useFormikContext} from 'formik';

const CustomRadio = props => {
  return (
    <TouchableOpacity
      name={props.name}
      onPress={props.onPress}
      style={{...styles.radioStyle, ...props.style}}>
      {props.status && (
        <View
          style={{
            width: '60%',
            height: '60%',
            backgroundColor: mainColor,
          }}
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomRadio;

const styles = StyleSheet.create({
  radioStyle: {
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#fff',
    //backgroundColor: colorSet.lightYellow,
    marginHorizontal: 5,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: mainColor,
  },
});
