import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { getLanguageName, getLanguage, getTextByKey } from "../helpers/language";
import AntDesign from 'react-native-vector-icons/AntDesign';
import  Addbutton  from './Addbutton';
const Tab = ({ navigation,color, tab, onPress, icon, activeTab, role }) => {
  let tabname = '';
  let iconname = '';
switch(tab.name){
  case 'dashboard':
    tabname = getTextByKey(tab.params.languageKey, "dashboardtab");
    iconname = 'home';
    break;
  case 'calendar':
    tabname = getTextByKey(tab.params.languageKey, "calendartab");
    iconname = 'calendar';
    break;
  case 'waitlist':
    tabname = getTextByKey(tab.params.languageKey, "waitlisttab");
    iconname = 'book';
    break;
    case 'clients':
      tabname = getTextByKey(tab.params.languageKey, "clientstab");
      iconname = 'user';
      break;
      case 'blockedtime':
        tabname = getTextByKey(tab.params.languageKey, "blockedtimetab");
        iconname = 'clockcircleo';
        break;
}

if(tab.name == 'more'){
    return <Addbutton navigation={navigation} route={tab} color={color} onPress={activeTab} role={role}  />;
}else{
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
          <AntDesign name={iconname} size={20} color={color} />
          <Text style={{ color }}>{tabname}</Text>
        </TouchableOpacity>
      );
} 
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
});

export default Tab;