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

import { Lock } from "lucide-preact";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Toggle } from "./components/ui/toggle";
import * as Tone from "tone";
import { MoreMobile } from "./components/more";
import { Button } from "./components/ui/button";
import { useState, useMemo, useEffect, useRef } from "preact/hooks";
import { InstrumentSelectMobile } from "./components/mobile/instrument-select";
import { ChordScaleIntervalSelectMobile } from "./components/mobile/chord-scale-interval-select";
import { Chord, Interval, Note } from "tonal";
import { StringsPiano } from "./components/mobile/strings-piano";
import { useSettings } from "./libs/settings";
import { useFullscreen } from "./libs/fullscreen";

export const Mobile = () => {
    const { settings, saveSetting } = useSettings();
    const { isFullscreen, requestFullscreen } = useFullscreen();
    useEffect(() => {
        const handler = () => {
            console.log("handling");
            if (!isFullscreen && settings?.fullscreen === "true") {
                requestFullscreen();
            }
        };
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    const settingsLoaded = useRef(false);

    const [activeInstrument, setActiveInstrument] = useState<
        "strings" | "piano"
    >("strings");
    const [activeTab, setActiveTab] = useState("strings-piano");
    const [currentMidi, setCurrentMidi] = useState<number>(
        Note.midi("C2") ?? 0,
    );
    const currentNote = useMemo(
        () => Note.fromMidi(currentMidi),
        [currentMidi],
    );

    const [tuning, setTuning] = useState<string[]>([]);
    const [maxNumberOfFrets, setMaxNumberOfFrets] = useState<
        number | undefined
    >();

    const [absoluteIntervals, setAbsoluteIntervals] = useState<number[]>([]);
    const [chordName, setChordName] = useState<string>("-");
    const [relativeIntervalsString, setRelativeIntervalsString] = useState(
        absoluteIntervals.join(", "),
    );
    const [relativeIntervals, setRelativeIntervals] = useState<number[]>([]);
    const [lock, setLock] = useState(false);

    const updateIntervals = (newChordInput?: string) => {
        if (lock) return;
        setChordName("-");
        const tmp = (newChordInput ?? relativeIntervalsString)
            .split(/,\s*/)
            .map((item) => {
                if (item === null) return null;
                if (item.length === 0) return null;
                const semitone = Number(item);
                if (!isNaN(semitone)) return Interval.fromSemitones(semitone);
                const intervalName = Interval.name(item);
                if (intervalName.length === 0) return null;
                return intervalName;
            })
            .filter((item) => !!item) as string[];
        setRelativeIntervals(tmp.map((item) => Interval.semitones(item)));
        const newChord = [
            ...tmp.map((item) => Note.transpose(currentNote, item)),
        ];
        setAbsoluteIntervals(newChord.map((item) => Note.midi(item)!));
        const newChordNames = Chord.detect(newChord);
        if (newChordNames.length >= 1) {
            setChordName(newChordNames.join(", "));
        }
    };

    useEffect(() => {
        setLock(false);
    }, [relativeIntervalsString]);

    useEffect(updateIntervals, [relativeIntervalsString, currentNote]);

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
        setMaxNumberOfFrets(
            settings.maxNumberOfFrets.length > 0
                ? Number(settings.maxNumberOfFrets)
                : undefined,
        );
        setActiveInstrument(settings.activeInstrument as "strings" | "piano");

        settingsLoaded.current = true;
    }, [settings]);

    if (!settings || !settingsLoaded.current) return;

    return (
        <div className="w-screen h-dvh">
            <Tabs
                className="size-full flex flex-col gap-0"
                defaultValue="strings-piano"
                value={activeTab}
                onValueChange={(value) => setActiveTab(value)}
            >
                <TabsList className="h-fit w-full flex">
                    <TabsTrigger value="more">More</TabsTrigger>
                    <TabsTrigger value="instruments">Instruments</TabsTrigger>
                    <TabsTrigger value="chords-scales">C/S/I</TabsTrigger>
                </TabsList>

                <div className="size-full overflow-scroll *:size-full *:flex *:flex-col *:items-center *:justify-center">
                    <TabsContent value="more">
                        <MoreMobile />
                    </TabsContent>
                    <TabsContent value="instruments">
                        <InstrumentSelectMobile
                            tuning={tuning}
                            setTuning={setTuning}
                            maxNumberOfFrets={maxNumberOfFrets}
                            setMaxNumberOfFrets={setMaxNumberOfFrets}
                        />
                    </TabsContent>
                    <TabsContent value="chords-scales" className="h-0">
                        <ChordScaleIntervalSelectMobile
                            relativeIntervalsString={relativeIntervalsString}
                            setRelativeIntervalsString={
                                setRelativeIntervalsString
                            }
                            relativeIntervals={relativeIntervals}
                            setRelativeIntervals={setRelativeIntervals}
                        />
                    </TabsContent>
                    <TabsContent value="strings-piano">
                        <StringsPiano
                            tuning={tuning}
                            synth={synth}
                            currentMidi={currentMidi}
                            setCurrentMidi={setCurrentMidi}
                            chord={absoluteIntervals}
                            maxNumberOfFrets={maxNumberOfFrets}
                            chordName={chordName}
                            activeInstrument={activeInstrument}
                        />
                    </TabsContent>
                </div>

                <div className="flex h-7 w-full shrink-0">
                    <Button
                        variant="secondary"
                        className="h-full grow border-0"
                        onClick={() => {
                            if (activeTab !== "strings-piano") {
                                setActiveInstrument("strings");
                                saveSetting("activeInstrument", "strings");
                            } else {
                                if (activeInstrument === "strings") {
                                    setActiveInstrument("piano");
                                    saveSetting("activeInstrument", "piano");
                                } else {
                                    setActiveInstrument("strings");
                                    saveSetting("activeInstrument", "strings");
                                }
                            }
                            setActiveTab("strings-piano");
                        }}
                        style={{
                            color:
                                activeInstrument === "strings"
                                    ? "#fdc700"
                                    : undefined,
                        }}
                    >
                        Strings
                    </Button>
                    <Toggle
                        className="border-0 h-full w-15 data-[state=on]:text-yellow-300 data-[state=on]:bg-transparent"
                        pressed={lock}
                        onPressedChange={(value) => setLock(value)}
                    >
                        <Lock />
                    </Toggle>
                    <Button
                        className="h-full grow border-0"
                        variant="secondary"
                        onClick={() => {
                            if (activeTab !== "strings-piano") {
                                setActiveInstrument("piano");
                                saveSetting("activeInstrument", "piano");
                            } else {
                                if (activeInstrument === "strings") {
                                    setActiveInstrument("piano");
                                    saveSetting("activeInstrument", "piano");
                                } else {
                                    setActiveInstrument("strings");
                                    saveSetting("activeInstrument", "strings");
                                }
                            }
                            setActiveTab("strings-piano");
                        }}
                        style={{
                            color:
                                activeInstrument === "piano"
                                    ? "#fdc700"
                                    : undefined,
                        }}
                    >
                        Piano
                    </Button>
                </div>
            </Tabs>
        </div>
    );
};
