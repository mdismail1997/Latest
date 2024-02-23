import React, {Component, useEffect} from 'react';
import {Text, StyleSheet, View, FlatList} from 'react-native';
import {SafeView} from '../../Component';
import HeaderComponent from '../../Component/Header';
import Ionicons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {tabBarIcon} from '../../Component/ScreenComponenet/BottomTabItem';
import {Badge, HStack, Icon} from 'native-base';
import {Font} from '../../utils/font';
import {calcH, calcW} from '../../utils/Common';
import {FilterComp} from '../../Component/ScreenComponenet/Category';
import {useDispatch, useSelector} from 'react-redux';
import {
  getCategory,
  getProduct,
  getProductdata,
} from '../../reduxToolkit/slices/Product/productSlice';
import routes from '../../Navigation/routes';
import {getcategorydata} from '../../reduxToolkit/slices/Product/categorySlice';
import {mainColor} from '../../utils/Color';

const badgeIcon = (name, iconName) => (
  <Badge
    variant={'outline'}
    rightIcon={tabBarIcon(iconName)}
    _text={{color: '#fff'}}>
    {name}
  </Badge>
);
const Shopping = props => {
  const {productdata, loading} = useSelector(state => state.productData);
  const {categorydata} = useSelector(state => state.categoryData);
  console.log('product', productdata.data.length);
  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(getcategorydata());
    // dispatch(getProductdata());
  }, [dispatch]);

  return (
    <SafeView>
      <HeaderComponent
        headingName={'Products'}
        arrow={tabBarIcon('arrow-left')}
        onPress={() => props.navigation.toggleDrawer()}
        searchPress={() => props.navigation.navigate(routes.SearchItem)}
        navigation={props.navigation}
      />
      <View style={styles.mainContainer}>
        <HStack space={2}>
          {badgeIcon('Sort By', 'chevron-down')}
          {badgeIcon('Filter', 'tune-variant')}
          {badgeIcon('Discount', 'chevron-down')}
          {badgeIcon('Price', 'chevron-down')}
        </HStack>
        <View style={{marginTop: calcH(0.02), paddingHorizontal: 15}}>
          <Text style={styles.heading}>Casual Wear</Text>
          <Text style={{color: '#fff'}}>
            {productdata?.data.length} Products Found
          </Text>
          <View style={{marginBottom: calcH(0.07)}}>
            <FlatList
              data={productdata?.data?.filter(
                i => i?.categories[0] === 'Tshirts',
              )}
              // horizontal={true}
              // showsHorizontalScrollIndicator={false}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({item, index}) => {
                return (
                  <>
                    <FilterComp
                      key={index}
                      onpress={() => {
                        props.navigation.navigate(routes.ProductDetails, {
                          data: item?.id,
                        });
                      }}
                      icon={{uri: item.main_image}}
                      heading={item.name}
                      categoryname={item.categories[0]}
                      discount={item.discount_percentage}
                      price={`${new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(item.price)}`}
                    />
                  </>
                );
              }}
            />
          </View>
        </View>
      </View>
    </SafeView>
  );
};

export default Shopping;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // padding: 12,
  },
  heading: {
    fontFamily: Font.Bold,
    fontSize: calcW(0.05),
    color: '#fff',
  },
});
