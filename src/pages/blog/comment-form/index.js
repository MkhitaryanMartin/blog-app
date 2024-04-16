export default function CommentForm({
    placeholder="",
    handleSubmit,
    buttonText="",
    params
}){
   
const onSubmit = (e)=>{
    e.preventDefault()
    handleSubmit({...params,text:e.target.comment.value})
    console.log(params,"as")
}
    return (
        <form className="comment-form" onSubmit={onSubmit}>
            <input type="text" placeholder={placeholder} name="comment"/>
            <button type="submit">{buttonText}</button>
        </form>
    )
}