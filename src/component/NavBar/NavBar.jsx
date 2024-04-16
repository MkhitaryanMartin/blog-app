import React from 'react'
import styles from './styles.module.css'
import SignIn from './SignIn/SignIn'
import RegistModal from './RegistModal/RegistModal'

export default function NavBar() {
  return (
    <nav className={styles.main_container} >
        <div className={styles.nav_container} >
            <div className={styles.logo_container} ></div>
            <div className={styles.log_container} > 
            <RegistModal />
            <SignIn />
             </div>
        </div>
    </nav>
  )
}