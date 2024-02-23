import React from 'react';
import {Text, StyleSheet, View, Animated} from 'react-native';
import {mainColor} from '../utils/Color';

const Dots = ({data, dotPosition}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {data.map((item, index) => {
        const opacity = dotPosition.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={`dot-${index}`}
            style={{
              borderRadius: 5,
              marginHorizontal: 5,
              height: 10,
              width: 10,
              opacity,
              backgroundColor: mainColor,
            }}
          />
        );
      })}
    </View>
  );
};

export default Dots;
