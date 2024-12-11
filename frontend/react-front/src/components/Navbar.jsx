import React from "react";
import styles from "../pages/InputsPage.module.css";

export default function Navbar() {
  return (
    <div className="navbar z-40">
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="#0f172a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="#0f172a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="#0f172a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Minoa
        </div>
        <div className={styles.navLinks}>
          <a href="/">Home</a>
          <a href="/">Product</a>
          <a href="/">Resources</a>
          <a href="/">Careers</a>
          <a href="/">About</a>
          <a href="/" className={`${styles.button} ${styles.buttonOutline}`}>
            Login
          </a>
          <a href="/" className={`${styles.button} ${styles.buttonFilled}`}>
            Book a demo
          </a>
        </div>
      </nav>
    </div>
  );
}
