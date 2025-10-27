// prettier-ignore-start
import "module-alias/register"
// prettier-ignore-end

import "@/config/load-env"

import app from "./app"
import config from "./config"
import logger from "./utils/logger"

;(BigInt.prototype as unknown as { toJSON: () => string }).toJSON =
  function () {
    return this.toString()
  }

app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`)
})
