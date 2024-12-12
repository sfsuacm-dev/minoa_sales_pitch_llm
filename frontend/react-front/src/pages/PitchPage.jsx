import React, { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "../../src/styles/PitchPage.css";
import ReactMarkdown from "react-markdown";
import { useRequestContext } from "../contexts/request_context";
import DownloadButton from "../components/DownloadButton";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TextEditor from "../components/TextEditor";

export default function PitchPage() {
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const values = useRequestContext();
  const [resultData, setResultData] = useState("Pitch Loading..."); //display result on page
  const BASE_URL = values.SERVER;
  const navigate = useNavigate();

  useEffect(() => {
    generatePitch();
  }, []);

  const generatePitch = async () => {
    console.log(BASE_URL + "/generation/generate_sales_pitch");
    try {
      setLoading(true);
      console.log("loading");
      const response = await fetch(
        BASE_URL + "/generation/generate_sales_pitch",
        {
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
            selected_source_ids: values.selectedSources,
          }),
        }
      );
      const data = await response.json();
      setResultData(data.generated_sales_pitch);
      setError(null);
    } catch (error) {
      console.error("Error generating pitch: ", error.message);
      setError(
        "An error occurred when generating your pitch: '" + error.message + "'."
      );
    } finally {
      setLoading(false);
      console.log("fully loaded");
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
    <div className="" style={{ backgroundColor: "#D5FBE6" }}>
      <Navbar />
      <div className="p-8 relative">
        {loading ? <LoadingScreen animateToggle={loading} /> : ""}
        {/* in case of error */}
        {error ? (
          <div className="p-3 my-4 bg-red-500 outline outline-2 outline-red-200 rounded-md text-white text-lg flex">
            <h3 className="flex-grow">{error}</h3>
            <button
              className="px-2"
              onClick={() => {
                setError(null);
              }}
            >
              X
            </button>
          </div>
        ) : (
          ""
        )}
        {/* pitch window */}
        <div className="p-4 bg-white rounded-md shadow-lg">
          {/* header */}
          <div id="header" className="mb-2 flex w-full items-center">
            <h1 className="text-2xl font-bold grow">Generated Sales Pitch</h1>
            <button
              onClick={handleGenerateSlides}
              className="bg-black hover:bg-blue-700 text-white font-bold mx-3 py-2 px-4 rounded ml-auto"
            >
              Generate Slides
            </button>
            <DownloadButton content={resultData} />
          </div>
          {/* pitch */}
          {error ? error : <ReactMarkdown>{resultData}</ReactMarkdown>}
          {/* <TextEditor>{resultData}</TextEditor> */}
        </div>
      </div>
    </div>
  );
}

function LoadingScreen(animateToggle) {
  const [text, setText] = useState("Your pitch is generating");

  //timeout function
  const sleepNow = (delay) =>
    new Promise((resolve) => setTimeout(resolve, delay));

  const printText = async (pace = 30) => {
    const textStates = [
      "Your pitch is generating",
      "Your pitch is generating . ",
      "Your pitch is generating . . ",
      "Your pitch is generating . . .",
    ];
    for (let i = 0; i <= 3; i++) {
      await sleepNow(400);
      setText(textStates[i]); // Update text based on the counter
      console.log(textStates[i]);
    }
  };

  useEffect(() => {
    var isMounted = true;

    const animate = async () => {
      while (animateToggle && isMounted) {
        await printText();
      }
    };
    animate();

    return () => {
      isMounted = false;
    };
  }, [animateToggle]);
  return (
    <div
      className="w-full h-full py-20 absolute text-center text-3xl bg-black bg-opacity-15 top-0 left-0"
      style={{ backgroundColor: "#D5FBE6" }}
    >
      {text}
    </div>
  );
}
