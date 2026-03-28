import * as Tone from "tone";
import { Note } from "tonal";
import useWindowDimensions from "../libs/screen-width";

export const Piano = ({
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
    const { width } = useWindowDimensions();
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: width / 220 }, (_, i) => i).map((index) => (
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
        <div className="flex">
            <div className="flex gap-0.5">
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
            <div className="flex gap-1.5 absolute ml-2.75">
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
            <div className="flex gap-1.5 absolute ml-16.25">
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
    const thisMidi = (Note.midi(note + "1") ?? 0) + 12 * index;
    const thisNote = Note.fromMidi(thisMidi);

    const isChord = chord.includes(thisMidi);
    const isChordOctaved = chord
        .map((item) => item % 12)
        .includes(thisMidi % 12);

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
    const thisMidi = (Note.midi(note + "1") ?? 0) + 12 * index;
    const thisNote = Note.fromMidi(thisMidi);

    const isChord = chord.includes(thisMidi);
    const isChordOctaved = chord
        .map((item) => item % 12)
        .includes(thisMidi % 12);

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
