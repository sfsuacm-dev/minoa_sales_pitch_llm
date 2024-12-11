import React from "react";
import jsPDF from "jspdf";

export default function DownloadButton({ content = "" }) {
  const doc = new jsPDF();
  var lines = [content];

  function seperate_titles() {
    lines = content.split("**");
    console.log(lines);
  }

  function wrap_text(contentWidth) {
    var temp = [];
    var result = [...lines];
    for (var i = 0; i < result.length; i++) {
      const content = result[i];
      const new_lines = doc.splitTextToSize(content, contentWidth);
      console.log(i);
      result = [
        ...result.slice(0, i), // Keep elements before the insertion point
        ...new_lines, // Insert the new lines
        ...result.slice(i + 1), // Add the remaining elements
      ];
      i += new_lines.length;
      console.log(result);
    }
    lines = result;
  }

  function style_text() {}

  function format_and_generate() {
    const pageWidth = doc.internal.pageSize.getWidth();
    const lineHeight = 10;
    const margin = 10;
    const contentWidth = pageWidth - 2 * margin;
    //split to seperate bold content
    seperate_titles();
    //split to wrap text
    wrap_text(contentWidth);
    var y = margin;
    console.log(doc.internal.pageSize.height);
    for (var i = 0; i < lines.length; i++) {
      console.log(y + lineHeight + ">" + doc.internal.pageSize.height);
      if (y + lineHeight > doc.internal.pageSize.height) {
        console.log("NEW PAGE");
        y = margin;
        doc.addPage();
      }
      doc.text(lines[i], margin, y);
      y += lineHeight;
    }
    doc.save("generated_pitch.pdf");
  }
  return (
    <button
      className="bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
      onClick={format_and_generate}
    >
      Download as PDF
    </button>
  );
}
