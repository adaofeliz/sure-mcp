import { z } from 'zod';

/**
 * Pagination metadata returned by list endpoints.
 * @example { page: 1, per_page: 25, total_count: 150, total_pages: 6 }
 */
export const Pagination = z.object({
  page: z.number().int(),
  per_page: z.number().int(),
  total_count: z.number().int(),
  total_pages: z.number().int(),
});
export type Pagination = z.infer<typeof Pagination>;

/**
 * Error response shape from Sure API. All fields optional because the shape varies by endpoint.
 * @example { error: "not_found", message: "Resource not found" }
 * @example { error: "validation_failed", details: ["name can't be blank"] }
 */
export const ErrorResponse = z.object({
  error: z.string().optional(),
  message: z.string().optional(),
  details: z.array(z.string()).optional(),
  errors: z.array(z.string()).optional(),
});
export type ErrorResponse = z.infer<typeof ErrorResponse>;

/**
 * Transaction nature — all 4 values accepted by the Sure API.
 * income/inflow = credit (stored as negative amount_cents)
 * expense/outflow = debit (stored as positive amount_cents)
 * @example "expense"
 * @example "income"
 */
export const Nature = z.enum(['income', 'inflow', 'expense', 'outflow']);
export type Nature = z.infer<typeof Nature>;

/**
 * Category classification.
 * @example "expense"
 * @example "income"
 */
export const Classification = z.enum(['income', 'expense']);
export type Classification = z.infer<typeof Classification>;

/**
 * Hex color string in #RRGGBB format.
 * @example "#6471eb"
 * @example "#4da568"
 * @invalid "red" — must be hex format
 */
export const HexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, 'Must be a hex color like #6471eb');
export type HexColor = z.infer<typeof HexColor>;

/**
 * UUID v4 string.
 * @example "550e8400-e29b-41d4-a716-446655440001"
 */
export const UUID = z.string().uuid();
export type UUID = z.infer<typeof UUID>;

/**
 * ISO 8601 date string (YYYY-MM-DD).
 * @example "2024-01-15"
 * @invalid "01/15/2024" — must be YYYY-MM-DD
 */
export const ISODate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD');
export type ISODate = z.infer<typeof ISODate>;

/**
 * ISO 8601 datetime string with timezone.
 * @example "2024-01-15T10:30:00Z"
 * @example "2024-01-15T10:30:00.000Z"
 */
export const ISODateTime = z.string().datetime({ offset: true });
export type ISODateTime = z.infer<typeof ISODateTime>;
