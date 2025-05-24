import React from "react";

const ReadMore = ({ maxLength = 100 }) => {
    const [isExpand, setIsExpand] = useState(false);

    const toggleReadMore = () => setIsExpand(!isExpand);

    

    return <div>ReadMore</div>;
};

export default ReadMore;
