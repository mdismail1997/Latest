import {
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  View,
  ScrollView,
} from 'react-native';
import React from 'react';
import {colorSet} from '../utils/Color';

const SafeView = ({children, style}) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.view, style]}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SafeView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: colorSet.backgroundColor,
  },
  view: {
    height: '100%',
    width: '100%',
    marginBottom: 50,
  },
});
