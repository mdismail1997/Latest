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

const MeasureDetails = () => {
  return (
    <View style={{flex: 1, backgroundColor: colorSet.white}}>
      <Text>MeasureDetails</Text>
    </View>
  );
};

export default MeasureDetails;

const styles = StyleSheet.create({});
