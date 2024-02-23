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
import SafeView from '../../../Component/SafeView';
import {Checkbox, HStack, Icon, Input, VStack} from 'native-base';
import {calcH, calcW} from '../../../utils/Common';
import AppFormField from '../../../Component/Form/AppFormField';
import {AppForm} from '../../../Component/Form';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {Font} from '../../../utils/font';
import {useDispatch, useSelector} from 'react-redux';
import routes from '../../../Navigation/routes';
import SubmitButton from '../../../Component/Form/SubmitButton';
import {toasterr, toastr} from '../../../utils/commonToast';
import {colorSet, mainColor} from '../../../utils/Color';
import {postApiCall, getCartApicall} from '../../../Services/Network';
import HeaderComponent from '../../../Component/Header';
import {tabBarIcon} from '../../../Component/ScreenComponenet/BottomTabItem';

import {RFValue} from 'react-native-responsive-fontsize';
import HomeLoader from '../../../Component/ScreenComponenet/LoadingScreen';
import {ProfileContext} from '../../../Services/ProfileProvider';
import {assetsImages} from '../../../utils/assets';
import AppButton from '../../../Component/AppButton';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import {getcartItemdata} from '../../../reduxToolkit/slices/Cart/getCartSlice';
import {cartItemData} from '../../../reduxToolkit/slices/Cart/addCartSLice';
import {updateCartData} from '../../../reduxToolkit/slices/Cart/updateCartSlice';
import Icons from 'react-native-vector-icons/dist/AntDesign';
import {removeItemData} from '../../../reduxToolkit/slices/Cart/removeItem';

const Cart = props => {
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const {setCartCount} = useContext(ProfileContext);
  const dispatch = useDispatch();
  const {cartItemdata} = useSelector(state => state.cartItemData);

  useEffect(async () => {
    dispatch(getcartItemdata());
    const unsubscribe = props.navigation.addListener('focus', async () => {
      setLoading(true);
      await dispatch(getcartItemdata());
      setLoading(false);
    });

    return unsubscribe;
  }, []);
  useEffect(() => {
    if (cartItemdata && cartItemdata.items) {
      const updatedCardData = cartItemdata.items.map(item => ({
        ...item,
        cartQ: item.quantity.value,
      }));
      setCardData(updatedCardData);
      setCartCount(cartItemdata?.item_count);
      setTotalPrice(cartItemdata?.totals?.total);
    }
  }, [cartItemdata]);
  console.log('&&&&&&&&&&cartItem', cartItemdata);

  const addQuantityFunc = async (item, index) => {
    let tempArr = cardData;
    let temp = item;
    temp.cartQ = parseInt(item.cartQ) + 1;
    let updatedItemCount = tempArr.reduce(
      (count, currentItem) => count + parseInt(currentItem.cartQ),
      0,
    );
    tempArr[index] = temp;
    setCardData([...tempArr]);
    setCartCount(updatedItemCount);
    console.log('%%%%', cardData);
    dispatch(
      updateCartData({item_key: item.item_key, quantity: temp.cartQ}),
    ).then(res => {
      console.log('cart update', res);
      dispatch(getcartItemdata());
    });
  };

  const subQuantityFunc = (item, index) => {
    let tempArr = cardData;
    let temp = item;
    temp.cartQ = parseInt(item.cartQ) - 1;
    const updatedItemCount = tempArr.reduce((total, currentItem) => {
      return total + parseInt(currentItem.cartQ);
    }, 0);
    const updatedTotal =
      parseFloat(cartItemdata?.totals?.total) - parseFloat(item.price);

    tempArr[index] = temp;
    setCardData([...tempArr]);
    setCartCount(updatedItemCount);
    setTotalPrice(updatedTotal);
    // dispatch(cartItemData({totals: {total: updatedTotal}}));
    console.log('%%%%', cardData);
    dispatch(
      updateCartData({item_key: item.item_key, quantity: temp.cartQ}),
    ).then(res => {
      console.log('cart update', res);
      dispatch(getcartItemdata());
    });
  };

  const removeItem = async id => {
    console.log('*****', id);
    await dispatch(removeItemData(id)).then(async res => {
      // setLoading(false);
      console.log('remove item data', res);
      dispatch(getcartItemdata());
    });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colorSet.backgroundColor}}>
      <View style={{height: calcH(0.1)}}>
        <HeaderComponent
          headingName={'My Cart'}
          arrow={tabBarIcon('arrow-left')}
          onPress={() => props.navigation.goBack()}
          searchPress={() => props.navigation.navigate(routes.SearchItem)}
          navigation={props.navigation}
        />
      </View>
      <SafeView>
        <HomeLoader visible={loading} color="blue" />
        {cardData?.length > 0 &&
          cardData?.map((item, index) => {
            return (
              <View key={index} style={styles.card}>
                {/* <View style={{width: calcW(0.4)}}> */}
                <Image
                  source={
                    item.featured_image == false
                      ? {uri: assetsImages.noImage}
                      : {uri: item.featured_image}
                  }
                  style={styles.imgStyle}
                />
                {/* </View> */}
                <View style={styles.secondContainer}>
                  <Text style={styles.header}>{item.name}</Text>
                  <Text numberOfLines={2} style={styles.description}>
                    {item?.description}
                  </Text>
                  <Text
                    style={{
                      color: mainColor,
                      fontSize: RFValue(14),
                      fontFamily: Font.Bold,
                      fontWeight: '500',
                      marginTop: 10,
                    }}>
                    $ {(Number(item.price) / 100).toFixed(2)}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '48%',
                      //alignSelf: 'center',
                      justifyContent: 'space-between',
                      //backgroundColor: 'red',
                      marginTop: 10,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        subQuantityFunc(item, index);
                      }}
                      disabled={item.quantity == 1}
                      style={styles.circle2}>
                      <Image
                        source={assetsImages.Sub}
                        style={{
                          width: '100%',
                          height: '100%',
                          resizeMode: 'cover',
                        }}
                      />
                      {/* <Icons name="minus" size={20} color={colorSet.text1} /> */}
                    </TouchableOpacity>
                    <Text style={{...styles.description, top: -5}}>
                      {item?.cartQ}
                    </Text>
                    <TouchableOpacity
                      onPress={() => addQuantityFunc(item, index)}
                      style={styles.circle2}>
                      {/* <Icons name="plus" size={20} color={colorSet.text1} /> */}
                      <Image
                        source={assetsImages.Add}
                        style={{
                          width: '100%',
                          height: '100%',
                          resizeMode: 'cover',
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={{alignSelf: 'flex-start'}}
                  onPress={() => removeItem(item.item_key)}>
                  <Icons name="closecircleo" size={20} color={'#000'} />
                </TouchableOpacity>
              </View>
            );
          })}
        {cartItemdata?.items.length > 0 && (
          <View
            style={{
              width: calcW(0.95),
              backgroundColor: '#fff',
              paddingHorizontal: 20,
              paddingVertical: 20,
              alignSelf: 'center',
              marginTop: calcH(0.05),
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
            }}>
            <View style={styles.deliveryStyle}>
              <Text style={{...styles.textStyle, color: colorSet.shadegray}}>
                Delivery Fee
              </Text>
              <Text style={{...styles.textStyle, color: colorSet.text1}}>
                $
                {(Number(cartItemdata?.totals?.shipping_total) / 100).toFixed(
                  2,
                )}
              </Text>
            </View>
            <View style={styles.deliveryStyle}>
              <Text style={{...styles.textStyle, color: colorSet.shadegray}}>
                Subtotal
              </Text>
              {console.log('totallllllllllll', cartItemdata?.totals?.total)}
              <Text style={{...styles.textStyle, color: colorSet.text1}}>
                ${(Number(cartItemdata?.totals?.subtotal) / 100).toFixed(2)}
              </Text>
            </View>
            <View style={{...styles.deliveryStyle, marginTop: calcH(0.05)}}>
              <Text style={{...styles.textStyle, color: mainColor}}>Total</Text>
              <Text style={{...styles.totalTextStyle, color: colorSet.text1}}>
                ${(Number(cartItemdata?.totals?.total) / 100).toFixed(2)}
              </Text>
            </View>

            <AppButton
              onPress={() => {
                props.navigation.navigate(routes.ShippingAddress);
              }}
              title={'Proceed to payment'.toUpperCase()}
              right
              buttonStyle={{backgroundColor: mainColor}}
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
        )}
      </SafeView>
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  card: {
    width: calcW(0.95),
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: calcH(0.03),
    elevation: 1,
    paddingVertical: 10,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  imgStyle: {
    height: calcH(0.18),
    width: calcW(0.3),
    resizeMode: 'contain',
    borderRadius: 15,
  },
  secondContainer: {
    height: '100%',
    flex: 1,
    paddingHorizontal: 10,
    //backgroundColor: 'red',
  },
  header: {
    fontSize: RFValue(16),
    fontFamily: Font.Bold,
    fontWeight: '500',
    color: colorSet.text1,
  },
  description: {
    fontSize: RFValue(13),
    fontFamily: Font.Regular,
    fontWeight: '500',
    color: colorSet.shadegray,
  },
  circle: {
    height: 25,
    width: 25,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    // elevation: 1,
    // shadowColor: '#464646',
    // shadowOffset: 1,
    // borderWidth: 0.5,
    // borderColor: '#464646',
    borderWidth: 0.5,
    borderColor: '#CCCCCC',
  },
  circle2: {
    height: 50,
    width: 50,
  },
  deliveryStyle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  textStyle: {
    fontSize: RFValue(14),
    fontFamily: Font.Medium,
    fontWeight: '500',
  },
  totalTextStyle: {
    fontSize: RFValue(17),
    fontFamily: Font.Bold,
    fontWeight: '500',
  },
});
