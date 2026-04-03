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

import { Lock } from "lucide-preact";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Toggle } from "./components/ui/toggle";
import * as Tone from "tone";
import { MadeByMobile } from "./components/made-by";
import { Button } from "./components/ui/button";
import { useState, useMemo, useEffect } from "preact/hooks";
import { InstrumentSelectMobile } from "./components/mobile/instrument-select";
import { ChordSequenceSelectMobile } from "./components/mobile/chord-sequence-select";
import { Chord, Interval, Note } from "tonal";
import { StringsPiano } from "./components/mobile/strings-piano";

export const Mobile = () => {
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

    const [tuning, setTuning] = useState(["E1", "A1", "D2", "G2"].reverse());
    const [maxNumberOfFrets, setMaxNumberOfFrets] = useState<
        number | undefined
    >();

    const [chord, setChord] = useState<number[]>([]);
    const [chordName, setChordName] = useState<string>("-");
    const [chordInput, setChordInput] = useState(chord.join(", "));
    const [interVals, setIntervals] = useState<number[]>([]);
    const [lockChords, setLockChords] = useState(false);

    const updateIntervals = (newChordInput?: string) => {
        if (lockChords) return;
        setChordName("-");
        const tmp = (newChordInput ?? chordInput)
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
        setIntervals(tmp.map((item) => Interval.semitones(item)));
        const newChord = [
            ...tmp.map((item) => Note.transpose(currentNote, item)),
        ];
        setChord(newChord.map((item) => Note.midi(item)!));
        const newChordNames = Chord.detect(newChord);
        if (newChordNames.length >= 1) {
            setChordName(newChordNames.join(", "));
        }
    };

    useEffect(() => {
        setLockChords(false);
    }, [chordInput]);

    useEffect(updateIntervals, [chordInput, currentNote]);

    const synth = useMemo(() => new Tone.Synth().toDestination(), []);

    return (
        <div className="w-screen h-screen">
            <Tabs
                className="size-full flex flex-col gap-0"
                defaultValue="strings-piano"
                value={activeTab}
                onValueChange={(value) => setActiveTab(value)}
            >
                <TabsList className="h-fit w-full flex">
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="instruments">Instruments</TabsTrigger>
                    <TabsTrigger value="chords-sequences">Ch./Seq.</TabsTrigger>
                </TabsList>

                <div className="size-full overflow-scroll *:size-full *:flex *:flex-col *:items-center *:justify-center">
                    <TabsContent value="about">
                        <MadeByMobile />
                    </TabsContent>
                    <TabsContent value="instruments">
                        <InstrumentSelectMobile
                            tuning={tuning}
                            setTuning={setTuning}
                            maxNumberOfFrets={maxNumberOfFrets}
                            setMaxNumberOfFrets={setMaxNumberOfFrets}
                        />
                    </TabsContent>
                    <TabsContent value="chords-sequences" className="h-0">
                        <ChordSequenceSelectMobile
                            chordInput={chordInput}
                            setChordInput={setChordInput}
                            intervals={interVals}
                            setIntervals={setIntervals}
                        />
                    </TabsContent>
                    <TabsContent value="strings-piano">
                        <StringsPiano
                            tuning={tuning}
                            synth={synth}
                            currentMidi={currentMidi}
                            setCurrentMidi={setCurrentMidi}
                            chord={chord}
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
                            } else {
                                if (activeInstrument === "strings") {
                                    setActiveInstrument("piano");
                                } else {
                                    setActiveInstrument("strings");
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
                        pressed={lockChords}
                        onPressedChange={(value) => setLockChords(value)}
                    >
                        <Lock />
                    </Toggle>
                    <Button
                        className="h-full grow border-0"
                        variant="secondary"
                        onClick={() => {
                            if (activeTab !== "strings-piano") {
                                setActiveInstrument("piano");
                            } else {
                                if (activeInstrument === "strings") {
                                    setActiveInstrument("piano");
                                } else {
                                    setActiveInstrument("strings");
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
