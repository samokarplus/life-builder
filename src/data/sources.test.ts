import { expect, it } from 'vitest';
// Deliberately import no feature modules: the API/Explorer must see every source too.
import { sources, sourceById } from './sources';
it('resolves every feature source without route-registration side effects', () => {
  for (const id of ['src-cub-transfer-timeline', 'src-cacrep-co', 'src-fafsa-fill', 'src-cub-bio-faculty']) expect(sourceById(id)?.url, id).toMatch(/^https:\/\//);
  expect(new Set(sources.map(s => s.id)).size).toBe(sources.length);
  expect(Object.isFrozen(sources)).toBe(true);
  expect(sources.every(Object.isFrozen)).toBe(true);
});
