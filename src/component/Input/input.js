import {useCallback, useLayoutEffect, useState, memo} from 'react';
import debounce from 'lodash.debounce';
import { Input as AntInput } from 'antd';
import './style.css';

function Input(props) {


  const [value, setValue] = useState(props.value);

  const onChangeDebounce = useCallback(
    debounce(value => props.onChange(value), 600),
    [props.onChange]
  );


  const onChange = (event) => {
    const newValue = event.target.value
    if (newValue === ' '){
      return 
    }else{
      setValue(newValue);
      onChangeDebounce(newValue);
    }
  };

  useLayoutEffect(() => setValue(props.value), [props.value]);


  return (
    <AntInput
      value={value}
      placeholder={props.placeholder}
      onChange={onChange}
      className='castom-input'
    />
  )
}



export default memo(Input);