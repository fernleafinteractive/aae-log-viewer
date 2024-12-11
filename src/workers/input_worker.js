// handles reading in log from file
onmessage = async function(e) {

    const files = e.data;
    const output = [];

    for(const file of files) {
        const text = await file.text();
        const json = JSON.parse(text);

        for(const k of Object.keys(json)) {
            const oldObject = json[k];
            const newObject = {};
            delete Object.assign(newObject, oldObject, {["data"]: oldObject["json_params"] })["json_params"];
            output.push(newObject);
        }
    }

    postMessage(output);
}