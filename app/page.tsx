import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="pt-24 pb-10 px-10 lg:px-12 max-w-2xl mx-auto">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl pb-6">
        birthdaiii 🎂
      </h1>
      <p className="pb-3">
        This is an over engineered party management tool, initially built for my
        24th birthday party (which is where the name comes from). However, it is
        quite private in it&apos;s nature, so if you haven&apos;t gotten a link
        to an invite you won&apos;t be able to do a lot here.
      </p>
      <p className="pb-3">You can still check it out on GitHub.</p>
      <Button asChild className="ml-auto">
        <a href="https://github.com/flofriday/birthdaiii">GitHub</a>
      </Button>
    </main>
  );
}
