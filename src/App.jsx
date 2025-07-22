import React from "react";
import RouterSetup from "./routes/RouterSetup";
import ToastProvider from "./ToastProvider";

function App() {
    return (
        <>
            <ToastProvider />
            <RouterSetup /> {/* 3. Thiết lập URL */}
        </>
    );
}

export default App;
