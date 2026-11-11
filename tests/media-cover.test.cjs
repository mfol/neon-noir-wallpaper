const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const start = html.indexOf('function mediaThumb(e)');
const end = html.indexOf('function mediaPlayback(e)', start);
assert.notEqual(start, -1, 'mediaThumb callback exists');
assert.notEqual(end, -1, 'mediaPlayback callback follows mediaThumb');

function loadMediaThumb() {
  const nodes = {
    'album-art': { src: '', style: { display: 'none' }, onerror: null, removeAttribute(name) { if (name === 'src') this.src = ''; } },
    'album-symbol': { style: { display: '' } },
  };
  const context = { $: (id) => nodes[id] };
  vm.runInNewContext(html.slice(start, end) + '\nthis.mediaThumb = mediaThumb;', context);
  return { mediaThumb: context.mediaThumb, nodes };
}

test('a broken artwork URL restores the built-in cover instead of showing a broken image', () => {
  const { mediaThumb, nodes } = loadMediaThumb();
  mediaThumb({ thumbnail: 'invalid-artwork-url' });
  assert.equal(nodes['album-art'].style.display, 'block');
  assert.equal(nodes['album-symbol'].style.display, 'none');
  assert.equal(typeof nodes['album-art'].onerror, 'function');
  nodes['album-art'].onerror();
  assert.equal(nodes['album-art'].style.display, 'none');
  assert.equal(nodes['album-symbol'].style.display, '');
  assert.equal(nodes['album-art'].src, '');
});

test('missing artwork clears stale artwork and restores the built-in cover', () => {
  const { mediaThumb, nodes } = loadMediaThumb();
  mediaThumb({ thumbnail: 'artwork-url' });
  mediaThumb(null);
  assert.equal(nodes['album-art'].style.display, 'none');
  assert.equal(nodes['album-symbol'].style.display, '');
  assert.equal(nodes['album-art'].src, '');
});
