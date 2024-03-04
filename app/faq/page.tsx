export default function FAQ() {
  return (
    <main className="min-h-screen py-24 px-10 lg:px-12 max-w-2xl mx-auto">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl pb-6">birthdaiii🎂 FAQ</h1>

      <div className="pb-6">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">What is this thing?</h2>
        <p>It&apos;s a simple website I wrote to manage the invites for my birthday party.</p>
      </div>


      <div className="pb-6">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Did you really build this just for a birthday?</h2>
        <p>Sure.</p>
      </div>

      <div className="pb-6">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Couldn&apos;t you just have used a normal spreadsheet or not written it down at all, like the cool kids?</h2>
        <p>Yes.</p>
      </div>

      <div className="pb-6">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">So why did you built it?</h2>
        <p>
          Partly, because I can and partly because for my last party I wrote
          a scientific paper as an invitation. So this time I needed to
          up my game, cause the competition is fierce!
        </p>
      </div>

      <div className="pb-6">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Oh damn, who else does stuff like that?</h2>
        <p>
          No, it&apos;s just me for now. 😜
        </p>
      </div>

      <div className="pb-6">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Can I share my invite link?</h2>
        <p>
          Please don&apos;t, each invitee got their own custom invite link. If your friends didn&apos;t get one and you want to bring them you can just add them as plus one.
          <br />
          Of course you can share the location, date etc with the people you bring.
        </p>
      </div>

      <div className="pb-6">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Is it Open Source?</h2>
        <p>
          I mean, you do know me right? 🦉 <br />
          <a className="text-blue-500 hover:underline" href="https://github.com/flofriday/birthdaiii">https://github.com/flofriday/birthdaiii</a>
        </p>
      </div>
    </main>
  );
}
