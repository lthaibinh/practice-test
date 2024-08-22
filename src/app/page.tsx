"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  let router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div>Practice Test</div>
      <div className="pt-10 flex gap-10">
        <button
          className="bg-red-500 text-white px-4 py-2"
          onClick={() => {
            router.push("/admin");
          }}
        >
          Admin site
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2"
          onClick={() => {
            router.push("/consumer");
          }}
        >
          Consumer site
        </button>
      </div>
    </main>
  );
}
