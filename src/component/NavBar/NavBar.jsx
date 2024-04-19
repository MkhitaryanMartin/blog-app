import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import SignIn from './SignIn/SignIn'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { Button, Spin } from 'antd'

export default function NavBar() {
    const [authUser, setAuthUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
            } else {
                setAuthUser(null);
            }
            setLoading(false);
        });

        return () => {
            listen();
        };
    }, []);

    function userSignOut() {
        setLoading(true)
        signOut(auth)
            .then(() => console.log("success"))
            .catch((e) => console.log(e))
            .finally(() => setLoading(false));
    }

    return (
        <nav className={styles.main_container}>
            <div className={styles.nav_container}>
                <div className={styles.logo_container}>
                    {loading ? (
                        <Spin size="large" />
                    ) : authUser ? (
                        <div><p>{` ${authUser.email + '` '}s blog `}</p></div>
                    ) : "Dont sign in yet"}
                </div>
                {loading ? null : authUser ? (
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