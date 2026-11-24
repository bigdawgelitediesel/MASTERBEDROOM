// What shows on the Estimate tab. Total and what it covers only: no item prices on the site.
// The priced worksheet behind the total is notes/estimate-worksheet.js (not published to the site).

export const estimate = {
  date: '2026-11-24',
  title: 'Material estimate: shower wall and wall H',
  total: 935.40,
  note: 'Materials to build the two new walls: the shower wall with its short return, and wall H with its doorway and four outlets. Both walls are framed in 2x4 at 16 on center, 95 1/4 tall.',
  groups: [
    { name: 'Framing', items: [
      { item: '2x4 x 8 ft studs', qty: 33, note: 'Studs, doorway framing, corners, blocking' },
      { item: '2x4 x 12 ft', qty: 3, note: 'Top and bottom plates for wall H' },
      { item: '2x6 x 8 ft', qty: 1, note: 'Doorway header' },
      { item: 'Framing screws or nails, construction adhesive', qty: '', note: '' },
    ] },
    { name: 'Drywall and backer', items: [
      { item: '1/2 in drywall, 4 x 8 sheets', qty: 10, note: 'Both sides of wall H, closet side of the shower wall, return wall' },
      { item: '1/2 in cement board, 3 x 5 sheets', qty: 5, note: 'Shower side of the shower wall and its return' },
      { item: 'Screws, joint compound, tape, corner bead', qty: '', note: '' },
    ] },
    { name: 'Finish', items: [
      { item: 'Primer and wall paint', qty: '1 gal each', note: 'About 210 sq ft of new wall' },
      { item: 'Baseboard', qty: '26 ft', note: 'Both sides of wall H, closet side of the shower wall, return' },
    ] },
    { name: 'Electrical: four outlets on wall H', items: [
      { item: 'Tamper-resistant outlets, boxes and cover plates', qty: 4, note: '' },
      { item: 'Cable, staples and connectors', qty: '', note: '' },
      { item: 'Arc-fault (AFCI) breaker', qty: 1, note: 'Arc-fault protection for the bedroom circuit' },
    ] },
  ],
  excluded: [
    'Labor',
    'Removing the wall that is there today',
    'The shower itself: pan, drain, valve, plumbing, waterproofing, tile, glass',
    'A door for the closet doorway',
    'Flooring patch where walls come out or go in',
    'Permits',
  ],
};
