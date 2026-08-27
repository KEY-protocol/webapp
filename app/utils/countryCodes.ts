export interface CountryCode {
  code: string;
  flag: string;
  name: string;
}

const DEFAULT_FALLBACK_COUNTRIES: CountryCode[] = [
  { code: "+54", flag: "🇦🇷", name: "Argentina" },
  { code: "+55", flag: "🇧🇷", name: "Brasil" },
  { code: "+56", flag: "🇨🇱", name: "Chile" },
  { code: "+598", flag: "🇺🇾", name: "Uruguay" },
  { code: "+595", flag: "🇵🇾", name: "Paraguay" },
  { code: "+591", flag: "🇧🇴", name: "Bolivia" },
  { code: "+57", flag: "🇨🇴", name: "Colombia" },
  { code: "+52", flag: "🇲🇽", name: "México" },
  { code: "+1", flag: "🇺🇸", name: "Estados Unidos" },
  { code: "+34", flag: "🇪🇸", name: "España" },
];

let cachedCountries: CountryCode[] | null = null;

export async function fetchAllCountryCodes(): Promise<CountryCode[]> {
  if (cachedCountries) return cachedCountries;
  cachedCountries = DEFAULT_FALLBACK_COUNTRIES;
  return DEFAULT_FALLBACK_COUNTRIES;
}
