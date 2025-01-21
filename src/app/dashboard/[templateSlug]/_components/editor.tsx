"use client";

import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";
import { useState } from "react";

interface EditorProps {
  value?: string; // Optional initial value
  onChange?: (content: string) => void; // Optional change handler
}

export const Editor = ({ value = "", onChange = () => {} }: EditorProps) => {
  const [content, setContent] = useState(value);

  const handleEditorChange = (content: string) => {
    setContent(content); // Update local state
    onChange(content); // Call the parent's onChange if provided
  };

  return (
    <TinyMCEEditor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY} // Access API key from environment
      value={content}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste code help wordcount",
        ],
        toolbar:
          "undo redo | formatselect | bold italic backcolor | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | removeformat | help",
        branding: false, // Hide branding
      }}
      onEditorChange={handleEditorChange} // Pass the handler
    />
  );
};
