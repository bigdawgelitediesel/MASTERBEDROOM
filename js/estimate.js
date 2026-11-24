// Material list and price estimate for the two NEW walls:
//   SHOWER wall (64 1/2 long) with its 30 return, and wall H (106 of wall + a 32 doorway),
//   both 95 1/4 tall, 2x4 framing at 16 on center, plus 4 outlets on wall H.
// Prices are ballpark big-box shelf prices, not quotes. Edit "each" as real prices come in.

export const estimate = {
  date: '2026-11-24',
  title: 'New walls: SHOWER wall and wall H, with 4 outlets on wall H',
  note: 'Ballpark shelf prices, not quotes. Check them at the store before buying. Quantities come from the drawing, which still has assumed door widths.',
  extra: 0.20, // 20% over, per Jacob: covers waste, sales tax and odds and ends
  groups: [
    { name: 'Framing', items: [
      { item: '2x4 x 8 ft stud', qty: 33, each: 4.00, note: 'Both walls: studs at 16 on center, doorway framing, corners, blocking, short plates' },
      { item: '2x4 x 12 ft', qty: 3, each: 7.50, note: 'Wall H plates: 1 bottom, 2 top' },
      { item: '2x6 x 8 ft', qty: 1, each: 7.00, note: 'Doorway header on wall H' },
      { item: '3 in construction screws or 16d nails, 5 lb', qty: 1, each: 30.00, note: '' },
      { item: 'Construction adhesive, tube', qty: 2, each: 8.00, note: 'Under the bottom plates' },
    ] },
    { name: 'Drywall and backer', items: [
      { item: '1/2 in drywall, 4 x 8 sheet', qty: 10, each: 15.00, note: 'Wall H both sides (6), closet side of the shower wall (2), return wall (1), 1 spare' },
      { item: '1/2 in cement board, 3 x 5 sheet', qty: 5, each: 14.00, note: 'Shower side of the shower wall and its return. No drywall inside a shower' },
      { item: 'Cement board screws and mesh tape', qty: 1, each: 20.00, note: '' },
      { item: 'Drywall screws 1-1/4 in, 1 lb', qty: 1, each: 9.00, note: '' },
      { item: 'Joint compound, 4.5 gal', qty: 1, each: 20.00, note: '' },
      { item: 'Paper joint tape, roll', qty: 1, each: 5.00, note: '' },
      { item: 'Corner bead, 8 ft', qty: 4, each: 5.00, note: 'Doorway sides and head, return wall corner' },
    ] },
    { name: 'Finish', items: [
      { item: 'Drywall primer, 1 gal', qty: 1, each: 25.00, note: 'About 210 sq ft of new wall face' },
      { item: 'Wall paint, 1 gal', qty: 1, each: 40.00, note: '' },
      { item: 'Baseboard, 12 ft', qty: 3, each: 20.00, note: 'About 26 ft: both sides of wall H, closet side of the shower wall, return' },
    ] },
    { name: 'Electrical: 4 outlets on wall H', items: [
      { item: '15 amp tamper-resistant outlet', qty: 4, each: 3.00, note: '' },
      { item: 'Single-gang new-work box', qty: 4, each: 1.50, note: 'Nail-on, set before drywall' },
      { item: 'Outlet cover plate', qty: 4, each: 1.00, note: '' },
      { item: '14/2 NM-B cable, 50 ft', qty: 1, each: 55.00, note: 'For a 15 amp circuit. Use 12/2 (about $70) if the circuit is 20 amp' },
      { item: 'Cable staples, wire connectors, nail plates', qty: 1, each: 16.00, note: '' },
      { item: 'AFCI breaker', qty: 1, each: 60.00, note: 'Bedroom outlets need arc-fault protection. Skip if the circuit already has it' },
    ] },
  ],
  labor: [], // material only, per Jacob
  excluded: [
    'Tearing out the pushed-in wall that is there today',
    'The shower itself: pan, drain, valve, plumbing, waterproofing, tile, glass',
    'A door for the closet doorway (drawn as an open doorway)',
    'Flooring patch where walls come out or go in',
    'Sound insulation in wall H (optional, about $75)',
    'Labor (this is a material-only estimate)',
    'Permits',
  ],
};
