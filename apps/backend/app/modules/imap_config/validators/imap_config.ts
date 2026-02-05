import vine from '@vinejs/vine';

export const createImapConfigValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(255),
    host: vine.string().trim().maxLength(255),
    port: vine.number().min(1).max(65535),
    useSsl: vine.boolean(),
  })
);

export const updateImapConfigValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(255).optional(),
    host: vine.string().trim().maxLength(255).optional(),
    port: vine.number().min(1).max(65535).optional(),
    useSsl: vine.boolean().optional(),
  })
);
