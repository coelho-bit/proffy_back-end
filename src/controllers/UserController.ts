import db from "../database/connection";
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import SALT_KEY from '../../config';

export default class UserController {
    
    async index(request: Request, response: Response) {
        const users = await db.select('*').table('users');
        response.send(users);
    }

    async create(request: Request, response: Response) {
        
        const { name, email, password } = request.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const trx = await db.transaction();

        try {
            await trx('users').insert({
                name,
                email,
                password: hashedPassword,
            });

            await trx.commit();

            response.status(201).send();
        } catch (err) {
            await trx.rollback();
            console.log(err);
            return response.status(400).json({ error: "Unexpected error while registering new user." })
        }
    }

    async authenticate(request: Request, response: Response) {

        interface User {
            id: Number,
            name: string, 
            email: string,
            password: string,
            is_teacher: Number
        }

        const { email, password } = request.body;

        if (email === "" || email == null || password === "" || password == null) {
            response.status(400).json({ error: "You must provide an email and password." });
        }

        const dbresult = await db.select('*').table('users').where('email', email);

        const user: User = dbresult[0];

        if (!user) {
            response.status(400).json({ error: 'Please provide an existing email' });
        } else {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result == true) {
                    const tokenData = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        isTeacher: user.is_teacher
                    }
                    const token = jwt.sign(tokenData, SALT_KEY, {
                        expiresIn: 300
                    });
                    response.send({ 
                        message: 'Succesfully logged in!',
                        token: token 
                    });
                } else {
                    response.json({ message: 'Incorrect password.'});
                }
            });
        }
    }
}