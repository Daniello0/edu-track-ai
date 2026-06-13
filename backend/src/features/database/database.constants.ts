/** Environment variable keys for PostgreSQL connection. */
export const DB_HOST_ENV = 'DB_HOST';
export const DB_PORT_ENV = 'DB_PORT';
export const DB_USERNAME_ENV = 'DB_USERNAME';
export const DB_PASSWORD_ENV = 'DB_PASSWORD';
export const DB_NAME_ENV = 'DB_NAME';

/** Default PostgreSQL connection values when env vars are unset. */
export const DEFAULT_DB_HOST = 'localhost';
export const DEFAULT_DB_PORT = 5432;
export const DEFAULT_DB_USERNAME = 'postgres';
export const DEFAULT_DB_PASSWORD = 'postgres';
export const DEFAULT_DB_NAME = 'edu_track_ai';

/** TypeORM schema sync flag (development only). */
export const DB_SYNCHRONIZE = true;
