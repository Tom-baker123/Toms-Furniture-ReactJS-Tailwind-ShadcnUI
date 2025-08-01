// src/components/ui/RichTextEditor.jsx
import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const RichTextEditor = ({
    value,
    onChange,
    onBlur,
    placeholder = "Start writing your content here...",
    height = 500,
    disabled = false,
    error = false,
}) => {
    return (
        <div className={`${error ? "border-red-500" : ""}`}>
            <Editor
                apiKey="3fbd5x3bcoypxnuor5v91dpj1sb4q00m4nistvxth4pihfa9"
                value={value || ""}
                onEditorChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                init={{
                    height: height,
                    menubar: "file edit view insert format tools table help",
                    plugins: [
                        // Core editing plugins
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
                        "help",
                        "wordcount",

                        // Available formatting plugins
                        "emoticons",
                        "quickbars",
                        "pagebreak",

                        // Layout and design plugins
                        "directionality",
                        "visualchars",
                        "nonbreaking",
                        "codesample",
                    ],
                    toolbar1:
                        "undo redo | cut copy paste | bold italic underline strikethrough | " +
                        "alignleft aligncenter alignright alignjustify | " +
                        "bullist numlist outdent indent | removeformat",
                    toolbar2:
                        "fontsize blocks | forecolor backcolor | " +
                        "link unlink anchor | image media table | " +
                        "customHr pagebreak | emoticons charmap | " +
                        "searchreplace | visualblocks code fullscreen",
                    toolbar3:
                        "subscript superscript | " +
                        "ltr rtl | visualchars nonbreaking | " +
                        "codesample customQuote | insertdatetime | preview help",

                    // Font options (simplified for better compatibility)
                    font_size_formats: "8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt",

                    // Block formats
                    block_formats:
                        "Paragraph=p; Header 1=h1; Header 2=h2; Header 3=h3; Header 4=h4; Header 5=h5; Header 6=h6; Preformatted=pre; Blockquote=blockquote",

                    // Advanced list options
                    advlist_bullet_styles: "square circle disc",
                    advlist_number_styles: "lower-alpha lower-roman upper-alpha upper-roman",

                    // Image handling
                    image_advtab: true,
                    image_caption: true,
                    image_title: true,
                    automatic_uploads: true,
                    file_picker_types: "image",

                    // Image upload configuration
                    images_upload_handler: function (blobInfo, success, failure) {
                        // Convert image to base64 for inline storage
                        const reader = new FileReader();
                        reader.onload = function () {
                            success(reader.result);
                        };
                        reader.onerror = function () {
                            failure("Image upload failed");
                        };
                        reader.readAsDataURL(blobInfo.blob());
                    },

                    // File picker for external images
                    file_picker_callback: function (callback, value, meta) {
                        if (meta.filetype === "image") {
                            const input = document.createElement("input");
                            input.setAttribute("type", "file");
                            input.setAttribute("accept", "image/*");

                            input.onchange = function () {
                                const file = this.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = function () {
                                        callback(reader.result, {
                                            alt: file.name,
                                            title: file.name,
                                        });
                                    };
                                    reader.readAsDataURL(file);
                                }
                            };

                            input.click();
                        }
                    },

                    // Table options
                    table_responsive_width: true,
                    table_default_attributes: {
                        border: "1",
                    },
                    table_default_styles: {
                        "border-collapse": "collapse",
                        width: "100%",
                    },

                    // Content styling
                    content_style: `
                        body { 
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                            font-size: 14px; 
                            line-height: 1.6;
                            color: #333;
                            max-width: 100%;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        h1, h2, h3, h4, h5, h6 { 
                            margin: 1em 0 0.5em 0; 
                            font-weight: 600;
                            line-height: 1.3;
                        }
                        p { margin: 0 0 1em 0; }
                        blockquote { 
                            border-left: 4px solid #ccc; 
                            margin: 1em 0; 
                            padding: 0.5em 1em; 
                            background: #f9f9f9;
                        }
                        code { 
                            background: #f4f4f4; 
                            padding: 2px 4px; 
                            border-radius: 3px; 
                        }
                        pre { 
                            background: #f4f4f4; 
                            padding: 1em; 
                            border-radius: 5px; 
                            overflow-x: auto; 
                        }
                        table { 
                            border-collapse: collapse; 
                            width: 100%; 
                            margin: 1em 0; 
                        }
                        td, th { 
                            border: 1px solid #ddd; 
                            padding: 8px; 
                            text-align: left; 
                        }
                        th { 
                            background-color: #f2f2f2; 
                            font-weight: bold; 
                        }
                        img { 
                            max-width: 100%; 
                            height: auto; 
                            border-radius: 4px; 
                        }
                        hr { 
                            border: none; 
                            border-top: 2px solid #eee; 
                            margin: 2em 0; 
                        }
                    `,

                    placeholder: placeholder,
                    branding: false,
                    statusbar: true,
                    elementpath: true,
                    resize: "both",

                    // Color options for text and background
                    color_map: [
                        "000000",
                        "Black",
                        "993300",
                        "Burnt orange",
                        "333300",
                        "Dark olive",
                        "003300",
                        "Dark green",
                        "003366",
                        "Dark azure",
                        "000080",
                        "Navy Blue",
                        "333399",
                        "Indigo",
                        "333333",
                        "Very dark gray",
                        "800000",
                        "Maroon",
                        "FF6600",
                        "Orange",
                        "808000",
                        "Olive",
                        "008000",
                        "Green",
                        "008080",
                        "Teal",
                        "0000FF",
                        "Blue",
                        "666699",
                        "Grayish blue",
                        "808080",
                        "Gray",
                        "FF0000",
                        "Red",
                        "FF9900",
                        "Amber",
                        "99CC00",
                        "Yellow green",
                        "339966",
                        "Sea green",
                        "33CCCC",
                        "Turquoise",
                        "3366FF",
                        "Royal blue",
                        "800080",
                        "Purple",
                        "999999",
                        "Medium gray",
                        "FF00FF",
                        "Magenta",
                        "FFCC00",
                        "Gold",
                        "FFFF00",
                        "Yellow",
                        "00FF00",
                        "Lime",
                        "00FFFF",
                        "Aqua",
                        "00CCFF",
                        "Sky blue",
                        "993366",
                        "Red violet",
                        "FFFFFF",
                        "White",
                        "FF99CC",
                        "Pink",
                        "FFCC99",
                        "Peach",
                        "FFFF99",
                        "Light yellow",
                        "CCFFCC",
                        "Pale green",
                        "CCFFFF",
                        "Pale cyan",
                        "99CCFF",
                        "Light sky blue",
                        "CC99FF",
                        "Plum",
                    ],

                    // Vô hiệu hóa Grammarly để tránh xung đột
                    body_class: "mce-content-body",
                    content_css: false,
                    setup: function (editor) {
                        editor.on("init", function () {
                            // Vô hiệu hóa Grammarly trên editor
                            const editorBody = editor.getBody();
                            if (editorBody) {
                                editorBody.setAttribute("data-gramm", "false");
                                editorBody.setAttribute("data-gramm_editor", "false");
                                editorBody.setAttribute("data-enable-grammarly", "false");
                                editorBody.setAttribute("spellcheck", "false");
                            }
                        });

                        // Custom buttons for better functionality
                        editor.ui.registry.addButton("customQuote", {
                            text: "Quote",
                            tooltip: "Insert Quote Block",
                            onAction: function () {
                                editor.insertContent('<blockquote><p>"Insert your quote here..."</p><footer>— Author Name</footer></blockquote>');
                            },
                        });

                        editor.ui.registry.addButton("customHr", {
                            text: "Line",
                            tooltip: "Insert Horizontal Line",
                            onAction: function () {
                                editor.insertContent("<hr />");
                            },
                        });
                    },
                }}
            />
        </div>
    );
};

export default RichTextEditor;
