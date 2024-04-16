import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import SignIn from './SignIn/SignIn'
import RegistModal from './RegistModal/RegistModal'
import { onAuthStateChanged,signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { Button } from 'antd'

export default function NavBar() {

    const [authUser, setAuthUser] = useState(null)

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user)
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
                        <div><p>{`Signed in as ${authUser.email}`}</p></div>
                    ) : "Dont sign in yet"}
                </div>
                <div className={styles.log_container} >
                    <RegistModal />
                        {authUser ? (
                            <div>
                                <Button onClick={userSignOut}>Sign Out</Button>
                            </div>
                        ) : (
                            <SignIn />
                        )}
                </div>
            </div>
        </nav>
    )
}