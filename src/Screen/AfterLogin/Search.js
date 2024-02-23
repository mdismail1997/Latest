import React, {Component, useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import SafeView from '../../Component/SafeView';
import HeaderComponent from '../../Component/Header';
import {assetsIcon, assetsImages} from '../../utils/assets';
import {calcH, calcW} from '../../utils/Common';
import {colorSet} from '../../utils/Color';
import {Font} from '../../utils/font';
import {Button, HStack} from 'native-base';
import {useDispatch, useSelector} from 'react-redux';
import CategoryComp, {
  DiscountComp,
  FilterComp,
  ProductComp,
} from '../../Component/ScreenComponenet/Category';
import HomeLoader from '../../Component/ScreenComponenet/LoadingScreen';
import {
  getCategory,
  getProduct,
  getProductdata,
} from '../../reduxToolkit/slices/Product/productSlice';
import moment from 'moment';
import {
  getProductSearchdata,
  productSearchData,
} from '../../reduxToolkit/slices/Product/productSearchSlice';
import {getcategorydata} from '../../reduxToolkit/slices/Product/categorySlice';
import routes from '../../Navigation/routes';

const Search = props => {
  const [data, setData] = useState('');
  const [searchText, setSearchText] = useState('');
  const [search, setSearch] = useState(false);
  // const [loading, setloading] = useState(false);
  const {productdata, loading} = useSelector(state => state.productData);
  const {categorydata} = useSelector(state => state.categoryData);
  const {productSearchsdata} = useSelector(state => state.productSearchData);
  console.log('product', productSearchData);
  const dispatch = useDispatch();
  useEffect(() => {
    //dispatch(getcategorydata());

    //dispatch(getProductdata());
    setSearch(false);
    // dispatch(getProductSearchdata(searchText))
  }, [dispatch]);

  const searchClick = async data => {
    console.log(data);
    setSearch(true);
    //     if(search){
    //       await dispatch(getProductdata(data));
    // return
    //     }
  };
  const filteredProduct = productdata?.data?.filter(item =>
    item.name.toLowerCase().includes(data.toLowerCase()),
  );

  return (
    <SafeView>
      <HeaderComponent
        icon={assetsIcon.menu}
        search
        value={data}
        onChangeText={text => setData(text)}
        headingName={''}
        onPress={() => props.navigation.toggleDrawer()}
        searchPress={() => searchClick(data)}
        navigation={props.navigation}
      />
      <HomeLoader visible={loading} color="blue" />
      <View style={{flex: 1, margingBottom: calcH(0.05)}}>
        <View style={styles.firstcontainer}>
          <FlatList
            data={categorydata?.data}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({item, index}) => {
              return (
                <CategoryComp
                  icon={
                    item.image == false
                      ? {
                          uri: assetsImages.noImage,
                        }
                      : {uri: item.image}
                  }
                  subject={`${item.name}`}
                  color={'#000'}
                />
              );
            }}
          />
        </View>

        {!search || data == '' ? (
          <>
            <View style={styles.secondContainer}>
              <Text style={styles.subHeading}>Most Searched Articles</Text>
              <Button
                style={styles.viewButton}
                size={'xs'}
                _text={{color: colorSet.primarycolor}}>
                View All
              </Button>
            </View>
            <FlatList
              data={productdata.data?.slice(0, 8)}
              key={'_'}
              numColumns={4}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({item, index}) => {
                return (
                  <View style={{padding: 3}}>
                    <Image
                      source={assetsImages.product}
                      style={{width: calcW(0.23), height: calcH(0.25)}}
                      resizeMode={'contain'}
                    />
                  </View>
                );
              }}
            />
          </>
        ) : (
          <>
            {filteredProduct.length == 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: calcH(0.15),
                  marginTop: calcH(0.1),
                }}>
                <Text
                  style={{color: '#fff', fontFamily: Font.Bold, fontSize: 18}}>
                  No Data found
                </Text>
              </View>
            ) : (
              <FlatList
                key={'#'}
                data={filteredProduct}
                // horizontal={true}
                // showsHorizontalScrollIndicator={false}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({item, index}) => {
                  return (
                    <>
                      <FilterComp
                        onpress={() =>
                          props.navigation.navigate(routes.ProductDetails, {
                            data: item?.id,
                          })
                        }
                        icon={
                          item?.main_image == false
                            ? {uri: assetsImages.noImage}
                            : {uri: item?.main_image}
                        }
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
            )}
          </>
        )}

        <Image
          source={assetsImages.banner1}
          style={styles.banner}
          resizeMode="stretch"
        />
        <View style={{marginBottom: calcH(0.1)}}>
          <View style={styles.secondContainer}>
            <Text style={styles.subHeading}>
              Continue Browsing These Styles
            </Text>
            <Button
              style={styles.viewButton}
              size={'xs'}
              _text={{color: colorSet.primarycolor}}>
              View All
            </Button>
          </View>
          <FlatList
            data={productdata?.data}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({item, index}) => {
              return (
                <ProductComp
                  icon={
                    item?.main_image == false
                      ? {uri: assetsImages.noImage}
                      : {uri: item?.main_image}
                  }
                  subject={`${item.name}`}
                  price={`${new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(item.price)}`}
                />
              );
            }}
          />
        </View>
      </View>
    </SafeView>
  );
};

export default Search;

const styles = StyleSheet.create({
  firstcontainer: {
    backgroundColor: '#F8F8F8',
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  banner: {
    width: calcW(1),
    height: calcH(0.225),
  },
  subHeading: {
    color: '#fff',
    fontSize: calcW(0.05),
    fontFamily: Font.Medium,
  },
  secondContainer: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewButton: {
    backgroundColor: '#fff',
    borderColor: colorSet.primarycolor,
    borderWidth: 1,
    color: colorSet.primarycolor,
  },
  latestImage: {
    width: calcW(0.3),
    height: calcH(0.2),
  },
  thirdContainer: {
    padding: 12,
    // marginBottom: calcH(0.15)
  },
  discountImage: {
    width: calcW(0.45),
    height: calcH(0.45),
    marginTop: calcH(-0.05),
  },
});
