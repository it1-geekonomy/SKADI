'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Typography from '@/lib/Typography';

interface Blog {
  id: string | number;
  slug: string;
  title: string;
  image: string;
}

interface BlogsProps {
  blogs?: Blog[];
}

export default function Blogs({ blogs: initialBlogs }: BlogsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs || []);
  const [loading, setLoading] = useState(!initialBlogs);
  const blogsPerPage = 6;

  useEffect(() => {
    if (!initialBlogs) {
      fetchBlogs();
    }
  }, [initialBlogs]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blogs");
      const contentType = response.headers.get("content-type") ?? "";
      if (!response.ok || !contentType.includes("application/json")) {
        console.error("Error fetching blogs:", response.status, "not JSON");
        setBlogs([]);
        return;
      }
      const data = (await response.json()) as { blogs?: Blog[] };
      setBlogs(Array.isArray(data.blogs) ? data.blogs : []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[rgba(245,240,232,0.96)] py-18 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <Typography variant="display-3xl" className="text-center text-forest mb-4 sm:mb-8 tracking-tight">
          Blogs
        </Typography>

        {loading ? (
          <div className="text-center py-20">
            <Typography variant="body-xl" className="text-neutral-400">Loading blogs...</Typography>
          </div>
        ) : blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-14">
              {currentBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.slug}`}
                  className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-canopy focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <article className="bg-neutral-950 overflow-hidden flex flex-col h-full transition-colors duration-300 hover:border-neutral-700">
                    <div className="relative w-full aspect-[16/10] bg-neutral-900 overflow-hidden shrink-0">
                      {blog.image ? (
                        <img
                          src={blog.image}
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                          <Typography variant="display-xl" className="text-white">
                            {blog.title.charAt(0)}
                          </Typography>
                        </div>
                      )}
                    </div>

                    <div className="p-5 sm:p-6 flex flex-col flex-1 gap-5 bg-[rgba(245,240,232,0.96)]">
                      <Typography variant="h2" className="text-obsidian leading-snug text-left line-clamp-3">
                        {blog.title}
                      </Typography>
                      <Typography variant="body-lg" className="mt-auto text-left font-bold text-forest group-hover:text-canopy transition-colors">
                        Read More&nbsp;→
                      </Typography>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-md bg-neutral-900 text-neutral-200 border border-neutral-700 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  <Typography variant="body-sm">Previous</Typography>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    type="button"
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                      currentPage === page
                        ? "bg-canopy text-white border-canopy"
                        : "bg-neutral-900 text-neutral-200 border-neutral-700 hover:bg-neutral-800"
                    }`}
                  >
                    <Typography variant="body-sm">{page}</Typography>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-md bg-neutral-900 text-neutral-200 border border-neutral-700 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  <Typography variant="body-sm">Next</Typography>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <Typography variant="body-xl" className="text-neutral-400">No blogs available yet.</Typography>
          </div>
        )}
      </div>
    </div>
  );
}