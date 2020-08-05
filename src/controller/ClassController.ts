import { Request, Response } from 'express'

import db from '../database/connection';
import convertHourToMinutes from '../Utils/convertHourToMinutes';

interface scheduleItem {
    week_day: number,
    from: string,
    to: string
}

export default class ClassController {
    async index(request: Request, response: Response) {
        const filter = request.query;

        if (!filter.week_day || !filter.subject || !filter.time) {
            return response.status(400).json({
                error: "Filtros não encontrados"
            });
        }

        const week_day = filter.week_day as string;
        const subject = filter.subject as string;
        const time = filter.time as string;

        const timeInMinute = convertHourToMinutes(time as string);
        try {

            const classes = await db('class')
                .whereExists(function () {
                    this.select('class_schedule.*')
                        .from('class_schedule')
                        .whereRaw('`class_schedule`.`class_id` = `class`.`id`')
                        .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
                        .whereRaw('`class_schedule`.`from` <= ??', [timeInMinute])
                        .whereRaw('`class_schedule`.`to` > ??', [timeInMinute])
                })
                .where('class.subject', '=', subject as string)
                .join('user', 'class.user_id', '=', 'user_id')
                .select(['class.*', 'user.*']);

            return response.json(classes);
        } catch (error) {
            console.log(error);

        }

    }

    async create(request: Request, response: Response) {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = request.body;

        const trx = await db.transaction();

        try {
            const newUser = await trx('user').insert({
                name,
                avatar,
                whatsapp,
                bio
            });

            const newClass = await trx('class').insert({
                subject,
                cost,
                user_id: newUser[0]
            })

            const scheduleToSave = schedule.map((x: scheduleItem) => {

                return {
                    class_id: newClass[0],
                    week_day: x.week_day,
                    from: convertHourToMinutes(x.from),
                    to: convertHourToMinutes(x.to)
                };
            });

            await trx('class_schedule').insert(scheduleToSave);

            await trx.commit();

            return response.status(201).send();
        } catch (erro) {
            console.log(erro);

            await trx.rollback();
            return response.status(500).json({
                error: "Erro inesperado"
            });
        }
    }
}