import React, { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "../../src/styles/PitchPage.css";
import ReactMarkdown from "react-markdown";
import styles from "./InputsPage.module.css";
import { useRequestContext } from "../contexts/request_context";
import DownloadButton from "../components/DownloadButton";
import { useNavigate } from "react-router-dom";
// Delete this lin
export default function PitchPage() {
  const values = useRequestContext();
  const [notes, setNotes] = useState("");
  const [resultData, setResultData] = useState("Pitch Loading..."); //display result on page
  const BASE_URL = values.SERVER;
  const navigate = useNavigate();

  const handleEditorChange = (content) => {
    setNotes(content);
  };

  useEffect(() => {
    generatePitch();
  }, []);

  /*
REQUEST SCHEMA
{
  "seller_name": "string",
  "company_name": "string",
  "linkedin_url": "string",
  "product_name": "string",
  "product_description": "string",
  "selected_source_ids": [
    0
  ]
}
  */

  const generatePitch = async () => {
    console.log(BASE_URL + "/generation/generate_sales_pitch");
    try {
      const response = await fetch(BASE_URL + "/generation/generate_sales_pitch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seller_name: values.sellerName,
          company_name: values.companyName,
          client_name: values.clientName,
          client_additional_info: values.clientAdditionalInfo,
          product_name: values.productName,
          product_description: values.productDescription,
          selected_source_ids: values.selectedSources
        })
      });
      const data = await response.json();
      setResultData(data.generated_sales_pitch);
    } catch (error) {
      console.error("Error generating pitch: ", error);
    }
  };

  const handleGenerateSlides = () => {
    const encodedPitch = encodeURIComponent(resultData);
    window.open(
      `/slidedeck/reveal.js/index.html?pitch=${encodedPitch}`,
      "_blank"
    );
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
      <div className="flex gap-6 justify-between items-start">
        {/* Moved slide button ontop of Fabians pitch editor*/}
        <div className="pitch-container flex-grow">
          <ReactMarkdown>{resultData}</ReactMarkdown>
        </div>
        <button
          onClick={handleGenerateSlides}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
        >
          Generate Slides
        </button>
        <DownloadButton content={resultData} />
      </div>
      <h1 className="banner-name">Generated Sales Pitch</h1>

      {/*tinyMce integration*/}
      <div className="editor-container">
        <Editor
          apiKey="rncicr4pa0ungw5lzix98tz61buq6rodfdnx37txoh1hi0se"
          value={resultData}
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
          onEditorChange={() => {}}
        />
      </div>
    </div>
  );
}

const testText =
  "**Introducing VidHub - The Ultimate Video Sharing Platform** Are you tired of using outdated video sharing platforms that limit your creativity and revenue potential? Look no further than VidHub, the revolutionary new platform that empowers creators to share their content with the world. **What sets us apart:** * **Easy-to-use interface**: Our platform is designed for ease of use, even for those who aren't tech-savvy. Simply upload your videos, add tags and descriptions, and share with the world. * **Monetization options**: Earn money from ads, sponsorships, and affiliate marketing through our integrated partner network. * **Discoverability tools**: Get discovered by a global audience with our advanced search algorithms and social media integrations. * **Community features**: Engage with your fans and fellow creators through live streaming, commenting, and private messaging. **Benefits for Creators:** * **Global reach**: Share your content with millions of users worldwide, reaching new audiences and growing your fanbase. * **Increased revenue**: Earn more from ads, sponsorships, and affiliate marketing than on traditional platforms. * **Community building**: Connect with like-minded creators and fans through our social features. * **Professional-grade tools**: Access advanced editing, color correction, and music licensing features to elevate your content. **Benefits for Viewers:** * **Unlimited video content**: Browse thousands of videos on topics ranging from entertainment, education, and lifestyle. * **Discover new creators**: Find fresh perspectives and talent through our community-driven discovery algorithm. * **Enhanced user experience**: Enjoy a seamless viewing experience with high-quality playback and immersive features. **Join the VidHub community today!**";
