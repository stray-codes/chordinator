import { useEffect, useState } from "preact/hooks";
import { Note } from "tonal";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Input } from "./ui/input";
import { PlusCircle } from "lucide-preact";

export const InstrumentSelect = ({
    setTuning,
}: {
    setTuning: (value: string[]) => void;
}) => {
    const [stringGroup, setStringGroup] = useState("bass");
    const [strings, setStrings] = useState("E1, A1, D2, G2");

    useEffect(() => {
        let tmp = strings.split(/,\s*/);
        tmp = tmp.map((item) => Note.simplify(item));
        for (const item of tmp) {
            if (item.length === 0) return;
        }
        setTuning(tmp.reverse());
    }, [strings]);

    return (
        <div className="border p-2 flex flex-col items-center justify-center gap-2 w-full lg:w-fit">
            <div className="w-full flex justify-end">
                <PlusCircle />
            </div>
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
    );
};
