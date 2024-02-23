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
import {
  Checkbox,
  HStack,
  Icon,
  Input,
  VStack,
  Skeleton,
  Divider,
} from 'native-base';
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
import CustomRadio from '../../Component/CustomRadio';

const PaymentSuccess = props => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colorSet.backgroundColor}}>
      <View style={{height: calcH(0.1)}}>
        <HeaderComponent
          headingName={'Order Success'}
          arrow={tabBarIcon('arrow-left')}
          onPress={() => props.navigation.goBack()}
          searchPress={() => props.navigation.navigate(routes.SearchItem)}
          navigation={props.navigation}
        />
      </View>
      <SafeView style={{alignItems: 'center'}}>
        <Image
          source={assetsImages.ordersuccess}
          style={{
            height: calcH(0.35),
            width: calcW(0.75),
            resizeMode: 'contain',
            tintColor: '#fff',
          }}
        />
        <AppButton
          onPress={() => props.navigation.navigate(routes.Home)}
          title={'Back to home'.toUpperCase()}
          buttonStyle={{backgroundColor: mainColor, marginTop: 30}}
        />
      </SafeView>
    </SafeAreaView>
  );
};

export default PaymentSuccess;

const styles = StyleSheet.create({});
