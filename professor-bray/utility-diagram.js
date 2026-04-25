// utility-diagram.js — clone of exaction-diagram-v2.js for utility data
(function () {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';

  var VX = -320, VY = -200, VW = 1960, VH = 1400;
  var NW = 340, NH = 110, NRX = 10;
  var SW   = 9;
  var SG   = 10;
  var AL   = 18;
  var DST_GAP = 36;
  var AW   = 16;
  var BOW  = 130;
  var FS   = 16;
  var LH   = 20;
  var CW   = 9.2;

  var POS = {
    'N-GOV':    { x: 600,  y: 80   },
    'N-COMP':   { x: 1300, y: 780  },
    'N-PEOPLE': { x: -80,  y: 780  }
  };

  var NODE_LABELS = {
    'N-GOV':    'Government',
    'N-COMP':   'Companies',
    'N-PEOPLE': 'American People'
  };

  var COLORS = {
    'money-out':   '#B5623A',
    'money-in':    '#4A7D58',
    'legal-power': '#4A6FB5',
    'suppressed':  '#6a7088'
  };

  var COLORS_BORDER = {
    'money-out':   '#5a2a14',
    'money-in':    '#1e3d28',
    'legal-power': '#1e2e5a',
    'suppressed':  '#2a2c3a'
  };

  var DIR_MAP = { 'G': 'N-GOV', 'C': 'N-COMP', 'P': 'N-PEOPLE' };

  var CENTROID_X = (600 + 1300 + (-80)) / 3;
  var CENTROID_Y = (80 + 780 + 780) / 3;

  function svgEl(tag, attrs) {
    var e = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }

  function clipToFace(pos, ux, uy) {
    var hw = NW / 2, hh = NH / 2;
    var tx = ux !== 0 ? hw / Math.abs(ux) : Infinity;
    var ty = uy !== 0 ? hh / Math.abs(uy) : Infinity;
    if (tx <= ty) {
      return { x: pos.x + Math.sign(ux) * hw, y: pos.y + uy * tx, horiz: false };
    } else {
      return { x: pos.x + ux * ty, y: pos.y + Math.sign(uy) * hh, horiz: true };
    }
  }

  function facePorts(fromId, toId, n, sg, centerX) {
    sg = (sg !== undefined) ? sg : SG;
    var fp = POS[fromId], tp = POS[toId];
    var dx = tp.x - fp.x, dy = tp.y - fp.y;
    var len = Math.sqrt(dx * dx + dy * dy);
    var face = clipToFace(fp, dx / len, dy / len);
    var span = (n - 1) * (SW + sg);
    var cx   = (centerX !== undefined) ? centerX : fp.x;
    var ports = [];
    for (var i = 0; i < n; i++) {
      var off = -span / 2 + i * (SW + sg);
      ports.push(face.horiz
        ? { x: cx + off, y: face.y }
        : { x: face.x,   y: fp.y + off });
    }
    return ports;
  }

  var GOV_ZONE_LEFT  = 490;
  var GOV_ZONE_RIGHT = 700;

  function render(data) {
    var container = document.getElementById('utility-diagram');
    if (!container) return;

    var svg = svgEl('svg', {
      viewBox: VX + ' ' + VY + ' ' + VW + ' ' + VH,
      width: '100%',
      style: 'display:block; min-height:800px'
    });

    var defs = svgEl('defs', {});

    // Arrowhead markers — suppressed category gets no marker
    ['money-out', 'money-in', 'legal-power'].forEach(function (cat) {
      var m = svgEl('marker', {
        id: 'ut-arr-' + cat,
        markerWidth:  String(AL),
        markerHeight: String(AW),
        refX:   '0',
        refY:   String(AW / 2),
        orient: 'auto',
        markerUnits: 'userSpaceOnUse'
      });
      m.appendChild(svgEl('path', {
        d: 'M0,0 L0,' + AW + ' L' + AL + ',' + (AW / 2) + ' z',
        fill: COLORS[cat]
      }));
      defs.appendChild(m);
    });

    var grad = svgEl('radialGradient', {
      id: 'ut-bg',
      gradientUnits: 'userSpaceOnUse',
      cx: String(CENTROID_X), cy: String(CENTROID_Y),
      r:  '1100'
    });
    grad.appendChild(svgEl('stop', { offset: '0%',   'stop-color': '#252a42' }));
    grad.appendChild(svgEl('stop', { offset: '100%', 'stop-color': '#0d1020' }));
    defs.appendChild(grad);

    var nodeGrad = svgEl('linearGradient', { id: 'ut-node-fill', x1: '0', y1: '0', x2: '0', y2: '1' });
    nodeGrad.appendChild(svgEl('stop', { offset: '0%',   'stop-color': '#2e3350' }));
    nodeGrad.appendChild(svgEl('stop', { offset: '100%', 'stop-color': '#1a1e35' }));
    defs.appendChild(nodeGrad);

    var textGlow = svgEl('filter', { id: 'ut-text-glow', x: '-50%', y: '-200%', width: '200%', height: '500%' });
    textGlow.appendChild(svgEl('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: '2', result: 'blur' }));
    var feMerge = svgEl('feMerge', {});
    feMerge.appendChild(svgEl('feMergeNode', { in: 'blur' }));
    feMerge.appendChild(svgEl('feMergeNode', { in: 'SourceGraphic' }));
    textGlow.appendChild(feMerge);
    defs.appendChild(textGlow);

    var labelTextGrad = svgEl('linearGradient', {
      id: 'ut-label-text', gradientUnits: 'userSpaceOnUse',
      x1: '0', y1: String(-LH / 2), x2: '0', y2: String(LH / 2)
    });
    labelTextGrad.appendChild(svgEl('stop', { offset: '0%',   'stop-color': '#f0d080' }));
    labelTextGrad.appendChild(svgEl('stop', { offset: '45%',  'stop-color': '#c4a550' }));
    labelTextGrad.appendChild(svgEl('stop', { offset: '100%', 'stop-color': '#7a5520' }));
    defs.appendChild(labelTextGrad);

    var nodeBorder = svgEl('linearGradient', { id: 'ut-node-border', x1: '0', y1: '0', x2: '0', y2: '1' });
    nodeBorder.appendChild(svgEl('stop', { offset: '0%',   'stop-color': '#f0d080' }));
    nodeBorder.appendChild(svgEl('stop', { offset: '45%',  'stop-color': '#c4a550' }));
    nodeBorder.appendChild(svgEl('stop', { offset: '100%', 'stop-color': '#7a5520' }));
    defs.appendChild(nodeBorder);
    svg.appendChild(defs);

    svg.appendChild(svgEl('image', {
      href: '../assets/bg-diagram.jpeg',
      x: String(VX), y: String(VY), width: String(VW), height: String(VH),
      preserveAspectRatio: 'xMidYMid slice'
    }));

    svg.appendChild(svgEl('rect', {
      x: String(VX), y: String(VY), width: String(VW), height: String(VH),
      fill: 'url(#ut-bg)',
      opacity: '0.78'
    }));

    // Group edges by sorted node-pair bundle key
    var bundles = {};
    data.edges.forEach(function (edge) {
      var parts = edge.direction.split('→').map(function (s) { return s.trim(); });
      if (parts.length !== 2 || !DIR_MAP[parts[0]] || !DIR_MAP[parts[1]]) return;
      var srcId = DIR_MAP[parts[0]], dstId = DIR_MAP[parts[1]];
      var key = [srcId, dstId].sort().join('|');
      if (!bundles[key]) {
        var ids = key.split('|');
        bundles[key] = { nA: ids[0], nB: ids[1], items: [] };
      }
      bundles[key].items.push({ edge: edge, srcId: srcId, dstId: dstId });
    });

    var edgesG  = svgEl('g', {});
    var labelsG = svgEl('g', {});
    svg.appendChild(edgesG);

    Object.keys(bundles).forEach(function (key) {
      var b  = bundles[key];
      var nA = b.nA, nB = b.nB;
      var pA = POS[nA], pB = POS[nB];
      var n  = b.items.length;

      var bmx = (pA.x + pB.x) / 2, bmy = (pA.y + pB.y) / 2;
      var ox  = bmx - CENTROID_X,   oy  = bmy - CENTROID_Y;
      var ol  = Math.sqrt(ox * ox + oy * oy);
      ox /= ol; oy /= ol;

      var bundleSG  = (key === 'N-COMP|N-GOV' || key === 'N-GOV|N-PEOPLE') ? 25
                    : (key === 'N-COMP|N-PEOPLE') ? SG + 5
                    : SG;
      var bundleBOW = (key === 'N-COMP|N-PEOPLE') ? 0 : BOW;

      var sorted  = b.items.slice().sort(function (a, c) {
        return a.edge.id < c.edge.id ? -1 : 1;
      });
      var cxA = (key === 'N-GOV|N-PEOPLE' && nA === 'N-GOV') ? GOV_ZONE_LEFT
               : (key === 'N-COMP|N-GOV'   && nA === 'N-GOV') ? GOV_ZONE_RIGHT
               : undefined;
      var cxB = (key === 'N-GOV|N-PEOPLE' && nB === 'N-GOV') ? GOV_ZONE_LEFT
               : (key === 'N-COMP|N-GOV'   && nB === 'N-GOV') ? GOV_ZONE_RIGHT
               : undefined;
      var portsA = facePorts(nA, nB, n, bundleSG, cxA);
      var portsB = facePorts(nB, nA, n, bundleSG, cxB);

      sorted.forEach(function (item, i) {
        var srcId = item.srcId, dstId = item.dstId, edge = item.edge;
        var isSuppressed = (edge.color_category === 'suppressed');

        var srcPt = (srcId === nA) ? portsA[i] : portsB[i];
        var dstPt = (dstId === nA) ? portsA[i] : portsB[i];

        var mx = (srcPt.x + dstPt.x) / 2;
        var my = (srcPt.y + dstPt.y) / 2;
        var cpX = mx + ox * bundleBOW;
        var cpY = my + oy * bundleBOW;

        var edx = dstPt.x - cpX, edy = dstPt.y - cpY;
        var el2 = Math.sqrt(edx * edx + edy * edy);
        var drawX = dstPt.x - (edx / el2) * DST_GAP;
        var drawY = dstPt.y - (edy / el2) * DST_GAP;

        var sdx = cpX - srcPt.x, sdy = cpY - srcPt.y;
        var sl2 = Math.sqrt(sdx * sdx + sdy * sdy);
        var drawSrcX = srcPt.x + (sdx / sl2) * AL;
        var drawSrcY = srcPt.y + (sdy / sl2) * AL;

        // Suppressed: terminate path at t=0.5 of the full bezier, no arrowhead
        var endX = drawX, endY = drawY;
        if (isSuppressed) {
          endX = 0.25 * drawSrcX + 0.5 * cpX + 0.25 * drawX;
          endY = 0.25 * drawSrcY + 0.5 * cpY + 0.25 * drawY;
        }

        var color = COLORS[edge.color_category] || '#888';
        var d = 'M ' + drawSrcX.toFixed(1) + ' ' + drawSrcY.toFixed(1) +
                ' Q ' + cpX.toFixed(1) + ' ' + cpY.toFixed(1) +
                ' '   + endX.toFixed(1) + ' ' + endY.toFixed(1);
        var clusters = (edge.clusters && edge.clusters.length) ? edge.clusters.join(',') : '';

        var egId = 'ut-eg-' + edge.id;
        var eg = svgEl('linearGradient', {
          id: egId, gradientUnits: 'userSpaceOnUse',
          x1: drawSrcX.toFixed(1), y1: drawSrcY.toFixed(1),
          x2: endX.toFixed(1),     y2: endY.toFixed(1)
        });
        eg.appendChild(svgEl('stop', { offset: '0%',   'stop-color': color, 'stop-opacity': '0.35' }));
        eg.appendChild(svgEl('stop', { offset: '100%', 'stop-color': color, 'stop-opacity': '1' }));
        defs.appendChild(eg);

        // Border layer
        edgesG.appendChild(svgEl('path', {
          d: d,
          fill:           'none',
          stroke:         COLORS_BORDER[edge.color_category] || '#0a0c14',
          'stroke-width': String(SW + 4)
        }));

        // Main edge path
        var pathAttrs = {
          d: d,
          fill:           'none',
          stroke:         'url(#' + egId + ')',
          'stroke-width': String(SW),
          'data-edge-id':  edge.id,
          'data-clusters': clusters
        };
        if (!isSuppressed) {
          pathAttrs['marker-end'] = 'url(#ut-arr-' + edge.color_category + ')';
        }
        edgesG.appendChild(svgEl('path', pathAttrs));

        // Label placement — identical for all edges including suppressed
        var tMin = 0.72;
        var tMax = 0.86;
        var t = (n === 1) ? tMin : tMin + (tMax - tMin) * i / (n - 1);
        var lx = (1-t)*(1-t)*srcPt.x + 2*(1-t)*t*cpX + t*t*drawX;
        var ly = (1-t)*(1-t)*srcPt.y + 2*(1-t)*t*cpY + t*t*drawY;

        var tdx = 2*(1-t)*(cpX - srcPt.x) + 2*t*(drawX - cpX);
        var tdy = 2*(1-t)*(cpY - srcPt.y) + 2*t*(drawY - cpY);
        var angle = Math.atan2(tdy, tdx) * 180 / Math.PI;
        if (angle >  90) angle -= 180;
        if (angle < -90) angle += 180;

        var lw = Math.max(edge.label.length * CW + 22, 20);

        var gLabel = svgEl('g', {
          transform: 'translate(' + lx.toFixed(1) + ',' + ly.toFixed(1) + ')' +
                     ' rotate(' + angle.toFixed(1) + ')'
        });
        gLabel.appendChild(svgEl('rect', {
          x: String((-lw / 2).toFixed(1)),
          y: String(-LH / 2),
          width:  String(lw.toFixed(1)),
          height: String(LH),
          fill:   '#1c2035',
          stroke: '#c4a550',
          'stroke-width': '1',
          rx:   '2'
        }));
        var txt = svgEl('text', {
          x: '0', y: '0',
          'dominant-baseline': 'middle',
          'text-anchor':       'middle',
          'font-size':         String(FS),
          'font-family':       "'DM Mono', monospace",
          fill:   'url(#ut-node-border)'
        });
        txt.textContent = edge.label;
        gLabel.appendChild(txt);
        labelsG.appendChild(gLabel);
      });
    });

    svg.appendChild(labelsG);

    // Nodes drawn on top
    var nodesG = svgEl('g', {});
    Object.keys(POS).forEach(function (id) {
      var p = POS[id];
      var bw = 2.5;
      nodesG.appendChild(svgEl('rect', {
        x:      String(p.x - NW / 2 - bw),
        y:      String(p.y - NH / 2 - bw),
        width:  String(NW + bw * 2),
        height: String(NH + bw * 2),
        rx:     String(NRX + bw),
        fill:   'url(#ut-node-border)'
      }));
      nodesG.appendChild(svgEl('rect', {
        x:      String(p.x - NW / 2),
        y:      String(p.y - NH / 2),
        width:  String(NW),
        height: String(NH),
        rx:     String(NRX),
        fill:   'url(#ut-node-fill)'
      }));
      var label = svgEl('text', {
        x: String(p.x), y: String(p.y),
        'dominant-baseline': 'middle',
        'text-anchor':       'middle',
        'font-size':         '26',
        'font-weight':       '600',
        'letter-spacing':    '0.04em',
        'font-family':       "'DM Sans', sans-serif",
        fill: '#e8e4dc'
      });
      label.textContent = NODE_LABELS[id];
      nodesG.appendChild(label);
    });
    svg.appendChild(nodesG);

    container.appendChild(svg);
  }

  fetch('reference/utility_edges.json')
    .then(function (r) { return r.json(); })
    .then(render)
    .catch(function (e) { console.error('[ut] load error:', e); });

})();
