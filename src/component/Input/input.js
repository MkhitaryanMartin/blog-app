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
    setValue(event.target.value);
    onChangeDebounce(event.target.value);
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