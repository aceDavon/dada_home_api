import { NextFunction, Request, Response } from "express"
import Joi from "joi"

export const filterSchema = Joi.object({
  category: Joi.string().optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  address: Joi.string().optional(),
})

export const validateFilters = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, value } = filterSchema.validate(req.query)

  if (error) {
    res.status(400).json({ error: error.details[0].message })
    return
  }

  req.query = value
  next()
}