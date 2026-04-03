/*
Chordinator: A tool to visualize chords, scales and intervals of string instruments.
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

import { StateUpdater, useEffect, useMemo, useState } from "preact/hooks";
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
import { Button } from "./ui/button";
import { toast } from "sonner";
import { chords } from "../../data/chords";
import { scales } from "../../data/scales";

export const ChordScaleIntervalSelect = ({
    lock,
    setLock,
    setAbsoluteIntervals,
    setChordName,
    currentNote,
    chordScaleIntervalGroup,
    setChordScaleIntervalGroup,
    relativeIntervalsString,
    setRelativeIntervalsString,
}: {
    lock: boolean;
    setLock: (value: StateUpdater<boolean>) => void;
    setAbsoluteIntervals: (value: number[]) => void;
    setChordName: (value: string) => void;
    currentNote: NoteLiteral;
    chordScaleIntervalGroup: string;
    setChordScaleIntervalGroup: (value: string) => void;
    relativeIntervalsString: string;
    setRelativeIntervalsString: (value: string) => void;
}) => {
    const relativeIntervals = useMemo(
        () =>
            relativeIntervalsString
                .split(",")
                .filter((value) => value.length > 0)
                .map((value) => Number(value)),
        [relativeIntervalsString],
    );
    const [search, setSearch] = useState("");

    const [lockInfoNotified, setLockInfoNotified] = useState(false);

    useEffect(() => {
        if (lock) return;
        setChordName("-");
        const newAbsoluteNotes =
            relativeIntervals?.map((value) =>
                Note.transpose(currentNote, Interval.fromSemitones(value)),
            ) ?? [];

        const newAbsoluteIntervals = newAbsoluteNotes.map(
            (item) => Note.midi(item)!,
        );
        setAbsoluteIntervals(newAbsoluteIntervals);
        const newChordNames = Chord.detect(newAbsoluteNotes);
        if (newChordNames.length >= 1) {
            setChordName(newChordNames.join(", "));
            if (!lockInfoNotified) {
                setLockInfoNotified(true);
                toast.message("Hit space to lock!", {
                    description:
                        "If you press space, the currently selected interval, chord or scale will be locked in place. Press again to release lock.",
                });
            }
        }
    }, [relativeIntervals, currentNote]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                const target = e.target as HTMLElement;
                if (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
                    return;
                e.preventDefault();
                setLock((prev) => {
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
                    pressed={lock}
                    onPressedChange={(value) => setLock(value)}
                    disabled={chordScaleIntervalGroup === "none"}
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
                                Dialog containing lists of chords, scales and
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
                                    <TabsTrigger value="scales">
                                        Scales
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
                                                        style={{
                                                            color:
                                                                relativeIntervalsString ===
                                                                chord.intervals
                                                                    ? "#fdc700"
                                                                    : undefined,
                                                        }}
                                                        onClick={() => {
                                                            setRelativeIntervalsString(
                                                                chord.intervals,
                                                            );
                                                            setChordScaleIntervalGroup(
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
                                    value="scales"
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
                                        {scales
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

                                            .map((scale) => (
                                                <DialogClose asChild>
                                                    <Button
                                                        className="flex justify-between w-full gap-4"
                                                        variant="outline"
                                                        style={{
                                                            color:
                                                                relativeIntervalsString ===
                                                                scale.intervals
                                                                    ? "#fdc700"
                                                                    : undefined,
                                                        }}
                                                        onClick={() => {
                                                            setRelativeIntervalsString(
                                                                scale.intervals,
                                                            );
                                                            setChordScaleIntervalGroup(
                                                                scale.chordGroup ??
                                                                    "custom",
                                                            );
                                                        }}
                                                    >
                                                        <span>
                                                            {scale.label}
                                                        </span>
                                                        <span>
                                                            {scale.intervals}
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
                                        value={relativeIntervals.map((item) =>
                                            String(item),
                                        )}
                                        onValueChange={(value) => {
                                            setChordScaleIntervalGroup(
                                                "custom",
                                            );
                                            const newChordInput = value
                                                .sort(
                                                    (a, b) =>
                                                        Number(a) - Number(b),
                                                )
                                                .join(", ");
                                            setRelativeIntervalsString(
                                                newChordInput,
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
                                    {relativeIntervalsString.length > 0 ? (
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setRelativeIntervalsString("");
                                                setChordScaleIntervalGroup(
                                                    "custom",
                                                );
                                            }}
                                        >
                                            None
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setRelativeIntervalsString(
                                                    "0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12",
                                                );
                                                setChordScaleIntervalGroup(
                                                    "custom",
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
                value={chordScaleIntervalGroup}
                onValueChange={(value) => {
                    if (value) {
                        setChordScaleIntervalGroup(value);
                        switch (value) {
                            case "none":
                                setRelativeIntervalsString("");
                                break;
                            case "major":
                                setRelativeIntervalsString("0, 4, 7");
                                break;
                            case "minor":
                                setRelativeIntervalsString("0, 3, 7");
                                break;
                            case "pentatonic":
                                setRelativeIntervalsString("0, 2, 4, 7, 9");
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
                value={relativeIntervalsString}
                onChange={(e) => {
                    setChordScaleIntervalGroup("custom");
                    setRelativeIntervalsString(e.currentTarget.value);
                }}
            />
        </div>
    );
};
