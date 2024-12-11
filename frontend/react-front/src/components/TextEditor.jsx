// src/Tiptap.tsx
import {
  useEditor,
  EditorProvider,
  FloatingMenu,
  BubbleMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// define your extension array
const extensions = [StarterKit];

const content = "<p>Hello World!</p>";

export default function TextEditor() {
  const editor = useEditor({
    extensions,
    content,
  });

  if (!editor) {
    return null; // Ensure the editor is initialized before rendering
  }

  return (
    <EditorProvider extensions={extensions} content={content}>
      <div className="tiptap-editor border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
        {/* Editable content */}
        <div
          ref={editor?.setEditableContentRef}
          className="tiptap-content prose focus:outline-none"
        />

        {/* Floating menu */}
        <FloatingMenu
          editor={editor}
          className="floating-menu bg-gray-100 border rounded-md shadow-md p-2"
        >
          This is the floating menu
        </FloatingMenu>

        {/* Bubble menu */}
        <BubbleMenu
          editor={editor}
          className="bubble-menu bg-gray-900 text-white rounded-md p-2 shadow-md"
        >
          This is the bubble menu
        </BubbleMenu>
      </div>
    </EditorProvider>
  );
}
