export const instruments: Instrument[] = [
    { label: "Baglama", strings: "D2, A2, E3" },
    { label: "Balalaika", strings: "E2, E2, A2" },
    { label: "Bandurria", strings: "G2, D3, A3, E4, B4, F5" },
    { label: "Banjo (4-string)", strings: "C3, G3, D4, A4" },
    {
        label: "Banjo (5-string)",

        strings: "G4, D3, G3, B3, D4",
    },
    {
        label: "Baritone Guitar",
        group: "guitar",
        strings: "B1, E2, A2, D3, F#3, B3",
    },
    { label: "Baritone Ukulele", strings: "D3, G3, B3, E4" },
    { label: "Bass", group: "bass", strings: "E1, A1, D2, G2" },
    { label: "Bass (drop D)", group: "bass", strings: "D1, G1, C2, F2" },
    {
        label: "Bass (5-string)",
        group: "bass",
        strings: "B0, E1, A1, D2, G2",
    },
    {
        label: "Bass (6-string)",
        group: "bass",
        strings: "B0, E1, A1, D2, G2, C3",
    },
    { label: "Bouzouki (Greek)", strings: "C3, F3, A3, D4" },
    { label: "Bouzouki (Irish)", strings: "G2, D3, A3, D4" },
    { label: "Cavaquinho", strings: "D3, G3, B3, E4" },
    { label: "Cello", group: "cello", strings: "C2, G2, D3, A3" },
    { label: "Cittern", strings: "C2, G2, D3, A3, E4" },
    { label: "Dobro", strings: "G3, B3, D4, G4, B4, D5" },
    { label: "Dulcimer (Appalachian)", strings: "D3, A3, D4" },
    { label: "Guitar", group: "guitar", strings: "E2, A2, D3, G3, B3, E4" },
    {
        label: "Guitar (drop D)",
        group: "guitar",
        strings: "D2, G2, C3, F3, A3, D4",
    },
    { label: "Guitarlele", group: "guitar", strings: "A2, D3, G3, C4, E4, A4" },
    { label: "Guqin", strings: "C2, D2, F2, G2, A2, C3, D3" },
    {
        label: "Harp",

        strings:
            "C1, D1, E1, F1, G1, A1, B1, C2, D2, E2, F2, G2, A2, B2, C3, D3, E3, F3, G3, A3, B3, C4, D4, E4, F4, G4, A4, B4, C5, D5, E5, F5, G5, A5, B5, C6, D6, E6, F6, G6, A6, B6, C7",
        maxNumberOfFrets: 0,
    },
    {
        label: "Kora",

        strings:
            "F2, G2, A2, C3, D3, E3, F3, G3, A3, C4, D4, E4, F4, G4, A4, C5, D5, E5, F5, G5",
        maxNumberOfFrets: 0,
    },
    {
        label: "Koto (Hirajoshi in D )",

        strings: "D4, G3, A3, Bb3, D4, Eb4, G4, A4, Bb4, D5, Eb5, G5, A5",
        maxNumberOfFrets: 0,
    },
    {
        label: "Koto (Kumoijoshi in D)",

        strings: "D4, G3, Ab3, C4, D4, Eb4, G4, Ab4, C5, D5, Eb5, G5, A5",
        maxNumberOfFrets: 0,
    },
    {
        label: "Lute (Renaissance)",

        strings: "G2, C3, F3, A3, D4, G4",
    },
    { label: "Mandocello", group: "cello", strings: "C2, G2, D3, A3" },
    { label: "Mandola", strings: "C3, G3, D4, A4" },
    { label: "Mandolin", strings: "G3, D4, A4, E5" },
    { label: "Oud", strings: "C2, F2, A2, D3, G3, C4" },
    {
        label: "Pedal Steel Guitar",
        group: "guitar",
        strings: "B2, D3, E3, F#3, G#3, B3, E4, G#4, D#4, F#4",
    },
    { label: "Pipa", strings: "A2, E3, A3, D4" },
    { label: "Requinto", strings: "A2, D3, G3, C4, E4, A4" },
    {
        label: "Sitar",

        strings: "C#3, G#3, C#4, G#4, C#5, G#5, C#6",
    },
    { label: "Soprano Ukulele", strings: "G4, C4, E4, A4" },
    { label: "Tenor Guitar", group: "guitar", strings: "C3, G3, D4, A4" },
    {
        label: "Theorbo",

        strings: "A1, B1, C2, D2, E2, F2, G2, A2, D3, G3, B3, E4",
    },
    { label: "Tres (Cuban)", strings: "G3, C4, E4" },
    { label: "Veena", strings: "C3, G3, C4, G4" },
    { label: "Vihuela", strings: "G2, C3, F3, A3, D4, G4" },
    { label: "Viola", strings: "C3, G3, D4, A4" },
    { label: "Violin", group: "violin", strings: "G3, D4, A4, E5" },
    { label: "Zither", strings: "A2, B2, C3, D3, E3, F3, G3" },
];

export type Instrument = {
    label: string;
    group?: "guitar" | "bass" | "violin" | "cello" | "custom";
    strings: string;
    maxNumberOfFrets?: number;
};

/*
Chordinator: A tool to visualize chords and intervals on string instruments.
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
