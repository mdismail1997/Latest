import {Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRevisionByKey, updateRevisionData, getRevisionDataByKey } from "./Revision";
import config from "../constants/Config";
import * as FileSystem from 'expo-file-system';

import {
    getUserData
} from "../helpers/authenticate";


export async function getBackground(){   
    let userData = await getUserData();
    let revisionData = await getRevisionByKey('background_app','background_app_revision',userData);
    let revision = revisionData.revision;
    let data_background_revision = revisionData.data_revision;
    if (data_background_revision == ""
    || (data_background_revision != "" && parseInt(data_background_revision) < revision)){
        //download background and save to local for offline use
        let filename = '';    
        
        let backgroundAppFilename = await getRevisionDataByKey('background_app',revision,userData);
        if(backgroundAppFilename != ''){
            
            FileSystem.downloadAsync(
                config.domain + '/public/uploads/background_app/' + backgroundAppFilename,
                FileSystem.documentDirectory + backgroundAppFilename
            )
            .then(({ uri }) => {
                filename = FileSystem.documentDirectory + backgroundAppFilename;
                AsyncStorage.setItem('background_app', filename);
                updateRevisionData('background_app_revision',revisionData,userData);
            })
            .catch(error => {
                console.error(error);
            });
            
        }else{
            AsyncStorage.setItem('background_app', '');
            updateRevisionData('background_app_revision',revisionData,userData);
        }
        return filename;
    }else{
        var filename = await AsyncStorage.getItem('background_app').then(background => {
            return background;
        });        
        return filename;
    }

}

export async function getLogo(){  
    let userData = await getUserData();
    let revisionData = await getRevisionByKey('checkinlogo_app','checkinlogo_app_revision',userData);
    let revision = revisionData.revision;
    let data_background_revision = revisionData.data_revision;
    var filenameLogo = await AsyncStorage.getItem('checkinlogo_app').then(background => {
        return background;
    }); 

    if (filenameLogo == null || data_background_revision == "" || (data_background_revision != "" && parseInt(data_background_revision) < revision)){
        let filename = '';    
        let backgroundAppFilename = await getRevisionDataByKey('checkinlogo_app',revision,userData);
        if(backgroundAppFilename != ''){
            await FileSystem.downloadAsync(
                config.domain + '/public/uploads/logo/' + encodeURIComponent(backgroundAppFilename),
                FileSystem.documentDirectory + encodeURIComponent(backgroundAppFilename)
            )
            .then(({ uri }) => {
            
                filename = FileSystem.documentDirectory + encodeURIComponent(backgroundAppFilename);
                
                AsyncStorage.setItem('checkinlogo_app', filename);
                updateRevisionData('checkinlogo_app_revision',revisionData,userData);
            })
            .catch(error => {
                console.error(error);
            });
            
        }else{
            AsyncStorage.setItem('checkinlogo_app', '');
            updateRevisionData('checkinlogo_app_revision',revisionData,userData);
        }
       
        return filename;
    }else{
        var filename = await AsyncStorage.getItem('checkinlogo_app').then(background => {
            return background;
        });  
        if(filename != '' && filename != null){
            var file = await FileSystem.getInfoAsync(filename);
            if(file.exists){
                return filename;
            }else{
                return '';
            }
        }else{
            
            return '';
        }
        
   
    }

}