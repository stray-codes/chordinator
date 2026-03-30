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

import useWindowDimensions from "../libs/screen-width";

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
