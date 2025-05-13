import {
  Home, Sofa, Search, LayoutList, ShoppingCart,
  User, ChartLine, TicketPercent, Settings
} from 'lucide-react'

// [1. Sidebar Menu]--------------------------------------------
export const FakeAdminData = [
  {
    title: "General", url: "/admin", icon: Home,
    subMenu: []
  },
  {
    title: "Category", url: "/admin/category", icon: LayoutList,
    subMenu: [
      { title: "Product1", url: "/admin/product", icon: Sofa },
      { title: "Product2", url: "/admin/product", icon: Sofa },
    ]
  },
  {
    title: "Product", url: "/admin/product", icon: Sofa,
    subMenu: [
      { title: "Product1", url: "/admin/product", icon: Sofa },
      { title: "Product2", url: "/admin/product", icon: Sofa },
    ]
  },
  {
    title: "Order", url: "/admin/order", icon: ShoppingCart,
    subMenu: [
      { title: "Product1", url: "/admin/product", icon: Sofa },
      { title: "Product2", url: "/admin/product", icon: Sofa },
    ]
  },
  {
    title: "Report", url: "/admin/analyticsReport", icon: ChartLine,
    subMenu: [
      { title: "Product1", url: "/admin/product", icon: Sofa },
      { title: "Product2", url: "/admin/product", icon: Sofa },
    ]
  },
  {
    title: "Customer", url: "/admin/customer", icon: User,
    subMenu: [
      { title: "Product1", url: "/admin/product", icon: Sofa },
      { title: "Product2", url: "/admin/product", icon: Sofa },
    ]
  },
  {
    title: "Promotion", url: "/admin/promotion", icon: TicketPercent,
    subMenu: [
      { title: "Product1", url: "/admin/product", icon: Sofa },
      { title: "Product2", url: "/admin/product", icon: Sofa },
    ]
  },

]
// [1. Sidebar Menu - END]--------------------------------------
