import FeatureSection from "@/components/Home/FeatureSection";
import PromotionBanner from "@/components/Home/PromotionBanner";
import AlbumSwiper from "@/components/Home/Swiper-Components/AlbumSwiper";
import CategorySwiper from "@/components/Home/Swiper-Components/CategorySwiper";
import HeroSwiper from "@/components/Home/Swiper-Components/HeroSwiper";
import NewArrivalsSwiper from "@/components/Home/Swiper-Components/NewArrivalsSwiper";
import { useModal } from "@/context/ModalContext";
import React, { useState } from "react";

const Home = () => {
    return (
        <main>
            {/* 1. Swiper danh mục */}
            <CategorySwiper />
            {/* 2. Swiper Banner Hero */}
            <HeroSwiper />
            {/* 3. New Arrivals Swiper */}
            <NewArrivalsSwiper />
            {/* 4. Album Swiper */}
            <AlbumSwiper />
            {/* 5. FeatureSection */}
            <FeatureSection />
            {/* 6. PromotionBanner */}
            <PromotionBanner />
        </main>
    );
};

export default Home;
