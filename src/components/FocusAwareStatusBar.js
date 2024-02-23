import * as React from 'react';
import {StatusBar} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import { color } from '../assets/colors/colors';

const FocusAwareStatusBar = (props) => {
  const isFocused = useIsFocused();
  return isFocused ? (
    <StatusBar
      {...props}
      backgroundColor={color.darkCyan} barStyle={'light-content'}
    />
  ) : null;
};

export {FocusAwareStatusBar};
export default FocusAwareStatusBar;
