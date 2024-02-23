import React from 'react';
import {View, Text, Modal} from 'react-native';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';
// import Lottie from 'lottie-react-native';
import LottieView from 'lottie-react-native';

const HomeLoader = ({visible}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}>
        <LottieView
          // animation={}
          source={require('../../../Assets/JsonImages/CartLoading.json')}
          style={{alignSelf: 'center'}}
          // colorFilters={[
          //   {
          //     keypath: 'button',
          //     color: '#F00000',
          //   },
          //   {
          //     keypath: 'Sending Loader',
          //     color: '#F00000',
          //   },
          // ]}
          autoPlay
          loop
        />
      </View>
    </Modal>
  );
};

export default HomeLoader;
