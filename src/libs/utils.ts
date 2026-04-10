/*
Chordinator: A tool to visualize chords, scales and intervals of string instruments.
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

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Interval, Note } from "tonal";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getNoteColor = (
    thisMidi: number,
    lock: boolean,
    currentMidi: number,
    absoluteInterval: number[],
) => {
    if (lock) {
        if (thisMidi === currentMidi)
            return { opacity: "100%", background: "#00d3f2" };
        else if (thisMidi % 12 === currentMidi % 12)
            return { opacity: "60%", background: "#00d3f2" };
        else if (absoluteInterval.includes(thisMidi))
            return { opacity: "100%", background: "#fdc700" };
        else if (
            absoluteInterval.map((value) => value % 12).includes(thisMidi % 12)
        )
            return { opacity: "60%", background: "#fdc700" };
        else return { opacity: "0%", background: undefined };
    } else {
        if (absoluteInterval.includes(thisMidi))
            return { opacity: "100%", background: "#fdc700" };
        else if (
            absoluteInterval.map((value) => value % 12).includes(thisMidi % 12)
        )
            return { opacity: "60%", background: "#fdc700" };
        else if (thisMidi === currentMidi)
            return { opacity: "100%", background: "#00d3f2" };
        else if (thisMidi % 12 === currentMidi % 12)
            return { opacity: "60%", background: "#00d3f2" };
        else return { opacity: "0%", background: undefined };
    }
};

export const compareIntervals = (a: number[], b: number[]) => {
    if (a.length !== b.length) return false;
    return a.every((value, index) => value === b[index]);
};

export const sortInterval = (a: number[]) => {
    a.sort((A, B) => A - B);
};

export const isIncludedInIntervals = (input: string, intervals: number[]) => {
    if (!input.includes(",")) return false;

    const inputIntervals = input
        .split(/,\s*/)
        .map((item) => {
            return Interval.semitones(Interval.distance("C0", item)) % 12;
        })
        .sort((a, b) => a - b);
    for (const item of inputIntervals) {
        if (Number.isNaN(item)) return false;
    }
    if (inputIntervals.length > intervals.length) return false;

    for (let i = 0; i <= 12; i += 1) {
        if (
            inputIntervals.every((value) =>
                intervals.includes((value + i) % 12),
            )
        )
            return true;
    }

    return false;
};
