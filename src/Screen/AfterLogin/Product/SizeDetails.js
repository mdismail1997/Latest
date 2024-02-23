import React, {Component, useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Pressable,
  Modal,
  FlatList,
} from 'react-native';
import {SafeView} from '../../../Component';
import HeaderComponent from '../../../Component/Header';
import {tabBarIcon} from '../../../Component/ScreenComponenet/BottomTabItem';
import routes from '../../../Navigation/routes';
import {calcH, calcW} from '../../../utils/Common';
import HomeLoader from '../../../Component/ScreenComponenet/LoadingScreen';
import {colorSet, mainColor} from '../../../utils/Color';
import {RFValue} from 'react-native-responsive-fontsize';
import {Font} from '../../../utils/font';
import SizeChart from './SizeChart';
import MeasureDetails from './MeasureDetails';

export default SizeDetails = props => {
  const {productDetailsdata, loading} = useSelector(
    state => state.productDetailsData,
  );

  const [selectedMeasurement, setSelectedMeasurement] = useState('Size');
  const selectMeasurementFunc = name => {
    setSelectedMeasurement(name);
  };

  console.log('====productDetailsdata===>', productDetailsdata);

  return (
    <SafeView>
      <HeaderComponent
        headingName={'Size Chart'}
        arrow={tabBarIcon('arrow-left')}
        onPress={() => props.navigation.goBack()}
        searchPress={() => props.navigation.navigate(routes.SearchItem)}
        navigation={props.navigation}
      />
      <HomeLoader visible={loading} color="blue" />
      <View
        style={{
          marginTop: calcH(0.01),
          width: '100%',
          paddingHorizontal: calcW(0.05),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <View style={{width: '57%'}}>
          <Text
            style={{
              color: colorSet.text3,
              fontSize: RFValue(20),
              fontWeight: 'bold',
              fontFamily: Font.Bold,
              //marginBottom: 5,
            }}>
            {productDetailsdata.data.name}
          </Text>
          <Text
            style={{
              color: colorSet.text3,
              fontSize: RFValue(13),
              fontWeight: '400',
              fontFamily: Font.Regular,
              marginVertical: 10,
            }}
            numberOfLines={3}>
            {productDetailsdata.data.description}
          </Text>
          {productDetailsdata.data.discount_percentage == 0 ? (
            <>
              <Text
                style={{
                  color: colorSet.text3,
                  fontSize: RFValue(14),
                  fontWeight: '400',
                  fontFamily: Font.Regular,
                }}>
                $ {productDetailsdata.data.price}
              </Text>
            </>
          ) : (
            <>
              <Text
                style={{
                  color: colorSet.green,
                  fontSize: RFValue(18),
                  fontWeight: '400',
                  fontFamily: Font.Regular,
                }}>
                {productDetailsdata.data.discount_percentage}% Off
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    color: colorSet.text3,
                    fontSize: RFValue(14),
                    fontWeight: '400',
                    fontFamily: Font.Regular,
                  }}>
                  $ {productDetailsdata.data.price}
                </Text>
                <Text
                  style={{
                    textDecorationLine: 'line-through',
                    textDecorationStyle: 'solid',
                    color: colorSet.baba,
                    fontSize: RFValue(14),
                    fontWeight: '400',
                    fontFamily: Font.Regular,
                    marginLeft: 5,
                  }}>
                  {'$4342'}
                </Text>
              </View>
            </>
          )}
        </View>
        <View
          style={{
            width: '40%',
            height: calcH(0.15),
            backgroundColor: 'red',
            borderRadius: 15,
          }}>
          <Image
            source={{uri: productDetailsdata.data.thumbnailSrc}}
            style={{
              height: '100%',
              width: '100%',
              borderRadius: 15,
              resizeMode: 'contain',
            }}
          />
        </View>
      </View>
      <View
        style={{
          width: '70%',
          height: calcH(0.07),
          paddingHorizontal: calcW(0.05),
          marginVertical: calcH(0.01),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            selectMeasurementFunc('Size');
          }}>
          <View
            style={
              selectedMeasurement === 'Size'
                ? styles.IconStyleSelected
                : styles.IconStyle
            }>
            <Text
              style={
                selectedMeasurement === 'Size' ? styles.textSelect : styles.text
              }>
              {'Size Cart'}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            selectMeasurementFunc('Measure');
          }}>
          <View
            style={
              selectedMeasurement === 'Measure'
                ? styles.IconStyleSelected
                : styles.IconStyle
            }>
            <Text
              style={
                selectedMeasurement === 'Measure'
                  ? styles.textSelect
                  : styles.text
              }>
              {'How to Measure'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: '100%',
          paddingHorizontal: calcW(0.05),
          backgroundColor: colorSet.b,
        }}>
        {selectedMeasurement == 'Size' && <SizeChart />}
        {selectedMeasurement == 'Measure' && <MeasureDetails />}
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  IconStyleSelected: {
    // width: 100,
    height: 40,
    borderColor: '#808080',

    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    borderBottomColor: mainColor,
    borderBottomWidth: 1,
    paddingHorizontal: 5,
  },

  IconStyle: {
    paddingHorizontal: 5,

    height: 40,
    borderColor: '#808080',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  text: {
    fontSize: 16,
    alignSelf: 'center',
    color: colorSet.text3,
  },

  textSelect: {
    fontSize: 16.5,
    alignSelf: 'center',
    color: mainColor,
  },
});
