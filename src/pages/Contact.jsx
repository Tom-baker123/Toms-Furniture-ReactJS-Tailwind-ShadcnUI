import React, { useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import { APIContext } from "@/context/APIContext";

const Contact = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [feedbackType, setFeedbackType] = useState("feedback"); // 'feedback' or 'reply'
    const { storeInformation, loading, error } = useContext(APIContext); // Lấy thông tin cửa hàng

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm({
        defaultValues: {
            fullName: "",
            phoneNumber: "",
            email: "",
            message: "",
            parentFeedbackId: 0,
            userId: 0,
        },
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log("Contact Form Data:", data);
            toast.success("Tin nhắn đã được gửi thành công!");
            reset();
        } catch (error) {
            toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
        } finally {
            setIsLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: MapPin,
            title: "Địa chỉ",
            content: storeInformation?.storeAddress,
        },
        {
            icon: Phone,
            title: "Điện thoại",
            content: storeInformation?.phoneNumber,
        },
        {
            icon: Mail,
            title: "Email",
            content: storeInformation?.email,
        },
        {
            icon: Clock,
            title: "Giờ làm việc",
            content: storeInformation?.operatingHours,
        },
    ];

    return (
        <div className="container-custom">
            {/* Hero Section */}
            <div className="bg-white">
                <div className="">
                    <div className="text-center">
                        <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">Liên hệ với chúng tôi</h1>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600">
                            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông tin và chúng tôi sẽ phản hồi sớm nhất có thể.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container-custom mx-auto px-4 py-16">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {/* Contact Information */}
                    <div className="lg:col-span-1">
                        <div className="rounded-2xl border bg-white p-8">
                            <h2 className="mb-6 text-2xl font-bold text-gray-900">Thông tin liên hệ</h2>
                            <div className="space-y-6">
                                {contactInfo.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-4"
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                                                <item.icon className="h-6 w-6 text-blue-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-gray-900">{item.title}</h3>
                                            <p className="text-gray-600">{item.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Additional Info */}
                            <div className="mt-8 border-t border-gray-100 pt-8">
                                <h3 className="mb-4 font-semibold text-gray-900">Tại sao chọn chúng tôi?</h3>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li className="flex items-center space-x-2">
                                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                        <span>Phản hồi nhanh chóng trong 24h</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                        <span>Tư vấn chuyên nghiệp</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                        <span>Hỗ trợ 24/7</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl border bg-white p-8">
                            <div className="mb-6 flex items-center space-x-3">
                                <MessageCircle className="h-6 w-6 text-blue-600" />
                                <h2 className="text-2xl font-bold text-gray-900">Gửi tin nhắn cho chúng tôi</h2>
                            </div>

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Full Name */}
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Họ và tên <span className="text-red-500">*</span>
                                        </label>
                                        <Controller
                                            name="fullName"
                                            control={control}
                                            rules={{
                                                required: "Họ và tên là bắt buộc",
                                                minLength: {
                                                    value: 2,
                                                    message: "Họ và tên phải có ít nhất 2 ký tự",
                                                },
                                                maxLength: {
                                                    value: 100,
                                                    message: "Họ và tên không được quá 100 ký tự",
                                                },
                                            }}
                                            render={({ field }) => (
                                                <input
                                                    type="text"
                                                    className={`w-full rounded-xl border px-4 py-3 transition-colors duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                                        errors.fullName ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                    placeholder="Nhập họ và tên của bạn"
                                                    {...field}
                                                />
                                            )}
                                        />
                                        {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>}
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Số điện thoại <span className="text-red-500">*</span>
                                        </label>
                                        <Controller
                                            name="phoneNumber"
                                            control={control}
                                            rules={{
                                                required: "Số điện thoại là bắt buộc",
                                                pattern: {
                                                    value: /^[0-9]{10,11}$/,
                                                    message: "Số điện thoại phải có 10-11 chữ số",
                                                },
                                            }}
                                            render={({ field }) => (
                                                <input
                                                    type="tel"
                                                    className={`w-full rounded-xl border px-4 py-3 transition-colors duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                                        errors.phoneNumber ? "border-red-500" : "border-gray-300"
                                                    }`}
                                                    placeholder="Nhập số điện thoại"
                                                    {...field}
                                                />
                                            )}
                                        />
                                        {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber.message}</p>}
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="email"
                                        control={control}
                                        rules={{
                                            required: "Email là bắt buộc",
                                            pattern: {
                                                value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                                                message: "Email không hợp lệ",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <input
                                                type="email"
                                                className={`w-full rounded-xl border px-4 py-3 transition-colors duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                                    errors.email ? "border-red-500" : "border-gray-300"
                                                }`}
                                                placeholder="Nhập địa chỉ email"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Tin nhắn <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="message"
                                        control={control}
                                        rules={{
                                            required: "Tin nhắn là bắt buộc",
                                            minLength: {
                                                value: 10,
                                                message: "Tin nhắn phải có ít nhất 10 ký tự",
                                            },
                                            maxLength: {
                                                value: 1000,
                                                message: "Tin nhắn không được quá 1000 ký tự",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <textarea
                                                rows={5}
                                                className={`w-full resize-none rounded-xl border px-4 py-3 transition-colors duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                                    errors.message ? "border-red-500" : "border-gray-300"
                                                }`}
                                                placeholder="Nhập tin nhắn của bạn..."
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
                                    <p className="mt-1 text-sm text-gray-500">{watch("message")?.length || 0}/1000 ký tự</p>
                                </div>

                                {/* Hidden Fields - Following JSON Schema */}
                                <Controller
                                    name="parentFeedbackId"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="hidden"
                                            {...field}
                                        />
                                    )}
                                />

                                <Controller
                                    name="userId"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="hidden"
                                            {...field}
                                        />
                                    )}
                                />

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`flex w-full items-center justify-center space-x-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition-all duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                                            isLoading ? "cursor-not-allowed opacity-50" : ""
                                        }`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                <span>Đang gửi...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-5 w-5" />
                                                <span>Gửi tin nhắn</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            {/* <div className="bg-white border-t">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Câu hỏi thường gặp
            </h2>
            <p className="text-gray-600">
              Một số câu hỏi phổ biến từ khách hàng
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: 'Thời gian phản hồi là bao lâu?',
                answer: 'Chúng tôi cam kết phản hồi trong vòng 24 giờ làm việc.'
              },
              {
                question: 'Có hỗ trợ tư vấn trực tiếp không?',
                answer: 'Có, bạn có thể gọi điện hoặc đến trực tiếp showroom để được tư vấn.'
              },
              {
                question: 'Có thể đặt hàng qua form liên hệ không?',
                answer: 'Form liên hệ chủ yếu dành cho tư vấn. Để đặt hàng, vui lòng truy cập trang sản phẩm.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div> */}
        </div>
    );
};

export default Contact;
