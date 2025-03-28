import { query, body, param } from "express-validator";
import { validationErrorMiddleware } from "./middlewares";
import { EventType } from "../domain";

export const filterEventLogValidator = [
  query("type")
    .optional()
    .isString()
    .toUpperCase()
    .isIn(Object.values(EventType)),
  query("from").custom((value, { req }) => {
    if (req?.query?.from && !req.query.to) {
      throw new Error("from and to must be provided together");
    }
    return true;
  }),
  query("to").custom((value, { req }) => {
    if (req?.query?.to && !req.query.from) {
      throw new Error("from and to must be provided together");
    }
    return true;
  }),
  query("from").optional().isISO8601().toDate(),
  query("to").optional().isISO8601().toDate(),
  validationErrorMiddleware,
];

export const createEventValidator = [
  body("description").isString(),
  validationErrorMiddleware,
];

export const getEventLogValidator = [
  param("id").isNumeric(),
  validationErrorMiddleware,
];
