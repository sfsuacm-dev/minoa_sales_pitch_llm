import { Editor } from "@tinymce/tinymce-react";
export default function TextEditor({ children }) {
  return (
    <Editor
      apiKey="rncicr4pa0ungw5lzix98tz61buq6rodfdnx37txoh1hi0se"
      onInit={(_evt, editor) => {}}
      initialValue={children}
      init={{
        height: "89vh",
        menubar: false,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        resize: false,
      }}
      onEditorChange={() => {}}
    />
  );
}
