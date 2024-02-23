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
import SafeView from '../../Component/SafeView';
import {
  Checkbox,
  HStack,
  Icon,
  Input,
  VStack,
  Avatar,
  Divider,
} from 'native-base';
import {calcH, calcW} from '../../utils/Common';
import AppFormField from '../../Component/Form/AppFormField';
import {AppForm} from '../../Component/Form';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {Font} from '../../utils/font';
import {useDispatch, useSelector} from 'react-redux';
import routes from '../../Navigation/routes';
import SubmitButton from '../../Component/Form/SubmitButton';
import {toasterr, toastr} from '../../utils/commonToast';
import {colorSet, mainColor} from '../../utils/Color';
import {postApiCall, getCartApicall} from '../../Services/Network';
import HeaderComponent from '../../Component/Header';
import {tabBarIcon} from '../../Component/ScreenComponenet/BottomTabItem';

import {RFValue} from 'react-native-responsive-fontsize';
import HomeLoader from '../../Component/ScreenComponenet/LoadingScreen';
import {ProfileContext} from '../../Services/ProfileProvider';
import {assetsImages} from '../../utils/assets';
import AppButton from '../../Component/AppButton';
import {Rating, AirbnbRating} from 'react-native-ratings';
import {ratingReviewData} from '../../reduxToolkit/slices/Product/ratingReviewSlice';
import {getreviewdata} from '../../reduxToolkit/slices/Product/getreviewSlice';

const RatingReview = props => {
  console.log(props.route.params.data);
  const {reviewdata} = useSelector(state => state.ratingReviewData);
  useEffect(() => {
    dispatch(getreviewdata(props.route.params.data));
    console.log('&&&&&&&&&&ratingReview', reviewdata);
  }, []);
  const {profileContextData, setProfileContextData} =
    useContext(ProfileContext);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [ratingValue, setRatingValue] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const ratingCompleted = rating => {
    console.log('Rating is: ' + rating);
    setRatingValue(rating);
  };

  const dateFunc = date => {
    var returnData = '';
    //var postdate = moment(date).format('YYYY-MM-DD');
    var today = new Date();
    var date1 = new Date(date);

    //var todayDate = moment(today).format('YYYY-MM-DD');

    var Difference_In_Time =
      new Date(today).getTime() - new Date(date).getTime();
    if (
      today.getDate() == date1.getDate() &&
      today.getMonth() == date1.getMonth() &&
      date1.getFullYear() == today.getFullYear()
    ) {
      var diff = Math.abs(Difference_In_Time) / 3600000;

      if (diff < 1) {
        returnData = 'less than an hour ago';
      } else {
        returnData = Math.floor(diff) + ' hours ago';
      }
    } else {
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

      if (Math.floor(Difference_In_Days) < 7) {
        if (Math.floor(Difference_In_Days) == 0) {
          var diff = Math.abs(Difference_In_Time) / 3600000;
          returnData = Math.floor(diff) + ' hours ago';
        } else {
          returnData = Math.floor(Difference_In_Days) + ' days ago';
        }
      } else {
        var postDate1 = new Date(date).toDateString();

        returnData = postDate1;
      }
    }
    return returnData;
  };

  const reviewFunc = () => {
    setLoading(true);
    dispatch(
      ratingReviewData({
        id: props.route.params.data,
        content: reviewText,
        rating: ratingValue,
      }),
    ).then(async res => {
      setLoading(false);
      console.log('login data', res);
      dispatch(getreviewdata(props.route.params.data));
    });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colorSet.backgroundColor}}>
      <View style={{height: calcH(0.1)}}>
        <HeaderComponent
          headingName={'Rating & Review'}
          arrow={tabBarIcon('arrow-left')}
          onPress={() => props.navigation.goBack()}
          searchPress={() => props.navigation.navigate(routes.SearchItem)}
          navigation={props.navigation}
        />
      </View>
      <SafeView>
        <HomeLoader visible={loading} color="blue" />
        <View
          style={{
            width: '100%',
            //backgroundColor: 'red',
            alignItems: 'center',
            paddingHorizontal: calcW(0.05),
            // height: 100,
          }}>
          <Text
            style={[
              styles.headerTextStyle,
              {fontSize: RFValue(20), marginBottom: calcH(0.01)},
            ]}>
            Leave a review
          </Text>
          <Text
            style={[
              styles.subHeaderTextStyle,
              {fontSize: RFValue(15), marginBottom: calcH(0.03)},
            ]}>
            How would you rate your experience?
          </Text>
          <Text
            style={[
              styles.subHeaderTextStyle,
              {fontSize: RFValue(15), marginBottom: calcH(0.01)},
            ]}>
            Rating
          </Text>

          <Rating
            type="custom"
            startingValue={ratingValue}
            ratingColor={mainColor}
            ratingBackgroundColor={colorSet.white}
            ratingCount={5}
            imageSize={30}
            tintColor={colorSet.backgroundColor}
            onFinishRating={ratingCompleted}
            style={{
              paddingVertical: 10,
              backgroundColor: colorSet.backgroundColor,
            }}
          />

          <Input
            placeholder={'Write a Review'}
            value={reviewText}
            onChangeText={val => {
              setReviewText(val);
            }}
            color={'#fff'}
            multiline
            style={{height: calcH(0.1), textAlignVertical: 'top'}}
          />

          <AppButton
            onPress={() => reviewFunc()}
            title={'Submit'.toUpperCase()}
            right
            loading={loading}
            buttonStyle={{backgroundColor: mainColor, marginTop: calcH(0.03)}}
          />
        </View>

        <View
          style={{
            width: '100%',

            alignItems: 'center',
            paddingHorizontal: calcW(0.05),
            // height: 100,
          }}>
          <Text
            style={[
              styles.headerTextStyle,
              {fontSize: RFValue(20), marginVertical: calcH(0.01)},
            ]}>
            Top Positive Reviews
          </Text>
          {reviewdata?.reviews.map((item, index) => {
            return (
              <View key={index} style={styles.reviewCardStyle}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Avatar
                      // source={item.user_profile_img}
                      source={{uri: item.user_profile_img}}
                      bg="cyan.500"
                      size="md"
                    />
                    <View style={{marginLeft: 5}}>
                      <Text style={styles.cardTextStyle}>{item.author}</Text>
                      <Rating
                        type="custom"
                        startingValue={item.rating}
                        readonly
                        ratingColor={mainColor}
                        ratingBackgroundColor={colorSet.white}
                        ratingCount={5}
                        imageSize={17}
                        //tintColor={colorSet.white}
                        // onFinishRating={ratingCompleted}
                        style={{
                          paddingVertical: 5,
                          backgroundColor: colorSet.white,
                        }}
                      />
                      {/* <Rating
                        type="star"
                        ratingCount={5}
                        imageSize={18}
                        readonly
                        startingValue={item.rating}
                      /> */}
                    </View>
                  </View>
                  <Text
                    style={[styles.cardDescTextStyle, {fontSize: RFValue(12)}]}>
                    {dateFunc(item.date)}
                  </Text>
                </View>
                <Text
                  style={[styles.cardDescTextStyle, {fontSize: RFValue(12)}]}>
                  {item.content}
                </Text>
              </View>
            );
          })}
        </View>
      </SafeView>
    </SafeAreaView>
  );
};

export default RatingReview;

const styles = StyleSheet.create({
  headerTextStyle: {
    fontFamily: Font.Bold,
    fontWeight: '500',
    color: colorSet.white,
  },
  subHeaderTextStyle: {
    fontFamily: Font.Medium,
    fontWeight: '500',
    color: colorSet.white,
  },
  reviewCardStyle: {
    width: '100%',
    backgroundColor: colorSet.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignSelf: 'center',
    marginTop: calcH(0.01),
    borderRadius: 15,

    elevation: 1,
  },
  cardTextStyle: {
    fontWeight: '500',
    fontSize: RFValue(15),
    fontFamily: Font.Bold,
    color: '#5B739D',
  },
  cardDescTextStyle: {
    fontWeight: '400',
    fontFamily: Font.Regular,
    color: '#565656',
  },
});
