import { Agents } from "../../app/db/agent"

export class AgentService {
  private AgentDB: Agents

  constructor(AgentDb: Agents) {
    this.AgentDB = AgentDb
  }

  async createAgent({ email, password }: { email: string; password: string }) {
    const agent = await this.AgentDB.createAgent(email, password)

    return agent
  }
}
