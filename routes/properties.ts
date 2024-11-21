import { Router } from "express"
import { DB_CONFIG } from "../app/config/db"
import { Property } from "../app/repositories/property"
import { PropertyService } from "../services/properties/properties.service"
import { PropertyController } from "../controllers/properties/properties.controller"
import { authMiddleware } from "../controllers/auth/middleware/authMiddleware.setup"

const router = Router()

const db = new Property(DB_CONFIG)
const appointmentService = new PropertyService(db)
const controller = new PropertyController(appointmentService)

router.get("/", authMiddleware, controller.getProperties.bind(controller))
router.get("/:id", authMiddleware, controller.getProperty.bind(controller))

router.post("/", authMiddleware, controller.createProperty.bind(controller))

router.patch("/", authMiddleware, controller.updateProperties.bind(controller))

export default router
