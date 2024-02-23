import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {base_url, cart_base_url} from './Constants';
import {TOKEN} from '../utils/Keyword';

//....for Get method Api......
export async function getApicall(url, data, params) {
  const AccessToken = await AsyncStorage.getItem(TOKEN);

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
    Authorization: AccessToken,
  };
  const paramsData = {
    Authorization: AccessToken,
    ...params,
  };

  const response = axios.get(`${base_url}${url}`, {
    data,
    params: paramsData,
    headers,
  });
  return response;
}

///......for Post method Api.....
export const postApiCall = async (url, data, params) => {
  let AccessToken = await AsyncStorage.getItem(TOKEN);

  console.log('Post Api===>', `${base_url}${url}`, AccessToken);
  let headers = {
    'Content-Type': 'application/json',
    Authorization: AccessToken,
  };
  const paramsData = {
    Authorization: AccessToken,
    ...params,
  };
  const response = await axios.post(`${base_url}${url}`, data, {
    params: paramsData,
    headers,
  });
  return response;
};

///......for Post method Api in Form data.....
export const postApiCallFormData = async (url, data, params) => {
  let AccessToken = await AsyncStorage.getItem(TOKEN);
  let headers = {
    'Content-Type': 'multipart/form-data',
    Authorization: AccessToken,
  };
  const paramsData = {
    Authorization: AccessToken,
    ...params,
  };

  const AccessToken1 =
    'c83e79779a9ffad98ac714310855e46dad30f16c0cbecd65787b6a72ac7a8knc';

  console.log('================>', AccessToken);
  const response = await axios.post(`${base_url}${url}`, data, {
    params: paramsData,
    headers,
  });
  return response;
};

// export async function getCartApicall(url, data, params) {
//   const AccessToken = await AsyncStorage.getItem(TOKEN);

//   //console.log('Get Api===>', `${base_url}${url}`);
//   const headers = {
//     Accept: 'application/json',
//     'Content-Type': 'multipart/form-data',
//     Authorization: AccessToken,
//   };
//   const paramsData = {
//     Authorization: AccessToken,
//     ...params,
//   };

//   const response = axios.get(`${cart_base_url}${url}`, {
//     data,
//     params: paramsData,
//     headers,
//   });
//   return response;
// }

// ///......for Post method Api.....
// export const cartPostApiCall = async (url, data, params) => {
//   let AccessToken = await AsyncStorage.getItem(TOKEN);

//   console.log('Post Api===>', `${cart_base_url}${url}`, AccessToken);
//   let headers = {
//     'Content-Type': 'application/json',
//     Authorization: AccessToken,
//   };
//   const paramsData = {
//     Authorization: AccessToken,
//     ...params,
//   };
//   const response = await axios.post(`${base_url}${url}`, data, {
//     params: paramsData,
//     headers,
//   });
//   return response;
// };
