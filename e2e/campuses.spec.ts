import { test,expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for(const width of [1440,768,375])for(const theme of ['light','dark'])test(`campus planning: ${theme} ${width}`,async({page},testInfo)=>{
 await page.clock.setFixedTime(new Date('2026-10-16T12:00:00-06:00'));
 await page.setViewportSize({width,height:1000});
 await page.addInitScript(theme=>localStorage.setItem('theme',theme),theme);
 await page.goto('/paths');
 const section=page.getByRole('region',{name:'Explore a Colorado transfer destination'});
 await expect(section.getByRole('heading',{name:'Transfer to CU Denver',exact:true})).toBeVisible();
 await expect(section.getByText('2027-07-15', {exact:false})).toBeVisible();
 await section.getByRole('combobox',{name:'Entry year',exact:true}).selectOption('2028');
 await expect(section.getByText(/No verified dates loaded/)).toBeVisible();
 await section.getByRole('combobox',{name:'Entry year',exact:true}).selectOption('2027');
 for(const [id,name] of [['cud','CU Denver'],['csu','Colorado State University'],['mines','Colorado School of Mines'],['cmu','Colorado Mesa University'],['unc','University of Northern Colorado'],['uccs','UCCS']]){
  await section.getByRole('combobox',{name:'Campus',exact:true}).selectOption(id);
  await expect(section.getByRole('heading',{name:`Transfer to ${name}`,exact:true})).toBeVisible();
  await expect(section.getByText(/Published tuition example/)).toBeVisible();
  expect((await new AxeBuilder({page}).include('section[aria-label="Explore a Colorado transfer destination"]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
 }
 await testInfo.attach(`campus-${theme}-${width}`,{body:await section.screenshot(),contentType:'image/png'});
 await section.getByRole('combobox',{name:'Campus',exact:true}).selectOption('unc');
 await expect(section.getByText(/2027-06-01/)).toBeVisible();
 await section.getByRole('combobox',{name:'Applicant type',exact:true}).selectOption('first-year');
 await expect(section.getByText(/2027-02-01/)).toBeVisible();
 await page.goto('/funding');
 const calendar=page.getByRole('region',{name:'Campus application and aid calendar'});
 await calendar.getByRole('combobox',{name:'Campus',exact:true}).selectOption('mines');
 await expect(calendar.getByText('FAFSA deadline',{exact:true})).toBeVisible();
 await expect(calendar.getByText(/2027-04-01/).first()).toBeVisible();
 await expect(calendar.getByText(/Published cycle date/).first()).toBeVisible();
});
