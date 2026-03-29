export type Sequence = {
    label: string;
    intervals: string;
    chordGroup?: "pentatonic" | "custom";
};
export const sequences: Sequence[] = [
    {
        label: "Pentatonic Major",
        intervals: "0, 2, 4, 7, 9",
        chordGroup: "pentatonic",
    },
    {
        label: "Pentatonic Minor",
        intervals: "0, 3, 5, 7, 10",
        chordGroup: "pentatonic",
    },
    {
        label: "Pentatonic Blues",
        intervals: "0, 3, 5, 6, 7, 10",
        chordGroup: "pentatonic",
    },

    { label: "Blues", intervals: "0, 3, 5, 6, 7, 10" },
    { label: "Blues Major", intervals: "0, 2, 3, 4, 7, 9" },

    { label: "Major (Ionian)", intervals: "0, 2, 4, 5, 7, 9, 11" },
    { label: "Dorian", intervals: "0, 2, 3, 5, 7, 9, 10" },
    { label: "Phrygian", intervals: "0, 1, 3, 5, 7, 8, 10" },
    { label: "Lydian", intervals: "0, 2, 4, 6, 7, 9, 11" },
    { label: "Mixolydian", intervals: "0, 2, 4, 5, 7, 9, 10" },
    { label: "Aeolian (Natural Minor)", intervals: "0, 2, 3, 5, 7, 8, 10" },
    { label: "Locrian", intervals: "0, 1, 3, 5, 6, 8, 10" },

    { label: "Harmonic Minor", intervals: "0, 2, 3, 5, 7, 8, 11" },
    { label: "Melodic Minor", intervals: "0, 2, 3, 5, 7, 9, 11" },
    { label: "Dorian b2", intervals: "0, 1, 3, 5, 7, 9, 10" },
    { label: "Lydian Augmented", intervals: "0, 2, 4, 6, 8, 9, 11" },
    { label: "Lydian Dominant", intervals: "0, 2, 4, 6, 7, 9, 10" },
    { label: "Mixolydian b6", intervals: "0, 2, 4, 5, 7, 8, 10" },
    { label: "Locrian #2", intervals: "0, 2, 3, 5, 6, 8, 10" },
    { label: "Altered (Super Locrian)", intervals: "0, 1, 3, 4, 6, 8, 10" },

    { label: "Whole Tone", intervals: "0, 2, 4, 6, 8, 10" },
    { label: "Diminished (Half-Whole)", intervals: "0, 1, 3, 4, 6, 7, 9, 10" },
    { label: "Diminished (Whole-Half)", intervals: "0, 2, 3, 5, 6, 8, 9, 11" },
    { label: "Augmented", intervals: "0, 3, 4, 7, 8, 11" },

    { label: "Bebop Major", intervals: "0, 2, 4, 5, 7, 8, 9, 11" },
    { label: "Bebop Minor", intervals: "0, 2, 3, 5, 7, 8, 9, 10" },
    { label: "Bebop Dominant", intervals: "0, 2, 4, 5, 7, 9, 10, 11" },

    { label: "Hungarian Minor", intervals: "0, 2, 3, 6, 7, 8, 11" },
    { label: "Hungarian Major", intervals: "0, 3, 4, 6, 7, 9, 10" },
    { label: "Persian", intervals: "0, 1, 4, 5, 6, 8, 11" },
    { label: "Double Harmonic (Byzantine)", intervals: "0, 1, 4, 5, 7, 8, 11" },
    { label: "Arabic", intervals: "0, 2, 4, 5, 6, 8, 10" },
    { label: "Phrygian Dominant", intervals: "0, 1, 4, 5, 7, 8, 10" },
    { label: "Enigmatic", intervals: "0, 1, 4, 6, 8, 10, 11" },
    { label: "Neapolitan Major", intervals: "0, 1, 3, 5, 7, 9, 11" },
    { label: "Neapolitan Minor", intervals: "0, 1, 3, 5, 7, 8, 11" },
    { label: "Romanian Minor", intervals: "0, 2, 3, 6, 7, 9, 10" },
    { label: "Spanish Gypsy", intervals: "0, 1, 4, 5, 7, 8, 10" },
    { label: "Flamenco", intervals: "0, 1, 3, 4, 5, 7, 8, 10, 11" },
    { label: "Hirajoshi", intervals: "0, 2, 3, 7, 8" },
    { label: "Kumoijoshi", intervals: "0, 2, 3, 7, 9" },
    { label: "Insen", intervals: "0, 1, 5, 7, 10" },
    { label: "Iwato", intervals: "0, 1, 5, 6, 10" },
    { label: "In", intervals: "0, 1, 5, 7, 8" },
    { label: "Yo", intervals: "0, 2, 5, 7, 9" },

    { label: "Chromatic", intervals: "0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11" },
    { label: "Whole Half Step", intervals: "0, 2, 3, 5, 6, 8, 9, 11" },
    { label: "Tritone", intervals: "0, 1, 4, 6, 7, 10" },
    { label: "Prometheus", intervals: "0, 2, 4, 6, 9, 10" },
];
