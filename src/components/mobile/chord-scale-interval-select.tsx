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

export const ChordScaleIntervalSelectMobile = ({
    relativeIntervalsString,
    setRelativeIntervalsString,
    relativeIntervals,
    setRelativeIntervals,
}: {
    relativeIntervalsString: string;
    setRelativeIntervalsString: (value: string) => void;
    relativeIntervals: number[];
    setRelativeIntervals: (value: number[]) => void;
}) => {
    const [search, setSearch] = useState("");

    return (
        <Tabs
            defaultValue="intervals"
            className="size-full flex flex-col gap-0 overflow-x-hidden"
        >
            <Input
                value={relativeIntervalsString}
                className="text-yellow-300"
                onChange={(e) => {
                    setRelativeIntervalsString(e.currentTarget.value);
                }}
            />
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
                                        setRelativeIntervalsString(
                                            chord.intervals,
                                        );
                                    }}
                                    style={{
                                        color:
                                            relativeIntervalsString ===
                                            chord.intervals
                                                ? "#fdc700"
                                                : undefined,
                                    }}
                                >
                                    <span>{chord.label}</span>
                                    <span className="truncate">
                                        {chord.intervals}
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
                                    }}
                                >
                                    <span>{scale.label}</span>
                                    <span className="truncate">
                                        {scale.intervals}
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
                        className="flex flex-col w-full h-full overflow-scroll *:hover:bg-transparent *:data-[state=on]:bg-transparent *:w-full *:data-[state=on]:text-yellow-300  *:text-xs *:border-t"
                        value={relativeIntervals.map((item) => String(item))}
                        onValueChange={(value) => {
                            const newChordInput = value
                                .sort((a, b) => Number(a) - Number(b))
                                .join(", ");
                            setRelativeIntervalsString(newChordInput);
                            // updateIntervals(newChordInput); TODO
                            setRelativeIntervals(
                                value.map((item) => Number(item)),
                            );
                        }}
                    >
                        <ToggleGroupItem value="0">Unison</ToggleGroupItem>
                        <ToggleGroupItem value="1">
                            Minor Second
                        </ToggleGroupItem>
                        <ToggleGroupItem value="2">
                            Major Second
                        </ToggleGroupItem>
                        <ToggleGroupItem value="3">Minor Third</ToggleGroupItem>
                        <ToggleGroupItem value="4">Major Third</ToggleGroupItem>
                        <ToggleGroupItem value="5">
                            Perfect Fourth
                        </ToggleGroupItem>
                        <ToggleGroupItem value="6">
                            Augmented Fourth
                        </ToggleGroupItem>
                        <ToggleGroupItem value="7">
                            Perfect Fifth
                        </ToggleGroupItem>
                        <ToggleGroupItem value="8">Minor Sixth</ToggleGroupItem>
                        <ToggleGroupItem value="9">Major Sixth</ToggleGroupItem>
                        <ToggleGroupItem value="10">
                            Minor Seventh
                        </ToggleGroupItem>
                        <ToggleGroupItem value="11">
                            Major Seventh
                        </ToggleGroupItem>
                        <ToggleGroupItem value="12">Octave</ToggleGroupItem>
                    </ToggleGroup>
                    {relativeIntervalsString.length > 0 ? (
                        <Button
                            variant="outline"
                            onClick={() => {
                                setRelativeIntervalsString("");
                                setRelativeIntervals([]);
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
