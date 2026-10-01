const fs = require('fs');
const content = fs.readFileSync('./js/views/admin/projects-page.js', 'utf8');

// Find all backticks or weird chars in template
const match = content.match(/template:\s*`([^`]+)`/);
const tpl = match[1];

// Let's test chunks of lines of AdminProjectsPage template
const lines = tpl.split('\n');
console.log('Total lines in AdminProjectsPage:', lines.length);

const vm = require('vm');
function createMockDOM() {
  function createElement(tag) {
    const el = {
      tagName: tag.toUpperCase(),
      nodeType: 1,
      children: [], childNodes: [], attributes: {}, style: {},
      setAttribute(k, v) { this.attributes[k] = String(v); },
      getAttribute(k) { return this.attributes[k] !== undefined ? this.attributes[k] : null; },
      hasAttribute(k) { return k in this.attributes; },
      removeAttribute(k) { delete this.attributes[k]; },
      appendChild(c) { this.children.push(c); this.childNodes.push(c); c.parentNode = this; return c; },
      removeChild(c) { return c; },
      addEventListener() {}, removeEventListener() {},
      textContent: '', innerHTML: ''
    };
    Object.defineProperty(el, 'innerHTML', {
      get() { return this._html || ''; },
      set(v) {
        this._html = v; this.textContent = v;
        const match = v.match(/<div\s+([^>]+)>/);
        if (match) {
          const divChild = createElement('div');
          const attrMatch = match[1].match(/(\w+)="([^"]*)"/);
          if (attrMatch) divChild.setAttribute(attrMatch[1], attrMatch[2]);
          this.children = [divChild]; this.childNodes = [divChild];
        }
      }
    });
    return el;
  }
  return {
    createElement,
    createTextNode: (t) => ({ nodeType: 3, textContent: t, data: t }),
    createComment: (t) => ({ nodeType: 8, data: t }),
    querySelector: () => null, querySelectorAll: () => [],
    documentElement: createElement('html'), body: createElement('body')
  };
}

const doc = createMockDOM();
const ctx = {
  console, setTimeout, clearTimeout, document: doc, window: {},
  localStorage: { getItem: () => null, setItem: () => null }
};
ctx.window = ctx; ctx.window.document = doc;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('./Vue.js/vue-app/js/Vue.js', 'utf8'), ctx);

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('\\') || line.includes('`') || line.includes('${') || line.includes('&#')) {
    console.log(`Line ${i+1}:`, line);
  }
}
