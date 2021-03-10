import Head from "next/head";
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify, faGithub } from "@fortawesome/free-brands-svg-icons";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import axios from "axios";

export default function Home() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/api/login");
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>graphify</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>graphify</h1>

        <button className={styles.signInButton} onClick={handleSignIn}>
          <div className={styles.buttonContent}>
            sign in with Spotify
            <FontAwesomeIcon className={styles.icon} icon={faSpotify} />
          </div>
        </button>
      </main>
      <div className={styles.footer}>
        <a href="https://github.com/andrewlu0/graphify">
          <FontAwesomeIcon className={styles.github} icon={faGithub} />
        </a>
      </div>
    </div>
  );
}
