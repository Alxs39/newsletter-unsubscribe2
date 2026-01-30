import app from '@adonisjs/core/services/app';

const db = await app.container.make('db');

export { db as default };
