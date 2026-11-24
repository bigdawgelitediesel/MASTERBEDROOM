// THE ONE FILE THAT DRIVES EVERYTHING.
// The 3D model, the floor plan and the measurements table are all drawn from this.
// All numbers are INCHES. x runs left to right, y runs top to bottom on the plan.
//
// MEASURED (2026-11-24), inside dimensions:
//   Bedroom: height 95 1/4, length 279, width 168.
//   Wall A: bedroom doorway edge to wall B = 104. Door to door (bedroom door to bathroom door) = 26 1/2.
//   Bathroom is off wall A1: 84 1/2 wide, 135 1/2 long.
//   Wall E is 103, not 84 1/2: the bathroom pushes in past wall A and takes that away from wall D.
//   That pushed-in wall (A1) ran from wall D until 24 before the BATHROOM door.
//   SHOWER (planned): standard 60 x 30 along wall A1. To get 60 inside, the return wall moves 4 toward
//   the bathroom door (20 of wall left before the door instead of 24).
//   WALL H (planned): new wall parallel to wall D with a doorway between it and wall A1.
//   The room between wall D and wall H is a WALK-IN CLOSET.
//   For the 30 depth, wall A1 moves further into the bedroom (no wall sticking into the bathroom):
//   wall E goes from the measured 103 to 114 1/2 and wall D from 149 1/2 to 138.
//   The bathroom door is on the wall A line (the 84 1/2 depth), not out on the pushed-in wall.
//
// ASSUMED, not measured yet:
//   Both doors drawn 32 wide x 80 tall. Bathroom door swings into the bathroom.
//   The 135 1/2 side of the bathroom runs along wall A, starting in line with wall D.
//   Walls are all drawn 4 1/2 thick.
//
// First tape strings from the very start, kept for reference:
//   longest wall 251 1/2 + 3 1/2 + 24; wall with window 168;
//   other wall 103 + 108 + 4 1/2 + 23; another wall 81 + 3 1/2;
//   facing the bedroom door from outside, the window wall is on the left.

// NAMES (2026-11-24): the wall that was A1 is now called SHOWER, and A2 is now just A.
// Older notes above that say A1 mean the SHOWER wall.

const T = 4.5;       // wall thickness
const h = T / 2;     // walls are drawn centered on a line, so push the line out half a wall
                     // to keep the INSIDE faces on the tape numbers
const L = 279, W = 168;          // bedroom
const BL = 135.5, BW = 84.5;     // bathroom
const SH = 30;                   // shower depth off wall A1
const DOOR = 32;
const bedDoorX = L - 104 - DOOR;             // 143
const bathDoorX = bedDoorX - 26.5 - DOOR;    // 84 1/2
const PW = 60;                   // push-in inside width, set to 60 for a standard shower pan (was 56 at 24 before the door)

const by = -(T + BW);            // top inside edge of the bathroom on the plan
const pd = SH - T;               // how far the push-in reaches into the bedroom, inside (25 1/2; was 14 as measured)
const E = BW + T + pd;           // wall E, full length (114 1/2 planned; measured today 103)
const ax = PW + h;                           // where wall A now starts (centerline of the push-in side wall)

export const plan = {
  name: 'Master Suite',
  note: '',
  ceiling: 95.25,
  wallThickness: T,

  // Floor areas (inside dimensions). x,y = top-left corner, w = width, d = depth.
  // cut = square inches taken out of this room by something pushing into it.
  // quiet = no name label drawn (small pieces). hide = floor only, left out of the tables.
  rooms: [
    { id: 'bed',  name: 'Master bedroom', x: PW + T, y: 0, w: L - PW - T, d: W, floor: 'wood' },
    // Walk-in closet: the space between wall D and wall H
    { id: 'closet', name: 'Walk-in closet', label: 'CLOSET', x: 0, y: pd + T, w: PW, d: W - pd - T, floor: 'wood', labelY: 0.72 },
    { id: 'sill', name: 'Closet doorway floor', x: PW, y: pd + T, w: T, d: DOOR, floor: 'wood', quiet: true, hide: true },
    { id: 'bath', name: 'Bathroom',       x: 0, y: by, w: BL, d: BW, floor: 'tile' },
    { id: 'push', name: 'Bathroom push-in', x: 0, y: -T, w: PW, d: pd + T, floor: 'tile', quiet: true },
  ],

  // Walls run from point a to point b. letter = the name tag, len = inside length.
  // room = which room the tag sits in. A wall split into pieces uses tags: [{ letter, len, at }],
  // at = distance from point a to the tag.
  // Openings: { type: 'door' | 'window', at, w, h, sill }, at = distance from point a.
  walls: [
    { room: 'bed', name: 'Long wall (top)',
      tags: [
        { letter: 'A', len: 104, at: L - 52 - ax, name: 'Bedroom doorway to wall B' },
      ],
      a: [ax, -h], b: [L + h, -h], openings: [
        { type: 'door', name: 'Bathroom door', label: 'BATH', at: bathDoorX - ax, w: DOOR, h: 80, swing: -1 },
        { type: 'door', name: 'Bedroom door', at: bedDoorX - ax, w: DOOR, h: 80 },
      ] },
    { letter: 'B', room: 'bed', len: W, name: 'End wall (right)',   a: [L + h, -h],    b: [L + h, W + h], openings: [] },
    { letter: 'C', room: 'bed', len: L, name: 'Long wall (bottom)', a: [L + h, W + h], b: [-h, W + h],    openings: [] },
    { letter: 'D', room: 'closet', len: W - pd - T, name: 'Closet end wall, shortened by the shower push-in', a: [-h, W + h], b: [-h, pd + h], openings: [] },

    // Bathroom. Its fourth side is wall A1, shared with the bedroom.
    { letter: 'E', room: 'bath', len: E,  name: 'Bathroom left wall, runs on down past wall A', a: [-h, pd + h], b: [-h, by - h], openings: [] },
    { room: 'bath', name: 'Bathroom back wall', tags: [{ letter: 'F', len: BL, at: 122 + h, name: 'Bathroom back wall' }],      a: [-h, by - h], b: [BL + h, by - h], openings: [] },
    { letter: 'G', room: 'bath', len: BW, name: 'Bathroom right wall (bedroom door side)',       a: [BL + h, by - h], b: [BL + h, -h], openings: [] },

    // SHOWER wall (was A1): the pushed-in bathroom wall behind the shower
    { letter: 'SHOWER', room: 'closet', len: PW + T, name: 'Pushed-in bathroom wall behind the shower',
      a: [-h, pd + h], b: [ax, pd + h], openings: [] },
    // short return from A1 back to the wall A line (not lettered yet)
    { name: 'Shower return wall (shower end wall)', a: [ax, pd + h], b: [ax, -h], openings: [] },

    // Wall H (planned): parallel to wall D, from wall C up toward wall A1, with a doorway between it and A1.
    // Drawn in line with the end of wall A1 (60 inside from wall D). That spot and the 32 doorway are assumed.
    { letter: 'H', room: 'bed', len: W - pd - T - DOOR, name: 'New wall parallel to wall D, doorway at the shower wall end',
      tags: [{ letter: 'H', len: W - pd - T - DOOR, at: (W - pd - T - DOOR) / 2 + h, name: 'New wall parallel to wall D, doorway at the shower wall end' }],
      a: [ax, W + h], b: [ax, pd + h], openings: [
        { type: 'opening', name: 'Doorway between wall H and the shower wall', at: W - pd - T - DOOR + h, w: DOOR, h: 80 },
      ] },
  ],

  // Fixtures and furniture. x,y = CENTER. rot = which way its back faces (0 top, 90 right, 180 bottom, 270 left).
  // type: bed | nightstand | dresser | vanity | toilet | tub | shower | closet | box
  fixtures: [
    // Existing toilet, in the corner of walls E and F. Exact spot and which wall its back is on are assumed (back on F, 18 off E).
    { type: 'toilet', name: 'Toilet (existing)', x: 18, y: by + 14, w: 18, d: 28, h: 29, rot: 0,
      note: 'Standard two-piece: tank 18 wide, 29 to tank top, seat at 16 to 17, 28 front to back' },
    // Double vanity + mirror (planned), on wall F next to the toilet. 72 wide x 22 deep is assumed, starting 36 off wall E.
    { type: 'vanity', name: 'Double vanity + mirror', x: 36 + 36, y: by + 11, w: 72, d: 22, h: 34.5, rot: 0, sinks: 2, mirrorW: 66, mirrorH: 36,
      note: 'Counter at 34 1/2. Mirror 66 x 36, bottom edge 40 1/2 off the floor, top at 76 1/2' },
    { type: 'shower', name: 'Shower 60 x 30', x: PW / 2, y: pd - SH / 2, w: PW, d: SH, h: 78, rot: 180, alcove: true,
      note: 'Glass drawn 78 tall' },
  ],
};
