import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import type { BlogPost } from "@/data/blogData";

export function BlogCard({ post }: { post: BlogPost }) {
    const imageSrc = post.image ?? "/assets/images/homeHeroImg1.png";

    return (
        <Link href={`/blog/${post.id}`} className="block h-full">
            <article className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-accent-20 bg-white transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg">
                {/* Image */}
                <div className="relative h-60 overflow-hidden bg-[#F8F5F2]">
                    <Image
                        src={imageSrc}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                        priority={post.id === "1"}
                    />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                    {/* Category & Meta */}
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                        <span className="rounded-md bg-[#F8F5F2] px-3 py-1 text-sm font-semibold text-primary-100">
                            {post.category}
                        </span>

                        <div className="flex items-center gap-2">
                            <Calendar className="size-3.5 text-accent-80" />
                            <span className="text-sm text-accent-80">{post.date}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Clock className="size-3.5 text-accent-80" />
                            <span className="text-sm text-accent-80">{post.readTime}</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="mb-3 line-clamp-2 font-unbounded text-2xl font-semibold leading-8 text-secondary-000">
                        {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="mb-4 line-clamp-3 text-base leading-6 text-accent-80">{post.excerpt}</p>

                    {/* Author & Read More */}
                    <div className="mt-auto flex items-center justify-between border-t border-accent-20 pt-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100">
                                <span className="text-sm font-semibold text-white">{post.author.avatar}</span>
                            </div>
                            <span className="text-sm font-semibold text-secondary-000">{post.author.name}</span>
                        </div>

                        <ArrowRight className="size-5 text-primary-100 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                    </div>
                </div>
            </article>
        </Link>
    );
}


