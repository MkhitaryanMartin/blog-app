import TextArea from 'antd/es/input/TextArea';
import { Button, Flex } from 'antd';
import "./style.css"

export default function CommentForm({
    placeholder="",
    handleSubmit,
    buttonText="",
    params,
    mode="comment-form"
}){
   
const onSubmit = (e)=>{
    e.preventDefault()
    handleSubmit({...params,text:e.target.comment.value})
}
    return (
        <form className={mode} onSubmit={onSubmit}>
            <TextArea
                placeholder={placeholder}
                rows={2}
                name='comment'
                className='comments-textarea'
                />
            <Button type="link" htmlType='submit'>{buttonText}</Button>
        </form>
    )
}