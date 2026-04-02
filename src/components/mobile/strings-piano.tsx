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

import { Note } from "tonal";
import { StringInstrumentMobile } from "./string-instrument";
import * as Tone from "tone";

export const StringsPiano = ({
    tuning,
    synth,
    currentMidi,
    setCurrentMidi,
    chord,
    maxNumberOfFrets,
    chordName,
}: {
    tuning: string[];
    currentMidi: number;
    setCurrentMidi: (value: number) => void;
    synth: Tone.Synth<Tone.SynthOptions>;
    chord: number[];
    maxNumberOfFrets: number | undefined;
    chordName: string;
}) => {
    return (
        <div className="size-full h-full flex flex-col max-h-full grow-0 overflow-hidden">
            <div className="flex-1 min-h-0">
                <StringInstrumentMobile
                    tuning={tuning}
                    synth={synth}
                    currentMidi={currentMidi}
                    setCurrentMidi={setCurrentMidi}
                    chord={chord}
                    maxNumberOfFrets={maxNumberOfFrets}
                />
            </div>
            <div className="h-fit flex justify-between w-full px-2 py-1 border-t gap-4">
                <span className="text-cyan-300">{Note.fromMidi(currentMidi)}</span>
                <span className="text-yellow-300 truncate">{chordName}</span>
            </div>
        </div>
    );
};
