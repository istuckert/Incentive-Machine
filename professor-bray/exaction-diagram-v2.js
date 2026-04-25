// exaction-diagram-v2.js — clean rebuild, simple uniform geometry
(function () {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';

  var VX = -320, VY = -200, VW = 1960, VH = 1400;
  var NW = 340, NH = 110, NRX = 10;
  var SW   = 9;    // stroke width
  var SG   = 10;   // gap between adjacent edges
  var AL   = 18;   // arrowhead length
  var DST_GAP = 36; // pull-back at destination end (AL + equal node whitespace)
  var AW   = 16;   // arrowhead base width
  var BOW  = 130;  // uniform bow magnitude for all bundles
  var FS   = 16;   // label font size
  var LH   = 20;   // label box height
  var CW   = 9.2;  // estimated px per character at FS=16

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
    'legal-power': '#4A6FB5'
  };

  var COLORS_BORDER = {
    'money-out':   '#5a2a14',
    'money-in':    '#1e3d28',
    'legal-power': '#1e2e5a'
  };

  var DIR_MAP = { 'G': 'N-GOV', 'C': 'N-COMP', 'P': 'N-PEOPLE' };

  var edgeData      = null;
  var clusterMap    = {};
  var edgeGroupMap  = {};
  var labelGroupMap = {};

  var CENTROID_X = (600 + 1300 + (-80)) / 3;
  var CENTROID_Y = (80 + 780 + 780) / 3;

  function svgEl(tag, attrs) {
    var e = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }

  // Find where a ray from node center in direction (ux,uy) exits the node border.
  // Returns { x, y, horiz } where horiz=true means top/bottom face.
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

  // Compute n evenly-spaced ports on the face of fromId that faces toId.
  // Ports spread along the face (horizontally on top/bottom, vertically on left/right).
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

  // GOV bottom face zone centers: G↔P left, G↔C right
  var GOV_ZONE_LEFT  = 490;  // G↔P ports centered left of GOV center (600)
  var GOV_ZONE_RIGHT = 700;  // G↔C ports centered right of GOV center (600)

  function render(data) {
    edgeData      = data;
    clusterMap    = {};
    edgeGroupMap  = {};
    labelGroupMap = {};
    data.clusters.forEach(function (c) { clusterMap[c.id] = c; });
    var container = document.getElementById('exaction-diagram-v2');
    if (!container) return;

    var svg = svgEl('svg', {
      viewBox: VX + ' ' + VY + ' ' + VW + ' ' + VH,
      width: '100%',
      style: 'display:block; min-height:800px'
    });

    // Arrowhead markers
    var defs = svgEl('defs', {});
    Object.keys(COLORS).forEach(function (cat) {
      var m = svgEl('marker', {
        id: 'v2-arr-' + cat,
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
      id: 'v2-bg',
      gradientUnits: 'userSpaceOnUse',
      cx: String(CENTROID_X), cy: String(CENTROID_Y),
      r:  '1100'
    });
    grad.appendChild(svgEl('stop', { offset: '0%',   'stop-color': '#252a42' }));
    grad.appendChild(svgEl('stop', { offset: '100%', 'stop-color': '#0d1020' }));
    defs.appendChild(grad);

    var nodeGrad = svgEl('linearGradient', { id: 'v2-node-fill', x1: '0', y1: '0', x2: '0', y2: '1' });
    nodeGrad.appendChild(svgEl('stop', { offset: '0%',   'stop-color': '#2e3350' }));
    nodeGrad.appendChild(svgEl('stop', { offset: '100%', 'stop-color': '#1a1e35' }));
    defs.appendChild(nodeGrad);

    var textGlow = svgEl('filter', { id: 'v2-text-glow', x: '-50%', y: '-200%', width: '200%', height: '500%' });
    textGlow.appendChild(svgEl('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: '2', result: 'blur' }));
    var feMerge = svgEl('feMerge', {});
    feMerge.appendChild(svgEl('feMergeNode', { in: 'blur' }));
    feMerge.appendChild(svgEl('feMergeNode', { in: 'SourceGraphic' }));
    textGlow.appendChild(feMerge);
    defs.appendChild(textGlow);

    var labelTextGrad = svgEl('linearGradient', {
      id: 'v2-label-text', gradientUnits: 'userSpaceOnUse',
      x1: '0', y1: String(-LH / 2), x2: '0', y2: String(LH / 2)
    });
    labelTextGrad.appendChild(svgEl('stop', { offset: '0%',   'stop-color': '#f0d080' }));
    labelTextGrad.appendChild(svgEl('stop', { offset: '45%',  'stop-color': '#c4a550' }));
    labelTextGrad.appendChild(svgEl('stop', { offset: '100%', 'stop-color': '#7a5520' }));
    defs.appendChild(labelTextGrad);

    var nodeBorder = svgEl('linearGradient', { id: 'v2-node-border', x1: '0', y1: '0', x2: '0', y2: '1' });
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
      fill: 'url(#v2-bg)',
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

      // Bundle bow direction: centroid → bundle midpoint
      var bmx = (pA.x + pB.x) / 2, bmy = (pA.y + pB.y) / 2;
      var ox  = bmx - CENTROID_X,   oy  = bmy - CENTROID_Y;
      var ol  = Math.sqrt(ox * ox + oy * oy);
      ox /= ol; oy /= ol;

      // Per-bundle gap: G↔C and G↔P use 15, everything else uses global SG
      var bundleSG  = (key === 'N-COMP|N-GOV' || key === 'N-GOV|N-PEOPLE') ? 25
                    : (key === 'N-COMP|N-PEOPLE') ? SG + 5
                    : SG;
      var bundleBOW = (key === 'N-COMP|N-PEOPLE') ? 0 : BOW;

      // Ports on each node face, sorted by edge ID for consistency
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

        var srcPt = (srcId === nA) ? portsA[i] : portsB[i];
        var dstPt = (dstId === nA) ? portsA[i] : portsB[i];

        // Control point: port midpoint + uniform outward bow
        var mx = (srcPt.x + dstPt.x) / 2;
        var my = (srcPt.y + dstPt.y) / 2;
        var cpX = mx + ox * bundleBOW;
        var cpY = my + oy * bundleBOW;

        // Pull dst back so arrowhead tip lands exactly at dstPt
        var edx = dstPt.x - cpX, edy = dstPt.y - cpY;
        var el2 = Math.sqrt(edx * edx + edy * edy);
        var drawX = dstPt.x - (edx / el2) * DST_GAP;
        var drawY = dstPt.y - (edy / el2) * DST_GAP;

        // Pull src forward by same distance for equal whitespace at both ends
        var sdx = cpX - srcPt.x, sdy = cpY - srcPt.y;
        var sl2 = Math.sqrt(sdx * sdx + sdy * sdy);
        var drawSrcX = srcPt.x + (sdx / sl2) * AL;
        var drawSrcY = srcPt.y + (sdy / sl2) * AL;

        var color = COLORS[edge.color_category] || '#888';
        var thisSW = (edge.id === 'E-09') ? 3 : SW;
        var d = 'M ' + drawSrcX.toFixed(1) + ' ' + drawSrcY.toFixed(1) +
                ' Q ' + cpX.toFixed(1) + ' ' + cpY.toFixed(1) +
                ' '   + drawX.toFixed(1) + ' ' + drawY.toFixed(1);
        var clusters = (edge.clusters && edge.clusters.length) ? edge.clusters.join(',') : '';

        var egId = 'v2-eg-' + edge.id;
        var eg = svgEl('linearGradient', {
          id: egId, gradientUnits: 'userSpaceOnUse',
          x1: drawSrcX.toFixed(1), y1: drawSrcY.toFixed(1),
          x2: drawX.toFixed(1),    y2: drawY.toFixed(1)
        });
        eg.appendChild(svgEl('stop', { offset: '0%',   'stop-color': color, 'stop-opacity': '0.35' }));
        eg.appendChild(svgEl('stop', { offset: '100%', 'stop-color': color, 'stop-opacity': '1' }));
        defs.appendChild(eg);

        var edgeGroup = svgEl('g', {
          'data-edge-id':  edge.id,
          'data-clusters': clusters
        });
        edgeGroup.appendChild(svgEl('path', {
          d: d,
          fill:           'none',
          stroke:         COLORS_BORDER[edge.color_category] || '#0a0c14',
          'stroke-width': String(thisSW + 4)
        }));
        edgeGroup.appendChild(svgEl('path', {
          d: d,
          fill:           'none',
          stroke:         'url(#' + egId + ')',
          'stroke-width': String(thisSW),
          'marker-end':   'url(#v2-arr-' + edge.color_category + ')'
        }));
        (function (eid) {
          edgeGroup.addEventListener('mouseenter', function () { onEdgeEnter(eid); });
          edgeGroup.addEventListener('mouseleave', onEdgeLeave);
        }(edge.id));
        edgesG.appendChild(edgeGroup);
        edgeGroupMap[edge.id] = edgeGroup;

        // Label: near arrowhead end for all bundles
        var tMin = 0.72;
        var tMax = 0.86;
        var t = (n === 1) ? tMin : tMin + (tMax - tMin) * i / (n - 1);
        var lx = (1-t)*(1-t)*srcPt.x + 2*(1-t)*t*cpX + t*t*drawX;
        var ly = (1-t)*(1-t)*srcPt.y + 2*(1-t)*t*cpY + t*t*drawY;

        // Tangent angle for label rotation
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
          fill:   'url(#v2-node-border)'
        });
        txt.textContent = edge.label;
        gLabel.appendChild(txt);
        (function (eid) {
          gLabel.addEventListener('mouseenter', function () { onEdgeEnter(eid); });
          gLabel.addEventListener('mouseleave', onEdgeLeave);
          gLabel.addEventListener('click', handleClick);
          gLabel.setAttribute('data-edge-id', eid);
          gLabel.style.cursor = 'pointer';
        }(edge.id));
        labelsG.appendChild(gLabel);
        labelGroupMap[edge.id] = gLabel;
      });
    });

    svg.appendChild(labelsG);

    // Nodes drawn on top so edges don't overdraw labels
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
        fill:   'url(#v2-node-border)'
      }));
      nodesG.appendChild(svgEl('rect', {
        x:      String(p.x - NW / 2),
        y:      String(p.y - NH / 2),
        width:  String(NW),
        height: String(NH),
        rx:     String(NRX),
        fill:   'url(#v2-node-fill)'
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

    svg.addEventListener('click', handleClick);
    container.appendChild(svg);
  }

  function setEdgeOpacity(id, opacity) {
    if (edgeGroupMap[id])  edgeGroupMap[id].style.opacity  = opacity;
    if (labelGroupMap[id]) labelGroupMap[id].style.opacity = opacity;
  }

  function onEdgeEnter(edgeId) {
    if (!edgeData) return;
    var edge = null;
    for (var i = 0; i < edgeData.edges.length; i++) {
      if (edgeData.edges[i].id === edgeId) { edge = edgeData.edges[i]; break; }
    }
    if (!edge) return;

    var clusters       = edge.clusters || [];
    var primaryCluster = clusters[0] || null;
    var secondary      = clusters.slice(1);

    var primarySet   = {};
    var secondarySet = {};

    edgeData.edges.forEach(function (e) {
      var ec = e.clusters || [];
      if (primaryCluster && ec.indexOf(primaryCluster) !== -1) {
        primarySet[e.id] = true;
      } else {
        secondary.forEach(function (sc) {
          if (ec.indexOf(sc) !== -1) secondarySet[e.id] = true;
        });
      }
    });

    Object.keys(edgeGroupMap).forEach(function (id) { setEdgeOpacity(id, 0.12); });
    Object.keys(secondarySet).forEach(function (id) { setEdgeOpacity(id, 0.45); });
    Object.keys(primarySet).forEach(function (id)   { setEdgeOpacity(id, 1);    });
    setEdgeOpacity(edgeId, 1);
  }

  function onEdgeLeave() {
    Object.keys(edgeGroupMap).forEach(function (id) { setEdgeOpacity(id, 1); });
  }

  function handleClick(evt) {
    var target = evt.target;
    var edgeId = null;
    while (target && target.tagName && target.tagName.toLowerCase() !== 'svg') {
      var candidate = target.getAttribute && target.getAttribute('data-edge-id');
      if (candidate) { edgeId = candidate; break; }
      target = target.parentNode;
    }
    if (!edgeId || !edgeData) return;

    var edge = null;
    for (var i = 0; i < edgeData.edges.length; i++) {
      if (edgeData.edges[i].id === edgeId) { edge = edgeData.edges[i]; break; }
    }
    if (!edge) return;

    var panel  = document.getElementById('exaction-info-panel');
    var tabsEl = document.getElementById('exaction-info-tabs');
    var bodyEl = document.getElementById('exaction-info-body');
    if (!panel) return;

    if (panel.style.display !== 'block') {
      panel.style.display = 'block';
      requestAnimationFrame(function () { panel.classList.add('visible'); });
      var hint = document.getElementById('exaction-hint');
      if (hint) hint.classList.add('hidden');
    }
    tabsEl.innerHTML = '';

    var clusters      = edge.clusters || [];
    var hasIndividual = !!(edge.modal && edge.modal.text);

    function escHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function showText(text) {
      var paras = text.split('\n\n').filter(function (p) { return p.trim(); });
      bodyEl.innerHTML = paras.map(function (p) {
        return '<p class="info-body">' + escHtml(p.trim()) + '</p>';
      }).join('');
    }

    function showCluster(clId) {
      var cl = clusterMap[clId];
      if (cl && cl.text) { showText(cl.text); }
      else { bodyEl.innerHTML = '<p class="info-body">' + escHtml(cl ? cl.label : clId) + '</p>'; }
    }

    function addTab(label, isActive, onClick) {
      var btn = document.createElement('button');
      btn.className = 'info-tab' + (isActive ? ' active' : '');
      btn.textContent = label;
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        tabsEl.querySelectorAll('.info-tab').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        onClick();
      });
      tabsEl.appendChild(btn);
    }

    if (hasIndividual) {
      addTab(edge.label, true, function () { showText(edge.modal.text); });
      clusters.forEach(function (clId) {
        var cl = clusterMap[clId];
        addTab(cl ? cl.label : clId, false, function () { showCluster(clId); });
      });
      showText(edge.modal.text);
    } else if (clusters.length === 0) {
      bodyEl.innerHTML = '<p class="info-body">' + escHtml(edge.label) + '</p>';
    } else if (clusters.length === 1) {
      showCluster(clusters[0]);
    } else {
      clusters.forEach(function (clId, idx) {
        var cl = clusterMap[clId];
        addTab(cl ? cl.label : clId, idx === 0, function () { showCluster(clId); });
      });
      showCluster(clusters[0]);
    }
  }

  fetch('reference/exaction_edges.json')
    .then(function (r) { return r.json(); })
    .then(render)
    .catch(function (e) { console.error('[v2] load error:', e); });

})();
