import convertHourToMinutes from "../utils/convertHourToMinutes";
import { Request, Response } from 'express';
import db from "../database/connection";
import jwt, { decode } from 'jsonwebtoken';

interface ScheduleItem {
    week_day: Number;
    from: string;
    to: string;
}

interface TokenData {
    id: Number;
    name: string;
    email: string;
    isTeacher: Number;
}

interface Teacher {
    id: Number,
    subject: string,
    bio: string,
    cost: Number,
    whatsapp: string,
    user_id: Number,
    name: Text,
    schedules: { week_day: number, from: number, to: number }[]
}

export default class TeachersController {

    async index(request: Request, response: Response) {

        let teachers = await db('teachers')
            .join('users', 'users.id', '=', 'teachers.user_id')
            .select('teachers.*', 'users.name')

        var mappedTeachers: Teacher[] = [];

        teachers.forEach((teacher: Teacher) => {
            db('teacher_schedule')
                .select('week_day', 'from', 'to')
                .where('teacher_schedule.teacher_id', '=', `${teacher.id}`)
                .then((schedules: { week_day: number, from: number, to: number }[]) => {

                    teacher.schedules = schedules;

                    mappedTeachers.push(teacher);
                    if (mappedTeachers.length >= teachers.length) {
                        response.json(mappedTeachers);
                    }
                });
        })

        
    }

    async create(request: Request, response: Response) {

        const { subject, whatsapp, bio, cost, schedule } = request.body;
        const token = request.app.get('token');

        const decodedToken = jwt.decode(token) as TokenData;

        if (decodedToken.isTeacher === 1) {
            response.json({ message: "This user is already a teacher." });
        }

        if (!subject || !whatsapp || !bio || !cost || !schedule) {
            response.json({ message: "Please fill all fields" });
        }

        const trx = await db.transaction();

        try {
            const insertedTeachersIds = await trx('teachers').insert({
                subject,
                whatsapp,
                bio,
                cost,
                user_id: decodedToken.id,
            });

            const teacher_id = insertedTeachersIds[0];

            const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
                return {
                    teacher_id,
                    week_day: scheduleItem.week_day,
                    from: convertHourToMinutes(scheduleItem.from),
                    to: convertHourToMinutes(scheduleItem.to),
                }
            });

            console.log(classSchedule);

            await trx('teacher_schedule').insert(classSchedule);

            await trx('users')
                .where({ id: decodedToken.id })
                .update({
                    is_teacher: 1,
                });

            await trx.commit();

            response.status(201).json({ message: "Succesfully created" });
        } catch (e) {
            await trx.rollback();
            console.log(e);
            response.status(400).json({ message: "Something went wrong" });
        }

    }
    async update(request: Request, response: Response) {
        const { subject, whatsapp, bio, cost } = request.body;
        const token = request.app.get('token');

        const decodedToken = jwt.decode(token) as TokenData;


        if (!subject && !whatsapp && !bio && !cost) {
            response.json({ message: "You have to update at least one property" });
        }

        const trx = await db.transaction();

        try {
            await trx('teachers')
                .where({ id: decodedToken.id })
                .update({
                    subject,
                    whatsapp,
                    bio,
                    cost,
                });

            await trx.commit();
            response.json({ message: "Updated" });
        } catch (e) {
            await trx.rollback();
            console.log(e);
            response.json({ message: "Something went wrong." });
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
            .whereExists(function () {
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
