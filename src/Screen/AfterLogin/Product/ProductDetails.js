import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {AppButton, SafeView} from '../../../Component';
import HeaderComponent from '../../../Component/Header';
import {tabBarIcon} from '../../../Component/ScreenComponenet/BottomTabItem';
import {useDispatch, useSelector} from 'react-redux';
import {getProductDetailsdata} from '../../../reduxToolkit/slices/Product/productDetailsSlice';
import {AspectRatio, Box, Center, HStack, Image, VStack} from 'native-base';
import {calcH, calcW} from '../../../utils/Common';
import {Font} from '../../../utils/font';
import {assetsImages} from '../../../utils/assets';
import {SizeComp} from '../../../Component/ScreenComponenet/Category';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import routes from '../../../Navigation/routes';
import HomeLoader from '../../../Component/ScreenComponenet/LoadingScreen';
import {colorSet, mainColor} from '../../../utils/Color';
import {cartItemData} from '../../../reduxToolkit/slices/Cart/addCartSLice';
import {WishlistItemData} from '../../../reduxToolkit/slices/Wishlist/addWishlistSlice';

const ProductDetails = props => {
  const {productDetailsdata, loading} = useSelector(
    state => state.productDetailsData,
  );

  const dispatch = useDispatch();
  useEffect(() => {
    //
    dispatch(getProductDetailsdata(props.route.params.data));
  }, [dispatch]);
  console.log('====productDetailsdata===>', productDetailsdata);

  const [selectedSize, setSelectedSize] = useState(null);

  const selectSize = size => {
    setSelectedSize(size);
    props.navigation.navigate(routes.SizeDetails);
  };

  const addCartItem = () => {
    // setLoading(true);
    dispatch(
      cartItemData({
        id: productDetailsdata?.data?.id,
        quantity: 1,
      }),
    ).then(async res => {
      // setLoading(false);
      console.log('cart item data', res.payload);
    });
  };

  const addWishlistItem = () => {
    dispatch(
      WishlistItemData({
        id: productDetailsdata?.data?.id,
      }),
    ).then(async res => {
      // setLoading(false);
      console.log('cart item data', res.payload);
    });
  };

  return (
    <SafeView>
      <HeaderComponent
        headingName={productDetailsdata?.data?.name}
        arrow={tabBarIcon('arrow-left')}
        onPress={() => props.navigation.goBack()}
        searchPress={() => props.navigation.navigate(routes.SearchItem)}
        navigation={props.navigation}
      />
      <HomeLoader visible={loading} color="blue" />

      <View style={{padding: 8}}>
        <Box
          alignItems="center"
          marginTop={calcH(0.02)}
          marginBottom={calcH(0.02)}>
          <Box
            maxW="80"
            rounded="lg"
            overflow="hidden"
            borderColor="coolGray.200"
            borderWidth="1"
            _dark={{
              borderColor: 'coolGray.600',
              backgroundColor: 'gray.700',
            }}
            _web={{
              shadow: 2,
              borderWidth: 0,
            }}
            _light={{
              backgroundColor: 'gray.50',
            }}>
            <Box>
              <AspectRatio w="100%" ratio={16 / 9}>
                <Image
                  source={{
                    uri: productDetailsdata?.data?.thumbnailSrc,
                  }}
                  alt={assetsImages.noImage}
                />
              </AspectRatio>
            </Box>
          </Box>
        </Box>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 5,
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 0.3,
              justifyContent: 'space-between',
            }}>
            <Text style={{color: '#fff', fontFamily: Font.Bold, fontSize: 18}}>
              Color :
            </Text>
            <Text style={styles.text}>Pink</Text>
          </View>
          <View style={{flexDirection: 'row', flex: 0.45}}>
            <Text style={{color: '#fff', fontFamily: Font.Bold, fontSize: 18}}>
              Available color:{' '}
            </Text>
            <Text style={[styles.text, {fontSize: 22}]}>
              {productDetailsdata?.data?.attributes?.color?.length}
            </Text>
          </View>
        </View>
        <HStack space={6} padding={2}>
          <Image source={assetsImages.image1} style={styles.imageS} />
          <Image source={assetsImages.image2} style={styles.imageS} />
          <Image source={assetsImages.image3} style={styles.imageS} />
        </HStack>
        <Text numberOfLines={2} style={styles.text}>
          {productDetailsdata?.data?.description}
        </Text>
        <View
          style={{
            padding: 8,
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: calcW(0.5),
          }}>
          {productDetailsdata?.data?.discount_percentage != 0 && (
            <Text style={[styles.text, {color: 'green'}]}>
              {productDetailsdata?.data?.discount_percentage}% off
            </Text>
          )}
          <Text style={styles.text}>${productDetailsdata?.data?.price}</Text>
        </View>
        <View style={{backgroundColor: '#D0D0D0', width: calcW(0.8)}}>
          <Text style={{color: '#000', fontSize: 15}}>
            Get $10- off* on your first online order
          </Text>
        </View>
      </View>
      <View style={{padding: 8}}>
        <Text style={styles.heading}>Select Size</Text>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            paddingHorizontal: 8,
            paddingVertical: 10,
            justifyContent: 'space-between',
          }}>
          <SizeComp
            size={'S'}
            onPress={() => selectSize('S')}
            selected={selectedSize === 'S'}
          />
          <SizeComp
            size={'M'}
            onPress={() => selectSize('M')}
            selected={selectedSize === 'M'}
          />
          <SizeComp
            size={'L'}
            onPress={() => selectSize('L')}
            selected={selectedSize === 'L'}
          />
          <SizeComp
            size={'XL'}
            onPress={() => selectSize('XL')}
            selected={selectedSize === 'XL'}
          />
        </View>
        <View style={{padding: 8}}>
          <Text style={styles.heading}>Product Details</Text>
          <View
            style={{
              padding: 12,
              flex: 0.3,
              backgroundColor: '#424d54',
              borderRadius: 8,
            }}>
            <View>
              <Text style={styles.text}>Color: Pink</Text>
            </View>
            <View>
              <Text style={styles.text}>Length: Calf Length</Text>
            </View>
            <View>
              <Text style={styles.text}>Type: Fit and Flare</Text>
            </View>
            <View>
              <Text style={styles.text}>Color: Fit Butterfly Sleeve</Text>
            </View>
            <HStack justifyContent={'space-between'} marginTop={calcH(0.01)}>
              <Text
                onPress={() => props.navigation.navigate(routes.SizeDetails)}
                style={[styles.text, {color: mainColor}]}>
                All Details
              </Text>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate(routes.SizeDetails);
                }}>
                <Ionicons
                  name={'chevron-forward-circle-outline'}
                  size={18}
                  color={mainColor}
                />
              </TouchableOpacity>
            </HStack>
          </View>
        </View>
        <HStack
          justifyContent={'space-between'}
          marginTop={calcH(0.01)}
          padding={2}>
          <Text
            onPress={() =>
              props.navigation.navigate(routes.RatingReview, {
                data: props.route.params.data,
              })
            }
            style={[styles.text, {color: mainColor}]}>
            Rating & Review
          </Text>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate(routes.RatingReview, {
                data: props.route.params.data,
              });
            }}>
            <Ionicons name={'arrow-forward'} size={22} color={mainColor} />
          </TouchableOpacity>
        </HStack>
        <View style={{padding: 8}}>
          <AppButton
            title={'Add to Wishlist'}
            icon={
              <Ionicons
                name="heart-outline"
                size={28}
                style={{marginRight: calcW(0.02)}}
                color={'#000'}
              />
            }
            buttonStyle={{backgroundColor: '#fff'}}
            textStyle={{color: '#000', fontSize: 20}}
            onPress={() => addWishlistItem()}
          />
          <AppButton
            title={'Add to Cart'}
            icon={
              <Ionicons
                name="cart-outline"
                size={28}
                style={{marginRight: calcW(0.02)}}
                color={'#fff'}
              />
            }
            textStyle={{color: '#fff', fontSize: 20}}
            onPress={() => addCartItem()}
          />
        </View>
      </View>
    </SafeView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  text: {color: '#fff', fontSize: 14, fontFamily: Font.Regular},
  imageS: {
    height: calcH(0.15),
    width: calcW(0.25),
    resizeMode: 'contain',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
  },
  heading: {color: '#fff', fontSize: 20, fontFamily: Font.Bold},
});
