import React, { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckMark from "../images/image.png";
import { useRequestContext } from "../contexts/request_context";
import styles from "./InputsPage.module.css";

export default function SourcesPage() {
  const navigate = useNavigate(); //for redirecting to other pages
  const values = useRequestContext(); // request variables
  const [toggle, setToggle] = useState(false); //modal toggle
  const [modal, setModal] = useState({ title: "", content: "" });
  var selectedSources = []; //the sources submitted with the request
  const [sources, setSources] = useState([
    { source_id: 0, source_name: "Sample 1" },
    { source_id: 1, source_name: "Sample 2" },
    { source_id: 2, source_name: "Sample 3" },
    { source_id: 3, source_name: "Sample 4" },
    { source_id: 4, source_name: "Sample 5" },
    { source_id: 5, source_name: "Sample 6" },
    { source_id: 6, source_name: "Sample 7" },
    { source_id: 7, source_name: "Sample 8" },
    { source_id: 8, source_name: "Sample 9" },
  ]);
  /*
    GET sources/all_sources
    REQUEST MODEL
    NONE

    RESPONSE MODEL
    [
      {
        "source_id": 0,
        "source_name": "string"
      }
    ]
  */

  useEffect(() => {
    const fetchAndStore = async () => {
      try {
        var sources = await fetch(values.SERVER + "/sources/all_sources");
        console.log(sources);
        sources = await sources.json();
        console.log(sources);
        setSources(sources);
      } catch (err) {
        console.error(err);
        setSources([]);
      }
    };
    fetchAndStore();
    console.log(values);
  }, []);

  async function submitSources() {
    values.setSelectedSources(selectedSources);
    navigate("/pitch");
  }

  return (
    <div
      className="w-screen h-screen flex flex-col"
      style={{ backgroundColor: "#D5FBE6" }}
    >
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
      {toggle ? (
        <Modal
          onClose={() => {
            setToggle(!toggle);
          }}
          title={modal.title}
        >
          {modal.content}
        </Modal>
      ) : (
        ""
      )}
      <div className="w-3/6 portrait:w-5/6  h-auto m-auto p-5 bg-white rounded-2xl flex flex-col">
        <h1 className="mx-auto text-4xl font-extrabold text-center">
          Data Source Selection
        </h1>
        <p className="mx-auto text-lg text-gray-600">
          Selct from <b>{sources.length}</b> sources
        </p>
        <div
          className="mx-auto my-5 w-5/6 p-7 outline outline-gray-300 flex flex-row flex-wrap overflow-scroll"
          style={{ maxHeight: "50vh" }}
        >
          {sources.map((source) => {
            return (
              <SourceIcon
                source={source}
                key={source.source_id}
                onClick={() => {
                  setToggle(!toggle);
                  setModal({ title: source.source_name, content: "" });
                }}
                onSelect={(x) => {
                  if (x) selectedSources.push(source.source_id);
                  else {
                    const index = selectedSources.indexOf(x);
                    // index > 0 ? selectedSources.slice() : "";
                  }
                  console.log(selectedSources);
                }}
              />
            );
          })}
        </div>
        <div className="mx-auto">
          <button
            className="hover:scale-90 transition p-3 rounded-md text-white"
            style={{ backgroundColor: "#0E172A" }}
            onClick={() => {
              navigate("/");
            }}
          >
            Back
          </button>
          <button
            className="hover:scale-90 transition p-3 ml-5 rounded-md"
            style={{ backgroundColor: "#00F8F3" }}
            onClick={() => {
              submitSources();
            }}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
} //end of Sources Page

// Additional Components
function SourceIcon({ source, onClick, onSelect }) {
  const [toggle, setToggle] = useState(false);
  return (
    <div
      className="w-36 hover:scale-110 transition aspect-square mx-auto mb-5 rounded-lg hover:cursor-pointer flex flex-col group relative"
      style={{ backgroundColor: "#BBE3EC" }}
    >
      <div
        className="w-full h-full absolute"
        onClick={() => {
          onClick();
        }}
      ></div>
      <div className="w-full h-fit p-3 flex flex-row-reverse">
        <div
          className="w-fit h-fit p-2 z-10"
          onClick={() => {
            onSelect(!toggle);
            setToggle(!toggle);
          }}
        >
          <button
            className={
              "w-6 aspect-square rounded-full outline overflow-hidden hover:outline-green-600 " +
              (!toggle ? "bg-transparent" : "bg-green-400 outline-green-600")
            }
            title="Select source for generation."
          >
            <img
              className={
                "w-5/6 m-auto " + (!toggle ? "opacity-0" : "opacity-100")
              }
              src={CheckMark}
            />
          </button>
        </div>
      </div>
      <h1 className="self-center">{source.source_name}</h1>
      <h1 className="self-center mt-5 text-teal-800 opacity-0 group-hover:opacity-100 transition">
        Click to Inspect
      </h1>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="absolute w-screen h-screen flex z-50 bg-black bg-opacity-25 ">
      <div
        className="m-auto aspect-square flex flex-col outline outline-2 outline-gray-400"
        style={{ backgroundColor: "#BBDCEF", width: "45vw", height: "60vh" }}
      >
        <div className="w-full px-7 py-5 text-3xl flex flex-row">
          <h1 className="flex grow text-2xl">{title}</h1>
          <button
            onClick={() => {
              onClose();
            }}
          >
            X
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/*
POST /generate/generate_sales_pitch
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

RESPONSE SCHEMA
{
  "generated_sales_pitch": "string",
  "name_documents_used": [
    "string"
  ],
  "links_to_documents": [
    "string"
  ]
}

GET sources/all_sources
REQUEST MODEL
NONE

RESPONSE MODEL
[
  {
    "source_id": 0,
    "source_name": "string"
  }
]

GET sources/{source_id}
REQUIRES SOURCE_ID AS A PATH PARAMETER
REQUEST MODEL
NONE

RESPONSE MODEL
{
  "source_id": 0,
  "source_name": "string",
  "source_description": "string"
}
*/
