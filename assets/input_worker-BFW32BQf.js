(function(){"use strict";onmessage=function(e){const s=e.data,t=[];for(const c of Object.keys(s)){const o=s[c],n={};delete Object.assign(n,o,{data:o.json_params}).json_params,t.push(n)}postMessage(t)}})();
