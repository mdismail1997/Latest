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
import {checkoutData} from '../../reduxToolkit/slices/Product/checkoutSlice';
import {clearcartItemdata} from '../../reduxToolkit/slices/Cart/deleteCartSlice';

const ShippingAddress = props => {
  const {cartItemdata} = useSelector(state => state.cartItemData);
  const {token, profileContextData, setToken, setProfileContextData} =
    useContext(ProfileContext);
  const AddressData = [
    {
      id: 1,
      type: 'Home',
      address: '152 Gulsan Road, NY',
      phone: '(125) 1458796554',
    },
    {
      id: 2,
      type: 'Office',
      address: '223 Hilton Road, NY',
      phone: '(125) 585879655',
    },
  ];
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(AddressData[0]);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const paymentMethodFunc = type => {
    setPaymentMethod(type);
  };
  const dispatch = useDispatch();
  const checkoutFunc = async () => {
    console.log('cart dattttaaaa', cartItemdata.customer);
    console.log('profile data', profileContextData);
    const data = {
      cart_key: cartItemdata.cart_key,
      billing_first_name: profileContextData.first_name,
      billing_last_name: profileContextData.last_name,
      billing_address_1:
        cartItemdata.customer.billing_address.billing_address_1,
      billing_city: cartItemdata.customer.billing_address.billing_city,
      billing_state: cartItemdata.customer.billing_address.billing_state,
      billing_postcode: cartItemdata.customer.billing_address.billing_postcode,
      billing_country: cartItemdata.customer.billing_address.billing_country,
      billing_email: profileContextData.email,
      billing_phone: profileContextData.phone_number,
      shipping_first_name:
        cartItemdata.customer.shipping_address.shipping_first_name,
      shipping_last_name:
        cartItemdata.customer.shipping_address.shipping_last_name,
      shipping_address_1:
        cartItemdata.customer.shipping_address.shipping_address_1,
      shipping_city: cartItemdata.customer.shipping_address.shipping_city,
      shipping_state: cartItemdata.customer.shipping_address.shipping_state,
      shipping_postcode:
        cartItemdata.customer.shipping_address.shipping_postcode,
      shipping_country: cartItemdata.customer.shipping_address.shipping_country,
    };
    console.log('checkout post data', data);
    setLoading(true);
    await dispatch(checkoutData(data)).then(async res => {
      console.log('checkout data', res);
      setLoading(false);
      if (res.payload.status == 'processing' || 'completed') {
        //   await AsyncStorage.setItem(TOKEN, res.payload.token);
        //   setToken(res.payload.token);
        await dispatch(clearcartItemdata());
        props.navigation.navigate(routes.PaymentSuccess);
      } else {
        console.log('routing is not done');
      }
    });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colorSet.backgroundColor}}>
      <View style={{height: calcH(0.1)}}>
        <HeaderComponent
          headingName={'Shipping Address'}
          arrow={tabBarIcon('arrow-left')}
          onPress={() => props.navigation.goBack()}
          searchPress={() => props.navigation.navigate(routes.SearchItem)}
          navigation={props.navigation}
        />
      </View>
      <SafeView>
        <HomeLoader visible={loading} color="blue" />
        {AddressData.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                width: calcW(0.88),
                alignSelf: 'center',
                backgroundColor: colorSet.white,
                borderRadius: 10,
                // height: 150,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 15,
                paddingVertical: calcH(0.03),
                marginBottom: calcH(0.02),
              }}>
              <View
                style={{
                  width: 22,
                  height: 22,
                  marginTop: calcH(0.01),
                }}>
                <CustomRadio
                  onPress={() => setSelectedAddress(item)}
                  status={selectedAddress.id == item.id}
                />
              </View>
              <View style={{width: '80%', padding: 5}}>
                <Text
                  style={{
                    ...styles.addressTypeTextStyle,
                    color:
                      selectedAddress.id == item.id
                        ? mainColor
                        : colorSet.text1,
                  }}>
                  {item.type}
                </Text>
                <Text
                  style={{
                    ...styles.addressTextStyle,
                    color:
                      selectedAddress.id == item.id
                        ? mainColor
                        : colorSet.shadegray,
                  }}>
                  {item.phone}
                </Text>
                <Text
                  numberOfLines={3}
                  style={{
                    ...styles.addressTextStyle,
                    color:
                      selectedAddress.id == item.id
                        ? mainColor
                        : colorSet.shadegray,
                  }}>
                  {item.address}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  width: 20,
                  height: 20,
                }}>
                <Image
                  source={
                    selectedAddress.id == item.id
                      ? assetsImages.activePen
                      : assetsImages.inactivePen
                  }
                  style={{height: '100%', width: '100%', resizeMode: 'cover'}}
                />
              </TouchableOpacity>
            </View>
          );
        })}

        <View
          style={{
            width: calcW(0.88),
            backgroundColor: colorSet.white,
            paddingHorizontal: 15,
            paddingVertical: calcH(0.03),
            alignSelf: 'center',
            borderRadius: 10,
            elevation: 1,
          }}>
          <Text
            style={[styles.deliveryText, {color: colorSet.backgroundColor}]}>
            Free Delivery: <Text style={{color: mainColor}}>29 August</Text>
          </Text>
          <Text style={[styles.detailsText, {color: colorSet.text1}]}>
            on orders dispatched by market2store over$599.
          </Text>
          <Text
            style={[
              styles.detailsText,
              {color: colorSet.backgroundColor, marginVertical: 5},
            ]}>
            Details
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginVertical: calcH(0.02),
              paddingVertical: 5,
            }}>
            <Image
              source={assetsImages.location}
              style={{
                height: 30,
                width: 30,
                resizeMode: 'contain',
                //tintColor: colorSet.white,
              }}
            />
            <View style={{marginLeft: 10}}>
              <Text
                style={[
                  styles.deliveryText,
                  {color: colorSet.backgroundColor},
                ]}>
                Delivering to Kolkata 700075.
              </Text>
              <Text style={[styles.deliveryText, {color: mainColor}]}>
                Sign in to update.
              </Text>
            </View>
          </View>
          <Divider
            my="2"
            _light={{
              bg: 'muted.800',
            }}
            _dark={{
              bg: 'muted.50',
            }}
          />
          <Text
            style={[styles.deliveryText, {color: colorSet.backgroundColor}]}>
            Payment Method
          </Text>

          <TouchableOpacity
            onPress={() => paymentMethodFunc('Card')}
            disabled={true}
            style={{
              ...styles.paymentStyle,
              backgroundColor:
                paymentMethod == 'Card'
                  ? colorSet.backgroundColor
                  : colorSet.white,
            }}>
            <Text
              style={{
                ...styles.deliveryText,
                color: paymentMethod == 'Card' ? colorSet.white : colorSet.baba,
              }}>
              Credit / Debit / ATM
            </Text>

            <CustomRadio status={paymentMethod == 'Card'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => paymentMethodFunc('NetBanking')}
            disabled={true}
            style={{
              ...styles.paymentStyle,
              backgroundColor:
                paymentMethod == 'NetBanking'
                  ? colorSet.backgroundColor
                  : colorSet.white,
            }}>
            <Text
              style={{
                ...styles.deliveryText,
                color:
                  paymentMethod == 'NetBanking'
                    ? colorSet.white
                    : colorSet.baba,
              }}>
              Net Banking
            </Text>
            <CustomRadio status={paymentMethod == 'NetBanking'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => paymentMethodFunc('Wallet')}
            disabled={true}
            style={{
              ...styles.paymentStyle,
              backgroundColor:
                paymentMethod == 'Wallet'
                  ? colorSet.backgroundColor
                  : colorSet.white,
            }}>
            <Text
              style={{
                ...styles.deliveryText,
                color:
                  paymentMethod == 'Wallet' ? colorSet.white : colorSet.baba,
              }}>
              Wallet / UPI
            </Text>

            <CustomRadio status={paymentMethod == 'Wallet'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => paymentMethodFunc('Cash')}
            style={{
              ...styles.paymentStyle,
              backgroundColor:
                paymentMethod == 'Cash'
                  ? colorSet.backgroundColor
                  : colorSet.white,
            }}>
            <Text
              style={{
                ...styles.deliveryText,
                color:
                  paymentMethod == 'Cash' ? colorSet.white : colorSet.text1,
              }}>
              Cash on Delivery
            </Text>
            <CustomRadio status={paymentMethod == 'Cash'} />
          </TouchableOpacity>

          <AppButton
            loading={loading}
            onPress={() => checkoutFunc()}
            title={'Proceed to payment'.toUpperCase()}
            right
            buttonStyle={{backgroundColor: mainColor, marginTop: 30}}
            icon={
              <Image
                source={assetsImages.arrowRight}
                style={{
                  width: 20,
                  height: 10,
                  resizeMode: 'cover',
                  marginLeft: 7,
                }}
              />
            }
          />
        </View>
      </SafeView>
    </SafeAreaView>
  );
};

export default ShippingAddress;

const styles = StyleSheet.create({
  addressTypeTextStyle: {
    fontSize: RFValue(18),
    fontFamily: Font.Bold,
    fontWeight: 'bold',
  },
  addressTextStyle: {
    fontSize: RFValue(13),
    fontFamily: Font.Regular,
    fontWeight: '400',
  },
  deliveryText: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    fontFamily: Font.Bold,
  },
  detailsText: {
    fontSize: RFValue(13),
    fontWeight: '400',
    fontFamily: Font.Regular,
  },
  paymentStyle: {
    width: '100%',
    height: 50,

    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: calcH(0.02),
    borderWidth: 1,
    borderColor: colorSet.primarycolor,
    //elevation: 0.2,
    borderRadius: 7,
    paddingHorizontal: calcW(0.03),
  },
  paymentText: {},
});
