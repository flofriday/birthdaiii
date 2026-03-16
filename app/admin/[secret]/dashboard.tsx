"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Invite, Event } from "@prisma/client";
import { useEffect, useState } from "react";
import { MoreVertical, Plus, Calendar, MapPin, Users } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";
import { toast } from "sonner";
import { AcceptState } from "@/lib/accept-state";
import Link from "next/dist/client/link";

function acceptStateToEmoji(state: string): string {
  switch (state) {
    case AcceptState.Accepted:
      return "✅";
    case AcceptState.Pending:
      return "⏳";
    case AcceptState.Declined:
      return "❌";
  }
  return "";
}

export default function Dashboard({
  events: initialEvents,
  adminSecret,
}: {
  events: Event[];
  adminSecret: string;
}) {
  const [events, setEvents] = useState(initialEvents);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(
    initialEvents[0]?.id ?? null
  );
  const [newEventOpen, setNewEventOpen] = useState(false);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(false);

  const [newInviteText, setNewInviteText] = useState("");
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);

  // New event form state
  const [newEventName, setNewEventName] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventGroupChat, setNewEventGroupChat] = useState("");

  // Edit event form state
  const [editEventName, setEditEventName] = useState("");
  const [editEventLocation, setEditEventLocation] = useState("");
  const [editEventDate, setEditEventDate] = useState("");
  const [editEventGroupChat, setEditEventGroupChat] = useState("");

  const selectedEvent = events.find((e) => e.id === selectedEventId) ?? null;

  useEffect(() => {
    if (inviteMessage !== null) return;
    setInviteMessage(localStorage.getItem("inviteMessage") ?? "");
  }, [inviteMessage]);

  useEffect(() => {
    if (selectedEventId === null) {
      setInvites([]);
      return;
    }
    setLoadingInvites(true);
    fetch(`/api/admin/${adminSecret}/invite?eventId=${selectedEventId}`)
      .then((r) => r.json())
      .then((data) => setInvites(data))
      .catch(() => toast("Failed to load invites"))
      .finally(() => setLoadingInvites(false));
  }, [selectedEventId, adminSecret]);

  const copyText = (text: string, description?: string) => {
    navigator.clipboard.writeText(text);
    toast("📋 Copied to Clipboard", { description });
  };

  const createEvent = async () => {
    if (!newEventName || !newEventLocation || !newEventDate) return;
    try {
      const response = await fetch(`/api/admin/${adminSecret}/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newEventName,
          location: newEventLocation,
          date: newEventDate,
          groupChat: newEventGroupChat,
        }),
      });
      if (!response.ok) throw new Error((await response.json()).errorMessage);
      const created: Event = await response.json();
      setEvents([created, ...events]);
      setSelectedEventId(created.id);
      setNewEventName("");
      setNewEventLocation("");
      setNewEventDate("");
      setNewEventGroupChat("");
      toast(`Created event "${created.name}"`);
    } catch (error) {
      toast("Something went wrong!", { description: `${error}` });
    }
  };

  const saveEvent = async () => {
    if (!selectedEvent) return;
    try {
      const response = await fetch(
        `/api/admin/${adminSecret}/event/${selectedEvent.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editEventName,
            location: editEventLocation,
            date: editEventDate,
            groupChat: editEventGroupChat,
          }),
        }
      );
      if (!response.ok) throw new Error((await response.json()).errorMessage);
      const updated: Event = await response.json();
      setEvents(events.map((e) => (e.id === updated.id ? updated : e)));
      toast(`Saved event "${updated.name}"`);
    } catch (error) {
      toast("Something went wrong!", { description: `${error}` });
    }
  };

  const deleteEvent = async (event: Event) => {
    try {
      const response = await fetch(
        `/api/admin/${adminSecret}/event/${event.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error((await response.json()).errorMessage);
      const remaining = events.filter((e) => e.id !== event.id);
      setEvents(remaining);
      setSelectedEventId(remaining[0]?.id ?? null);
      toast(`Deleted event "${event.name}"`);
    } catch (error) {
      toast("Something went wrong!", { description: `${error}` });
    }
  };

  const deleteInvite = async (invite: Invite) => {
    try {
      const response = await fetch(
        `/api/admin/${adminSecret}/invite/${invite.token}`,
        { method: "DELETE", body: "" }
      );
      if (!response.ok) throw new Error((await response.json()).errorMessage);
      setInvites(invites.filter((i) => i.token !== invite.token));
      toast("Deleted Invite", {
        description: `Removed invite for ${invite.name} ${invite.fullName}`,
      });
    } catch (error) {
      toast("Something went wrong!", { description: `${error}` });
    }
  };

  const addNewInvites = async (inviteText: string) => {
    if (!selectedEventId) return;
    const rows = inviteText.split("\n");
    const errors: string[] = [];
    const newInvites: Invite[] = [];
    for (const row of rows) {
      if (row.trim() === "") continue;
      const [name, ...fullNames] = row.split(" ");
      const fullName = fullNames.join(" ");
      try {
        const response = await fetch(`/api/admin/${adminSecret}/invite/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            fullName: fullName.trim(),
            eventId: selectedEventId,
          }),
        });
        if (!response.ok) throw new Error((await response.json()).errorMessage);
        newInvites.push(await response.json());
      } catch (error) {
        errors.push(`${error}`);
      }
    }
    setInvites([...invites, ...newInvites]);
    setNewInviteText("");
    if (newInvites.length > 0) toast(`Created ${newInvites.length} invites`);
    if (errors.length > 0) {
      toast("Something went wrong!", {
        description: `${errors.length} errors:\n${errors.join("\n")}`,
      });
    }
  };

  const craftInviteMessage = (invite: Invite) => {
    if (!inviteMessage) return "";
    return inviteMessage
      .replaceAll("$name", invite.name)
      .replaceAll("$inviteUrl", `${window.origin}/invite/${invite.token}`);
  };

  const accepted = invites.filter((i) => i.accepted === AcceptState.Accepted);
  const declined = invites.filter((i) => i.accepted === AcceptState.Declined);
  const pendingInvites = invites.filter((i) => i.accepted === AcceptState.Pending);

  const totalAttending = accepted.reduce((acc, i) => acc + 1 + i.plusOne, 0);
  const pending = pendingInvites.length;

  const chartData = [
    { state: "Accepted", count: accepted.length, fill: "var(--color-accepted)" },
    { state: "Declined", count: declined.length, fill: "var(--color-declined)" },
    { state: "Pending", count: pending, fill: "var(--color-pending)" },
  ];
  const chartConfig = {
    count: { label: "Count" },
    accepted: { label: "Accepted", color: "oklch(0.696 0.17 162.48)" },
    declined: { label: "Declined", color: "oklch(0.628 0.258 29.23)" },
    pending: { label: "Pending", color: "oklch(0.7 0.0 0)" },
  };

  // Shared new-event dialog (triggered from both sidebar and mobile strip)
  const newEventDialog = (
    <Dialog open={newEventOpen} onOpenChange={setNewEventOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            placeholder="Event name"
            value={newEventName}
            onChange={(e) => setNewEventName(e.target.value)}
          />
          <Input
            placeholder="Location"
            value={newEventLocation}
            onChange={(e) => setNewEventLocation(e.target.value)}
          />
          <Input
            placeholder="Date (e.g. 2026-06-01 20:00)"
            value={newEventDate}
            onChange={(e) => setNewEventDate(e.target.value)}
          />
          <Input
            placeholder="Group chat URL (optional)"
            value={newEventGroupChat}
            onChange={(e) => setNewEventGroupChat(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              disabled={!newEventName || !newEventLocation || !newEventDate}
              onClick={createEvent}
            >
              Create
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="pt-8 pb-10">
      {newEventDialog}

      <div className="px-4 py-6 md:px-8 max-w-5xl mx-auto">
        {/* Event pill selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-5">
          {events.map((event) => (
            <button
              key={event.id}
              onClick={() => setSelectedEventId(event.id)}
              className={
                "shrink-0 px-3 py-1 rounded-full transition-colors whitespace-nowrap " +
                (selectedEventId === event.id
                  ? "bg-accent text-accent-foreground font-medium"
                  : "bg-muted text-muted-foreground")
              }
            >
              {event.name}
            </button>
          ))}
          <button
            onClick={() => setNewEventOpen(true)}
            className="shrink-0 px-3 py-1 rounded-full bg-muted text-muted-foreground flex items-center gap-1 whitespace-nowrap"
          >
            <Plus className="h-3 w-3" /> New
          </button>
        </div>

        {!selectedEvent ? (
          <div className="flex items-center justify-center py-24 text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium">No event selected</p>
              <p className="text-sm">Create an event to get started.</p>
            </div>
          </div>
        ) : (
          <div>
              {/* Event header */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                    {selectedEvent.name}
                  </h1>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {selectedEvent.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {selectedEvent.location}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <Dialog
                    onOpenChange={(open) => {
                      if (open) {
                        setEditEventName(selectedEvent.name);
                        setEditEventLocation(selectedEvent.location);
                        setEditEventDate(selectedEvent.date);
                        setEditEventGroupChat(selectedEvent.groupChat);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Event</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3">
                        <Input
                          placeholder="Event name"
                          value={editEventName}
                          onChange={(e) => setEditEventName(e.target.value)}
                        />
                        <Input
                          placeholder="Location"
                          value={editEventLocation}
                          onChange={(e) => setEditEventLocation(e.target.value)}
                        />
                        <Input
                          placeholder="Date"
                          value={editEventDate}
                          onChange={(e) => setEditEventDate(e.target.value)}
                        />
                        <Input
                          placeholder="Group chat URL"
                          value={editEventGroupChat}
                          onChange={(e) =>
                            setEditEventGroupChat(e.target.value)
                          }
                        />
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button onClick={saveEvent}>Save</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DialogTrigger asChild>
                          <DropdownMenuItem>
                            <span className="text-red-600">Delete Event</span>
                          </DropdownMenuItem>
                        </DialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete "{selectedEvent.name}"?</DialogTitle>
                        <DialogDescription>
                          This will permanently delete the event and all its
                          invites. This cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="destructive"
                          onClick={() => deleteEvent(selectedEvent)}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Stats + Invite message */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="h-4 w-4" /> Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-row items-center gap-6">
                    {invites.length > 0 && (
                      <ChartContainer config={chartConfig} className="h-28 w-28 shrink-0">
                        <PieChart>
                          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                          <Pie data={chartData} dataKey="count" nameKey="state" innerRadius="55%" outerRadius="80%" paddingAngle={2} />
                        </PieChart>
                      </ChartContainer>
                    )}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: chartConfig.accepted.color }} />
                        <span className="text-muted-foreground">Accepted</span>
                        <span className="font-semibold ml-auto">{accepted.length}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: chartConfig.declined.color }} />
                        <span className="text-muted-foreground">Declined</span>
                        <span className="font-semibold ml-auto">{declined.length}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: chartConfig.pending.color }} />
                        <span className="text-muted-foreground">Pending</span>
                        <span className="font-semibold ml-auto">{pending}</span>
                      </div>
                      <div className="border-t pt-1.5 mt-1.5 flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Attending</span>
                        <span className="font-semibold ml-auto">{totalAttending}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle className="text-base">
                      Invitation Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      className="w-full"
                      disabled={inviteMessage === null}
                      value={inviteMessage ?? ""}
                      onChange={(e) => {
                        setInviteMessage(e.target.value);
                        localStorage.setItem("inviteMessage", e.target.value);
                      }}
                    />
                  </CardContent>
                  <CardFooter>
                    <p className="text-xs text-muted-foreground">
                      Variables:{" "}
                      <span
                        className={
                          inviteMessage?.includes("$name")
                            ? "text-teal-500"
                            : ""
                        }
                      >
                        $name
                      </span>{" "}
                      <span
                        className={
                          inviteMessage?.includes("$inviteUrl")
                            ? "text-teal-500"
                            : ""
                        }
                      >
                        $inviteUrl
                      </span>
                    </p>
                  </CardFooter>
                </Card>
              </div>

              {/* Invites table */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Invites</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" size="sm">
                      Add Invite(s)
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Invite(s)</DialogTitle>
                      <DialogDescription>
                        Write <code>nickname fullname</code> per line. The full
                        name can contain spaces.
                      </DialogDescription>
                    </DialogHeader>
                    <Textarea
                      placeholder="Maxl Max Musterman"
                      value={newInviteText}
                      onChange={(e) => setNewInviteText(e.target.value)}
                    />
                    <div className="text-right">
                      <DialogClose asChild>
                        <Button onClick={() => addNewInvites(newInviteText)}>
                          Add
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {loadingInvites ? (
                <div className="text-center text-muted-foreground py-8">
                  Loading…
                </div>
              ) : invites.length === 0 ? (
                <div className="italic text-center text-muted-foreground py-8">
                  No invites yet…
                </div>
              ) : (
                <Card className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Full Name
                          </TableHead>
                          <TableHead>Attendance</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            +1
                          </TableHead>
                          <TableHead className="hidden md:table-cell" />
                          <TableHead />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invites.map((invite) => (
                          <TableRow key={invite.token}>
                            <TableCell className="font-medium">
                              {invite.name}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {invite.fullName}
                            </TableCell>
                            <TableCell>
                              {acceptStateToEmoji(invite.accepted)}{" "}
                              <span className="hidden sm:inline">
                                {invite.accepted}
                              </span>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {invite.plusOne}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Button
                                disabled={!inviteMessage?.trim()}
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  copyText(
                                    craftInviteMessage(invite),
                                    `Invite message for ${invite.name}`
                                  )
                                }
                              >
                                Copy Invite
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Dialog>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() =>
                                        copyText(
                                          craftInviteMessage(invite),
                                          `Invite message for ${invite.name}`
                                        )
                                      }
                                      disabled={!inviteMessage?.trim()}
                                      className="md:hidden"
                                    >
                                      Copy Invite
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        copyText(
                                          `${window.origin}/invite/${invite.token}`,
                                          `Invite URL for ${invite.name}`
                                        )
                                      }
                                    >
                                      Copy URL
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Link href={`/invite/${invite.token}`}>
                                        Check Invite
                                      </Link>
                                    </DropdownMenuItem>
                                    <DialogTrigger asChild>
                                      <DropdownMenuItem>
                                        <span className="text-red-600">
                                          Delete
                                        </span>
                                      </DropdownMenuItem>
                                    </DialogTrigger>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Delete {invite.name} {invite.fullName}?
                                    </DialogTitle>
                                    <DialogDescription>
                                      This cannot be undone. Their invite link
                                      will stop working.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button
                                      variant="destructive"
                                      onClick={() => deleteInvite(invite)}
                                    >
                                      Delete
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
