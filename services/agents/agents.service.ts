import { Agent, Agents } from "../../app/db/agent"
import { uploadImageToCloudinary } from "../../utils/uploadImageToCloudinary"

export class AgentService {
  private AgentDB: Agents

  constructor(AgentDb: Agents) {
    this.AgentDB = AgentDb
  }

  async createAgent({ email, password }: { email: string; password: string }) {
    return await this.AgentDB.createAgent(email, password)
  }

  async getAgent(id: string): Promise<Agent | null> {
    return await this.AgentDB.getAgentById(id)
  }

  async updateAgent(
    agentId: string,
    data: Partial<Agent>
  ): Promise<Agent | null> {
    return this.AgentDB.updateAgent(agentId, data)
  }

  async removeAgent(agentId: string): Promise<number | null> {
    return await this.AgentDB.removeAgent(agentId)
  }

  async updateAgentPhoto(
    agentId: string,
    fileBuffer: Buffer
  ): Promise<number | null> {
    const result = await uploadImageToCloudinary(
      fileBuffer,
      "agent-photos"
    )

    return await this.AgentDB.updateAgentPhoto(agentId, result.secure_url)
  }
}
