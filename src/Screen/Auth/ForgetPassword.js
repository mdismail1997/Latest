import React, {Component, useEffect, useState} from 'react';
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
import {toasterr, toastr} from '../../utils/commonToast';
import {colorSet, mainColor} from '../../utils/Color';
import {loginData} from '../../reduxToolkit/ApiFetch/loginSlice';
import HeaderComponent from '../../Component/Header';
import {tabBarIcon} from '../../Component/ScreenComponenet/BottomTabItem';
import {changePasswordData} from '../../reduxToolkit/ApiFetch/changePasswordSlice';
import {forgetPasswordData} from '../../reduxToolkit/ApiFetch/forgetPasswordSlice';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
});

const initialValues = {
  email: '',
};

const ForgetPassword = props => {
  const [show, setShow] = useState(false);
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();

  const {isLoggedIn} = useSelector(state => state.User);

  const handleSubmit = async ({email}) => {
    const data = {
      email: email,
    };
    console.log('data', data);
    setloading(true);
    dispatch(forgetPasswordData(data)).then(res => {
      console.log('login data', res);
      setloading(false);
      //         if(res.payload.message == "Login successful"){
      // props.navigation.navigate(routes.Drawertab);
      //         }else{
      //           console.log("routing is not done");
      //         }
    });
  };

  return (
    <SafeView>
      <VStack>
        <AuthContainer
          header={true}
          headerName={'Forget Password'}
          icons={true}
          // arrow={tabBarIcon('arrow-left')}
          onPress={() => props.navigation.goBack()}
          searchPress={() => props.navigation.navigate(routes.SearchItem)}>
          <View style={styles.inputContainer}>
            <AppForm
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}>
              <AppFormField
                label="Enter your email address"
                placeholder="admin@gmail.com"
                name="email"
                keyboardType="email-address"
                // value={values.email}
                // onChangeText={handleSubmit('email')}
              />
              {/* <View style={styles.secondContainer}>
                
                  <Text style={styles.text}>*Password should be at least 8 characters long. </Text>
               
              </View> */}
              <View style={{marginTop: calcH(0.1)}}>
                <SubmitButton title={'Submit'} loading={loading} />
              </View>
            </AppForm>
          </View>
        </AuthContainer>
      </VStack>
    </SafeView>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: colorSet.primarycolor,
    // flex: 1,
    height: calcH(0.58),
    width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    elevation: 5,
    shadowColor: '#064681',
    padding: 25,
    marginTop: calcH(0.1),
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
