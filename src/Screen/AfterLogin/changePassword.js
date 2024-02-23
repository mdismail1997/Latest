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
import {Font} from '../../utils/font';
import {useDispatch, useSelector} from 'react-redux';
import routes from '../../Navigation/routes';
import SubmitButton from '../../Component/Form/SubmitButton';
import {toasterr, toastr} from '../../utils/commonToast';
import {colorSet, mainColor} from '../../utils/Color';
import {postApiCall} from '../../Services/Network';

const validationSchema = Yup.object().shape({
  old_password: Yup.string().required().label('Type Old Password'),
  new_password: Yup.string().required().label('Type New Password'),
  reType_password: Yup.string().required().label('Retype New Password'),
});

const initialValues = {
  old_password: '',
  new_password: '',
  reType_password: '',
};

const ChangePassword = props => {
  const [hideOldPassword, setHideOldPassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideConfirmNewPassword, setHideConfirmNewPassword] = useState(true);

  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();

  const {isLoggedIn} = useSelector(state => state.User);

  const handleSubmit = async ({
    old_password,
    new_password,
    reType_password,
  }) => {
    if (new_password != reType_password) {
      toasterr.showToast('new password and retype password should be same');
      return;
    }
    const data = {
      old_password: old_password,
      new_password: new_password,
    };

    setloading(true);
    await postApiCall('/change-password', {}, data)
      .then(response => {
        console.log('response==>', response.status, response);
        setloading(false);
        if (response.data.status == true) {
          toastr.showToast('Change Password Successfully');
          props.navigation.navigate(routes.Home);
        } else {
          toasterr.showToast(response.data.message);
        }
      })
      .catch(function (error) {
        setloading(false);
        if (error.response) {
          // Request made and server responded
          console.log('error in response==>', error.response.data);
          toasterr.showToast(error.response.data.message);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('error request===>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log(error.message);
        }
      });
  };

  return (
    <SafeView>
      <VStack>
        <AuthContainer
          header={true}
          headerName={'Change Password'}
          // arrow={tabBarIcon('arrow-left')}
          onPress={() => props.navigation.toggleDrawer()}
          searchPress={() => props.navigation.navigate(routes.SearchItem)}>
          <View style={styles.inputContainer}>
            <AppForm
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}>
              <AppFormField
                label="Type Old Password"
                placeholder="*****"
                name="old_password"
                icon="lock"
                autoCapitalize="none"
                // value={values.password}
                // onChangeText={handleSubmit('password')}
                secureTextEntry={hideOldPassword}
                InputRightElement={
                  <Pressable
                    onPress={() => setHideOldPassword(!hideOldPassword)}>
                    <Icon
                      as={
                        <MaterialCommunityIcons
                          name={
                            !hideOldPassword ? 'eye-outline' : 'eye-off-outline'
                          }
                          color={'#0000'}
                        />
                      }
                      size={5}
                      style={styles.iconStyle}
                    />
                  </Pressable>
                }
              />
              <AppFormField
                label="Type New Password"
                placeholder="*****"
                name="new_password"
                icon="lock"
                autoCapitalize="none"
                // value={values.password}
                // onChangeText={handleSubmit('password')}
                secureTextEntry={hideNewPassword}
                InputRightElement={
                  <Pressable
                    onPress={() => setHideNewPassword(!hideNewPassword)}>
                    <Icon
                      as={
                        <MaterialCommunityIcons
                          name={
                            !hideNewPassword ? 'eye-outline' : 'eye-off-outline'
                          }
                          color={'#0000'}
                        />
                      }
                      size={5}
                      style={styles.iconStyle}
                    />
                  </Pressable>
                }
              />
              <AppFormField
                label="Retype New Password"
                placeholder="*****"
                name="reType_password"
                icon="lock"
                autoCapitalize="none"
                // value={values.password}
                // onChangeText={handleSubmit('password')}
                secureTextEntry={hideConfirmNewPassword}
                InputRightElement={
                  <Pressable
                    onPress={() =>
                      setHideConfirmNewPassword(!hideConfirmNewPassword)
                    }>
                    <Icon
                      as={
                        <MaterialCommunityIcons
                          name={
                            !hideConfirmNewPassword
                              ? 'eye-outline'
                              : 'eye-off-outline'
                          }
                          color={'#0000'}
                        />
                      }
                      size={5}
                      style={styles.iconStyle}
                    />
                  </Pressable>
                }
              />
              <View style={styles.secondContainer}>
                <Text style={styles.text}>
                  *Password should be at least 8 characters long.{' '}
                </Text>
              </View>
              <SubmitButton title={'Submit'} loading={loading} />
            </AppForm>
          </View>
        </AuthContainer>
      </VStack>
    </SafeView>
  );
};

export default ChangePassword;

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

    // marginTop: calcH(0.1)
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
  iconStyle: {marginRight: 7},
});
