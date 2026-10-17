document.addEventListener("DOMContentLoaded", () => {
  const body = document.getElementById("article-body");
  const list = document.getElementById("blog-toc-list");
  if (!body || !list) return;

  body.querySelectorAll("h2[id]").forEach((heading) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    item.append(link);
    list.append(item);
  });
  const nav = list.closest("nav");
  if (nav && list.children.length) nav.hidden = false;

  body.querySelectorAll("table").forEach((table) => {
    if (table.closest(".table-responsive")) return;
    const wrapper = document.createElement("div");
    wrapper.className = "blog-table-scroll";
    wrapper.tabIndex = 0;
    wrapper.setAttribute("role", "region");
    wrapper.setAttribute("aria-label", "Scrollable comparison table");
    table.before(wrapper);
    wrapper.append(table);
  });
});
