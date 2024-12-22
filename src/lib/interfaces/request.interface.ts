import { Request } from "express"
import { ROLES } from "../../shared/constants/user-roles.constant";
import { STATUS } from "../../shared/constants/user-status.constant";

export interface PayloadUser {
    uid: string;
    email: string;
    role: ROLES;
    status: STATUS;
    name: string;
    phone?: string;
    date_of_birth?: string;
    gender?: string;
    avatar?: string;    
    facebook_account?: string;
    industry?: string;
    address?: string;
    gps_lat?: string;
    gps_long?: string;
}

export interface CreateGameRequest {
    
} 

export interface CustomUserRequest extends Request {
    user: PayloadUser
};