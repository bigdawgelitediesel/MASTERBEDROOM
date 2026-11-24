// THE ONE FILE THAT DRIVES EVERYTHING.
// The 3D model, the floor plan and the measurements table are all drawn from this.
// All numbers are INCHES. x runs left to right, y runs top to bottom on the plan.
//
// TAPE MEASUREMENTS (2026-11-24), inside face to inside face:
//   floor to ceiling   95 1/4
//   longest wall       251 1/2 + 3 1/2 + 24      = 279
//   wall with window   168
//   other wall         103 + 108 + 4 1/2 + 23    = 238 1/2
//   another wall       81 + 3 1/2                = 84 1/2
//   door on the other wall: edge of door to the window wall = 104
//
// HOW THE SHAPE WAS READ (not confirmed yet):
//   An L. The 279 wall and the 238 1/2 wall run parallel, 168 apart, both starting
//   at the window wall. The 84 1/2 wall drops from the end of the 238 1/2 wall.
//   That leaves two sides nobody measured, which work out to 40 1/2 and 83 1/2.
//   The 3 1/2 and 4 1/2 pieces are taken as partition walls crossing the long walls.
//   Their length is unknown, so they are drawn as short stubs.

const T = 4.5;       // wall thickness
const h = T / 2;     // walls are drawn centered on a line, so push the line out half a wall
                     // to keep the INSIDE faces on the tape numbers

export const plan = {
  name: 'Master Suite',
  note: 'First pass from the tape numbers. The L shape is a best read of them and the stub walls, door width and window size are stand-ins. Not confirmed yet.',
  ceiling: 95.25,
  wallThickness: T,

  // Floor areas (inside dimensions). x,y = top-left corner, w = width, d = depth.
  rooms: [
    { id: 'main', name: 'Main area', x: 0,     y: 0, w: 238.5, d: 168,  floor: 'wood' },
    { id: 'bump', name: 'Jog',       x: 238.5, y: 0, w: 40.5,  d: 83.5, floor: 'wood' },
  ],

  // Walls run from point a to point b. Openings: at = distance from point a.
  // Layout: door wall along the bottom, longest wall along the top, window wall on the left.
  // Standing outside the door looking in, the window wall is on your left (confirmed).
  walls: [
    { name: 'Longest wall (279)',     a: [-h, -h],          b: [279 + h, -h],          openings: [] },
    { name: 'End wall (83 1/2, figured)', a: [279 + h, -h], b: [279 + h, 83.5 + h],    openings: [] },
    { name: 'Jog (40 1/2, figured)',  a: [279 + h, 83.5 + h], b: [238.5 + h, 83.5 + h], openings: [] },
    { name: 'Another wall (84 1/2)',  a: [238.5 + h, 83.5 + h], b: [238.5 + h, 168 + h], openings: [] },
    { name: 'Door wall (238 1/2)',    a: [238.5 + h, 168 + h], b: [-h, 168 + h],       openings: [
      // door edge is 104 from the window wall (measured). Width 32 is a stand-in.
      { type: 'door', at: 238.5 + h - 104 - 32, w: 32, h: 80 },
    ] },
    { name: 'Window wall (168)',      a: [-h, 168 + h],     b: [-h, -h],               openings: [
      { type: 'window', at: 62.25, w: 48, h: 48, sill: 36 },   // size and spot are stand-ins
    ] },
    // partition stubs, length unknown
    { name: 'Partition on longest wall (3 1/2, at 251 1/2)', a: [253.25, 0],   b: [253.25, 18],  openings: [] },
    { name: 'Partition on door wall (4 1/2, at 211)',        a: [213.25, 168], b: [213.25, 150], openings: [] },
  ],

  // Fixtures and furniture. x,y = CENTER. rot = which way its back faces (0 top, 90 right, 180 bottom, 270 left).
  // type: bed | nightstand | dresser | vanity | toilet | tub | shower | closet | box
  fixtures: [],
};
