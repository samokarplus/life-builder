import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('stale sources warn without changing verification dates or student choices',async({page},testInfo)=>{
 await page.clock.setFixedTime(new Date('2027-01-15T12:00:00-07:00'));
 await page.setViewportSize({width:375,height:1000});
 await page.goto('/settings');await page.getByText(/Sources and last checks/).click();
 await expect(page.getByText(/Needs recheck \(91 days old\)/).first()).toBeVisible();
 await expect(page.getByText(/last checked 2026-10-16/).first()).toBeVisible();
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
 await testInfo.attach('stale-source-mobile',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
});
