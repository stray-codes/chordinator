/*
Chordinator: A tool to visualize sequences, chords and intervals of string instruments.
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

import { useMemo, useState } from "preact/hooks";
import * as Tone from "tone";
import { Note } from "tonal";
import { StringInstrument } from "./components/string-instrument";
import { Piano } from "./components/piano";
import useWindowDimensions from "./libs/screen-width";
import { MadeBy } from "./components/made-by";
import { InstrumentSelect } from "./components/instrument-select";
import { ChordSequenceSelect } from "./components/chord-sequence-select";
import { Toaster } from "sonner";

export const Main = () => {
    const [currentMidi, setCurrentMidi] = useState<number>(
        Note.midi("C2") ?? 0,
    );
    const currentNote = useMemo(
        () => Note.fromMidi(currentMidi),
        [currentMidi],
    );

    const [tuning, setTuning] = useState(["E1", "A1", "D2", "G2"].reverse());
    const [maxNumberOfFrets, setMaxNumberOfFrets] = useState<
        number | undefined
    >();

    const [chord, setChord] = useState<number[]>([]);
    const [chordName, setChordName] = useState<string>("-");

    const { width } = useWindowDimensions();

    const synth = useMemo(() => new Tone.Synth().toDestination(), []);

    if (width < 540)
        return (
            <div className="size-full flex items-center justify-center text-xs">
                <span>Mobile Version coming soon.</span>
            </div>
        );

    return (
        <div>
            <div className="flex flex-col gap-4 h-vh items-center justify-between px-4 pb-4 min-h-screen bg-[#0c0c0c]">
                <Piano
                    synth={synth}
                    currentMidi={currentMidi}
                    setCurrentMidi={setCurrentMidi}
                    chord={chord}
                />

                <div className="flex flex-col items-center justify-center gap-1">
                    <span className="text-3xl">
                        {Note.enharmonic(currentNote) !== currentNote &&
                            `${Note.enharmonic(currentNote)} / `}
                        {currentNote}
                    </span>
                    <span className="text-xs">
                        {Note.freq(currentNote)?.toFixed(1)}hz
                    </span>
                    <span className="text-yellow-300">{chordName}</span>
                </div>
                <StringInstrument
                    tuning={tuning}
                    currentMidi={currentMidi}
                    setCurrentMidi={setCurrentMidi}
                    synth={synth}
                    chord={chord}
                    maxNumberOfFrets={maxNumberOfFrets}
                />
                <div className="flex flex-row justify-between items-end gap-2 w-full flex-wrap">
                    <ChordSequenceSelect
                        setChord={setChord}
                        setChordName={setChordName}
                        currentNote={currentNote}
                    />

                    {width > 1300 && <MadeBy />}

                    <InstrumentSelect
                        setTuning={setTuning}
                        maxNumberOfFrets={maxNumberOfFrets}
                        setMaxNumberOfFrets={setMaxNumberOfFrets}
                    />
                </div>
                {width <= 1300 && <MadeBy />}
            </div>

            <Toaster
                position="top-right"
                duration={10000}
                toastOptions={{
                    style: {
                        background: "#0c0c0c",
                        color: "white",
                        fontSize: "0.6rem",
                    },
                    classNames: {
                        toast: "!border-secondary",
                        title: "!text-yellow-400",
                        description: "!text-white/80",
                    },
                }}
            />
        </div>
    );
};
