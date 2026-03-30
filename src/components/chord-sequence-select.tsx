/*
Chordinator: A tool to visualize chords and intervals on string instruments.
Copyright (C) 2026 Karol Czopek

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { useEffect, useState } from "preact/hooks";
import { Chord, Interval, Note, NoteLiteral } from "tonal";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Input } from "./ui/input";
import { Toggle } from "./ui/toggle";
import { Lock, PlusCircle } from "lucide-preact";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { chords } from "../libs/chords";
import { Button } from "./ui/button";
import { sequences } from "../libs/sequences";
import { toast } from "sonner";

export const ChordSequenceSelect = ({
    setChord,
    setChordName,
    currentNote,
}: {
    setChord: (value: number[]) => void;
    setChordName: (value: string) => void;
    currentNote: NoteLiteral;
}) => {
    const [lockChords, setLockChords] = useState(false);
    const [chordGroup, setChordGroup] = useState("none");
    const [chordInput, setChordInput] = useState("");
    const [interVals, setIntervals] = useState<number[]>([]);
    const [search, setSearch] = useState("");

    const [lockInfoNotified, setLockInfoNotified] = useState(false);

    useEffect(() => {
        if (chordGroup === "none" && lockChords) setLockChords(false);
    }, [chordGroup, lockChords]);

    useEffect(() => {
        if (lockChords) return;
        setChordName("-");
        const tmp = chordInput
            .split(/,\s*/)
            .map((item) => {
                if (item === null) return null;
                if (item.length === 0) return null;
                const semitone = Number(item);
                if (!isNaN(semitone)) return Interval.fromSemitones(semitone);
                const intervalName = Interval.name(item);
                if (intervalName.length === 0) return null;
                return intervalName;
            })
            .filter((item) => !!item) as string[];
        setIntervals(tmp.map((item) => Interval.semitones(item)));
        const newChord = [
            ...tmp.map((item) => Note.transpose(currentNote, item)),
        ];
        setChord(newChord.map((item) => Note.midi(item)!));
        const newChordNames = Chord.detect(newChord);
        if (newChordNames.length >= 1) {
            setChordName(newChordNames.join(", "));
            if (!lockInfoNotified) {
                setLockInfoNotified(true);
                toast.message("Press space to lock!", {
                    description:
                        "If you press space, the currently selected interval, chord or sequence will be locked in place.",
                });
            }
        }
    }, [chordInput, currentNote]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                const target = e.target as HTMLElement;
                if (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
                    return;
                e.preventDefault();
                setLockChords((prev) => {
                    return !prev;
                });
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="border p-2 flex flex-col items-center gap-2 w-full lg:w-fit">
            <div className="flex items-center justify-between w-full text-xs">
                <Toggle
                    className="h-6 p-0 hover:text-yellow-300 rounded-full"
                    pressed={lockChords}
                    onPressedChange={(value) => setLockChords(value)}
                    disabled={chordGroup === "none"}
                >
                    <Lock className="size-3" />
                </Toggle>
                <div className="w-full flex justify-end">
                    <Dialog>
                        <DialogTrigger className="hover:text-yellow-300">
                            <PlusCircle />
                        </DialogTrigger>

                        <DialogContent className="h-9/10 flex flex-col items-start">
                            <DialogTitle className="sr-only">
                                Dialog containing lists of chords, sequences and
                                intervals.
                            </DialogTitle>
                            <Tabs
                                defaultValue="intervals"
                                className="size-full flex"
                            >
                                <TabsList className="w-4/5">
                                    <TabsTrigger value="chords">
                                        Chords
                                    </TabsTrigger>
                                    <TabsTrigger value="sequences">
                                        Sequences
                                    </TabsTrigger>
                                    <TabsTrigger value="intervals">
                                        Intervals
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent
                                    value="chords"
                                    className="size-full h-full overflow-hidden flex flex-col gap-2"
                                >
                                    <Input
                                        placeholder="Search..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.currentTarget.value)
                                        }
                                    />
                                    <div className="flex flex-col h-full w-full overflow-scroll">
                                        {chords
                                            .filter((item) =>
                                                item.label
                                                    .toLocaleLowerCase()
                                                    .replace(/\s+/g, "")
                                                    .includes(
                                                        search
                                                            .toLocaleLowerCase()
                                                            .replace(
                                                                /\s+/g,
                                                                "",
                                                            ),
                                                    ),
                                            )

                                            .map((chord) => (
                                                <DialogClose asChild>
                                                    <Button
                                                        className="flex justify-between w-full gap-4"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setChordInput(
                                                                chord.intervals,
                                                            );
                                                            setChordGroup(
                                                                chord.chordGroup ??
                                                                    "custom",
                                                            );
                                                        }}
                                                    >
                                                        <span>
                                                            {chord.label}
                                                        </span>
                                                        <span>
                                                            {chord.intervals}
                                                        </span>
                                                    </Button>
                                                </DialogClose>
                                            ))}
                                    </div>
                                </TabsContent>

                                <TabsContent
                                    value="sequences"
                                    className="size-full h-full overflow-hidden flex flex-col gap-2"
                                >
                                    <Input
                                        placeholder="Search..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.currentTarget.value)
                                        }
                                    />
                                    <div className="flex flex-col h-full w-full overflow-scroll">
                                        {sequences
                                            .filter((item) =>
                                                item.label
                                                    .toLocaleLowerCase()
                                                    .replace(/\s+/g, "")
                                                    .includes(
                                                        search
                                                            .toLocaleLowerCase()
                                                            .replace(
                                                                /\s+/g,
                                                                "",
                                                            ),
                                                    ),
                                            )

                                            .map((sequence) => (
                                                <DialogClose asChild>
                                                    <Button
                                                        className="flex justify-between w-full gap-4"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setChordInput(
                                                                sequence.intervals,
                                                            );
                                                            setChordGroup(
                                                                sequence.chordGroup ??
                                                                    "custom",
                                                            );
                                                        }}
                                                    >
                                                        <span>
                                                            {sequence.label}
                                                        </span>
                                                        <span>
                                                            {sequence.intervals}
                                                        </span>
                                                    </Button>
                                                </DialogClose>
                                            ))}
                                    </div>
                                </TabsContent>

                                <TabsContent
                                    value="intervals"
                                    className="size-full h-8/12 flex flex-col gap-2"
                                >
                                    <ToggleGroup
                                        type="multiple"
                                        className="flex flex-col w-full h-full overflow-scroll *:hover:bg-transparent *:data-[state=on]:bg-transparent *:w-full *:data-[state=on]:text-yellow-300  *:hover:text-cyan-300"
                                        value={interVals.map((item) =>
                                            String(item),
                                        )}
                                        onValueChange={(value) => {
                                            setChordInput(
                                                value
                                                    .sort(
                                                        (a, b) =>
                                                            Number(a) -
                                                            Number(b),
                                                    )
                                                    .join(", "),
                                            );
                                        }}
                                    >
                                        <ToggleGroupItem value="0">
                                            Unison
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="1">
                                            Minor Second
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="2">
                                            Major Second
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="3">
                                            Minor Third
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="4">
                                            Major Third
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="5">
                                            Perfect Fourth
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="6">
                                            Augmented Fourth
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="7">
                                            Perfect Fifth
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="8">
                                            Minor Sixth
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="9">
                                            Major Sixth
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="10">
                                            Minor Seventh
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="11">
                                            Major Seventh
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="12">
                                            Octave
                                        </ToggleGroupItem>
                                    </ToggleGroup>
                                    {chordInput.length > 0 ? (
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setChordInput("");
                                            }}
                                        >
                                            None
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setChordInput(
                                                    "0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12",
                                                );
                                            }}
                                        >
                                            All
                                        </Button>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <ToggleGroup
                type="single"
                value={chordGroup}
                onValueChange={(value) => {
                    setLockChords(false);
                    if (value) {
                        setChordGroup(value);
                        switch (value) {
                            case "none":
                                setLockChords(false);
                                setChordInput("");
                                break;
                            case "major":
                                setChordInput("0, 4, 7");
                                break;
                            case "minor":
                                setChordInput("0, 3, 7");
                                break;
                            case "pentatonic":
                                setChordInput("0, 2, 4, 7, 9");
                                break;
                        }
                    }
                }}
            >
                <ToggleGroupItem value="none">None</ToggleGroupItem>
                <ToggleGroupItem
                    value="major"
                    className="data-[state=on]:text-yellow-300"
                >
                    Major
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="minor"
                    className="data-[state=on]:text-yellow-300"
                >
                    Minor
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="pentatonic"
                    className="data-[state=on]:text-yellow-300"
                >
                    Penta.
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="custom"
                    className="data-[state=on]:text-yellow-300"
                >
                    Custom
                </ToggleGroupItem>
            </ToggleGroup>
            <Input
                value={chordInput}
                onChange={(e) => {
                    setChordGroup("custom");
                    setChordInput(e.currentTarget.value);
                }}
            />
        </div>
    );
};
