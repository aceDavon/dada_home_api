import { Agent, Agents } from "../../app/db/agent"

export class AgentService {
  private AgentDB: Agents

  constructor(AgentDb: Agents) {
    this.AgentDB = AgentDb
  }

  async createAgent({ email, password }: { email: string; password: string }) {
    return await this.AgentDB.createAgent(email, password)
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
}
