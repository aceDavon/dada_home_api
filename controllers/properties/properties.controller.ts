import { Request, Response } from "express"
import { PropertyService } from "../../services/properties/properties.service"

export class PropertyController {
  constructor(private PropertyDB: PropertyService) {}

  async createProperty(req: Request, res: Response): Promise<void> {
    const {
      address,
      city,
      state,
      price,
      zip_code,
      country,
      inspection_count,
      agent_id,
    } = req.body

    if (
      !this.validate([
        address,
        city,
        state,
        price,
        zip_code,
        country,
        inspection_count,
        agent_id,
      ])
    ) {
      res
        .status(400)
        .json({ msg: "Incomplete/bad data for creating properties" })
      return
    }

    try {
      const property = await this.PropertyDB.createProperty({
        address,
        city,
        state,
        price,
        zip_code,
        country,
        inspection_count,
        agent_id,
      })

      res
        .status(200)
        .json({ msg: "Property created successfully", data: property })
    } catch (err) {
      console.error("Error creating property:", err)
      res.status(500).json({ msg: "Error creating property" })
    }
  }

  async getProperty(req: Request, res: Response): Promise<void> {
    const { id } = req.params

    if (!id) {
      res.status(400).json({ msg: "No property ID provided" })
      return
    }

    try {
      const property = await this.PropertyDB.getProperty(id)

      if (!property) {
        res.status(404).json({ msg: "Property not found for this ID" })
      } else {
        res.status(200).json({ msg: "Sucessful", data: property })
      }
    } catch (err) {
      console.error("Error while getting property:", err)
      res.status(500).json({ msg: "Error while getting property" })
    }
  }

  async getProperties(res: Response): Promise<void> {
    try {
      const properties = await this.PropertyDB.getProperties()
      res.status(200).json({ msg: "Successful", data: properties })
    } catch (err) {
      console.error("Error while getting properties:", err)
      res.status(500).json({ msg: "Error while getting properties" })
    }
  }

  async getFilteredProperties(req: Request, res: Response) {
    const { agentId } = req.params
    const {
      category,
      minPrice,
      maxPrice,
      location,
    } = req.query

    try {
      const filters = {
        category: category as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        address: location as string,
      }

      const properties = await this.PropertyDB.filteredPropertiesData(
        agentId,
        filters
      )
      res.status(200).json({ data: properties })
    } catch (error) {
      console.error("Error fetching filtered properties:", error)
      res.status(500).json({ error: "Failed to fetch properties" })
    }
  }

  async updateProperties(req: Request, res: Response): Promise<void> {
    const data: Record<string, string> = req.body
    const { id } = req.query

    if (!data && typeof data !== "object" && !id) {
      res.status(400).json({ msg: "Incomplete update data, Try again." })
      return
    }

    try {
      const dt = await this.PropertyDB.updateProperty(id as string, data)

      if (dt) {
        res.status(200).json({ msg: "property updated successfully." })
      } else {
        res.status(404).json({ msg: "No property with ID found." })
      }
    } catch (err) {
      console.error("Error while updating property:", err)
      res.status(500).json({ msg: "Failed to update property" })
    }
  }

  validate(data: unknown[]): Boolean {
    return data.every((dt) => dt !== null && dt !== undefined)
  }
}
