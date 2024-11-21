import { Request, Response } from "express"
import { AppointmentService } from "../../services/appointments/appointments.service"

export class AppointmentController {
  constructor(private AppointmentService: AppointmentService) {}

  async createAppointment(req: Request, res: Response): Promise<void> {
    const { notes, appointmentType, appointmentTime, propertyId } = req.body

    if (
      !this.validate([notes, appointmentType, appointmentTime, propertyId]) &&
      !Array.isArray(JSON.parse(appointmentTime))
    ) {
      res
        .status(400)
        .json({ msg: "Incomplete/bad data for creating appointment" })
      return
    }

    try {
      const appointment = await this.AppointmentService.createAppointment({
        notes,
        appointmentType,
        appointmentTime,
        propertyId,
      })

      res
        .status(200)
        .json({ msg: "Appointment created successfully", data: appointment })
    } catch (err) {
      console.error("Error creating appointment:", err)
      res.status(500).json({ msg: "Error creating appointment" })
    }
  }

  async getPropertyAppointments(req: Request, res: Response): Promise<void> {
    const { id } = req.params

    if (!id) {
      res.status(400).json({ msg: "No property ID provided" })
      return
    }

    try {
      const appointments =
        await this.AppointmentService.getPropertyAppointments(id)

      if (appointments.length === 0) {
        res
          .status(404)
          .json({ msg: "Appointments not found for this property" })
      } else {
        res.status(200).json({ msg: "Sucessful", data: appointments })
      }
    } catch (err) {
      console.error("Error while getting appointments:", err)
      res.status(500).json({ msg: "Error while getting appointments" })
    }
  }

  async getAppointments(req: Request, res: Response): Promise<void> {
    try {
      const appointments = await this.AppointmentService.getAppointments()
      res.status(200).json({ msg: "Successful", data: appointments })
    } catch (err) {
      console.error("Error while getting appointments:", err)
      res.status(500).json({ msg: "Error while getting appointments" })
    }
  }

  async updateAppointments(req: Request, res: Response): Promise<void> {
    const { data }: { data: Record<string, string> } = req.body
    const { id } = req.query

    if (!data && typeof data !== "object" && !id) {
      res.status(400).json({ msg: "Incomplete update data, Try again." })
      return
    }

    try {
      const dt = await this.AppointmentService.updateAppointment(
        id as string,
        data
      )

      if (dt) {
        res.status(200).json({ msg: "Appointment updated successfully." })
      } else {
        res.status(404).json({ msg: "No appointment with ID found." })
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
