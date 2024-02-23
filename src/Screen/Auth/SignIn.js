import React, {Component, useEffect, useState, useContext} from 'react';
import * as Yup from 'yup';
import AuthContainer from '../../Component/AuthContainer';
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
import {Checkbox, HStack, Icon, Input, VStack} from 'native-base';
import {calcH, calcW} from '../../utils/Common';
import AppFormField from '../../Component/Form/AppFormField';
import {AppForm} from '../../Component/Form';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import AppButton from '../../Component/AppButton';
import {Font} from '../../utils/font';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import {assetsImages} from '../../utils/assets';
import {useDispatch, useSelector} from 'react-redux';
import {Login} from '../../reduxToolkit/CounterSlice';
import {Formik} from 'formik';
import routes from '../../Navigation/routes';
import Hud from '../../utils/hud';
import SubmitButton from '../../Component/Form/SubmitButton';
import {clearMessage} from '../../reduxToolkit/slices/message';
import {toastr} from '../../utils/commonToast';
import {colorSet, mainColor} from '../../utils/Color';
import {loginData} from '../../reduxToolkit/ApiFetch/loginSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TOKEN} from '../../utils/Keyword';
import {mmkvStore} from '../../utils/MmkvStorage';
import {ProfileContext} from '../../Services/ProfileProvider';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().label('Password'),
});

const initialValues = {
  // email: 'amit.singh@brainiuminfotech.com',\
  // email: 'amit123@gmail.com',
  // password: '12345678',
  email: '',
  password: '',
};

//   email- test@yopmail.com
// pass - Abc@12345

const SignIn = props => {
  const [show, setShow] = useState(false);
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();

  const {setToken} = useContext(ProfileContext);

  const {isLoggedIn} = useSelector(state => state.User);

  const handleSubmit = async ({email, password}) => {
    const data = {
      user_email: email,
      password: password,
    };
    console.log('data', data);
    setloading(true);
    dispatch(loginData(data)).then(async res => {
      console.log('login data', res);
      setloading(false);
      if (res.payload.message == 'Login successful') {
        await AsyncStorage.setItem(TOKEN, res.payload.token);
        setToken(res.payload.token);
        props.navigation.navigate(routes.Drawertab);
      } else {
        console.log('routing is not done');
      }
    });
  };

  return (
    <SafeView>
      <View style={{flex: 1, backgroundColor: colorSet.primarycolor}}>
        <AuthContainer
          title={'Login'}
          subtitle={'Enter Your Registered Mobile Number and Password'}>
          <View style={styles.inputContainer}>
            <AppForm
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}>
              <AppFormField
                label="Username Or Email Address"
                placeholder="admin@gmail.com"
                name="email"
                keyboardType="email-address"
                // value={values.email}
                // onChangeText={handleSubmit('email')}
              />
              <AppFormField
                label="Password"
                placeholder="*****"
                name="password"
                icon="lock"
                autoCapitalize="none"
                secureTextEntry={show}
                // value={values.password}
                // onChangeText={handleSubmit('password')}
                InputRightElement={
                  <Pressable onPress={() => setShow(!show)}>
                    <Icon
                      as={
                        <MaterialCommunityIcons
                          name={show ? 'eye-outline' : 'eye-off-outline'}
                          color={'#0000'}
                        />
                      }
                      size={5}
                      style={{marginRight: 7}}
                    />
                  </Pressable>
                }
              />
              <View style={styles.secondContainer}>
                <Checkbox
                  value="one"
                  my={1}
                  _text={{fontFamily: Font.Bold, color: '#fff'}}>
                  Remember Me
                </Checkbox>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate(routes.ForgetPassword)
                  }>
                  <Text style={[styles.text, {color: '#fff'}]}>
                    Forget Password?{' '}
                  </Text>
                </TouchableOpacity>
              </View>
              <SubmitButton title={'LOG IN'} loading={loading} />
            </AppForm>
            <Text style={[styles.text, {textAlign: 'center'}]}>OR</Text>
            <AppButton
              title={'Login With Facebook'}
              buttonStyle={{backgroundColor: '#3D6AD6'}}
              icon={
                <Ionicons
                  name="logo-facebook"
                  size={20}
                  style={{marginRight: calcW(0.02)}}
                  color={'#fff'}
                />
              }
            />
            <AppButton
              title={'Login With Google'}
              textStyle={{color: '#000'}}
              buttonStyle={{
                backgroundColor: '#F8F8F8',
                elevation: 2,
                shadowColor: '#000',
              }}
              icon={
                <Image
                  source={assetsImages.google}
                  style={{
                    width: calcH(0.02),
                    height: calcH(0.02),
                    marginRight: calcW(0.02),
                  }}
                />
              }
            />
            <HStack justifyContent={'center'}>
              <Text style={styles.text}>Dont Have An Account?</Text>
              <TouchableOpacity
                onPress={() => props.navigation.navigate(routes.SignUp)}>
                <Text style={[styles.text, {color: '#fff', marginLeft: 7}]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </HStack>
          </View>
        </AuthContainer>
      </View>
    </SafeView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: colorSet.backgroundColor,
    flex: 1,
    width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    elevation: 5,
    shadowColor: '#064681',
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
    fontFamily: Font.Bold,
    color: '#fff',
  },
});
