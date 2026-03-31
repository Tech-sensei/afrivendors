"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Star, MapPin, Heart } from "lucide-react";
import { Button } from "../ui/button";
import { formatVendorPriceRange } from "@/services/vendor";
import type { VendorCardProps } from "@/types/vendor";

const VendorCard = ({ vendor, index, onClick, isFavourite = false, onFavouriteToggle }: VendorCardProps) => {
  const vendorName = vendor.businessName || vendor.name;
  const vendorDescription = vendor.description || "Trusted vendor ready to take your booking.";
  const rating = Number(vendor.rating) || 0;

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
            alt={vendorName}
            width={500}
            height={500}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {/* Category Badge */}
          <Badge className="absolute top-4 left-4 bg-secondary-000 text-white rounded-full px-4 py-1.5 font-semibold text-xs">
            {vendor.category}
          </Badge>
          {/* Heart Icon - Favourite Toggle */}
          {onFavouriteToggle && (
            <button
              className="absolute top-4 right-4 h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 bg-white/90 hover:bg-white border-none cursor-pointer z-10"
              onClick={(e) => {
                e.stopPropagation();
                onFavouriteToggle(vendor.id, !isFavourite);
              }}
              aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isFavourite ? "text-primary-100 fill-primary-100" : "text-primary-100"
                }`}
              />
            </button>
          )}
        </div>

        {/* Content Section */}
        <CardContent className="p-5">
          <div className="mb-3">
            <h4 className="mb-2 font-unbounded text-base font-semibold text-secondary-000 leading-[1.3]">{vendorName}</h4>
            <p className="line-clamp-2 text-sm font-normal text-accent-80 leading-[150%]">{vendorDescription}</p>
          </div>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-primary-100 fill-primary-100" />
              <span className="text-sm font-semibold text-secondary-000">{rating.toFixed(1)}</span>
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
            <span className="text-base text-primary-100 font-semibold font-unbounded">
              {formatVendorPriceRange(Number(vendor.minPrice) || 0, Number(vendor.maxPrice) || 0)}
            </span>
            <Button
              size="sm"
              className="bg-secondary-000 text-white hover:bg-secondary-000/90 rounded-[18px] h-9 px-5 text-sm font-semibold transition-all duration-300"
            >
              View Services
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VendorCard;
