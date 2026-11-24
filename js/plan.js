// THE ONE FILE THAT DRIVES EVERYTHING.
// The 3D model, the floor plan and the measurements table are all drawn from this.
// All numbers are INCHES. x runs left to right, y runs top to bottom on the plan.
//
// MEASURED (2026-11-24), inside dimensions:
//   Bedroom: height 95 1/4, length 279, width 168.
//   Wall A: bedroom doorway edge to wall B = 104. Door to door (bedroom door to bathroom door) = 26 1/2.
//   Bathroom is off wall A1: 84 1/2 wide, 135 1/2 long.
//   Wall E is 103, not 84 1/2: the bathroom pushes in past wall A and takes that away from wall D.
//
// ASSUMED, not measured yet:
//   Both doors drawn 32 wide x 80 tall. Bathroom door swings into the bathroom.
//   The 135 1/2 side of the bathroom runs along wall A, starting in line with wall D.
//   The push-in is drawn 24 wide. That comes from the first tape string for the long side,
//   "251 1/2 + 3 1/2 + 24" = 279, read as bedroom + a wall + 24.
//   Walls are all drawn 4 1/2 thick.
//
// First tape strings from the very start, kept for reference:
//   longest wall 251 1/2 + 3 1/2 + 24; wall with window 168;
//   other wall 103 + 108 + 4 1/2 + 23; another wall 81 + 3 1/2;
//   facing the bedroom door from outside, the window wall is on the left.

const T = 4.5;       // wall thickness
const h = T / 2;     // walls are drawn centered on a line, so push the line out half a wall
                     // to keep the INSIDE faces on the tape numbers
const L = 279, W = 168;          // bedroom
const BL = 135.5, BW = 84.5;     // bathroom
const E = 103;                   // wall E, full length
const PW = 24;                   // push-in width (assumed)
const by = -(T + BW);            // top inside edge of the bathroom on the plan
const pd = E - BW - T;           // how far the push-in reaches into the bedroom, inside (14)
const DOOR = 32;
const bedDoorX = L - 104 - DOOR;             // 143
const bathDoorX = bedDoorX - 26.5 - DOOR;    // 84 1/2
const ax = PW + h;                           // where wall A now starts (centerline of the push-in side wall)

export const plan = {
  name: 'Master Suite',
  note: '',
  ceiling: 95.25,
  wallThickness: T,

  // Floor areas (inside dimensions). x,y = top-left corner, w = width, d = depth.
  // cut = square inches taken out of this room by something pushing into it.
  // quiet = no name label drawn (small pieces).
  rooms: [
    { id: 'bed',  name: 'Master bedroom', x: 0, y: 0,  w: L,  d: W,  floor: 'wood', cut: (PW + T) * (pd + T) },
    { id: 'bath', name: 'Bathroom',       x: 0, y: by, w: BL, d: BW, floor: 'tile' },
    { id: 'push', name: 'Bathroom push-in', x: 0, y: -T, w: PW, d: pd + T, floor: 'tile', quiet: true },
  ],

  // Walls run from point a to point b. letter = the name tag, len = inside length.
  // room = which room the tag sits in. A wall split into pieces uses tags: [{ letter, len, at }],
  // at = distance from point a to the tag.
  // Openings: { type: 'door' | 'window', at, w, h, sill }, at = distance from point a.
  walls: [
    { room: 'bed', name: 'Long wall (top)',
      // split at the bedroom doorway
      tags: [
        { letter: 'A1', len: bedDoorX - PW - T, at: 56 - ax,      name: 'Push-in to the bedroom doorway' },
        { letter: 'A2', len: 104,               at: L - 52 - ax,  name: 'Bedroom doorway to wall B' },
      ],
      a: [ax, -h], b: [L + h, -h], openings: [
        { type: 'door', name: 'Bathroom door', label: 'BATH', at: bathDoorX - ax, w: DOOR, h: 80, swing: -1 },
        { type: 'door', name: 'Bedroom door', at: bedDoorX - ax, w: DOOR, h: 80 },
      ] },
    { letter: 'B', room: 'bed', len: W, name: 'End wall (right)',   a: [L + h, -h],    b: [L + h, W + h], openings: [] },
    { letter: 'C', room: 'bed', len: L, name: 'Long wall (bottom)', a: [L + h, W + h], b: [-h, W + h],    openings: [] },
    { letter: 'D', room: 'bed', len: W - pd - T, name: 'End wall (left), shortened by the push-in', a: [-h, W + h], b: [-h, pd + h], openings: [] },

    // Bathroom. Its fourth side is wall A1, shared with the bedroom.
    { letter: 'E', room: 'bath', len: E,  name: 'Bathroom left wall, runs on down past wall A', a: [-h, pd + h], b: [-h, by - h], openings: [] },
    { letter: 'F', room: 'bath', len: BL, name: 'Bathroom back wall (across from wall A1)',      a: [-h, by - h], b: [BL + h, by - h], openings: [] },
    { letter: 'G', room: 'bath', len: BW, name: 'Bathroom right wall (bedroom door side)',       a: [BL + h, by - h], b: [BL + h, -h], openings: [] },

    // The two walls of the push-in that stand inside the bedroom (not lettered yet)
    { name: 'Push-in end wall',  a: [-h, pd + h], b: [ax, pd + h], openings: [] },
    { name: 'Push-in side wall', a: [ax, pd + h], b: [ax, -h],     openings: [] },
  ],

  // Fixtures and furniture. x,y = CENTER. rot = which way its back faces (0 top, 90 right, 180 bottom, 270 left).
  // type: bed | nightstand | dresser | vanity | toilet | tub | shower | closet | box
  fixtures: [],
};
