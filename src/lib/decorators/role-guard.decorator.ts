import { Request, Response, NextFunction } from 'express';
import { CustomUserRequest } from '../interfaces/request.interface';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { UnauthorizedException } from '../exceptions/unauthorized.exception';

export const RoleGuard = (roles: string[]) => {
    return function (_target: any, _propertyName: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, _next: NextFunction) {
            const _req = req as CustomUserRequest;

            if(!_req.user)
                return _next(new UnauthorizedException({ details: [{ issue: 'Unauthorized' }] }));

            const isAuthorized = roles.includes(_req.user.role);
            if (isAuthorized) {
                originalMethod.apply(this, arguments);
            } else {
                return _next(new ForbiddenException({ details: [{ issue: 'Forbidden request' }] }));
            }
        };
    };
}