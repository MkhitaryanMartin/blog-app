import TextArea from 'antd/es/input/TextArea';
import { Button, Flex, Modal } from 'antd';
import "./style.css"
import { useState } from 'react';
import { SmileTwoTone } from '@ant-design/icons'
import EmojiPicker from 'emoji-picker-react';

export default function CommentForm({
    placeholder = "",
    handleSubmit,
    buttonText = "",
    params,
    mode = "comment-form"
}) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [value, setValue] = useState("")
    const onSubmit = (e) => {
        e.preventDefault()
        handleSubmit({ ...params, text: e.target.comment.value })
        setValue("")
    }
    const onChange = (e) => setValue(e.target.value)

    const handleEmojiClick = (emoji) => {
        const newValue = value + emoji.emoji;
        setValue(newValue);
        setIsModalOpen(false);
    };
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
            <button 
            className='emoji_button'
            onClick={(e) => {
                e.preventDefault()
                setIsModalOpen(true)
            }} ><SmileTwoTone /></button>
            <Modal title="Emoji" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} style={{ top: 350 }} >
                <EmojiPicker onEmojiClick={handleEmojiClick} style={{ height: "300px", width: "auto" }} />
            </Modal>
        </form>
    )
}