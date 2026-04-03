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
import { useSettings } from "../../libs/settings";
import { getNoteColor } from "../../libs/utils";

export const StringInstrumentMobile = ({
    tuning,
    synth,
    currentMidi,
    setCurrentMidi,
    absoluteInterval,
    maxNumberOfFrets,
    lock,
}: {
    tuning: string[];
    currentMidi: number;
    setCurrentMidi: (value: number) => void;
    synth: Tone.Synth<Tone.SynthOptions>;
    absoluteInterval: number[];
    maxNumberOfFrets: number | undefined;
    lock: boolean;
}) => {
    const { settings } = useSettings();
    const fullNumberOfFrets = 45;
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
                    {(settings?.leftyMode === "true"
                        ? [...tuning]
                        : [...tuning].reverse()
                    ).map((note) => {
                        const thisMidi = Note.midi(note as NoteLiteral) ?? 0;
                        const noteColor = getNoteColor(
                            thisMidi,
                            lock,
                            currentMidi,
                            absoluteInterval,
                        );

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
                                        rotate:
                                            settings?.leftyMode === "true"
                                                ? "180deg"
                                                : "0deg",
                                        color: noteColor.background,
                                        opacity:
                                            noteColor.background &&
                                            noteColor.opacity,
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
                                    absoluteInterval={absoluteInterval}
                                    lock={lock}
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
                            absoluteInterval={absoluteInterval}
                            lock={lock}
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
    absoluteInterval,
    lock,
}: {
    index: number;
    tuning: string[];
    currentMidi: number;
    setCurrentMidi: (value: number) => void;
    synth: Tone.Synth<Tone.SynthOptions>;
    absoluteInterval: number[];
    lock: boolean;
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
                        absoluteInterval={absoluteInterval}
                        lock={lock}
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
    absoluteInterval,
    lock,
}: {
    thisMidi: number;
    currentMidi: number;
    setCurrentMidi: (value: number) => void;
    synth: Tone.Synth<Tone.SynthOptions>;
    absoluteInterval: number[];
    lock: boolean;
}) => {
    const noteColor = getNoteColor(
        thisMidi,
        lock,
        currentMidi,
        absoluteInterval,
    );

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
            <div className="rounded-full size-2 absolute" style={noteColor} />
            <div className="h-full w-0.5 bg-white" />
        </div>
    );
};

const Dots = ({ index }: { index: number }) => {
    const { settings } = useSettings();
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
                <span
                    className="[writing-mode:vertical-rl] text-xs opacity-50 select-none"
                    style={{
                        rotate:
                            settings?.leftyMode === "true" ? "180deg" : "0deg",
                    }}
                >
                    {index}
                </span>
            )}
        </div>
    );
};
