import fs from "fs"
import path from "path"
import config from "@/config"
import sharp from "sharp"

import { randomNumber } from "."

interface ApiCountry {
  name: string
  region?: string
  population: number
  flag?: string
  capital?: string
  currencies?: Array<{ code: string }>
}

export interface Country {
  name: string
  region: string | null
  population: number
  flag_url: string | null
  capital: string | null
  exchange_rate: number | null
  estimated_gdp: number
  currency_code: string | null
  last_refreshed_at: Date
}

const getExchangeRates = async () => {
  const res = await fetch(config.currenciesApiUrl)

  if (!res.ok) throw new Error("Could not fetch data from [open.er-api.com]")

  const data = await res.json()

  return data
}

const getCountriesData = async (): Promise<ApiCountry[]> => {
  const res = await fetch(config.countriesApiUrl)

  const data: ApiCountry[] = await res.json()

  if (!res.ok) throw new Error("Could not fetch data from [restcountries.com]")

  return data
}

export const fetchCountries = async () => {
  const countries = await getCountriesData()
  const rates = await getExchangeRates()
  let data: Country[] = []

  countries.forEach(country => {
    const exchange_rate =
      rates.rates[
        country.currencies?.length ? country.currencies[0]?.code : ""
      ] ?? null

    const estimated_gdp =
      !country.currencies?.length || !exchange_rate || !country?.population
        ? 0
        : (country.population * randomNumber(1000, 2000)) / exchange_rate

    const newCountriesData = {
      name: country.name,
      region: country.region ?? null,
      population: country.population,
      flag_url: country.flag ?? null,
      capital: country.capital ?? null,
      exchange_rate,
      estimated_gdp,
      currency_code: country.currencies?.length
        ? country.currencies[0]?.code
        : null,
      last_refreshed_at: new Date(),
    }

    data.push(newCountriesData)
  })

  return data
}

export function getLastRefreshedAt(countries: Country[]) {
  let last_refreshed_at: Date | null = null

  countries.forEach(country => {
    const date = new Date(country.last_refreshed_at).getTime()

    if (!last_refreshed_at || date > last_refreshed_at.getTime()) {
      last_refreshed_at = country.last_refreshed_at
    }
  })

  return last_refreshed_at as unknown as Date
}

export async function generateSummaryImage(
  countries: Country[],
  lastRefreshedAt: Date
) {
  const total = countries.length
  const top5 = countries
    .sort((a, b) => b.estimated_gdp - a.estimated_gdp)
    .slice(0, 5)

  // SVG string
  const svg = `
    <svg width="800" height="500" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="500" fill="#f8fafc"/>
      <text x="50" y="60" font-family="Arial" font-size="28" font-weight="bold" fill="#111">Country Summary</text>
      <text x="50" y="120" font-family="Arial" font-size="20" fill="#111">Total Countries: ${total}</text>
      <text x="50" y="170" font-family="Arial" font-size="18" fill="#111">Top 5 by Estimated GDP:</text>
      ${top5
        .map(
          (c, i) => `
        <text x="70" y="${200 + i * 30}" font-family="Arial" font-size="18" fill="#111">
          ${i + 1}. ${c.name} - ${c.estimated_gdp?.toLocaleString() || "N/A"}
        </text>
      `
        )
        .join("")}
      <text x="50" y="380" font-family="Arial" font-size="16" fill="#111">
        Last refreshed: ${new Date(lastRefreshedAt).toLocaleString()}
      </text>
      <line x1="50" y1="400" x2="750" y2="400" stroke="#ccc" stroke-width="1"/>
    </svg>
  `

  const outputPath = path.resolve("cache/summary.png")
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })

  await sharp(Buffer.from(svg)).png().toFile(outputPath)
}
