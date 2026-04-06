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
import useWindowDimensions from "../../libs/screen-width";
import { Frequency } from "tone/build/esm/core/type/Units";
import { getNoteColor } from "../../libs/utils";
import { Settings } from "../../libs/settings";

export const StringInstrument = ({
    tuning,
    synth,
    currentMidi,
    setCurrentMidi,
    absoluteInterval,
    maxNumberOfFrets,
    lock,
    settings,
}: {
    tuning: string[];
    currentMidi: number;
    setCurrentMidi: (value: number) => void;
    synth: Tone.Synth<Tone.SynthOptions>;
    absoluteInterval: number[];
    maxNumberOfFrets: number | undefined;
    lock: boolean;
    settings: Settings;
}) => {
    const { width } = useWindowDimensions();
    const numberOfFretsScreenWidth = Math.min(width / 80, 45);
    const numberOfFrets = Number.isInteger(maxNumberOfFrets)
        ? Math.min(numberOfFretsScreenWidth, maxNumberOfFrets!)
        : numberOfFretsScreenWidth;
    return (
        <div className="flex-col w-full">
            <div
                className="flex flex-row w-full"
                style={{
                    flexDirection:
                        settings.leftyMode === "true" ? "row-reverse" : "row",
                }}
            >
                <div className="flex flex-col w-14 shrink-0">
                    {tuning.map((note) => {
                        const thisMidi = Note.midi(note as NoteLiteral) ?? 0;
                        const noteColor = getNoteColor(
                            thisMidi,
                            lock,
                            currentMidi,
                            absoluteInterval,
                        );

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
                                        color: noteColor.background,
                                        opacity:
                                            noteColor.background &&
                                            noteColor.opacity,
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
                                absoluteInterval={absoluteInterval}
                                lock={lock}
                                settings={settings}
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
                        settings={settings}
                    />
                )}
            </div>

            {numberOfFrets > 3 && (
                <div
                    className="flex w-full"
                    style={{
                        flexDirection:
                            settings.leftyMode === "true"
                                ? "row-reverse"
                                : "row",
                    }}
                >
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
    absoluteInterval,
    lock,
    settings,
}: {
    index: number;
    tuning: string[];
    currentMidi: number;
    setCurrentMidi: (value: number) => void;
    synth: Tone.Synth<Tone.SynthOptions>;
    absoluteInterval: number[];
    lock: boolean;
    settings: Settings;
}) => {
    return (
        <div
            className="flex flex-col w-full border-l border-white "
            style={
                settings.leftyMode === "true"
                    ? {
                          borderRightStyle: "var(--tw-border-style)",
                          borderRightWidth: "1px",
                      }
                    : {
                          borderLeftStyle: "var(--tw-border-style)",
                          borderLeftWidth: "1px",
                      }
            }
        >
            {tuning.map((note) => (
                <String
                    thisMidi={(Note.midi(note as NoteLiteral) ?? 0) + index + 1}
                    currentMidi={currentMidi}
                    setCurrentMidi={setCurrentMidi}
                    synth={synth}
                    absoluteInterval={absoluteInterval}
                    lock={lock}
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
            className="relative w-full h-5 flex items-center justify-center cursor-pointer"
            onMouseEnter={() => {
                setCurrentMidi(thisMidi);
            }}
            onClick={() => {
                synth.triggerAttackRelease(Note.fromMidi(currentMidi), "8n");
                setCurrentMidi(thisMidi);
            }}
        >
            <div className="rounded-full size-2 absolute" style={noteColor} />
            <div className="w-full h-0.5 bg-white" />
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
