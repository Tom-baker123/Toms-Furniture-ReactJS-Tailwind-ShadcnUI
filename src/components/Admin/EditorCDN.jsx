import { useEffect } from "react";

const EditorCDN = () => {
    useEffect(() => {
        if (window.ClassicEditor) {
            window.ClassicEditor.create(document.querySelector("#editor")).catch((error) => {
                console.error(error);
            });
        }
    }, []);

    return (
        <div>
            <textarea id="editor"></textarea>
        </div>
    );
};

export default EditorCDN;
