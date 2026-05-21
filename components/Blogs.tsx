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

function getPaginationPages(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: number[] = [];
  for (let page = 1; page <= total; page++) {
    if (
      page === 1 ||
      page === total ||
      (page >= current - 1 && page <= current + 1)
    ) {
      pages.push(page);
    }
  }

  const result: (number | "ellipsis")[] = [];
  let prev = 0;
  for (const page of pages) {
    if (prev && page - prev > 1) {
      result.push("ellipsis");
    }
    result.push(page);
    prev = page;
  }
  return result;
}

const pageBtnBase =
  "min-w-[2.75rem] px-3 py-2 text-sm font-medium border border-black transition-colors";
const pageBtnDefault =
  "bg-transparent text-black hover:bg-black/5";
const pageBtnActive = "bg-forest text-white border-forest";
const pageBtnDisabled =
  "bg-transparent text-black/40 border-black cursor-not-allowed";

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
  const showingFrom = blogs.length === 0 ? 0 : indexOfFirstBlog + 1;
  const showingTo = Math.min(indexOfLastBlog, blogs.length);
  const paginationPages = getPaginationPages(currentPage, totalPages);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[rgba(245,240,232,0.96)] pt-32 pb-18 sm:pb-20 lg:pt-24 lg:pb-20 px-3 sm:px-4 md:px-5 lg:px-5 xl:px-6">
      <div className="w-full max-w-[1500px] mx-auto">
        <Typography variant="display-3xl" className="relative z-10 text-center text-forest mb-4 sm:mb-8 tracking-tight">
          Blogs
        </Typography>

        {loading ? (
          <div className="text-center py-20">
            <Typography variant="body-xl" className="text-neutral-400">Loading blogs...</Typography>
          </div>
        ) : blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 mb-14">
              {currentBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.slug}`}
                  className="group block h-full w-full max-w-[26rem] mx-auto sm:max-w-none sm:mx-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-canopy focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <article className="bg-neutral-950 overflow-hidden flex flex-col h-full transition-colors duration-300 hover:border-neutral-700">
                    <div className="relative w-full aspect-[16/10] bg-neutral-900 overflow-hidden shrink-0">
                      {blog.image ? (
                        <img
                          src={blog.image}
                          alt=""
                          className="w-full h-full object-contain object-fill transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                          <Typography variant="display-xl" className="text-white">
                            {blog.title.charAt(0)}
                          </Typography>
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex flex-col flex-1 gap-2 bg-[rgba(245,240,232,0.96)]">
                      <Typography variant="h2" className="text-obsidian leading-snug text-left line-clamp-3">
                        {blog.title}
                      </Typography>
                      <Typography variant="body-xl" className="mt-auto text-left font-bold text-forest group-hover:text-canyon transition-colors">
                        Read More&nbsp;→
                      </Typography>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-4 mt-2">
                <p className="text-sm font-medium text-forest text-center">
                  Showing {showingFrom} – {showingTo} of {blogs.length} blogs
                </p>
                <nav
                  className="flex flex-wrap justify-center items-center gap-2"
                  aria-label="Blog pagination"
                >
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`${pageBtnBase} ${
                      currentPage === 1 ? pageBtnDisabled : pageBtnDefault
                    }`}
                  >
                    Previous
                  </button>

                  {paginationPages.map((page, i) =>
                    page === "ellipsis" ? (
                      <span
                        key={`ellipsis-${i}`}
                        className="px-2 text-obsidian text-sm select-none"
                        aria-hidden
                      >
                        …
                      </span>
                    ) : (
                      <button
                        type="button"
                        key={page}
                        onClick={() => handlePageChange(page)}
                        aria-current={currentPage === page ? "page" : undefined}
                        className={`${pageBtnBase} ${
                          currentPage === page ? pageBtnActive : pageBtnDefault
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`${pageBtnBase} ${
                      currentPage === totalPages ? pageBtnDisabled : pageBtnDefault
                    }`}
                  >
                    Next
                  </button>
                </nav>
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