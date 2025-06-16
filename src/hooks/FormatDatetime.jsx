import React from "react";

const FormatDatetime = (date) => {
    return new Intl.DateTimeFormat("vi-VN").format(new Date(date));
};

export default FormatDatetime;
