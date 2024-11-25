import React from "react";
import jsPDF from "jspdf";

export default function DownloadButton({ content }) {
  const doc = new jsPDF();
  function format_and_generate() {
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const contentWidth = pageWidth - 2 * margin;
    const lines = doc.splitTextToSize(content, contentWidth);
    doc.text(lines, margin, 20);
    doc.save("generated_pitch.pdf");
  }
  return (
    <button
      className="p-3 bg-black rounded-md text-white"
      onClick={format_and_generate}
    >
      Download as PDF
    </button>
  );
}
