import { Router } from "express"
import { Appointment } from "../app/repositories/appointment"
import { DB_CONFIG } from "../app/config/db"
import { AppointmentService } from "../services/appointments/appointments.service"
import { AppointmentController } from "../controllers/appointments/appointments.controller"
import { authMiddleware } from "../controllers/auth/middleware/authMiddleware.setup"

const router = Router()

const db = new Appointment(DB_CONFIG)
const appointmentService = new AppointmentService(db)
const controller = new AppointmentController(appointmentService)

router.get("/", authMiddleware, controller.getAppointments.bind(controller))
router.get("/:id", authMiddleware, controller.getPropertyAppointments.bind(controller))

router.post("/", authMiddleware, controller.createAppointment.bind(controller))

router.patch("/", authMiddleware, controller.updateAppointments.bind(controller))

export default router