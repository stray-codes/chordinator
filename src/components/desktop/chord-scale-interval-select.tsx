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

import { StateUpdater, useEffect, useState } from "preact/hooks";
import { Chord, Interval, Note, NoteLiteral } from "tonal";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Input } from "../ui/input";
import { Toggle } from "../ui/toggle";
import { Lock } from "lucide-preact";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { chords } from "../../../data/chords";
import { scales } from "../../../data/scales";
import { Settings } from "../../libs/settings";
import { X } from "lucide-react";
import { compareIntervals, sortInterval } from "../../libs/utils";

export const ChordScaleIntervalSelect = ({
    lock,
    setLock,
    setAbsoluteIntervals,
    setChordName,
    currentNote,
    settings,
}: {
    lock: boolean;
    setLock: (value: StateUpdater<boolean>) => void;
    setAbsoluteIntervals: (value: number[]) => void;
    setChordName: (value: string) => void;
    currentNote: NoteLiteral;
    settings: Settings | undefined;
}) => {
    const [relativeIntervals, setRelativeIntervals] = useState<number[]>([]);
    const [search, setSearch] = useState("");

    const [lockInfoNotified, setLockInfoNotified] = useState(false);

    useEffect(() => {
        setLock(false);
    }, [relativeIntervals]);

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
    }, [relativeIntervals, currentNote, lock]);

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
                    disabled={relativeIntervals.length === 0}
                >
                    <Lock className="size-3" />
                </Toggle>
                <div className="w-full flex justify-end">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="hover:text-yellow-300"
                            >
                                Chords / Scales / Intervals
                            </Button>
                        </DialogTrigger>

                        <DialogContent
                            showCloseButton={false}
                            className="h-9/10 flex flex-col items-start"
                        >
                            <DialogTitle className="sr-only">
                                Dialog containing lists of chords, scales and
                                intervals.
                            </DialogTitle>
                            <Tabs
                                defaultValue="chords"
                                className="size-full flex"
                            >
                                <div className="flex w-full justify-between">
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
                                    <DialogClose className="hover:bg-secondary px-2">
                                        <X />
                                    </DialogClose>
                                </div>
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
                                                            color: compareIntervals(
                                                                chord.intervals,
                                                                relativeIntervals,
                                                            )
                                                                ? "#fdc700"
                                                                : undefined,
                                                        }}
                                                        onClick={() => {
                                                            setRelativeIntervals(
                                                                chord.intervals,
                                                            );
                                                        }}
                                                    >
                                                        <span>
                                                            {chord.label}
                                                        </span>
                                                        <span>
                                                            {chord.intervals
                                                                .map((value) =>
                                                                    settings?.semitones ===
                                                                    "true"
                                                                        ? value
                                                                        : Interval.fromSemitones(
                                                                              value,
                                                                          ),
                                                                )
                                                                .join(", ")}
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
                                                            color: compareIntervals(
                                                                scale.intervals,
                                                                relativeIntervals,
                                                            )
                                                                ? "#fdc700"
                                                                : undefined,
                                                        }}
                                                        onClick={() => {
                                                            setRelativeIntervals(
                                                                scale.intervals,
                                                            );
                                                        }}
                                                    >
                                                        <span>
                                                            {scale.label}
                                                        </span>
                                                        <span className="truncate">
                                                            {scale.intervals
                                                                .map((value) =>
                                                                    settings?.semitones ===
                                                                    "true"
                                                                        ? value
                                                                        : Interval.fromSemitones(
                                                                              value,
                                                                          ),
                                                                )
                                                                .join(", ")}
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
                                        className="flex flex-col w-full h-full overflow-scroll *:border *:w-full *:data-[state=on]:text-yellow-300  *:hover:text-cyan-300 *:flex *:justify-between"
                                        value={relativeIntervals.map((item) =>
                                            String(item),
                                        )}
                                        onValueChange={(value) => {
                                            const newChordInput = value.map(
                                                (value) => Number(value),
                                            );
                                            sortInterval(newChordInput);
                                            setRelativeIntervals(newChordInput);
                                        }}
                                    >
                                        {[
                                            "Unison",
                                            "Minor Second",
                                            "Major Second",
                                            "Minor Third",
                                            "Major Third",
                                            "Perfect Fourth",
                                            "Augmented Fourth",
                                            "Perfect Fifth",
                                            "Minor Sixth",
                                            "Major Sixth",
                                            "Minor Seventh",
                                            "Major Seventh",
                                            "Octave",
                                        ].map((value, index) => (
                                            <ToggleGroupItem
                                                value={String(index)}
                                            >
                                                <span>{value}</span>
                                                <span>
                                                    {settings?.semitones ===
                                                    "true"
                                                        ? index
                                                        : Interval.fromSemitones(
                                                              index,
                                                          )}
                                                </span>
                                            </ToggleGroupItem>
                                        ))}
                                    </ToggleGroup>
                                    {relativeIntervals.length > 0 ? (
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setRelativeIntervals([]);
                                            }}
                                        >
                                            None
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setRelativeIntervals([
                                                    0, 1, 2, 3, 4, 5, 6, 7, 8,
                                                    9, 10, 11, 12,
                                                ]);
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
                type="multiple"
                value={relativeIntervals.map((item) => String(item))}
                className="flex flex-row h-17"
                onValueChange={(value) => {
                    const newChordInput = value.map((value) => Number(value));
                    sortInterval(newChordInput);
                    setRelativeIntervals(newChordInput);
                }}
            >
                <div className="h-full *:h-full">
                    {relativeIntervals.length > 0 ? (
                        <Button
                            variant="outline"
                            className="w-14"
                            onClick={() => {
                                setRelativeIntervals([]);
                            }}
                        >
                            None
                        </Button>
                    ) : (
                        <Button
                            className="w-14"
                            variant="outline"
                            onClick={() => {
                                setRelativeIntervals([
                                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
                                ]);
                            }}
                        >
                            All
                        </Button>
                    )}
                    <ToggleGroupItem
                        className="border text-xs h-full"
                        value="0"
                    >
                        {settings?.semitones === "true"
                            ? 0
                            : Interval.fromSemitones(0)}
                    </ToggleGroupItem>
                </div>
                <div className="flex flex-col h-full">
                    <div className="flex flex-row h-full *:h-full *:border *:max-w-0 *:text-xs">
                        {[1, 2, 3, 4, 5, 6].map((value) => (
                            <ToggleGroupItem value={String(value)}>
                                {settings?.semitones === "true"
                                    ? value
                                    : Interval.fromSemitones(value)}
                            </ToggleGroupItem>
                        ))}
                    </div>
                    <div className="flex flex-row h-full *:h-full *:border *:max-w-0 *:text-xs">
                        {[7, 8, 9, 10, 11, 12].map((value) => (
                            <ToggleGroupItem value={String(value)}>
                                {settings?.semitones === "true"
                                    ? value
                                    : Interval.fromSemitones(value)}
                            </ToggleGroupItem>
                        ))}
                    </div>
                </div>
            </ToggleGroup>
        </div>
    );
};
