import Joi from "joi";
import { username, password } from "../../../lib/joy/common";
export const fetchLoginSchema = Joi.object().keys({
    username: username.required(),
    password: password.required(),
})