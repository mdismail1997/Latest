import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {AppButton, SafeView} from '../../../Component';
import {calcW, calcH} from '../../../utils/Common';
import {colorSet, mainColor} from '../../../utils/Color';
import {Font} from '../../../utils/font';
import {RFValue} from 'react-native-responsive-fontsize';

import CustomRadio from '../../../Component/CustomRadio';
import AppButton2 from '../../../Component/AppButton2';
import {assetsImages, assetsIcon} from '../../../utils/assets';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import {cartItemData} from '../../../reduxToolkit/slices/Cart/addCartSLice';
import {useDispatch, useSelector} from 'react-redux';

const SizeChart = props => {
  const sizeData = [
    {
      id: 1,
      size: 39,
      brandSize: 'M',
      Chest_in_inch: 42.3,
      FontLength_in_inch: 25.3,
      AcrossSholder_in_inch: 16.5,
    },
    {
      id: 2,
      size: 39,
      brandSize: 'M',
      Chest_in_inch: 42.3,
      FontLength_in_inch: 25.3,
      AcrossSholder_in_inch: 16.5,
    },
    {
      id: 3,
      size: 39,
      brandSize: 'M',
      Chest_in_inch: 42.3,
      FontLength_in_inch: 25.3,
      AcrossSholder_in_inch: 16.5,
    },
    {
      id: 4,
      size: 39,
      brandSize: 'M',
      Chest_in_inch: 42.3,
      FontLength_in_inch: 25.3,
      AcrossSholder_in_inch: 16.5,
    },
    {
      id: 5,
      size: 39,
      brandSize: 'M',
      Chest_in_inch: 42.3,
      FontLength_in_inch: 25.3,
      AcrossSholder_in_inch: 16.5,
    },
    {
      id: 6,
      size: 39,
      brandSize: 'M',
      Chest_in_inch: 42.3,
      FontLength_in_inch: 25.3,
      AcrossSholder_in_inch: 16.5,
    },
  ];
  const {productDetailsdata, loading} = useSelector(
    state => state.productDetailsData,
  );
  const dispatch = useDispatch();
  const [measurementUnit, setMeasurementUnit] = useState('in');
  const [selectedMeasurement, setSelectedMeasurement] = useState(sizeData[4]);

  const addCartItem = () => {
    // setLoading(true);
    dispatch(
      cartItemData({
        id: productDetailsdata?.data?.id,
        quantity: 1,
      }),
    ).then(async res => {
      // setLoading(false);
      console.log('cart item data', res);
    });
  };
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          width: calcW(0.23),
          //backgroundColor: '#fff',
          height: 50,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignSelf: 'flex-end',
          alignItems: 'center',
          borderColor: '#fff',
          borderWidth: 1,
          borderRadius: 15,
        }}>
        <TouchableOpacity
          onPress={() => setMeasurementUnit('in')}
          style={[
            styles.MeasurementStyle,
            measurementUnit == 'in' ? styles.selectedMeasurementStyle : {},
          ]}>
          <Text
            style={[
              styles.textStyle,
              measurementUnit == 'Cm' ? {color: '#fff'} : {color: '#fff'},
            ]}>
            In
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMeasurementUnit('Cm')}
          style={[
            styles.MeasurementStyle,
            measurementUnit == 'Cm' ? styles.selectedMeasurementStyle : {},
          ]}>
          <Text
            style={[
              styles.textStyle,
              measurementUnit == 'Cm' ? {color: '#fff'} : {color: '#fff'},
            ]}>
            Cm
          </Text>
        </TouchableOpacity>
      </View>
      <SafeView style={{flex: 1}}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            marginBottom: 5,
            //borderBottomWidth: 1,
            //borderBottomColor: colorSet.shadegray,
            //justifyContent: 'space-between',
            //alignItems: 'center',
          }}>
          <View style={[styles.categoryStyle, {width: 45}]} />

          <Text
            style={[styles.categoryStyle, styles.categoryText, {width: 50}]}>
            Size
          </Text>
          <Text
            style={[styles.categoryStyle, styles.categoryText, {width: 50}]}>
            Brand Size
          </Text>
          <Text
            style={[
              styles.categoryStyle,
              styles.categoryText,
              {width: 50},
            ]}>{`Chest (${measurementUnit})`}</Text>
          <Text
            style={[
              styles.categoryStyle,
              styles.categoryText,
              {width: 55},
            ]}>{`Font Length (${measurementUnit})`}</Text>
          <Text
            style={[
              styles.categoryStyle,
              styles.categoryText,
              {width: 70},
            ]}>{`Across Shoulder (${measurementUnit})`}</Text>
        </View>
        {sizeData.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => setSelectedMeasurement(item)}
              key={index}
              style={{
                width: '100%',
                flexDirection: 'row',
                height: 45,
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: colorSet.shadegray,
                //justifyContent: 'space-between',
                //alignItems: 'center',
              }}>
              <View
                onPress={() => setSelectedMeasurement(item)}
                style={[styles.categoryStyle, {width: 45}]}>
                <CustomRadio
                  status={selectedMeasurement?.id == item.id}
                  onPress={() => {
                    setSelectedMeasurement(item);
                  }}
                />
              </View>

              <Text
                style={[
                  styles.categoryStyle,
                  styles.itemText,
                  {
                    width: 50,
                    color:
                      selectedMeasurement?.id == item.id
                        ? mainColor
                        : colorSet.white,
                  },
                ]}>
                {item.size}
              </Text>
              <Text
                style={[
                  styles.categoryStyle,
                  styles.itemText,
                  {
                    color:
                      selectedMeasurement?.id == item.id
                        ? mainColor
                        : colorSet.white,
                    width: 50,
                  },
                ]}>
                {item.brandSize}
              </Text>
              <Text
                style={[
                  styles.categoryStyle,
                  styles.itemText,
                  {
                    color:
                      selectedMeasurement?.id == item.id
                        ? mainColor
                        : colorSet.white,
                    width: 50,
                  },
                ]}>
                {item.Chest_in_inch}
              </Text>
              <Text
                style={[
                  styles.categoryStyle,
                  styles.itemText,
                  {
                    color:
                      selectedMeasurement?.id == item.id
                        ? mainColor
                        : colorSet.white,
                    width: 60,
                  },
                ]}>
                {item.FontLength_in_inch}
              </Text>
              <Text
                style={[
                  styles.categoryStyle,
                  styles.itemText,
                  {
                    color:
                      selectedMeasurement?.id == item.id
                        ? mainColor
                        : colorSet.white,
                    width: 70,
                  },
                ]}>
                {item.AcrossSholder_in_inch}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* <AppButton2
          title={'WishList'.toUpperCase()}
          textStyle={{color: mainColor, fontSize: RFValue(18)}}
          buttonStyle={{marginTop: 50}}
          icon={
            <Ionicons
              name="heart-outline"
              size={28}
              style={{marginRight: calcW(0.02)}}
              color={mainColor}
            />
          }
        /> */}
        <AppButton
          onPress={() => addCartItem()}
          title={'Add to Cart'.toUpperCase()}
          icon={
            <Ionicons
              name="cart-outline"
              size={28}
              style={{marginRight: calcW(0.02)}}
              color={'#fff'}
            />
          }
          textStyle={{color: '#fff', fontSize: RFValue(18)}}
        />
      </SafeView>
    </View>
  );
};

export default SizeChart;

const styles = StyleSheet.create({
  MeasurementStyle: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    // backgroundColor: mainColor,
  },
  selectedMeasurementStyle: {
    backgroundColor: mainColor,
  },
  textStyle: {
    fontFamily: Font.Medium,
    fontWeight: '500',
    fontSize: RFValue(16),
  },
  categoryStyle: {
    //backgroundColor: mainColor,
    alignItems: 'center',
    marginRight: 5,
  },
  categoryText: {
    fontSize: RFValue(12),
    fontWeight: '500',
    fontFamily: Font.Medium,
    color: colorSet.white,
  },

  itemText: {
    fontSize: RFValue(15),
    fontWeight: '500',
    fontFamily: Font.Medium,
    alignSelf: 'center',
  },
});
