import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  useWindowDimensions,
  View,
  ScrollView,
} from 'react-native';
import SafeView from '../../Component/SafeView';

import {calcH, calcW} from '../../utils/Common';

import routes from '../../Navigation/routes';

import {toasterr, toastr} from '../../utils/commonToast';
import {colorSet, mainColor} from '../../utils/Color';
import HeaderComponent from '../../Component/Header';

import {tabBarIcon} from '../../Component/ScreenComponenet/BottomTabItem';

import {RFValue} from 'react-native-responsive-fontsize';
import HomeLoader from '../../Component/ScreenComponenet/LoadingScreen';

import RenderHtml from 'react-native-render-html';
import {getApicall} from '../../Services/Network';
import {Font} from '../../utils/font';

const TermsCondition = props => {
  const {width} = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [tcData, setTcData] = useState('');

  useEffect(() => {
    termsConditionFunc();
  }, []);

  const termsConditionFunc = async () => {
    setLoading(true);
    await getApicall('/page/451')
      .then(response => {
        setLoading(false);
        if (response.status == 200) {
          setTcData(response.data.content);
        } else {
          vc;
          toasterr.showToast(response.data.message);
        }
      })
      .catch(function (error) {
        console.log('error==>', error);
        setLoading(false);
        // Request made and server responded
        if (error.response) {
          console.log('response error===>', error.response.data);
          toasterr.showToast(error.response.data.message);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Request Error==>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colorSet.backgroundColor}}>
      <View style={{height: calcH(0.1)}}>
        <HeaderComponent
          headingName={'Terms & Condition'}
          arrow={tabBarIcon('arrow-left')}
          onPress={() => props.navigation.goBack()}
          searchPress={() => props.navigation.navigate(routes.SearchItem)}
          navigation={props.navigation}
        />
      </View>
      <HomeLoader visible={loading} color="blue" />
      {tcData != '' && (
        <ScrollView
          style={{marginLeft: 20}}
          contentContainerStyle={{
            paddingBottom: 20,
            width: '95%',
            justifyContent: 'center',
          }}>
          <RenderHtml
            contentWidth={width * 0.9}
            source={{html: `${tcData}`}}
            tagsStyles={tagsStyles}
            baseStyle={{fontStyle: Font.Regular, fontSize: 15}}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default TermsCondition;

const tagsStyles = {
  body: {
    whiteSpace: 'normal',
    color: colorSet.white,
  },
  a: {
    color: colorSet.white,
  },
  p: {
    color: colorSet.white,
  },
};
