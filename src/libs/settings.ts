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

import { useEffect, useState } from "preact/hooks";

type SettingKey =
    | "tuning"
    | "stringGroup"
    | "maxNumberOfFrets"

    // mobile only
    | "fullscreen"
    | "splitMode"
    | "leftyMode"
    | "activeInstrument";

export type Settings = Record<SettingKey, string>;

const defaultSettings: Settings = {
    tuning: "E1, A1, D2, G2",
    stringGroup: "bass",
    maxNumberOfFrets: "",

    fullscreen: "true",
    splitMode: "true",
    leftyMode: "false",
    activeInstrument: "strings",
};

export const useSettings = () => {
    const [settings, setSettings] = useState<Settings>();
    useEffect(() => {
        const reloadedSettings = { ...defaultSettings };
        Object.keys(defaultSettings).forEach((key) => {
            const k = key as keyof Settings;
            const storedValue = localStorage.getItem(k);
            if (storedValue) {
                reloadedSettings[k] = storedValue;
            }
        });
        setSettings(reloadedSettings);
    }, []);

    const saveSetting = (key: keyof Settings, value: string) => {
        const storageValue = localStorage.getItem(key);
        if (storageValue === value) return;
        localStorage.setItem(key, value);
        setSettings({
            ...(settings ?? defaultSettings),
            [key]: value,
        });
    };

    return { settings, saveSetting };
};
