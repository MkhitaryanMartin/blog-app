import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, firestore } from '../../firebase';

export default function Blog(){
    const [values, loading, error] = useCollectionData(
        firestore.collection('comments'));

    const sendMessage =async ()=>{
        firestore.collection("comments").add({
            coment:"asdasd",
            id:Math.random()
        })
    }
    return (
        <section>
<button onClick={sendMessage}>send</button>
        </section>
    )
}