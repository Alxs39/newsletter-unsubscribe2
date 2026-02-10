import { BaseCommand, args, flags } from '@adonisjs/core/ace';
import type { CommandOptions } from '@adonisjs/core/types/ace';
import app from '@adonisjs/core/services/app';
import { users } from '#modules/user/user.schema';
import { eq } from 'drizzle-orm';

export default class CreateAdmin extends BaseCommand {
  static commandName = 'create:admin';
  static description = 'Create an admin user with email, name, and password';

  static options: CommandOptions = {
    startApp: true,
  };

  @args.string({ description: 'Email address for the admin user' })
  declare email: string;

  @args.string({ description: 'Name for the admin user' })
  declare name: string;

  @flags.string({ description: 'Password for the admin user', required: true })
  declare password: string;

  async run(): Promise<void> {
    const db = await app.container.make('db');
    const auth = await app.container.make('auth');

    try {
      const response = await auth.api.signUpEmail({
        body: {
          email: this.email,
          password: this.password,
          name: this.name,
        },
      });

      if (!response?.user) {
        this.logger.error('Failed to create user');
        return;
      }

      await db.update(users).set({ role: 'admin' }).where(eq(users.id, response.user.id));

      this.logger.success(`Admin user created: ${this.email}`);
    } catch (error) {
      this.logger.error(`Failed to create admin: ${(error as Error).message}`);
    }
  }
}
