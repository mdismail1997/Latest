import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {mainColor} from '../utils/Color';
import {Font} from '../utils/font';

const AppButton2 = ({
  title,
  onPress,
  buttonStyle,
  textStyle,
  icon,
  loading,
  right,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, {...buttonStyle}]}
      onPress={onPress}>
      {right ? (
        <>
          {loading ? (
            <ActivityIndicator size="small" color={mainColor} />
          ) : (
            <Text style={[styles.text, {...textStyle}]}>{title}</Text>
          )}
          {icon ?? icon}
        </>
      ) : (
        <>
          {icon ?? icon}
          {loading ? (
            <ActivityIndicator size="small" color={'#064681'} />
          ) : (
            <Text style={[styles.text, {...textStyle}]}>{title}</Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: mainColor,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    width: '100%',
    marginVertical: 10,
    flexDirection: 'row',
  },
  text: {
    color: mainColor,
    fontSize: 15,
    //textTransform: 'uppercase',
    // fontWeight: 'bold',
    fontFamily: Font.Bold,
    // ...FONTS.title_re,
  },
});

export default AppButton2;
