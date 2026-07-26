/* ============================================================
   Heaven City — Plot Dataset (procedurally generated)
   480 plots across 12 sectors laid out on an interactive grid.
============================================================ */
(function () {
  const STATUSES = ['available', 'available', 'available', 'available', 'booked', 'reserved', 'sold', 'sold'];
  const FACINGS = ['East', 'West', 'North', 'South', 'North-East', 'South-East', 'North-West', 'South-West'];
  const ROAD_WIDTHS = [30, 40, 60, 80, 100]; // ft

  // Layout: 12 sectors laid out in a 6 cols × 2 rows super-grid,
  // each sector holds a mini grid of plots.
  const SECTOR_COLS = 6;
  const SECTORS = [
    { code: 'A', name: 'Aurum',   rows: 5, cols: 8, baseSize: 200 },
    { code: 'B', name: 'Beryl',   rows: 5, cols: 8, baseSize: 250 },
    { code: 'C', name: 'Citrine', rows: 4, cols: 10, baseSize: 300 },
    { code: 'D', name: 'Diamond', rows: 5, cols: 8, baseSize: 400 },
    { code: 'E', name: 'Emerald', rows: 4, cols: 10, baseSize: 500 },
    { code: 'F', name: 'Fern',    rows: 5, cols: 8, baseSize: 200 },
    { code: 'G', name: 'Garnet',  rows: 5, cols: 8, baseSize: 250 },
    { code: 'H', name: 'Heaven',  rows: 4, cols: 10, baseSize: 800 },
    { code: 'J', name: 'Jade',    rows: 5, cols: 8, baseSize: 300 },
    { code: 'K', name: 'Kyanite', rows: 4, cols: 10, baseSize: 400 },
    { code: 'L', name: 'Lotus',   rows: 5, cols: 8, baseSize: 200 },
    { code: 'M', name: 'Moon',    rows: 4, cols: 10, baseSize: 350 },
  ];

  // Deterministic pseudo-random using a seeded LCG
  let seed = 42;
  function rand() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
  function pick(arr) { return arr[Math.floor(rand() * arr.length)]; }

  const plots = [];
  let idNum = 100;

  SECTORS.forEach((sec, secIdx) => {
    const secCol = secIdx % SECTOR_COLS;
    const secRow = Math.floor(secIdx / SECTOR_COLS);
    for (let r = 0; r < sec.rows; r++) {
      for (let c = 0; c < sec.cols; c++) {
        idNum++;
        const isCorner = (r === 0 || r === sec.rows - 1) && (c === 0 || c === sec.cols - 1);
        const isEdgeRow = (r === 0 || r === sec.rows - 1);
        // Park facing: last row of sector B, D, H
        const isParkFacing = (sec.code === 'B' || sec.code === 'D' || sec.code === 'H') && r === sec.rows - 1;
        // Road facing: first/last row
        const isRoadFacing = isEdgeRow;
        const sizeVariation = 0.85 + rand() * 0.5;
        const area = Math.round(sec.baseSize * sizeVariation / 10) * 10;
        const pricePerYd = 22000 + Math.floor(rand() * 18000) + (isCorner ? 4000 : 0) + (isParkFacing ? 3000 : 0);
        const price = area * pricePerYd;
        const status = pick(STATUSES);
        const facing = pick(FACINGS);
        const roadWidth = pick(ROAD_WIDTHS);

        plots.push({
          id: `${sec.code}-${idNum}`,
          number: idNum,
          sector: sec.code,
          sectorName: sec.name,
          secRow, secCol,
          r, c, // local row/col within sector
          area,       // sq yd
          price,      // rupees
          pricePerYd,
          status,
          facing,
          roadWidth,
          isCorner,
          isParkFacing,
          isRoadFacing,
        });
      }
    }
  });

  window.HEAVEN_PLOTS = plots;
  window.HEAVEN_SECTORS = SECTORS;
})();
