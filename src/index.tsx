import { render } from "preact";

import "./style.css";
import { Main } from "./main";

export function App() {
    return <Main />;
}

render(<App />, document.getElementById("app"));
