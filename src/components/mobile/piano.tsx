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
import { Note } from "tonal";
import { getNoteColor } from "../../libs/utils";

export const PianoMobile = ({
    synth,
    currentMidi,
    setCurrentMidi,
    absoluteInterval,
    lock,
}: {
    currentMidi: number;
    setCurrentMidi: (value: number) => void;
    synth: Tone.Synth<Tone.SynthOptions>;
    absoluteInterval: number[];
    lock: boolean;
}) => {
    return (
        <div className="flex flex-col w-full h-full gap-0.5 overflow-x-scroll no-scrollbar">
            {Array.from({ length: 10 }, (_, i) => i).map((index) => (
                <Octave
                    index={index}
                    synth={synth}
                    currentMidi={currentMidi}
                    setCurrentMidi={setCurrentMidi}
                    absoluteInterval={absoluteInterval}
                    lock={lock}
                />
            ))}
        </div>
    );
};

const Octave = (props: {
    index: number;
    currentMidi: number;
    setCurrentMidi: (value: number) => void;
    synth: Tone.Synth<Tone.SynthOptions>;
    absoluteInterval: number[];
    lock: boolean;
}) => {
    return (
        <div className="flex flex-col w-full relative">
            <div className="flex flex-col w-full gap-0.5">
                {["C", "D", "E", "F", "G", "A", "B"].map((note) => (
                    <WhiteKey {...props} note={note} />
                ))}
            </div>
            <div className="flex flex-col items-end w-1/2 right-0 gap-2.5 absolute mt-4.25">
                {["Db", "Eb"].map((note) => (
                    <BlackKey {...props} note={note} />
                ))}
            </div>
            <div className="flex flex-col items-end w-1/2 right-0 gap-2.5 absolute mt-23.75">
                {["Gb", "Ab", "Bb"].map((note) => (
                    <BlackKey {...props} note={note} />
                ))}
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
    absoluteInterval,
    lock,
}: {
    index: number;
    note: string;
    currentMidi: number;
    setCurrentMidi: (value: number) => void;
    synth: Tone.Synth<Tone.SynthOptions>;
    absoluteInterval: number[];
    lock: boolean;
}) => {
    const thisMidi = (Note.midi(note + "0") ?? 0) + 12 * index;
    const thisNote = Note.fromMidi(thisMidi);

    const noteColor = getNoteColor(
        thisMidi,
        lock,
        currentMidi,
        absoluteInterval,
    );

    return (
        <div
            className="h-4 w-full bg-black flex items-center justify-center cursor-pointer select-none"
            onClick={() => {
                synth.triggerAttackRelease(thisNote, "8n");
                setCurrentMidi(thisMidi);
            }}
            onMouseEnter={() => {
                setCurrentMidi(thisMidi);
            }}
        >
            <div
                className="size-2 rounded-full bg-cyan-400 absolute select-none"
                style={noteColor}
            />
        </div>
    );
};

const WhiteKey = ({
    index,
    note,
    currentMidi,
    setCurrentMidi,
    synth,
    absoluteInterval,
    lock,
}: {
    index: number;
    note: string;
    currentMidi: number;
    setCurrentMidi: (value: number) => void;
    synth: Tone.Synth<Tone.SynthOptions>;
    absoluteInterval: number[];
    lock: boolean;
}) => {
    const thisMidi = (Note.midi(note + "0") ?? 0) + 12 * index;
    const thisNote = Note.fromMidi(thisMidi);
    const noteColor = getNoteColor(
        thisMidi,
        lock,
        currentMidi,
        absoluteInterval,
    );

    return (
        <div
            className="h-6 w-full bg-white/40 flex items-center justify-start cursor-pointer select-none"
            onClick={() => {
                synth.triggerAttackRelease(thisNote, "8n");
                setCurrentMidi(thisMidi);
            }}
            onMouseEnter={() => {
                setCurrentMidi(thisMidi);
            }}
        >
            <div className="h-full w-1/2 flex items-center justify-center select-none">
                {thisMidi % 12 === 0 ? (
                    <div
                        className="[writing-mode:vertical-rl] absolute select-none"
                        style={{
                            color: noteColor.background,
                            opacity: noteColor.background && noteColor.opacity,
                        }}
                    >
                        {thisNote}
                    </div>
                ) : (
                    <div
                        className="size-2 rounded-full absolute select-none"
                        style={noteColor}
                    />
                )}
            </div>
        </div>
    );
};
