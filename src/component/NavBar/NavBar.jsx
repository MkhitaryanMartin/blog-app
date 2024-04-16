import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import SignIn from './SignIn/SignIn'
import RegistModal from './RegistModal/RegistModal'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { Button } from 'antd'

export default function NavBar() {

    const [authUser, setAuthUser] = useState(null)
    const [userName, setUserName] = useState('')

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user)
                setUserName(user.displayName)
            } else {
                setAuthUser(null)
            }
        })
        return () => {
            listen();
        };
    }, [])

    function userSignOut() {
        signOut(auth)
            .then(() => console.log("success"))
            .catch((e) => console.log(e));
    }


    return (
        <nav className={styles.main_container} >
            <div className={styles.nav_container} >
                <div className={styles.logo_container} >
                    {authUser ? (
                        <div><p>{` ${userName + '` '}s blog `}</p></div>
                    ) : "Dont sign in yet"}
                </div>
                {authUser ? (
                    <div>
                        <Button onClick={userSignOut}>Sign Out</Button>
                    </div>
                ) : (
                    <div className={styles.log_container} >
                        <RegistModal />
                        <SignIn />
                    </div>
                )}
            </div>
        </nav>
    )
}