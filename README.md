# elections-us2020-electoral-college

This repository contains the source code for the graphical and interactive components of the Story Lab's reporting on the US 2020 election, as well as tools used to help produce those stories.

The latest release should be accessible via:

[`https://www.abc.net.au/res/sites/news-projects/elections-us2020-electoral-college/latest/`](https://www.abc.net.au/res/sites/news-projects/elections-us2020-electoral-college/latest/)

## Stories

Here's a list of stories based on this code:

| date       | story                                                                                                                                                       | elements used                                  |
|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------|
| 2020/11/02 | [Where the US election will be won and lost](https://www.abc.net.au/news/2020-11-02/us-election-trump-biden-states-polling/12822296)                        | scrollyteller; illustration                    |
| 2020/11/04 | [What we know (and don't know) about the US election result](https://www.abc.net.au/news/2020-11-05/trump-biden-us-election-results-explained-map/12844386) | scrollyteller; live results; illustration      |
| 2020/11/05 | [Your very own US election touchscreen](https://www.abc.net.au/news/2020-11-05/trump-biden-us-election-touchscreen-interactive-paths-to-victory/12843474)   | fill-in-the-blanks; live results; illustration |
| 2020/11/05 | [Biden has the edge, but Trump still has a path to victory](https://www.abc.net.au/news/2020-11-05/us-election-trump-biden-results-map-explained/12853338 ) | scrollyteller; live results; illustration      |

## Development & deployment

This project was generated from [aunty](https://github.com/abcnews/aunty)'s `react` project template. Instructions for Story Lab's development & deployment process are documented there.

For those who are unfamiliar with aunty, running `npm install` and `npm start` should get you a development server up and running at [`https://localhost:8000/`](https://localhost:8000/).

Under the hood, webpack is building multiple source entry points into many distributable scripts. Here's a quick mapping of outputs to inputs, and what they're for:

| output             | entry / `import()`      | description                                                                                                                                                                     | example                                                |
|--------------------|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------|
| `index.js`         | `src/index.tsx`         | Loads standalone graphics / scrollytellers / fill-in-the-blanks / live results / illustrations into mount points in [Odyssey](https://github.com/abcnews/odyssey) stories       | see [Stories](#stories)                                |
| `editor.js`        | `src/editor.tsx`        | An editor used for building graphics for standalone / scrollyteller / fill-in-the-blanks usage in stories. Will generate mount points, as well as raster images for syndication | [/editor/](https://localhost:8000/editor/)             |
| `standalone.js`    | `src/standalone.tsx`    | Loads graphics into `#ecgraphic` mount points                                                                                                                                   | [/standalone/](https://localhost:8000/standalone/)     |
| `blanks.js`        | `src/blanks.tsx`        | Loads fill-in-the-blanks graphics (with or without live results) into `#ecblanks` mount points                                                                                  | [/blanks/](https://localhost:8000/blanks/)             |
| `live.js`          | `src/live.tsx`          | Loads a live results dashboard (graphic + all state results modules) into an  `#ecalllive`  mount point                                                                         | [/live/](https://localhost:8000/live/)                 |
| `illustrations.js` | `src/illustrations.tsx` | Loads SVG illustrations into  `#ecillustration`  mount points (as `<iframe>`s, to universally support SVG animations)                                                           | [/illustration/](https://localhost:8000/illustration/) |
| `doc-block.js`     | `src/doc-block.tsx`     | Parses and loads scrollytellers from  available Google Docs `*/pub` document URLs (to allow collaborative scrollyteller production outside our CMS) into an `#ecdb` mount point | [/doc-block/](https://localhost:8000/doc-block/)       |
| `polyfills.js`     | `src/polyfills.ts`      | Polyfills all missing platform features. Used on example pages for IE11 support, and in stories running atop ABC News' Phase 1 web application.                                 | -                                                      |
| `fallbacks.js`     | `src/fallbacks.ts`      | Retrieves and downloads `.zip` bundles of `.png`s of graphics at each of the current story's scrollyteller states                                                               | -                                                      |

All live results data comes from Andrew Kesper's live results service, which may not always be available.

When releases are made, we also overwrite some documents at a consistent URL (`/elections-us2020-electoral-college/latest/`) to facilitate a simple redicret. This means producers don't need to update their URLs (for accessing the editor). Please ensure the following URL is cached-busted upon new releases:

```
https://www.abc.net.au/res/sites/news-projects/elections-us2020-electoral-college/latest/index.js
```

## Authors

- Colin Gourlay ([gourlay.colin@abc.net.au](mailto:gourlay.colin@abc.net.au))

