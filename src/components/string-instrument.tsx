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

import * as Tone from "tone";
import { Note, NoteLiteral } from "tonal";
import useWindowDimensions from "../libs/screen-width";
import { Frequency } from "tone/build/esm/core/type/Units";

export const StringInstrument = ({
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
    const { width } = useWindowDimensions();
    const numberOfFretsScreenWidth = width / 80;
    const numberOfFrets = Number.isInteger(maxNumberOfFrets)
        ? numberOfFretsScreenWidth < maxNumberOfFrets!
            ? numberOfFretsScreenWidth
            : maxNumberOfFrets!
        : numberOfFretsScreenWidth;
    return (
        <div className="flex-col w-full">
            <div className="flex flex-row w-full">
                <div className="flex flex-col w-14 shrink-0">
                    {tuning.map((note) => {
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
                                className="h-5 text-xs cursor-pointer flex items-center justify-center select-none"
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
                                <span
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
                                </span>
                            </div>
                        );
                    })}
                </div>
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

            {numberOfFrets > 3 && (
                <div className="flex w-full">
                    {Array.from({ length: numberOfFrets + 1 }, (_, i) => i).map(
                        (index) => (
                            <Dots index={index} />
                        ),
                    )}
                </div>
            )}
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
        <div className="flex flex-col w-full border-l border-white ">
            {tuning.map((note) => (
                <String
                    thisMidi={(Note.midi(note as NoteLiteral) ?? 0) + index + 1}
                    currentMidi={currentMidi}
                    setCurrentMidi={setCurrentMidi}
                    synth={synth}
                    chord={chord}
                />
            ))}
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
            className="w-full h-5 flex items-center justify-center cursor-pointer"
            onMouseEnter={() => {
                setCurrentMidi(thisMidi);
            }}
            onClick={() => {
                synth.triggerAttackRelease(Note.fromMidi(currentMidi), "8n");
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

            <div className="w-full h-px bg-white" />
        </div>
    );
};

const Dots = ({ index }: { index: number }) => {
    return (
        <div
            className={
                "flex justify-center items-center h-5 gap-0.5 " +
                (index === 0 ? "w-14 shrink-0" : "w-full")
            }
        >
            {(index === 1 ||
                (index !== 0 && [0, 3, 5, 7, 9, 12].includes(index % 12))) && (
                <div className="bg-white size-0.5 rounded-full" />
            )}

            {index !== 0 && index % 12 === 0 && (
                <div className="bg-white size-0.5 rounded-full" />
            )}
        </div>
    );
};
