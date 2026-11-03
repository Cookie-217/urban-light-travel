/* 内置示例数据 + 离线推荐/AI 兜底逻辑（由 tools/generate-data.js 自动生成，请勿手工修改）。
   当无法连接后端（如纯静态托管）时，前端自动切换为「离线示例数据」模式，
   使用此处数据与本文件中的算法，保证地图、路线规划、AI 助手均可用。

   数据覆盖全国 34 个省级行政区、约 70 城、300+ POI，均使用真实经纬度；
   wiki 字段为对应的中文维基百科条目名，前端据此实时拉取真实场景图。 */
window.DEMO = (function () {
  // ---- 省份 → 城市 → 景点（三级结构，按省份组织）----
  const PROVINCES = __PROVINCES__;

  // ---- 城市中心点：按省份组织 { 省份: { 城市: [lat,lng] } } ----
  const CENTERS = __CENTERS__;

  // ---- 城市中心点扁平表（便于地图定位）：{ 城市: [lat,lng] } ----
  const CITY_CENTERS = __CITY_CENTERS__;

  // ---- 全部城市名（按长度降序，便于城市名识别）----
  const ALL_CITIES = __ALL_CITIES__;

  // ---- 城市 → 省份 映射 ----
  const CITY_PROVINCE = __CITY_PROVINCE__;

  // ---- 扁平 POI 列表（含 city 字段，供推荐/聊天/发现页过滤）----
  const POIS = __POIS__;

  // ---- 常量 ----
  const CAT_NAME = { park: '公园绿地', food: '美食', culture: '文化古迹', shopping: '购物', nature: '自然风光', night: '夜生活', transit: '交通枢纽' };
  const MODE_NAME = { walk: '步行', bike: '骑行', bus: '公交', metro: '地铁', taxi: '打车', mixed: '公交接驳' };
  const TRANSPORT = { walk: [4.5, 0, 0], bike: [15, 1.2, 0], bus: [20, 0, 2], metro: [35, 0.25, 2], taxi: [30, 2.4, 10], mixed: [28, 0.5, 3] };
  const OUTDOOR = ['park', 'nature', 'night', 'culture'];

  function haversine(lat1, lng1, lat2, lng2) {
    const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  const r2 = v => Math.round(v * 100) / 100;

  // 离线推荐（与后端算法一致）
  function recommend(req) {
    const mode = TRANSPORT[req.transportMode] ? req.transportMode : 'walk';
    const [speed, costPerKm, baseCost] = TRANSPORT[mode];
    let remaining = (req.timeBudgetHours > 0 ? req.timeBudgetHours : 4) * 60;
    let budget = req.maxBudget || Infinity;
    let candidates = POIS.filter(p => !req.city || p.city === req.city);
    if (req.interests && req.interests.length) candidates = candidates.filter(p => req.interests.includes(p.category));
    let lat = req.originLat, lng = req.originLng;
    if (!lat && req.city) { const c = CITY_CENTERS[req.city]; if (c) { lat = c[0]; lng = c[1]; } }
    const steps = [], poly = [[lng, lat]];
    let totalDist = 0, totalCost = 0, totalDur = 0;
    const visited = new Set();
    while (remaining > 40 && candidates.length) {
      let best = null, bestScore = -1, bestDist = 0, bestTravel = 0, bestCost = 0;
      for (const p of candidates) {
        if (visited.has(p.id)) continue;
        const dist = haversine(lat, lng, p.lat, p.lng);
        const travel = (dist / speed) * 60;
        if (travel > remaining * 0.55) continue;
        if (dist * costPerKm + baseCost > budget) continue;
        const rating = p.rating / 5;
        const match = (req.interests && req.interests.includes(p.category)) ? 1 : 0.4;
        const afford = (4 - (p.priceLevel - 1)) / 4;
        const score = rating * 0.4 + match * 0.35 + afford * 0.25 - (travel / 60) * 0.6;
        if (score > bestScore) { bestScore = score; best = p; bestDist = dist; bestTravel = travel; bestCost = dist * costPerKm + baseCost; }
      }
      if (!best) break;
      const visit = Math.max(20, best.avgDurationMin);
      const stepDur = Math.round(bestTravel) + visit;
      if (stepDur > remaining) break;
      steps.push({ poi: best, distanceFromPrevKm: r2(bestDist), durationMin: stepDur, mode, cost: r2(bestCost) });
      poly.push([best.lng, best.lat]);
      totalDist += bestDist; totalCost += bestCost; totalDur += stepDur;
      remaining -= stepDur; budget -= bestCost; lat = best.lat; lng = best.lng; visited.add(best.id);
    }
    const summary = steps.length
      ? `为你规划了一条以「${MODE_NAME[mode]}」为主的轻出行路线，共 ${steps.length} 个站点，预计总距离 ${r2(totalDist)} km、耗时约 ${totalDur} 分钟、花费约 ¥${Math.round(totalCost)}。沿途推荐：${steps.map(s => s.poi.name).join(' → ')}。`
      : '当前条件下未找到合适的轻出行目的地，试试放宽时间预算或更换出行方式。';
    return { steps, totalDistanceKm: r2(totalDist), totalDurationMin: totalDur, totalCost: r2(totalCost), summary, polyline: poly, weatherNote: null, usedAi: false };
  }

  function firstCity(msg) {
    for (const c of ALL_CITIES) if (msg.includes(c)) return c;
    return null;
  }
  function parsePlan(msg) {
    const r = { transportMode: 'mixed', timeBudgetHours: 4, useWeather: false, interests: [] };
    const city = firstCity(msg); r.city = city;
    const c = CITY_CENTERS[city] || [30.2741, 120.1551]; r.originLat = c[0]; r.originLng = c[1];
    let m = msg.match(/(\d+)\s*小时/);
    if (m) r.timeBudgetHours = +m[1];
    else { const d = msg.match(/(\d+)\s*天/); if (d) r.timeBudgetHours = +d[1] * 8; else if (msg.includes('半天')) r.timeBudgetHours = 4; else if (msg.includes('一天')) r.timeBudgetHours = 8; }
    if (/美食|吃|小吃|餐厅/.test(msg)) r.interests.push('food');
    if (/公园|绿地|草坪|露营/.test(msg)) r.interests.push('park');
    if (/文化|古迹|博物馆|历史|寺庙|古镇/.test(msg)) r.interests.push('culture');
    if (/购物|商场|逛街|买/.test(msg)) r.interests.push('shopping');
    if (/自然|山水|湖|山|风景/.test(msg)) r.interests.push('nature');
    if (/夜|酒吧|夜景|夜生活/.test(msg)) r.interests.push('night');
    if (!r.interests.length) r.interests = ['park', 'food', 'culture', 'nature'];
    if (/步行|走路|漫步/.test(msg)) r.transportMode = 'walk';
    else if (/骑|单车|自行车/.test(msg)) r.transportMode = 'bike';
    else if (/地铁/.test(msg)) r.transportMode = 'metro';
    else if (/公交|巴士/.test(msg)) r.transportMode = 'bus';
    else if (/打车|出租|网约车|自驾/.test(msg)) r.transportMode = 'taxi';
    return r;
  }
  function isPlanIntent(msg) {
    return /规划|推荐|路线|行程|去玩|去哪|一日游|游玩|攻略|怎么玩|怎么走|溜达/.test(msg)
      || (firstCity(msg) && (/小时|天|半天/.test(msg)));
  }
  function chat(message) {
    const msg = (message || '').trim();
    if (!msg) return { reply: '你好呀～告诉我你想去哪座城市、玩多久、喜欢什么，我来帮你规划轻出行路线 🚲', usedLlm: false, plan: null };
    if (isPlanIntent(msg)) {
      const plan = recommend(parsePlan(msg));
      let reply = '🌟 已根据你的需求生成轻出行方案：\n\n' + plan.summary + '\n\n行程明细：\n';
      plan.steps.forEach((s, i) => reply += `${i + 1}. ${s.poi.name}（${CAT_NAME[s.poi.category] || s.poi.category}，约 ${s.durationMin} 分钟，¥${Math.round(s.cost)}）\n`);
      reply += '\n💡 在「路线规划」页面可查看地图与更精细的调整。';
      return { reply, usedLlm: false, plan };
    }
    if (/你好|您好|hi|hello/i.test(msg)) return { reply: '你好！我是城市轻出行 AI 助手 🚲。试着对我说：「帮我规划杭州一天的行程，喜欢美食和公园」。', usedLlm: false, plan: null };
    if (/你是|介绍|能做什么/.test(msg)) return { reply: '我是城市轻出行路线推荐系统的 AI 智能体，能根据你的城市、时间、兴趣生成轻出行路线，并结合距离/耗时/花费给出方案（当前为离线演示模式）。', usedLlm: false, plan: null };
    if (/天气/.test(msg)) return { reply: '联网版本会在规划时自动获取实时天气，雨天优先推荐室内景点。', usedLlm: false, plan: null };
    if (/谢谢|感谢/.test(msg)) return { reply: '不客气，祝你出行愉快！🚲', usedLlm: false, plan: null };
    return { reply: '收到～想规划路线就告诉我「城市 + 时长 + 兴趣」，例如：「上海半日游，喜欢购物和美食」。', usedLlm: false, plan: null };
  }

  return { PROVINCES, CENTERS, CITY_CENTERS, ALL_CITIES, CITY_PROVINCE, POIS, CAT_NAME, MODE_NAME, TRANSPORT, OUTDOOR, haversine, recommend, chat, parsePlan, isPlanIntent, firstCity };
})();
