import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "../../src/styles/PitchPage.css";
import ReactMarkdown from "react-markdown";
import styles from "./InputsPage.module.css";

export default function PitchPage() {
  const [notes, setNotes] = useState("");
  const [resultData, setResultData] = useState(""); //display result on page
  const BASE_URL = "http://35.236.2.62:8000";

  const handleEditorChange = (content) => {
    setNotes(content);
  };

  const generatePitch = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/generate/generate_sales_pitch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            seller_name: "Test Seller",
            company_name: "Test Company",
            product_name: "Test Product",
            product_description: "Test Description",
            selected_source_ids: [1],
          }),
        }
      );
      const data = await response.json();
      setResultData(data.generated_sales_pitch);
    } catch (error) {
      console.error("Error generating pitch: ", error);
    }
  };

  return (
    <div className="main">
      <div className="navbar">
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

      <h1 className="banner-name">Generated Sales Pitch</h1>

      <div className="flex gap-6">
        {/*display generated pitch*/}
        <div className="pitch-container">
          <ReactMarkdown>{resultData}</ReactMarkdown>
        </div>
      </div>

      {/*tinyMce integration*/}
      <div className="editor-container">
        <Editor
          apiKey="rncicr4pa0ungw5lzix98tz61buq6rodfdnx37txoh1hi0se"
          value={notes}
          init={{
            height: 350,
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "charmap",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "wordcount",
            ],
            toolbar:
              "undo redo | formatselect | " +
              "bold italic backcolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            skin: "oxide", // Use the default light theme
            content_css: "default", // Use the default content CSS
          }}
          onEditorChange={handleEditorChange}
        />
      </div>
    </div>
  );
}
