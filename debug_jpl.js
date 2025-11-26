// Native fetch is available in Node.js 18+

async function testBackend() {
    console.log("\nTesting Local Backend...");
    try {
        const response = await fetch('http://localhost:2112/api/solar-system-positions');
        if (!response.ok) {
            console.error(`Backend Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error("Response:", text);
            return;
        }
        const data = await response.json();
        console.log("Backend Response:", JSON.stringify(data, null, 2).substring(0, 500) + "...");
    } catch (e) {
        console.error("Backend connection error:", e.message);
    }
}

async function testJPL() {
    console.log("Testing JPL Horizons API directly...");
    const dateStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const params = new URLSearchParams({
        format: 'text',
        COMMAND: '399', // Earth
        OBJ_DATA: 'NO',
        MAKE_EPHEM: 'YES',
        EPHEM_TYPE: 'VECTORS',
        CENTER: '500@10',
        START_TIME: dateStr,
        STOP_TIME: tomorrowStr,
        STEP_SIZE: '1d',
        VEC_TABLE: '2',
        OUT_UNITS: 'AU-D',
        CSV_FORMAT: 'YES',
        VEC_LABELS: 'YES'
    });

    const url = `https://ssd.jpl.nasa.gov/api/horizons.api?${params.toString()}`;
    console.log(`Fetching: ${url}`);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`HTTP Error: ${response.status} ${response.statusText}`);
            return;
        }
        const text = await response.text();
        console.log("Response length:", text.length);
        if (text.includes("$$SOE")) {
            console.log("Found $$SOE marker. Data seems valid.");
        } else {
            console.log("No $$SOE marker found. Response might be error or empty.");
            console.log("Preview:", text.substring(0, 500));
        }
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

async function testDesignation(designation) {
    console.log(`\nTesting designation: '${designation}'...`);
    const params = new URLSearchParams({
        format: 'text',
        COMMAND: `'${designation}'`,
        OBJ_DATA: 'YES',
        MAKE_EPHEM: 'YES',
        EPHEM_TYPE: 'VECTORS',
        CENTER: '500@10',
        START_TIME: new Date().toISOString().split('T')[0],
        STOP_TIME: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        STEP_SIZE: '1d',
        VEC_TABLE: '2',
        CSV_FORMAT: 'YES'
    });

    const url = `https://ssd.jpl.nasa.gov/api/horizons.api?${params.toString()}`;
    try {
        const response = await fetch(url);
        const text = await response.text();
        if (text.includes("$$SOE")) {
            console.log(`✅ SUCCESS! Found data for '${designation}'`);
            return true;
        } else {
            if (text.includes("Multiple major bodies match")) {
                console.log(`⚠️  AMBIGUOUS: '${designation}' matches multiple bodies.`);
            } else if (text.includes("No matches found")) {
                console.log(`❌ FAILED: '${designation}' not found.`);
            } else {
                console.log(`❌ FAILED: '${designation}' returned unknown response.`);
                // console.log(text.substring(0, 200));
            }
            return false;
        }
    } catch (e) {
        console.error(`Error fetching '${designation}':`, e.message);
        return false;
    }
}

async function run() {
    const designations = [
        "3I",
        "3I/ATLAS",
        "C/2025 N1",
        "C/2025N1",
        "DES=3I;",
        "2I/Borisov", // Control test (known interstellar)
        "1I/Oumuamua" // Control test (known interstellar)
    ];

    console.log("Starting JPL Horizons Designation Check...");

    for (const des of designations) {
        await testDesignation(des);
    }
}

run();
