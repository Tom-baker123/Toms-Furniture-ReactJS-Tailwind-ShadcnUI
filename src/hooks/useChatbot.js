import { useState, useCallback, useContext } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_API_KEY } from "@/api/apiConfig";
import { APIContext } from "@/context/APIContext";

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

export const useChatbot = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { products, categories, brands, colors, materials, sizes } = useContext(APIContext);

    const formatProductsForAI = useCallback((products) => {
        if (!products?.items) return "Hiện tại chưa có sản phẩm nào.";

        return products.items.map(product => {
            const variant = product.productVariants?.[0];
            const image = product.sliders?.[0]?.imageUrl;

            return {
                id: product.id,
                name: product.productName,
                category: product.categoryName,
                brand: product.brandName,
                price: variant ? {
                    original: variant.originalPrice,
                    discounted: variant.discountedPrice,
                    currency: "VND"
                } : null,
                description: product.specificationDescription,
                color: variant?.colorName,
                size: variant?.sizeName,
                material: variant?.materialName,
                stock: variant?.stockQty,
                image: image,
                slug: product.slug
            };
        }).slice(0, 20);
    }, []);

    const generateAIResponse = useCallback(async (userMessage) => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

            const productsData = formatProductsForAI(products);
            const categoriesData = categories?.map(cat => ({ id: cat.id, name: cat.categoryName })) || [];
            const brandsData = brands?.map(brand => ({ id: brand.id, name: brand.brandName })) || [];

            const prompt = `
Bạn là trợ lý AI của Tom's Furniture. Hãy trả lời NGẮN GỌN và TỪ 150-250 từ.

NHIỆM VỤ:
1. Hiểu nhu cầu khách hàng
2. Gợi ý 2-3 sản phẩm phù hợp nhất
3. Đưa lời khuyên thiết thực
4. Hỏi thêm nếu cần

SẢN PHẨM CÓ SẴN:
${JSON.stringify(productsData, null, 2)}

DANH MỤC: ${JSON.stringify(categoriesData, null, 2)}
THƯƠNG HIỆU: ${JSON.stringify(brandsData, null, 2)}

YÊU CẦU: "${userMessage}"

FORMAT TRẢ LỜI:
• Hiểu nhu cầu (1 câu)
• Gợi ý sản phẩm phù hợp với tên, giá, lý do chọn
• Lời khuyên ngắn
• Câu hỏi để tư vấn tốt hơn

LưU Ý: Trả lời ngắn gọn, thân thiện, sử dụng emoji phù hợp. Ưu tiên sản phẩm có khuyến mãi.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Error generating AI response:", error);
            return "Xin lỗi, tôi gặp một chút vấn đề kỹ thuật 😅 Bạn có thể thử lại hoặc liên hệ trực tiếp với chúng tôi qua hotline để được hỗ trợ tốt nhất nhé! 📞";
        }
    }, [products, categories, brands, formatProductsForAI]);

    const sendMessage = useCallback(async (message) => {
        if (!message.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            text: message,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const aiResponse = await generateAIResponse(message);

            const botMessage = {
                id: Date.now() + 1,
                text: aiResponse,
                sender: "bot",
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = {
                id: Date.now() + 1,
                text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [generateAIResponse, isLoading]);

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    const initializeChat = useCallback(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    id: 1,
                    text: "Xin chào! 👋\n\nTôi là AI của Tom's Furniture. Tôi có thể:\n• Tìm sản phẩm nội thất\n• Tư vấn thiết kế\n• So sánh giá\n• Gợi ý bố trí\n\nBạn cần tìm gì? 😊",
                    sender: "bot",
                    timestamp: new Date(),
                }
            ]);
        }
    }, [messages.length]);

    return {
        messages,
        isLoading,
        sendMessage,
        clearMessages,
        initializeChat
    };
};

export default useChatbot;
