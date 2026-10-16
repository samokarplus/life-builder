import { defineConfig } from "@playwright/test";
export default defineConfig({
 testDir:"./e2e",fullyParallel:true,workers:3,timeout:45000,
 use:{baseURL:"http://localhost:3000",viewport:{width:1440,height:1000},trace:"retain-on-failure",screenshot:"only-on-failure",reducedMotion:"reduce"},
 reporter:[["list"],["html",{open:"never"}]],
 webServer:{command:"npm run start -- --port 3000",url:"http://localhost:3000",reuseExistingServer:!process.env.CI,timeout:60000},
});
