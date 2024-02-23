import {useFormikContext} from 'formik';
import React from 'react';
import AppButton from '../AppButton';

const SubmitButton = ({title, buttonStyle, loading}) => {
  const {handleSubmit} = useFormikContext();

  return (
    <>
      <AppButton
        loading={loading}
        title={title}
        onPress={handleSubmit}
        buttonStyle={buttonStyle}
      />
    </>
  );
};

export default SubmitButton;
