import React, {Component, useEffect, useState} from 'react';
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
} from 'react-native';
import SafeView from '../../Component/SafeView';
import {Checkbox, HStack, Icon, Input, VStack} from 'native-base';
import {calcH, calcW} from '../../utils/Common';
import AppFormField from '../../Component/Form/AppFormField';
import {AppForm} from '../../Component/Form';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import AppButton from '../../Component/AppButton';
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
import {toasterr} from '../../utils/commonToast';

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required().label('first_name'),
  last_name: Yup.string().required().label('last_name'),
  email: Yup.string().required().email().lowercase().label('email'),
  password: Yup.string().required().label('password'),
  confirm_password: Yup.string().required().label('confirm_password'),
  user_role: Yup.string().required().label('user_role'),
});

const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirm_password: '',
  user_role: 'customer',
};

const SignUp = props => {
  const [hidePassword, setHidePassword] = useState(true);
  const [confirmHidePassword, setConfirmHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const {isLoggedIn} = useSelector(state => state.User);

  const formik = useFormik({
    initialValues,
    validationSchema,
    handleSubmit,
  });

  const handleSubmit = async ({
    email,
    password,
    first_name,
    last_name,
    confirm_password,
  }) => {
    if (password !== confirm_password) {
      toasterr.showToast('Password and confirm password should be same');
      return false;
    }

    const data = {
      username: `${first_name} ${last_name}`,
      email: email,
      password: password,
      firstname: first_name,
      lastname: last_name,
      user_role: formik.values.user_role,
    };
    console.log('data', data);
    setLoading(true);
    await dispatch(signupData(data)).then(res => {
      console.log('success', res);
      setLoading(false);
      if (res.payload.message == 'User registered successfully') {
        props.navigation.navigate(routes.SignIn);
      } else {
        console.log('routing is not done');
      }
    });
  };

  return (
    <SafeView>
      <VStack>
        <AuthContainer
          title={'Create Account'}
          subtitle={'Enter Your Registered Mobile Number and Password'}>
          <View style={styles.inputContainer}>
            <AppForm
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}>
              <AppFormField
                isRequired
                label="First Name"
                placeholder="first name"
                name="first_name"
                // value={values.first_name}
                // onChangeText={handleChange('first_name')}
              />
              <AppFormField
                isRequired
                label="Last Name"
                placeholder="last name"
                name="last_name"
                // value={values.last_name}
                // onChangeText={handleChange('last_name')}
              />
              <AppFormField
                isRequired
                label="Email Address"
                placeholder="info@gmail.com"
                name="email"
                keyboardType="email-address"
                // value={values.email}
                // onChangeText={handleChange('email')}
              />
              <AppFormField
                isRequired
                label="Password"
                placeholder="*****"
                name="password"
                icon="lock"
                autoCapitalize="none"
                secureTextEntry={hidePassword}
                // value={values.password}
                // onChangeText={handleChange('password')}
                InputRightElement={
                  <Pressable
                    style={{marginRight: 7}}
                    onPress={() => setHidePassword(!hidePassword)}>
                    <Icon
                      as={
                        <MaterialCommunityIcons
                          name={
                            !hidePassword ? 'eye-outline' : 'eye-off-outline'
                          }
                          color={'#0000'}
                        />
                      }
                      size={5}
                    />
                  </Pressable>
                }
              />
              <AppFormField
                isRequired
                label="Confirm Password"
                placeholder="*****"
                name="confirm_password"
                icon="lock"
                autoCapitalize="none"
                // value={values.confirm_password}
                // onChangeText={handleChange('confirm_password')}
                secureTextEntry={confirmHidePassword}
                InputRightElement={
                  <Pressable
                    style={{marginRight: 7}}
                    onPress={() =>
                      setConfirmHidePassword(!confirmHidePassword)
                    }>
                    <Icon
                      as={
                        <MaterialCommunityIcons
                          name={
                            !confirmHidePassword
                              ? 'eye-outline'
                              : 'eye-off-outline'
                          }
                          color={'#0000'}
                        />
                      }
                      size={5}
                    />
                  </Pressable>
                }
              />

              <View style={{width: calcW(0.8), marginVertical: calcH(0.03)}}>
                <Text style={{color: '#fff', fontSize: RFValue(20)}}>
                  User Type
                </Text>

                <View
                  name="user_role"
                  id="user_role"
                  style={{
                    marginTop: calcH(0.01),
                    width: '70%',
                    alignSelf: 'flex-start',
                    //backgroundColor: 'red',
                    //height: 50,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      //width: '40%',
                      alignSelf: 'flex-start',
                      //backgroundColor: 'red',
                      //height: 50,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <CustomRadio
                      status={formik.values.user_role == 'customer'}
                      onPress={() => {
                        formik.setFieldValue('user_role', 'customer');
                      }}
                    />
                    <Text
                      onPress={() => {
                        formik.setFieldValue('user_role', 'customer');
                      }}
                      style={styles.radioText}>
                      Customer
                    </Text>
                  </View>

                  <View
                    style={{
                      alignSelf: 'flex-start',

                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <CustomRadio
                      status={formik.values.user_role == 'wcfm_vendor'}
                      onPress={() => {
                        formik.setFieldValue('user_role', 'wcfm_vendor');
                      }}
                    />

                    <Text
                      onPress={() => {
                        formik.setFieldValue('user_role', 'wcfm_vendor');
                      }}
                      style={styles.radioText}>
                      Seller
                    </Text>
                  </View>
                </View>
              </View>

              <Checkbox
                value="one"
                my={1}
                _text={{fontFamily: Font.Bold, color: '#fff'}}>
                I agree to Terms and Condition and the Privacy Policy
              </Checkbox>

              <SubmitButton title={'SIGN UP'} loading={loading} />
            </AppForm>
            <Text style={[styles.text, {textAlign: 'center'}]}>OR</Text>

            <HStack justifyContent={'center'}>
              <Text style={styles.text}>Have An Account?</Text>
              <TouchableOpacity
                onPress={() => props.navigation.navigate(routes.SignIn)}>
                <Text style={[styles.text, {color: '#fff'}]}>Login</Text>
              </TouchableOpacity>
            </HStack>
          </View>
          {/* {message && <>{toastr.showToast(message)}</>} */}
        </AuthContainer>
      </VStack>
    </SafeView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
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
});
