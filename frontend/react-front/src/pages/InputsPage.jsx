import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./InputsPage.module.css";

export default function InputsPage() {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/pitch');
  };

  return (
    <div>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Minoa
        </div>
        <div className={styles.navLinks}>
          <a href="/">Home</a>
          <a href="/">Product</a>
          <a href="/">Resources</a>
          <a href="/">Careers</a>
          <a href="/">About</a>
          <a href="/" className={`${styles.button} ${styles.buttonOutline}`}>Login</a>
          <a href="/" className={`${styles.button} ${styles.buttonFilled}`}>Book a demo</a>
        </div>
      </nav>
      <main className={styles.mainContent}>
        <h1 className={styles.heroTitle}>One platform for modern sales teams to save time and close deals faster</h1>
        <p className={styles.heroSubtitle}>Leverage our AI agent to instantly research your clients and get the insights you need in minutes.<br/>No more manual searches or wasted hours.</p>
        <div className={styles.inputSection}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" placeholder="Enter your full name"/>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="company">Company</label>
            <input type="text" id="company" placeholder="Enter your company name"/>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="linkedin">LinkedIn URL</label>
            <input type="url" id="linkedin" placeholder="Enter your LinkedIn profile URL"/>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="productName">Product Name</label>
            <input type="text" id="productName" placeholder="Enter your product name"/>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="productDescription">Product Description</label>
            <textarea 
              id="productDescription" 
              placeholder="Enter a brief description of your product"
              rows="3"
            />
          </div>
          <button className={styles.generateButton} onClick={handleNext}>Next</button>
        </div>
      </main>
    </div>
  );
}