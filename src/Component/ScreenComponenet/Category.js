import React, {Component} from 'react';
import {Text, StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import {mainColor} from '../../utils/Color';
import {calcH, calcW} from '../../utils/Common';
import {
  AspectRatio,
  Box,
  Center,
  HStack,
  Heading,
  Skeleton,
  Stack,
} from 'native-base';
import {Font} from '../../utils/font';

const CategoryComp = ({icon, subject, key, color}) => {
  return (
    <TouchableOpacity
      key={key}
      style={{
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 12,
      }}>
      <View style={styles.container}>
        <Image source={icon} style={styles.image} resizeMode="contain" />
      </View>
      <Text
        style={{textAlign: 'center', color: color, fontFamily: Font.Medium}}>
        {subject}
      </Text>
    </TouchableOpacity>
  );
};

export const SizeComp = ({size, selected, onPress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text
        style={{
          textAlign: 'center',
          color: selected ? mainColor : '#000',
          fontFamily: Font.Bold,
          fontSize: 20,
        }}>
        {size}
      </Text>
    </TouchableOpacity>
  );
};

export const ProductComp = ({icon, subject, price, key, onPress}) => {
  return (
    <TouchableOpacity
      key={key}
      onPress={onPress}
      style={{
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 12,
        backgroundColor: mainColor,
      }}>
      <View style={styles.proContainer}>
        <Image
          source={icon}
          style={{
            width: calcW(0.3),
            height: calcH(0.2),
            resizeMode: 'contain',
          }}
        />
      </View>
      <Text
        style={{textAlign: 'center', color: '#fff', fontFamily: Font.Medium}}>
        {subject}
      </Text>
      <Text
        style={{textAlign: 'center', color: '#fff', fontFamily: Font.Medium}}>
        {price}
      </Text>
    </TouchableOpacity>
  );
};

export const DiscountComp = ({icon, subject, price, key, onPress}) => {
  return (
    <TouchableOpacity
      key={key}
      onPress={onPress}
      style={{
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 12,
      }}>
      <View style={styles.proContainer}>
        <Image
          source={icon}
          style={{
            width: calcW(0.45),
            height: calcH(0.2),
          }}
          resizeMode="contain"
        />
      </View>
      <Text style={{textAlign: 'center'}}>{subject}</Text>
      {/* <Text style={{textAlign: 'center'}}>{price}</Text> */}
    </TouchableOpacity>
  );
};

export const FilterComp = ({
  icon,
  heading,
  categoryname,
  discount,
  price,
  onpress,
  key,
}) => {
  return (
    <TouchableOpacity
      key={key}
      onPress={onpress}
      style={{
        backgroundColor: '#fff',
        width: calcW(0.9),
        borderRadius: 10,
        marginTop: calcH(0.03),
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 12,
      }}>
      <View style={{flex: 0.3}}>
        <Image
          source={icon}
          alt="image"
          resizeMode={'contain'}
          style={{width: calcW(0.35), height: calcH(0.35)}}
        />
      </View>
      <View style={{flex: 0.5}}>
        <View>
          <Heading size="md" ml="-1" noOfLines={2}>
            {heading}
          </Heading>
          <Text
            fontSize="xs"
            _light={{
              color: 'violet.500',
            }}
            _dark={{
              color: 'violet.400',
            }}
            fontWeight="500"
            ml="-0.5"
            mt="-1">
            {categoryname}
          </Text>
        </View>

        <Heading size="sm" ml="-1">
          {discount}
        </Heading>
        <Text style={{color: mainColor, fontFamily: Font.Bold}}>{price}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryComp;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderColor: mainColor,
    borderWidth: 2,
    borderRadius: 100,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: calcW(0.1),
    height: calcH(0.1),
  },
  proContainer: {},
});
