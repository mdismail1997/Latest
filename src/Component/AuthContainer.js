import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {calcH, calcW} from '../utils/Common';
import LinearGradient from 'react-native-linear-gradient';
import {colorSet} from '../utils/Color';
import HeaderComponent from './Header';
import {tabBarIcon} from './ScreenComponenet/BottomTabItem';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {Font} from '../utils/font';
import {assetsIcon} from '../utils/assets';

const AuthContainer = ({
  title,
  subtitle,
  children,
  style,
  header,
  img,
  icons,
  headerName,
  searchPress,
  bellOnPress,
  onPress,
}) => {
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <LinearGradient
        colors={['#fff', '#064681', '#fff']}
        style={styles.linearGradient}>
        {header ? (
          <View
            style={{
              flex: 1,
              padding: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={onPress}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                flex: 0.6,
              }}>
              <Icon name={'arrow-left'} size={22} color={'#000'} />

              <Text
                style={{
                  color: '#000',
                  fontFamily: Font.Bold,
                  fontSize: calcW(0.05),
                }}>
                {headerName}
              </Text>
            </TouchableOpacity>
            {!icons ? (
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
                <TouchableOpacity
                // onPress={cartPress}
                >
                  <Image source={assetsIcon.cart} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={bellOnPress}>
                  <Image source={assetsIcon.bell} style={styles.icon} />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        ) : null}
        <View style={styles.mainContainer}>
          <View style={styles.titlecontainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          <View style={[styles.view, style]}>{children}</View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default AuthContainer;

const styles = StyleSheet.create({
  mainContainer: {
    // backgroundColor: 'red',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'DMSans-Bold',
    fontSize: calcW(0.08),
    marginBottom: calcH(0.015),
    color: '#000',
  },
  subtitle: {
    fontFamily: 'DMSans-Regular',
    fontSize: calcW(0.035),
    fontWeight: '600',
    color: '#000',
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  titlecontainer: {
    marginBottom: calcH(0.06),
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    backgroundColor: colorSet.backgroundColor,

    flex: 1,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    elevation: 5,
    shadowColor: '#064681',
  },
  view: {
    flex: 1,
    backgroundColor: colorSet.backgroundColor,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    //marginTop: calcH(0.08),
  },
  icon: {
    height: calcH(0.045),
    width: calcW(0.045),
    resizeMode: 'contain',
    tintColor: '#000',
  },
});
