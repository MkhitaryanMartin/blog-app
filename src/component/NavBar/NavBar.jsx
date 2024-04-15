import React from 'react'
import styles from './styles.module.css'
import RegistModal from './LogInModal/RegistModal'

export default function NavBar() {
  return (
    <nav className={styles.main_container} >
        <div className={styles.nav_container} >
            <div className={styles.logo_container} ></div>
            <div className={styles.log_container} > 
                <RegistModal />
             </div>
        </div>
    </nav>
  )
}