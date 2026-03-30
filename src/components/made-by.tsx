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
