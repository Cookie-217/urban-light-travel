/* 内置示例数据 + 离线推荐/AI 兜底逻辑。
   当无法连接后端（如纯静态托管）时，前端自动切换为「演示模式」，
   使用此处数据与本文件中的算法，保证地图、路线规划、AI 助手均可用。 */
window.DEMO = (function () {
  // 城市中心点
  const CENTERS = {
    '杭州': [30.2741, 120.1551], '北京': [39.9042, 116.4074], '上海': [31.2304, 121.4737],
    '成都': [30.5728, 104.0668], '深圳': [22.5431, 114.0579]
  };
  const CAT_NAME = { park: '公园绿地', food: '美食', culture: '文化古迹', shopping: '购物', nature: '自然风光', night: '夜生活', transit: '交通枢纽' };
  const MODE_NAME = { walk: '步行', bike: '骑行', bus: '公交', metro: '地铁', taxi: '打车', mixed: '公交接驳' };
  const TRANSPORT = {
    walk: [4.5, 0, 0], bike: [15, 1.2, 0], bus: [20, 0, 2], metro: [35, 0.25, 2], taxi: [30, 2.4, 10], mixed: [28, 0.5, 3]
  };
  const OUTDOOR = ['park', 'nature', 'night', 'culture'];

  const POIS = [
    // 杭州
    { id: 101, name: '西湖', category: 'nature', lng: 120.1480, lat: 30.2590, address: '杭州市西湖区龙井路1号', rating: 4.8, priceLevel: 1, tags: '湖,风景,散步,骑行', avgDurationMin: 90, city: '杭州', openHours: '全天', description: '世界文化遗产，城市绿芯，可步行或骑行环湖。' },
    { id: 102, name: '灵隐寺', category: 'culture', lng: 120.1010, lat: 30.2410, address: '杭州市西湖区法云弄1号', rating: 4.7, priceLevel: 2, tags: '寺庙,古迹,祈福', avgDurationMin: 90, city: '杭州', openHours: '07:00-18:00', description: '千年古刹，背靠北高峰，禅意浓厚。' },
    { id: 103, name: '河坊街', category: 'food', lng: 120.1690, lat: 30.2440, address: '杭州市上城区河坊街', rating: 4.5, priceLevel: 2, tags: '小吃,古街,夜市', avgDurationMin: 60, city: '杭州', openHours: '全天', description: '南宋御街旁的老字号小吃集中地。' },
    { id: 104, name: '西溪湿地', category: 'nature', lng: 120.0630, lat: 30.2680, address: '杭州市西湖区天目山路518号', rating: 4.6, priceLevel: 2, tags: '湿地,生态,船游', avgDurationMin: 120, city: '杭州', openHours: '08:00-17:30', description: '城市湿地国家公园，秋冬芦花飞雪。' },
    { id: 105, name: '杭州植物园', category: 'park', lng: 120.1260, lat: 30.2620, address: '杭州市西湖区桃源岭1号', rating: 4.4, priceLevel: 1, tags: '植物,亲子,漫步', avgDurationMin: 90, city: '杭州', openHours: '08:30-16:30', description: '草木葱茏，适合慢节奏散步。' },
    { id: 106, name: '南宋御街', category: 'culture', lng: 120.1700, lat: 30.2450, address: '杭州市上城区中山中路', rating: 4.3, priceLevel: 2, tags: '历史,步行街,文创', avgDurationMin: 60, city: '杭州', openHours: '全天', description: '千年御道，串联老字号与文创小店。' },
    // 北京
    { id: 201, name: '故宫博物院', category: 'culture', lng: 116.3972, lat: 39.9163, address: '北京市东城区景山前街4号', rating: 4.9, priceLevel: 3, tags: '古迹,博物馆,历史', avgDurationMin: 180, city: '北京', openHours: '08:30-17:00', description: '明清两代皇宫，世界最大的木结构宫殿群。' },
    { id: 202, name: '颐和园', category: 'park', lng: 116.2755, lat: 39.9999, address: '北京市海淀区新建宫门路19号', rating: 4.7, priceLevel: 2, tags: '园林,湖,长廊', avgDurationMin: 150, city: '北京', openHours: '06:30-18:00', description: '皇家园林，昆明湖与万寿山相映。' },
    { id: 203, name: '南锣鼓巷', category: 'food', lng: 116.4030, lat: 39.9350, address: '北京市东城区南锣鼓巷', rating: 4.3, priceLevel: 2, tags: '小吃,胡同,文创', avgDurationMin: 60, city: '北京', openHours: '全天', description: '最富老北京味的胡同小吃街。' },
    { id: 204, name: '天安门广场', category: 'culture', lng: 116.3976, lat: 39.9055, address: '北京市东城区长安街', rating: 4.6, priceLevel: 1, tags: '地标,广场,升旗', avgDurationMin: 60, city: '北京', openHours: '全天', description: '世界最大城市广场，清晨升旗仪式壮观。' },
    { id: 205, name: '798艺术区', category: 'culture', lng: 116.4950, lat: 39.9840, address: '北京市朝阳区酒仙桥路4号', rating: 4.4, priceLevel: 1, tags: '艺术,展览,工业风', avgDurationMin: 120, city: '北京', openHours: '全天', description: '由老工厂改造的当代艺术聚集地。' },
    { id: 206, name: '什刹海', category: 'night', lng: 116.3890, lat: 39.9400, address: '北京市西城区什刹海', rating: 4.3, priceLevel: 2, tags: '酒吧,湖,夜景,胡同', avgDurationMin: 120, city: '北京', openHours: '全天', description: '后海酒吧街与胡同游船，夜生活地标。' },
    // 上海
    { id: 301, name: '外滩', category: 'night', lng: 121.4900, lat: 31.2397, address: '上海市黄浦区中山东一路', rating: 4.8, priceLevel: 1, tags: '夜景,江景,地标', avgDurationMin: 90, city: '上海', openHours: '全天', description: '万国建筑博览群，浦江夜景绝美。' },
    { id: 302, name: '豫园', category: 'culture', lng: 121.4920, lat: 31.2270, address: '上海市黄浦区安仁街218号', rating: 4.5, priceLevel: 2, tags: '园林,古迹,城隍庙', avgDurationMin: 90, city: '上海', openHours: '08:30-17:00', description: '明代私家园林，旁有城隍庙小吃。' },
    { id: 303, name: '南京路步行街', category: 'shopping', lng: 121.4780, lat: 31.2340, address: '上海市黄浦区南京东路', rating: 4.4, priceLevel: 2, tags: '购物,步行街,老字号', avgDurationMin: 60, city: '上海', openHours: '全天', description: '中华商业第一街，霓虹璀璨。' },
    { id: 304, name: '上海博物馆', category: 'culture', lng: 121.4730, lat: 31.2280, address: '上海市黄浦区人民大道201号', rating: 4.6, priceLevel: 1, tags: '博物馆,历史,青铜器', avgDurationMin: 120, city: '上海', openHours: '09:00-17:00', description: '顶级中国古代艺术馆，免费预约。' },
    { id: 305, name: '田子坊', category: 'food', lng: 121.4730, lat: 31.2100, address: '上海市黄浦区泰康路210弄', rating: 4.2, priceLevel: 2, tags: '弄堂,小吃,文创', avgDurationMin: 60, city: '上海', openHours: '全天', description: '石库门里弄改造的文艺集市。' },
    { id: 306, name: '世纪公园', category: 'park', lng: 121.5500, lat: 31.2190, address: '上海市浦东新区锦绣路1001号', rating: 4.3, priceLevel: 1, tags: '绿地,亲子,骑行', avgDurationMin: 90, city: '上海', openHours: '07:00-18:00', description: '浦东最大的生态公园，草坪广阔。' },
    // 成都
    { id: 401, name: '宽窄巷子', category: 'food', lng: 104.0560, lat: 30.6690, address: '成都市青羊区金河路口', rating: 4.5, priceLevel: 2, tags: '小吃,茶馆,古街', avgDurationMin: 90, city: '成都', openHours: '全天', description: '由宽巷子、窄巷子、井巷子组成的老成都院落。' },
    { id: 402, name: '锦里', category: 'food', lng: 104.0610, lat: 30.6410, address: '成都市武侯区武侯祠大街231号', rating: 4.4, priceLevel: 2, tags: '小吃,三国,古街', avgDurationMin: 60, city: '成都', openHours: '全天', description: '川西风情古街，紧邻武侯祠。' },
    { id: 403, name: '大熊猫繁育研究基地', category: 'nature', lng: 104.1460, lat: 30.7330, address: '成都市成华区熊猫大道1375号', rating: 4.8, priceLevel: 2, tags: '熊猫,亲子,萌宠', avgDurationMin: 180, city: '成都', openHours: '07:30-18:00', description: '近距离看国宝大熊猫的必去之地。' },
    { id: 404, name: '武侯祠', category: 'culture', lng: 104.0590, lat: 30.6420, address: '成都市武侯区武侯祠大街231号', rating: 4.4, priceLevel: 2, tags: '三国,古迹,祠堂', avgDurationMin: 90, city: '成都', openHours: '08:00-21:00', description: '中国唯一的君臣合祀祠庙，三国文化圣地。' },
    { id: 405, name: '春熙路', category: 'shopping', lng: 104.0810, lat: 30.6570, address: '成都市锦江区春熙路', rating: 4.3, priceLevel: 2, tags: '购物,商圈,地标', avgDurationMin: 60, city: '成都', openHours: '全天', description: '成都最繁华的商业中心。' },
    { id: 406, name: '杜甫草堂', category: 'culture', lng: 104.0250, lat: 30.6580, address: '成都市青羊区青华路37号', rating: 4.3, priceLevel: 2, tags: '诗人,园林,古迹', avgDurationMin: 90, city: '成都', openHours: '08:00-18:00', description: '诗圣杜甫流寓成都的居所，竹林清幽。' },
    // 深圳
    { id: 501, name: '世界之窗', category: 'culture', lng: 113.9730, lat: 22.5370, address: '深圳市南山区深南大道9037号', rating: 4.2, priceLevel: 3, tags: '微缩景观,主题公园', avgDurationMin: 180, city: '深圳', openHours: '09:00-21:30', description: '汇聚世界名胜微缩景观的主题公园。' },
    { id: 502, name: '深圳湾公园', category: 'park', lng: 113.9500, lat: 22.5200, address: '深圳市南山区滨海大道', rating: 4.6, priceLevel: 1, tags: '海滨,骑行,红树林,观鸟', avgDurationMin: 120, city: '深圳', openHours: '全天', description: '滨海休闲带，骑行观海看候鸟。' },
    { id: 503, name: '欢乐海岸', category: 'night', lng: 113.9600, lat: 22.5300, address: '深圳市南山区白石路东8号', rating: 4.3, priceLevel: 2, tags: '夜景,购物,美食,水秀', avgDurationMin: 120, city: '深圳', openHours: '全天', description: '都市亲水商业区，夜晚水秀表演。' },
    { id: 504, name: '莲花山公园', category: 'park', lng: 114.0700, lat: 22.5600, address: '深圳市福田区红荔路6030号', rating: 4.5, priceLevel: 1, tags: '风筝,城市景观,邓小平像', avgDurationMin: 90, city: '深圳', openHours: '06:00-23:00', description: '登顶可俯瞰市中心CBD全景。' },
    { id: 505, name: '东门老街', category: 'food', lng: 114.1230, lat: 22.5470, address: '深圳市罗湖区东门中路', rating: 4.1, priceLevel: 2, tags: '小吃,老街,批发', avgDurationMin: 60, city: '深圳', openHours: '全天', description: '深圳历史最久的商业街区，烟火气十足。' }
  ];

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
    if (!lat && req.city) { const c = CENTERS[req.city]; if (c) { lat = c[0]; lng = c[1]; } }
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
    for (const c of Object.keys(CENTERS)) if (msg.includes(c)) return c;
    return null;
  }
  function parsePlan(msg) {
    const r = { transportMode: 'mixed', timeBudgetHours: 4, useWeather: false, interests: [] };
    const city = firstCity(msg); r.city = city;
    const c = CENTERS[city] || [30.2741, 120.1551]; r.originLat = c[0]; r.originLng = c[1];
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

  return { POIS, CENTERS, CAT_NAME, MODE_NAME, TRANSPORT, OUTDOOR, haversine, recommend, chat, parsePlan, isPlanIntent, firstCity };
})();
