import type { AppReviewCarouselItem } from "@/types/app-review";

/** Fallback marketing quotes when GET /app-review returns no items. */
export const STATIC_APP_REVIEWS: AppReviewCarouselItem[] = [
  {
    id: "static-1",
    title: "A Stress-Free Experience!",
    text: "Afrivendor made it so easy to find reliable vendors for my online business. I didn't have to worry about stress communication and payment were seamless. I felt good supporting local African talent in such a professional space",
    author: "Amara Eze",
    location: "Lagos, Nigeria",
    avatar: "/assets/images/female04.png",
    rating: 5,
  },
  {
    id: "static-2",
    title: "Trust and Convenience in One App",
    text: "I love how the app connects me with trusted vendors without the fear of being scammed. The secure payment and review system make the whole experience smooth and reliable",
    author: "Zainele Dlamini",
    location: "Johannesburg, South Africa",
    avatar: "/assets/images/male04.png",
    rating: 5,
  },
  {
    id: "static-3",
    title: "Bridging the Gap for the Diaspora",
    text: "Finally, a platform that connects Africans in the diaspora back home. I ordered custom fashion pieces from Nigeria through Afrivendor and got exactly what I envisioned",
    author: "Chinedu Okoro",
    location: "London, UK",
    avatar: "/assets/images/male05.png",
    rating: 5,
  },
  {
    id: "static-4",
    title: "Reliable Vendor Network",
    text: "The verification process gives me confidence in the vendors. Every transaction has been smooth and professional. Highly recommend for anyone looking for quality African products",
    author: "Nia Johnson",
    location: "Atlanta, USA",
    avatar: "/assets/images/female04.png",
    rating: 5,
  },
];
