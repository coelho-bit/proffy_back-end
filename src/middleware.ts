import jwt from 'jsonwebtoken';
import SALT_KEY from '../config';
import { Request, Response, NextFunction } from 'express';

export default class Middleware {
    static authorize(request: Request, response: Response, next: NextFunction) {

        var token = <string>request.headers['x-access-content'];

        jwt.verify(token, SALT_KEY, function (err, decoded) {
            if (err) {
                response.status(401).json({ message: "Invalid token." });
            } else {
                request.app.set('token', token);
                next();
            }
        })
    }
}

