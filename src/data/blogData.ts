import type { BlogPost } from "@/types/blog";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "How to Choose the Right Vendor for Your Needs",
    excerpt:
      "Finding the perfect vendor can be overwhelming. Here are our top tips for making the right choice for your specific needs and budget.",
    category: "Tips & Guides",
    date: "November 8, 2025",
    readTime: "5 min read",
    image: "/assets/images/homeHeroImg1.png",
    author: { name: "Sarah Johnson", avatar: "SJ" },
  },
  {
    id: "2",
    title: "5 Benefits of Supporting Local Vendors",
    excerpt:
      "Discover why choosing local vendors is not just good for your community, but also provides better service and builds lasting relationships.",
    category: "Community",
    date: "November 5, 2025",
    readTime: "4 min read",
    image: "/assets/images/homeHeroImg2.png",
    author: { name: "Michael Chen", avatar: "MC" },
  },
  {
    id: "3",
    title: "Growing Your Vendor Business: Essential Strategies",
    excerpt: "Learn proven strategies to attract more customers, increase bookings, and build a successful vendor business on Afrivendor.",
    category: "For Vendors",
    date: "November 2, 2025",
    readTime: "7 min read",
    image: "/assets/images/homeHeroImg3.png",
    author: { name: "Amara Okafor", avatar: "AO" },
  },
  {
    id: "4",
    title: "The Future of Local Service Marketplaces",
    excerpt: "Explore how technology is transforming the way customers discover and book local services, and what it means for the future.",
    category: "Industry Insights",
    date: "October 30, 2025",
    readTime: "6 min read",
    image: "/assets/images/homeHeroImg4.png",
    author: { name: "David Williams", avatar: "DW" },
  },
  {
    id: "5",
    title: "Customer Reviews: Why They Matter and How to Leave Great Ones",
    excerpt: "Reviews are crucial for vendors and customers alike. Learn how to write helpful reviews that benefit the entire community.",
    category: "Tips & Guides",
    date: "October 27, 2025",
    readTime: "5 min read",
    image: "/assets/images/vendorImg.png",
    author: { name: "Sarah Johnson", avatar: "SJ" },
  },
  {
    id: "6",
    title: "Afrivendor Success Stories: From Local to Thriving",
    excerpt: "Meet some of our most successful vendors who have grown their businesses exponentially through our platform.",
    category: "Success Stories",
    date: "October 24, 2025",
    readTime: "8 min read",
    image: "/assets/images/vendor.jpeg",
    author: { name: "Amara Okafor", avatar: "AO" },
  },
];

export const blogCategories = ["All", "Tips & Guides", "Community", "For Vendors", "Industry Insights", "Success Stories"] as const;
