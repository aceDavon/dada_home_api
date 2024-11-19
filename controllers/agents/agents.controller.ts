import { Request, Response } from "express"
import { AgentService } from "../../services/agents/agents.service"

export class AgentController {
  private AgentService: AgentService

  constructor(AgentService: AgentService) {
    this.AgentService = AgentService
  }

  async createAgent(req: Request, res: Response) {
    const { email, password }: { email: string; password: string } = req.body
    if (
      !email &&
      !password &&
      !this.allStringValueValidation([email, password])
    ) {
      res.status(401).json({ msg: "Incomplete credentials. try again" })
      return
    }

    try {
      const agent = await this.AgentService.createAgent({ email, password })
      const { password: _, ...safeData } = agent
      res
        .status(200)
        .json({ msg: "Agent created successfully", data: safeData })
    } catch (err) {
      console.error("Error creating agent", err)
      res.status(500).json({ msg: "Error creating agent" })
    }
  }

  async getAgentAccount(req: Request, res: Response): Promise<void> {
    const agentId = req.query.id as string

    if (!agentId) {
      res.status(400).json({ msg: "Please provide agent ID" })
      return
    }

    try {
      const agent = await this.AgentService.getAgent(agentId)

      if (agent) {
        const { password: _, ...safeData } = agent
        res.status(200).json({ msg: "successful", data: safeData })
      } else {
        res.status(400).json({ msg: "Agent with ID does not exist" })
      }
    } catch (err) {
      console.error("Error getting agent", err)
      res.status(500).json({ msg: "Error getting agent" })
    }
  }

  async updateAgent(req: Request, res: Response): Promise<void> {
    const agentId = req.query.id as string
    const updateData = req.body

    if (!agentId) {
      res.status(400).json({ msg: "Agent ID is required" })
      return
    }

    try {
      const updatedAgent = await this.AgentService.updateAgent(
        agentId,
        updateData
      )

      if (!updatedAgent) {
        res.status(404).json({ msg: "Agent not found" })
        return
      }

      const { password, ...safeData } = updatedAgent

      res.status(200).json({
        msg: "Agent updated successfully",
        data: safeData,
      })
    } catch (err) {
      console.error("Error updating agent", err)
      res.status(500).json({ msg: "Error updating agent" })
    }
  }

  async updateAgentPhoto(req: Request, res: Response): Promise<void> {
    const agentId = req.params.id

    try {
      if (!req.file) {
        res.status(400).json({ error: "No file uploaded" })
        return
      }

      const update = await this.AgentService.updateAgentPhoto(
        agentId,
        req.file.buffer
      )

      if (update) {
        res.status(200).json({
          msg: "Image uploaded successfully",
        })
      } else {
        res.status(404).json({ msg: "Agent profile not found for update." })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Image upload failed" })
    }
  }

  async removeAgent(req: Request, res: Response): Promise<void> {
    const { id } = req.query

    if (!id) {
      res.status(400).json({ msg: "No Agent ID found on request. Try again" })
      return
    }

    try {
      const deleted = await this.AgentService.removeAgent(id as string)

      if (deleted) {
        res.status(200).json({ msg: "Agent deleted successfully" })
      } else {
        res.status(404).json({ msg: "Agent not found" })
      }
    } catch (err) {
      console.error("Error deleting agent:", err)
      res.status(500).json({ msg: "Error deleting agent." })
    }
  }

  allStringValueValidation(strArr: string[]): boolean {
    return strArr.every((obj) => obj !== "")
  }
}
