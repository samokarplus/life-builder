import {test,expect} from "@playwright/test";
async function ready(page:import('@playwright/test').Page,path:string){await page.goto(path);await expect(page.getByRole('status',{name:'Loading your plan'})).toHaveCount(0);await expect(page.getByText('Your saved plan needs attention')).toHaveCount(0);}
test('onboarding saves all preferences and survives reload',async({page})=>{
 await ready(page,'/onboarding');await page.getByRole('button',{name:'Engineer',exact:true}).click();await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.getByLabel('Degree program').selectOption('Associate of Science');await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.getByRole('button',{name:'Psychology',exact:true}).click();await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.getByLabel('Other transfer / AP / IB credits').fill('6');await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.getByRole('button',{name:'Lowest total cost',exact:true}).click();await page.getByLabel('Rough budget').fill('12000');await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('button',{name:'Generate my roadmap',exact:true}).click();
 await expect(page).toHaveURL(/overview/);await expect(page.getByRole('heading',{level:1})).toContainText('future');await expect(page.getByText(/^Saved \d/)).toBeVisible();
 await ready(page,'/profile');await expect(page.getByLabel('Intended major')).toHaveValue('Psychology');await expect(page.getByLabel('Total budget')).toHaveValue('12000');await page.reload();await expect(page.getByLabel('Degree program')).toHaveValue('Associate of Science');await expect(page.getByText('6 external credits reported separately.')).toBeVisible();
});
test('keyboard drag announces moves between semesters and persists chosen view',async({page})=>{
 await ready(page,'/roadmap');const handle=page.getByRole('button',{name:'Drag HIS 1120',exact:true});await handle.focus();await page.keyboard.press('Space');await expect(page.getByText(/Picked up HIS 1120|HIS 1120, Fall 2026 is over/)).toBeAttached();await page.keyboard.press('ArrowRight');await expect(page.getByRole('status').filter({hasText:/is over.*Spring 2027/})).toBeAttached();await page.keyboard.press('Space');await expect(page.getByRole('region',{name:'Spring 2027',exact:true}).getByRole('button',{name:'Drag HIS 1120',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Timeline',exact:true}).click();await expect(page.getByText('Transfer milestone · planned, eligibility unverified')).toBeVisible();await expect(page.getByText(/^Saved \d/)).toBeVisible();await page.reload();await expect(page.getByRole('button',{name:'Timeline',exact:true})).toHaveAttribute('aria-pressed','true');
});
test('pointer drag reaches an empty semester; undo restores the course',async({page})=>{
 await ready(page,'/roadmap');const source=await page.getByRole('button',{name:'Drag HIS 1120',exact:true}).boundingBox();const target=await page.getByTestId('drop-s-su27').boundingBox();expect(source&&target).toBeTruthy();
 await page.mouse.move(source!.x+8,source!.y+8);await page.mouse.down();await page.mouse.move(source!.x+20,source!.y+15,{steps:5});await page.mouse.move(target!.x+50,target!.y+30,{steps:20});await page.mouse.up();
 await expect(page.getByRole('region',{name:'Summer 2027',exact:true}).getByRole('button',{name:'Drag HIS 1120',exact:true})).toBeVisible();await page.getByRole('button',{name:'Undo',exact:true}).click();await expect(page.getByRole('region',{name:'Fall 2026',exact:true}).getByRole('button',{name:'Drag HIS 1120',exact:true})).toBeVisible();
});
test('summer quick-add persists and semester deletion asks before changing choices',async({page})=>{
 await ready(page,'/roadmap');await page.getByRole('button',{name:'Summer semester',exact:true}).click();await expect(page.getByRole('region',{name:'Summer 2028',exact:true})).toBeVisible();await page.getByRole('button',{name:'Delete Spring 2027',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.getByRole('button',{name:'Cancel',exact:true}).click();await expect(page.getByRole('region',{name:'Spring 2027',exact:true})).toBeVisible();await page.reload();await expect(page.getByRole('region',{name:'Summer 2028',exact:true})).toBeVisible();
});
test('course drawer closes with Escape and returns focus',async({page})=>{
 await ready(page,'/explorer');const course=page.getByRole('button',{name:/HIS 1120/});await course.click();await expect(page.getByRole('dialog')).toBeVisible();await expect(page.getByRole('button',{name:'Add to Roadmap',exact:true})).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();await expect(course).toBeFocused();
});
test('scenario comparison and user-entered cost controls work',async({page})=>{
 await ready(page,'/compare');await page.getByLabel('Scenario name',{exact:true}).fill('Lighter test');await page.getByRole('button',{name:'Lighter load (9 cr)',exact:true}).click();await page.getByRole('checkbox',{name:/Lighter test/}).check();await expect(page.getByRole('heading',{name:'What changed?',exact:true})).toBeVisible();await page.reload();await expect(page.getByText('Lighter test',{exact:true})).toBeVisible();
 await ready(page,'/costs');await page.getByLabel('FRCC tuition per credit ($)',{exact:true}).fill('100');await page.getByLabel('CU Boulder tuition per credit ($)',{exact:true}).fill('200');await expect(page.getByText('User-entered',{exact:false}).first()).toBeVisible();await page.reload();await expect(page.getByLabel('FRCC tuition per credit ($)',{exact:true})).toHaveValue('100');await expect(page.getByRole('heading',{name:'Total remaining cost',exact:true})).toBeVisible();
});
test('career linking and stage completion survive reload',async({page})=>{
 await ready(page,'/careers');await page.getByRole('button',{name:'Link to my plan',exact:true}).click();await page.getByRole('checkbox',{name:'Completed (reported by me)',exact:true}).first().check();await expect(page.getByText(/^Saved/).first()).toBeVisible();await page.waitForTimeout(500);await page.reload();await expect(page.getByText(/1 of 5 stages/)).toBeVisible();await page.getByLabel('Search careers').fill('software');await expect(page.getByRole('button',{name:/Software Developer/})).toBeVisible();
});
test('migrates a real v1 browser plan into IndexedDB without losing the backup',async({page})=>{
 await page.addInitScript(()=>{localStorage.setItem('dream-helper:v1',JSON.stringify({version:0,state:{onboarded:true,profile:{dream:'My existing dream',currentInstitutionId:'frcc',destinationInstitutionId:'cub',major:'My existing major',maxCreditsPerSemester:15,priorities:['Lowest total cost'],completed:[]},semesters:[],requiredCredits:60,tuitionPerCredit:{frcc:123,cub:null},scenarios:[]}}));});
 await ready(page,'/profile');await expect(page.getByLabel('Intended major')).toHaveValue('My existing major');await expect(page.getByText(/^Saved \d/)).toBeVisible();
 const stored=await page.evaluate(async()=>{
  const db=await new Promise<IDBDatabase>((resolve,reject)=>{const r=indexedDB.open('dream-helper');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
  const value=await new Promise<string>((resolve,reject)=>{const r=db.transaction('plans').objectStore('plans').get('dream-helper:v1');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});db.close();return {migrated:JSON.parse(value),backup:JSON.parse(localStorage.getItem('dream-helper:v1')!)};
 });
 expect(stored.migrated.version).toBe(2);expect(stored.migrated.state.profile.major).toBe('My existing major');expect(stored.backup.version).toBe(0);
});
test('top-bar search opens a filtered explorer and repeated searches update it',async({page})=>{
 await ready(page,'/overview');await page.getByRole('searchbox',{name:'Search courses',exact:true}).fill('HIS');await page.getByRole('searchbox',{name:'Search courses',exact:true}).press('Enter');await expect(page).toHaveURL(/explorer\?q=HIS/);await expect(page.getByRole('button',{name:/HIS 1120/})).toBeVisible();await expect(page.getByRole('button',{name:/GEY 1108/})).toHaveCount(0);
 await page.getByRole('textbox',{name:'Search courses',exact:true}).fill('PHI');await expect(page.getByRole('button',{name:/PHI 1014/})).toBeVisible();
 await page.getByRole('searchbox',{name:'Search courses',exact:true}).fill('GEY');await page.getByRole('searchbox',{name:'Search courses',exact:true}).press('Enter');await expect(page.getByRole('button',{name:/GEY 1108/})).toBeVisible();
});
for(const version of [2,999])test(`invalid saved data version ${version} is preserved instead of overwritten`,async({page})=>{
 await page.addInitScript(version=>{if(!localStorage.getItem('dream-helper:v1'))localStorage.setItem('dream-helper:v1',JSON.stringify({version,state:{profile:{major:'Keep this original'}}}));},version);
 await page.goto('/overview');await expect(page.getByRole('heading',{name:'Your saved plan needs attention'})).toBeVisible();
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export original backup',exact:true}).click();expect((await download).suggestedFilename()).toBe('dream-helper-original-backup.json');
 await page.getByRole('button',{name:'Retry loading',exact:true}).click();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('dream-helper:v1')!).state.profile.major)).toBe('Keep this original');
 await page.reload();await expect(page.getByRole('heading',{name:'Your saved plan needs attention'})).toBeVisible();
});
test('a different program is preserved and does not receive the AA audit',async({page})=>{
 await ready(page,'/profile');await page.getByLabel('Degree program').fill('Associate of Science');
 await page.getByRole('button',{name:'Save profile',exact:true}).click();await expect(page.getByText(/^Saved/).first()).toBeVisible();await page.waitForTimeout(800);
 await ready(page,'/roadmap');await expect(page.getByText('Requirements for your selected institution/program are not loaded.',{exact:false})).toBeVisible();
});

test('Colorado Dreams search, filters, real people and challenges',async({page})=>{
 await ready(page,'/paths');
 const cards=page.getByRole('list',{name:'Career routes'}).getByRole('listitem');
 await expect(cards).toHaveCount(7);
 await page.getByLabel(/Search careers/).fill('doctor');
 await expect(cards).toHaveCount(1);
 await page.getByLabel(/Search careers/).fill('');
 await page.getByRole('group',{name:'Filters'}).getByRole('button',{name:'Can start without a degree'}).click();
 await expect(cards).toHaveCount(3);
 await page.getByRole('button',{name:/^Nurse /}).click();
 await expect(page.getByRole('heading',{name:/Registered Nurse in Colorado/})).toBeVisible();
 await expect(page.getByRole('heading',{name:'What makes it hard'})).toBeVisible();
 await expect(page.getByText('Joel Bitler')).toBeVisible();
 await expect(page.getByText(/top 40/).first()).toBeVisible();
 await page.getByRole('button',{name:"I'm from out of state"}).click();
 await expect(page.getByText('Western Undergraduate Exchange (WUE) at FRCC')).toBeVisible();
});

test('onboarding offers high school as a starting point and a Colorado dream card',async({page})=>{
 await ready(page,'/onboarding');
 await page.getByRole('button',{name:'Nurse',exact:true}).click();
 await page.getByRole('button',{name:/Continue/}).click();
 await page.getByLabel('Where are you right now?').selectOption('high-school');
 await expect(page.getByText(/When will you start at FRCC/)).toBeVisible();
});

test('invalid dream links recover; profile stage edits and ambiguous dreams stay explicit',async({page})=>{
 await ready(page,'/paths?path=invalid&stage=invalid&q=RN');
 await expect(page.getByRole('list',{name:'Career routes'}).getByRole('button')).toHaveCount(1);
 await page.getByRole('list',{name:'Career routes'}).getByRole('button').press('Enter');
 await expect(page.getByRole('heading',{name:'Registered Nurse in Colorado',exact:true})).toBeFocused();
 await ready(page,'/profile');await page.getByLabel('Current starting point',{exact:true}).selectOption('high-school');
 await page.getByLabel('Dream career',{exact:true}).fill('physician assistant');await page.getByRole('button',{name:'Save profile',exact:true}).click();
 await page.reload();await expect(page.getByLabel('Current starting point',{exact:true})).toHaveValue('high-school');
 await ready(page,'/overview');await page.getByRole('link',{name:'Find your route',exact:true}).click();
 await expect(page.getByRole('button',{name:/^High school Dreaming/})).toHaveAttribute('aria-pressed','true');
 await page.getByText('What do these abbreviations mean?',{exact:true}).click();
 await expect(page.getByText('AMCAS',{exact:true})).toBeVisible();
});
