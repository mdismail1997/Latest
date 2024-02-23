import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, window } from 'react-native';

import { RootStackParamList } from '../../types';
import { color } from '../assets/colors/colors';

//  export default function NotFoundScreen  ({navigation})
 export default class NotFoundScreen extends React.Component 
{
  callfunction(){
    window.helloComponent.alertMessage();
    this.props.navigation.navigate('tab', {'abc': 123});
  }
render(){
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This screen doesn't exist1.</Text>
      <TouchableOpacity onPress={() => this.callfunction()} style={styles.link}>
        <Text style={styles.linkText}>Go to home screen!</Text>
      </TouchableOpacity>
    </View>
  );
}


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
