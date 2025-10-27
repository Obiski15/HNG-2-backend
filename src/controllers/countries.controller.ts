import fs from "fs"
import path from "path"
import { PrismaClient } from "@prisma/client"

// import { PrismaClient } from "@/generated/prisma/client"

import AppError from "@/utils/AppError"
import catchAsync from "@/utils/catchAsync"
import {
  Country,
  fetchCountries,
  generateSummaryImage,
  getLastRefreshedAt,
} from "@/utils/helpers"
import logger from "@/utils/logger"

const prisma = new PrismaClient()

export const refreshCountries = catchAsync(async (_req, res, next) => {
  try {
    const data = await fetchCountries()

    await Promise.all(
      data.map(country =>
        prisma.country.upsert({
          where: { name: country.name }, // Find by unique field
          update: country,
          create: country,
        })
      )
    )
    await generateSummaryImage(data, getLastRefreshedAt(data))

    res.status(200).json(data)
  } catch (error) {
    logger.error(error)
    next()
  }
})

export const getCountries = catchAsync(async (req, res) => {
  const { region, currency, sort } = req.query
  let filters: { [key: string]: unknown } = {}

  if (region) {
    filters.region = region
  }
  if (currency) {
    filters.currency_code = currency
  }

  // fetch from db
  const countries = await prisma.country.findMany({
    where: {
      ...filters,
    },
    orderBy: [{ ...(sort === "gdp_desc" ? { estimated_gdp: "desc" } : {}) }],
  })

  res.status(200).json(countries)
})

export const getCountry = catchAsync(async (req, res, next) => {
  const { name } = req.params

  const country = await prisma.country.findFirst({
    where: { name },
  })

  if (!country) return next(new AppError("Country not found", 404))

  res.status(200).json(country)
})

export const deleteCountry = catchAsync(async (req, res, next) => {
  const { name } = req.params

  // fetch from db
  // find with name first
  const country = await prisma.country.findFirst({
    where: { name },
  })

  if (!country) return next(new AppError("Country not found", 404))

  await prisma.country.delete({
    where: { id: country.id },
  })

  res.status(204).end()
})

export const countriesStatus = catchAsync(async (_req, res) => {
  const countries = await prisma.country.findMany()
  const last_refreshed_at = getLastRefreshedAt(
    countries as unknown as Country[]
  )

  res.status(200).json({
    total_countries: countries.length,
    last_refreshed_at,
  })
})

export const getCountriesImage = catchAsync(async (_req, res, next) => {
  const filePath = path.join(__dirname, "../../cache/summary.png")

  if (!fs.existsSync(filePath))
    return next(new AppError("Summary image not found", 404))

  res.setHeader("Content-Type", "image/png")
  res.sendFile(filePath)
})
