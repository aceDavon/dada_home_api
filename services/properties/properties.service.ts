import { Property, PropertyData } from "../../app/repositories/property";

export class PropertyService {
  constructor(private propertyDB: Property) { }
  
  async createProperty(data: PropertyData): Promise<PropertyData> {
    return await this.propertyDB.createProperty(data)
  }

  async getProperty(propertyId: string): Promise<PropertyData> { 
    return await this.propertyDB.getProperty(propertyId)
  }

  async getProperties(): Promise<PropertyData[]> {
    return await this.propertyDB.getProperties()
  }

  async updateProperty(propertyId: string, data: Record<string, string | number>) {
    return await this.propertyDB.updateProperty(propertyId, data)
  }
}