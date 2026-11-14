
const fs=require('fs'),vm=require('vm');
const script=fs.readFileSync(process.argv[2],'utf8');
const map={home:'home()',work:'work()',journal:'journal()',experiences:'experiences()',spaces:'spaces()',community:'community()',about:'about()',contact:'contact()',lab:'lab()',members:'members()',playground:'playground()',sports:'sports()',demo:'demo()',one:'one()',work_detail:"detail('work','aurora-pavilion')",journal_detail:"detail('journal','de-kracht-van-immersive-experiences')",events_detail:"detail('experiences','pulse-festival')",spaces_detail:"detail('spaces','the-atrium')"};
const context=vm.createContext({window:{NOVA_ASSETS:{}},NOVA_ASSETS:{},location:{hash:''},console});
vm.runInContext(script,context);
const result={};
for (const [key,expr] of Object.entries(map)){
 try{result[key]=vm.runInContext(expr,context)}catch(e){result[key]='ERROR:'+e.message}
}
process.stdout.write(JSON.stringify(result));
