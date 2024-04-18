import React from 'react'
import styles from './styles.module.css'
import { Divider } from 'antd'

export default function Footer() {
    return (
        <div className={styles.main_container} >
            <div className={styles.content_container} >
                <Divider />
                <div className={styles.text_container} >
                    <span>© 2024 Blog: All rights reserved</span>
                    <span>Designed & Develop by Brain Fors</span>
                </div>
            </div>
        </div>
    )
}
