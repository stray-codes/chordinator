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

import { useEffect, useState } from "preact/hooks";
import { Note } from "tonal";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Input } from "../ui/input";
import { PlusCircle } from "lucide-preact";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { instruments } from "../../../data/instruments";
import { useSettings } from "../../libs/settings";

export const InstrumentSelect = ({
    strings,
    setStrings,
    stringGroup,
    setStringGroup,
    setTuning,
    maxNumberOfFrets,
    setMaxNumberOfFrets,
}: {
    strings: string;
    setStrings: (value: string) => void;
    stringGroup: string;
    setStringGroup: (value: string) => void;
    setTuning: (value: string[]) => void;
    maxNumberOfFrets: number | undefined;
    setMaxNumberOfFrets: (value: number | undefined) => void;
}) => {
    const [searchFilter, setSearchFilter] = useState("");
    const { saveSetting } = useSettings();

    useEffect(() => saveSetting("stringGroup", stringGroup), [stringGroup]);
    useEffect(
        () => saveSetting("maxNumberOfFrets", String(maxNumberOfFrets)),
        [maxNumberOfFrets],
    );

    useEffect(() => {
        let tmp = strings.split(/,\s*/);
        tmp = tmp.map((item) => {
            const simplifiedNote = Note.simplify(item);
            const octave = Note.octave(simplifiedNote);
            if (!octave && octave !== 0) {
                const chroma = Note.chroma(simplifiedNote);
                return Note.fromMidi(36 + chroma);
            }
            return simplifiedNote;
        });
        for (const item of tmp) {
            if (item.length === 0) return;
        }

        saveSetting("tuning", tmp.join(", "));
        setTuning(tmp.reverse());
    }, [strings]);

    return (
        <div className="border p-2 flex flex-col items-center justify-center gap-2 w-full lg:w-fit">
            <div className="w-full flex justify-between">
                <Input
                    type="number"
                    min={0}
                    step={1}
                    className="max-w-21 text-xs h-5"
                    placeholder="Frets"
                    value={maxNumberOfFrets ?? ""}
                    onChange={(e) => {
                        const value = e.currentTarget.value;
                        if (value.length === 0) {
                            setMaxNumberOfFrets(undefined);
                            return;
                        }
                        const parsedValue = Number(value);
                        if (!Number.isInteger(parsedValue)) {
                            setMaxNumberOfFrets(undefined);
                            return;
                        }
                        setMaxNumberOfFrets(parsedValue);
                    }}
                />
                <Dialog>
                    <DialogTrigger className="hover:text-cyan-300">
                        <PlusCircle />
                    </DialogTrigger>

                    <DialogContent className="h-9/10 flex flex-col items-start">
                        <DialogTitle>Instruments</DialogTitle>
                        <Input
                            onChange={(e) =>
                                setSearchFilter(e.currentTarget.value)
                            }
                            value={searchFilter}
                            placeholder="Search..."
                        />
                        <div className="flex flex-col h-full w-full overflow-scroll">
                            {instruments
                                .filter((instrument) =>
                                    instrument.label
                                        .toLocaleLowerCase()
                                        .replace(/\s+/g, "")
                                        .includes(
                                            searchFilter
                                                .toLocaleLowerCase()
                                                .replace(/\s+/g, ""),
                                        ),
                                )
                                .map((instrument) => (
                                    <DialogClose asChild>
                                        <Button
                                            className="flex justify-between w-full gap-4"
                                            variant="outline"
                                            style={{
                                                color:
                                                    strings ===
                                                    instrument.strings
                                                        ? "#1ffffe"
                                                        : undefined,
                                            }}
                                            onClick={() => {
                                                setStrings(instrument.strings);
                                                setStringGroup(
                                                    instrument.group ??
                                                        "custom",
                                                );
                                                setMaxNumberOfFrets(
                                                    instrument.maxNumberOfFrets,
                                                );
                                            }}
                                        >
                                            <span>{instrument.label}</span>
                                            <span className="truncate">
                                                {instrument.strings}
                                            </span>
                                        </Button>
                                    </DialogClose>
                                ))}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <ToggleGroup
                type="single"
                value={stringGroup}
                onValueChange={(value) => {
                    if (value) {
                        setStringGroup(value);
                        switch (value) {
                            case "guitar":
                                setStrings("E2, A2, D3, G3, B3, E4");
                                setMaxNumberOfFrets(undefined);
                                break;
                            case "bass":
                                setStrings("E1, A1, D2, G2");
                                setMaxNumberOfFrets(undefined);
                                break;
                            case "violin":
                                setStrings("G3, D4, A4, E5");
                                setMaxNumberOfFrets(undefined);
                                break;
                            case "cello":
                                setStrings("C2, G2, D3, A3");
                                setMaxNumberOfFrets(undefined);
                                break;
                        }
                    }
                }}
            >
                <ToggleGroupItem value="guitar">Guitar</ToggleGroupItem>
                <ToggleGroupItem value="bass">Bass</ToggleGroupItem>
                <ToggleGroupItem value="violin">Violin</ToggleGroupItem>
                <ToggleGroupItem value="cello">Cello</ToggleGroupItem>
                <ToggleGroupItem value="custom">Custom</ToggleGroupItem>
            </ToggleGroup>
            <Input
                value={strings}
                onChange={(e) => {
                    setStringGroup("custom");
                    setStrings(e.currentTarget.value);
                }}
            />
        </div>
    );
};
