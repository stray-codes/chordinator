import { useEffect, useState } from "preact/hooks";
import { Chord, Interval, Note, NoteLiteral } from "tonal";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Input } from "./ui/input";
import { Toggle } from "./ui/toggle";
import { Lock, PlusCircle } from "lucide-preact";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";

export const ChordSequenceSelect = ({
    setChord,
    setChordName,
    currentNote,
}: {
    setChord: (value: number[]) => void;
    setChordName: (value: string) => void;
    currentNote: NoteLiteral;
}) => {
    const [lockChords, setLockChords] = useState(false);
    const [chordGroup, setChordGroup] = useState("none");
    const [chordInput, setChordInput] = useState("");

    useEffect(() => {
        if (chordGroup === "none" && lockChords) setLockChords(false);
    }, [chordGroup, lockChords]);

    useEffect(() => {
        if (lockChords) return;
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

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                const target = e.target as HTMLElement;
                if (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
                    return;
                e.preventDefault();
                setLockChords((prev) => {
                    return !prev;
                });
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="border p-2 flex flex-col items-center gap-2 w-full lg:w-fit">
            <div className="flex items-center justify-between w-full text-xs">
                <Toggle
                    className="h-6 p-0 hover:text-yellow-300 rounded-full"
                    pressed={lockChords}
                    onPressedChange={(value) => setLockChords(value)}
                    disabled={chordGroup === "none"}
                >
                    <Lock className="size-3" />
                </Toggle>
                <div className="w-full flex justify-end">
                    <Dialog>
                        <DialogTrigger className="hover:text-yellow-300">
                            <PlusCircle />
                        </DialogTrigger>

                        <DialogContent>
                            <DialogTitle>Chords</DialogTitle>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <ToggleGroup
                type="single"
                value={chordGroup}
                onValueChange={(value) => {
                    setLockChords(false);
                    if (value) {
                        setChordGroup(value);
                        switch (value) {
                            case "none":
                                setLockChords(false);
                                setChordInput("");
                                break;
                            case "major":
                                setChordInput("0, 4, 7");
                                break;
                            case "minor":
                                setChordInput("0, 3, 7");
                                break;
                            case "pentatonic":
                                setChordInput("0, 2, 4, 7, 9");
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
                    value="pentatonic"
                    className="data-[state=on]:text-yellow-300"
                >
                    Penta.
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
    );
};
