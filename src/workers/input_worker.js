// handles reading in log from file
onmessage = async function(e) {

    console.log("worker received message");

    const files = e.data;
    const output = [];

    for(const file of files) {
        const text = await file.text();
        const json = JSON.parse(text);

        if(!json) return;
        if(typeof json !== "object") return;

        const keys = Object.keys(json);
        if(keys.length === 0) return;

        if(keys[0] === "elements") return;

        for(const k of Object.keys(json)) {
            const oldObject = json[k];
            const newObject = {};
            delete Object.assign(newObject, oldObject, {["data"]: oldObject["json_params"] })["json_params"];
            output.push(newObject);
        }
    }

    postMessage(output);
}