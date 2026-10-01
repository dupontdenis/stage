// 1. Collect all tag names by exploring the DOM
const tags = [];

const explore = (el) => {
  for (const child of el.children) {
    tags.push(child.nodeName);
    explore(child);
  }
};

explore(document.body);

// 2. Category function (English)
const categoriser = (rate) => {
  if (rate < 0.05) return "VeryRare";
  if (rate < 0.15) return "Rare";
  if (rate < 0.3) return "Medium";
  if (rate < 0.5) return "Frequent";
  return "Dominant";
};

// 3. Compute occurrences + rates + categories
const total = tags.length;
const occur = Object.groupBy(tags, (t) => t);

const tagStats = new Map(
  Object.entries(occur).map(([tag, list]) => {
    const count = list.length;
    const rate = count / total;
    return [tag, { category: categoriser(rate), count }];
  }),
);

// 4. Template string
const tpl = `
  <div 
    class="tag-bar"
    data-count="{{count}}"
    data-category="{{category}}">
    <span class="tag-label">{{tag}}</span>
  </div>
`;

// 5. Mini template engine
const renderTag = (tag, data) => {
  return tpl
    .replace("{{tag}}", tag)
    .replace("{{category}}", data.category)
    .replace("{{count}}", data.count);
};

// 6. Create container dynamically
const container = document.createElement("div");
container.id = "tag-bars";
document.body.appendChild(container);

// 7. Inject + set width proportional to count
const baseWidth = 80; // largeur minimale
const unitWidth = 35; // largeur par occurrence

for (const [tag, data] of tagStats.entries()) {
  container.insertAdjacentHTML("beforeend", renderTag(tag, data));
  const bar = container.lastElementChild;
  const width = baseWidth + data.count * unitWidth;
  bar.style.width = `${width}px`;
}
