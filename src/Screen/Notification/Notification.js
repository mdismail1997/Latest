import React, {useEffect, useState, useContext} from 'react';
import * as Yup from 'yup';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SafeView from '../../Component/SafeView';
import {Checkbox, HStack, Icon, Input} from 'native-base';
import {calcH, calcW} from '../../utils/Common';
import AppFormField from '../../Component/Form/AppFormField';
import {AppForm} from '../../Component/Form';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {Font} from '../../utils/font';
import {useDispatch, useSelector} from 'react-redux';
import routes from '../../Navigation/routes';
import SubmitButton from '../../Component/Form/SubmitButton';
import {toasterr, toastr} from '../../utils/commonToast';
import {colorSet, mainColor} from '../../utils/Color';
import {postApiCall, getCartApicall} from '../../Services/Network';
import HeaderComponent from '../../Component/Header';
import {tabBarIcon} from '../../Component/ScreenComponenet/BottomTabItem';

import {RFValue} from 'react-native-responsive-fontsize';
import HomeLoader from '../../Component/ScreenComponenet/LoadingScreen';
import {ProfileContext} from '../../Services/ProfileProvider';
import {assetsImages} from '../../utils/assets';
import AppButton from '../../Component/AppButton';

const Notification = props => {
  const noticationData = [
    {
      id: 1,
      name: 'Mast & Harbour',
      profile_image: require('../../../Assets/images/user.png'),
      rating: 4,
      reviewText: 'Solid a line Dress',
    },
    {
      id: 2,
      name: 'Mast & Harbour',
      profile_image: require('../../../Assets/images/user.png'),
      rating: 4.5,
      reviewText: 'Solid a line Dress',
    },
    {
      id: 3,
      name: 'Mast & Harbour',
      profile_image: require('../../../Assets/images/user.png'),
      rating: 4.5,
      reviewText: 'Solid a line Dress',
    },
    {
      id: 4,
      name: 'Mast & Harbour',
      profile_image: require('../../../Assets/images/user.png'),
      rating: 4.5,
      reviewText: 'Solid a line Dress',
    },
    {
      id: 5,
      name: 'Jhon Doe',
      profile_image: require('../../../Assets/images/user.png'),
      rating: 4.5,
      reviewText: 'Solid a line Dress',
    },
  ];
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('All');
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colorSet.backgroundColor}}>
      <View style={{height: calcH(0.1)}}>
        <HeaderComponent
          headingName={'Notifications'}
          arrow={tabBarIcon('arrow-left')}
          onPress={() => props.navigation.goBack()}
          searchPress={() => props.navigation.navigate(routes.SearchItem)}
          navigation={props.navigation}
        />
      </View>
      <SafeView style={{paddingHorizontal: 10}}>
        <View
          style={{
            width: calcW(0.45),
            marginBottom: calcH(0.01),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => setCategory('All')}
            style={[
              styles.categoryButton,
              category == 'All'
                ? {backgroundColor: mainColor}
                : {
                    backgroundColor: colorSet.backgroundColor,
                    borderColor: colorSet.white,
                  },
            ]}>
            <Text
              style={[
                styles.categoryText,
                category == 'All'
                  ? {color: colorSet.text1}
                  : {color: colorSet.white},
              ]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCategory('Mentions')}
            style={[
              styles.categoryButton,
              category == 'Mentions'
                ? {backgroundColor: mainColor}
                : {
                    backgroundColor: colorSet.backgroundColor,
                    borderColor: colorSet.white,
                  },
            ]}>
            <Text
              style={[
                styles.categoryText,
                category == 'Mentions'
                  ? {color: colorSet.text1}
                  : {color: colorSet.white},
              ]}>
              Mentions
            </Text>
          </TouchableOpacity>
        </View>
        {noticationData.map((item, index) => {
          return (
            <View key={index} style={styles.notificationCard}>
              <View
                style={{
                  flexDirection: 'row',
                  // backgroundColor: 'red',
                  width: '85%',
                }}>
                <Image
                  source={item.profile_image}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 100,
                  }}
                  resizeMode="cover"
                />

                <View
                  style={{
                    marginLeft: calcW(0.02),
                    // marginTop: calcH(0.011),
                    width: '85%',
                    // backgroundColor: 'red',
                    alignItems: 'flex-start',
                  }}>
                  <Text
                    style={{
                      fontSize: RFValue(18),
                      color: colorSet.white,
                      fontFamily: Font.Bold,
                      fontWeight: '500',
                    }}>
                    {item.name}
                  </Text>

                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: RFValue(14),
                      color: colorSet.white,
                      fontFamily: Font.Regular,
                      fontWeight: '300',
                    }}>
                    {item.reviewText}
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  fontSize: RFValue(14),
                  fontFamily: Font.Regular,
                  color: colorSet.white,
                  fontWeight: '400',
                }}>
                10:30
              </Text>
            </View>
          );
        })}
      </SafeView>
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  notificationCard: {
    width: '100%',
    backgroundColor: colorSet.backgroundColor,
    marginBottom: calcH(0.02),
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderBottomColor: colorSet.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: 80,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 2,
  },
  categoryText: {
    fontSize: RFValue(14),
    fontFamily: Font.Regular,

    fontWeight: '400',
  },
});
