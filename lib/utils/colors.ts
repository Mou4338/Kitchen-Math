/** Theme-aware colour strings for SVG and chart libraries. They resolve from the CSS variables in globals.css. */
export const cv = (name: string, alpha?: number) => (alpha === undefined ? `rgb(var(--${name}))` : `rgb(var(--${name}) / ${alpha})`);

export const CHART = {
  grid: cv("line"),
  axis: cv("line-strong"),
  tick: cv("muted"),
  ink: cv("ink"),
  card: cv("card"),
  wash: cv("wash"),
  accent: cv("accent"),
  accentDark: cv("accent-dark"),
  good: cv("sage"),
  bad: cv("danger"),
  watch: cv("caution"),
  neutral: cv("muted-light"),
  c1: cv("chart-1"),
  c2: cv("chart-2"),
  c3: cv("chart-3"),
  c4: cv("chart-4"),
  c5: cv("chart-5"),
  c6: cv("chart-6"),
};

export const tooltipStyle = {
  borderRadius: 12,
  border: `1px solid ${cv("line")}`,
  background: cv("card"),
  color: cv("ink"),
  fontSize: 12,
};
