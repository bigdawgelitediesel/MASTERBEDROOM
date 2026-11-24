# Master Suite

Master bedroom and bathroom build. A portal with a 3D model, a dimensioned floor plan and a measurements table.

## How it works

Everything is drawn from one file: `js/plan.js`. Rooms, walls, doors, windows and fixtures are listed there in inches. Change a number, and the 3D model, the floor plan and the tables all update.

- `index.html` the page
- `js/plan.js` the measurements (edit this)
- `js/scene.js` the 3D model (three.js)
- `js/app.js` tabs, floor plan, tables
- `css/style.css` the look

No build step. It is a static site.

## Run it locally

    npx serve .

## Deploy

    vercel deploy --prod
