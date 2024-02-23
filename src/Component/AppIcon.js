import React from 'react';
import {Image, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../constants/';

const AppIcon = ({
  name,
  size = 40,
  backgroundColor = '#5B7DC2',
  iconColor = '#fff',
  style,
}) => {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
        },
        {...style},
      ]}>
      <MaterialCommunityIcons name={name} color={iconColor} size={size * 0.5} />
      {/* <Image
        source={name}
        style={{
          alignSelf: 'center',
          width: size - 10,
          height: size - 10,
          resizeMode: 'contain',
          backgroundColor: COLORS.transparent,
        }}
      /> */}
    </View>
  );
};

export default AppIcon;
