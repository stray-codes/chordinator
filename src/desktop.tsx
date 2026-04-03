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

import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import * as Tone from "tone";
import { Note } from "tonal";
import { StringInstrument } from "./components/desktop/string-instrument";
import { Piano } from "./components/desktop/piano";
import useWindowDimensions from "./libs/screen-width";
import { More } from "./components/more";
import { InstrumentSelect } from "./components/desktop/instrument-select";
import { Toaster } from "sonner";
import { useSettings } from "./libs/settings";
import { ChordScaleIntervalSelect } from "./components/desktop/chord-scale-interval-select";

export const Desktop = () => {
    const { settings } = useSettings();
    const settingsLoaded = useRef(false);

    const [maxNumberOfFrets, setMaxNumberOfFrets] = useState<
        number | undefined
    >();
    const [stringGroup, setStringGroup] = useState("bass");
    const [tuningString, setTuningString] = useState("");
    const [tuning, setTuning] = useState<string[]>([]);

    const [absoluteIntervals, setAbsoluteIntervals] = useState<number[]>([]);
    const [relativeIntervalsString, setRelativeIntervalsString] = useState("");
    const [chordScaleIntervalGroup, setChordScaleIntervalGroup] =
        useState("none");
    const [chordName, setChordName] = useState<string>("-");
    const [lock, setLock] = useState(false);

    const { width } = useWindowDimensions();

    const [currentMidi, setCurrentMidi] = useState<number>(
        Note.midi("C2") ?? 0,
    );
    const currentNote = useMemo(
        () => Note.fromMidi(currentMidi),
        [currentMidi],
    );

    const synth = useMemo(() => new Tone.Synth().toDestination(), []);

    useEffect(() => {
        if (settingsLoaded.current) return;
        if (!settings) return;
        setTuning(
            settings.tuning
                .split(",")
                .map((value) => value.trim())
                .reverse(),
        );
        setStringGroup(settings.stringGroup);
        setTuningString(settings.tuning);
        setMaxNumberOfFrets(
            settings.maxNumberOfFrets.length > 0
                ? Number(settings.maxNumberOfFrets)
                : undefined,
        );

        settingsLoaded.current = true;
    }, [settings]);

    useEffect(() => {
        setLock(false);
    }, [relativeIntervalsString]);

    if (!settings || !settingsLoaded.current) return;

    return (
        <div className="min-size-full h-screen overflow-scroll">
            <div className="flex flex-col gap-4 size-full items-center justify-between px-4 min-h-screen bg-[#0c0c0c]">
                <Piano
                    synth={synth}
                    currentMidi={currentMidi}
                    setCurrentMidi={setCurrentMidi}
                    absoluteInterval={absoluteIntervals}
                    lock={lock}
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
                    absoluteInterval={absoluteIntervals}
                    maxNumberOfFrets={maxNumberOfFrets}
                    lock={lock}
                />
                <div className="flex flex-col gap-4 pb-4 w-full">
                    <div className="flex flex-row justify-between items-end gap-2 w-full flex-wrap">
                        <ChordScaleIntervalSelect
                            lock={lock}
                            setLock={setLock}
                            setAbsoluteIntervals={setAbsoluteIntervals}
                            setChordName={setChordName}
                            currentNote={currentNote}
                            chordScaleIntervalGroup={chordScaleIntervalGroup}
                            setChordScaleIntervalGroup={
                                setChordScaleIntervalGroup
                            }
                            relativeIntervalsString={relativeIntervalsString}
                            setRelativeIntervalsString={
                                setRelativeIntervalsString
                            }
                        />

                        {width > 1300 && <More />}

                        <InstrumentSelect
                            strings={tuningString}
                            setStrings={setTuningString}
                            stringGroup={stringGroup}
                            setStringGroup={setStringGroup}
                            setTuning={setTuning}
                            maxNumberOfFrets={maxNumberOfFrets}
                            setMaxNumberOfFrets={setMaxNumberOfFrets}
                        />
                    </div>
                    {width <= 1300 && <More />}
                </div>
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
