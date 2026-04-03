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

import { render } from "preact";

import "./style.css";
import { Desktop } from "./desktop";
import useWindowDimensions from "./libs/screen-width";
import { Mobile } from "./mobile";

export function App() {
    const { width } = useWindowDimensions();
    if (width < 700) return <Mobile />;
    else return <Desktop />;
}

render(<App />, document.getElementById("app"));
