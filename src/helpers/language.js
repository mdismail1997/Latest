import {Alert } from "react-native";
import setting from "../constants/Setting";
import englishLanguage from "../languages/en-US";
import vietnameLanguage from "../languages/vi-VN";
import AsyncStorage from '@react-native-async-storage/async-storage';
export async function getLanguage() {
    var data = await AsyncStorage.getItem(setting.language).then(token => {
        if (token == null || token == "") {
            return 'en-US';
        } else {
            return token;
        }
    });
    if(data == '') data = 'en-US';
    return data;
}

export async function getLanguageName(){
    let languageName = await getLanguage();
    let languageList = {};
    languageList['en-US'] = 'English';
    languageList['vi-VN'] = 'Việt Nam';
    return languageList[languageName];
}

export function getTextByKey(languageKey,textKey){
    let textLang = '';
    switch(languageKey){
        case 'en-US':
            textLang = englishLanguage[textKey];


            break;
        case 'vi-VN':
            textLang = vietnameLanguage[textKey];
            break;    
    }
    return textLang;
}


