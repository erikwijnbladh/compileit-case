import { ButtonLink } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-dvh bg-background text-foreground sm:app-gradient">
      <section className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-between px-6 pb-safe pt-21 sm:max-w-lg sm:px-8 sm:pb-8 sm:pt-24">
        <h1
          aria-label="Boka ett rum"
          className="text-6xl font-bold leading-none tracking-normal sm:text-7xl"
        >
          Boka
          <br />
          ett rum
        </h1>

        <ButtonLink href="/rooms" className="mb-2">
          Boka
        </ButtonLink>
      </section>
    </main>
  );
}
