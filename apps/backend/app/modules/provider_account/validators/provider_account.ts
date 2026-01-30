import vine from '@vinejs/vine';

export const createProviderAccountValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
);
