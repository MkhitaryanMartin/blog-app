import TextArea from 'antd/es/input/TextArea';
import { Button, Flex } from 'antd';
import "./style.css"
import { useState } from 'react';

export default function CommentForm({
    placeholder="",
    handleSubmit,
    buttonText="",
    params,
    mode="comment-form"
}){

const [value, setValue] = useState("")
const onSubmit = (e)=>{
    e.preventDefault()
    handleSubmit({...params,text:e.target.comment.value})
    setValue("")
}
const onChange=(e)=>setValue(e.target.value)
    return (
        <form className={mode} onSubmit={onSubmit}>
            <TextArea
                placeholder={placeholder}
                rows={2}
                name='comment'
                className='comments-textarea'
                onChange={onChange}
                value={value}
                />
            <Button type="link" htmlType='submit' disabled={!(!!value) || !value.trim()}>{buttonText}</Button>
        </form>
    )
}