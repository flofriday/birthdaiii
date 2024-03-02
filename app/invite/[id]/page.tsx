import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function FAQ() {
    return (
        <main className="min-h-screen py-24 px-12 max-w-2xl mx-auto">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl pb-6">Hi Valentin!</h1>

            <div className="pb-4">
                I'd love to invite you to my birthday party.
                It will once again be a chill hang with music, some foods, drinks
                and definitely more dancing 😉
            </div>

            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>The Hard Facts</CardTitle>
                    <CardDescription>Flo's Birthday Party 🎂</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="pb-3">
                        <h3 className="font-bold">Date</h3>
                        2026-01-01 20:00
                    </div>
                    <div className="pb-3">
                        <h3 className="font-bold">Location</h3>
                        Some Street 123/45
                    </div>
                    <div className="">
                        <h3 className="font-bold">Drinks</h3>
                        There will be some basics, but bring what you like.
                    </div>
                </CardContent>
                {/* FIXME: Add a copy function */}
                {/* <CardFooter> */}
                {/* <Button></Button> */}
                {/* </CardFooter> */}
            </Card>

            <div className="text-right">
                <Button className="w-full mb-4">I'm in! 🎂 🎉</Button>
                <Button className="w-full" variant="secondary">I won't attend 😔</Button>
            </div>
        </main>
    );
}
