import convertHourToMinutes from "../utils/convertHourToMinutes";
import { Request, Response } from 'express';
import db from "../database/connection";
import jwt, { decode } from 'jsonwebtoken';

interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

interface TokenData {
    id: Number;
    name: string;
    email: string;
    isTeacher: Number;
}

export default class TeachersController {

    async index(request: Request, response: Response) {
        const teachers = await db.select('*').table('teachers');
        response.send(teachers);
    }

    async create(request: Request, response: Response) {

        const { subject, whatsapp, bio, cost } = request.body;
        const token = request.app.get('token');

        if(!subject || !whatsapp || !bio || !cost) {
            response.json({message: "Please fill all fields"});
        } 

        const decodedToken = jwt.decode(token) as TokenData;

        const trx = await db.transaction();

        try {
            await trx('teachers').insert({
                subject,
                whatsapp,
                bio,
                cost,
                user_id: decodedToken.id,
            });

            await trx.commit();

            response.status(201).json({message: "Succesfully created"});
        } catch(e) {
            await trx.rollback();
            console.log(e);
            response.status(400).json({message: "Something went wrong"});
        }

    }
 
    async filter(request: Request, response: Response) {
        const filters = request.query;

        const subject = filters.subject as string;
        const week_day = filters.week_day as string;
        const time = filters.time as string;

        if (!filters.subject || !filters.week_day || !filters.time) {
            return response.status(400).json({
                error: "Missing filters to search classes"
            });
        } 

        const timeInMinutes = convertHourToMinutes(time);
        
        const classes = await db('classes')
            .whereExists(function() {
                this.select('class_schedule.*')
                    .from('class_schedule')
                    .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                    .whereRaw('`class_schedule`.`week_day` == ??', [Number(week_day)])
                    .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
                    .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
            })
            .where('classes.subject', '=', subject)
            .join('users', 'classes.user_id', '=', 'users.id')
            .select(['classes.*', 'users.*']);
        
        response.json(classes);
    }
}
   