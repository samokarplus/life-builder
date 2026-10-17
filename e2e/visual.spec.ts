import {test,expect} from "@playwright/test";
import AxeBuilder from '@axe-core/playwright';
import {mkdir} from 'node:fs/promises';
const paths=['/','/onboarding','/overview','/roadmap','/explorer','/compare','/careers','/costs','/profile','/settings'];
for(const width of [1440,768,375])for(const theme of ['light','dark'])test(`${theme} ${width}: all pages, screenshots, contrast and overflow`,async({page})=>{
 test.setTimeout(120000);
 await page.setViewportSize({width,height:1000});await page.addInitScript(theme=>{localStorage.setItem('theme',theme);},theme);
 await mkdir('artifacts/screenshots',{recursive:true});
 for(const path of paths){
  await test.step(path,async()=>{
   await page.goto(path);await expect(page.getByRole('status',{name:'Loading your plan'})).toHaveCount(0);await page.evaluate(()=>document.fonts.ready);await expect(page.getByText('Your saved plan needs attention')).toHaveCount(0);
   const overflow=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));expect(overflow.scroll,`${path} at ${width}`).toBeLessThanOrEqual(overflow.viewport);
   const issues=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(issues.violations,JSON.stringify(issues.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})))).toEqual([]);
   await page.screenshot({path:`artifacts/screenshots/${theme}-${width}-${path==='/'?'landing':path.slice(1)}.png`,fullPage:true,animations:'disabled'});
  });
 }
 // Check the alternate planner views and modal states as well as initial pages.
 await page.goto('/roadmap');
 for(const view of ['Timeline','Dependencies']) {
  await page.getByRole('button',{name:view,exact:true}).click();
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(audit.violations,JSON.stringify(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})))).toEqual([]);
  await page.screenshot({path:`artifacts/screenshots/${theme}-${width}-roadmap-${view.toLowerCase()}.png`,fullPage:true,animations:'disabled'});
 }
 await page.goto('/explorer');await page.getByRole('button',{name:/HIS 1120/}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
 await page.screenshot({path:`artifacts/screenshots/${theme}-${width}-course-drawer.png`,animations:'disabled'});
 await page.keyboard.press('Escape');
 await page.goto('/settings');await page.getByRole('button',{name:'Reset',exact:true}).click();
 await expect(page.getByRole('dialog')).toBeVisible();await expect(page.getByRole('button',{name:'Cancel',exact:true})).toBeFocused();
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
 await page.screenshot({path:`artifacts/screenshots/${theme}-${width}-confirmation.png`,animations:'disabled'});
 await page.keyboard.press('Escape');
});
