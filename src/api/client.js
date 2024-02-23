import axios from 'axios';
import {TOKEN} from '../utils/Keyword';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {cart_base_url} from '../Services/Constants';

const client = axios.create({
  baseURL: 'https://market2.store/wp-json/custom-api/v1',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
// const token = JSON.parse(AsyncStorage.getItem(TOKEN));
// console.log(' token ', JSON.parse(AsyncStorage.getItem(TOKEN)));
//client.defaults.headers.post['Content-Type'] = 'application/json';

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN);
    console.log('Token from AsyncStorage:', token); // Log the actual value
    console.log('Parsed token:', JSON.parse(token));
    return token;
  } catch (error) {
    console.error('Error while getting token from AsyncStorage', error);
    return null;
  }
};

export const clientTOken = axios.create({
  baseURL: 'https://market2.store/wp-json/custom-api/v1/',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const cartTOken = axios.create({
  baseURL: cart_base_url,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export default client;
clientTOken.interceptors.request.use(async function (config) {
  const token = await AsyncStorage.getItem(TOKEN);
  console.log('token', token);
  config.headers.Authorization = token ? token : '';
  return config;
});
cartTOken.interceptors.request.use(async function (config) {
  const token = await AsyncStorage.getItem(TOKEN);
  console.log('token', token);
  config.headers.Authorization = token ? token : '';
  return config;
});
