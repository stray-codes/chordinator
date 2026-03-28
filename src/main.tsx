import { useEffect, useMemo, useState } from "preact/hooks";
import * as Tone from "tone";
import { Chord, Interval, Note } from "tonal";
import { StringInstrument } from "./components/string-instrument";
import { Piano } from "./components/piano";
import { ToggleGroup, ToggleGroupItem } from "./components/ui/toggle-group";
import { Input } from "./components/ui/input";
import useWindowDimensions from "./libs/screen-width";

export const Main = () => {
    const [currentMidi, setCurrentMidi] = useState<number>(
        Note.midi("C2") ?? 0,
    );
    const currentNote = useMemo(
        () => Note.fromMidi(currentMidi),
        [currentMidi],
    );

    const [stringGroup, setStringGroup] = useState("bass");
    const [strings, setStrings] = useState("E1, A1, D2, G2");
    const [tuning, setTuning] = useState(["E1", "A1", "D2", "G2"].reverse());

    const { width } = useWindowDimensions();

    useEffect(() => {
        let tmp = strings.split(/,\s*/);
        tmp = tmp.map((item) => Note.simplify(item));
        for (const item of tmp) {
            if (item.length === 0) return;
        }
        setTuning(tmp.reverse());
    }, [strings]);

    const [chordGroup, setChordGroup] = useState("none");
    const [chordInput, setChordInput] = useState("");
    const [chordName, setChordName] = useState<string>("-");
    const [chord, setChord] = useState<number[]>([]);

    useEffect(() => {
        setChordName("-");
        const tmp = chordInput
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
        const newChord = [
            ...tmp.map((item) => Note.transpose(currentNote, item)),
        ];
        setChord(newChord.map((item) => Note.midi(item)!));
        const newChordNames = Chord.detect(newChord);
        if (newChordNames.length >= 1) setChordName(newChordNames.join(", "));
    }, [chordInput, currentNote]);

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
                <div className="border p-2 flex flex-col items-center gap-2 w-full lg:w-fit">
                    <ToggleGroup
                        type="single"
                        value={chordGroup}
                        className=""
                        onValueChange={(value) => {
                            if (value) {
                                setChordGroup(value);
                                switch (value) {
                                    case "none":
                                        setChordInput("");
                                        break;
                                    case "major":
                                        setChordInput("0, 4, 7");
                                        break;
                                    case "minor":
                                        setChordInput("0, 3, 7");
                                        break;
                                    case "maj7":
                                        setChordInput("0, 4, 7, 11");
                                        break;
                                }
                            }
                        }}
                    >
                        <ToggleGroupItem value="none">None</ToggleGroupItem>
                        <ToggleGroupItem
                            value="major"
                            className="data-[state=on]:text-yellow-300"
                        >
                            Major
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="minor"
                            className="data-[state=on]:text-yellow-300"
                        >
                            Minor
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="maj7"
                            className="data-[state=on]:text-yellow-300"
                        >
                            Maj7
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="custom"
                            className="data-[state=on]:text-yellow-300"
                        >
                            Custom
                        </ToggleGroupItem>
                    </ToggleGroup>
                    <Input
                        value={chordInput}
                        onChange={(e) => {
                            setChordGroup("custom");
                            setChordInput(e.currentTarget.value);
                        }}
                    />
                </div>

                {width > 1300 && (
                    <div className="border p-2 flex flex-col items-center justify-center h-fit gap-2 text-xs">
                        <a
                            className="text-cyan-400"
                            href="https://stray.codes/"
                        >
                            Made by Karol Czopek
                        </a>
                        <div className="flex gap-2">
                            <a
                                href="https://github.com/stray-codes/chordinator"
                                className="hover:text-yellow-300"
                            >
                                Github
                            </a>
                            <a
                                href="https://ko-fi.com/straycodes"
                                className="hover:text-yellow-300"
                            >
                                Donate
                            </a>
                            <a
                                href="https://stray.codes/"
                                className="hover:text-yellow-300"
                            >
                                Homepage
                            </a>
                        </div>
                    </div>
                )}

                <div className="border p-2 flex flex-col items-center gap-2 w-full lg:w-fit">
                    <ToggleGroup
                        type="single"
                        value={stringGroup}
                        onValueChange={(value) => {
                            if (value) {
                                setStringGroup(value);
                                switch (value) {
                                    case "guitar":
                                        setStrings("E2, A2, D3, G3, B3, E4");
                                        break;
                                    case "bass":
                                        setStrings("E1, A1, D2, G2");
                                        break;
                                    case "violin":
                                        setStrings("G3, D4, A4, E5");
                                        break;
                                    case "cello":
                                        setStrings("C2, G2, D3, A3");
                                        break;
                                }
                            }
                        }}
                    >
                        <ToggleGroupItem value="guitar">Guitar</ToggleGroupItem>
                        <ToggleGroupItem value="bass">Bass</ToggleGroupItem>
                        <ToggleGroupItem value="violin">Violin</ToggleGroupItem>
                        <ToggleGroupItem value="cello">Cello</ToggleGroupItem>
                        <ToggleGroupItem value="custom">Custom</ToggleGroupItem>
                    </ToggleGroup>
                    <Input
                        value={strings}
                        onChange={(e) => {
                            setStringGroup("custom");
                            setStrings(e.currentTarget.value);
                        }}
                    />
                </div>
            </div>
            {width <= 1300 && (
                <div className="border p-2 flex items-center justify-between w-full h-fit gap-2 text-xs">
                    <a className="text-cyan-400" href="https://stray.codes/">
                        Made by Karol Czopek
                    </a>
                    <div className="flex gap-2">
                        <a
                            href="https://github.com/stray-codes/chordinator"
                            className="hover:text-yellow-300"
                        >
                            Github
                        </a>
                        <a
                            href="https://ko-fi.com/straycodes"
                            className="hover:text-yellow-300"
                        >
                            Donate
                        </a>
                        <a
                            href="https://stray.codes/"
                            className="hover:text-yellow-300"
                        >
                            Homepage
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};
