// import vendorImg from "/assets/images/vendor.jpeg";
// import { StaticImageData } from "next/image";
import type { MockVendor as Vendor } from "@/types/misc";

export const vendors: Vendor[] = [
  {
    id: "zuriglow-beauty-hub",
    name: "ZuriGlow Beauty Hub",
    category: "Wellness & Beauty",
    location: "Nairobi, Kenya",
    rating: 5.0,
    reviewCount: 86,
    priceRange: "40–70",
    minPrice: 40,
    maxPrice: 70,
    image: "/assets/images/aboutHeroImg.png",
    description: "Premier natural hair care and styling salon specializing in braids and spa treatments",
    services: [
      {
        id: "natural-styling",
        name: "Natural Hair Styling",
        price: 60,
        duration: "2 hours",
        description: "Professional styling for natural hair textures including twists, bantu knots, and wash & go styles",
      },
      {
        id: "box-braids",
        name: "Box Braids",
        price: 70,
        duration: "4 hours",
        description: "Classic box braids with premium synthetic or human hair extensions",
      },
      {
        id: "hair-spa",
        name: "Hair Spa Treatment",
        price: 50,
        duration: "1.5 hours",
        description: "Deep conditioning treatment with scalp massage and steam therapy",
      },
      {
        id: "cornrows",
        name: "Cornrow Braiding",
        price: 45,
        duration: "2.5 hours",
        description: "Intricate cornrow patterns and designs for all hair types",
      },
    ],
    about:
      "ZuriGlow Beauty Hub is Nairobi's premier destination for natural hair care. Our expert stylists specialize in protective styles, natural hair treatments, and luxurious spa services.",
    openingHours: "Mon-Sat: 9:00 AM - 7:00 PM, Sun: 10:00 AM - 5:00 PM",
  },

  {
    id: "glamluxe-studios",
    name: "GlamLuxe Studios",
    category: "Wellness & Beauty",
    location: "Accra, Ghana",
    rating: 4.9,
    reviewCount: 62,
    priceRange: "50–95",
    minPrice: 50,
    maxPrice: 95,
    image: "/assets/images/homeHeroImg1.png",
    description: "Premium studio offering personalized bridal and event makeup sessions with skin-prep consultation and touch-up kit",
    services: [
      {
        id: "bridal-makeup",
        name: "Bridal Makeup Package",
        price: 95,
        duration: "2 hours",
        description: "Complete bridal makeup with skin-prep consultation and touch-up kit included",
      },
      {
        id: "event-makeup",
        name: "Event Makeup",
        price: 70,
        duration: "1.5 hours",
        description: "Professional makeup for special occasions and photoshoots",
      },
      {
        id: "natural-makeup",
        name: "Natural Look Makeup",
        price: 50,
        duration: "1 hour",
        description: "Subtle, fresh makeup for everyday elegance",
      },
      {
        id: "makeup-lesson",
        name: "Makeup Tutorial",
        price: 60,
        duration: "1.5 hours",
        description: "Personalized makeup lesson with tips and product recommendations",
      },
    ],
    about:
      "GlamLuxe Studios is Accra's premier makeup destination, specializing in bridal beauty and special event makeup. Our expert makeup artists use premium products to enhance natural beauty.",
    openingHours: "Mon-Sat: 9:00 AM - 7:00 PM, Sun: By appointment",
  },

  {
    id: "fade-district",
    name: "Fade District Barbershop",
    category: "Barbershop",
    location: "Abuja, Nigeria",
    rating: 5.0,
    reviewCount: 123,
    priceRange: "30–60",
    minPrice: 30,
    maxPrice: 60,
    image: "/assets/images/contactHeroImg.png",
    description: "Premium barbershop delivering precision cuts and expert beard grooming",
    services: [
      {
        id: "precision-cut",
        name: "Precision Haircut",
        price: 40,
        duration: "45 minutes",
        description: "Sharp, clean cuts with attention to detail and finishing",
      },
      {
        id: "beard-trim",
        name: "Beard Trim & Shape",
        price: 30,
        duration: "30 minutes",
        description: "Expert beard sculpting and hot towel treatment",
      },
      {
        id: "full-service",
        name: "Full Service Package",
        price: 60,
        duration: "1.5 hours",
        description: "Haircut, beard trim, hot towel shave, and facial massage",
      },
      {
        id: "kids-cut",
        name: "Kids' Haircut",
        price: 25,
        duration: "30 minutes",
        description: "Patient and skilled haircuts for children of all ages",
      },
    ],
    about:
      "Fade District is Abuja's go-to destination for modern grooming. Our master barbers combine traditional techniques with contemporary styles to deliver exceptional results.",
    openingHours: "Mon-Sat: 8:00 AM - 8:00 PM, Sun: 10:00 AM - 6:00 PM",
  },

  {
    id: "chef-aisha-kitchen",
    name: "Chef Aisha's Kitchen",
    category: "Food & Catering",
    location: "Kano, Nigeria",
    rating: 4.8,
    reviewCount: 12,
    priceRange: "80–150",
    minPrice: 80,
    maxPrice: 150,
    image: "/assets/images/homeHeroImg2.png",
    description: "Authentic Northern Nigerian cuisine and private chef services for intimate gatherings",
    services: [
      {
        id: "private-chef",
        name: "Private Chef Service",
        price: 150,
        duration: "4 hours",
        description: "Personalized in-home dining experience with custom menu preparation",
      },
      {
        id: "event-catering",
        name: "Event Meal Catering",
        price: 120,
        duration: "Per event",
        description: "Full-service catering for events up to 50 guests with traditional dishes",
      },
      {
        id: "cooking-class",
        name: "Nigerian Cooking Class",
        price: 80,
        duration: "3 hours",
        description: "Learn to prepare authentic Hausa and Nigerian dishes",
      },
      {
        id: "meal-prep",
        name: "Weekly Meal Prep",
        price: 100,
        duration: "Weekly",
        description: "Healthy meal preparation service for the entire week",
      },
    ],
    about:
      "Chef Aisha brings the rich flavors of Northern Nigeria to your table. With over 15 years of culinary expertise, she specializes in authentic Hausa cuisine and modern African fusion.",
    openingHours: "By appointment only - 7 days a week",
  },

  {
    id: "tastyroots-catering",
    name: "TastyRoots Catering",
    category: "Food & Catering",
    location: "Accra, Ghana",
    rating: 5.0,
    reviewCount: 113,
    priceRange: "90–200",
    minPrice: 90,
    maxPrice: 200,
    image: "/assets/images/homeHeroImg3.png",
    description: "Contemporary African cuisine for corporate events and special occasions",
    services: [
      {
        id: "corporate-catering",
        name: "Corporate Event Catering",
        price: 180,
        duration: "Per event",
        description: "Professional catering for business meetings and conferences (20-100 guests)",
      },
      {
        id: "buffet-service",
        name: "Buffet Service",
        price: 150,
        duration: "Per event",
        description: "Self-service buffet with diverse African and continental dishes",
      },
      {
        id: "cocktail-canapes",
        name: "Cocktail & Canapés",
        price: 120,
        duration: "Per event",
        description: "Elegant finger foods and drinks for networking events",
      },
      {
        id: "meal-delivery",
        name: "Boxed Meal Delivery",
        price: 90,
        duration: "Per order",
        description: "Individual boxed meals delivered for office lunches (min. 10 orders)",
      },
    ],
    about:
      "TastyRoots Catering brings vibrant Ghanaian and West African flavors to corporate events. Our culinary team creates memorable dining experiences that celebrate African heritage.",
    openingHours: "Mon-Sat: 7:00 AM - 7:00 PM",
  },

  {
    id: "zuri-events",
    name: "Zuri Events",
    category: "Event Planning & Decor",
    location: "Lagos, Nigeria",
    rating: 4.9,
    reviewCount: 124,
    priceRange: "100–300",
    minPrice: 100,
    maxPrice: 300,
    image: "/assets/images/homeHeroImg4.png",
    description: "Luxury wedding planning and coordination services with complete vendor management",
    services: [
      {
        id: "full-planning",
        name: "Full Wedding Planning",
        price: 300,
        duration: "3-6 months",
        description: "Comprehensive wedding planning from concept to execution with unlimited consultations",
      },
      {
        id: "partial-planning",
        name: "Partial Wedding Planning",
        price: 200,
        duration: "2-3 months",
        description: "Planning assistance for specific aspects of your wedding (venue, catering, decor)",
      },
      {
        id: "day-coordination",
        name: "Day-of Coordination",
        price: 150,
        duration: "Event day",
        description: "Professional coordination on your wedding day to ensure everything runs smoothly",
      },
      {
        id: "consultation",
        name: "Wedding Consultation",
        price: 100,
        duration: "2 hours",
        description: "Expert guidance and vendor recommendations for DIY couples",
      },
    ],
    about:
      "Zuri Events transforms wedding dreams into reality. With over 10 years of experience in luxury event planning across West Africa, we create unforgettable celebrations.",
    openingHours: "Mon-Sat: 10:00 AM - 6:00 PM",
  },

  {
    id: "bloom-leaf-events",
    name: "Bloom & Leaf Events",
    category: "Event Planning & Decor",
    location: "Nairobi, Kenya",
    rating: 4.8,
    reviewCount: 27,
    priceRange: "300–550",
    minPrice: 300,
    maxPrice: 550,
    image: "/assets/images/vendorImg.png",
    description: "Creative event stylists providing elegant, custom floral and venue décor for weddings and parties",
    services: [
      {
        id: "wedding-decor",
        name: "Wedding Reception Decor Package",
        price: 550,
        duration: "6 hours on-site",
        description: "Complete venue transformation with custom floral arrangements and elegant decor",
      },
      {
        id: "ceremony-decor",
        name: "Ceremony Decor",
        price: 400,
        duration: "4 hours on-site",
        description: "Beautiful ceremony setup with floral arch and aisle decorations",
      },
      {
        id: "party-styling",
        name: "Party Styling",
        price: 350,
        duration: "Per event",
        description: "Custom decor for birthdays, anniversaries, and celebrations",
      },
      {
        id: "floral-design",
        name: "Custom Floral Design",
        price: 300,
        duration: "2-3 days",
        description: "Bespoke floral arrangements for any occasion",
      },
    ],
    about:
      "Bloom & Leaf Events transforms spaces into unforgettable experiences. Our creative team specializes in custom floral design and elegant event styling.",
    openingHours: "Mon-Sat: 9:00 AM - 6:00 PM, By appointment",
  },

  {
    id: "primeedge-solutions",
    name: "PrimeEdge Solutions",
    category: "Corporate Services",
    location: "Nairobi, Kenya",
    rating: 5.0,
    reviewCount: 104,
    priceRange: "150–400",
    minPrice: 150,
    maxPrice: 400,
    image: "/assets/images/vendor.jpeg",
    description: "Professional workspace setup and corporate event staging solutions",
    services: [
      {
        id: "workspace-setup",
        name: "Office Workspace Setup",
        price: 300,
        duration: "2-3 days",
        description: "Complete office design and furniture arrangement for productivity",
      },
      {
        id: "event-staging",
        name: "Corporate Event Staging",
        price: 400,
        duration: "Per event",
        description: "Full event production including AV, staging, and logistics",
      },
      {
        id: "consultation",
        name: "Business Space Consultation",
        price: 150,
        duration: "2 hours",
        description: "Expert advice on optimizing your workspace for efficiency",
      },
      {
        id: "meeting-setup",
        name: "Conference Setup",
        price: 250,
        duration: "Per event",
        description: "Professional meeting room setup with AV and refreshments",
      },
    ],
    about:
      "PrimeEdge Solutions delivers corporate excellence through innovative workspace design and flawless event execution. We help businesses create environments that inspire success.",
    openingHours: "Mon-Fri: 8:00 AM - 6:00 PM, Sat: By appointment",
  },

  {
    id: "fitzone-training",
    name: "FitZone Personal Training",
    category: "Fitness & Wellness",
    location: "Abuja, Nigeria",
    rating: 4.9,
    reviewCount: 81,
    priceRange: "30–60",
    minPrice: 30,
    maxPrice: 60,
    image: "/assets/images/HowitworkHeroImg.png",
    description:
      "Certified personal trainers helping clients achieve fitness goals through strength, cardio, and nutrition-focused sessions",
    services: [
      {
        id: "one-on-one",
        name: "1-on-1 Fitness Session",
        price: 40,
        duration: "1 hour",
        description: "Personalized training session tailored to your fitness goals",
      },
      {
        id: "strength-training",
        name: "Strength Training Program",
        price: 50,
        duration: "1 hour",
        description: "Focused strength building with progressive resistance training",
      },
      {
        id: "nutrition-coaching",
        name: "Nutrition Coaching",
        price: 30,
        duration: "45 mins",
        description: "Personalized nutrition guidance and meal planning",
      },
      {
        id: "monthly-package",
        name: "Monthly Training Package",
        price: 60,
        duration: "12 sessions",
        description: "Comprehensive fitness program with 3 sessions per week",
      },
    ],
    about:
      "FitZone Personal Training is dedicated to helping you achieve your fitness goals. Our certified trainers provide customized programs focused on strength, endurance, and overall wellness.",
    openingHours: "Mon-Sat: 6:00 AM - 9:00 PM, Sun: 8:00 AM - 4:00 PM",
  },

  {
    id: "kofi-woodcraft",
    name: "Kofi Woodcraft",
    category: "Furniture & Woodwork",
    location: "Accra, Ghana",
    rating: 4.0,
    reviewCount: 8,
    priceRange: "150–350",
    minPrice: 150,
    maxPrice: 350,
    image: "/assets/images/vendorImg.png",
    description: "Handcrafted wooden furniture with traditional African designs and modern aesthetics",
    services: [
      {
        id: "custom-furniture",
        name: "Custom Furniture Design",
        price: 350,
        duration: "2-4 weeks",
        description: "Bespoke furniture pieces tailored to your space and style",
      },
      {
        id: "dining-set",
        name: "Dining Table Set",
        price: 280,
        duration: "3 weeks",
        description: "Handcrafted dining table with 4-6 chairs in African hardwood",
      },
      {
        id: "storage-unit",
        name: "Storage Cabinet",
        price: 200,
        duration: "2 weeks",
        description: "Custom storage solutions with carved African motifs",
      },
      {
        id: "repair-restore",
        name: "Furniture Restoration",
        price: 150,
        duration: "1-2 weeks",
        description: "Expert repair and refinishing of wooden furniture",
      },
    ],
    about:
      "Kofi Woodcraft creates timeless furniture pieces that blend traditional Ghanaian craftsmanship with contemporary design. Each piece tells a story of heritage and artistry.",
    openingHours: "Mon-Fri: 9:00 AM - 5:00 PM, Sat: 9:00 AM - 2:00 PM",
  },

  {
    id: "nia-decor-studio",
    name: "Nia Decor Studio",
    category: "Interior Decor",
    location: "Kigali, Rwanda",
    rating: 4.5,
    reviewCount: 33,
    priceRange: "100–200",
    minPrice: 100,
    maxPrice: 200,
    image: "/assets/images/homeHeroImg1.png",
    description: "Sustainable interior design with eco-friendly materials and African-inspired aesthetics",
    services: [
      {
        id: "room-styling",
        name: "Room Styling Package",
        price: 180,
        duration: "1 week",
        description: "Complete room makeover with eco-friendly decor and furniture arrangement",
      },
      {
        id: "consultation",
        name: "Design Consultation",
        price: 100,
        duration: "2 hours",
        description: "Professional interior design advice and mood board creation",
      },
      {
        id: "home-staging",
        name: "Home Staging",
        price: 200,
        duration: "2-3 days",
        description: "Property staging for rentals or sales with sustainable decor",
      },
      {
        id: "color-consultation",
        name: "Color & Material Selection",
        price: 120,
        duration: "1.5 hours",
        description: "Expert guidance on color schemes and eco-friendly materials",
      },
    ],
    about:
      "Nia Decor Studio champions sustainable luxury. We create beautiful, environmentally conscious spaces that honor African design traditions while embracing modern sensibilities.",
    openingHours: "Mon-Fri: 9:00 AM - 5:00 PM",
  },

  {
    id: "femi-digital-studios",
    name: "Femi Digital Studios",
    category: "Photography & Media",
    location: "Lagos, Nigeria",
    rating: 4.0,
    reviewCount: 5,
    priceRange: "80–120",
    minPrice: 80,
    maxPrice: 120,
    image: "/assets/images/homeHeroImg2.png",
    description: "Creative portrait and event photography capturing authentic African moments",
    services: [
      {
        id: "portrait-session",
        name: "Portrait Photography",
        price: 100,
        duration: "2 hours",
        description: "Professional portrait session with 20+ edited digital images",
      },
      {
        id: "event-coverage",
        name: "Event Photography",
        price: 120,
        duration: "4-6 hours",
        description: "Full event coverage with candid and posed shots (200+ photos)",
      },
      {
        id: "family-shoot",
        name: "Family Photoshoot",
        price: 90,
        duration: "1.5 hours",
        description: "Outdoor or studio family session with 15+ edited photos",
      },
      {
        id: "headshots",
        name: "Professional Headshots",
        price: 80,
        duration: "1 hour",
        description: "Corporate headshots with multiple outfit changes (10 edited images)",
      },
    ],
    about:
      "Femi Digital Studios specializes in capturing the beauty and vibrancy of African life. Our photography tells stories through authentic, emotionally rich imagery.",
    openingHours: "Tue-Sat: 10:00 AM - 6:00 PM",
  },

  {
    id: "dazzlelens-photography",
    name: "DazzleLens Photography",
    category: "Photography & Media",
    location: "Cape Town, South Africa",
    rating: 4.8,
    reviewCount: 54,
    priceRange: "100–200",
    minPrice: 100,
    maxPrice: 200,
    image: "/assets/images/homeHeroImg3.png",
    description: "Professional studio offering indoor/outdoor photography with quick retouching turnaround and cloud delivery",
    services: [
      {
        id: "portrait-session",
        name: "Portrait Photography Session",
        price: 150,
        duration: "2 hours",
        description: "Professional indoor/outdoor portrait session with 30+ edited images",
      },
      {
        id: "commercial-shoot",
        name: "Commercial Photography",
        price: 200,
        duration: "3-4 hours",
        description: "Product and brand photography for business use",
      },
      {
        id: "lifestyle-session",
        name: "Lifestyle Photography",
        price: 130,
        duration: "1.5 hours",
        description: "Natural, candid lifestyle photography with 20+ edited photos",
      },
      {
        id: "studio-headshots",
        name: "Studio Headshots",
        price: 100,
        duration: "1 hour",
        description: "Professional studio headshots with same-day digital delivery",
      },
    ],
    about:
      "DazzleLens Photography captures the magic of your special moments with artistic flair. Our team specializes in event photography, creating stunning visual stories that last a lifetime.",
    openingHours: "Mon-Sun: 8:00 AM - 10:00 PM (By appointment)",
  },

  {
    id: "urban-cuts-lounge",
    name: "Urban Cuts Lounge",
    category: "Barbershop",
    location: "Lagos, Nigeria",
    rating: 4.7,
    reviewCount: 118,
    priceRange: "20–45",
    minPrice: 20,
    maxPrice: 45,
    image: "/assets/images/journeyImg.png",
    description: "Trendy grooming lounge specializing in classic and modern cuts, fades, and beard care",
    services: [
      {
        id: "classic-haircut",
        name: "Classic Men's Haircut",
        price: 25,
        duration: "45 mins",
        description: "Timeless cuts with precision and attention to detail",
      },
      {
        id: "modern-fade",
        name: "Modern Fade",
        price: 35,
        duration: "1 hour",
        description: "Contemporary fade cuts with sharp lines and smooth blends",
      },
      {
        id: "beard-grooming",
        name: "Beard Grooming",
        price: 20,
        duration: "30 mins",
        description: "Professional beard trimming and shaping with hot towel treatment",
      },
      {
        id: "deluxe-package",
        name: "Deluxe Grooming Package",
        price: 45,
        duration: "1.5 hours",
        description: "Haircut, beard grooming, and premium facial treatment",
      },
    ],
    about:
      "Urban Cuts Lounge brings contemporary style to traditional barbering. Our skilled barbers create sharp, clean looks that keep you looking your best.",
    openingHours: "Mon-Sat: 9:00 AM - 8:00 PM, Sun: 10:00 AM - 5:00 PM",
  },

  {
    id: "sweetcrust-bakery",
    name: "SweetCrust Bakery",
    category: "Food & Catering",
    location: "Kigali, Rwanda",
    rating: 4.6,
    reviewCount: 39,
    priceRange: "40–120",
    minPrice: 40,
    maxPrice: 120,
    image: "/assets/images/homeHeroImg4.png",
    description: "Artisan bakery crafting custom cakes, pastries, and dessert platters with same-day delivery options",
    services: [
      {
        id: "custom-cake-2tier",
        name: "Custom Cake Order (2-tier)",
        price: 80,
        duration: "1 day pre-order",
        description: "Beautifully designed two-tier custom cake for special occasions",
      },
      {
        id: "celebration-cake",
        name: "Celebration Cake (Single-tier)",
        price: 50,
        duration: "Same-day available",
        description: "Single-tier custom cake with personalized message",
      },
      {
        id: "dessert-platter",
        name: "Dessert Platter",
        price: 60,
        duration: "Same-day available",
        description: "Assorted pastries, cookies, and mini desserts (serves 15-20)",
      },
      {
        id: "wedding-cake",
        name: "Wedding Cake (3+ tiers)",
        price: 120,
        duration: "1 week pre-order",
        description: "Elegant multi-tier wedding cake with custom design",
      },
    ],
    about:
      "SweetCrust Bakery creates memorable moments through delicious artisan cakes and pastries. We pride ourselves on using quality ingredients and delivering on time.",
    openingHours: "Tue-Sat: 8:00 AM - 7:00 PM, Sun: 9:00 AM - 5:00 PM",
  },

  {
    id: "purejoy-events",
    name: "PureJoy Events",
    category: "Event Planning & Decor",
    location: "Ibadan, Nigeria",
    rating: 4.8,
    reviewCount: 41,
    priceRange: "280–380",
    minPrice: 280,
    maxPrice: 380,
    image: "/assets/images/vendorImg.png",
    description:
      "Specialists in elegant and culturally inspired décor for baby naming ceremonies — combining floral elements, pastel tones, and family-centered setups",
    services: [
      {
        id: "baby-naming-decor",
        name: "Baby Naming Décor Package",
        price: 320,
        duration: "4 hours on-site",
        description:
          "Complete décor setup for baby naming ceremonies with floral arrangements, pastel color schemes, and family photo zones",
      },
      {
        id: "traditional-setup",
        name: "Traditional Ceremony Setup",
        price: 350,
        duration: "5 hours on-site",
        description: "Culturally-inspired décor blending traditional elements with modern aesthetics for naming ceremonies",
      },
      {
        id: "intimate-gathering",
        name: "Intimate Family Gathering Décor",
        price: 280,
        duration: "3 hours on-site",
        description: "Elegant setup for small family celebrations with personalized touches and floral centerpieces",
      },
      {
        id: "full-coordination",
        name: "Full Event Coordination & Décor",
        price: 380,
        duration: "6 hours on-site",
        description: "Complete event management and décor for baby naming ceremonies including vendor coordination",
      },
    ],
    about:
      "PureJoy Events specializes in creating memorable and culturally rich baby naming ceremonies. Our team brings together traditional values and modern design to celebrate new beginnings.",
    openingHours: "Mon-Sat: 9:00 AM - 6:00 PM",
  },

  {
    id: "little-blessings-catering",
    name: "Little Blessings Catering",
    category: "Food & Catering",
    location: "Lagos, Nigeria",
    rating: 4.9,
    reviewCount: 57,
    priceRange: "350–450",
    minPrice: 350,
    maxPrice: 450,
    image: "/assets/images/homeHeroImg1.png",
    description:
      "Premium catering brand offering freshly prepared African delicacies and light refreshments tailored for naming and family ceremonies",
    services: [
      {
        id: "traditional-buffet-naming",
        name: "Traditional Buffet Service (Naming Ceremony)",
        price: 400,
        duration: "5 hours catering window",
        description:
          "Full buffet service with authentic African dishes, light refreshments, and professional serving staff for naming ceremonies",
      },
      {
        id: "family-feast-package",
        name: "Family Feast Package",
        price: 450,
        duration: "6 hours service",
        description: "Comprehensive catering with appetizers, main courses, desserts, and beverages for large family gatherings",
      },
      {
        id: "light-refreshments",
        name: "Light Refreshments Service",
        price: 350,
        duration: "4 hours service",
        description: "Finger foods, pastries, fresh juices, and light snacks for intimate celebrations",
      },
      {
        id: "custom-menu",
        name: "Custom Menu Catering",
        price: 420,
        duration: "5 hours service",
        description: "Personalized menu designed to your preferences with traditional and contemporary options",
      },
    ],
    about:
      "Little Blessings Catering brings joy to family celebrations with authentic African cuisine and exceptional service. We specialize in creating delicious memories for life's special moments.",
    openingHours: "Mon-Sun: 7:00 AM - 8:00 PM",
  },

  {
    id: "sparkjoy-events",
    name: "SparkJoy Events Co.",
    category: "Event Planning & Decor",
    location: "Nairobi, Kenya",
    rating: 4.8,
    reviewCount: 64,
    priceRange: "320–420",
    minPrice: 320,
    maxPrice: 420,
    image: "/assets/images/homeHeroImg2.png",
    description:
      "Modern décor specialists transforming birthday venues into themed experiences, from kid parties to milestone celebrations, with photo zones and balloon artistry",
    services: [
      {
        id: "birthday-decor-coordination",
        name: "Birthday Décor & Coordination Package",
        price: 380,
        duration: "5 hours on-site",
        description: "Complete birthday setup with themed decorations, balloon installations, photo zones, and event coordination",
      },
      {
        id: "kids-party-package",
        name: "Kids Birthday Party Package",
        price: 320,
        duration: "4 hours on-site",
        description: "Fun and colorful setups for children's parties with character themes, games area, and activity stations",
      },
      {
        id: "milestone-celebration",
        name: "Milestone Birthday Celebration",
        price: 420,
        duration: "6 hours on-site",
        description: "Elegant décor for milestone birthdays (18th, 21st, 30th, etc.) with sophisticated styling and photo backdrops",
      },
      {
        id: "balloon-artistry",
        name: "Balloon Artistry & Installation",
        price: 350,
        duration: "3 hours setup",
        description: "Creative balloon arches, columns, and centerpieces to transform any venue into a festive space",
      },
    ],
    about:
      "SparkJoy Events Co. creates unforgettable birthday experiences through innovative décor and meticulous attention to detail. We turn celebration dreams into reality.",
    openingHours: "Tue-Sun: 9:00 AM - 7:00 PM",
  },

  {
    id: "happybakes-cakes",
    name: "HappyBakes Cakes",
    category: "Food & Catering",
    location: "Port Harcourt, Nigeria",
    rating: 4.9,
    reviewCount: 82,
    priceRange: "85–180",
    minPrice: 85,
    maxPrice: 180,
    image: "/assets/images/homeHeroImg3.png",
    description:
      "Expert bakers creating visually stunning and delicious birthday cakes, cupcakes, and dessert platters available for pickup or delivery",
    services: [
      {
        id: "custom-birthday-cake",
        name: "Custom Birthday Cake (2-tier)",
        price: 95,
        duration: "1 day pre-order",
        description: "Beautifully crafted 2-tier birthday cake with custom design, flavor, and personalized message",
      },
      {
        id: "premium-3tier-cake",
        name: "Premium 3-Tier Celebration Cake",
        price: 150,
        duration: "2 days pre-order",
        description: "Elaborate 3-tier cake with intricate decorations, fondant work, and multiple flavor options",
      },
      {
        id: "cupcake-platter",
        name: "Designer Cupcake Platter (24 pcs)",
        price: 85,
        duration: "1 day pre-order",
        description: "Assorted gourmet cupcakes with creative designs and premium toppings, perfect for parties",
      },
      {
        id: "dessert-table",
        name: "Complete Dessert Table Package",
        price: 180,
        duration: "3 days pre-order",
        description: "Full dessert spread including cake, cupcakes, cookies, cake pops, and sweet treats",
      },
    ],
    about:
      "HappyBakes Cakes is Port Harcourt's premier bakery for celebration cakes. Our talented bakers combine artistry with delicious flavors to create show-stopping desserts.",
    openingHours: "Mon-Sat: 8:00 AM - 6:00 PM",
  },

  {
    id: "frametime-studio",
    name: "FrameTime Studio",
    category: "Photography & Media",
    location: "Cape Town, South Africa",
    rating: 4.7,
    reviewCount: 36,
    priceRange: "240–320",
    minPrice: 240,
    maxPrice: 320,
    image: "/assets/images/homeHeroImg4.png",
    description:
      "Event photography brand offering creative birthday photo coverage, instant prints, and short highlight videos with professional editing",
    services: [
      {
        id: "birthday-event-photography",
        name: "Birthday Event Photography",
        price: 280,
        duration: "4 hours coverage",
        description: "Professional photo coverage of birthday celebrations with edited digital gallery and instant prints",
      },
      {
        id: "video-photo-package",
        name: "Photo + Video Highlight Package",
        price: 320,
        duration: "5 hours coverage",
        description: "Complete photo and video coverage with same-day highlight reel and edited photo gallery",
      },
      {
        id: "instant-prints-booth",
        name: "Instant Print Photo Booth",
        price: 240,
        duration: "3 hours service",
        description: "Interactive photo booth with instant prints, props, and digital copies for guests",
      },
      {
        id: "kids-party-photography",
        name: "Kids Party Photography",
        price: 260,
        duration: "3 hours coverage",
        description: "Fun and energetic photography capturing children's birthday moments with creative editing",
      },
    ],
    about:
      "FrameTime Studio specializes in capturing the joy and excitement of birthday celebrations. Our creative team delivers high-quality photography and videography with quick turnaround.",
    openingHours: "Mon-Sun: 8:00 AM - 9:00 PM (By appointment)",
  },

  {
    id: "elevate-corporate-events",
    name: "Elevate Corporate Events",
    category: "Corporate Services",
    location: "Abuja, Nigeria",
    rating: 4.9,
    reviewCount: 48,
    priceRange: "750–950",
    minPrice: 750,
    maxPrice: 950,
    image: "/assets/images/vendor.jpeg",
    description:
      "Full-service event management agency specializing in professional setups for conferences, workshops, and company milestone celebrations",
    services: [
      {
        id: "corporate-luncheon-conference",
        name: "Corporate Luncheon & Conference Setup",
        price: 850,
        duration: "8 hours event support",
        description: "Complete conference management including venue setup, AV equipment, registration desk, and professional coordination",
      },
      {
        id: "workshop-seminar",
        name: "Workshop & Seminar Management",
        price: 750,
        duration: "6 hours event support",
        description: "Full setup for corporate workshops with presentation equipment, materials coordination, and attendee management",
      },
      {
        id: "company-milestone",
        name: "Company Milestone Celebration",
        price: 900,
        duration: "10 hours event support",
        description: "Premium event planning for corporate anniversaries, award ceremonies, and milestone celebrations",
      },
      {
        id: "team-building",
        name: "Team Building Event Package",
        price: 950,
        duration: "12 hours event support",
        description: "Comprehensive planning and execution of team building activities, venue coordination, and catering logistics",
      },
    ],
    about:
      "Elevate Corporate Events delivers professional event management solutions for businesses across Nigeria. We create seamless corporate experiences that reflect your brand excellence.",
    openingHours: "Mon-Fri: 8:00 AM - 6:00 PM, Sat: By appointment",
  },

  {
    id: "bite-serve-catering",
    name: "Bite & Serve Catering",
    category: "Food & Catering",
    location: "Johannesburg, South Africa",
    rating: 4.8,
    reviewCount: 72,
    priceRange: "560–680",
    minPrice: 560,
    maxPrice: 680,
    image: "/assets/images/Frame.png",
    description:
      "Premium corporate catering brand serving international buffets, finger foods, and beverage services for company events and team gatherings",
    services: [
      {
        id: "corporate-buffet-drinks",
        name: "Corporate Buffet & Drinks Service",
        price: 620,
        duration: "6 hours service",
        description: "Professional buffet service with international menu, beverage station, and experienced serving staff",
      },
      {
        id: "executive-luncheon",
        name: "Executive Luncheon Package",
        price: 680,
        duration: "4 hours service",
        description: "Premium plated meals for executive meetings and corporate luncheons with fine dining presentation",
      },
      {
        id: "finger-foods-cocktail",
        name: "Finger Foods & Cocktail Service",
        price: 560,
        duration: "5 hours service",
        description: "Elegant cocktail catering with gourmet finger foods, canapes, and beverage service for networking events",
      },
      {
        id: "team-gathering",
        name: "Team Gathering Feast",
        price: 600,
        duration: "5 hours service",
        description: "Casual buffet-style catering perfect for team celebrations, workshops, and informal company gatherings",
      },
    ],
    about:
      "Bite & Serve Catering elevates corporate events with exceptional cuisine and professional service. We deliver international quality catering that impresses clients and energizes teams.",
    openingHours: "Mon-Sat: 7:00 AM - 7:00 PM",
  },
];

// Helper functions
export const getVendorById = (id: string): Vendor | undefined => {
  return vendors.find((v) => v.id === id);
};

export const getVendorsByCategory = (category: string): Vendor[] => {
  return vendors.filter((v) => v.category.toLowerCase() === category.toLowerCase());
};

export const getVendorsByLocation = (location: string): Vendor[] => {
  return vendors.filter((v) => v.location.includes(location));
};

export const getVendorsByPriceRange = (min: number, max: number): Vendor[] => {
  return vendors.filter((v) => v.minPrice >= min && v.maxPrice <= max);
};

export const getVendorsByRating = (minRating: number): Vendor[] => {
  return vendors.filter((v) => v.rating >= minRating);
};

export const categories = [
  "Wellness & Beauty",
  "Barbershop",
  "Food & Catering",
  "Event Planning & Decor",
  "Corporate Services",
  "Fitness & Wellness",
  "Photography & Media",
  "Furniture & Woodwork",
  "Interior Decor",
];

export const locations = [
  "Nairobi, Kenya",
  "Lagos, Nigeria",
  "Kano, Nigeria",
  "Accra, Ghana",
  "Abuja, Nigeria",
  "Kigali, Rwanda",
  "Cape Town, South Africa",
];
