import { performance } from "perf_hooks";

// TODO: Determine and replace with some real average values
const readFileDelay = 1000
const convertFileDelay = 100
const addToDocumentDelay = 10

const urls = ['google.com', 'yahoo.com', 'aol.com', 'netscape.com', 'nt.com', 'bbc.com', 'fcbarcelona.com', 'netflix.com', 'fb.com', 'mozilla.com',
    'google.com', 'yahoo.com', 'aol.com', 'netscape.com', 'nt.com', 'bbc.com', 'fcbarcelona.com', 'netflix.com', 'fb.com', 'mozilla.com'];

function runSequentialFlow() {
    const start = performance.now();
    const document: { pages: number}[] = [];

    for (let i = 0; i < urls.length; i++) {
        const rawFile = readFileSync(urls[i], i + 1)
        const pdfFile = convertFileSync(rawFile)
        document.push(addToDocumentSync(pdfFile));
    }
    console.log('\n>> total time [sequential]: '.concat(String(performance.now() - start)).concat(' ms\n'));
}

async function runParallelFlow() {
    const start = performance.now();
    const document: { pages: number}[] = [];

    // Read files
    const rawFilesPromises = urls.map((url, index) => readFileAsync(url, index + 1));
    const rawFiles = await Promise.all(rawFilesPromises);

    // Convert and merge files
    for (let i = 0; i < rawFiles.length; i++) {
        const pdfFile = convertFileSync(rawFiles[i])
        document.push(addToDocumentSync(pdfFile));
    }
    console.log('\n>> total time [parallel]: '.concat(String(performance.now() - start)).concat(' ms\n'));
}

function readFileSync(url: string, id: number): { name: string, id: number } {
    sleep(readFileDelay); 
    return {name: url, id };
}

function convertFileSync(rawFile: { name: string; id: number }): { pages: number, body: Buffer, id: number } {
    sleep(convertFileDelay); 
    return {pages: 5, body: new Buffer(rawFile.name), id: rawFile.id};
}

function addToDocumentSync(pdfFile: { pages: number, body: Buffer, id: number }): { pages: number } {
    sleep(addToDocumentDelay); 
    return {pages: pdfFile.pages-2};
}


function readFileAsync(url: string, id: number): Promise<{ name: string, id: number }> {
    return new Promise((resolve) => {
        setTimeout(() => { 
            resolve({ name: url, id });
        }, readFileDelay);
    });
}

function sleep(milliseconds: number) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

runSequentialFlow();
runParallelFlow();

