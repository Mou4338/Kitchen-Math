import type { ReportData } from "@/types/report";
import { slugFile } from "@/lib/export/csv";
import { SITE } from "@/lib/site";

type AutoTableFn = (doc: unknown, options: Record<string, unknown>) => void;

const TONE_RGB: Record<string, [number, number, number]> = {
  good: [78, 122, 92],
  watch: [183, 121, 31],
  bad: [180, 67, 47],
  neutral: [138, 130, 121],
  accent: [217, 119, 11],
};

/** jsPDF's built-in fonts can't draw "₹" or "−"; swap to safe equivalents. */
function pdfSafe(text: string): string {
  return text.replace(/₹/g, "Rs ").replace(/·/g, "|").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/…/g, "...").replace(/−/g, "-").replace(/[–—]/g, "-").replace(/≤/g, "<=").replace(/≥/g, ">=").replace(/×/g, "x").replace(/÷/g, "/").replace(/→/g, "->").replace(/[^\x20-\x7E\n]/g, "");
}

/**
 * Build and download a professional PDF report.
 * jsPDF is loaded on demand so it never slows down the first page load.
 */
export async function downloadPdfReport(report: ReportData): Promise<void> {
  const [{ jsPDF }, autoTableModule] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  // jspdf-autotable v5 exports a named `autoTable`; older versions only had a default export.
  const autoTableMod = autoTableModule as unknown as { autoTable?: AutoTableFn; default?: AutoTableFn };
  const autoTable = (autoTableMod.autoTable ?? autoTableMod.default) as AutoTableFn;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 44;
  let y = 0;

  // Header band
  doc.setFillColor(29, 27, 24);
  doc.rect(0, 0, W, 78, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(pdfSafe(report.title), M, 38);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(220, 214, 204);
  doc.text(pdfSafe(`${SITE.name} restaurant calculator report  |  ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`), M, 58);
  y = 104;

  // Headline
  doc.setTextColor(29, 27, 24);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  const headLines = doc.splitTextToSize(pdfSafe(report.headline), W - M * 2);
  doc.text(headLines, M, y);
  y += headLines.length * 16 + 8;

  const table = (head: string[], body: string[][]) => {
    let tableEnd = y + 20 * (body.length + 1);
    autoTable(doc, {
      startY: y,
      head: [head.map(pdfSafe)],
      body: body.map((r) => r.map(pdfSafe)),
      margin: { left: M, right: M },
      theme: "grid",
      styles: { font: "helvetica", fontSize: 9.5, cellPadding: 6, textColor: [29, 27, 24], lineColor: [230, 225, 216] },
      headStyles: { fillColor: [240, 236, 229], textColor: [29, 27, 24], fontStyle: "bold" },
      columnStyles: head.length === 2 ? { 1: { halign: "right", fontStyle: "bold" } } : {},
      rowPageBreak: "avoid",
      didDrawPage: (data: { cursor?: { y: number } | null }) => {
        if (data.cursor) tableEnd = data.cursor.y;
      },
    });
    const last = (doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable;
    y = (last?.finalY ?? tableEnd) + 22;
  };

  const heading = (text: string) => {
    if (y > 760) { doc.addPage(); y = 56; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(168, 90, 5);
    doc.text(pdfSafe(text.toUpperCase()), M, y);
    y += 10;
  };

  heading("Inputs");
  table(["Input", "Value"], report.inputs.map((r) => [r.label, r.value]));
  heading("Results");
  table(["Result", "Value"], report.results.map((r) => [r.label, r.value]));

  // Bar chart
  if (report.chart && report.chart.bars.length) {
    const bars = report.chart.bars;
    const needed = 30 + bars.length * 24;
    if (y + needed > 790) { doc.addPage(); y = 56; }
    heading(report.chart.title);
    y += 6;
    const labelW = 150;
    const valueW = 90;
    const barMax = W - M * 2 - labelW - valueW;
    const maxVal = Math.max(...bars.map((b) => Math.abs(b.value)), 1);
    doc.setFontSize(9);
    bars.forEach((b) => {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(58, 54, 49);
      doc.text(pdfSafe(b.label), M, y + 10);
      const len = Math.max(2, (Math.abs(b.value) / maxVal) * barMax);
      const [r, g, bl] = TONE_RGB[b.tone ?? "accent"];
      doc.setFillColor(r, g, bl);
      doc.roundedRect(M + labelW, y, len, 13, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(29, 27, 24);
      doc.text(pdfSafe(b.display), W - M, y + 10, { align: "right" });
      y += 22;
    });
    y += 14;
  }

  report.tables?.forEach((t) => {
    heading(t.title);
    table(t.columns, t.rows);
  });

  const bullets = (title: string, items: string[]) => {
    if (!items.length) return;
    heading(title);
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(58, 54, 49);
    items.forEach((item) => {
      const lines = doc.splitTextToSize(pdfSafe(`- ${item}`), W - M * 2);
      if (y + lines.length * 13 > 800) { doc.addPage(); y = 56; }
      doc.text(lines, M, y);
      y += lines.length * 13 + 3;
    });
    y += 12;
  };

  bullets("Assumptions", report.assumptions);
  bullets("Reference benchmarks", report.benchmarks);

  // Disclaimer + page numbers on every page
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    const H = doc.internal.pageSize.getHeight();
    doc.setDrawColor(230, 225, 216);
    doc.line(M, H - 48, W - M, H - 48);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(120, 114, 106);
    const disclaimer = doc.splitTextToSize(
      pdfSafe("Disclaimer: Estimates for planning only, based on the numbers you entered. Benchmarks are indicative. This is not financial, tax or legal advice."),
      W - M * 2 - 60,
    );
    doc.text(disclaimer, M, H - 34);
    doc.text(`Page ${i} of ${pages}`, W - M, H - 34, { align: "right" });
  }

  doc.save(slugFile(report.title, "pdf"));
}
