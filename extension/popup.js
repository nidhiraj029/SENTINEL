const API="http://127.0.0.1:8000";
const $=id=>document.getElementById(id);

function render(r){
  $("domain").textContent=r.domain||r.url||"Unknown";
  $("score").textContent=r.score??"--";
  $("level").textContent=r.level||"UNKNOWN";
  $("classification").textContent=r.classification||"";
  $("reasons").innerHTML="";
  if((r.reasons||[]).length){
    r.reasons.slice(0,6).forEach(x=>{
      const d=document.createElement("div");
      d.className="reason";
      d.textContent=`⚠ ${x.signal}`;
      $("reasons").appendChild(d);
    });
  }else{
    const d=document.createElement("div");
    d.className="reason safe";
    d.textContent="✓ No significant threats detected";
    $("reasons").appendChild(d);
  }
}

async function scan(){
  $("message").textContent="Analyzing...";
  try{
    const tabs=await chrome.tabs.query({active:true,currentWindow:true});
    if(!tabs[0]?.url) throw new Error("No active URL");
    const r=await fetch(`${API}/api/analyze`,{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({url:tabs[0].url})
    }).then(x=>x.json());
    render(r);
    await chrome.storage.local.set({sentinel_last_result:r});
    $("message").textContent="Scan complete.";
  }catch(e){
    $("message").textContent="Backend unavailable. Start FastAPI on port 8000.";
  }
}
$("scan").onclick=scan;
scan();
