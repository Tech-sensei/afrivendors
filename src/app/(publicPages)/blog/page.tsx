"use client";

import { useMemo, useState } from "react";
import { Tag, Search } from "lucide-react";
import { blogCategories, blogPosts } from "@/data/blogData";
import { BlogCard } from "@/components/blog/BlogCard";
import svgPaths from "@/lib/svgPath5";
import { motion } from "motion/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<(typeof blogCategories)[number]>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return blogPosts.filter((post) => {
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch = q.length === 0 || post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8F5F2]">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center py-16 md:py-20 px-6 sm:px-8 lg:px-24 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
          className="flex flex-col items-center w-full"
        >
          {/* Hero Header Image */}
          <div className="mb-8 w-full max-w-4xl px-4 sm:px-6 md:px-8 lg:px-0">
            <div className="w-full max-w-full overflow-hidden">
              <div className="content-stretch flex flex-col gap-2 items-center relative w-full" data-name="Home-Hero-Header">
                <p className="font-unbounded font-medium leading-[normal] w-full relative shrink-0 text-center text-[#562A03] text-[clamp(28px,8vw,80px)] tracking-[-0.06em]">
                  {` Blog `}
                </p>
                <div className="relative shrink-0 w-full h-auto max-w-[clamp(320px, 90vw, 734px)] aspect-[734 / 118]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 734 118">
                    <g id="Afrivendor-blog">
                      <path d={svgPaths.p2574bdc0} fill="var(--fill-0, #C56C31)" />
                      <path d={svgPaths.pb747c80} fill="var(--fill-0, #C56C31)" />
                      <path d={svgPaths.pc5f1000} fill="var(--fill-0, #C56C31)" />
                      <path d={svgPaths.p2b61f700} fill="var(--fill-0, #C56C31)" />
                      <path d={svgPaths.p643c500} fill="var(--fill-0, #C56C31)" />
                      <path d={svgPaths.p101f28f0} fill="var(--fill-0, #C56C31)" />
                      <path d={svgPaths.pcd49ac0} fill="var(--fill-0, #C56C31)" />
                      <path d={svgPaths.p2a40f600} fill="var(--fill-0, #C56C31)" />
                      <path clipRule="evenodd" d={svgPaths.p12626280} fill="var(--fill-0, #C56C31)" fillRule="evenodd" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-heading */}
          <p className="max-w-4xl sm:px-0 text-secondary-100 text-[clamp(16px,2vw,20px)] leading-[1.6]">
            Insights, tips, and stories from the Afrivendor community.
          </p>
        </motion.div>
      </div>
      {/* Filters & Search */}
      <section className="border-b border-accent-20 bg-white px-6 py-8">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative w-full sm:flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-accent-80" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 w-full rounded-xl border border-accent-20 bg-[#F8F5F2] pl-12 pr-4 text-base text-secondary-000 outline-none transition-colors focus:border-primary-100 focus:ring-2 focus:ring-primary-100/20"
              />
            </div>

            {/* Category Dropdown */}
            <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as (typeof blogCategories)[number])}>
              <SelectTrigger className="h-14 w-full rounded-xl border-accent-20 bg-[#F8F5F2] px-4 py-6.5 text-base text-secondary-000 sm:w-60">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent align="end">
                {blogCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1200px]">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="mx-auto mb-6 flex h-[120px] w-[120px] items-center justify-center rounded-full border border-accent-20 bg-white">
                <Tag className="size-12 text-accent-80" />
              </div>
              <h3 className="mb-2 font-unbounded text-2xl font-semibold leading-8 text-secondary-000">No articles found</h3>
              <p className="text-base text-accent-80">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="border-t border-accent-20 bg-white px-6 py-16 text-center">
        <div className="mx-auto w-full max-w-[700px]">
          <h2 className="mb-4 font-unbounded text-[clamp(28px,3vw,36px)] font-semibold leading-[110%] text-secondary-000">
            Stay updated with our latest articles
          </h2>
          <p className="mb-8 text-lg leading-7 text-accent-80">
            Subscribe to our newsletter and never miss important updates, tips, and stories from the Afrivendor community.
          </p>

          <div className="mx-auto flex max-w-[500px] flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="h-14 flex-1 rounded-xl border border-accent-20 bg-[#F8F5F2] px-4 text-base text-secondary-000 outline-none focus:border-primary-100 focus:ring-2 focus:ring-primary-100/20"
            />
            <button
              type="button"
              className="h-14 whitespace-nowrap rounded-xl bg-primary-100 px-8 text-base font-semibold text-white transition-opacity hover:opacity-90"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
