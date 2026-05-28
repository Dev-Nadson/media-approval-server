export const CACHE_TTL = {
    ONE_MINUTE: 60 * 1000,
    FIVE_MINUTES: 5 * 60 * 1000,
    HALF_HOUR: 30 * 60 * 1000,
    ONE_DAY: 24 * 60 * 60 * 1000,
} as const;

export const CACHE_KEYS = {
    ADMINS_LIST_PREFIX: 'admins:list:',
    ADMINS_LIST: (page: number, limit: number) => `admins:list:page:${page}:limit:${limit}`,
    ADMIN_GET: (id: string) => `admins:get:${id}`,
    ADMIN_DELETE: (id: string) => `admins:delete:${id}`,
    ADMIN_UPDATE: (id: string) => `admins:update:${id}`,
} as const;