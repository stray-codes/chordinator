import { render } from "preact";

import "./style.css";
import { Main } from "./main";

export function App() {
    return (
        <div className="h-screen w-screen">
            <Main />
        </div>
    );
}

render(<App />, document.getElementById("app"));
