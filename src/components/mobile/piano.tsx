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
import { Note } from "tonal";

export const PianoMobile = ({
    synth,
    currentMidi,
    setCurrentMidi,
    chord,
}: {
    currentMidi: number;
    setCurrentMidi: (value: number) => void;
    synth: Tone.Synth<Tone.SynthOptions>;
    chord: number[];
}) => {
    return (
        <div className="flex flex-col w-full h-full gap-0.5 overflow-x-scroll no-scrollbar">
            {Array.from({ length: 10 }, (_, i) => i).map((index) => (
                <Octave
                    index={index}
                    synth={synth}
                    currentMidi={currentMidi}
                    setCurrentMidi={setCurrentMidi}
                    chord={chord}
                />
            ))}
        </div>
    );
};

const Octave = ({
    index,
    currentMidi,
    setCurrentMidi,
    synth,
    chord,
}: {
    index: number;
    currentMidi: number;
    setCurrentMidi: (value: number) => void;
    synth: Tone.Synth<Tone.SynthOptions>;
    chord: number[];
}) => {
    return (
        <div className="flex flex-col w-full relative">
            <div className="flex flex-col w-full gap-0.5">
                <WhiteKey
                    index={index}
                    note="C"
                    currentMidi={currentMidi}
                    setCurrentMidi={setCurrentMidi}
                    synth={synth}
                    chord={chord}
                />
                <WhiteKey
                    index={index}
                    note={"D"}
                    currentMidi={currentMidi}
                    setCurrentMidi={setCurrentMidi}
                    synth={synth}
                    chord={chord}
                />
                <WhiteKey
                    index={index}
                    note={"E"}
                    currentMidi={currentMidi}
                    setCurrentMidi={setCurrentMidi}
                    synth={synth}
                    chord={chord}
                />
                <WhiteKey
                    index={index}
                    note={"F"}
                    currentMidi={currentMidi}
                    setCurrentMidi={setCurrentMidi}
                    synth={synth}
                    chord={chord}
                />
                <WhiteKey
                    index={index}
                    note={"G"}
                    currentMidi={currentMidi}
                    setCurrentMidi={setCurrentMidi}
                    synth={synth}
                    chord={chord}
                />
                <WhiteKey
                    index={index}
                    note={"A"}
                    currentMidi={currentMidi}
                    setCurrentMidi={setCurrentMidi}
                    synth={synth}
                    chord={chord}
                />
                <WhiteKey
                    index={index}
                    note={"B"}
                    currentMidi={currentMidi}
                    setCurrentMidi={setCurrentMidi}
                    synth={synth}
                    chord={chord}
                />
            </div>
            <div className="flex flex-col items-end w-1/2 right-0 gap-2.5 absolute mt-5.75">
                <BlackKey
                    index={index}
                    note="Db"
                    currentMidi={currentMidi}
                    setCurrentMidi={setCurrentMidi}
                    synth={synth}
                    chord={chord}
                />
                <BlackKey
                    index={index}
                    note="Eb"
                    currentMidi={currentMidi}
                    setCurrentMidi={setCurrentMidi}
                    synth={synth}
                    chord={chord}
                />
            </div>
            <div className="flex flex-col items-end w-1/2 right-0 gap-2.5 absolute mt-34.25">
                <BlackKey
                    index={index}
                    note="Gb"
                    currentMidi={currentMidi}
                    setCurrentMidi={setCurrentMidi}
                    synth={synth}
                    chord={chord}
                />
                <BlackKey
                    index={index}
                    note="Ab"
                    currentMidi={currentMidi}
                    setCurrentMidi={setCurrentMidi}
                    synth={synth}
                    chord={chord}
                />
                <BlackKey
                    index={index}
                    note="Bb"
                    currentMidi={currentMidi}
                    setCurrentMidi={setCurrentMidi}
                    synth={synth}
                    chord={chord}
                />
            </div>
        </div>
    );
};

const BlackKey = ({
    index,
    note,
    currentMidi,
    setCurrentMidi,
    synth,
    chord,
}: {
    index: number;
    note: string;
    currentMidi: number;
    setCurrentMidi: (value: number) => void;
    synth: Tone.Synth<Tone.SynthOptions>;
    chord: number[];
}) => {
    const thisMidi = (Note.midi(note + "0") ?? 0) + 12 * index;
    const thisNote = Note.fromMidi(thisMidi);

    const isChord = chord.includes(thisMidi);
    const isChordOctaved = chord
        .map((item) => item % 12)
        .includes(thisMidi % 12);

    return (
        <div
            className="h-7 w-full bg-black flex items-center justify-center cursor-pointer"
            onClick={() => {
                synth.triggerAttackRelease(thisNote, "8n");
                setCurrentMidi(thisMidi);
            }}
            onMouseEnter={() => {
                setCurrentMidi(thisMidi);
            }}
        >
            {!isChordOctaved && currentMidi === thisMidi && (
                <div className="size-2 rounded-full bg-cyan-400 absolute" />
            )}
            {!isChordOctaved &&
                Note.pitchClass(Note.fromMidi(currentMidi)) ===
                    Note.pitchClass(Note.fromMidi(thisMidi)) && (
                    <div className="size-2 rounded-full bg-cyan-400/40 absolute" />
                )}
            {isChord && (
                <div className="size-2 rounded-full bg-yellow-400 absolute" />
            )}
            {isChordOctaved && (
                <div className="size-2 rounded-full bg-yellow-400/30 absolute" />
            )}
        </div>
    );
};

const WhiteKey = ({
    index,
    note,
    currentMidi,
    setCurrentMidi,
    synth,
    chord,
}: {
    index: number;
    note: string;
    currentMidi: number;
    setCurrentMidi: (value: number) => void;
    synth: Tone.Synth<Tone.SynthOptions>;
    chord: number[];
}) => {
    const thisMidi = (Note.midi(note + "0") ?? 0) + 12 * index;
    const thisNote = Note.fromMidi(thisMidi);

    const isChord = chord.includes(thisMidi);
    const isChordOctaved = chord
        .map((item) => item % 12)
        .includes(thisMidi % 12);

    return (
        <div
            className="h-9 w-full bg-white/40 flex items-center justify-start cursor-pointer"
            onClick={() => {
                synth.triggerAttackRelease(thisNote, "8n");
                setCurrentMidi(thisMidi);
            }}
            onMouseEnter={() => {
                setCurrentMidi(thisMidi);
            }}
        >
            {thisMidi % 12 === 0 ? (
                <div className="h-full w-1/2 flex items-center justify-center *:select-none">
                    <div className="[writing-mode:vertical-rl] absolute">
                        {thisNote}
                    </div>
                    {!isChordOctaved && currentMidi === thisMidi && (
                        <div className="[writing-mode:vertical-rl] text-cyan-400 absolute">
                            {thisNote}
                        </div>
                    )}

                    {!isChordOctaved &&
                        Note.pitchClass(Note.fromMidi(currentMidi)) ===
                            Note.pitchClass(Note.fromMidi(thisMidi)) && (
                            <div className="[writing-mode:vertical-rl] text-cyan-400/40 absolute">
                                {thisNote}
                            </div>
                        )}
                    {isChord && (
                        <div className="[writing-mode:vertical-rl] text-yellow-400 absolute">
                            {thisNote}
                        </div>
                    )}
                    {isChordOctaved && (
                        <div className="[writing-mode:vertical-rl] text-yellow-400/30 absolute">
                            {thisNote}
                        </div>
                    )}
                </div>
            ) : (
                <div className="h-full w-1/2 flex items-center justify-center">
                    {!isChordOctaved && currentMidi === thisMidi && (
                        <div className="size-2 rounded-full bg-cyan-400 absolute" />
                    )}

                    {!isChordOctaved &&
                        Note.pitchClass(Note.fromMidi(currentMidi)) ===
                            Note.pitchClass(Note.fromMidi(thisMidi)) && (
                            <div className="size-2 rounded-full bg-cyan-400/40 absolute" />
                        )}
                    {isChord && (
                        <div className="size-2 rounded-full bg-yellow-400 absolute" />
                    )}
                    {isChordOctaved && (
                        <div className="size-2 rounded-full bg-yellow-400/30 absolute" />
                    )}
                </div>
            )}
        </div>
    );
};
