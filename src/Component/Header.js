import {View, StyleSheet, TouchableOpacity, Text, Image} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons.js';
import {assetsIcon} from '../utils/assets.js';
import {calcH, calcW} from '../utils/Common.js';
import {Heading, Input} from 'native-base';
import {Font} from '../utils/font.js';
import routes from '../Navigation/routes.js';
import {Badge} from 'native-base';
import {mainColor} from '../utils/Color.js';
import {ProfileContext} from '../Services/ProfileProvider.js';

const theme = {
  colors: {
    primary: '#fff',
    background: '#fff',
  },
};

const HeaderComponent = ({
  headingName,
  icon,
  search,
  onPress,
  bellOnPress,
  cartPress,
  searchPress,
  img,
  value,
  onChangeText,
  navigation,
}) => {
  const {cartCount} = useContext(ProfileContext);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: 'row',
          //justifyContent: 'space-between',
          alignItems: 'center',
          flex: 0.6,
          // backgroundColor: 'red',
        }}>
        {img ? (
          <Image source={icon} style={styles.icon} />
        ) : (
          <Icon name={'arrow-left'} size={20} color={'#fff'} />
        )}

        <Text
          style={{
            color: '#fff',
            fontFamily: Font.Bold,
            fontSize: calcW(0.055),
            marginLeft: 15,
          }}>
          {headingName}
        </Text>
      </TouchableOpacity>
      {search ? (
        <View style={{flex: 1, right: calcW(0.1)}}>
          <Input
            variant="underlined"
            value={value}
            onChangeText={onChangeText}
            style={styles.searchBox}
            placeholder="Search For Brands & Products"
          />
        </View>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flex: 0.32,
        }}>
        <TouchableOpacity onPress={searchPress}>
          <Image source={assetsIcon.search} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate(routes.Cart)}>
          {cartCount != 0 && (
            <Badge
              colorScheme={'warning'}
              //style={{width: 10, height: 10, borderRadius: 100}}
              // size={26}
              rounded="full"
              mb={-4}
              mr={-4}
              zIndex={1}
              variant="solid"
              alignSelf="flex-end"
              _text={{
                fontSize: 12,
              }}>
              {cartCount}
            </Badge>
          )}
          <Image source={assetsIcon.cart} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate(routes.Notification)}>
          <Image source={assetsIcon.bell} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    paddingHorizontal: 15,
    flex: 1,

    shadowColor: '#064681',
    borderBottomWidth: 0.5,
    borderColor: '#F6F6F6',
    elevation: 2,
    // height: calcH(0.08),
  },
  icon: {
    height: calcH(0.04),
    width: calcW(0.04),
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  searchBox: {
    flex: 1,
    color: '#fff',
  },
  //   headerIcon: {
  //     left: SIZES.paddingLeft,
  //     alignItems: 'flex-start',
  //   },
  //   clear: {color: COLORS.hyperLink2, right: SIZES.paddingLeft},
});

export default HeaderComponent;
