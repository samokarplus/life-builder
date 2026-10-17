import { test,expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for(const width of [1440,768,375])for(const theme of ['light','dark'])test(`Boulder requirements ${theme} ${width}`,async({page},testInfo)=>{
 await page.setViewportSize({width,height:1000});
 await page.addInitScript(theme=>localStorage.setItem('theme',theme),theme);
 await page.goto('/roadmap');
 const panel=page.getByRole('region',{name:'CU Boulder program requirements'});
 for(const [id,name] of [['cub-philosophy-general','Philosophy BA · general track'],['cub-psychology','Psychology BA'],['cub-aerospace-bs','Aerospace Engineering Sciences BSAE'],['cub-bio-ms','Bioastronautics · traditional MS focus']]){
  await panel.getByRole('combobox',{name:'Program preview',exact:true}).selectOption(id);
  await expect(panel.getByRole('heading',{name,exact:true})).toBeVisible();
  await expect(panel.getByText(/Planning aid, not an official degree audit/)).toBeVisible();
  expect((await new AxeBuilder({page}).include('section[aria-label="CU Boulder program requirements"]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
 }
 await panel.locator('summary').filter({hasText:'One approved math course'}).click();
 await expect(panel.getByText(/Multi-Object Filtering Theory/).last()).toBeVisible();
 await testInfo.attach(`boulder-${theme}-${width}`,{body:await panel.screenshot(),contentType:'image/png'});
 await page.goto('/costs');
 await expect(page.getByRole('region',{name:'Published CU Boulder tuition example'}).getByText(/\$6,987/)).toBeVisible();
 await expect(page.getByText(/COF assumption tentative/)).toBeVisible();
});
test('Boulder courses can be planned explicitly and cross-campus placement offers a fix',async({page})=>{
 await page.goto('/explorer?q=ASEN%205016');
 await page.getByRole('button',{name:/ASEN 5016/}).click();
 await expect(page.getByRole('dialog').getByText(/CU Boulder official catalog/)).toBeVisible();
 await expect(page.getByRole('dialog').getByText(/Prerequisites, corequisites, enrollment restrictions/)).toBeVisible();
 await page.getByRole('button',{name:'Add to Roadmap',exact:true}).click();
 await page.goto('/roadmap');
 const conflicts=page.getByRole('region',{name:'Plan conflicts'});
 await expect(conflicts.getByText(/ASEN 5016 is a CU Boulder catalog course/)).toBeVisible();
 await conflicts.getByRole('button',{name:'Review semester institution',exact:true}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.keyboard.press('Escape');
 const panel=page.getByRole('region',{name:'CU Boulder program requirements'});
 await panel.getByRole('combobox',{name:'Program preview',exact:true}).selectOption('cub-bio-ms');
 await panel.locator('summary').filter({hasText:'Two required BIA core courses'}).click();
 await expect(panel.getByText('ASEN 5016',{exact:true})).toBeVisible();
});
