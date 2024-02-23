import React, {Component, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {SafeView} from '../../Component';
import HeaderComponent from '../../Component/Header';
import Icons from 'react-native-vector-icons/dist/AntDesign';
import {tabBarIcon} from '../../Component/ScreenComponenet/BottomTabItem';
import {Badge, HStack, Icon} from 'native-base';
import {Font} from '../../utils/font';
import {calcH, calcW} from '../../utils/Common';
import {FilterComp} from '../../Component/ScreenComponenet/Category';
import {useDispatch, useSelector} from 'react-redux';
import routes from '../../Navigation/routes';
import {colorSet, mainColor} from '../../utils/Color';
import {getWishlistItemdata} from '../../reduxToolkit/slices/Wishlist/getItemSlice';
import {removeItemData} from '../../reduxToolkit/slices/Wishlist/removeItemSlice';
import {assetsImages} from '../../utils/assets';
import {cartItemData} from '../../reduxToolkit/slices/Cart/addCartSLice';

const badgeIcon = (name, iconName) => (
  <Badge
    variant={'outline'}
    rightIcon={tabBarIcon(iconName)}
    _text={{color: '#fff'}}>
    {name}
  </Badge>
);
const Wishlist = props => {
  const {wishlistItemdata} = useSelector(state => state.wishlistItemData);

  console.log('Wishlist data==========>', wishlistItemdata);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getWishlistItemdata());
    // dispatch(getProductdata());
  }, [dispatch]);

  const removeItem = async id => {
    console.log('*****', id);
    await dispatch(
      removeItemData({
        id: id,
      }),
    ).then(async res => {
      // setLoading(false);
      console.log('remove item data', res);
      dispatch(getWishlistItemdata());
    });
  };
  const addCartItem = id => {
    // setLoading(true);
    dispatch(
      cartItemData({
        id: id,
        quantity: 1,
      }),
    ).then(async res => {
      // setLoading(false);
      console.log('cart item data', res);
    });
  };

  const renderWishlistItem = ({item}) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => removeItem(item.product_id)}>
        <Icons name="closecircleo" size={20} color={'#000'} />
      </TouchableOpacity>
      <Image
        source={
          item?.product_image == false
            ? {
                uri: assetsImages.noImage,
              }
            : {
                uri: item.product_image,
              }
        }
        style={styles.cardImage}
      />
      <Text numberOfLines={1} style={styles.cardText}>
        {item.product_name}
      </Text>
      <Text style={styles.cardText}>${Number(item.price).toFixed(2)}</Text>
      <TouchableOpacity onPress={() => addCartItem(item.product_id)}>
        <Text style={styles.removeButton}>Add to cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeView>
      <HeaderComponent
        headingName={'Wishlist'}
        arrow={tabBarIcon('arrow-left')}
        onPress={() => props.navigation.goBack()}
        searchPress={() => props.navigation.navigate(routes.SearchItem)}
        navigation={props.navigation}
      />
      <View style={styles.mainContainer}>
        <View style={{marginTop: calcH(0.02), paddingHorizontal: 15}}>
          <View style={{marginBottom: calcH(0.07)}}>
            {wishlistItemdata?.length > 0 ? (
              <FlatList
                data={wishlistItemdata}
                keyExtractor={item => item.id}
                renderItem={renderWishlistItem}
                numColumns={2} // Adjust the number of columns as needed
              />
            ) : (
              <Text style={styles.emptyText}>Your wishlist is empty</Text>
            )}
          </View>
        </View>
      </View>
    </SafeView>
  );
};

export default Wishlist;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // padding: 12,
  },
  heading: {
    fontFamily: Font.Bold,
    fontSize: calcW(0.05),
    color: mainColor,
  },
  card: {
    flex: 0.5,
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    padding: 5,
  },
  cardImage: {
    height: calcH(0.2),
    resizeMode: 'contain',
  },
  cardText: {
    padding: 8,
    fontSize: 16,
    fontFamily: Font.Regular,
    color: '#000',
  },
  removeButton: {
    color: '#fff',
    fontFamily: Font.Bold,
    padding: 8,
    textAlign: 'center',
    fontSize: 15,
    backgroundColor: mainColor,
  },
});
