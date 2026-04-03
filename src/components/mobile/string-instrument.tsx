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

import * as Tone from "tone";
import { Note, NoteLiteral } from "tonal";
import { Frequency } from "tone/build/esm/core/type/Units";

export const StringInstrumentMobile = ({
    tuning,
    synth,
    currentMidi,
    setCurrentMidi,
    chord,
    maxNumberOfFrets,
}: {
    tuning: string[];
    currentMidi: number;
    setCurrentMidi: (value: number) => void;
    synth: Tone.Synth<Tone.SynthOptions>;
    chord: number[];
    maxNumberOfFrets: number | undefined;
}) => {
    const fullNumberOfFrets = 40;
    const numberOfFrets = Number.isNaN(Number(maxNumberOfFrets))
        ? fullNumberOfFrets
        : Math.min(maxNumberOfFrets!, fullNumberOfFrets);
    return (
        <div className="flex flex-col size-full pr-3 overflow-x-scroll">
            <div
                className="flex flex-col flex-1 min-h-0"
                style={{ minWidth: tuning.length * 18.75 + 20 + "px" }}
            >
                <div className="flex flex-1 max-h-10 flex-row h-10 pl-4">
                    {[...tuning].reverse().map((note) => {
                        const thisMidi = Note.midi(note as NoteLiteral) ?? 0;
                        const isCurrentNote = currentMidi === thisMidi;
                        const isCurrentNoteOctaved =
                            thisMidi % 12 === currentMidi % 12 &&
                            !isCurrentNote;

                        const isChord = chord.includes(thisMidi);
                        const isChordOctaved =
                            chord
                                .map((note) => note % 12)
                                .includes(thisMidi % 12) && !isChord;

                        return (
                            <div
                                className="text-xs cursor-pointer flex flex-1 items-center justify-center select-none min-w-3"
                                onMouseEnter={() => {
                                    setCurrentMidi(thisMidi);
                                }}
                                onClick={() => {
                                    synth.triggerAttackRelease(
                                        note as Frequency,
                                        "8n",
                                    );
                                    setCurrentMidi(thisMidi);
                                }}
                            >
                                <div
                                    className="text-center text-xs [writing-mode:vertical-rl]"
                                    style={{
                                        color:
                                            isChord || isChordOctaved
                                                ? "#fdc700"
                                                : isCurrentNote ||
                                                    isCurrentNoteOctaved
                                                  ? "#00d3f2"
                                                  : undefined,
                                        opacity:
                                            isChordOctaved ||
                                            isCurrentNoteOctaved
                                                ? 0.6
                                                : undefined,
                                    }}
                                >
                                    {note}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="overflow-y-scroll overflow-x-hidden no-scrollbar flex flex-1 min-h-0 flex-col">
                    {Array.from({ length: numberOfFrets }, (_, i) => i).map(
                        (index) => {
                            return (
                                <Fret
                                    index={index}
                                    tuning={tuning}
                                    currentMidi={currentMidi}
                                    setCurrentMidi={setCurrentMidi}
                                    synth={synth}
                                    chord={chord}
                                />
                            );
                        },
                    )}
                    {numberOfFrets === 0 && (
                        <Fret
                            index={-1}
                            tuning={tuning}
                            currentMidi={currentMidi}
                            setCurrentMidi={setCurrentMidi}
                            synth={synth}
                            chord={chord}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

const Fret = ({
    index,
    tuning,
    currentMidi,
    setCurrentMidi,
    synth,
    chord,
}: {
    index: number;
    tuning: string[];
    currentMidi: number;
    setCurrentMidi: (value: number) => void;
    synth: Tone.Synth<Tone.SynthOptions>;
    chord: number[];
}) => {
    return (
        <div className="flex grow min-h-10">
            <Dots index={index + 1} />
            <div className="flex flex-row w-full border-t border-white ">
                {[...tuning].reverse().map((note) => (
                    <String
                        thisMidi={
                            (Note.midi(note as NoteLiteral) ?? 0) + index + 1
                        }
                        currentMidi={currentMidi}
                        setCurrentMidi={setCurrentMidi}
                        synth={synth}
                        chord={chord}
                    />
                ))}
            </div>
        </div>
    );
};

const String = ({
    thisMidi,
    currentMidi,
    setCurrentMidi,
    synth,
    chord,
}: {
    thisMidi: number;
    currentMidi: number;
    setCurrentMidi: (value: number) => void;
    synth: Tone.Synth<Tone.SynthOptions>;
    chord: number[];
}) => {
    const isChord = chord.includes(thisMidi);
    const isChordOctaved = chord
        .map((item) => item % 12)
        .includes(thisMidi % 12);
    return (
        <div
            className="relative w-full min-w-3 h-full flex items-center justify-center cursor-pointer"
            onMouseEnter={() => {
                setCurrentMidi(thisMidi);
            }}
            onClick={() => {
                synth.triggerAttackRelease(Note.fromMidi(thisMidi), "8n");
                setCurrentMidi(thisMidi);
            }}
        >
            {!isChordOctaved && (
                <div
                    className="rounded-full size-2 bg-cyan-400/40 absolute"
                    style={{
                        visibility:
                            Note.pitchClass(Note.fromMidi(currentMidi)) ===
                            Note.pitchClass(Note.fromMidi(thisMidi))
                                ? "visible"
                                : "hidden",
                    }}
                />
            )}
            <div
                className="rounded-full size-2 bg-cyan-400 absolute"
                style={{
                    visibility: currentMidi === thisMidi ? "visible" : "hidden",
                }}
            />
            {isChord && (
                <div className="size-2 rounded-full bg-yellow-400 absolute" />
            )}
            {isChordOctaved && (
                <div className="size-2 rounded-full bg-yellow-400/50 absolute" />
            )}

            <div className="h-full w-0.5 bg-white" />
        </div>
    );
};

const Dots = ({ index }: { index: number }) => {
    return (
        <div
            className={
                "flex flex-col justify-center items-center gap-0.5 w-4 shrink-0"
            }
        >
            {(index === 1 ||
                (index !== 0 && [0, 3, 5, 7, 9, 12].includes(index % 12))) && (
                <div className="bg-white size-0.5 rounded-full" />
            )}

            {index !== 0 && index % 12 === 0 && (
                <div className="bg-white size-0.5 rounded-full" />
            )}

            {(index === 0 ||
                (index !== 1 && ![0, 3, 5, 7, 9, 12].includes(index % 12))) && (
                <span className="[writing-mode:vertical-rl] text-xs opacity-50 select-none">
                    {index}
                </span>
            )}
        </div>
    );
};
