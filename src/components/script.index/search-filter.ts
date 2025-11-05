export function setupSearchFilter(): void {
  const input = document.getElementById("search") as HTMLInputElement | null;
  if (!input) return;

  const rows = Array.from(
    document.querySelectorAll<HTMLTableRowElement>(".filelist > tbody > tr")
  );

  const getText = (tr: HTMLTableRowElement): string =>
    (tr.querySelector("a")?.textContent || "").trim();

  const apply = () => {
    const q = input.value.trim().toLowerCase();
    for (const tr of rows) {
      const text = getText(tr).toLowerCase();
      const matched = q === "" || text.includes(q);
      tr.classList.toggle("hidden", !matched);
    }
  };

  input.addEventListener("input", apply);

  document.addEventListener("keydown", (evt: KeyboardEvent) => {
    const activeTag = (document.activeElement as HTMLElement | null)?.tagName;
    if (
      evt.key.toLowerCase() === "s" &&
      activeTag !== "INPUT" &&
      !evt.ctrlKey &&
      !evt.metaKey &&
      !evt.altKey
    ) {
      input.scrollIntoView({ block: "center" });
      input.focus();
      evt.preventDefault();
    }
  });

  apply();
}
