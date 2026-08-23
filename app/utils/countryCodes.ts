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

  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,idd,flag,cca2",
    ).catch(() => null);

    if (!res || !res.ok) {
      cachedCountries = DEFAULT_FALLBACK_COUNTRIES;
      return DEFAULT_FALLBACK_COUNTRIES;
    }

    const data = await res.json();

    const list: CountryCode[] = data
      .filter((c: any) => c.idd?.root)
      .map((c: any) => {
        const root = c.idd.root || "";
        const suffixes = c.idd.suffixes || [""];
        const suffix = suffixes.length === 1 ? suffixes[0] : "";
        const dialCode = `${root}${suffix}`;

        return {
          code: dialCode,
          flag: c.flag || "🏳️",
          name: c.name?.common || c.cca2,
        };
      })
      .filter((c: CountryCode) => c.code && c.code.length <= 6)
      .sort((a: CountryCode, b: CountryCode) => a.name.localeCompare(b.name));

    cachedCountries = list.length > 0 ? list : DEFAULT_FALLBACK_COUNTRIES;
    return cachedCountries;
  } catch {
    cachedCountries = DEFAULT_FALLBACK_COUNTRIES;
    return DEFAULT_FALLBACK_COUNTRIES;
  }
}
