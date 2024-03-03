'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { EventDetails } from "@/lib/config";
import { Invite } from "@prisma/client";
import { Span } from "next/dist/trace";
import { useState } from "react";
import { MoreVertical } from "lucide-react"
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { AcceptState } from "@/lib/accept-state";

export default function Dashboard({ invites: initialInvites, event, adminSecret }: { invites: Invite[], event: EventDetails, adminSecret: string }) {

    let [invites, setInvites] = useState(initialInvites)
    let [newInviteText, setNewInviteText] = useState("")

    const addNewInvites = async (inviteText: string) => {
        let rows = inviteText.split("\n")
        let errors: string[] = []
        let newInvites: Invite[] = []
        for (let row of rows) {
            let [name, ...fullNames] = row.split(" ");
            let fullName = fullNames.join(" ")
            console.log(fullName)
            try {
                const response = await fetch(`/api/admin/${adminSecret}/invite/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Add any other headers as needed (e.g., authentication headers)
                    },
                    body: JSON.stringify({ name: name.trim(), fullName: fullName.trim() }),
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

                const newInvite: Invite = (await response.json())
                newInvites.push(newInvite)

            } catch (error) {
                errors.push(`${error}`)

            }

            setInvites([...invites, ...newInvites])
            if (errors.length > 0) {
                toast({
                    title: "Something went wrong!",
                    description: `There were ${errors.length} errors:\n${errors.join('\n')}`,
                })
            }

        }
    }

    return (
        <main className="min-h-screen py-24 px-12 max-w-6xl mx-auto">
            <div className="flex justify-between">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl pb-6">
                    Admin Dashboard
                </h1>

                <div className="flex space-x-4">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="secondary">Add Invite(s)</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Invite(s)</DialogTitle>
                                <DialogDescription>
                                    To create an invite write `nickname fullname`. The fullname can have spaces. You can create multiple by writing multiple lines.
                                </DialogDescription>
                            </DialogHeader>
                            <Textarea placeholder="Maxl Max Musterman" value={newInviteText} onChange={(e) => setNewInviteText(e.target.value)} />
                            <div className="text-right">
                                <DialogClose asChild>
                                    <Button onClick={async () => { await addNewInvites(newInviteText) }}>Add</Button>
                                </DialogClose>
                            </div>
                        </DialogContent>
                    </Dialog>
                    {/* <Button variant="secondary"><MoreVertical /></Button> */}
                </div>
            </div>

            <div className="w-full flex pb-4 space-x-4">
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="pb-2">
                            <h5 className="font-bold">Total Attending</h5>
                            <span>
                                {invites.reduce((acc: number, i: Invite) => acc + (i.accepted == AcceptState.Accepted ? 1 : 0), 0)}
                            </span>
                        </div>
                        <div className="pb-2">
                            <h5 className="font-bold">Invites sent</h5>
                            <span>
                                {invites.length}
                            </span>
                        </div>
                        <div className="pb-2">
                            <h5 className="font-bold">Pending</h5>
                            <span>
                                {invites.filter(i => i.accepted == AcceptState.Pending).length}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>Invitation Message</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea></Textarea>
                    </CardContent>
                    <CardFooter>
                        <p className="text-sm">You can use the following variables in the message:<br></br> $name $inviteUrl</p>
                    </CardFooter>
                </Card>
            </div>

            {
                invites.length == 0 ? (<div className="italic text-center my-auto text-lg">No invites yet...</div>) :
                    (
                        <Card>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Full Name</TableHead>
                                        <TableHead>Attendance</TableHead>
                                        <TableHead>Plus One</TableHead>
                                        <TableHead ></TableHead>
                                        <TableHead ></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invites.map((i: Invite) => (
                                        <TableRow key={i.fullName}>
                                            <TableCell className="font-medium">{i.name}</TableCell>
                                            <TableCell>{i.fullName}</TableCell>

                                            {/* FIXME: some more visual idicator */}
                                            <TableCell>{i.accepted}</TableCell>
                                            <TableCell>{i.plusOne}</TableCell>
                                            <TableCell>
                                                <Button variant="outline" className="text-sm">Copy Invite</Button>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" className="text-sm"> <MoreVertical></MoreVertical></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>)
            }
        </main >
    );

}