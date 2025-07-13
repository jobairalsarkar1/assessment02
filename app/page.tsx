import UserFeed from "@/components/UserFeed";

export default function Home() {
  return (
    <main className="w-full px-4 py-12 bg-slate-200">
      <div className="container mx-auto max-w-3xl">
        <div className="flex justify-between items-center">
          <h1 className="mb-6 text-4xl font-extrabold text-black tracking-tight">
            Task 03: User Feed
          </h1>
          <a href="/task2" className="px-0 text-blue-600 text-base underline">
            View Task 02
          </a>
        </div>
        <UserFeed />
      </div>
    </main>
  );
}
