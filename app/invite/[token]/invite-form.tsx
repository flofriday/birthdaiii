'use client'

import { Invite } from "@prisma/client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { AcceptState } from "@/lib/accept-state";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { EventDetails } from "@/lib/config";



export default function InviteForm({ invite: initialInvite, event }: { invite: Invite, event: EventDetails }) {

    let [invite, setInvite] = useState(initialInvite)
    let [newPlusOne, setNewPlusOne] = useState(initialInvite.plusOne)
    let [loading, setLoading] = useState(false)

    const { toast } = useToast()

    const copyText = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "📋 Copied to Clipboard",
        })
    }

    const updateInvite = async (newInvite: Invite) => {
        setLoading(true);
        setNewPlusOne(newInvite.plusOne)
        try {
            const response = await fetch(`/api/invite/${invite.token}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any other headers as needed (e.g., authentication headers)
                },
                body: JSON.stringify(newInvite),
            });

            if (!response.ok) {
                let message = (await response.json()).errorMessage
                if (message) {
                    throw new Error(message)
                }

                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setInvite(await response.json());
        } catch (error) {
            //Handle any errors that occurred during the fetch
            setNewPlusOne(invite.plusOne)
            console.error('Fetch error:', error);
            toast({
                title: "Something went wrong!",
                description: `${error}`,
            })
        }
        setLoading(false);
    };


    return (
        <main className="min-h-screen py-24 px-12 max-w-2xl mx-auto">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl pb-6">
                Hi {invite.name}!
            </h1>

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
                        {event.date}
                    </div>
                    <div className="pb-3">
                        <h3 className="font-bold">Location</h3>
                        {event.location}
                    </div>
                    <div className="pb-3">
                        <h3 className="font-bold">Drinks</h3>
                        There will be some basics, but bring what you like.
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => copyText(`Flo's Party 🎂\nDate: ${event.date}\nLocation: ${event.location}\nBring some drinks ;)`)}
                    >Copy to Clipboard</Button>
                </CardContent>
                {/* FIXME: Add a copy function */}
                {/* <CardFooter> */}
                {/* <Button></Button> */}
                {/* </CardFooter> */}
            </Card>

            {invite.accepted == AcceptState.Pending ? (
                <div className="text-right">
                    <Button disabled={loading} className="w-full mb-4" onClick={() => updateInvite({ ...invite, accepted: AcceptState.Accepted, plusOne: 0 })} >I'm in! 🎂 🎉</Button>
                    <Button disabled={loading} className="w-full" variant="secondary" onClick={() => updateInvite({ ...invite, accepted: AcceptState.Declined, plusOne: 0 })} > I won't attend 😔</Button>
                </div>
            ) : invite.accepted == AcceptState.Accepted ? (
                <div className="pt-5 pb-2 relative">
                    {/* FIXME: Maybe a emoji explosion? */}
                    {/* <span className="text-xl absolute animate-in duration-700 translate-y-48 left-[100%]">🎉</span> */}

                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Your in 🎉</h3>
                    <div className="pb-2">
                        That's amazing, there is a WhatsApp group again: <br />
                    </div>
                    <div className="pb-4">
                        Do you plan on bringing a plus one and if so how
                        many?
                    </div>

                    <div className="flex space-x-4">
                        <Input type="number" placeholder="" className="max-w-64" value={newPlusOne} onChange={(e) => setNewPlusOne(e.target.valueAsNumber)} />
                        <Button disabled={loading || newPlusOne == invite.plusOne} onClick={() => updateInvite({ ...invite, plusOne: newPlusOne })}>Update</Button>
                    </div>

                    <div className="h-full pt-6 text-left">
                        <Button className="pl-0 text-left" variant="link" onClick={() => updateInvite({ ...invite, accepted: AcceptState.Pending, plusOne: 0 })}>Reset all my choices <br />(Only for this page, cannot reset other life choices)</Button>
                    </div>
                </div>
            ) : (
                <div className="pt-5 pb-2">
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">You won't attend 😔</h3>
                    That's ok, some people are allergic to fun.

                    <div className="h-full pt-3">
                        <Button className="pl-0" variant="link" onClick={() => updateInvite({ ...invite, accepted: AcceptState.Pending, plusOne: 0 })}>What? No, I am fun!</Button>
                    </div>
                </div>
            )
            }
        </main >
    );
}