import db from "../database/connection";
import { Request, Response } from 'express';

export default class UserController {

    async index(request: Request, response: Response) {
        const users = await db.select('*').table('users');
        response.send(users);
    }

    async create(request: Request, response: Response) {
        const { name, email, password } = request.body;

        const trx = await db.transaction();

        try {
            await trx('users').insert({
                name,
                email,
                password,
            });

            await trx.commit();

            response.status(201).send();
        } catch (err) {
            await trx.rollback();
            console.log(err);
            return response.status(400).json({ error: "Unexpected error while registering new user" })
        }
    }
}