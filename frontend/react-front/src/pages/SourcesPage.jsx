import React, { useState } from "react";

export default function SourcesPage() {
  const sources = [
    { name: "Sample 1" },
    { name: "Sample 2" },
    { name: "Sample 3" },
    { name: "Sample 4" },
    { name: "Sample 5" },
    { name: "Sample 6" },
    { name: "Sample 7" },
    { name: "Sample 8" },
    { name: "Sample 9" },
  ];

  return (
    <div
      className="w-screen h-screen flex"
      style={{ backgroundColor: "#D5FBE6" }}
    >
      <div className="w-3/6 portrait:w-5/6  h-auto m-auto p-5 bg-white rounded-2xl flex flex-col">
        <h1 className="mx-auto text-4xl font-extrabold text-center">
          Data Source Selection
        </h1>
        <p className="mx-auto text-lg text-gray-600">
          Selct from <b>{sources.length}</b> sources
        </p>
        <div
          className="mx-auto my-5 w-5/6 p-7 outline flex flex-row flex-wrap overflow-scroll"
          style={{ maxHeight: "50vh" }}
        >
          {sources.map((source) => {
            return <SourceIcon source={source} key={source.name} />;
          })}
        </div>
        <div className="mx-auto">
          <button
            className="p-3 rounded-xl text-white"
            style={{ backgroundColor: "#0E172A" }}
          >
            Back
          </button>
          <button
            className="p-3 ml-5 rounded-xl"
            style={{ backgroundColor: "#00F8F3" }}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}

function SourceIcon({ source }) {
  const [toggle, setToggle] = useState(false);
  return (
    <div
      className="w-32 mx-auto mb-5 aspect-square rounded-lg hover:cursor-pointer flex flex-col"
      style={{ backgroundColor: "#BBE3EC" }}
    >
      <div className="p-3 h-fit flex flex-row-reverse">
        <button
          className={
            "w-4 aspect-square rounded-full outline " +
            (!toggle ? "bg-transparent" : "bg-green-400")
          }
          title="Select source for generation."
          onClick={() => {
            setToggle(!toggle);
          }}
        ></button>
      </div>
      <h1 className="self-center mt-5">{source.name}</h1>
    </div>
  );
}
