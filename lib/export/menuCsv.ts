import type { MenuItemInput } from "@/lib/calculations/menuEngineeringCalculator";
import { parseNumberInput } from "@/lib/formatters/number";
import { parseCsv, toCsv } from "./csv";

export const MENU_CSV_HEADERS = ["Dish Name", "Selling Price", "Dish Cost", "Labour", "Packaging Cost", "Units Sold"];

export function menuItemsToCsv(items: MenuItemInput[]): string {
  return toCsv([MENU_CSV_HEADERS, ...items.map((i) => [i.name, i.sellingPrice, i.dishCost, i.labourCost, i.packagingCost, i.unitsSold])]);
}

export interface MenuCsvParseResult {
  items: MenuItemInput[];
  errors: string[];
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");
type Col = "name" | "sellingPrice" | "dishCost" | "labourCost" | "packagingCost" | "unitsSold";
const ALIASES: Record<Col, string[]> = {
  name: ["dishname", "itemname", "item", "name", "dish"],
  sellingPrice: ["sellingprice", "price", "menuprice"],
  dishCost: ["dishcost", "foodcost", "cost", "totalcost", "platecost"],
  labourCost: ["labour", "labor", "labourcost", "laborcost"],
  packagingCost: ["packagingcost", "packaging", "pc", "packcost"],
  unitsSold: ["unitssold", "units", "sold", "orders", "quantity", "qty"],
};
const LABEL: Record<Col, string> = { name: "Dish Name", sellingPrice: "Selling Price", dishCost: "Dish Cost", labourCost: "Labour", packagingCost: "Packaging Cost", unitsSold: "Units Sold" };
/** Labour and packaging columns are optional (older files had one cost column). */
const OPTIONAL: Col[] = ["labourCost", "packagingCost"];

/** Parse a menu CSV. Accepts common header names in any order. */
export function parseMenuCsv(text: string, makeId: () => string = () => Math.random().toString(36).slice(2, 10)): MenuCsvParseResult {
  const rows = parseCsv(text);
  if (rows.length < 2) return { items: [], errors: [`The file is empty or has no dish rows. Use the columns: ${MENU_CSV_HEADERS.join(", ")}.`] };
  const header = rows[0].map(norm);
  const col = {} as Record<Col, number>;
  const missing: string[] = [];
  (Object.keys(ALIASES) as Col[]).forEach((k) => {
    const idx = header.findIndex((h) => ALIASES[k].includes(h));
    if (idx === -1 && !OPTIONAL.includes(k)) missing.push(LABEL[k]);
    col[k] = idx;
  });
  if (missing.length) return { items: [], errors: [`Missing column${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}.`] };

  const items: MenuItemInput[] = [];
  const errors: string[] = [];
  const num = (r: string[], k: Col) => (col[k] === -1 ? 0 : parseNumberInput(r[col[k]] ?? ""));
  rows.slice(1).forEach((r, i) => {
    const line = i + 2;
    const name = (r[col.name] ?? "").trim();
    const values = { sellingPrice: num(r, "sellingPrice"), dishCost: num(r, "dishCost"), labourCost: num(r, "labourCost") ?? 0, packagingCost: num(r, "packagingCost") ?? 0, unitsSold: num(r, "unitsSold") };
    if (!name) { errors.push(`Row ${line}: dish name is empty.`); return; }
    if (Object.values(values).some((v) => v === null)) { errors.push(`Row ${line} (${name}): price, costs and units must be numbers.`); return; }
    if (Object.values(values).some((v) => (v as number) < 0)) { errors.push(`Row ${line} (${name}): values cannot be negative.`); return; }
    items.push({ id: makeId(), name, ...(values as { sellingPrice: number; dishCost: number; labourCost: number; packagingCost: number; unitsSold: number }) });
  });
  if (items.length > 500) return { items: items.slice(0, 500), errors: [...errors, "Only the first 500 dishes were imported."] };
  return { items, errors };
}
