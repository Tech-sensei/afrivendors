"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Star, MapPin } from "lucide-react";
import { Button } from "../ui/button";

const VendorCard = ({ vendor, index, onClick }: { vendor: any; index: number; onClick?: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1, ease: "easeOut" }}
    >
      <Card
        className="cursor-pointer transition-all duration-300 hover:scale-[1.02] overflow-hidden group py-0 rounded-2xl border border-[#EFE6E1] shadow-[0_4px_12px_rgba(35,19,5,0.08)]"
        onClick={onClick || (() => console.log(vendor))}
      >
        {/* Image Section */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={vendor.image}
            alt={vendor.name}
            width={500}
            height={500}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {/* Category Badge */}
          <Badge className="absolute top-4 right-4 bg-secondary-000 text-white rounded-full px-4 py-1.5 font-semibold text-xs">
            {vendor.category}
          </Badge>
        </div>

        {/* Content Section */}
        <CardContent className="p-5">
          <div className="mb-3">
            <h4 className="mb-2 font-unbounded text-base font-semibold text-secondary-000 leading-[1.3]">{vendor.name}</h4>
            <p className="line-clamp-2 text-sm font-normal text-accent-80 leading-[150%]">{vendor.description}</p>
          </div>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" style={{ color: "#BC6D39", fill: "#BC6D39" }} />
              <span className="text-sm font-semibold text-secondary-000">{vendor.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-secondary-100">({vendor.reviewCount} reviews)</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-4 w-4 text-secondary-100 opacity-70" />
            <span className="text-sm text-secondary-100 opacity-70">{vendor.location}</span>
          </div>

          {/* Price & Button */}
          <div className="flex items-center justify-between pt-3 border-t border-[#EFE6E1]">
            <span className="text-base text-primary-100 font-semibold font-unbounded">{vendor.priceRange}</span>
            <Button
              size="sm"
              className="transition-all duration-300"
              style={{
                backgroundColor: "#231305",
                color: "#FFFCFB",
                borderRadius: "18px",
                height: "36px",
                paddingLeft: "20px",
                paddingRight: "20px",
                fontFamily: "var(--font-family-secondary)",
                fontSize: "14px",
                fontWeight: "var(--font-weight-semibold)",
              }}
            >
              Book Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VendorCard;
