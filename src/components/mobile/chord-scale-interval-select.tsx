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

import { useState } from "preact/hooks";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Input } from "../ui/input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { chords } from "../../../data/chords";
import { scales } from "../../../data/scales";
import { Settings } from "../../libs/settings";
import { Interval } from "tonal";
import { compareIntervals, sortInterval } from "../../libs/utils";

export const ChordScaleIntervalSelectMobile = ({
    settings,
    relativeIntervals,
    setRelativeIntervals,
}: {
    settings: Settings;
    relativeIntervals: number[];
    setRelativeIntervals: (value: number[]) => void;
}) => {
    const [search, setSearch] = useState("");

    return (
        <Tabs
            defaultValue="intervals"
            className="size-full flex flex-col gap-0 overflow-x-hidden"
        >
            <TabsList className="w-full m-0 p-0 border-0 *:text-xs">
                <TabsTrigger value="chords">Chords</TabsTrigger>
                <TabsTrigger value="scales">Scales</TabsTrigger>
                <TabsTrigger value="intervals">Intervals</TabsTrigger>
            </TabsList>

            <div className="size-full overflow-hidden">
                <TabsContent value="chords" className="size-full flex flex-col">
                    <Input
                        className="text-xs"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)}
                    />
                    <div className="flex flex-col size-full overflow-scroll">
                        {chords
                            .filter((item) =>
                                item.label
                                    .toLocaleLowerCase()
                                    .replace(/\s+/g, "")
                                    .includes(
                                        search
                                            .toLocaleLowerCase()
                                            .replace(/\s+/g, ""),
                                    ),
                            )

                            .map((chord) => (
                                <Button
                                    className="flex justify-between w-full gap-4 text-xs"
                                    variant="outline"
                                    onClick={() => {
                                        setRelativeIntervals(chord.intervals);
                                    }}
                                    style={{
                                        color: compareIntervals(
                                            chord.intervals,
                                            relativeIntervals,
                                        )
                                            ? "#fdc700"
                                            : undefined,
                                    }}
                                >
                                    <span>{chord.label}</span>
                                    <span className="truncate">
                                        {chord.intervals
                                            .map((value) =>
                                                settings?.semitones === "true"
                                                    ? value
                                                    : Interval.fromSemitones(
                                                          value,
                                                      ),
                                            )
                                            .join(", ")}
                                    </span>
                                </Button>
                            ))}
                    </div>
                </TabsContent>

                <TabsContent value="scales" className="size-full flex flex-col">
                    <Input
                        className="text-xs"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)}
                    />
                    <div className="flex flex-col size-full overflow-scroll">
                        {scales
                            .filter((item) =>
                                item.label
                                    .toLocaleLowerCase()
                                    .replace(/\s+/g, "")
                                    .includes(
                                        search
                                            .toLocaleLowerCase()
                                            .replace(/\s+/g, ""),
                                    ),
                            )

                            .map((scale) => (
                                <Button
                                    className="flex justify-between w-full gap-4 text-xs"
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
                                        setRelativeIntervals(scale.intervals);
                                    }}
                                >
                                    <span>{scale.label}</span>
                                    <span className="truncate">
                                        {scale.intervals
                                            .map((value) =>
                                                settings?.semitones === "true"
                                                    ? value
                                                    : Interval.fromSemitones(
                                                          value,
                                                      ),
                                            )
                                            .join(", ")}
                                    </span>
                                </Button>
                            ))}
                    </div>
                </TabsContent>

                <TabsContent
                    value="intervals"
                    className="size-full flex flex-col"
                >
                    <ToggleGroup
                        type="multiple"
                        className="flex flex-col w-full h-full overflow-scroll *:hover:bg-transparent *:data-[state=on]:bg-transparent *:w-full *:data-[state=on]:text-yellow-300  *:text-xs *:border  *:flex *:justify-between"
                        value={relativeIntervals.map((item) => String(item))}
                        onValueChange={(value) => {
                            const newChordInput = value.map((value) =>
                                Number(value),
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
                            <ToggleGroupItem value={String(index)}>
                                <span>{value}</span>
                                <span>
                                    {settings?.semitones === "true"
                                        ? index
                                        : Interval.fromSemitones(index)}
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
                                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
                                ]);
                            }}
                        >
                            All
                        </Button>
                    )}
                </TabsContent>
            </div>
        </Tabs>
    );
};
