"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Share2, Tag } from "lucide-react";
import { blogPosts, type BlogPost } from "@/data/blogData";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Extended blog post with full content
interface BlogPostWithContent extends BlogPost {
  content?: string;
}

// Generate full content from excerpt (in a real app, this would come from a CMS)
const generateContent = (post: BlogPost): string => {
  return `
    <p class="mb-6 text-lg leading-7 text-accent-80">
      ${post.excerpt}
    </p>
    
    <h2 class="mb-4 mt-8 font-unbounded text-2xl font-semibold text-secondary-000">
      Introduction
    </h2>
    
    <p class="mb-6 text-base leading-7 text-accent-80">
      In today's fast-paced world, finding the right vendor for your needs can be a challenging task. Whether you're planning a special event, need professional services, or looking for quality products, making the right choice is crucial. This comprehensive guide will walk you through everything you need to know to make an informed decision.
    </p>
    
    <h2 class="mb-4 mt-8 font-unbounded text-2xl font-semibold text-secondary-000">
      Key Considerations
    </h2>
    
    <p class="mb-6 text-base leading-7 text-accent-80">
      When selecting a vendor, there are several important factors to consider. First and foremost, you should evaluate their experience and track record. Look for vendors with positive reviews and a proven history of delivering quality work. Additionally, consider their pricing structure and whether it fits within your budget.
    </p>
    
    <p class="mb-6 text-base leading-7 text-accent-80">
      Communication is another critical aspect. A vendor who responds promptly and clearly communicates their process will make your experience much smoother. Don't hesitate to ask questions and ensure you understand exactly what services will be provided.
    </p>
    
    <h2 class="mb-4 mt-8 font-unbounded text-2xl font-semibold text-secondary-000">
      Making Your Decision
    </h2>
    
    <p class="mb-6 text-base leading-7 text-accent-80">
      After gathering all the necessary information, take time to compare your options. Consider creating a checklist of your priorities and see which vendor best aligns with your needs. Remember, the cheapest option isn't always the best choice—value and quality should be your primary considerations.
    </p>
    
    <p class="mb-6 text-base leading-7 text-accent-80">
      Once you've made your decision, be sure to get everything in writing. A clear contract or agreement protects both you and the vendor, ensuring everyone understands the terms and expectations.
    </p>
    
    <h2 class="mb-4 mt-8 font-unbounded text-2xl font-semibold text-secondary-000">
      Conclusion
    </h2>
    
    <p class="mb-6 text-base leading-7 text-accent-80">
      Choosing the right vendor requires careful consideration and research, but the effort is well worth it. By following these guidelines, you'll be better equipped to make decisions that lead to successful outcomes and positive experiences.
    </p>
  `;
};

export default function BlogDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params?.id as string;

  // Find the blog post by ID
  const post = blogPosts.find((p) => p.id === postId) as BlogPostWithContent | undefined;

  // Generate content if not available
  if (post && !post.content) {
    post.content = generateContent(post);
  }

  // Redirect if post not found
  useEffect(() => {
    if (!post && postId) {
      toast.error("Blog post not found");
      router.push("/blog");
    }
  }, [post, postId, router]);

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F5F2]">
        <div className="text-center">
          <h2 className="mb-4 font-unbounded text-2xl font-semibold text-secondary-000">
            Post not found
          </h2>
          <Button onClick={() => router.push("/blog")} variant="outline">
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  const imageSrc = post.image ?? "/assets/images/homeHeroImg1.png";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  // Find related posts (same category, excluding current)
  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8F5F2]">
      {/* Header with Back Button */}
      <div className="border-b border-accent-20 bg-white">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/blog")}
            className="gap-2 text-accent-80 hover:text-secondary-000"
          >
            <ArrowLeft className="size-4" />
            Back to Blog
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-[400px] w-full overflow-hidden bg-[#F8F5F2] md:h-[500px]">
        <Image
          src={imageSrc}
          alt={post.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Main Content */}
      <article className="mx-auto w-full max-w-[800px] px-6 py-12 md:py-16">
        {/* Category Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <span className="rounded-md bg-[#F8F5F2] px-4 py-2 text-sm font-semibold text-primary-100">
              {post.category}
            </span>
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-accent-80" />
              <span className="text-sm text-accent-80">{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-accent-80" />
              <span className="text-sm text-accent-80">{post.readTime}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-6 font-unbounded text-[clamp(32px,5vw,48px)] font-semibold leading-[1.2] text-secondary-000">
            {post.title}
          </h1>

          {/* Author Info */}
          <div className="mb-8 flex items-center gap-4 border-b border-accent-20 pb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
              <span className="text-base font-semibold text-white">{post.author.avatar}</span>
            </div>
            <div>
              <p className="text-base font-semibold text-secondary-000">{post.author.name}</p>
              <p className="text-sm text-accent-80">Author</p>
            </div>
            <div className="ml-auto">
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="rounded-full border-accent-20 hover:bg-accent-10"
              >
                <Share2 className="size-4 text-accent-80" />
              </Button>
            </div>
          </div>

          {/* Article Content */}
          <div
            className={cn(
              "blog-content [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:font-unbounded [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-secondary-000",
              "[&_p]:mb-6 [&_p]:text-base [&_p]:leading-7 [&_p]:text-accent-80",
              "[&_p.text-lg]:text-lg"
            )}
            dangerouslySetInnerHTML={{ __html: post.content || generateContent(post) }}
          />

          {/* Share Section */}
          <div className="mt-12 rounded-2xl border border-accent-20 bg-white p-6">
            <h3 className="mb-4 font-unbounded text-xl font-semibold text-secondary-000">
              Enjoyed this article?
            </h3>
            <p className="mb-4 text-base text-accent-80">
              Share it with others who might find it helpful!
            </p>
            <Button
              onClick={handleShare}
              className="rounded-full bg-primary-100 text-white hover:bg-primary-100/90"
            >
              <Share2 className="mr-2 size-4" />
              Share Article
            </Button>
          </div>
        </motion.div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-accent-20 bg-white px-6 py-16">
          <div className="mx-auto w-full max-w-[1200px]">
            <h2 className="mb-8 font-unbounded text-[clamp(28px,3vw,36px)] font-semibold leading-[110%] text-secondary-000">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.id}`}
                  className="group block overflow-hidden rounded-2xl border border-accent-20 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-48 overflow-hidden bg-[#F8F5F2]">
                    <Image
                      src={relatedPost.image ?? "/assets/images/homeHeroImg1.png"}
                      alt={relatedPost.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <Tag className="size-3.5 text-accent-80" />
                      <span className="text-xs font-semibold text-primary-100">
                        {relatedPost.category}
                      </span>
                    </div>
                    <h3 className="mb-2 line-clamp-2 font-unbounded text-xl font-semibold leading-7 text-secondary-000">
                      {relatedPost.title}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-5 text-accent-80">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="border-t border-accent-20 bg-white px-6 py-16 text-center">
        <div className="mx-auto w-full max-w-[700px]">
          <h2 className="mb-4 font-unbounded text-[clamp(28px,3vw,36px)] font-semibold leading-[110%] text-secondary-000">
            Stay updated with our latest articles
          </h2>
          <p className="mb-8 text-lg leading-7 text-accent-80">
            Subscribe to our newsletter and never miss important updates, tips, and stories from
            the Afrivendor community.
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
