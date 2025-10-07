const env = import.meta.env;

export const IS_PRODUCTION = env.VITE_APP_PRODUCTION === 'true';
