// THE ONE FILE THAT DRIVES EVERYTHING.
// The 3D model, the floor plan and the measurements table are all drawn from this.
// All numbers are INCHES. x runs left to right, y runs top to bottom on the plan.
//
// placeholder: true means these are stand-in numbers until the real tape
// measurements go in. Flip it to false once the real ones are entered.

export const plan = {
  name: 'Master Suite',
  placeholder: true,
  ceiling: 96,          // ceiling height
  wallThickness: 4.5,   // 2x4 wall with drywall both sides

  // Floor areas. x,y = top-left corner, w = width (x), d = depth (y).
  // floor: 'wood' | 'tile' | 'carpet'
  rooms: [
    { id: 'bed',    name: 'Bedroom',  x: 0,   y: 0,   w: 192, d: 168, floor: 'wood' },
    { id: 'bath',   name: 'Bathroom', x: 192, y: 0,   w: 120, d: 108, floor: 'tile' },
    { id: 'closet', name: 'Closet',   x: 192, y: 108, w: 120, d: 60,  floor: 'wood' },
  ],

  // Walls run from point a to point b.
  // Openings: at = distance from point a to the near edge of the opening.
  // type: 'door' | 'window' | 'opening' (cased opening, no door)
  walls: [
    { name: 'North wall', a: [0, 0], b: [312, 0], openings: [
      { type: 'window', at: 60,  w: 72, h: 54, sill: 30 },
      { type: 'window', at: 234, w: 36, h: 36, sill: 48 },
    ] },
    { name: 'East wall', a: [312, 0], b: [312, 168], openings: [] },
    { name: 'South wall', a: [312, 168], b: [0, 168], openings: [
      { type: 'door', at: 150, w: 32, h: 80 },
    ] },
    { name: 'West wall', a: [0, 168], b: [0, 0], openings: [
      { type: 'window', at: 54, w: 60, h: 54, sill: 30 },
    ] },
    { name: 'Bedroom / bath wall', a: [192, 0], b: [192, 168], openings: [
      { type: 'door', at: 40,  w: 30, h: 80 },
      { type: 'door', at: 123, w: 30, h: 80, swing: -1 },
    ] },
    { name: 'Bath / closet wall', a: [192, 108], b: [312, 108], openings: [] },
  ],

  // Fixtures and furniture. x,y = CENTER of the piece. w = width, d = depth.
  // rot = which way its back faces: 0 = top of plan, 90 = right, 180 = bottom, 270 = left.
  // type: bed | nightstand | dresser | vanity | toilet | tub | shower | closet | box
  fixtures: [
    { type: 'bed',        name: 'King bed',   x: 62,  y: 125.5, w: 76, d: 80, rot: 180 },
    { type: 'nightstand', name: 'Nightstand', x: 11,  y: 155,   w: 20, d: 18, rot: 180 },
    { type: 'nightstand', name: 'Nightstand', x: 113, y: 155,   w: 20, d: 18, rot: 180 },
    { type: 'dresser',    name: 'Dresser',    x: 180, y: 96,    w: 44, d: 19, rot: 90 },
    { type: 'tub',        name: 'Tub',        x: 252, y: 18.5,  w: 60, d: 32, rot: 0 },
    { type: 'vanity',     name: 'Vanity',     x: 298, y: 66,    w: 48, d: 22, rot: 90, sinks: 1 },
    { type: 'toilet',     name: 'Toilet',     x: 226, y: 91.5,  w: 20, d: 28, rot: 180 },
    { type: 'closet',     name: 'Rod + shelf', x: 252, y: 153.5, w: 112, d: 24, rot: 180 },
  ],
};
