import { HttpError } from './http-error';

export function parseIdParam(raw: string | undefined): number {
  if (raw === undefined) {
    throw new HttpError(400, 'Validation failed (numeric string is expected)');
  }
  const id = Number(raw);
  if (Number.isNaN(id)) {
    throw new HttpError(400, 'Validation failed (numeric string is expected)');
  }
  return id;
}

export function parseQueryDate(value: unknown, field: string): Date {
  if (value === undefined || value === null || value === '') {
    throw new HttpError(
      400,
      `Validation failed (parsable date is expected for query parameter "${field}")`,
    );
  }
  if (typeof value !== 'string') {
    throw new HttpError(
      400,
      `Validation failed (parsable date is expected for query parameter "${field}")`,
    );
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new HttpError(
      400,
      `Validation failed (parsable date is expected for query parameter "${field}")`,
    );
  }
  return d;
}
