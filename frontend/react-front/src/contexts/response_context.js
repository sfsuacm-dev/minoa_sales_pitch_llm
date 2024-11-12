import { createContext, useContext, useState } from "react";

const responseContext = createContext();

export function useResponseContext() {
  const context = useContext(responseContext);
  return context;
}

export function ResponseProvider({ children }) {
  const [generatedSalesPitch, setGSP] = useState();
  const [documentsUsed, setDU] = useState();
  const [linksToDocuments, setLTD] = useState();
  const value = {
    generatedSalesPitch,
    documentsUsed,
    linksToDocuments,
    setGeneratedSalesPitch: () => {},
    setDocumentsUsed: () => {},
    setLinksToDocuments: () => {},
  };
  return (
    <responseContext.Provider value={value}>
      {children}
    </responseContext.Provider>
  );
}

/*
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
*/
