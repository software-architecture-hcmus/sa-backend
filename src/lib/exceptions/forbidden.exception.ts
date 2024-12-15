import { ClientErrorDetails } from "../interfaces/common.interface";
import { HttpStatus } from "./enums/http-status.enum";
import { HttpException } from "./http.exception";

export class ForbiddenException extends HttpException {
    constructor(body: { details: ClientErrorDetails[] }) {
        super(body.details, HttpStatus.FORBIDDEN);
        this.message = "Forbidden Exception";
    }
}