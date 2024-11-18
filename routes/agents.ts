import { Router } from "express"
import { Agents } from "../app/db/agent"
import { DB_CONFIG } from "../app/config/db"
import { AgentService } from "../services/agents/agents.service"
import { AgentController } from "../controllers/agents/agents.controller"

const router = Router()

const db = new Agents(DB_CONFIG)
const agentService = new AgentService(db)
const controller = new AgentController(agentService)

router.post("/", controller.createAgent.bind(controller))

export default router
