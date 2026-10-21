document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("studentProjectForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const fields = new FormData(form);
    const value = (name) => String(fields.get(name) || "").trim();
    const details = [
      ["Student name", "name"],
      ["Student ID", "student_id"],
      ["University", "university"],
      ["Program / semester", "program_semester"],
      ["Country / time zone", "country_timezone"],
      ["Project", "project_title"],
      ["Project field", "project_area"],
      ["Current phase", "project_stage"],
      ["Support needed", "support_needed"],
      ["Deadline", "deadline"],
      ["Requirements / progress", "message"],
      ["Project link", "project_link"],
    ].filter(([, name]) => value(name))
      .map(([label, name]) => `${label}: ${value(name)}`);

    const message = [
      "Hello Imran, I would like to discuss student project support.",
      "",
      ...details,
    ].join("\n");

    // Same support number used by the Intelligent Bug Hunting Platform project.
    window.open(`https://wa.me/923146809271?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });
});
