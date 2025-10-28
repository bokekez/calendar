// import sequelize from '../database/database';
// import UserCalendarEvent from '../database/models/UserCalendarEvent';
// import { SimpleEvent } from '../types/calendar';

// export async function upsertEventsForUser(userId: string, events: SimpleEvent[]) {
//   if (!events || events.length === 0) return;

//   const rows = events.map(e => ({
//     userId,
//     googleEventId: e.id,
//     summary: e.summary || null,
//     startDateTime: e.start ? new Date(e.start) : null,
//     endDateTime: e.end ? new Date(e.end) : null,
//     raw: e.raw || null,
//     updatedAt: new Date(),
//     createdAt: new Date(),
//   }));

//   const transaction = await sequelize.transaction();
//   try {
//     await UserCalendarEvent.bulkCreate(rows as any, {
//       updateOnDuplicate: ['summary', 'startDateTime', 'endDateTime', 'raw', 'updatedAt'],
//       transaction,
//     });

//     await transaction.commit();
//   } catch (err) {
//     await transaction.rollback();
//     throw err;
//   }
// }
