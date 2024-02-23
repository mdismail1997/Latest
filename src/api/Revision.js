import AsyncStorage from '@react-native-async-storage/async-storage';
export async function getRevisionByKey(key,storage_key,userData){
    
     let storage_key_owner = userData.id;
     if(userData.role == 9 || userData.role == 13){
         storage_key_owner = userData.serviceprovider_id;
     }
 
     let revision = 0;
     if (typeof (userData.settings[key]) != 'undefined') {
         revision = userData.settings[key] == "" ? 0 : parseInt(userData.settings[key]);
     }
     var data_revision = await AsyncStorage.getItem(storage_key + '_' + storage_key_owner).then(service_revision => {
         if (service_revision == null) return "";
         else return service_revision;
     });
     return {revision,data_revision};
 }
 
 export function updateRevisionData(storage_key,data,userData){
     
     let storage_key_owner = userData.id;
     if(userData.role == 9 || userData.role == 13){
         storage_key_owner = userData.serviceprovider_id;
     }
     if (data.data_revision == "") {
         AsyncStorage.setItem(storage_key + '_' + storage_key_owner, "0");
     } else AsyncStorage.setItem(storage_key + '_' + storage_key_owner, data.revision.toString());
 }

 export async function getRevisionDataByKey(key,revision,userData){
    
     let storage_key_owner = userData.id;
     if(userData.role == 9 || userData.role == 13){
         storage_key_owner = userData.serviceprovider_id;
     }
 
     let revisionData = '';
     if (typeof (userData.settings[key + '_' + revision]) != 'undefined') {
         revisionData = userData.settings[key + '_' + revision];
     }
     return revisionData;

 }
 