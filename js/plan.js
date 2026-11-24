// The one file that drives the 3D model, the floor plan and the measurements table.
// All numbers are inches. x runs left to right, y runs top to bottom on the plan.

const T = 4.5;       // wall thickness
const h = T / 2;     // walls are drawn centered on a line; this keeps the inside faces on the dimensions
const L = 279, W = 168;          // bedroom, overall
const BL = 135.5, BW = 84.5;     // bathroom
const SH = 30;                   // shower depth
const DOOR = 32;
const bedDoorX = L - 104 - DOOR;
const bathDoorX = bedDoorX - 26.5 - DOOR;
const PW = 60;                   // shower width

const by = -(T + BW);            // top inside edge of the bathroom on the plan
const pd = SH - T;               // how far the shower alcove reaches past the wall A line
const E = BW + T + pd;           // wall E, full length
const ax = PW + h;               // where wall A starts

export const plan = {
  name: 'Master Suite',
  note: '',
  ceiling: 95.25,
  wallThickness: T,

  // Floor areas (inside dimensions). x,y = top-left corner, w = width, d = depth.
  // quiet = no name label drawn. hide = floor only, left out of the tables.
  rooms: [
    { id: 'bed',  name: 'Master bedroom', x: PW + T, y: 0, w: L - PW - T, d: W, floor: 'wood' },
    { id: 'closet', name: 'Walk-in closet', label: 'CLOSET', x: 0, y: pd + T, w: PW, d: W - pd - T, floor: 'wood', labelY: 0.72 },
    { id: 'sill', name: 'Closet doorway floor', x: PW, y: pd + T, w: T, d: DOOR, floor: 'wood', quiet: true, hide: true },
    { id: 'bath', name: 'Bathroom',       x: 0, y: by, w: BL, d: BW, floor: 'tile' },
    { id: 'push', name: 'Shower alcove',  x: 0, y: -T, w: PW, d: pd + T, floor: 'tile', quiet: true },
  ],

  // Walls run from point a to point b. letter = the name tag, len = inside length.
  // room = which room the tag sits in. A wall can carry tags: [{ letter, len, at }], at = distance from point a.
  // planned: true = a new wall to build (drawn blue).
  // Openings: { type: 'door' | 'window' | 'opening', at, w, h, sill }, at = distance from point a.
  walls: [
    { room: 'bed', name: 'Bedroom door wall',
      tags: [
        { letter: 'A', len: 104, at: L - 16 - ax, name: 'Bedroom door to the window wall' },
      ],
      a: [ax, -h], b: [L + h, -h], openings: [
        { type: 'door', name: 'Bathroom door', label: 'BATH', at: bathDoorX - ax, w: DOOR, h: 80, swing: -1 },
        { type: 'door', name: 'Bedroom door', at: bedDoorX - ax, w: DOOR, h: 80 },
      ] },
    { letter: 'B', room: 'bed', len: W, name: 'Window wall', a: [L + h, -h], b: [L + h, W + h], openings: [
      { type: 'window', name: 'Window', at: (W - 48) / 2 + h, w: 48, h: 48, sill: 36 },
    ] },
    { letter: 'C', room: 'bed', len: L, name: 'Long wall, behind the bed', a: [L + h, W + h], b: [-h, W + h], openings: [] },
    { letter: 'D', room: 'closet', len: W - pd - T, name: 'Walk-in closet end wall', a: [-h, W + h], b: [-h, pd + h], openings: [] },

    // Bathroom
    { letter: 'E', room: 'bath', len: E,  name: 'Bathroom side wall, toilet and shower side', a: [-h, pd + h], b: [-h, by - h], openings: [] },
    { room: 'bath', name: 'Bathroom vanity wall', tags: [{ letter: 'F', len: BL, at: 122 + h, name: 'Bathroom vanity wall' }], a: [-h, by - h], b: [BL + h, by - h], openings: [] },
    { letter: 'G', room: 'bath', len: BW, name: 'Bathroom side wall, bedroom door side', a: [BL + h, by - h], b: [BL + h, -h], openings: [] },

    // Shower wall and its end wall
    { letter: 'SHOWER', planned: true, room: 'closet', len: PW + T, name: 'Shower wall, between the shower and the closet',
      a: [-h, pd + h], b: [ax, pd + h], openings: [] },
    { planned: true, name: 'Shower end wall', a: [ax, pd + h], b: [ax, -h], openings: [] },

    // Wall H: closet wall with the closet doorway
    { letter: 'H', planned: true, room: 'bed', len: W - pd - T - DOOR, name: 'Closet wall',
      tags: [{ letter: 'H', len: W - pd - T - DOOR, at: (W - pd - T - DOOR) / 2 + h, name: 'Closet wall' }],
      a: [ax, W + h], b: [ax, pd + h], openings: [
        { type: 'opening', name: 'Closet doorway', at: W - pd - T - DOOR + h, w: DOOR, h: 80 },
      ] },
  ],

  // Fixtures and furniture. x,y = center. rot = which way its back faces (0 top, 90 right, 180 bottom, 270 left).
  // type: bed | nightstand | dresser | vanity | toilet | tub | shower | closet | tv | box
  fixtures: [
    { type: 'toilet', name: 'Toilet', x: 18, y: by + 14, w: 18, d: 28, h: 29, rot: 0,
      note: 'Standard two-piece. 29 to the top of the tank, seat at 16 to 17' },
    { type: 'vanity', name: 'Double vanity and mirror', x: 36 + 36, y: by + 11, w: 72, d: 22, h: 34.5, rot: 0, sinks: 2, mirrorW: 66, mirrorH: 36,
      note: 'Counter at 34 1/2. Mirror 66 x 36, top edge at 76 1/2' },
    { type: 'bed', name: 'King bed', x: 215, y: W - 40, w: 76, d: 80, h: 25, rot: 180,
      note: 'Headboard on wall C. 88 of open floor from the foot of the bed to wall A' },
    { type: 'nightstand', name: 'Nightstand', x: 165, y: W - 9, w: 24, d: 18, h: 24, rot: 180 },
    { type: 'nightstand', name: 'Nightstand', x: 265, y: W - 9, w: 24, d: 18, h: 24, rot: 180 },
    { type: 'tv', name: 'TV, 65 inch', x: 215, y: 1.5, w: 57, d: 3, h: 33, mount: 42, rot: 0,
      note: 'On wall A, straight across from the bed. Bottom edge 42 off the floor' },
    { type: 'shower', name: 'Shower, 60 x 30', x: PW / 2, y: pd - SH / 2, w: PW, d: SH, h: 78, rot: 180, alcove: true,
      note: 'Glass 78 tall' },
  ],
};
