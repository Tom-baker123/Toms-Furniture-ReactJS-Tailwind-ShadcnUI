import React, { useState, useEffect, useRef, useContext } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APIContext } from "@/context/APIContext";
import useChatbot from "@/hooks/useChatbot";

const ChatBotAi = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputMessage, setInputMessage] = useState("");
    const messagesEndRef = useRef(null);
    const { messages, isLoading, sendMessage, initializeChat } = useChatbot();
    const { products, loading, refetch } = useContext(APIContext);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            initializeChat();
        }
    }, [isOpen, initializeChat]);

    // Từ khóa liên quan đến nội thất
    const furnitureKeywords = [
        "bàn", "ghế", "sofa", "giường", "tủ", "nội thất", "phòng khách", 
        "phòng ngủ", "phòng ăn", "giá", "màu", "kích thước", "chất liệu"
    ];

    // Hàm kiểm tra câu hỏi có liên quan đến nội thất không
    const isFurnitureRelated = (message) => {
        const lowerMessage = message.toLowerCase();
        return furnitureKeywords.some(keyword => lowerMessage.includes(keyword));
    };

    // Hàm xử lý gợi ý sản phẩm dựa trên câu hỏi
    const getProductSuggestions = (message) => {
        if (!products || !products.items) return [];

        const lowerMessage = message.toLowerCase();
        let filteredProducts = products.items;

        // Lọc theo danh mục
        if (lowerMessage.includes("bàn ăn")) {
            filteredProducts = filteredProducts.filter(p => p.categoryName === "Bàn Ăn");
        } else if (lowerMessage.includes("ghế ăn")) {
            filteredProducts = filteredProducts.filter(p => p.categoryName === "Ghế Ăn");
        } else if (lowerMessage.includes("sofa")) {
            filteredProducts = filteredProducts.filter(p => p.categoryName === "Ghế Sofa");
        } else if (lowerMessage.includes("giường")) {
            filteredProducts = filteredProducts.filter(p => p.categoryName === "Giường");
        }

        // Lọc theo giá
        if (lowerMessage.includes("dưới 5 triệu")) {
            filteredProducts = filteredProducts.filter(p => 
                p.productVariants.some(v => v.discountedPrice <= 5000000)
            );
        }

        // Lọc theo phòng
        if (lowerMessage.includes("phòng khách")) {
            filteredProducts = filteredProducts.filter(p => 
                p.specificationDescription.toLowerCase().includes("phòng khách")
            );
        }

        // Lấy tối đa 4 sản phẩm làm gợi ý
        return filteredProducts.slice(0, 4).map(p => ({
            name: p.productName,
            price: p.productVariants[0]?.discountedPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
            image: p.sliders[0]?.imageUrl || ""
        }));
    };

    // Hàm xử lý gửi tin nhắn
    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const message = inputMessage;
        setInputMessage("");

        if (!isFurnitureRelated(message)) {
            // Gửi phản hồi cho câu hỏi không liên quan
            await sendMessage(message, {
                response: "Xin lỗi, tôi chỉ có thể hỗ trợ về nội thất. Bạn muốn tìm hiểu về sản phẩm nào, ví dụ như bàn, ghế, hoặc sofa?"
            });
            return;
        }

        // Lấy gợi ý sản phẩm
        const suggestions = getProductSuggestions(message);
        let response = "Dưới đây là một số sản phẩm phù hợp:\n";
        if (suggestions.length > 0) {
            response += suggestions.map(s => `- ${s.name}: ${s.price}`).join("\n");
        } else {
            response = "Không tìm thấy sản phẩm phù hợp. Bạn có thể cung cấp thêm chi tiết, ví dụ như loại nội thất, giá cả, hoặc màu sắc?";
        }

        await sendMessage(message, { response });
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const renderMessage = (message) => {
        const isBot = message.sender === "bot";

        return (
            <div
                key={message.id}
                className={`flex gap-2 ${isBot ? "justify-start" : "justify-end"}`}
            >
                {isBot && (
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                        <Bot className="h-2.5 w-2.5 text-white" />
                    </div>
                )}

                <div
                    className={`max-w-[80%] rounded-lg p-2 ${
                        isBot ? "border border-gray-200 bg-white text-gray-800" : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                    }`}
                >
                    <div className="text-xs leading-snug whitespace-pre-wrap">{message.text}</div>
                    <div className={`mt-0.5 text-xs ${isBot ? "text-gray-400" : "text-blue-100"}`}>
                        {message.timestamp.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </div>
                </div>

                {!isBot && (
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                        <User className="h-2.5 w-2.5 text-white" />
                    </div>
                )}
            </div>
        );
    };

    // Gợi ý nhanh động dựa trên sản phẩm từ API
    const quickSuggestions = products && products.items
        ? products.items.slice(0, 4).map(p => ({
              name: p.productName,
              price: p.productVariants[0]?.discountedPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
          }))
        : [];

    const handleSuggestionClick = (suggestion) => {
        setInputMessage(suggestion.name);
    };

    return (
        <>
            {/* Floating Chat Button */}
            <div className="fixed right-4 bottom-17 z-50">
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-purple-600"
                >
                    {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
                </Button>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed right-4 bottom-30 z-50 flex h-[400px] w-72 flex-col rounded-lg border border-gray-200 bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between rounded-t-lg bg-gradient-to-r from-blue-500 to-purple-500 p-2.5 text-white">
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                                <Bot className="h-3.5 w-3.5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium">Tom's AI</h3>
                                <p className="flex items-center gap-1 text-xs text-blue-100">
                                    <div className="h-1 w-1 animate-pulse rounded-full bg-green-400"></div>
                                    Online
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={() => setIsOpen(false)}
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 rounded-full p-0 text-white hover:bg-white/20"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 space-y-2 overflow-y-auto bg-gray-50/30 p-2">
                        {messages.map(renderMessage)}

                        {/* Quick Suggestions */}
                        {messages.length <= 1 && quickSuggestions.length > 0 && (
                            <div className="space-y-1">
                                <p className="mb-1 text-center text-xs text-gray-500">Gợi ý nhanh:</p>
                                {quickSuggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="w-full rounded border border-gray-200 bg-white p-1.5 text-left text-xs transition-colors duration-200 hover:bg-blue-50"
                                    >
                                        {suggestion.name}: {suggestion.price}
                                    </button>
                                ))}
                            </div>
                        )}

                        {isLoading && (
                            <div className="flex justify-start gap-2">
                                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                                    <Bot className="h-2.5 w-2.5 text-white" />
                                </div>
                                <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white p-1.5">
                                    <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                                    <span className="text-xs text-gray-500">Đang trả lời...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t bg-white p-2">
                        <div className="flex gap-1.5">
                            <Input
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Hỏi về nội thất..."
                                disabled={isLoading}
                                className="h-7 flex-1 border-gray-300 text-xs focus:border-blue-500"
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={isLoading || !inputMessage.trim()}
                                size="sm"
                                className="h-7 w-7 bg-gradient-to-r from-blue-500 to-purple-500 p-0 hover:from-blue-600 hover:to-purple-600"
                            >
                                <Send className="h-2.5 w-2.5" />
                            </Button>
                        </div>
                        <p className="mt-1 text-center text-xs text-gray-400">AI • Tom's Furniture</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBotAi;