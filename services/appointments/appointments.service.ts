import {
  Appointment,
  AppointmentData,
} from "../../app/repositories/appointment"

export class AppointmentService {
  constructor(private AppointmentDB: Appointment) {
    this.AppointmentDB = AppointmentDB
  }
  async createAppointment(data: AppointmentData): Promise<AppointmentData> {
    return await this.AppointmentDB.createAppointment(data)
  }

  async getAppointments(): Promise<AppointmentData[]> {
    return this.AppointmentDB.getAppointments()
  }

  async getPropertyAppointments(
    propertyId: string
  ): Promise<AppointmentData[]> {
    return this.AppointmentDB.getPropertyAppointments(propertyId)
  }

  async updateAppointment(
    appointmentId: string,
    data: Record<string, string>
  ): Promise<number | null> {
    return this.AppointmentDB.updatePropertyAppointment(appointmentId, data)
  }
}
