
<div align="right">
  <a href="https://liberapay.com/stray.codes/donate"><img alt="Donate using Liberapay" src="https://liberapay.com/assets/widgets/donate.svg"></a>
</div>
<div align="center">
  <img height="128" width="128" src="./public/chordinator.svg">
  <h1><a href="https://chords.stray.codes">Chordinator</a></h1>
  <h4>A tool to visualize sequences, chords and intervals on string instruments.</h4>
</div>


## How to use?
Select your instrument on the bottom right of the screen, there are more instruments accessible through the + icon.
Then select whatever chord/sequence/interval you wan't to visualize on the bottom left of the screen.
After that just hover over any note on the keyboard or string instrument. Once you are happy with your selection just hit space
to lock your selection. Enjoy!

## FAQ
 - Why does this program exist?
 > Because I could not find a similar tool and needed one myself, so I just made it.
I am sharing it for free as I already used a lot of free resources to study the Bass and it felt only right to give something back.

 - Does this website have cookies or collect user data?
> No and it never will.

 -  Can you add string instrument/chord/sequence?
> Of course, just either create a PR or raise an issue. Check out the [`data`](https://github.com/stray-codes/chordinator/tree/main/data) folder for more info.

 -  Can you add a new feature?
> Depends, if I benefit from it myself and have the time and capacity to implement it, then YES.


## Credit
This project uses [Tonal](https://github.com/tonaljs/tonal) and [Tone.js](https://tonejs.github.io/).
 - [Tonal](https://github.com/tonaljs/tonal) is an amazing music theory library. I used it to convert between midi numbers and note names; to detect chord names and many other things.
 - [Tone.js](https://tonejs.github.io/) is a Web Audio framework for creating interactive music in the browser. All sounds you hear on my website are created with this framework.

## Building and Selfhosting
This project was made with [Preact](https://preactjs.com/).
You can build and selfhost it yourself.

-   `pnpm install` - Installs all dependencies

-   `pnpm run dev` - Starts a dev server at http://localhost:5173/

-   `pnpm run build` - Builds for production, emitting to `dist/`

-   `pnpm run preview` - Starts a server at http://localhost:4173/ to test production build locally

If you want to host it on your own server, look into Caddy or Apache server.
