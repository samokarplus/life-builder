import { afterEach, expect,it,vi } from "vitest";
import { GET,POST } from "@/app/api/assistant/route";
import { ACADEMIC_INSTRUCTIONS, responseText } from "./server";
import { defaultProfile } from "@/store/planner";
afterEach(()=>{vi.unstubAllEnvs();vi.unstubAllGlobals();});
it("is disabled without a server key and never exposes it",async()=>{vi.stubEnv("OPENAI_API_KEY","");expect(await (await GET(new Request("http://localhost/api/assistant"))).json()).toEqual({enabled:false});expect((await POST(new Request("http://localhost/api/assistant",{method:"POST",body:"{}"}))).status).toBe(503);});
it("rejects remote origins and malformed plans before provider access",async()=>{vi.stubEnv("OPENAI_API_KEY","test-secret");vi.stubEnv("OPENAI_MODEL","test-model");const fetch=vi.fn();vi.stubGlobal("fetch",fetch);expect((await POST(new Request("http://localhost/api/assistant",{method:"POST",headers:{origin:"https://foreign.test"},body:"{}"}))).status).toBe(403);expect((await POST(new Request("http://localhost/api/assistant",{method:"POST",body:"{}"}))).status).toBe(400);expect(fetch).not.toHaveBeenCalled();});
it("sends only validated academic data with honesty instructions and storage disabled",async()=>{vi.stubEnv("OPENAI_API_KEY","test-secret");vi.stubEnv("OPENAI_MODEL","test-model");const fetch=vi.fn().mockResolvedValue(Response.json({output:[{type:"message",content:[{type:"output_text",text:"unknown, check official sources"}]}]}));vi.stubGlobal("fetch",fetch);const res=await POST(new Request("http://localhost/api/assistant",{method:"POST",body:JSON.stringify({question:"What transfers?",plan:{profile:{...defaultProfile,dream:"PRIVATE DREAM",budget:9999},semesters:[],tuitionPerCredit:{frcc:null}}})}));expect(res.status).toBe(200);const payload=JSON.parse(fetch.mock.calls[0][1].body);expect(payload.store).toBe(false);expect(payload.instructions).toBe(ACADEMIC_INSTRUCTIONS);expect(payload.input).not.toContain("PRIVATE DREAM");expect(payload.input).not.toContain("9999");expect(JSON.stringify(await res.json())).not.toContain("test-secret");});
it("does not turn malformed provider output into a fabricated answer",()=>{expect(responseText({wrong:"shape"})).toBeNull();});
it('rejects oversized UTF-8/chunked bodies before provider access',async()=>{
 vi.stubEnv('OPENAI_API_KEY','test-secret');vi.stubEnv('OPENAI_MODEL','test-model');const fetch=vi.fn();vi.stubGlobal('fetch',fetch);
 const res=await POST(new Request('http://localhost/api/assistant',{method:'POST',body:'é'.repeat(60_000)}));
 expect(res.status).toBe(413);expect(fetch).not.toHaveBeenCalled();
});
it('does not leak provider errors or keys',async()=>{
 vi.stubEnv('OPENAI_API_KEY','test-secret');vi.stubEnv('OPENAI_MODEL','test-model');vi.stubGlobal('fetch',vi.fn().mockRejectedValue(Error('test-secret provider stack')));
 const res=await POST(new Request('http://localhost/api/assistant',{method:'POST',body:JSON.stringify({question:'Help',plan:{profile:defaultProfile,semesters:[],tuitionPerCredit:{}}})}));
 expect(res.status).toBe(502);expect(await res.text()).not.toContain('test-secret');
});
