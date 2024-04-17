export default function CommentForm({
    placeholder="",
    handleSubmit,
    buttonText="",
    params
}){
   
const onSubmit = (e)=>{
    e.preventDefault()
    handleSubmit({...params,text:e.target.comment.value})
}
    return (
        <form className="comment-form" onSubmit={onSubmit}>
            <input type="text" placeholder={placeholder} name="comment"/>
            <button type="submit">{buttonText}</button>
        </form>
    )
}