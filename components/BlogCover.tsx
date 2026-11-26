import Image from "next/image";
import { Snowflake, CalendarCheck, Bug, PawPrint, Home, Search } from "lucide-react";
import type { Post } from "@/lib/blog";

const icons = { snowflake: Snowflake, calendar: CalendarCheck, bug: Bug, paw: PawPrint, home: Home, search: Search };

/** Photo when the post has one, otherwise a branded graphic cover. */
export default function BlogCover({ post, sizes, priority }: { post: Post; sizes: string; priority?: boolean }) {
  if (post.image) {
    return <Image src={post.image} alt={post.title} fill priority={priority} className="object-cover" style={post.imagePosition ? { objectPosition: post.imagePosition } : undefined} sizes={sizes} />;
  }
  const Icon = icons[post.icon ?? "bug"];
  return (
    <div role="img" aria-label={post.title} className="absolute inset-0 bg-navy-800 flex items-center justify-center overflow-hidden">
      <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-violet-400 opacity-20" />
      <div className="absolute -bottom-12 -right-8 w-52 h-52 rounded-full bg-accent-500 opacity-20" />
      <div className="relative w-24 h-24 rounded-full bg-violet-400 border-4 border-white flex items-center justify-center shadow-[5px_5px_0_0_rgba(0,0,0,0.35)]">
        <Icon className="w-11 h-11 text-navy-900" strokeWidth={1.75} />
      </div>
    </div>
  );
}
