interface Config {
  port: number | string
  countriesApiUrl: string
  currenciesApiUrl: string
  nodeEnv: string
}

const config: Config = {
  port: process.env.PORT || 3000,
  countriesApiUrl: process.env.COUNTRIES_API_URL!,
  currenciesApiUrl: process.env.CURRENCIES_API_URL!,
  nodeEnv: process.env.NODE_ENV || "development",
}

export default config
