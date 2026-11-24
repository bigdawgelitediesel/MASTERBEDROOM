// THE ONE FILE THAT DRIVES EVERYTHING.
// The 3D model, the floor plan and the measurements table are all drawn from this.
// All numbers are INCHES. x runs left to right, y runs top to bottom on the plan.
//
// MASTER BEDROOM ONLY for now (2026-11-24). Bathroom comes later.
//   height 95 1/4, length 279, width 168 (inside dimensions)
//
// Earlier combined bedroom + bathroom tape numbers, kept for when the bathroom goes in:
//   longest wall 251 1/2 + 3 1/2 + 24; wall with window 168;
//   other wall 103 + 108 + 4 1/2 + 23; another wall 81 + 3 1/2;
//   door edge to the window wall = 104 (on the wall opposite the longest wall);
//   facing the door from outside, the window wall is on the left.

const T = 4.5;       // wall thickness
const h = T / 2;     // walls are drawn centered on a line, so push the line out half a wall
                     // to keep the INSIDE faces on the tape numbers
const L = 279, W = 168;

export const plan = {
  name: 'Master Bedroom',
  note: '',
  ceiling: 95.25,
  wallThickness: T,

  // Floor areas (inside dimensions). x,y = top-left corner, w = width, d = depth.
  rooms: [
    { id: 'bed', name: 'Master bedroom', x: 0, y: 0, w: L, d: W, floor: 'wood' },
  ],

  // Walls run from point a to point b.
  // Openings go in the openings list: { type: 'door' | 'window', at, w, h, sill }, at = distance from point a.
  walls: [
    { name: 'Long wall (top)',    a: [-h, -h],        b: [L + h, -h],     openings: [] },
    { name: 'End wall (right)',   a: [L + h, -h],     b: [L + h, W + h],  openings: [] },
    { name: 'Long wall (bottom)', a: [L + h, W + h],  b: [-h, W + h],     openings: [] },
    { name: 'End wall (left)',    a: [-h, W + h],     b: [-h, -h],        openings: [] },
  ],

  // Fixtures and furniture. x,y = CENTER. rot = which way its back faces (0 top, 90 right, 180 bottom, 270 left).
  // type: bed | nightstand | dresser | vanity | toilet | tub | shower | closet | box
  fixtures: [],
};
