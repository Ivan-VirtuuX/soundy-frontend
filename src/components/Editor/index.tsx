import React, { FC } from "react";

import EditorJS, { OutputData } from "@editorjs/editorjs";
import ImageTool from "@editorjs/image";

import { CloudinaryApi } from "@/api/CloudinaryApi";

import styles from "./Editor.module.scss";

interface EditorProps {
  onChange: (blocks: OutputData["blocks"]) => void;
  initialBlocks: OutputData["blocks"];
  handleSubmittingImage: () => void;
  handleSubmittedImage: () => void;
}

const Editor: FC<EditorProps> = ({
  onChange,
  initialBlocks,
  handleSubmittingImage,
  handleSubmittedImage,
}) => {
  const ref = React.useRef<EditorJS>();

  React.useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        data: {
          blocks: initialBlocks,
        },
        placeholder: "Введите текст статьи",
        async onChange() {
          const { blocks } = await editor.save();

          onChange(blocks);
        },
        tools: {
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: "https://api.cloudinary.com/v1_1/virtuux/image/upload",
              },
              field: "file",
              additionalRequestData: { upload_preset: "cqxjdiz4" },
              captionPlaceholder: "none",
              uploader: {
                /**
                 * @param {File}
                 * @return {Promise.<{success, file: {url}}>}
                 */
                async uploadByFile(file: any) {
                  handleSubmittingImage();

                  try {
                    const formData: any = new FormData();

                    formData.append("file", file);
                    formData.append("upload_preset", "cqxjdiz4");

                    const result = await CloudinaryApi().cloudinary.changeImage(
                      formData
                    );

                    return {
                      success: 1,
                      file: {
                        url: result.data.secure_url,
                      },
                    };
                  } catch (err) {
                    console.warn(err);
                  } finally {
                    handleSubmittedImage();
                  }
                },
              },
              buttonContent: "Загрузить превью",
            },
          },
        },
      });
      ref.current = editor;
    }

    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      const editor = document.getElementById("editor");

      if (editor) {
        editor.style.pointerEvents = "auto";
      }
    }, 1000);
  }, []);

  return <div id="editor" className={styles.editor} />;
};

export default React.memo(Editor);
