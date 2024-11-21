import { Router } from "express"
import { Agents } from "../app/repositories/agent"
import { DB_CONFIG } from "../app/config/db"
import { AgentService } from "../services/agents/agents.service"
import { AgentController } from "../controllers/agents/agents.controller"
import { uploadImage } from "../utils/validateImageFileUpload"
import { authMiddleware } from "../controllers/auth/middleware/authMiddleware.setup"

const router = Router()

const db = new Agents(DB_CONFIG)
const agentService = new AgentService(db)
const controller = new AgentController(agentService)

router.get("/", authMiddleware, controller.getAgentAccount.bind(controller))

router.post("/", authMiddleware, controller.createAgent.bind(controller))

router.patch("/", authMiddleware, controller.updateAgent.bind(controller))
router.patch(
  "/:id",
  authMiddleware,
  uploadImage.single("photo"),
  controller.updateAgentPhoto.bind(controller)
)

router.delete("/", controller.removeAgent.bind(controller))

export default router
