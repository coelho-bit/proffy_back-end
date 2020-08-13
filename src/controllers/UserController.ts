import db from "../database/connection";
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';


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
        const { email, password } = request.body;
    
        if(email === "" || email == null || password === "" || password == null) {
            response.status(400).json({ error: "You must provide an email and password." });
        }
        
        const user = await db.select('email', 'password').table('users').where('email', email);
        if (user.length == 0) {
            response.status(400).json({error: 'Please provide an existing email'});
        } else {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if(result == true) {
                    response.json({message: 'Succesfully logged in!'});
                } else {
                    response.json({message: 'Incorrect password.'});
                }
            });
        }

    }
}