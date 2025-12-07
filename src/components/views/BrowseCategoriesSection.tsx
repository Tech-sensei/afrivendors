"use client";
import { Sparkles, Scissors, UtensilsCrossed, PartyPopper, Briefcase, Dumbbell, Camera, Sofa, Palette } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent } from "../ui/card";
import { useRouter } from "next/navigation";

const categories = [
  { id: "wellness-beauty", name: "Wellness & Beauty", icon: Sparkles, count: 2 },
  { id: "event-planning", name: "Event Planning & Decor", icon: PartyPopper, count: 4 },
  { id: "food-catering", name: "Food & Catering", icon: UtensilsCrossed, count: 6 },
  { id: "barbershop", name: "Barbershop", icon: Scissors, count: 2 },
  { id: "corporate-services", name: "Corporate Services", icon: Briefcase, count: 2 },
  { id: "fitness-wellness", name: "Fitness & Wellness", icon: Dumbbell, count: 1 },
  { id: "photography-media", name: "Photography & Media", icon: Camera, count: 3 },
  { id: "furniture", name: "Furniture & Woodwork", icon: Sofa, count: 1 },
  { id: "interior-decor", name: "Interior Decor", icon: Palette, count: 1 },
];

const BrowseCategoriesSection = () => {
  const router = useRouter();
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-6 sm:px-8 lg:px-24 bg-white">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold font-unbounded text-secondary-000 leading-[125%] mb-2">
            Browse by Category
          </h2>
          <p className="text-accent-80 text-base tracking-[-0.16px]">Find vendors in your preferred service category</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
              >
                <Card
                  className=" py-0 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-3xl border-2 border-[#EFE6E1] shadow-[0_2px_8px_rgba(35,19,5,0.06)]"
                  onClick={() => router.push("/categories")}
                >
                  <CardContent className="flex flex-col items-center text-center gap-3 p-4">
                    <div className="h-16 w-16 rounded-full flex items-center justify-center bg-[rgba(188, 109, 57, 0.1)]">
                      <Icon className="h-8 w-8 text-primary-100" />
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold  text-secondary-000 text-base">{category.name}</h4>
                      <p className="text-secondary-100 text-xs tracking-[-0.16px]">
                        {category.count} vendor{category.count !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrowseCategoriesSection;
