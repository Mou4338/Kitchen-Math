/**
 * Custom, theme-aware illustrations (no stock photos needed).
 * Colours come from the theme tokens, so they switch between white & blue and black & gold automatically.
 */
import { cv } from "@/lib/utils/colors";

const A = cv("accent");
const AS = cv("accent-soft");
const AB = cv("accent-bright");
const I = cv("ink");
const C = cv("card");
const L = cv("line");
const LS = cv("line-strong");
const W = cv("wash");
const G = cv("sage");
const GOLD = cv("chart-5");
const M = cv("muted-light");

type P = { className?: string; title?: string };

function Svg({ className, title, children, viewBox = "0 0 320 240" }: P & { children: React.ReactNode; viewBox?: string }) {
  return (
    <svg viewBox={viewBox} className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title} fill="none">
      {children}
    </svg>
  );
}

/** Rupee coin used across illustrations. */
function Coin({ x, y, r = 14 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y + 2} r={r} fill={cv("chart-5", 0.45)} />
      <circle cx={x} cy={y} r={r} fill={GOLD} />
      <circle cx={x} cy={y} r={r - 3.5} fill="none" stroke={cv("card", 0.6)} strokeWidth={1.5} />
      <text x={x} y={y + r * 0.36} textAnchor="middle" fontSize={r * 1.05} fontWeight={700} fill={cv("card")} fontFamily="system-ui, sans-serif">₹</text>
    </g>
  );
}

/** Hero: a restaurant owner's dashboard with a bill, a plate and rupee coins. */
export function HeroScene({ className }: P) {
  return (
    <Svg className={className} viewBox="0 0 520 420" title="Illustration of a restaurant finance dashboard with a bill, a plate and coins">
      <circle cx="300" cy="200" r="175" fill={AS} />
      <circle cx="300" cy="200" r="130" fill={cv("accent", 0.08)} />
      {/* tablet */}
      <g>
        <rect x="150" y="80" width="300" height="220" rx="22" fill={C} stroke={L} strokeWidth="2" />
        <rect x="170" y="100" width="120" height="10" rx="5" fill={I} opacity="0.85" />
        <rect x="170" y="118" width="80" height="8" rx="4" fill={M} />
        {/* bars */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const h = [48, 62, 55, 80, 92, 118][i];
          return <rect key={i} x={176 + i * 28} y={276 - h} width="18" height={h} rx="5" fill={i === 5 ? A : cv("accent", 0.35 + i * 0.08)} />;
        })}
        <path d="M176 222 C 210 214, 232 206, 262 196 S 318 170, 352 150" stroke={G} strokeWidth="3" strokeLinecap="round" />
        <circle cx="352" cy="150" r="5" fill={G} stroke={C} strokeWidth="2" />
        {/* donut */}
        <circle cx="405" cy="176" r="30" stroke={W} strokeWidth="12" />
        <circle cx="405" cy="176" r="30" stroke={A} strokeWidth="12" strokeDasharray="120 200" strokeLinecap="round" transform="rotate(-90 405 176)" />
        <circle cx="405" cy="176" r="30" stroke={GOLD} strokeWidth="12" strokeDasharray="40 200" strokeDashoffset="-128" strokeLinecap="round" transform="rotate(-90 405 176)" />
        <rect x="378" y="226" width="54" height="8" rx="4" fill={M} />
        <rect x="378" y="242" width="38" height="8" rx="4" fill={L} />
      </g>
      {/* floating bill */}
      <g className="animate-float">
        <path d="M60 150 h110 v150 l-11 -8 -11 8 -11 -8 -11 8 -11 -8 -11 8 -11 -8 -11 8 -11 -8 -11 8 z" fill={C} stroke={LS} strokeWidth="2" />
        <rect x="76" y="168" width="60" height="8" rx="4" fill={I} opacity="0.85" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x="76" y={188 + i * 18} width="46" height="6" rx="3" fill={M} />
            <rect x="130" y={188 + i * 18} width="24" height="6" rx="3" fill={i === 3 ? A : LS} />
          </g>
        ))}
        <line x1="76" y1="262" x2="154" y2="262" stroke={LS} strokeDasharray="4 4" />
        <rect x="76" y="272" width="36" height="8" rx="4" fill={I} />
        <rect x="124" y="272" width="30" height="8" rx="4" fill={G} />
      </g>
      {/* plate with cloche */}
      <g transform="translate(360 300)">
        <ellipse cx="60" cy="58" rx="70" ry="12" fill={cv("ink", 0.08)} />
        <ellipse cx="60" cy="50" rx="66" ry="12" fill={C} stroke={LS} strokeWidth="2" />
        <path d="M8 48 a52 44 0 0 1 104 0 z" fill={A} />
        <path d="M24 40 a38 30 0 0 1 30 -26" stroke={cv("card", 0.55)} strokeWidth="5" strokeLinecap="round" />
        <circle cx="60" cy="0" r="7" fill={A} />
      </g>
      <Coin x={120} y={352} r={18} />
      <Coin x={150} y={372} r={14} />
      <Coin x={468} y={96} r={16} />
    </Svg>
  );
}

/** Step 1: type your numbers. */
export function StepEnter({ className }: P) {
  return (
    <Svg className={className} title="Entering numbers into a form">
      <circle cx="160" cy="120" r="96" fill={AS} />
      <rect x="84" y="46" width="152" height="150" rx="16" fill={C} stroke={L} strokeWidth="2" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="102" y={66 + i * 42} width="60" height="7" rx="3.5" fill={M} />
          <rect x="102" y={78 + i * 42} width="116" height="18" rx="6" fill={W} stroke={i === 1 ? A : L} strokeWidth="2" />
          <text x="110" y={91 + i * 42} fontSize="11" fontWeight={700} fill={i === 1 ? A : I} fontFamily="system-ui, sans-serif">₹ {["1,20,000", "3,80,000", "95,000"][i]}</text>
        </g>
      ))}
      <path d="M214 150 l30 30 -10 4 8 14 -7 4 -8 -14 -8 8 z" fill={I} stroke={C} strokeWidth="2" strokeLinejoin="round" />
    </Svg>
  );
}

/** Step 2: see your results instantly. */
export function StepAnalyze({ className }: P) {
  return (
    <Svg className={className} title="Results shown as a chart with a magnifying glass">
      <circle cx="160" cy="120" r="96" fill={AS} />
      <rect x="70" y="58" width="180" height="124" rx="16" fill={C} stroke={L} strokeWidth="2" />
      {[34, 50, 44, 66, 82].map((h, i) => (
        <rect key={i} x={90 + i * 30} y={162 - h} width="18" height={h} rx="5" fill={i === 4 ? A : cv("accent", 0.3 + i * 0.1)} />
      ))}
      <path d="M92 116 L128 104 L156 108 L188 88 L222 70" stroke={G} strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="226" cy="150" r="26" fill={cv("card", 0.6)} stroke={I} strokeWidth="6" />
      <line x1="245" y1="170" x2="266" y2="192" stroke={I} strokeWidth="9" strokeLinecap="round" />
      <text x="226" y="156" textAnchor="middle" fontSize="15" fontWeight={800} fill={G} fontFamily="system-ui, sans-serif">✓</text>
    </Svg>
  );
}

/** Step 3: save, share and download. */
export function StepSave({ className }: P) {
  return (
    <Svg className={className} title="A report being saved and shared">
      <circle cx="160" cy="120" r="96" fill={AS} />
      <rect x="92" y="44" width="116" height="150" rx="14" fill={C} stroke={L} strokeWidth="2" />
      <rect x="108" y="62" width="64" height="8" rx="4" fill={I} opacity="0.85" />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x="108" y={82 + i * 14} width={i % 2 ? 60 : 84} height="6" rx="3" fill={M} />)}
      <rect x="108" y="158" width="40" height="18" rx="6" fill={A} />
      <circle cx="226" cy="72" r="24" fill={A} />
      <path d="M216 78 l10 -12 10 12 M226 66 v18" stroke={cv("accent-ink")} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="232" cy="164" r="22" fill={G} />
      <path d="M222 164 l7 7 13 -14" stroke={cv("card")} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

/** Privacy: numbers stay on your device. */
export function PrivacyShield({ className }: P) {
  return (
    <Svg className={className} title="A shield with a lock over a phone">
      <circle cx="160" cy="120" r="96" fill={AS} />
      <rect x="112" y="40" width="96" height="164" rx="18" fill={C} stroke={L} strokeWidth="2" />
      <rect x="146" y="50" width="28" height="6" rx="3" fill={L} />
      <path d="M160 74 l42 14 v30 c0 28 -18 46 -42 56 c-24 -10 -42 -28 -42 -56 v-30 z" fill={A} />
      <rect x="144" y="112" width="32" height="26" rx="6" fill={cv("accent-ink")} />
      <path d="M150 112 v-8 a10 10 0 0 1 20 0 v8" stroke={cv("accent-ink")} strokeWidth="5" fill="none" />
      <circle cx="160" cy="124" r="4" fill={A} />
      <Coin x={228} y={186} r={14} />
    </Svg>
  );
}

/** Menu: a plate, cloche and a price tag. */
export function ChefPlate({ className }: P) {
  return (
    <Svg className={className} title="A covered dish with a price tag">
      <circle cx="160" cy="120" r="96" fill={AS} />
      <ellipse cx="160" cy="178" rx="96" ry="16" fill={cv("ink", 0.08)} />
      <ellipse cx="160" cy="168" rx="90" ry="16" fill={C} stroke={LS} strokeWidth="2" />
      <path d="M86 166 a74 64 0 0 1 148 0 z" fill={A} />
      <path d="M108 150 a52 44 0 0 1 40 -38" stroke={cv("card", 0.5)} strokeWidth="7" strokeLinecap="round" />
      <circle cx="160" cy="100" r="9" fill={A} />
      <g transform="rotate(-12 246 86)">
        <path d="M212 70 h58 a8 8 0 0 1 8 8 v24 a8 8 0 0 1 -8 8 h-58 l-14 -20 z" fill={GOLD} />
        <circle cx="214" cy="90" r="4" fill={C} />
        <text x="244" y="96" textAnchor="middle" fontSize="15" fontWeight={800} fill={cv("card")} fontFamily="system-ui, sans-serif">₹319</text>
      </g>
      <path d="M60 60 q8 -14 0 -28 M76 64 q8 -14 0 -28" stroke={AB} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
    </Svg>
  );
}

/** Help / guidance: a lightbulb over a calculator. */
export function HelpIdea({ className }: P) {
  return (
    <Svg className={className} title="A lightbulb above a calculator">
      <circle cx="160" cy="120" r="96" fill={AS} />
      <rect x="112" y="92" width="96" height="120" rx="14" fill={cv("inverse")} stroke={LS} strokeWidth="2" />
      <rect x="124" y="104" width="72" height="24" rx="6" fill={AB} />
      <text x="190" y="121" textAnchor="end" fontSize="13" fontWeight={800} fill={cv("inverse")} fontFamily="system-ui, sans-serif">32.4%</text>
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={124 + c * 25} y={138 + r * 22} width="20" height="16" rx="4" fill={r === 2 && c === 2 ? A : cv("on-inverse", 0.22)} />))}
      <circle cx="222" cy="64" r="26" fill={GOLD} />
      <rect x="212" y="88" width="20" height="12" rx="3" fill={M} />
      <path d="M222 30 v-10 M252 44 l8 -6 M192 44 l-8 -6 M258 70 h10 M186 70 h-10" stroke={GOLD} strokeWidth="4" strokeLinecap="round" />
    </Svg>
  );
}
