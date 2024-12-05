import React from 'react';
import { Button } from '@mui/material';
// import Header from '../components/Header';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      {/* <Header /> */}
      <main>
        <h1>Welcome to Crypto Portfolio</h1>
        <p>Your one-stop solution for tracking cryptocurrency investments.</p>
        <Button variant="contained" color="primary" href="/auth/login">
          Get Started
        </Button>
      </main>
      {/* <footer className={styles.footer}>
        <p>© 2024 Crypto Portfolio. All rights reserved.</p>
      </footer> */}
    </div>
  );
}
