import { expect,it } from 'vitest';
import { coloradoCareerRoutes,coloradoCareerMeta } from './career-expansion';
import { sourceById } from './sources';
import { routeProgress } from '@/lib/dream-params';
it('loads nine sourced routes without inventing the two unverified full pathways',()=>{
 expect(coloradoCareerRoutes).toHaveLength(9);
 for(const route of coloradoCareerRoutes){expect(route.caution).toBeTruthy();expect(coloradoCareerMeta[route.id]).toBeDefined();for(const step of route.steps)expect(sourceById(step.sourceId)?.status,`${route.id}/${step.id}`).toBe('verified');}
 expect(coloradoCareerRoutes.map(r=>r.id)).not.toEqual(expect.arrayContaining(['pilot-colorado','firefighter-colorado']));
});
it('keeps credential distinctions, unknown timing and unsupported numeric claims explicit',()=>{
 const sw=coloradoCareerRoutes.find(r=>r.id==='social-worker-colorado')!;
 expect(sw.caution).toContain('LSW');expect(sw.caution).toContain('not loaded');
 expect(JSON.stringify(sw)).not.toMatch(/3,000|3,360|3360/);
 const paramedic=coloradoCareerRoutes.find(r=>r.id==='paramedic-colorado')!;
 expect(JSON.stringify(paramedic)).not.toContain('psychomotor');
 const pharmacy=coloradoCareerRoutes.find(r=>r.id==='pharmacist-colorado')!;
 expect(pharmacy.steps.find(s=>s.id==='pharm-prereqs')?.detail).toContain('not required');
 expect(pharmacy.steps.find(s=>s.id==='pharm-intern')?.detail).toContain('1,500');
 for(const id of ['pe-colorado','pa-colorado','dental-hygienist-colorado','social-worker-colorado','paramedic-colorado','veterinarian-colorado'])expect(coloradoCareerMeta[id].ideal).toEqual([]);
});
it('isolates progress by route and rejects foreign, duplicate or retired step IDs',()=>{
 const route=coloradoCareerRoutes.find(r=>r.id==='pa-colorado')!;
 expect(routeProgress(route.id,[route.steps[1].id,route.steps[1].id,'md-1','unknown'])).toEqual([route.steps[1].id]);
});
