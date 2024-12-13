import { createContext, useContext, useState } from "react";

const requestContext = createContext();

export function useRequestContext() {
  const context = useContext(requestContext);
  return context;
}

export function RequestProvider({ children }) {
  const SERVER = "http://127.0.0.1:8000"; // test: http://localhost:3001 real: http://127.0.0.1:8000
  const [sellerName, setSN] = useState("");
  const [companyName, setCN] = useState("");
  const [clientName, setLURL] = useState("");
  const [productName, setPN] = useState("");
  const [productDescription, setPD] = useState("");
  const [selectedSources, setSS] = useState([]);
  const [clientAdditionalInfo, setCAI] = useState("");
  const value = {
    SERVER,
    sellerName,
    companyName,
    clientName,
    productName,
    productDescription,
    selectedSources,
    clientAdditionalInfo,
    setSellerName: (x) => {
      setSN(x);
    },
    setCompanyName: (x) => {
      setCN(x);
    },
    setClientName: (x) => {
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
    setClientAdditionalInfo: (x) => {
      setCAI(x);
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
