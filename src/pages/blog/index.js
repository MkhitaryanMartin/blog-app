import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, firestore } from '../../firebase';
import CommentForm from '../../component/comment-form';
import { useEffect, useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { Button, Spin } from 'antd';
import AddBlog from '../../component/AddBlog/AddBlog';
import CreatedBlog from '../../component/CreatedBlog/CreatedBlog';
import SignIn from '../../component/NavBar/SignIn/SignIn';
import { v4 as uuidv4 } from 'uuid';
import firebase from 'firebase/compat/app';
import styles from './styles.module.css'
import BlogFilter from '../../component/blog/blog-filter';
import { FaPenFancy } from "react-icons/fa6";
import CommentList from '../../component/blog/comments-list';
import { customFilter } from './utilits';



export default function Blog() {
    const [user] = useAuthState(auth)
    const [values, loading, error] = useCollectionData(firestore.collection('blogs').orderBy("createdAt", "desc"));
    const [searchBlog, setSearchBlog] = useState("");
    const [showBlog, setShowBlog] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);


    useEffect(() => {
        if (!user) {
            setSelectedOption(null)
            setSearchBlog("")
        }
    }, [user])


    const deleteBlog = async (blogId) => {
        try {
            const blogRef = firestore.collection("blogs").doc(blogId);
            await blogRef.delete();

            console.log("Blog deleted successfully:", blogId);
        } catch (error) {
            console.error("Error deleting blog:", error);
        }
    }

    const editBlog = async (params) => {
        try {
            const blogRef = firestore.collection("blogs").doc(params.blogId);
            await blogRef.update({
                blogTitle: params.title,
                blogText: params.text
            });

            console.log("Blog edited successfully:", params.blogId);
        } catch (error) {
            console.error("Error editing blog:", error);
        }
    };

    const addCommentToBlog = async (params) => {
        const blogRef = firestore.collection("blogs").doc(params.blogId);
        const blogSnapshot = await blogRef.get();
        const currentComments = blogSnapshot.data().comments || [];
        const updatedComments = [...currentComments, { ...params, photoURL: user?.photoURL, id: uuidv4(), createdAt: new Date() }];
        await blogRef.update({ comments: updatedComments });
    }

    const createBlog = async (params) => {
        if (user) {
            const docRef = await firestore.collection("blogs").add({
                blogText: params.text,
                blogTitle: params.title,
                comments: [],
                uid: user.uid,
                userName: user.displayName,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                photoURL: user?.photoURL
            });
            const docId = docRef.id;
            await firestore.collection("blogs").doc(docId).update({
                id: docId
            });

        }
    }
    const onChanSearch = (newValue) => {
        setSearchBlog(newValue);
    }

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    return (
        <section className={styles.blog_container}>
            <div className={styles.creator_blog} >
                {showBlog === true ? <AddBlog onSubmit={createBlog} submitText='Create blog' /> : ''}
                <span className={styles.blog_button_container} >
                    {user ? (<Button onClick={() => { showBlog === false ? setShowBlog(true) : setShowBlog(false) }} >
                        {showBlog === false ? <span>Create Blog ... <FaPenFancy /></span> : "Close Blog Editor"}
                    </Button>) : ''}
                </span>
            </div>
            <BlogFilter
                value={searchBlog}
                onChange={onChanSearch}
                onChangeRadio={handleOptionChange}
                valiuRadio={selectedOption}
                user={user}
            />
            {
            loading ?  <Spin size="large" className={styles.blog_spin}/>:    values && customFilter(values, selectedOption, user, searchBlog).length ? customFilter(values, selectedOption, user, searchBlog).map((value, i) => {
                    return <div key={value.id || i} className={styles.blog}>
                        <CreatedBlog
                            blog={value}
                            deleteBlog={deleteBlog}
                            editBlog={editBlog}
                            user={user} />
                        <CommentList
                            user={user}
                            value={value}
                        />

                        {user ? <CommentForm
                            handleSubmit={addCommentToBlog}
                            buttonText="Create Comment"
                            params={{ blogId: value?.id, uid: user?.uid, userName: user?.displayName }} /> : (
                            <div className={styles.comment_signin}>
                                <p>Login to write a comment</p>
                                <SignIn />
                            </div>
                        )}
                    </div>
                }): <div className={styles.dont_blogs}><h2>There are no such blogs</h2></div>
            }
        </section>
    )
}


