(function () {
  var SVG_NS    = 'http://www.w3.org/2000/svg';
  var JSON_PATH = 'reference/exaction_edges.json';

  var VIEWBOX_W       = 900;
  var VIEWBOX_H       = 540;
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
  var PORT_SPACING_AP_COMP = 6;    // AP right face: 9 edges toward COMP (span 48 ≤ height 56)
  var STAGGER_RANGE_MIN    = 0.25; // label t-range start for dense bundles
  var STAGGER_RANGE_MAX    = 0.75; // label t-range end   for dense bundles
  var STAGGER_THRESHOLD    = 3;    // combined bundle size that triggers staggering

  var POSITIONS = {
    'N-GOV':    { x: 450, y: 50  },
    'N-COMP':   { x: 725, y: 420 },
    'N-PEOPLE': { x: 175, y: 420 }
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
    // Interleaving order matches the monotone GOV/COMP port sort, which
    // prevents edge crossing at the AP end.
    var apGovBundle  = interleaveAlts(groups['P → G'] || [], groups['G → P'] || []);
    var apCompBundle = interleaveAlts(groups['P → C'] || [], groups['C → P'] || []);
    var apGovPorts   = spreadPorts('N-PEOPLE', POSITIONS['N-GOV'],  apGovBundle.length,  PORT_SPACING_AP_GOV);
    var apCompPorts  = spreadPorts('N-PEOPLE', POSITIONS['N-COMP'], apCompBundle.length, PORT_SPACING_AP_COMP);
    var apPortMap    = {};
    apGovBundle.forEach(function  (e, i) { apPortMap[e.id] = apGovPorts[i];  });
    apCompBundle.forEach(function (e, i) { apPortMap[e.id] = apCompPorts[i]; });

    // Stagger label t-values across combined bidirectional bundles.
    // A→B and B→A share the same visual channel; staggering per direction
    // group leaves both clouds centred on the same arc region.
    // Edges are sorted by ID for stable, predictable assignment, then
    // distributed evenly across [STAGGER_RANGE_MIN, STAGGER_RANGE_MAX].
    var bundleEdges = {};
    data.edges.forEach(function (e) {
      var parsed = parseDirection(e.direction);
      if (!parsed) return;
      var key = [parsed.src, parsed.dst].sort().join('|');
      if (!bundleEdges[key]) bundleEdges[key] = [];
      bundleEdges[key].push(e);
    });
    var staggerTMap = {};
    Object.keys(bundleEdges).forEach(function (key) {
      var bundle = bundleEdges[key];
      if (bundle.length < STAGGER_THRESHOLD) return;
      var sorted = bundle.slice().sort(function (a, b) {
        return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
      });
      var N = sorted.length;
      sorted.forEach(function (e, i) {
        staggerTMap[e.id] = (N === 1)
          ? 0.50
          : STAGGER_RANGE_MIN + (STAGGER_RANGE_MAX - STAGGER_RANGE_MIN) * i / (N - 1);
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
      // Left perpendicular unit vector — same fanning logic as Stage 3a.
      var pX   = -dy / len;
      var pY   =  dx / len;
      var midX = (sPos.x + dPos.x) / 2;
      var midY = (sPos.y + dPos.y) / 2;
      // G→C fans toward interior by default; flip to exterior.
      var fanSign  = (parsed.src === 'N-GOV' && parsed.dst === 'N-COMP') ? -1 : 1;
      // Pre-compute distributed ports; G↔C uses wider spacing to separate its 7 edges.
      var isGC = (parsed.src === 'N-GOV' && parsed.dst === 'N-COMP') ||
                 (parsed.src === 'N-COMP' && parsed.dst === 'N-GOV');
      var ps   = isGC ? PORT_SPACING_GC : PORT_SPACING;
      var srcPorts = spreadPorts(parsed.src, dPos, n, ps);
      var dstPorts = spreadPorts(parsed.dst, sPos, n, ps);

      group.forEach(function (edge, i) {
        var offset = (22 + i * 28) * fanSign;
        var cpX    = midX + pX * offset;
        var cpY    = midY + pY * offset;
        var cp     = { x: cpX, y: cpY };

        var srcPt  = (parsed.src === 'N-PEOPLE' && apPortMap[edge.id])
                       ? apPortMap[edge.id] : srcPorts[i];
        var dstPt  = (parsed.dst === 'N-PEOPLE' && apPortMap[edge.id])
                       ? apPortMap[edge.id] : dstPorts[i];
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
        var t = (staggerTMap[edge.id] !== undefined) ? staggerTMap[edge.id] : labelT(i, n);
        var lp  = bezierPoint(srcPt, cp, dstPt, t);
        var tan = bezierTangent(srcPt, cp, dstPt, t);

        // Rotate to align with curve tangent. If tangent points leftward, flip
        // 180° so characters always read left-to-right.
        var angle = Math.atan2(tan.y, tan.x) * 180 / Math.PI;
        if (tan.x < 0) angle += 180;

        // Background rect sized to estimated text width; masks the edge line.
        var lw  = edge.label.length * LABEL_CHAR_W + 10;
        var lhh = 7;    // half-height of masking rect (covers 3px stroke amply)

        var labelG = svgEl('g', {
          transform: 'translate(' + lp.x.toFixed(1) + ',' + lp.y.toFixed(1) + ')' +
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
      viewBox:             '0 0 ' + VIEWBOX_W + ' ' + VIEWBOX_H,
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
