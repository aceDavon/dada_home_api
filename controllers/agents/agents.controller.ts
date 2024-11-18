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

  allStringValueValidation(strArr: string[]): boolean {
    return strArr.every((obj) => obj !== "")
  }
}
