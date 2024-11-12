import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "../../src/styles/PitchPage.css";
import ReactMarkdown from "react-markdown";

export default function PitchPage() {
  const [notes, setNotes] = useState("");

  const mockPitch = {
    generated_sales_pitch: `**Introducing VidHub - The Ultimate Video Sharing Platform**

Are you tired of using outdated video sharing platforms that limit your creativity and revenue potential? Look no further than VidHub, the revolutionary new platform that empowers creators to share their content with the world.

**What sets us apart:**
***Easy-to-use interface**: Our platform is designed for ease of use, even for those who aren't tech-savvy. Simply upload your videos, add tags and descriptions, and share with the world.
***Monetization options**: Earn money from ads, sponsorships, and affiliate marketing through our integrated partner network.
***Discoverability tools**: Get discovered by a global audience with our advanced search algorithms and social media integrations.
***Community features**: Engage with your fans and fellow creators through live streaming, commenting, and private messaging.

**Benefits for Creators:**
***Global reach**: Share your content with millions of users worldwide, reaching new audiences and growing your fanbase.
***Increased revenue**: Earn more from ads, sponsorships, and affiliate marketing than on traditional platforms.
***Community building**: Connect with like-minded creators and fans through our social features.
***Professional-grade tools**: Access advanced editing, color correction, and music licensing features to elevate your content.

**Benefits for Viewers:**
***Unlimited video content**: Browse thousands of videos on topics ranging from entertainment, education, and lifestyle.
***Discover new creators**: Find fresh perspectives and talent through our community-driven discovery algorithm.
***Enhanced user experience**: Enjoy a seamless viewing experience with high-quality playback and immersive features.

**Join the VidHub community today!**`,
    name_documents_used: ["Product Documentation", "Marketing Materials"],
    links_to_documents: [
      "http://example.com/docs",
      "http://example.com/marketing",
    ],
  };

  const handleEditorChange = (content) => {
    setNotes(content);
  };

  return (
    <div className="min-h-screen bg-custom-green p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Generated Sales Pitch
      </h1>

      <div className="flex gap-6">
        {/*display generated pitch*/}
        <div className="pitch-container">
          <ReactMarkdown>{mockPitch.generated_sales_pitch}</ReactMarkdown>
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
