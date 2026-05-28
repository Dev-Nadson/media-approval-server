export const CACHE_TTL = {
    ONE_MINUTE: 60 * 1000,
    FIVE_MINUTES: 5 * 60 * 1000,
    HALF_HOUR: 30 * 60 * 1000,
    ONE_DAY: 24 * 60 * 60 * 1000,
} as const;

export const CACHE_KEYS = {
    ADMINS_VERSION: 'admins:version',
    ADMINS_LIST: (version: string, page: number, limit: number) =>
        `admins:v${version}:list:page:${page}:limit:${limit}`,
    ADMIN_GET: (id: string) => `admins:get:${id}`,
} as const;