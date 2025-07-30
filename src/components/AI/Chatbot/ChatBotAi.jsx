import React from "react";
import { GOOGLE_API_KEY } from "@/api/apiConfig";
import { GoogleGenerativeAI } from "@google/generative-ai";
const model = "gemini-2.5-flash-lite";
const geminiai = GoogleGenerativeAI(GOOGLE_API_KEY);

const ChatBotAi = () => {
    return <div>ChatBotAi</div>;
};

export default ChatBotAi;
