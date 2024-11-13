import { createContext, useContext, useState } from "react";

const requestContext = createContext();

export function useRequestContext() {
  const context = useContext(requestContext);
  return context;
}

export function RequestProvider({ children }) {
  const SERVER = "35.236.2.62:8000"; //change this when server is open  //35.236.2.62:8000
  const [sellerName, setSN] = useState("");
  const [companyName, setCN] = useState("");
  const [linkedInUrl, setLURL] = useState("");
  const [productName, setPN] = useState("");
  const [productDescription, setPD] = useState("");
  const [selectedSources, setSS] = useState([]);
  const value = {
    SERVER,
    sellerName,
    companyName,
    linkedInUrl,
    productName,
    productDescription,
    selectedSources,
    setSellerName: (x) => {
      setSN(x);
    },
    setCompanyName: (x) => {
      setCN(x);
    },
    setLinkedInURL: (x) => {
      setLURL(x);
    },
    setProductName: (x) => {
      setPN(x);
    },
    setProductDescription: (x) => {
      setPD(x);
    },
    setSelectedSources: (x) => {
      setSS(x);
    },
  };
  return (
    <requestContext.Provider value={value}>{children}</requestContext.Provider>
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
