// Test script to fetch historical positions from JPL Horizons
// Compare Sept 25, 2025 vs Nov 26, 2025

const dates = [
    { label: 'Sept 25, 2025', start: '2025-09-25', stop: '2025-09-26' },
    { label: 'Nov 26, 2025', start: '2025-11-26', stop: '2025-11-27' }
];

const objects = [
    { name: 'Earth', code: '399' },
    { name: 'Mars', code: '499' }
];

async function fetchPosition(objectCode, startDate, stopDate) {
    const params = new URLSearchParams({
        format: 'text',
        COMMAND: `'${objectCode}'`,
        OBJ_DATA: 'NO',
        MAKE_EPHEM: 'YES',
        EPHEM_TYPE: 'VECTORS',
        CENTER: '500@10',
        START_TIME: startDate,
        STOP_TIME: stopDate,
        STEP_SIZE: '1d',
        VEC_TABLE: '2',
        OUT_UNITS: 'AU-D',
        CSV_FORMAT: 'YES',
        VEC_LABELS: 'YES'
    });

    const url = `https://ssd.jpl.nasa.gov/api/horizons.api?${params.toString()}`;
    const response = await fetch(url);
    const data = await response.text();

    const soeIndex = data.indexOf('$$SOE');
    const eoeIndex = data.indexOf('$$EOE');

    if (soeIndex !== -1 && eoeIndex !== -1) {
        const vectorData = data.substring(soeIndex + 5, eoeIndex).trim();
        const lines = vectorData.split('\n');
        if (lines.length > 0 && lines[0].trim()) {
            const parts = lines[0].split(',').map(s => s.trim());
            if (parts.length >= 5) {
                return {
                    x: parseFloat(parts[2]),
                    y: parseFloat(parts[3]),
                    z: parseFloat(parts[4])
                };
            }
        }
    }
    return null;
}

console.log('Comparing planet positions:\n');

for (const obj of objects) {
    console.log(`\n${obj.name}:`);
    for (const date of dates) {
        const pos = await fetchPosition(obj.code, date.start, date.stop);
        if (pos) {
            console.log(`  ${date.label}: X=${pos.x.toFixed(4)}, Y=${pos.y.toFixed(4)}, Z=${pos.z.toFixed(4)}`);
        }
    }
}
