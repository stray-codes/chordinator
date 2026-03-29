import { useMemo, useState } from "preact/hooks";
import * as Tone from "tone";
import { Note } from "tonal";
import { StringInstrument } from "./components/string-instrument";
import { Piano } from "./components/piano";
import useWindowDimensions from "./libs/screen-width";
import { MadeBy } from "./components/made-by";
import { InstrumentSelect } from "./components/instrument-select";
import { ChordSequenceSelect } from "./components/chord-sequence-select";

export const Main = () => {
    const [currentMidi, setCurrentMidi] = useState<number>(
        Note.midi("C2") ?? 0,
    );
    const currentNote = useMemo(
        () => Note.fromMidi(currentMidi),
        [currentMidi],
    );

    const [tuning, setTuning] = useState(["E1", "A1", "D2", "G2"].reverse());

    const [chord, setChord] = useState<number[]>([]);
    const [chordName, setChordName] = useState<string>("-");

    const { width } = useWindowDimensions();

    const synth = useMemo(() => new Tone.Synth().toDestination(), []);

    if (width < 540)
        return (
            <div className="size-full flex items-center justify-center text-xs">
                <span>Mobile Version comming soon.</span>
            </div>
        );

    return (
        <div className="flex flex-col gap-4 h-vh items-center justify-between px-4 pb-4 min-h-screen bg-[#0c0c0c]">
            <Piano
                synth={synth}
                currentMidi={currentMidi}
                setCurrentMidi={setCurrentMidi}
                chord={chord}
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
                chord={chord}
            />
            <div className="flex flex-row justify-between items-end gap-2 w-full flex-wrap">
                <ChordSequenceSelect
                    setChord={setChord}
                    setChordName={setChordName}
                    currentNote={currentNote}
                />

                {width > 1300 && <MadeBy />}

                <InstrumentSelect setTuning={setTuning} />
            </div>
            {width <= 1300 && <MadeBy />}
        </div>
    );
};
