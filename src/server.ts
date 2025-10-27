import "@/config/load-env"

import app from "./app"
import config from "./config"
import logger from "./utils/logger"

;(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`)
})
