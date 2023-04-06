import React, { useEffect, useState } from 'react';

import {
  TextInput,
} from 'react-native';
import { inputStyle, inputStyleBlack, secondaryBackgroundColor } from '../assets/styles';


function InputConponents( {placeholder, value=null , inputValue ,style} :any): JSX.Element {
	const [ changedValue ,setChangeValue ] = useState();
  useEffect(() => {
    // console.log(style);
  } , [])

	const onChnageText = (value:any) => {
		setChangeValue(value);
		inputValue(value);
	}
	return (
        <TextInput
            onChangeText={(event) => { onChnageText(event) }}
            style={[style ]}
            placeholder={placeholder}
            keyboardType="default"
            defaultValue={value}
            placeholderTextColor={secondaryBackgroundColor}
        />
    );
}

export default InputConponents;
