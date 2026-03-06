import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  Alignment,
  BlockQuote,
  Bold,
  ClassicEditor,
  Code,
  CodeBlock,
  Editor,
  EditorConfig,
  Essentials,
  EventInfo,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  Italic,
  Link,
  List,
  Paragraph,
  TodoList,
  Underline,
  Undo,
} from "ckeditor5";
import { useEffect, useState } from "react";
import "../app/global.css";

interface CKEditorCompProps {
  value?: string;
  onChange?: (data: any) => void;
  maxChars?: number;
  editor?: any;
  config?: EditorConfig;
}

const CKEditorComp = ({
  value,
  onChange,
  maxChars,
  editor = ClassicEditor,
  config = {
    toolbar: [
      "heading",
      "bold",
      "italic",
      "underline",
      "alignment",
      "fontColor",
      "fontBackgroundColor",
      "fontSize",
      "fontFamily",
      "blockQuote",
      "numberedList",
      "link",
      "undo",
      "redo",
    ],
    htmlSupport: {
      allow: [{ name: /.*/, attributes: true, classes: true, styles: true }],
    },
    link: {
      addTargetToExternalLinks: true,
    },
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Heading 3",
          class: "ck-heading_heading3",
        },
        {
          model: "heading4",
          view: "h4",
          title: "Heading 4",
          class: "ck-heading_heading4",
        },
        {
          model: "heading5",
          view: "h5",
          title: "Heading 5",
          class: "ck-heading_heading5",
        },
        {
          model: "heading6",
          view: "h6",
          title: "Heading 6",
          class: "ck-heading_heading6",
        },
      ],
    },
    plugins: [
      Undo,
      FontFamily,
      FontSize,
      FontColor,
      FontBackgroundColor,
      Bold,
      Italic,
      Underline,
      Code,
      Link,
      BlockQuote,
      CodeBlock,
      List,
      TodoList,
      Essentials,
      Paragraph,
      Alignment,
      Heading,
    ],
  },
}: CKEditorCompProps) => {
  const [charCount, setCharCount] = useState(0);
  const [loadOnce, setLoadOnce] = useState(false);

  useEffect(() => {
    if (value && !loadOnce) {
      let initialContent = value;
      if (maxChars) {
        initialContent = initialContent.replaceAll(/<[^>]*>/g, "");
        initialContent = initialContent.replaceAll(/&nbsp/g, "");
        setCharCount(initialContent.length);
      }
      setLoadOnce(true);
    } else {
      if (value === "") {
        setLoadOnce(false);
        setCharCount(0);
      }
    }
  }, [value]);

  const handleChange = (_: EventInfo, editor: Editor) => {
    const content = editor.getData();
    let initialContent = content;

    if (maxChars) {
      initialContent = initialContent.replaceAll(/<[^>]*>/g, "");
      initialContent = initialContent.replaceAll(/&nbsp/g, "");
      setCharCount(initialContent.length);
      if (initialContent.length <= maxChars) {
        onChange(content);
      } else {
        editor.execute("undo");
      }
    } else {
      onChange(content);
    }
  };

  return (
    <div className="relative !z-0">
      <CKEditor
        editor={editor}
        config={{
          ...config,
          initialData: value || "",
        }}
        data={value}
        onChange={(event, editor) => {
          if (maxChars) {
            if (charCount <= maxChars) handleChange(event, editor);
          } else {
            handleChange(event, editor);
          }
        }}
      />
      {maxChars && (
        <div
          className={`mt-2 text-right text-sm ${charCount > maxChars ? "text-red-500" : "text-gray-500"}`}
        >
          {charCount}/{maxChars} characters
        </div>
      )}
    </div>
  );
};

export default CKEditorComp;
