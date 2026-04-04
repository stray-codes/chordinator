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

import { Note } from "tonal";
import { StringInstrumentMobile } from "./string-instrument";
import * as Tone from "tone";
import { PianoMobile } from "./piano";
import { useMemo } from "preact/hooks";
import { useSettings } from "../../libs/settings";

export const StringsPiano = ({
    tuning,
    synth,
    currentMidi,
    setCurrentMidi,
    absoluteInterval,
    maxNumberOfFrets,
    chordName,
    activeInstrument,
    lock,
}: {
    tuning: string[];
    currentMidi: number;
    setCurrentMidi: (value: number) => void;
    synth: Tone.Synth<Tone.SynthOptions>;
    absoluteInterval: number[];
    maxNumberOfFrets: number | undefined;
    chordName: string;
    activeInstrument: "strings" | "piano";
    lock: boolean;
}) => {
    const { settings } = useSettings();
    const screenSpace = useMemo(() => {
        if (settings?.splitMode === "true")
            return activeInstrument === "strings" ? 80 : 50;
        else return activeInstrument === "strings" ? 100 : 0;
    }, [activeInstrument, settings]);
    return (
        <div className="size-full h-full flex flex-col max-h-full grow-0 overflow-hidden">
            <div
                className="flex-1 min-h-0 flex"
                style={{
                    flexDirection:
                        settings?.leftyMode === "true" ? "row" : "row-reverse",
                }}
            >
                <div
                    className="h-full border-x"
                    style={{
                        width: `${screenSpace}%`,
                        display:
                            settings?.splitMode === "false" &&
                            activeInstrument !== "strings"
                                ? "none"
                                : undefined,
                    }}
                >
                    <StringInstrumentMobile
                        tuning={tuning}
                        synth={synth}
                        currentMidi={currentMidi}
                        setCurrentMidi={setCurrentMidi}
                        absoluteInterval={absoluteInterval}
                        maxNumberOfFrets={maxNumberOfFrets}
                        lock={lock}
                    />
                </div>
                <div
                    className="h-full border-x"
                    style={{
                        rotate:
                            settings?.leftyMode === "true" ? "180deg" : "0deg",
                        width: `${100 - screenSpace}%`,
                        display:
                            settings?.splitMode === "false" &&
                            activeInstrument !== "piano"
                                ? "none"
                                : undefined,
                    }}
                >
                    <PianoMobile
                        synth={synth}
                        currentMidi={currentMidi}
                        setCurrentMidi={setCurrentMidi}
                        absoluteInterval={absoluteInterval}
                        lock={lock}
                    />
                </div>
            </div>
            <div className="h-fit flex justify-between w-full px-2 py-1 border-t gap-4">
                <span className="text-cyan-300">
                    {Note.fromMidi(currentMidi)}
                </span>
                <span className="text-yellow-300 truncate">{chordName}</span>
            </div>
        </div>
    );
};
