export type Chord = {
    label: string;
    intervals: string;
    chordGroup?: "major" | "minor" | "custom";
};
export const chords: Chord[] = [
    { label: "Major", intervals: "0, 4, 7", chordGroup: "major" },
    { label: "Minor", intervals: "0, 3, 7", chordGroup: "minor" },

    { label: "7", intervals: "0, 4, 7, 10" },
    { label: "Minor 7", intervals: "0, 3, 7, 10" },
    { label: "Major 7", intervals: "0, 4, 7, 11" },
    { label: "Minor Major 7", intervals: "0, 3, 7, 11" },
    { label: "Augmented 7", intervals: "0, 4, 8, 10" },
    { label: "Augmented Major 7", intervals: "0, 4, 8, 11" },
    { label: "Diminished 7", intervals: "0, 3, 6, 9" },
    { label: "Half Diminished 7", intervals: "0, 3, 6, 10" },
    { label: "Dominant 7 flat 5", intervals: "0, 4, 6, 10" },

    { label: "Major 6", intervals: "0, 4, 7, 9" },
    { label: "Minor 6", intervals: "0, 3, 7, 9" },
    { label: "6/9", intervals: "0, 4, 7, 9, 14" },

    { label: "9", intervals: "0, 4, 7, 10, 14" },
    { label: "Minor 9", intervals: "0, 3, 7, 10, 14" },
    { label: "Major 9", intervals: "0, 4, 7, 11, 14" },
    { label: "Add 9", intervals: "0, 4, 7, 14" },
    { label: "Minor Add 9", intervals: "0, 3, 7, 14" },
    { label: "7 flat 9", intervals: "0, 4, 7, 10, 13" },
    { label: "7 sharp 9", intervals: "0, 4, 7, 10, 15" },

    { label: "11", intervals: "0, 4, 7, 10, 14, 17" },
    { label: "Minor 11", intervals: "0, 3, 7, 10, 14, 17" },
    { label: "Major 11", intervals: "0, 4, 7, 11, 14, 17" },
    { label: "7 sharp 11", intervals: "0, 4, 7, 10, 14, 18" },

    { label: "13", intervals: "0, 4, 7, 10, 14, 17, 21" },
    { label: "Minor 13", intervals: "0, 3, 7, 10, 14, 17, 21" },
    { label: "Major 13", intervals: "0, 4, 7, 11, 14, 17, 21" },

    { label: "Sus2", intervals: "0, 2, 7" },
    { label: "Sus4", intervals: "0, 5, 7" },
    { label: "7 Sus2", intervals: "0, 2, 7, 10" },
    { label: "7 Sus4", intervals: "0, 5, 7, 10" },
    { label: "9 Sus4", intervals: "0, 5, 7, 10, 14" },

    { label: "Augmented", intervals: "0, 4, 8" },
    { label: "Diminished", intervals: "0, 3, 6" },

    { label: "Power", intervals: "0, 7" },
    { label: "Major flat 5", intervals: "0, 4, 6" },
    { label: "Minor flat 5", intervals: "0, 3, 6" },

    { label: "Add 11", intervals: "0, 4, 7, 17" },
    { label: "Minor Add 11", intervals: "0, 3, 7, 17" },
    { label: "Add 13", intervals: "0, 4, 7, 21" },

    { label: "7 flat 5", intervals: "0, 4, 6, 10" },
    { label: "7 sharp 5", intervals: "0, 4, 8, 10" },
    { label: "7 flat 5 flat 9", intervals: "0, 4, 6, 10, 13" },
    { label: "7 flat 5 sharp 9", intervals: "0, 4, 6, 10, 15" },
    { label: "7 sharp 5 flat 9", intervals: "0, 4, 8, 10, 13" },
    { label: "7 sharp 5 sharp 9", intervals: "0, 4, 8, 10, 15" },
];
