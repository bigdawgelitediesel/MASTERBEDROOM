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
// BATHROOM (2026-11-24): 84 1/2 wide (corrected from 103), 135 1/2 long. It sits on the other side of wall A1.
// The 135 1/2 side is laid along wall A starting at the wall D corner, because the bathroom
// door (84 1/2 to 116 1/2 along wall A) would land past the end of an 84 1/2 side. Not confirmed.
const BL = 135.5, BW = 84.5;
const by = -(T + BW);   // top inside edge of the bathroom on the plan

export const plan = {
  name: 'Master Suite',
  note: '',
  ceiling: 95.25,
  wallThickness: T,

  // Floor areas (inside dimensions). x,y = top-left corner, w = width, d = depth.
  rooms: [
    { id: 'bed',  name: 'Master bedroom', x: 0, y: 0,  w: L,  d: W,  floor: 'wood' },
    { id: 'bath', name: 'Bathroom',       x: 0, y: by, w: BL, d: BW, floor: 'tile' },
  ],

  // Walls run from point a to point b. letter = the wall's name tag, len = inside length.
  // A wall split into pieces uses tags: [{ letter, len, at }] instead, at = distance from point a to the tag.
  // Lettered clockwise looking down: A top, B right, C bottom, D left.
  // Openings go in the openings list: { type: 'door' | 'window', at, w, h, sill }, at = distance from point a.
  walls: [
    { room: 'bed', name: 'Long wall (top)',
      // split at the doorway: A1 runs from wall D to the doorway, A2 from the doorway to wall B
      tags: [
        { letter: 'A1', len: L - 104 - 32, at: (L - 104 - 32) / 2 + h, name: 'Wall D to the doorway' },
        { letter: 'A2', len: 104,          at: L - 52 + h,             name: 'Doorway to wall B' },
      ],    a: [-h, -h],        b: [L + h, -h],     openings: [
      // doorway edge to wall B = 104 (measured). Standard doorway drawn 32 wide x 80 tall, on the far side of that mark from B.
      { type: 'door', name: 'Bedroom door', at: L - 104 - 32 + h, w: 32, h: 80 },
      // bathroom is off wall A1. Door to door = 26 1/2 (measured). Width 32 is a stand-in. Swings into the bathroom.
      { type: 'door', name: 'Bathroom door', label: 'BATH', at: L - 104 - 32 - 26.5 - 32 + h, w: 32, h: 80, swing: -1 },
    ] },
    { letter: 'B', room: 'bed', len: W, name: 'End wall (right)',   a: [L + h, -h],     b: [L + h, W + h],  openings: [] },
    { letter: 'C', room: 'bed', len: L, name: 'Long wall (bottom)', a: [L + h, W + h],  b: [-h, W + h],     openings: [] },
    { letter: 'D', room: 'bed', len: W, name: 'End wall (left)',    a: [-h, W + h],     b: [-h, -h],        openings: [] },
  ],

  // (bathroom walls are appended below the plan object)
  // Fixtures and furniture. x,y = CENTER. rot = which way its back faces (0 top, 90 right, 180 bottom, 270 left).
  // type: bed | nightstand | dresser | vanity | toilet | tub | shower | closet | box
  fixtures: [],
};

// Bathroom walls E, F, G. Its fourth wall is wall A1, shared with the bedroom.
plan.walls.push(
  { letter: 'E', room: 'bath', len: BW, name: 'Bathroom left wall (same side as wall D)', a: [-h, -h],          b: [-h, by - h],      openings: [] },
  { letter: 'F', room: 'bath', len: BL, name: 'Bathroom back wall (across from wall A1)', a: [-h, by - h],      b: [BL + h, by - h],  openings: [] },
  { letter: 'G', room: 'bath', len: BW, name: 'Bathroom right wall (bedroom door side)', a: [BL + h, by - h],  b: [BL + h, -h],      openings: [] },
);
