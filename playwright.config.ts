import { defineConfig } from "@playwright/test";
// Use PW_PORT so tests never attach to some other app already listening on 3000.
const port = Number(process.env.PW_PORT ?? 3100);
export default defineConfig({
 testDir:"./e2e",fullyParallel:true,workers:3,timeout:45000,
 use:{baseURL:`http://localhost:${port}`,viewport:{width:1440,height:1000},trace:"retain-on-failure",screenshot:"only-on-failure",reducedMotion:"reduce"},
 reporter:[["list"],["html",{open:"never"}]],
 webServer:{command:`npm run start -- --port ${port}`,url:`http://localhost:${port}`,reuseExistingServer:false,timeout:60000},
});
