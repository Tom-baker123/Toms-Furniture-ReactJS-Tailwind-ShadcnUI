import BannerForm from "@/components/Admin/Form/BannerForm";
import StoreInformationForm from "@/components/Admin/Form/StoreInformationForm";
import TabCT from "@/components/tailwind-custom/TabCT";
import React, { useState } from "react";

const WebsiteManagement = () => {
    const [activeTab, setActiveTab] = useState("StoreInformationForm");

    // Tab configuration - Chỉ giữ tab "Web Info"
    const tabs = [
        { id: "StoreInformationForm", label: "Store Information", icon: "" },
        { id: "BannerForm", label: "Banner", icon: "" },
    ];

    const contentComponents = {
        StoreInformationForm: <StoreInformationForm />,
        BannerForm: <BannerForm />,
    };

    return (
        <div>
            {/* Sử dụng component Tabs */}
            <TabCT
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                contentComponents={contentComponents}
            />
        </div>
    );
};

export default WebsiteManagement;
