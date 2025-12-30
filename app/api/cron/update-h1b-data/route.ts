import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import ExcelJS from 'exceljs';

const execPromise = promisify(exec);

// DOL Office of Foreign Labor Certification - LCA Disclosure Data
// These are Excel files (.xlsx), more current than USCIS
// Testing with FY 2024 Q4 only first
const DOL_LCA_DATA_URLS: Record<number, string[]> = {
    2025: [
        'https://www.dol.gov/sites/dolgov/files/ETA/oflc/pdfs/LCA_Disclosure_Data_FY2025_Q1.xlsx',
        'https://www.dol.gov/sites/dolgov/files/ETA/oflc/pdfs/LCA_Disclosure_Data_FY2025_Q2.xlsx',
        'https://www.dol.gov/sites/dolgov/files/ETA/oflc/pdfs/LCA_Disclosure_Data_FY2025_Q3.xlsx',
        'https://www.dol.gov/sites/dolgov/files/ETA/oflc/pdfs/LCA_Disclosure_Data_FY2025_Q4.xlsx',
    ],
    2024: [
        'https://www.dol.gov/sites/dolgov/files/ETA/oflc/pdfs/LCA_Disclosure_Data_FY2024_Q1.xlsx',
        'https://www.dol.gov/sites/dolgov/files/ETA/oflc/pdfs/LCA_Disclosure_Data_FY2024_Q2.xlsx',
        'https://www.dol.gov/sites/dolgov/files/ETA/oflc/pdfs/LCA_Disclosure_Data_FY2024_Q3.xlsx',
        'https://www.dol.gov/sites/dolgov/files/ETA/oflc/pdfs/LCA_Disclosure_Data_FY2024_Q4.xlsx',
    ],
    2023: [
        'https://www.dol.gov/sites/dolgov/files/ETA/oflc/pdfs/LCA_Disclosure_Data_FY2023_Q4.xlsx',
    ],
    2022: [
        'https://www.dol.gov/sites/dolgov/files/ETA/oflc/pdfs/LCA_Disclosure_Data_FY2022_Q4.xlsx',
    ],
};

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🚀 Starting REAL H-1B data download from DOL OFLC (Streaming)...');

    try {
        const results = [];

        // Process each fiscal year
        for (const [year, urls] of Object.entries(DOL_LCA_DATA_URLS)) {
            try {
                console.log(`📥 Processing FY${year} from DOL (${urls.length} quarters)...`);
                const data = await downloadAndProcessDOL(parseInt(year), urls);
                results.push({ year: parseInt(year), status: 'success', ...data });
            } catch (error: any) {
                console.error(`❌ Failed FY${year}:`, error.message);
                results.push({ year: parseInt(year), status: 'failed', error: error.message });
            }
        }

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            message: '✅ REAL H-1B LCA data update completed from official DOL source',
            results,
            source: 'DOL OFLC - LCA Disclosure Data',
        });
    } catch (error: any) {
        console.error('❌ Cron job error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}

async function downloadAndProcessDOL(year: number, urls: string[]) {
    // Aggregation structures
    const countryMap = new Map<string, number>();
    const stateMap = new Map<string, number>();
    const employerMap = new Map<string, number>();

    let totalApprovals = 0;
    let totalDenials = 0;
    let totalRecords = 0;

    // Download and process each quarterly file
    for (const url of urls) {
        let tempFilePath = '';
        try {
            console.log(`⬇️ Fetching: ${url.split('/').pop()} (using curl)`);

            // Use system curl for robustness (Node fetch/ExcelJS stream issues on some environments)
            const dataDir = path.join(process.cwd(), 'data', 'temp');
            await fs.mkdir(dataDir, { recursive: true });
            tempFilePath = path.join(dataDir, `temp_${year}_${Date.now()}.xlsx`);

            try {
                await execPromise(`curl -L -s -o "${tempFilePath}" "${url}"`);
            } catch (curlError: any) {
                console.warn(`⚠️ Curl failed for ${url}: ${curlError.message}`);
                continue;
            }

            // Verify file exists and has size
            const stats = await fs.stat(tempFilePath);
            if (stats.size < 1000) {
                console.warn(`⚠️ File too small (${stats.size} bytes), skipping.`);
                continue;
            }

            console.log(`✅ Downloaded to ${tempFilePath} (${(stats.size / 1024 / 1024).toFixed(2)} MB), starting streaming browse...`);

            // Stream parse using ExcelJS WorkbookReader
            const options: Partial<ExcelJS.stream.xlsx.WorkbookStreamReaderOptions> = {
                sharedStrings: 'cache',
                hyperlinks: 'ignore',
                styles: 'ignore',
            };
            const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(tempFilePath, options);

            for await (const worksheetReader of workbookReader) {
                let headers: string[] = [];
                let rowCount = 0;

                for await (const row of worksheetReader) {

                    rowCount++;
                    const values = row.values as any[];

                    if (headers.length === 0) {
                        // Attempt to find headers
                        // ExcelJS row.values is 1-based, index 0 is null usually
                        const potentialHeaders = values.map(v => v ? v.toString().toUpperCase() : '');
                        if (potentialHeaders.includes('CASE_STATUS') || potentialHeaders.includes('CASE_NUMBER')) {
                            headers = potentialHeaders;
                            console.log('✅ Found headers:', headers.filter(h => h).slice(0, 5));
                            continue;
                        }
                    }

                    if (headers.length > 0) {
                        totalRecords++;

                        // Map fields using header indices
                        const getVal = (name: string) => {
                            const idx = headers.indexOf(name);
                            return idx > -1 ? (values[idx] || '').toString() : '';
                        };

                        const caseStatus = getVal('CASE_STATUS').toUpperCase();

                        // Count only CERTIFIED cases as approvals
                        if (caseStatus === 'CERTIFIED') {
                            totalApprovals++;

                            const country = getVal('EMPLOYER_COUNTRY') || getVal('COUNTRY_OF_CITIZENSHIP') || 'Unknown';
                            const state = getVal('EMPLOYER_STATE') || getVal('WORKSITE_STATE') || 'Unknown';
                            const employer = getVal('EMPLOYER_NAME') || 'Unknown';

                            const normalizedCountry = normalizeCountryName(country);
                            const normalizedState = state.toUpperCase();

                            countryMap.set(normalizedCountry, (countryMap.get(normalizedCountry) || 0) + 1);
                            stateMap.set(normalizedState, (stateMap.get(normalizedState) || 0) + 1);
                            employerMap.set(employer, (employerMap.get(employer) || 0) + 1);
                        } else if (caseStatus === 'DENIED' || caseStatus === 'WITHDRAWN') {
                            totalDenials++;
                        }
                    }
                }
                console.log(`📊 Parsed ${rowCount} rows from sheet ${(worksheetReader as any).name}`);
            }


        } catch (error: any) {
            console.warn(`⚠️ Error processing ${url.split('/').pop()}:`, error.message);
        } finally {
            // Clean up temp file
            if (tempFilePath) {
                try {
                    await fs.unlink(tempFilePath);
                } catch (e) { /* ignore */ }
            }
        }
    }

    if (totalRecords === 0) {
        throw new Error(`No data available for FY${year}`);
    }

    // Convert aggregated maps to sorted arrays
    const topCountries = Array.from(countryMap.entries())
        .filter(([name]) => name !== 'Unknown' && name !== 'UNKNOWN')
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([name, count]) => ({
            countryName: name,
            countryCode: getCountryCode(name),
            visaCount: count,
            percentage: totalApprovals > 0 ? (count / totalApprovals) * 100 : 0,
        }));

    const topStates = Array.from(stateMap.entries())
        .filter(([name]) => name !== 'Unknown' && name.length <= 2) // Basic filter for valid state codes
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([name, count]) => ({
            stateName: name,
            stateCode: name.length === 2 ? name : name.substring(0, 2).toUpperCase(),
            visaCount: count,
            percentage: totalApprovals > 0 ? (count / totalApprovals) * 100 : 0,
        }));

    const topEmployers = Array.from(employerMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([name, count]) => ({
            employerName: name,
            visaCount: count,
            approvalRate: 100,
        }));

    const aggregated = {
        year,
        totalApprovals,
        totalDenials,
        totalRecords,
        approvalRate: (totalApprovals + totalDenials) > 0 ? (totalApprovals / (totalApprovals + totalDenials)) * 100 : 0,
        topCountries,
        topStates,
        topEmployers,
        lastUpdated: new Date().toISOString(),
        dataSource: 'DOL OFLC - LCA Disclosure Data',
        isRealData: true,
    };

    // Save to file
    await saveProcessedData(year, aggregated);

    return {
        recordCount: totalRecords,
        totalApprovals: aggregated.totalApprovals,
        topCountry: aggregated.topCountries[0]?.countryName,
        dataSource: 'DOL-OFLC-Official',
    };
}

async function saveProcessedData(year: number, data: any) {
    const dataDir = path.join(process.cwd(), 'data', 'processed');
    await fs.mkdir(dataDir, { recursive: true });

    const filePath = path.join(dataDir, `h1b_fy${year}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    console.log(`💾 Saved REAL data to: ${filePath}`);
}

function normalizeCountryName(country: string): string {
    const normalized = country.toUpperCase().trim();

    // Map common variations
    const mappings: Record<string, string> = {
        'INDIA': 'India',
        'CHINA': 'China',
        'PEOPLE\'S REPUBLIC OF CHINA': 'China',
        'CANADA': 'Canada',
        'PHILIPPINES': 'Philippines',
        'SOUTH KOREA': 'South Korea',
        'KOREA, SOUTH': 'South Korea',
        'REPUBLIC OF KOREA': 'South Korea',
        'MEXICO': 'Mexico',
        'TAIWAN': 'Taiwan',
        'JAPAN': 'Japan',
        'BRAZIL': 'Brazil',
        'UNITED KINGDOM': 'United Kingdom',
        'UK': 'United Kingdom',
        'PAKISTAN': 'Pakistan',
        'FRANCE': 'France',
        'GERMANY': 'Germany',
        'COLOMBIA': 'Colombia',
        'PERU': 'Peru',
        'UNITED STATES OF AMERICA': 'USA',
        'UNITED STATES': 'USA',
    };

    return mappings[normalized] || country;
}

function getCountryCode(countryName: string): string {
    const codes: Record<string, string> = {
        'India': 'IN',
        'China': 'CN',
        'Canada': 'CA',
        'Philippines': 'PH',
        'South Korea': 'KR',
        'Mexico': 'MX',
        'Taiwan': 'TW',
        'Japan': 'JP',
        'Brazil': 'BR',
        'United Kingdom': 'GB',
        'Pakistan': 'PK',
        'France': 'FR',
        'Germany': 'DE',
        'Colombia': 'CO',
        'Peru': 'PE',
        'USA': 'US',
    };
    return codes[countryName] || 'XX';
}
