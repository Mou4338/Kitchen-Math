/**
 * Indicative reference benchmarks for Indian restaurants.
 * These are rules of thumb, not universal truths. Users can override them in the Health calculator.
 */
export interface Benchmarks {
  foodCostMax: number;
  laborMin: number;
  laborMax: number;
  marketingMin: number;
  marketingMax: number;
  primeMin: number;
  primeMax: number;
  netMarginMin: number;
  netMarginMax: number;
  marginOfSafetyStrong: number;
}

export const DEFAULT_BENCHMARKS: Benchmarks = {
  foodCostMax: 35,
  laborMin: 20,
  laborMax: 25,
  marketingMin: 2,
  marketingMax: 4,
  primeMin: 55,
  primeMax: 65,
  netMarginMin: 5,
  netMarginMax: 10,
  marginOfSafetyStrong: 25,
};

export const BENCHMARK_NOTE =
  "Reference benchmarks are indicative ranges drawn from common industry practice. The right range for your outlet depends on format, city, cuisine and pricing.";
