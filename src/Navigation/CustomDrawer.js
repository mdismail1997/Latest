import {Avatar, Divider} from 'native-base';
import React, {Component, useContext} from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import {assetsImages} from '../utils/assets';
import {colorSet, mainColor} from '../utils/Color';
import {calcH, calcW} from '../utils/Common';
import {Font} from '../utils/font';
import DrawerItem from '../Component/ScreenComponenet/DrawerItem';
import DrawerItem2 from '../Component/ScreenComponenet/DrawerItem2';
import routes from './routes';

import {ProfileContext} from '../Services/ProfileProvider';
import {TOKEN} from '../utils/Keyword';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomDrawer = props => {
  const {token, profileContextData, setToken, setProfileContextData} =
    useContext(ProfileContext);

  const doLogout = () => {
    Alert.alert(
      //title
      'Logout',
      //body
      'Are you sure want to logout ?',
      [
        {text: 'Yes', onPress: () => navigateToLogout()},
        {
          text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
      //clicking out side of alert will not cancel
    );
  };

  const navigateToLogout = async () => {
    await AsyncStorage.removeItem(TOKEN);
    setToken('');
    setProfileContextData('');
    props.navigation.closeDrawer();
    props.navigation.navigate(routes.Home);
  };

  console.log('===profileContextData=====>', profileContextData);

  return (
    <View style={styles.container}>
      {token == '' ? (
        <TouchableOpacity
          style={styles.firstContainer}
          onPress={() => {
            props.navigation.navigate(routes.SignIn);
          }}>
          <Avatar
            // source={assetsImages.noProfileImage}
            source={{uri: assetsImages.noProfileImage2}}
            bg="cyan.500"
            size="md"
          />
          <View
            style={{
              marginLeft: 10,
              // backgroundColor: 'red',
              width: '80%',
            }}>
            <Text
              style={{
                color: '#ddd',
                fontSize: calcW(0.05),
                fontFamily: Font.Bold,
              }}>
              Sign In / Sign Up
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.firstContainer}>
          {/* <Avatar
            source={{uri: profileContextData.profile_image}}
            bg="cyan.500"
            size="md"
          /> */}
          <Image
            source={{
              uri:
                profileContextData == null
                  ? assetsImages.noProfileImage2
                  : profileContextData.profile_image,
            }}
            style={{
              height: 50,
              width: 50,
              borderRadius: 100,
              resizeMode: 'cover',
            }}
          />
          <View
            style={{
              marginLeft: 5,
              // backgroundColor: 'red',
              width: '80%',
            }}>
            <Text
              onPress={() => props.navigation.navigate(routes.Account)}
              style={{
                color: '#ddd',
                fontSize: calcW(0.06),
                fontFamily: Font.Bold,
              }}>
              {profileContextData?.username == ''
                ? 'Richard Wilson'
                : profileContextData.username}
            </Text>
            <Text
              onPress={() => props.navigation.navigate(routes.Account)}
              style={{
                color: '#fff',
                fontSize: calcW(0.04),
                fontFamily: Font.Regular,
              }}>
              {profileContextData.email}
            </Text>
          </View>
        </View>
      )}

      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 10,
          marginLeft: 0,
          borderWidth: 0,
          width: '100%',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '100%',
            marginVertical: calcH(0.02),
            alignSelf: 'center',
            // alignItems: 'center',
            padding: 15,
          }}>
          <DrawerItem
            name={'lock-outline'}
            menuName={'Home'}
            onPress={() => props.navigation.navigate(routes.Home)}
          />
          {!token == '' && (
            <>
              <DrawerItem
                name={'lock-outline'}
                menuName={'Change Password'}
                onPress={() => props.navigation.navigate(routes.ChangePassword)}
              />

              <DrawerItem name={'cog-outline'} menuName={'Settings'} />

              <DrawerItem2
                onPress={() => {
                  props.navigation.navigate(routes.OrderDetails);
                }}
                icon={assetsImages.cart2}
                menuName={'Order'}
                color={'#fff'}
              />
              <DrawerItem2
                onPress={() => {
                  props.navigation.navigate(routes.Wishlist);
                }}
                icon={assetsImages.wishlist}
                menuName={'Wishlist'}
                color={'#fff'}
              />

              {profileContextData.profile_type == 'wcfm_vendor' && (
                <>
                  {/* <DrawerItem2
                    icon={assetsImages.DocumentUpload}
                    menuName={'Upload Document'}
                    color={'#fff'}
                  />
                  <DrawerItem2
                    icon={assetsImages.Projection}
                    menuName={'Projection'}
                    color={'#fff'}
                  />
                  <DrawerItem2
                    onPress={() =>
                      props.navigation.navigate(routes.RatingReview)
                    }
                    icon={assetsImages.ReviewRating}
                    menuName={'Review & Rating'}
                    color={'#fff'}
                  /> */}
                  <DrawerItem2
                    onPress={() => {
                      props.navigation.navigate(routes.EditProduct);
                    }}
                    icon={assetsImages.Projection}
                    menuName={'Product Management'}
                    color={'#fff'}
                  />
                </>
              )}
            </>
          )}

          <DrawerItem2
            onPress={() => props.navigation.navigate(routes.TermsCondition)}
            icon={assetsImages.TandC}
            menuName={'Terms & Condition'}
            color={'#fff'}
          />

          <DrawerItem2
            onPress={() => props.navigation.navigate(routes.HelpSupport)}
            icon={assetsImages.HelpSupport}
            menuName={'Help and Support'}
            color={'#fff'}
          />
          {!token == '' && (
            <DrawerItem2
              icon={assetsImages.logout2}
              menuName={'Logout'}
              color={'#FCB800'}
              onPress={() => doLogout()}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorSet.backgroundColor,
  },
  firstContainer: {
    flexDirection: 'row',
    // flex: 1,
    padding: 15,
    alignItems: 'center',
    //justifyContent: 'space-between',
    backgroundColor: '#064681',
  },
  secondContainer: {
    marginTop: calcH(0.02),
    padding: 15,
  },
});
