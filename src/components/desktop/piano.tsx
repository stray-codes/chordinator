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
import useWindowDimensions from "../../libs/screen-width";
import { getNoteColor } from "../../libs/utils";

export const Piano = ({
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
    const { width } = useWindowDimensions();
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: Math.min(width / 220, 10) }, (_, i) => i).map(
                (index) => (
                    <Octave
                        index={index}
                        synth={synth}
                        currentMidi={currentMidi}
                        setCurrentMidi={setCurrentMidi}
                        absoluteInterval={absoluteInterval}
                        lock={lock}
                    />
                ),
            )}
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
        <div className="flex relative">
            <div className="flex gap-0.5">
                {["C", "D", "E", "F", "G", "A", "B"].map((note) => (
                    <WhiteKey {...props} note={note} />
                ))}
            </div>
            <div className="flex gap-1.5 absolute ml-2.75">
                {["Db", "Eb"].map((note) => (
                    <BlackKey {...props} note={note} />
                ))}
            </div>
            <div className="flex gap-1.5 absolute ml-16.25">
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
            className="h-12 w-3 bg-black flex items-end pb-2 justify-center cursor-pointer"
            onClick={() => {
                synth.triggerAttackRelease(thisNote, "8n");
                setCurrentMidi(thisMidi);
            }}
            onMouseEnter={() => {
                setCurrentMidi(thisMidi);
            }}
        >
            <div className="size-2 rounded-full absolute" style={noteColor} />
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
            className="h-20 w-4 bg-white/40 flex items-end pb-2 justify-center cursor-pointer"
            onClick={() => {
                synth.triggerAttackRelease(thisNote, "8n");
                setCurrentMidi(thisMidi);
            }}
            onMouseEnter={() => {
                setCurrentMidi(thisMidi);
            }}
        >
            <div className="size-2 rounded-full absolute" style={noteColor} />
        </div>
    );
};
