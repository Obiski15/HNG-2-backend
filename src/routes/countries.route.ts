import { Router } from "express"

import {
  deleteCountry,
  getCountries,
  getCountriesImage,
  getCountry,
  refreshCountries,
} from "@/controllers/countries.controller"

const router = Router()

router.route("/").get(getCountries)
router.route("/image").get(getCountriesImage)
router.route("/refresh").post(refreshCountries)

router.route("/:name").get(getCountry).delete(deleteCountry)

export default router
