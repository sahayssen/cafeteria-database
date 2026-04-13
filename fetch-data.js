import fs from "fs";
import path from "node:path";

const url = "https://data.cityofnewyork.us/resource/5ery-qagt.json"
const response = await fetch(url);
const cafes = await response.json();

const dataDir = path.join("src", "lib", "data");
fs.mkdirSync(dataDir, { recursive: true });

const outputPath = path.join(dataDir, "cafes.json");
fs.writeFileSync(outputPath, JSON.stringify(cafes, null, 2));

const schools = cafes.map(cafe => cafe.schoolname);
const uniqueSchools = [...new Set(schools)];
console.log(uniqueSchools);

