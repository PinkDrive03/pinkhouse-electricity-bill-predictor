(function () {
  const badRe = /[ÃÄÂÆ]|á»|áº|Â©|â‚«|Ã„'|Ã¢'Â«|\uFFFD/;

  function score(s) {
    const m = s.match(/[ÃÄÂÆ]|á»|áº|Â©|â‚«|Ã„'|Ã¢'Â«|\uFFFD|\?\?/g);
    return m ? m.length : 0;
  }

  function toByteArray(str) {
    const arr = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      arr[i] = str.charCodeAt(i) & 0xff;
    }
    return arr;
  }

  function decodeRound(str) {
    try {
      const bytes = toByteArray(str);
      return new TextDecoder('utf-8').decode(bytes);
    } catch {
      return str;
    }
  }

  function fixText(str) {
    let best = str;
    let cur = str;
    for (let i = 0; i < 3; i++) {
      const next = decodeRound(cur);
      if (score(next) < score(best)) best = next;
      if (next === cur) break;
      cur = next;
    }

    best = best
      .replace(/Ã„'/g, 'đ')
      .replace(/Ã¢'Â«|â‚«/g, '₫')
      .replace(/Â©/g, '©');

    return best;
  }

  function repair() {
    if (badRe.test(document.title)) document.title = fixText(document.title);

    const root = document.body || document.documentElement;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    for (const n of nodes) {
      const t = n.nodeValue;
      if (!t || !badRe.test(t)) continue;
      const fixed = fixText(t);
      if (fixed !== t) n.nodeValue = fixed;
    }

    const attrs = ['title', 'placeholder', 'aria-label', 'alt'];
    root.querySelectorAll('*').forEach((el) => {
      attrs.forEach((a) => {
        const v = el.getAttribute(a);
        if (!v || !badRe.test(v)) return;
        const fixed = fixText(v);
        if (fixed !== v) el.setAttribute(a, fixed);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', repair, { once: true });
  } else {
    repair();
  }
})();
