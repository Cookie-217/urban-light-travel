/* ============================================================================
 * 数据生成器：读取 data/pois.js（单一事实来源），生成两份产物：
 *   1) frontend/js/demo-data.js   —— 前端离线示例数据 + 推荐/聊天逻辑
 *   2) backend/src/main/resources/pois.json —— 后端 DataSeeder / CityCenters 读取
 * 运行：node tools/generate-data.js
 * ==========================================================================*/
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const { PROVINCES } = require(path.join(ROOT, 'data', 'pois.js'));

/* ---------------- 派生结构 ---------------- */
const provincesTree = JSON.parse(JSON.stringify(PROVINCES)); // 深拷贝，避免污染源
const flatPois = [];
const cityCenters = {};
const centersByProvince = {};
const cityProvince = {};
const citiesMeta = [];

for (const prov of provincesTree) {
  centersByProvince[prov.name] = {};
  for (const city of prov.cities) {
    // 注入 city / province 字段
    for (const poi of city.pois) {
      poi.city = city.name;
      poi.province = prov.name;
      flatPois.push(poi);
    }
    cityCenters[city.name] = city.center;
    centersByProvince[prov.name][city.name] = city.center;
    cityProvince[city.name] = prov.name;
    citiesMeta.push({ name: city.name, province: prov.name, center: city.center });
  }
}

// 全部城市名：按长度降序，便于在用户语句中优先匹配更长的城市名
const allCities = Object.keys(cityCenters).sort((a, b) => b.length - a.length);

/* ---------------- 产物 1：前端 demo-data.js ---------------- */
const tplPath = path.join(__dirname, 'demo-data.template.js');
let tpl = fs.readFileSync(tplPath, 'utf8');
tpl = tpl
  .replace('__PROVINCES__', JSON.stringify(provincesTree))
  .replace('__CENTERS__', JSON.stringify(centersByProvince))
  .replace('__CITY_CENTERS__', JSON.stringify(cityCenters))
  .replace('__ALL_CITIES__', JSON.stringify(allCities))
  .replace('__CITY_PROVINCE__', JSON.stringify(cityProvince))
  .replace('__POIS__', JSON.stringify(flatPois));

const demoOut = path.join(ROOT, 'frontend', 'js', 'demo-data.js');
fs.writeFileSync(demoOut, tpl, 'utf8');

/* ---------------- 产物 2：后端 pois.json ---------------- */
// 后端 POI 主键由数据库自增生成，因此这里用 srcId 保留原始编号，便于溯源与去重。
const poisForBackend = flatPois.map(p => ({
  srcId: p.id,
  name: p.name,
  category: p.category,
  lng: p.lng,
  lat: p.lat,
  address: p.address,
  rating: p.rating,
  priceLevel: p.priceLevel,
  tags: p.tags,
  avgDurationMin: p.avgDurationMin,
  city: p.city,
  province: p.province,
  openHours: p.openHours,
  description: p.description,
  wiki: p.wiki
}));

const backendJson = {
  version: 1,
  generatedAt: new Date().toISOString(),
  source: 'data/pois.js',
  cities: citiesMeta,
  pois: poisForBackend
};

const jsonOut = path.join(ROOT, 'backend', 'src', 'main', 'resources', 'pois.json');
fs.writeFileSync(jsonOut, JSON.stringify(backendJson, null, 2), 'utf8');

/* ---------------- 校验 ---------------- */
const idSet = new Set();
let dup = 0;
for (const p of flatPois) { if (idSet.has(p.id)) dup++; idSet.add(p.id); }

console.log('=== 数据生成完成 ===');
console.log('省份数 :', PROVINCES.length);
console.log('城市数 :', citiesMeta.length);
console.log('POI 数 :', flatPois.length);
console.log('重复 ID:', dup);
console.log('demo-data.js ->', path.relative(ROOT, demoOut), '(' + fs.statSync(demoOut).size + ' bytes)');
console.log('pois.json     ->', path.relative(ROOT, jsonOut), '(' + fs.statSync(jsonOut).size + ' bytes)');
if (dup > 0) { console.error('ERROR: 存在重复 POI ID，请修正 data/pois.js'); process.exit(1); }
