import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationHelper = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Hàm xử lý điều hướng thông minh
    const handleNavigation = (href, options = {}) => {
        const {
            openInNewTab = false,
            replace = false,
            state = null
        } = options;

        if (!href || href === "#") {
            console.warn('Invalid navigation href:', href);
            return;
        }

        // Kiểm tra nếu là external link
        if (href.startsWith('http://') || href.startsWith('https://')) {
            if (openInNewTab) {
                window.open(href, '_blank', 'noopener,noreferrer');
            } else {
                window.location.href = href;
            }
            return;
        }

        // Kiểm tra nếu là mailto hoặc tel
        if (href.startsWith('mailto:') || href.startsWith('tel:')) {
            window.location.href = href;
            return;
        }

        // Điều hướng internal link
        try {
            if (replace) {
                navigate(href, { replace: true, state });
            } else {
                navigate(href, { state });
            }
        } catch (error) {
            console.error('Navigation error:', error);
            // Fallback to window.location
            window.location.href = href;
        }
    };

    // Kiểm tra xem path hiện tại có active không
    const isActive = (href) => {
        if (!href || href === "#") return false;
        return location.pathname === href || location.pathname.startsWith(href + '/');
    };

    return {
        handleNavigation,
        isActive,
        currentPath: location.pathname
    };
};

export default NavigationHelper;
