import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useFormikContext} from 'formik';
import ErrorMessage from './ErrorMessage';
import AppTextInput from './AppTextInput';

const AppFormField = ({
  name,
  width,
  secureTextEntry,
  initialValue,
  ...otherProps
}) => {
  //console.log(FormikContext);

  const {handleChange, setFieldTouched, errors, touched} = useFormikContext();

  return (
    <>
      <AppTextInput
        textInputStyle={{flex: 1}}
        onBlur={() => setFieldTouched(name)}
        onChangeText={handleChange(name)}
        value={initialValue}
        {...otherProps}
        width={width}
        secureTextEntry={secureTextEntry}
      />

      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
};

export default AppFormField;
