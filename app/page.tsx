import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen py-24 px-12 max-w-2xl mx-auto">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl pb-6">birthdaiii 🎂</h1>
      <p className="pb-3">
        This is an over engineered birthday party management tool for my
        upcomming birthday. However,
        it is quite private in it's nature, so if you haven't gotten a link to
        an invite you won't be able to do a lot here.
      </p>
      <p className="pb-3">
        You can still check it out on GitHub.
      </p>
      <Button asChild className="ml-auto">
        <a href="https://github.com/flofriday/birthdaiii">GitHub</a>
      </Button>
    </main>
  );
}
