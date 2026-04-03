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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { instruments } from "../../../data/instruments";
import { useLocalStorage } from "../../libs/local-storage";

export const InstrumentSelectMobile = ({
    tuning,
    setTuning,
    maxNumberOfFrets,
    setMaxNumberOfFrets,
}: {
    tuning: string[];
    setTuning: (value: string[]) => void;
    maxNumberOfFrets: number | undefined;
    setMaxNumberOfFrets: (value: number | undefined) => void;
}) => {
    const [strings, setStrings] = useState([...tuning].reverse().join(", "));
    const { saveSetting } = useLocalStorage();

    const [searchFilter, setSearchFilter] = useState("");

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
        <div className="flex flex-col items-center justify-center size-full overflow-hidden">
            <Input
                value={strings}
                className="text-cyan-300"
                onChange={(e) => {
                    setStrings(e.currentTarget.value);
                }}
            />

            <Input
                onChange={(e) => setSearchFilter(e.currentTarget.value)}
                value={searchFilter}
                placeholder="Search..."
                className="text-xs"
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
                        <Button
                            className="flex justify-between w-full gap-4 text-xs"
                            variant="outline"
                            style={{
                                color:
                                    strings === instrument.strings
                                        ? "#1ffffe"
                                        : undefined,
                            }}
                            onClick={() => {
                                setStrings(instrument.strings);
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
                    ))}
            </div>
            <Input
                type="number"
                min={0}
                step={1}
                className="w-full text-xs h-7"
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
        </div>
    );
};
