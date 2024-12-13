import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRequestContext } from "../contexts/request_context";
import styles from "./InputsPage.module.css";
import Navbar from "../components/Navbar";
import { input } from "framer-motion/client";

export default function InputsPage() {
  const [index, setIndex] = useState(0);

  const navigate = useNavigate();
  const {
    SERVER,
    sellerName,
    setSellerName,
    companyName,
    setCompanyName,
    clientName,
    setClientName,
    clientAdditionalInfo,
    setClientAdditionalInfo,
    productName,
    setProductName,
    productDescription,
    setProductDescription,
  } = useRequestContext();

  const handleNext = () => {
    console.log("Seller Name:", sellerName);
    console.log("Company Name:", companyName);
    console.log("Client's Name:", clientName);
    console.log("Client Additional Info:", clientAdditionalInfo);
    console.log("Product Name:", productName);
    console.log("Product Description:", productDescription);
    if (index < inputFields.length) {
      setIndex(index + 1);
      return;
    }
    navigate("/sources");
  };

  // all input fields
  const inputFields = [
    <>
      <div className={styles.inputGroup}>
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          placeholder="Enter your full name"
          value={sellerName}
          onChange={(e) => setSellerName(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="company">Company</label>
        <input
          type="text"
          id="company"
          placeholder="Enter your company name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>
    </>,
    <>
      <div className={styles.inputGroup}>
        <label htmlFor="clientName">Client Name</label>
        <input
          type="text"
          id="clientName"
          placeholder="Enter client name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="clientAdditionalInfo">
          Additional Client Information
        </label>
        <textarea
          id="clientAdditionalInfo"
          placeholder="Enter any additional information about the client (e.g., Cofounder of Minoa in SF)"
          rows="3"
          value={clientAdditionalInfo}
          onChange={(e) => setClientAdditionalInfo(e.target.value)}
        />
      </div>
    </>,
    <>
      <div className={styles.inputGroup}>
        <label htmlFor="productName">Product Name</label>
        <input
          type="text"
          id="productName"
          placeholder="Enter your product name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="productDescription">Product Description</label>
        <textarea
          id="productDescription"
          placeholder="Enter a brief description of your product"
          rows="3"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
        />
      </div>
    </>,
  ];

  return (
    <div>
      <Navbar />
      <main className={styles.mainContent}>
        {/* <h3 className={styles.heroTitle}>
          One platform for modern sales teams to save time and close deals
          faster
        </h3> */}
        {/* <p className={styles.heroSubtitle}>
          Effortlessly research prospects and craft tailored sales pitches in
          minutes with this AI Agent.
        </p> */}
        <div className={styles.inputSection}>
          <h1 className={styles.heroTitle}>Client and Product Info</h1>
          {inputFields[index]}
          <div className="">
            <button className={styles.generateButton} onClick={handleNext}>
              {index < inputFields.length ? "Next" : "Save and Select Sources"}
            </button>
            {index < inputFields.length && index > 0 ? (
              <button
                className={styles.generateButton}
                onClick={() => {
                  setIndex(index - 1);
                }}
              >
                Back
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
