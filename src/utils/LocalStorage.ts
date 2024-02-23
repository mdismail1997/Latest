import AsyncStorage from "@react-native-async-storage/async-storage";

const token_key = "@Token";
const usertype_key = "@UserType";
const userName_key = "@UserId";
const username_key = "@Username";
const tradieEmail_key = "@TradieEmail";
const tradiePWD_key = "@TradiePWD";
const email_key = "@Email";
const password_key = "@Password";
const history_key = "@Histort";
const chooseRole_key = "@ChooseRole";
const acceptTerms_key = "@AcceptTerms_key";
const submitFeedback_key = "@SubmitFeedback";

export const getUserAccount = async () => {
  let values;
  try {
    values = await AsyncStorage.multiGet([username_key, password_key]);
    console.log("getUserAccount", values);
    return values;
  } catch (e) {
    // read error
  }
  return [];
};

export const getTradieAccount = async () => {
  let values;
  try {
    values = await AsyncStorage.multiGet([tradieEmail_key, tradiePWD_key]);
    console.log("getTradieAccount", values);
    return values;
  } catch (e) {
    // read error
  }
  return [];
};

export const getToken = async () => {
  let values: string | null = null;
  try {
    values = await AsyncStorage.getItem(token_key);
    console.log("getToken", values);
    return values;
  } catch (e) {
    // read error
  }
  return values;
};

export const getPassword = async () => {
  let values;
  try {
    values = await AsyncStorage.getItem(password_key);
    console.log("getPassword", values);
    return values;
  } catch (e) {
    // read error
  }
  return values;
};

export const getUserInfo = async () => {
  let values;
  try {
    values = await AsyncStorage.multiGet([
      token_key,
      usertype_key,
      userName_key,
    ]);
    console.log("getUserInfo", values);
    return values;
  } catch (e) {
    // read error
  }
  return [];
};

export const getHistorySearch = async () => {
  let value;
  try {
    value = await AsyncStorage.getItem(history_key);
    return value;
  } catch (e) {
    // read error
  }
  return value;
};

export const getChooseRole = async () => {
  let value;
  try {
    value = await AsyncStorage.getItem(chooseRole_key);
    return value;
  } catch (e) {
    // read error
  }
  return value;
};

export const getSubmitFeedback = async () => {
  let value;
  try {
    value = await AsyncStorage.getItem(submitFeedback_key);
    return value;
  } catch (e) {
    // read error
  }
  return value;
};

export const getAcceptTerms = async () => {
  let value;
  try {
    value = await AsyncStorage.getItem(acceptTerms_key);
    return value;
  } catch (e) {
    //save error
  }

  console.log("storeAcceptTerms");
};
getSubmitFeedback;

export const setSubmitFeedback = async () => {
  try {
    await AsyncStorage.setItem(submitFeedback_key, "1");
  } catch (e) {
    //save error
  }
};

export const storeAcceptTerms = async (value: string) => {
  try {
    await AsyncStorage.setItem(acceptTerms_key, value);
  } catch (e) {
    //save error
  }

  console.log("storeAcceptTerms");
};

export const storeChooseRole = async (value: string) => {
  try {
    await AsyncStorage.setItem(chooseRole_key, value);
  } catch (e) {
    //save error
  }

  console.log("storeHistorySearch");
};

export const storeHistorySearch = async (value: string) => {
  try {
    await AsyncStorage.setItem(history_key, value);
  } catch (e) {
    //save error
  }

  console.log("storeHistorySearch");
};

export const storeUserAccount = async (username: string, pwd: string) => {
  const name: [string, string] = [username_key, username + ""];
  const password: [string, string] = [password_key, pwd + ""];

  try {
    await AsyncStorage.multiSet([name, password]);
  } catch (e) {
    //save error
  }

  console.log("storeUserAccount");
};

export const storeTradieAccount = async (username: string, pwd: string) => {
  const name: [string, string] = [tradieEmail_key, username + ""];
  const password: [string, string] = [tradiePWD_key, pwd + ""];

  try {
    await AsyncStorage.multiSet([name, password]);
  } catch (e) {
    //save error
  }

  console.log("storeUserAccount");
};

export const storeUserInfo = async (
  token: string,
  userName: string,
  userType: string
) => {
  const appToken: [string, string] = [token_key, token + ""];
  const loginType: [string, string] = [usertype_key, userType + ""];
  const name: [string, string] = [userName_key, userName + ""];

  try {
    await AsyncStorage.multiSet([appToken, loginType, name]);
  } catch (e) {
    //save error
  }

  console.log("storeUserInfo");
};

/**
 * not include last_success_change_pwd
 * @returns {Promise<void>}
 */
export const logoutClearAll = async () => {
  try {
    await AsyncStorage.removeItem(token_key);
    await AsyncStorage.removeItem(usertype_key);
    await AsyncStorage.removeItem(userName_key);
    await AsyncStorage.removeItem(username_key);
    await AsyncStorage.removeItem(tradieEmail_key);
    await AsyncStorage.removeItem(tradiePWD_key);
    await AsyncStorage.removeItem(password_key);
    await AsyncStorage.removeItem(history_key);
    await AsyncStorage.removeItem(chooseRole_key);
  } catch (e) {
    console.log("", e);
  }
};
