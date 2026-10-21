document.addEventListener("DOMContentLoaded", () => {
  const body = document.getElementById("article-body");
  const list = document.getElementById("blog-toc-list");
  if (!body || !list) return;

  if (body.dataset.copyCommands === "true") {
    body.querySelectorAll("pre").forEach((pre) => {
      const code = pre.querySelector("code");
      if (code && pre.closest(".language-text")) {
        const fragment = document.createDocumentFragment();
        code.textContent.split("\n").forEach((line, index, lines) => {
          const match = line.match(/^(\s*)(!.*|show\b|configure\b|interface\b|switchport\b|channel-group\b|ip\b|no\b|ping\b|copy\b|test\b|set\b|delete\b|commit\b|exit\b|vlan\b|name\b|end\b)/);
          if (match) {
            fragment.append(document.createTextNode(match[1]));
            const token = document.createElement("span");
            token.className = match[2].startsWith("!") ? "command-comment" : "command-keyword";
            token.textContent = match[2];
            fragment.append(token, document.createTextNode(line.slice(match[0].length)));
          } else fragment.append(document.createTextNode(line));
          if (index < lines.length - 1) fragment.append(document.createTextNode("\n"));
        });
        code.replaceChildren(fragment);
      }
      const button = document.createElement("button");
      button.type = "button";
      button.className = "blog-copy-code";
      button.textContent = "Copy commands";
      button.addEventListener("click", async () => {
        const text = (pre.querySelector("code") || pre).textContent;
        try {
          await navigator.clipboard.writeText(text);
          button.textContent = "Copied";
        } catch {
          button.textContent = "Select code to copy";
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(pre);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        setTimeout(() => { button.textContent = "Copy commands"; }, 2500);
      });
      pre.before(button);
    });
  }

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
