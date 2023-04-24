import { config as loadEnv } from 'dotenv';
loadEnv();

export type EnvVals = 'dev' | 'prod';

export type Config = {
  jwtSecret: string,
  env: String,
  callbackUrl: string,
  clientId: string,
  clientSecret: string,
  serviceAccountAuth: string,
}

function readVal<T>(key: string, caster: (x: string) => T, fallback: T | undefined = undefined): T {
  if (!(key in process.env))
    if (fallback == undefined)
      throw new Error(`Configuration key '${key}' not found in process environment.`); // halt and catch fire
    else {
      return fallback;
    }

  return caster(process.env[key]!);
}


export const config: Config = {
  jwtSecret: readVal('JWT_SECRET', String),
  env: readVal('ENV', String, 'prod'),
  callbackUrl: readVal('CALLBACK_URL', String),
  clientId: readVal('CLIENT_ID', String),
  clientSecret: readVal('CLIENT_SECRET', String),
  serviceAccountAuth: readVal('SERVICE_ACCOUNT_AUTH', String),
}