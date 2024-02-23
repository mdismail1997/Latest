import React, {Component, useEffect, useState, useContext} from 'react';
import * as Yup from 'yup';
import AuthContainer from '../../Component/AuthContainer';
import {
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Alert,
} from 'react-native';
import SafeView from '../../Component/SafeView';
import {Checkbox, HStack, Icon, Input, VStack, FormControl} from 'native-base';
import {calcH, calcW} from '../../utils/Common';
import AppFormField from '../../Component/Form/AppFormField';
import {AppForm} from '../../Component/Form';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import {Font} from '../../utils/font';
import Hud from '../../utils/hud';
import {useDispatch, useSelector} from 'react-redux';
import {Formik, useFormikContext, useFormik} from 'formik';
import routes from '../../Navigation/routes';
import SubmitButton from '../../Component/Form/SubmitButton';
import {clearMessage} from '../../reduxToolkit/slices/message';
import {signupData} from '../../reduxToolkit/ApiFetch/signupSlice';
import {colorSet, mainColor} from '../../utils/Color';
import CustomRadio from '../../Component/CustomRadio';
import {RFValue} from 'react-native-responsive-fontsize';
import {toasterr, toastr} from '../../utils/commonToast';
import LinearGradient from 'react-native-linear-gradient';

import {ProfileContext} from '../../Services/ProfileProvider';
import HeaderDark from '../../Component/HeaderDark';
import {tabBarIcon} from '../../Component/ScreenComponenet/BottomTabItem';
import AppButton from '../../Component/AppButton';
import AppButton2 from '../../Component/AppButton2';
import {request, PERMISSIONS} from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import {assetsImages} from '../../utils/assets';

import TextInput2 from '../../Component/TextInput2';
import ErrorMessage from '../../Component/Form/ErrorMessage';
import {postApiCallFormData} from '../../Services/Network';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
const Account = props => {
  const {profileContextData, setProfileContextData} =
    useContext(ProfileContext);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [phone, setPhone] = useState('');
  const [show, setShow] = useState(false);

  const [countryShow, setCountryShow] = useState(false);
  const [errorMsg, setErrorMsg] = useState({
    isValidFirstName: true,
    isValidLastName: true,
    isValidPhone: true,
  });

  const [loading, setLoading] = useState(false);
  const [imageModal, setImageModal] = useState(false);

  const [profileImage, setProfileImage] = useState(
    assetsImages.noProfileImage2,
  );

  useEffect(() => {
    handleHeader();

    const unsubscribe = props.navigation.addListener('focus', async () => {
      handleHeader();
    });
    return unsubscribe;
  }, [profileContextData]);

  const handleHeader = () => {
    setProfileImage(profileContextData.profile_image);
    setFirstName(profileContextData.first_name);
    setLastName(profileContextData.last_name);
    setPhone(profileContextData.phone_number);
  };

  const onCamera = () => {
    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
    )
      .then(result => {
        //setPermissionResult(result)
        console.log(result);
        if (result == 'granted') {
          onCamera1();
        } else if (result == 'denied') {
          Alert.alert(
            'Camera Permission Denied',
            'Please give permission to access Camera through Setting',
          );
        } else if (
          result == 'blocked' ||
          result == 'limited' ||
          result == 'unavailable'
        ) {
          Alert.alert(
            `Camera Permission ${result}`,
            'Please grant permission to access Camera through Setting',
          );
        }
      })
      .catch(error => {
        console.log('Error===>', error);
        Alert.alert(error);
      });
  };
  const onCamera1 = () => {
    ImagePicker.openCamera({
      width: 1100,
      height: 1000,
      mediaType: 'photo',
      cropping: true,
      //compressImageQuality: 0.5,
    })
      .then(image => {
        console.log('Image==>', image);
        setProfileImage(image.path);

        setImageModal(false);
      })
      .catch(error => {
        console.log('User cancelled image selection from the Camera');
        console.log('Image Cancel error===>', error);
      });
  };
  const onGallery = () => {
    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    )
      .then(result => {
        //setPermissionResult(result)
        console.log('==========>', result);

        if (result == 'granted') {
          onGallery1();
        } else if (result == 'denied') {
          Alert.alert(
            'Read Media Permission Denied',
            'Please give permission to access Media through Setting',
          );
        } else if (
          result == 'blocked' ||
          result == 'limited' ||
          result == 'unavailable'
        ) {
          console.log('=======>', result);
          Alert.alert(
            `Read Media Permission ${result}`,
            'Please grant permission to access Media through Setting',
          );
        }
      })
      .catch(error => {
        console.log('Error===>', error);
        Alert.alert(error);
      });
  };
  const onGallery1 = () => {
    ImagePicker.openPicker({
      width: 1100,
      height: 1000,
      mediaType: 'photo',
      cropping: true,
      //compressImageQuality: 0.5,
    })
      .then(image => {
        console.log('Image==>', image);

        setProfileImage(image.path);

        setImageModal(false);
      })
      .catch(error => {
        console.log('User cancelled image selection from the gallery');
        console.log('Image Cancel error===>', error);
      });
  };

  const updateFunc = () => {
    if (firstName.trim() == '') {
      setErrorMsg({...errorMsg, isValidFirstName: false});
    } else if (lastName.trim() == '') {
      setErrorMsg({...errorMsg, isValidLastName: false});
    } else if (phone.trim() == '') {
      setErrorMsg({...errorMsg, isValidPhone: false});
    } else {
      updateFunc1();
    }
  };

  const updateFunc1 = async () => {
    console.log('&&&&&&&&&&&&&', profileImage);
    const data = new FormData();
    data.append('first_name', firstName.trim());
    data.append('last_name', lastName.trim());
    //data.append('username', profileContextData.username);
    data.append('phone', phone.trim());
    data.append('profile_img', {
      uri: profileImage,
      name: 'image.jpg',
      type: 'image/jpeg',
    });

    setLoading(true);
    await postApiCallFormData('/edit-profile', data, {})
      .then(response => {
        console.log('Response ===>', response.status, response.data);
        setLoading(false);
        if (response.data.status == true) {
          toastr.showToast(response.data.message);

          // setProfileContextData(response.data.data.data);
          let userData = profileContextData;
          userData.first_name = firstName.trim();
          userData.last_name = lastName.trim();
          userData.phone = phone.trim();
          userData.profile_image = response.data.profile_image_url;
          console.log('======userData=========>', userData);
          setProfileContextData({...userData});
        } else {
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
    <SafeAreaView style={{flex: 1, backgroundColor: mainColor}}>
      <LinearGradient
        colors={['#fff', '#064681', '#fff']}
        style={styles.linearGradient}>
        <View style={{height: calcH(0.07), width: calcW(0.98)}}>
          <HeaderDark
            headingName={'My Profile'}
            arrow={tabBarIcon('arrow-left')}
            onPress={() => props.navigation.goBack()}
            searchPress={() => props.navigation.navigate(routes.SearchItem)}
            navigation={props.navigation}
          />
        </View>

        <View
          style={{
            //width: width * 0.8,
            alignItems: 'center',
            marginTop: calcH(0.01),
            //backgroundColor: 'red',
            alignSelf: 'center',
          }}>
          <View
            style={{
              height: 110,
              width: 110,
              borderRadius: 110,
              alignItems: 'center',
              borderWidth: 3,
              borderColor: '#fff',
            }}>
            <Image
              source={{uri: profileImage}}
              style={{height: '100%', width: '100%', borderRadius: 110}}
              resizeMode="cover"
            />
          </View>

          <View
            style={{
              width: calcW(0.25),
              alignItems: 'flex-end',
              position: 'absolute',
              marginTop: 82,
              //top: 85,
            }}>
            <TouchableOpacity
              onPress={() => setImageModal(true)}
              style={{
                width: 35,
                height: 35,
                backgroundColor: mainColor,
                borderRadius: 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={{height: 25, width: 25}}>
                <Image
                  source={assetsImages.camera}
                  style={{height: '100%', width: '100%'}}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              alignItems: 'center',
              marginVertical: calcH(0.02),
              alignSelf: 'center',
            }}>
            <Text
              style={{
                fontSize: RFValue(20),
                fontFamily: Font.Bold,
                fontWeight: '900',
                color: colorSet.text1,
              }}>
              {profileContextData.username}
            </Text>
            <Text
              style={{
                fontSize: RFValue(15),
                fontFamily: Font.Regular,
                fontWeight: '900',
                color: colorSet.text1,
              }}>
              {profileContextData.email}
            </Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <KeyboardAvoidingScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={{
              width: '100%',
              height: '100%',
            }}>
            <View style={{marginBottom: calcH(0.08)}}>
              <TextInput2
                label={'First Name'}
                placeholder="First Name"
                onChangeText={val => {
                  setFirstName(val);
                }}
                value={firstName}
                isRequired={true}
              />

              <ErrorMessage
                error={'First Name is required'}
                visible={!errorMsg.isValidFirstName}
              />

              <TextInput2
                label={'Last Name'}
                placeholder="Last Name"
                onChangeText={val => {
                  setLastName(val);
                }}
                value={lastName}
                isRequired={true}
              />

              <ErrorMessage
                error={'Last Name is required'}
                visible={!errorMsg.isValidLastName}
              />
              <TextInput2
                label={'Phone'}
                placeholder="Phone"
                onChangeText={val => {
                  setPhone(val);
                }}
                keyboardType={'numeric'}
                value={phone}
                isRequired={false}
              />
              <ErrorMessage
                error={'Please enter Valid Phone Number'}
                visible={!errorMsg.isValidPhone}
              />
              <AppButton
                loading={loading}
                onPress={() => {
                  updateFunc();
                }}
                title={'UPDATE'}
                buttonStyle={{backgroundColor: mainColor, marginTop: 30}}
              />
              <AppButton2
                onPress={() => props.navigation.navigate(routes.ChangePassword)}
                title={'Change Password'.toUpperCase()}
                buttonStyle={{backgroundColor: '#fff'}}
              />
            </View>
          </KeyboardAvoidingScrollView>
        </View>
      </LinearGradient>

      {/* ****************************************Modal**************************************************** */}

      <Modal
        visible={imageModal}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={() => {
          setImageModal(false);
        }}>
        <Pressable
          onPress={() => setImageModal(false)}
          style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            flex: 1,
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              width: calcW(0.8),
              height: calcH(0.3),
              alignItems: 'center',
              //justifyContent: 'center',
              marginTop: calcH(0.3),
              borderRadius: 15,
            }}>
            <LinearGradient
              colors={['#fff', '#064681']}
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                borderRadius: 15,
              }}>
              <Text
                style={{
                  marginVertical: calcH(0.1),
                  fontSize: RFValue(22),
                  color: colorSet.backgroundColor,
                  fontFamily: Font.Bold,
                }}>
                Choose Media
              </Text>

              <View
                style={{
                  marginTop: calcH(0.05),
                  flexDirection: 'row',
                  width: '85%',
                  justifyContent: 'space-between',
                  position: 'absolute',
                  bottom: '15%',
                }}>
                <TouchableOpacity
                  style={{...styles.modalButton, backgroundColor: mainColor}}
                  onPress={() => onCamera()}>
                  <Text
                    style={{
                      ...styles.modalText,
                      color: colorSet.backgroundColor,
                    }}>
                    Launch Camera
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    ...styles.modalButton,
                    backgroundColor: colorSet.backgroundColor,
                  }}
                  onPress={() => onGallery()}>
                  <Text style={{...styles.modalText, color: mainColor}}>
                    Open Gallery
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </Pressable>
      </Modal>

      {/* ***************************************End of Modal******************************************** */}
    </SafeAreaView>
  );
};

export default Account;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
  },
  inputContainer: {
    backgroundColor: colorSet.backgroundColor,
    flex: 1,
    width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    // elevation: 5,
    // shadowColor: '#064681',
    padding: 25,
  },
  secondContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    alignItems: 'center',
    marginTop: calcH(0.02),
  },
  text: {
    marginLeft: 5,
    fontFamily: Font.Bold,
    color: '#fff',
  },
  radioText: {
    fontSize: RFValue(18),
    alignSelf: 'center',
    color: '#fff',
    fontFamily: Font.Regular,
  },

  modalButton: {
    width: calcW(0.32),
    height: 40,
    // backgroundColor: mainColor,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 3,
    // borderColor: mainColor,
  },
  modalText: {
    fontSize: 13,
    // color: colorSet.backgroundColor,
    fontFamily: Font.Medium,
  },
});
