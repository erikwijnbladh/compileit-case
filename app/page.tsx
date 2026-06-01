import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-dvh bg-[#ececec] text-black">
      <section className="relative mx-auto min-h-dvh w-full max-w-[393px] overflow-clip px-6 pt-[124px]">
        <h1 className="w-full text-[80px] font-normal leading-none tracking-[-0.03em]">
          Boka ett rum
        </h1>

        <Link
          href="/book"
          className="absolute bottom-[calc(53px+env(safe-area-inset-bottom))] left-6 right-6 flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-[#1d1d1d] text-base font-normal leading-[1.4] text-white transition hover:bg-[#292929] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
        >
          Boka
        </Link>
      </section>
    </main>
  );
}
