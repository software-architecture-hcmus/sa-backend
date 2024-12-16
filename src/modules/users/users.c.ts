import { NextFunction, Request, Response } from "express";
import logger from "../../utils/logger";
import AppDataSource from "../../database/data-source";
import { ROLES } from "../../shared/constants/roles.constant";
import { hash } from "../../utils/bcrypt";
import { RoleGuard } from "../../lib/decorators/role-guard.decorator";
import { UnprocessableEntityException, BadRequestException } from "../../lib/exceptions";
import { firebaseAuth, firebaseFirestore } from "../../utils/firebase";
import { USER_FIREBASE_COLLECTION } from "../../shared/constants/user-firebase-collection.constant";
import { STATUS } from "../../shared/constants/status.constant";

class UsersController {

    async test(req: Request, res: Response, next: NextFunction) {
        try {
            throw new UnprocessableEntityException({
                details: [{ issue: 'Invalid data' }]
            });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }

    @RoleGuard([ROLES.ADMIN])
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, password, role } = req.body;

            if (!name || !email || !password || !role)
                throw new BadRequestException({
                    details: [{ issue: "Body must contain {name, email, password, role}" }]
                })

            const isUserExists = await firebaseFirestore.collection(USER_FIREBASE_COLLECTION).where('email', '==', email).get();
            if (!isUserExists.empty)
                throw new BadRequestException({
                    details: [{ issue: "Email already has an account" }]
                });

            const user = await firebaseAuth.createUser({
                email,
                password,
                emailVerified: false,
                disabled: false,
            })
            
            const userData = {...req.body, status: STATUS.ACTIVE}
            delete userData.password
            await firebaseFirestore.collection(USER_FIREBASE_COLLECTION).doc(user.uid).set(userData)

            return res.status(200).json({
                message: "User created successfully",
                data: {
                    id: user.uid,
                    ...userData
                }
            });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }

    @RoleGuard([ROLES.ADMIN])
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const usersSnapshot = await firebaseFirestore.collection(USER_FIREBASE_COLLECTION).get();
            const users = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return res.status(200).json({
                message: "Users retrieved successfully",
                data: users
            });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }

    @RoleGuard([ROLES.ADMIN])
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const data = req.body;

            const user = await firebaseFirestore.collection(USER_FIREBASE_COLLECTION).doc(id).get();
            if (!user.exists)
                throw new BadRequestException({
                    details: [{ issue: "Invalid userId" }]
                });

            await firebaseFirestore.collection(USER_FIREBASE_COLLECTION).doc(id).update(data);

            return res.status(200).json({
                message: "User status updated successfully",
                data: {
                    id,
                    ...data
                }
            });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }


    // @RoleGuard(['user', 'admin'])
    // async getUserInformation(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const { email } = req.query;
    //         if (!email)
    //             throw new BadRequestException({
    //                 details: [{ issue: "Invalid email" }]
    //             });

    //         const user = await UsersController.userRepository.findOne({
    //             where: {
    //                 email: email.toString()
    //             },
    //             relations: ['roles']
    //         })

    //         return res.status(200).json(user);
    //     } catch (error: any) {
    //         logger.error(error.message);
    //         next(error);
    //     }
    // }

    // async deleteUser(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const { id } = req.params;
    //         if (!id)
    //             throw new BadRequestException({
    //                 details: [{ issue: "Invalid userId" }]
    //             });

    //         const user = await UsersController.userRepository.softDelete({ id })

    //         return res.status(200).json(user);
    //     } catch (error: any) {
    //         logger.error(error.message);
    //         next(error);
    //     }
    // }

    // static async findOrCreateRole(roleName: string) {
    //     let role = await UsersController.roleRepository.findOne({
    //         where: {
    //             roleName: roleName
    //         }
    //     })
    //     if (!role) {
    //         role = await UsersController.roleRepository.create({
    //             roleName
    //         }).save()
    //     }
    //     return role;
    // }
}

export default new UsersController;
