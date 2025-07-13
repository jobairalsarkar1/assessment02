"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import UserCard from "./UserCard";
import SkeletonLoader from "./SkeletonLoader";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string;
  university: string;
  company: {
    title: string;
  };
};

type ApiResponse = {
  users: User[];
  total: number;
  skip: number;
  limit: number;
};

const fetchUsers = async (skip: number): Promise<ApiResponse> => {
  if (process.env.NODE_ENV === "development") {
    try {
      const proxyUrl = "https://cors-anywhere.herokuapp.com/";
      const targetUrl = `https://tech-test.raintor.com/api/users/GetUsersList?take=10&skip=${skip}`;
      const res = await fetch(proxyUrl + targetUrl, {
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (res.ok) return await res.json();
    } catch {
      console.warn("CORS proxy failed, using mock data");
    }

    return {
      users: Array(10)
        .fill(0)
        .map((_, i) => ({
          id: skip + i,
          firstName: `User ${skip + i}`,
          lastName: `Lastname ${skip + i}`,
          email: `user${skip + i}@example.com`,
          phone: `+1 ${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          image: `https://i.pravatar.cc/150?img=${skip + i}`,
          university: `University ${skip + i}`,
          company: { title: `Position ${skip + i}` },
        })),
      total: 208,
      skip,
      limit: 10,
    };
  }

  const res = await fetch(`/api/users?skip=${skip}`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export default function UserFeed() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<ApiResponse>({
    queryKey: ["users"],
    queryFn: ({ pageParam = 0 }) => fetchUsers(pageParam),
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.users.length;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    initialPageParam: 0,
  });

  const allUsers = data?.pages.flatMap((page) => page.users) || [];
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allUsers.length + 1 : allUsers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 130,
    overscan: 5,
  });

  const items = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const [lastItem] = [...items].reverse();
    if (!lastItem) return;

    if (
      lastItem.index >= allUsers.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [items, hasNextPage, fetchNextPage, isFetchingNextPage, allUsers.length]);

  if (status === "pending") {
    return <SkeletonLoader count={10} />;
  }

  if (status === "error") {
    return (
      <div className="p-6 text-center">
        <div className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 p-6 shadow-md text-red-700">
          <h3 className="font-semibold text-lg">Error Loading Users</h3>
          <p className="mt-1 text-sm">{(error as Error).message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-block rounded bg-red-100 px-4 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="h-[80vh] w-full overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-lg ring-1 ring-gray-100"
      tabIndex={0}
      aria-label="User feed"
    >
      <div
        className="relative w-full space-y-4"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {items.map((virtualRow) => {
          const isLoaderRow = virtualRow.index > allUsers.length - 1;
          const user = allUsers[virtualRow.index];

          return (
            <div
              key={virtualRow.key}
              className="absolute left-0 top-0 w-full"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {isLoaderRow ? (
                hasNextPage ? (
                  <div className="flex justify-center py-6">
                    <div
                      className="h-8 w-8 animate-spin rounded-full border-4 border-blue-400 border-t-transparent"
                      aria-label="Loading more users"
                    />
                  </div>
                ) : (
                  <div className="p-4 text-center text-lg italic text-gray-800">
                    All users loaded.
                  </div>
                )
              ) : (
                <UserCard user={user} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
