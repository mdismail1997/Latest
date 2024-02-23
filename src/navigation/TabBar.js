import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import Tab from './Tab';
import { color } from '../assets/colors/colors';

const { width } = Dimensions.get('screen');

const TabBar = ({ state, navigation }) => {

  const [selected, setSelected] = useState('calendar');
  const { routes } = state;
  let role = typeof(routes[0].params) != "undefined" ? routes[0].params.role : '';
  const renderColor = currentTab => (currentTab === selected ? 'white' : 'black');
  const handlePress = (activeTab, index) => {
    if (state.index !== index) {
      setSelected(activeTab);
      navigation.navigate(activeTab);
    }
  };
  const setActiveTabPress = (activeTab) => {
      setSelected('more');
  };
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {routes.map((route, index) => {
          if(index < 4){
            return(
              <Tab
              navigation={navigation}
              tab={route}
              icon={route.params.icon}
              onPress={() => handlePress(route.name, index)}
              color={renderColor(route.name)}
              key={route.key}
              activeTab={setActiveTabPress}
              role={role}
            />
            )
          }

      }
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height:70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: color.reddish,
    width: "100%",
    elevation: 2,
  },
});

export default TabBar;