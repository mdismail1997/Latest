import {MMKV} from 'react-native-mmkv';

const prefix = 'cache';
// const expiryInMinutes = 5;

const storage = new MMKV();

const mmkvStore = (key, value) => {
  try {
    storage.set(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  } finally {
    console.log(`store successfull`);
  }
};

const mmkvGet = key => {
  try {
    const value = storage.getString(key);
    return value != null ? JSON.parse(value) : null;
  } catch (error) {
    console.log(error);
  }
};

const mmkvRemove = key => {
  try {
    storage.delete(key);
  } catch (e) {
    console.log(e);
  }
};

const mmkvRemoveAll = () => {
  try {
    storage.clearAll();
  } catch (e) {
    console.log(e);
  }
};

const mmkvGetAllKeys = () => {
  try {
    storage.getAllKeys();
  } catch (e) {
    console.log(e);
  }
};

const mmkvListener = key => {
  storage.addOnValueChangedListener(key => {
    const newValue = storage.getString(key);
    console.log(`"${key}" new value: ${newValue}`);
  });
};

const mmkvStoreTemp = (key, value) => {
  try {
    const obj = {
      value,
      timestamp: new Date(),
    };
    storage.set(prefix + key, JSON.stringify(obj));
  } catch (error) {
    console.log(`error storing storage data storeTemp`, error);
  } finally {
    //console.log(`storeTemp successfull`);
  }
};

export default {
  mmkvStore,
  mmkvGet,
  mmkvRemove,
  //   getTemp,
  mmkvStoreTemp,
  mmkvListener,
  mmkvRemoveAll,
  mmkvGetAllKeys,
};
