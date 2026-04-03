# Chords / Scales / Instruments
This folder has all the chords, scales and instruments you can find on the website.
To add more, create a PR or raise an issue.

## Chords
Each chord has a label and a list of intervals. For example:
```ts
{ label: "Minor Major 7", intervals: "0, 3, 7, 11" }
```
The intervals are a list of semitones counted from the selected Note.
For example if this chord is selected and the user hovers over D4, then D4 (0), F4 (3), A4 (7) and C5 (11) will be marked yellow.
All other D, F, A and C notes in different octaves will be marked with a slightly muted and transparent yellow.
Before you raise an issue or PR, type the intervals in the input field of the website to test if it works as expected.

## Scales
Scales work identically as Chords. Example:
```ts
{ label: "Pentatonic Major", intervals: "0, 2, 4, 7, 9" },
```

## Instruments
Each instrument has a label and a list of strings. For example:
```ts
{ label: "Guitar", strings: "E2, A2, D3, G3, B3, E4" }
```
The strings will be displayed in order from bottom to top, similar to most string notation systems (like bass tabs).
If no octave (D3, means its in the third octave) is selected, then the second octave will be used by default.
Some instruments have limited frets or no frets. In this case the `maxNumberOfFrets` can be set:
```ts
{
  label: "Harp",
  strings: "C1, D1, E1, ...",
  maxNumberOfFrets: 0,
},

```
