console.log("Created 2")

onmessage = function(e) {

    const json = e.data;

    const output = [];
    for(const k of Object.keys(json)) {
        const oldObject = json[k];
        const newObject = {};
        delete Object.assign(newObject, oldObject, {["data"]: oldObject["json_params"] })["json_params"];
        output.push(newObject);
    }

    postMessage(output);
}