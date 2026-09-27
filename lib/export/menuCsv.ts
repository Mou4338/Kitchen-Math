import type { MenuItemInput } from "@/lib/calculations/menuEngineeringCalculator";
import { parseNumberInput } from "@/lib/formatters/number";
import { parseCsv, toCsv } from "./csv";

export const MENU_CSV_HEADERS = ["Dish Name", "Selling Price", "Total Cost", "Orders"];

export function menuItemsToCsv(items: MenuItemInput[]): string {
  return toCsv([MENU_CSV_HEADERS, ...items.map((i) => [i.name, i.sellingPrice, i.totalCost, i.orders])]);
}

export interface MenuCsvParseResult {
  items: MenuItemInput[];
  errors: string[];
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");
const ALIASES: Record<keyof Omit<MenuItemInput, "id">, string[]> = {
  name: ["dishname", "itemname", "item", "name", "dish"],
  sellingPrice: ["sellingprice", "price", "menuprice"],
  totalCost: ["totalcost", "totalcostdishlabourpc", "cost", "foodcost", "platecost"],
  orders: ["orders", "ordersinthemonth", "monthlyorders", "unitssold", "units", "sold", "quantity", "qty"],
};

/** Parse a menu CSV. Accepts common header names in any order. */
export function parseMenuCsv(text: string, makeId: () => string = () => Math.random().toString(36).slice(2, 10)): MenuCsvParseResult {
  const rows = parseCsv(text);
  if (rows.length < 2) return { items: [], errors: ["The file is empty or has no item rows. Use the columns: Dish Name, Selling Price, Total Cost, Orders."] };
  const header = rows[0].map(norm);
  const col = {} as Record<keyof typeof ALIASES, number>;
  const missing: string[] = [];
  (Object.keys(ALIASES) as (keyof typeof ALIASES)[]).forEach((k) => {
    const idx = header.findIndex((h) => ALIASES[k].includes(h));
    if (idx === -1) missing.push(k === "name" ? "Dish Name" : k === "sellingPrice" ? "Selling Price" : k === "totalCost" ? "Total Cost" : "Orders");
    col[k] = idx;
  });
  if (missing.length) return { items: [], errors: [`Missing column${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}.`] };

  const items: MenuItemInput[] = [];
  const errors: string[] = [];
  rows.slice(1).forEach((r, i) => {
    const line = i + 2;
    const name = (r[col.name] ?? "").trim();
    const price = parseNumberInput(r[col.sellingPrice] ?? "");
    const cost = parseNumberInput(r[col.totalCost] ?? "");
    const units = parseNumberInput(r[col.orders] ?? "");
    if (!name) { errors.push(`Row ${line}: dish name is empty.`); return; }
    if (price === null || cost === null || units === null) { errors.push(`Row ${line} (${name}): price, cost and orders must be numbers.`); return; }
    if (price < 0 || cost < 0 || units < 0) { errors.push(`Row ${line} (${name}): values cannot be negative.`); return; }
    items.push({ id: makeId(), name, sellingPrice: price, totalCost: cost, orders: units });
  });
  if (items.length > 500) return { items: items.slice(0, 500), errors: [...errors, "Only the first 500 items were imported."] };
  return { items, errors };
}
