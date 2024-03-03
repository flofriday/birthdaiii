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

export default function InviteForm({ invite: initialInvite }: { invite: Invite }) {

    let [invite, setInvite] = useState(initialInvite)
    let [newPlusOne, setNewPlusOne] = useState(initialInvite.plusOne)
    let [loading, setLoading] = useState(false)

    const { toast } = useToast()

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

            console.log(response.ok)
            if (!response.ok) {
                let message = (await response.json()).errorMessage
                console.log(message)
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

            {invite.accepted == AcceptState.Pending ? (
                <div className="text-right">
                    <Button disabled={loading} className="w-full mb-4" onClick={() => updateInvite({ ...invite, accepted: AcceptState.Accepted, plusOne: 0 })} >I'm in! 🎂 🎉</Button>
                    <Button disabled={loading} className="w-full" variant="secondary" onClick={() => updateInvite({ ...invite, accepted: AcceptState.Declined, plusOne: 0 })} > I won't attend 😔</Button>
                </div>
            ) : invite.accepted == AcceptState.Accepted ? (
                <div className="pt-5 pb-2">
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Your in 🎉</h3>
                    <div className="pb-4">
                        That's amazing, do you plan on bringing a plus one and if so how
                        many?
                    </div>

                    <div className="flex space-x-4">
                        <Input type="number" placeholder="" defaultValue={invite.plusOne} className="max-w-64" value={newPlusOne} onChange={(e) => setNewPlusOne(e.target.valueAsNumber)} />
                        {/* FIXME: Disable flashing when website is fast */}
                        <Button disabled={loading} onClick={() => updateInvite({ ...invite, plusOne: newPlusOne })}>Update</Button>
                    </div>

                    <div className="h-full pt-3">
                        <Button variant="link" onClick={() => updateInvite({ ...invite, accepted: AcceptState.Pending, plusOne: 0 })}>Reset all my choices</Button>
                    </div>
                </div>
            ) : (
                <div className="pt-5 pb-2">
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">You won't attend 😔</h3>
                    That's ok, some people are allergic to fun.

                    <div className="h-full pt-3">
                        <Button variant="link" onClick={() => updateInvite({ ...invite, accepted: AcceptState.Pending, plusOne: 0 })}>What? No, I am fun!</Button>
                    </div>
                </div>
            )
            }
        </main >
    );
}