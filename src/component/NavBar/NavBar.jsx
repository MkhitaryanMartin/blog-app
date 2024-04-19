import styles from './styles.module.css'
import SignIn from './SignIn/SignIn'
import {signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { Button, Spin } from 'antd' ;
import { useAuthState } from 'react-firebase-hooks/auth'


export default function NavBar() {
    const [user, loading] = useAuthState(auth)



    function userSignOut() {
        signOut(auth);
    }


    return (
        <nav className={styles.main_container}>
            <div className={styles.nav_container}>
                {loading ? null : user ? (
                    <div>
                        <Button onClick={userSignOut}>Sign Out</Button>
                    </div>
                ) : (
                    <div className={styles.log_container}>
                        <SignIn />
                    </div>
                )}
            </div>
        </nav>
    )
}