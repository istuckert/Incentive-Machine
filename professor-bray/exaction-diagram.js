(function () {
  var SVG_NS    = 'http://www.w3.org/2000/svg';
  var JSON_PATH = 'reference/exaction_edges.json';

  var VIEWBOX_W       = 1200;  // expanded for wider AP/COMP spread
  var VIEWBOX_H       = 1000;  // split fan peaks at y≈756 below, y≈352 above; canvas bottom y=850
  var VIEWBOX_X       = -150;  // SVG units of left padding
  var VIEWBOX_Y       = -150;  // SVG units of top padding
  var NODE_W          = 170;
  var NODE_H          = 56;
  var NODE_RX         = 8;
  var NODE_FONT_SIZE  = '20';
  var LABEL_FONT_SIZE = '11';
  var LABEL_CHAR_W    = 6.3;   // estimated width per character at font-size 11
  var ARROW_GAP       = 12;    // SVG units between arrowhead tip and node rect border
  var PORT_SPACING    = 22;    // SVG units between adjacent port centres (default channels)
  var PORT_SPACING_GC = 28;    // wider spacing for G↔C channel (7 edges; (7-1)*28=168 ≤ 170)
  var PORT_SPACING_AP_GOV  = 22;   // AP top face: 5 edges toward GOV (span 88 ≤ width 170)
  var PORT_SPACING_AP_C_AP   = 10; // AP right face for AP↔C: span ±40 from center (face ±28)
  var PORT_SPACING_AP_C_COMP = 11; // COMP left face for AP↔C: unified 9-port span ±44 from center
  var STAGGER_RANGE_MIN    = 0.30; // label t-range start for dense bundles
  var STAGGER_RANGE_MAX    = 0.70; // label t-range end   for dense bundles
  var STAGGER_THRESHOLD    = 3;    // combined bundle size that triggers fanning + staggering
  var BOW_BASE        = 20;   // bow for first edge in a dense bundle (SVG units from chord midpoint)
  var BOW_STEP        = 35;   // additional bow per edge index step
  var BOW_MAX         = 280;  // cap — prevents S-curves on outermost edges
  var AP_C_BOW_BASE   = 30;   // C↔P-specific: base bow for split sub-fans
  var AP_C_BOW_STEP   = 95;   // C↔P-specific: step per index in each sub-fan
  var AP_C_BOW_MAX    = 450;  // C↔P-specific: cap (4-edge up max bow=315; 5-edge down max bow=410)
  var AP_C_UP_FAN_CP_X_SPREAD  = 90;  // horizontal spread per half-step for up-fan control points
  var AP_C_UP_FAN_PORT_Y_TOP   = 14;  // SVG units above node center for up-fan endpoint y-start
  var AP_C_UP_FAN_PORT_SPACING =  7;  // y-spacing between adjacent up-fan endpoints
  var BOW_BASE_GC = 55;   // G↔C unified fan base (preserves liked-edge bows: li=0→bow=55)
  var BOW_MAX_GC  = 400;  // G↔C cap — extended 10-edge fan; outermost bow=370

  var POSITIONS = {
    'N-GOV':    { x: 450, y: 50  },
    'N-COMP':   { x: 825, y: 530 },
    'N-PEOPLE': { x: 75,  y: 530 }
  };

  var EDGE_COLORS = {
    'money-out':   '#C47A5A',
    'money-in':    '#5C9468',
    'legal-power': '#5A85C8'
  };

  var DIR_MAP = { 'G': 'N-GOV', 'C': 'N-COMP', 'P': 'N-PEOPLE' };

  function svgEl(tag, attrs) {
    var el = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    return el;
  }

  function parseDirection(dirStr) {
    var parts = dirStr.split('→').map(function (s) { return s.trim(); });
    return (parts.length === 2 && DIR_MAP[parts[0]] && DIR_MAP[parts[1]])
      ? { src: DIR_MAP[parts[0]], dst: DIR_MAP[parts[1]] }
      : null;
  }

  // Returns n port points spread along the node border that the straight line from
  // approachPt to the node centre clips to. Ports are centred on the natural clip
  // point and spaced PORT_SPACING apart along the border's tangent. ARROW_GAP
  // pulls every port clear of the rect edge so arrowheads are visible.
  function spreadPorts(nodeId, approachPt, n, spacing) {
    spacing = (spacing !== undefined) ? spacing : PORT_SPACING;
    var pos  = POSITIONS[nodeId];
    var hw   = NODE_W / 2, hh = NODE_H / 2;
    var dx   = pos.x - approachPt.x;
    var dy   = pos.y - approachPt.y;
    var len  = Math.sqrt(dx * dx + dy * dy);
    if (len < 1) {
      var flat = [];
      for (var j = 0; j < n; j++) flat.push({ x: pos.x, y: pos.y });
      return flat;
    }
    var nx   = dx / len, ny = dy / len;
    var tx   = Math.abs(nx) > 1e-6 ? hw / Math.abs(nx) : Infinity;
    var ty   = Math.abs(ny) > 1e-6 ? hh / Math.abs(ny) : Infinity;
    var t    = Math.min(tx, ty) + ARROW_GAP;
    var cx   = pos.x - nx * t;
    var cy   = pos.y - ny * t;
    // Tangent runs along whichever border edge was hit.
    var tanX = (ty <= tx) ? 1 : 0;   // horizontal border → horizontal spread
    var tanY = (ty <= tx) ? 0 : 1;   // vertical border   → vertical spread
    var half = (n - 1) / 2;
    var pts  = [];
    for (var i = 0; i < n; i++) {
      var s = (i - half) * spacing;
      pts.push({ x: cx + tanX * s, y: cy + tanY * s });
    }
    return pts;
  }

  // Evaluate quadratic bezier at parameter t.
  function bezierPoint(src, cp, dst, t) {
    var mt = 1 - t;
    return {
      x: mt * mt * src.x + 2 * t * mt * cp.x + t * t * dst.x,
      y: mt * mt * src.y + 2 * t * mt * cp.y + t * t * dst.y
    };
  }

  // Tangent vector of quadratic bezier at parameter t (unnormalized).
  function bezierTangent(src, cp, dst, t) {
    return {
      x: 2 * (1 - t) * (cp.x - src.x) + 2 * t * (dst.x - cp.x),
      y: 2 * (1 - t) * (cp.y - src.y) + 2 * t * (dst.y - cp.y)
    };
  }

  // Stagger label position across an n-edge channel.
  // i=0 → t=0.20 (source-side), i=n-1 → t=0.80 (destination-side).
  function labelT(i, n) {
    if (n === 1) return 0.50;
    return 0.20 + (i / (n - 1)) * 0.60;
  }

  // Interleave two arrays alternately [a0,b0,a1,b1,…]; remainder appended.
  // Used to order AP port assignments so they pair monotonically with the
  // opposite-node ports, which eliminates crossing at the AP end.
  function interleaveAlts(a, b) {
    var out = [], max = Math.max(a.length, b.length);
    for (var ii = 0; ii < max; ii++) {
      if (ii < a.length) out.push(a[ii]);
      if (ii < b.length) out.push(b[ii]);
    }
    return out;
  }

  function buildDefs(svg) {
    var defs = svgEl('defs', {});
    Object.keys(EDGE_COLORS).forEach(function (cat) {
      var marker = svgEl('marker', {
        id:           'arrow-' + cat,
        markerWidth:  '12',
        markerHeight: '8',
        refX:         '12',
        refY:         '4',
        orient:       'auto',
        markerUnits:  'userSpaceOnUse'
      });
      marker.appendChild(svgEl('path', {
        d:    'M0,0 L0,8 L12,4 z',
        fill: EDGE_COLORS[cat]
      }));
      defs.appendChild(marker);
    });
    svg.appendChild(defs);
  }

  function renderEdges(svg, data) {
    var groups = {};
    data.edges.forEach(function (e) {
      if (!groups[e.direction]) groups[e.direction] = [];
      groups[e.direction].push(e);
    });

    // Pre-compute AP port assignments across combined bundles so all edges
    // in the AP↔GOV face (5 edges) and AP↔COMP face (9 edges) spread
    // uniformly together instead of each direction sub-group centering
    // independently at the same clip point.
    var apGovBundle  = interleaveAlts(groups['P → G'] || [], groups['G → P'] || []);
    var apCompBundle = interleaveAlts(groups['P → C'] || [], groups['C → P'] || []);
    var apGovPorts   = spreadPorts('N-PEOPLE', POSITIONS['N-GOV'],  apGovBundle.length,  PORT_SPACING_AP_GOV);
    var apCompPorts  = spreadPorts('N-PEOPLE', POSITIONS['N-COMP'], apCompBundle.length, PORT_SPACING_AP_C_AP);
    var apPortMap    = {};
    apGovBundle.forEach(function  (e, i) { apPortMap[e.id] = apGovPorts[i];  });
    apCompBundle.forEach(function (e, i) { apPortMap[e.id] = apCompPorts[i]; });

    // Unified COMP-face port map for AP↔C — same interleave order as AP side, wider spacing.
    var cpCompPorts = spreadPorts('N-COMP', POSITIONS['N-PEOPLE'], apCompBundle.length, PORT_SPACING_AP_C_COMP);
    var compPortMap = {};
    apCompBundle.forEach(function (e, i) { compPortMap[e.id] = cpCompPorts[i]; });

    // Triangle centroid — bow outward directions are relative to this point.
    var CENTROID_X = (POSITIONS['N-GOV'].x + POSITIONS['N-COMP'].x + POSITIONS['N-PEOPLE'].x) / 3;
    var CENTROID_Y = (POSITIONS['N-GOV'].y + POSITIONS['N-COMP'].y + POSITIONS['N-PEOPLE'].y) / 3;

    // Group edges into combined bidirectional bundles (A→B and B→A share one key).
    var bundleEdges = {};
    data.edges.forEach(function (e) {
      var parsed = parseDirection(e.direction);
      if (!parsed) return;
      var key = [parsed.src, parsed.dst].sort().join('|');
      if (!bundleEdges[key]) bundleEdges[key] = [];
      bundleEdges[key].push(e);
    });

    // For dense bundles (≥ STAGGER_THRESHOLD): assign a stable sort index to each
    // edge that drives both the along-edge label stagger and the CP bow offset.
    // The bow direction is outward from centroid (centroid → bundle chord midpoint).
    // C↔P uses per-bundle AP_C_BOW_* constants; all other bundles use globals.
    var staggerTMap   = {};   // edgeId → label t-value along its curve
    var bowIndexMap   = {};   // edgeId → bow index for CP fanning
    var bowOutwardMap = {};   // edgeId → outward unit vector {ox,oy}
    var bowCpXOffMap  = {};   // edgeId → horizontal cpX offset (up-fan only)

    var CP_BUNDLE_KEY = 'N-COMP|N-PEOPLE';
    var GC_BUNDLE_KEY = 'N-COMP|N-GOV';

    Object.keys(bundleEdges).forEach(function (key) {
      var bundle = bundleEdges[key];
      if (bundle.length < STAGGER_THRESHOLD) return;

      if (key === CP_BUNDLE_KEY) {
        // AP↔C: split by sorted index — first floor(N/2) edges bow above chord,
        // remainder bow below. Pure geometry optimization; not direction-semantic.
        var sorted = bundle.slice().sort(function (a, b) {
          return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
        });
        var N       = sorted.length;
        var upCount = Math.floor(N / 2);    // 4 up (E-11..E-14)
        var dnCount = N - upCount;          // 5 down (E-15..E-19)
        sorted.forEach(function (e, gi) {
          var inUp     = gi < upCount;
          var localIdx = inUp ? gi : gi - upCount;
          var localN   = inUp ? upCount : dnCount;
          staggerTMap[e.id] = (localN === 1) ? 0.50
            : STAGGER_RANGE_MIN + (STAGGER_RANGE_MAX - STAGGER_RANGE_MIN) * localIdx / (localN - 1);
          bowIndexMap[e.id]   = localIdx;
          bowOutwardMap[e.id] = inUp ? { ox: 0, oy: -1 } : { ox: 0, oy: 1 };
          bowCpXOffMap[e.id]  = inUp ? (localIdx - (upCount - 1) / 2) * AP_C_UP_FAN_CP_X_SPREAD : 0;
        });
        return;
      }

      if (key === GC_BUNDLE_KEY) {
        // G↔C: single unified outward fan. Liked edges (E-02..E-07) first, sorted by
        // ID; changed edges (E-01, E-08..E-10) appended after, also sorted by ID.
        // BOW_BASE_GC=55 preserves liked-edge bow values exactly (li=0→55 … li=5→230).
        var posA2 = POSITIONS['N-COMP'], posB2 = POSITIONS['N-GOV'];
        var cdx = posB2.x - posA2.x, cdy = posB2.y - posA2.y;
        var cdLen = Math.sqrt(cdx * cdx + cdy * cdy);
        cdx /= cdLen; cdy /= cdLen;
        var outOx = -cdy, outOy = cdx;   // left perp of chord A→B
        var midX2 = (posA2.x + posB2.x) / 2, midY2 = (posA2.y + posB2.y) / 2;
        if (outOx * (midX2 - CENTROID_X) + outOy * (midY2 - CENTROID_Y) < 0) {
          outOx = -outOx; outOy = -outOy;
        }
        var GC_CHANGED = { 'E-01': true, 'E-08': true, 'E-09': true, 'E-10': true };
        var gcAll = bundle.slice().sort(function (a, b) {
          var aC = GC_CHANGED[a.id] ? 1 : 0;
          var bC = GC_CHANGED[b.id] ? 1 : 0;
          if (aC !== bC) return aC - bC;        // liked before changed
          return a.id < b.id ? -1 : 1;          // within each group, sort by id
        });
        var gcN = gcAll.length;
        gcAll.forEach(function (e, li) {
          staggerTMap[e.id] = (gcN === 1) ? 0.50
            : STAGGER_RANGE_MIN + (STAGGER_RANGE_MAX - STAGGER_RANGE_MIN) * li / (gcN - 1);
          bowIndexMap[e.id]   = li;
          bowOutwardMap[e.id] = { ox: outOx, oy: outOy };
        });
        return;
      }

      var nodeIds = key.split('|');
      var posA = POSITIONS[nodeIds[0]], posB = POSITIONS[nodeIds[1]];
      var ox = (posA.x + posB.x) / 2 - CENTROID_X;
      var oy = (posA.y + posB.y) / 2 - CENTROID_Y;
      var oLen = Math.sqrt(ox * ox + oy * oy);
      if (oLen > 1e-6) { ox /= oLen; oy /= oLen; }

      var sorted = bundle.slice().sort(function (a, b) {
        return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
      });
      var N = sorted.length;
      sorted.forEach(function (e, i) {
        staggerTMap[e.id] = (N === 1) ? 0.50
          : STAGGER_RANGE_MIN + (STAGGER_RANGE_MAX - STAGGER_RANGE_MIN) * i / (N - 1);
        bowIndexMap[e.id]   = i;
        bowOutwardMap[e.id] = { ox: ox, oy: oy };
      });
    });

    var edgesG  = svgEl('g', { class: 'exaction-edges'  });
    var labelsG = svgEl('g', { class: 'exaction-labels' });
    svg.appendChild(edgesG);
    // labelsG appended after loop so every label renders above every edge.

    Object.keys(groups).forEach(function (dir) {
      var group  = groups[dir];
      var n      = group.length;
      var parsed = parseDirection(dir);
      if (!parsed) return;

      var sPos = POSITIONS[parsed.src];
      var dPos = POSITIONS[parsed.dst];
      var dx   = dPos.x - sPos.x;
      var dy   = dPos.y - sPos.y;
      var len  = Math.sqrt(dx * dx + dy * dy);
      // Left perpendicular unit vector — fallback for small bundles only.
      var pX   = -dy / len;
      var pY   =  dx / len;
      var midX = (sPos.x + dPos.x) / 2;
      var midY = (sPos.y + dPos.y) / 2;
      var fanSign  = (parsed.src === 'N-GOV' && parsed.dst === 'N-COMP') ? -1 : 1;
      var isGC = (parsed.src === 'N-GOV' && parsed.dst === 'N-COMP') ||
                 (parsed.src === 'N-COMP' && parsed.dst === 'N-GOV');
      var ps   = isGC ? PORT_SPACING_GC : PORT_SPACING;
      var srcPorts = spreadPorts(parsed.src, dPos, n, ps);
      var dstPorts = spreadPorts(parsed.dst, sPos, n, ps);
      // C↔P uses larger per-bundle bow constants and compPortMap for COMP endpoints.
      var bundleKey  = [parsed.src, parsed.dst].sort().join('|');
      var isAPCBundle = (bundleKey === CP_BUNDLE_KEY);
      var isGCBundle  = (bundleKey === GC_BUNDLE_KEY);
      var bBase = isAPCBundle ? AP_C_BOW_BASE : (isGCBundle ? BOW_BASE_GC : BOW_BASE);
      var bStep = isAPCBundle ? AP_C_BOW_STEP : BOW_STEP;
      var bMax  = isAPCBundle ? AP_C_BOW_MAX  : (isGCBundle ? BOW_MAX_GC  : BOW_MAX);

      group.forEach(function (edge, i) {
        // Dense bundles: fan control points outward from centroid using per-edge bow.
        // Small bundles (< STAGGER_THRESHOLD): legacy left-perpendicular offset.
        var bowIdx = bowIndexMap[edge.id];
        var cpX, cpY;
        if (bowIdx !== undefined) {
          var outward = bowOutwardMap[edge.id];
          var bow = Math.min(bBase + bStep * bowIdx, bMax);
          cpX = midX + outward.ox * bow + (bowCpXOffMap[edge.id] || 0);
          cpY = midY + outward.oy * bow;
        } else {
          var offset = (22 + i * 28) * fanSign;
          cpX = midX + pX * offset;
          cpY = midY + pY * offset;
        }
        var cp = { x: cpX, y: cpY };

        var isUpFan = isAPCBundle && bowOutwardMap[edge.id] && bowOutwardMap[edge.id].oy === -1;
        var srcPt, dstPt;
        if (isUpFan) {
          var upFanPortY  = POSITIONS['N-PEOPLE'].y - AP_C_UP_FAN_PORT_Y_TOP + bowIndexMap[edge.id] * AP_C_UP_FAN_PORT_SPACING;
          var apUpFanPt   = { x: POSITIONS['N-PEOPLE'].x + NODE_W / 2, y: upFanPortY };
          var compUpFanPt = { x: POSITIONS['N-COMP'].x   - NODE_W / 2, y: upFanPortY };
          srcPt = (parsed.src === 'N-PEOPLE') ? apUpFanPt : compUpFanPt;
          dstPt = (parsed.dst === 'N-PEOPLE') ? apUpFanPt : compUpFanPt;
        } else if (parsed.src === 'N-PEOPLE' && apPortMap[edge.id]) {
          srcPt = apPortMap[edge.id];
        } else if (parsed.src === 'N-COMP' && isAPCBundle && compPortMap[edge.id]) {
          srcPt = compPortMap[edge.id];
        } else {
          srcPt = srcPorts[i];
        }
        if (!isUpFan) {
          if (parsed.dst === 'N-PEOPLE' && apPortMap[edge.id]) {
            dstPt = apPortMap[edge.id];
          } else if (parsed.dst === 'N-COMP' && isAPCBundle && compPortMap[edge.id]) {
            dstPt = compPortMap[edge.id];
          } else {
            dstPt = dstPorts[i];
          }
        }
        var color  = EDGE_COLORS[edge.color_category] || '#888';

        // ── Edge path ────────────────────────────────────────────────────────
        edgesG.appendChild(svgEl('path', {
          d: [
            'M', srcPt.x.toFixed(1), srcPt.y.toFixed(1),
            'Q', cpX.toFixed(1), cpY.toFixed(1),
                 dstPt.x.toFixed(1), dstPt.y.toFixed(1)
          ].join(' '),
          fill:           'none',
          stroke:         color,
          'stroke-width': '3',
          'marker-end':   'url(#arrow-' + edge.color_category + ')',
          class:          'exaction-edge edge-' + edge.color_category,
          'data-edge-id': edge.id
        }));

        // ── Inline label ─────────────────────────────────────────────────────
        // labelOverride.locked bypasses parametric placement entirely.
        // Labels sit directly on their fanned edges — no perpendicular offset.
        var ovr = edge.labelOverride;
        var t;
        if (ovr && ovr.locked) {
          t = (ovr.t !== undefined) ? ovr.t : 0.50;
        } else {
          t = (staggerTMap[edge.id] !== undefined) ? staggerTMap[edge.id] : labelT(i, n);
        }
        var lp  = bezierPoint(srcPt, cp, dstPt, t);
        var tan = bezierTangent(srcPt, cp, dstPt, t);

        var labelX = lp.x, labelY = lp.y;
        if (ovr && ovr.locked) {
          labelX = lp.x + (ovr.dx || 0);
          labelY = lp.y + (ovr.dy || 0);
        }

        // Rotate to align with curve tangent. If tangent points leftward, flip
        // 180° so characters always read left-to-right.
        var angle = Math.atan2(tan.y, tan.x) * 180 / Math.PI;
        if (tan.x < 0) angle += 180;

        // Background rect sized to estimated text width; masks the edge line.
        var lw  = edge.label.length * LABEL_CHAR_W + 10;
        var lhh = 7;    // half-height of masking rect (covers 3px stroke amply)

        var labelG = svgEl('g', {
          transform: 'translate(' + labelX.toFixed(1) + ',' + labelY.toFixed(1) + ')' +
                     ' rotate(' + angle.toFixed(1) + ')',
          class: 'exaction-label-group'
        });

        labelG.appendChild(svgEl('rect', {
          x:      (-lw / 2).toFixed(1),
          y:      String(-lhh),
          width:  lw.toFixed(1),
          height: String(lhh * 2),
          class:  'exaction-label-bg'
        }));

        var txt = svgEl('text', {
          x:                   '0',
          y:                   '0',
          'dominant-baseline': 'middle',
          'text-anchor':       'middle',
          'font-size':         LABEL_FONT_SIZE,
          class:               'exaction-edge-label'
        });
        txt.textContent = edge.label;
        labelG.appendChild(txt);
        labelsG.appendChild(labelG);
      });
    });

    svg.appendChild(labelsG);
  }

  function buildSVG() {
    return svgEl('svg', {
      viewBox:             VIEWBOX_X + ' ' + VIEWBOX_Y + ' ' + VIEWBOX_W + ' ' + VIEWBOX_H,
      preserveAspectRatio: 'xMidYMid meet',
      'aria-label':        'Exactions triangle diagram',
      role:                'img',
      id:                  'exaction-svg'
    });
  }

  function renderNode(svg, node) {
    var pos = POSITIONS[node.id];
    if (!pos) return;
    var g = svgEl('g', { class: 'exaction-node', 'data-node-id': node.id });
    var rect = svgEl('rect', {
      x:      pos.x - NODE_W / 2,
      y:      pos.y - NODE_H / 2,
      width:  NODE_W,
      height: NODE_H,
      rx:     NODE_RX,
      class:  'exaction-node-rect'
    });
    var text = svgEl('text', {
      x:                   pos.x,
      y:                   pos.y,
      'dominant-baseline': 'middle',
      'text-anchor':       'middle',
      'font-size':         NODE_FONT_SIZE,
      class:               'exaction-node-label'
    });
    text.textContent = node.label;
    g.appendChild(rect);
    g.appendChild(text);
    svg.appendChild(g);
  }

  function init() {
    var container = document.getElementById('exaction-diagram');
    if (!container) return;
    fetch(JSON_PATH)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        var svg = buildSVG();
        buildDefs(svg);
        renderEdges(svg, data);
        data.nodes.forEach(function (node) { renderNode(svg, node); });
        container.appendChild(svg);
      })
      .catch(function (err) {
        console.error('exaction-diagram:', err);
      });
  }

  document.addEventListener('DOMContentLoaded', init);
}());
