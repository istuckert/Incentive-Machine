(function () {
  var SVG_NS    = 'http://www.w3.org/2000/svg';
  var JSON_PATH = 'reference/exaction_edges.json';

  var VIEWBOX_W     = 600;
  var VIEWBOX_H     = 440;
  var NODE_W        = 170;
  var NODE_H        = 56;
  var NODE_RX       = 8;
  var NODE_FONT_SIZE = '20';

  var POSITIONS = {
    'N-GOV':    { x: 300, y: 84  },
    'N-COMP':   { x: 504, y: 356 },
    'N-PEOPLE': { x: 96,  y: 356 }
  };

  function svgEl(tag, attrs) {
    var el = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    return el;
  }

  function buildSVG() {
    return svgEl('svg', {
      viewBox:              '0 0 ' + VIEWBOX_W + ' ' + VIEWBOX_H,
      preserveAspectRatio:  'xMidYMid meet',
      'aria-label':         'Exactions triangle diagram',
      role:                 'img',
      id:                   'exaction-svg'
    });
  }

  function renderNode(svg, node) {
    var pos = POSITIONS[node.id];
    if (!pos) return;

    var g = svgEl('g', {
      class:          'exaction-node',
      'data-node-id': node.id
    });

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
        data.nodes.forEach(function (node) { renderNode(svg, node); });
        container.appendChild(svg);
      })
      .catch(function (err) {
        console.error('exaction-diagram: failed to load JSON', err);
      });
  }

  document.addEventListener('DOMContentLoaded', init);
}());
