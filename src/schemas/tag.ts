import { z } from 'zod';
import { UUID, ISODateTime, HexColor } from './common.js';

// ─── Tag response ──────────────────────────────────────────────────────────

export const Tag = z.object({
  id: UUID,
  name: z.string(),
  color: HexColor,
  created_at: ISODateTime,
  updated_at: ISODateTime,
}).passthrough();
export type Tag = z.infer<typeof Tag>;

/** Tags endpoint returns a bare array (no pagination wrapper) */
export const TagListResponse = z.array(Tag);
export type TagListResponse = z.infer<typeof TagListResponse>;

// ─── Input schemas ─────────────────────────────────────────────────────────

export const CreateTagInput = z.object({
  name: z.string().min(1, 'Tag name must not be empty'),
  color: HexColor.optional(),
});
export type CreateTagInput = z.infer<typeof CreateTagInput>;

export const UpdateTagInput = CreateTagInput.partial();
export type UpdateTagInput = z.infer<typeof UpdateTagInput>;

export const GetTagInput = z.object({ id: UUID });
export type GetTagInput = z.infer<typeof GetTagInput>;

export const DeleteTagInput = z.object({ id: UUID });
export type DeleteTagInput = z.infer<typeof DeleteTagInput>;
