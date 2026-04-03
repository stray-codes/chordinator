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

import { useFullscreen } from "../libs/fullscreen";
import useWindowDimensions from "../libs/screen-width";
import { Button } from "./ui/button";

export const MadeBy = () => {
    const { width } = useWindowDimensions();
    return (
        <div
            className={
                width > 1300
                    ? "border p-2 flex flex-col items-center justify-center h-fit gap-2 text-xs"
                    : "border p-2 flex items-center justify-between w-full h-fit gap-2 text-xs"
            }
        >
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
                    href="https://liberapay.com/stray.codes/donate"
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
    );
};

export const MadeByMobile = () => {
    const { toggleFullscreen } = useFullscreen();

    return (
        <div className="flex flex-col size-full">
            <div className="flex flex-col justify-around items-center gap-2 size-full">
                <div className="flex flex-col gap-2 items-center w-2/3 max-w-[20vh]">
                    <img src="chordinator.svg" className="w-full" />
                    <h1 className="text-xl text-cyan-300">Chordinator</h1>
                </div>
                <div className="flex flex-col gap-2 items-center p-1">
                    <a
                        className="text-yellow-400 text-center"
                        href="https://stray.codes/"
                    >
                        Made by Karol Czopek
                    </a>
                    <div className="flex gap-2 flex-wrap items-center justify-center">
                        <a
                            href="https://github.com/stray-codes/chordinator"
                            className="hover:text-yellow-300"
                        >
                            Github
                        </a>
                        <a
                            href="https://liberapay.com/stray.codes/donate"
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
            </div>

            <div className="flex flex-col w-full h-1/3 items-center justify-center">
                <Button variant="outline" onClick={() => toggleFullscreen()}>
                    Toggle fullscreen
                </Button>
            </div>
        </div>
    );
};
