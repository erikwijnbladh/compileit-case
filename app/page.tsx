import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-dvh bg-[#ECEBE8] text-[#1C1B1F] sm:bg-[radial-gradient(120%_120%_at_50%_0%,#f4f3f1_0%,#e3e2df_100%)]">
      <section className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col justify-between px-6 pb-[calc(24px+env(safe-area-inset-bottom))] pt-[84px] sm:max-w-[520px] sm:px-8 sm:pb-8 sm:pt-24">
        <h1
          aria-label="Boka ett rum"
          className="text-[58px] font-bold leading-[0.96] tracking-normal sm:text-[72px]"
        >
          Boka
          <br />
          ett rum
        </h1>

        <Button href="/book" className="mb-2">
          Boka
        </Button>
      </section>
    </main>
  );
}
