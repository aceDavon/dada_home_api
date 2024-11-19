import { Router } from "express"
import { Agents } from "../app/repositories/agent"
import { DB_CONFIG } from "../app/config/db"
import { AgentService } from "../services/agents/agents.service"
import { AgentController } from "../controllers/agents/agents.controller"
import { uploadImage } from "../utils/validateImageFileUpload"

const router = Router()

const db = new Agents(DB_CONFIG)
const agentService = new AgentService(db)
const controller = new AgentController(agentService)

router.get("/", controller.getAgentAccount.bind(controller))

router.post("/", controller.createAgent.bind(controller))

router.patch("/", controller.updateAgent.bind(controller))
router.patch(
  "/:id",
  uploadImage.single("photo"),
  controller.updateAgentPhoto.bind(controller)
)

router.delete("/", controller.removeAgent.bind(controller))

export default router
