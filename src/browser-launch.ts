const puppeteer = require('puppeteer');
const { performance } = require('perf_hooks');

const iterations = 10000;
const BenchmarkBrowserLaunch = async () => {
    let browser;

    const start_time = performance.now();

    for (let i = 0; i < iterations; i++) {
        browser = await puppeteer.launch();

        await browser.close();
    }

    const end_time = performance.now();

    const total_time = end_time - start_time;
    const average_time = total_time / iterations;

    process.stdout.write (
        'BenchmarkBrowserLaunch\n'
        + 'Average Time:\t' + average_time + ' ms\n'
        + 'Iterations:\t' + iterations.toLocaleString() + '\n'
    );

    process.exit();
};


const BenchmarkBrowserConnect = async () => {
    let browser = await puppeteer.launch();
    const browserWSEndpoint = browser.wsEndpoint();

    browser.disconnect();

    const start_time = performance.now();

    for (let i = 0; i < iterations; i++) {
        browser = await puppeteer.connect({
            browserWSEndpoint,
        });

        browser.disconnect();
    }

    const end_time = performance.now();

    const total_time = end_time - start_time;
    const average_time = total_time / iterations;

    process.stdout.write (
        'BenchmarkBrowserConnect\n'
        + 'Average Time:\t' + average_time + ' ms\n'
        + 'Iterations:\t' + iterations.toLocaleString() + '\n'
    );

    process.exit();
};

BenchmarkBrowserLaunch();
// BenchmarkBrowserConnect();
