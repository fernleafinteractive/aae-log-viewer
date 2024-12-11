// handles reading in log from file
onmessage = async function(e) {

    const file = e.data[0];

    const text = await file.text();
    const json = JSON.parse(text);

    postMessage(json);
}