export const apiRequest = async (url, { method = 'GET', body, headers = {} } = {}) => {
    const isFormData = body instanceof FormData; // Kiểm tra xem body có phải là FormData hay không

    const options = {
        method,
        headers: {
            ...headers,
            // Nếu body là FormData thì KHÔNG tự set Content-Type vì trình duyệt sẽ tự xử lý (kèm boundary)
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        },
        credentials: 'include', // Đảm bảo gửi cookie, ví dụ: để xác thực session
    };

    // Gán body vào options (FormData giữ nguyên, còn object JSON thì stringify)
    if (body) {
        options.body = isFormData ? body : JSON.stringify(body);
    }

    const response = await fetch(url, options);

    const contentType = response.headers.get('content-type');
    let data;

    // Phân tích dữ liệu trả về tùy theo kiểu nội dung
    if (contentType && contentType.includes('application/json')) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    // Nếu request thất bại (status không thuộc 2xx), ném ra lỗi
    if (!response.ok) {
        throw {
            status: response.status,
            message: data
        };
    }

    // Trả kết quả thành công
    return data;
};
