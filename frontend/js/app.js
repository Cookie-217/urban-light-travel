/* 轻出行前端应用：Vue3(CDN) + Leaflet(CDN)，前后端分离。
   优先连接后端 API；若无法连接（纯静态托管）自动进入「离线示例数据」模式，使用内置示例数据与离线推荐 / AI 逻辑。
   图片统一按 wiki 字段实时拉取维基百科首图；取不到时回退为带景点名的渐变占位卡（不使用随机照片）。 */
(function () {
  const { createApp, reactive, ref, computed, onMounted, onUnmounted, nextTick } = Vue;
  const API = window.APP_CONFIG.API_BASE;
  const CFG = window.APP_CONFIG;
  const DEMO = window.DEMO;

  /* ---------------- 全局状态 ---------------- */
  const store = reactive({
    token: localStorage.getItem('ut_token') || '',
    user: JSON.parse(localStorage.getItem('ut_user') || 'null'),
    view: 'discover',
    demoMode: false,
    llm: false,
    cities: []
  });

  function authHeader() { return store.token ? { Authorization: 'Bearer ' + store.token } : {}; }

  /* ---------------- POI 真实场景图（维基百科官方缩略图） ---------------- */
  const WIKI_CACHE = {};            // id -> url（已确认有图） | null（已知无图） | true（请求中）
  const imgOf = reactive({});       // id -> url | null（响应式，驱动视图更新）
  function loadWikiImage(poi) {
    if (!poi || !poi.wiki) { if (poi) { WIKI_CACHE[poi.id] = null; imgOf[poi.id] = null; } return; }
    if (WIKI_CACHE[poi.id] === null) { imgOf[poi.id] = null; return; }     // 已知无图
    if (WIKI_CACHE[poi.id] && WIKI_CACHE[poi.id] !== true) { imgOf[poi.id] = WIKI_CACHE[poi.id]; return; }
    if (WIKI_CACHE[poi.id] === true) return;                                // 请求中
    WIKI_CACHE[poi.id] = true;      // 标记请求中，避免重复
    const url = 'https://zh.wikipedia.org/w/api.php?action=query&titles=' +
      encodeURIComponent(poi.wiki) +
      '&prop=pageimages&piprop=thumbnail&pithumbsize=800&format=json&origin=*';
    fetch(url)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        let src = null;
        const pages = d && d.query && d.query.pages;
        if (pages) {
          const pg = Object.values(pages)[0];
          if (pg && pg.thumbnail && pg.thumbnail.source) src = pg.thumbnail.source;
        }
        if (src) { WIKI_CACHE[poi.id] = src; imgOf[poi.id] = src; }
        else { WIKI_CACHE[poi.id] = null; imgOf[poi.id] = null; }
      })
      .catch(() => { WIKI_CACHE[poi.id] = null; imgOf[poi.id] = null; });
  }
  // 返回维基首图 URL，取不到返回 null（由模板回退到渐变占位卡）
  function imgFor(id) { return (id in imgOf) ? imgOf[id] : null; }
  // 维基图加载失败时，切换为占位卡
  function onImgError(id) { if (imgFor(id)) { imgOf[id] = null; WIKI_CACHE[id] = null; } }

  async function apiFetch(path, opts) {
    opts = opts || {};
    const res = await fetch(API + path, Object.assign({
      headers: Object.assign({ 'Content-Type': 'application/json' }, authHeader(), opts.headers || {})
    }, opts));
    if (!res.ok) {
      let msg = '请求失败 (' + res.status + ')';
      try { const j = await res.json(); if (j.message) msg = j.message; } catch (e) {}
      throw new Error(msg);
    }
    return res.json();
  }

  /* ---------------- 收藏（在线走 API，离线模式走 localStorage） ---------------- */
  const LS_POIS = 'ut_favpois', LS_ROUTES = 'ut_favroutes';
  const fav = reactive({ pois: [], routes: [] });

  function loadFavs() {
    if (!store.user) { fav.pois = []; fav.routes = []; return; }
    if (store.demoMode) {
      try { fav.pois = JSON.parse(localStorage.getItem(LS_POIS) || '[]'); } catch (e) { fav.pois = []; }
      try { fav.routes = JSON.parse(localStorage.getItem(LS_ROUTES) || '[]'); } catch (e) { fav.routes = []; }
      return;
    }
    apiFetch('/favorites/pois').then(r => { fav.pois = r; }).catch(() => {});
    apiFetch('/favorites/routes').then(r => { fav.routes = r; }).catch(() => {});
  }
  function isFavPoi(id) { return fav.pois.some(p => p.id === id); }
  async function toggleFavPoi(p) {
    if (!store.user) { showLoginHint(); return; }
    if (store.demoMode) {
      const i = fav.pois.findIndex(x => x.id === p.id);
      if (i >= 0) fav.pois.splice(i, 1); else fav.pois.push(p);
      localStorage.setItem(LS_POIS, JSON.stringify(fav.pois));
      return;
    }
    await apiFetch('/favorites', { method: 'POST', body: JSON.stringify({ type: 'POI', refId: p.id }) });
    loadFavs();
  }
  function showLoginHint() { alert('请先登录 / 注册后再收藏'); store.view = 'login'; }
  async function saveRoute(plan, transportMode) {
    if (!store.user) { showLoginHint(); return; }
    const title = '我的轻出行路线（' + (DEMO.MODE_NAME[transportMode] || '出行') + '）';
    if (store.demoMode) {
      const r = { id: 'd' + Date.now(), title, transportMode, plan, createdAt: new Date().toISOString() };
      fav.routes.unshift(r); localStorage.setItem(LS_ROUTES, JSON.stringify(fav.routes));
      alert('已保存到本地收藏（离线示例数据模式）'); return;
    }
    await apiFetch('/routes', { method: 'POST', body: JSON.stringify({ title, transportMode, plan }) });
    alert('路线已保存 ✓'); loadFavs();
  }
  async function delRoute(id) {
    if (store.demoMode) { fav.routes = fav.routes.filter(r => r.id !== id); localStorage.setItem(LS_ROUTES, JSON.stringify(fav.routes)); return; }
    await apiFetch('/routes/' + id, { method: 'DELETE' }); loadFavs();
  }

  /* ---------------- 颜色 / 图标辅助 ---------------- */
  const CAT_COLOR = { park: '#0fae8e', food: '#ff6b5e', culture: '#8b5cf6', shopping: '#f5a623', nature: '#2bb3c0', night: '#6a7bff', transit: '#94a3b8' };
  const MODE_COLOR = { walk: '#0fae8e', bike: '#2bb3c0', bus: '#f5a623', metro: '#6a7bff', taxi: '#ff6b5e', mixed: '#8b5cf6' };
  function iconFor(cat) {
    return ({ park: '🌳', food: '🍜', culture: '🏛️', shopping: '🛍️', nature: '⛰️', night: '🌃', transit: '🚉' })[cat] || '📍';
  }
  function colorForCat(cat) { return CAT_COLOR[cat] || '#0fae8e'; }
  function colorForMode(mode) { return MODE_COLOR[mode] || '#0fae8e'; }
  // 渐变占位卡样式（带景点名，不使用随机照片）
  function phStyle(cat) {
    const c = colorForCat(cat);
    return 'background:linear-gradient(135deg,' + c + ' 0%,' + c + '99 100%)';
  }
  function makeIcon(cat, imgUrl) {
    const color = colorForCat(cat);
    const inner = imgUrl
      ? '<img src="' + imgUrl + '" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display=\'none\'">'
      : '<span style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:16px">' + iconFor(cat) + '</span>';
    return L.divIcon({
      className: 'poi-pin',
      html: '<div style="width:34px;height:34px;border-radius:50%;overflow:hidden;border:3px solid ' + color + ';box-shadow:0 3px 8px rgba(0,0,0,.35);background:' + color + '">' + inner + '</div>',
      iconSize: [34, 34], iconAnchor: [17, 34], popupAnchor: [0, -30]
    });
  }
  // 带序号的水滴站点标记
  function dropIcon(n, color) {
    return L.divIcon({
      className: 'poi-pin drop-pin',
      html: '<div style="position:relative;width:30px;height:42px">' +
        '<svg width="30" height="42" viewBox="0 0 30 42"><path d="M15 1C7.3 1 1 7.3 1 15c0 10.5 14 26 14 26s14-15.5 14-26C29 7.3 22.7 1 15 1z" fill="' + color + '" stroke="#fff" stroke-width="2.5"/><circle cx="15" cy="15" r="8.5" fill="#fff"/></svg>' +
        '<span style="position:absolute;top:5px;left:0;width:30px;text-align:center;font-size:12px;font-weight:800;color:' + color + '">' + n + '</span></div>',
      iconSize: [30, 42], iconAnchor: [15, 42], popupAnchor: [0, -38]
    });
  }
  function initMap(elId, center, zoom) {
    const m = L.map(elId, { zoomControl: true }).setView(center, zoom || 12);
    L.tileLayer(CFG.MAP_TILES, { attribution: CFG.MAP_ATTR, subdomains: 'abc', maxZoom: 19 }).addTo(m);
    setTimeout(() => m.invalidateSize(), 60);
    return m;
  }
  function renderPoiMarkers(map, pois, onPick) {
    const group = L.featureGroup().addTo(map);
    pois.forEach(p => {
      const mk = L.marker([p.lat, p.lng], { icon: makeIcon(p.category, imgFor(p.id)) }).addTo(group);
      const url = imgFor(p.id);
      const img = url
        ? '<img src="' + url + '" style="width:100%;height:130px;object-fit:cover;border-radius:8px;margin:6px 0" onerror="this.style.display=\'none\'">'
        : '<div style="height:96px;border-radius:8px;margin:6px 0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-size:13px;gap:4px;' + phStyle(p.category) + '"><div style="font-size:24px">' + iconFor(p.category) + '</div><div style="padding:0 6px;text-align:center">' + p.name + '</div></div>';
      mk.bindPopup('<div style="width:200px"><b>' + p.name + '</b><br><span style="color:#0b8f76;font-weight:600">' + (DEMO.CAT_NAME[p.category] || p.category) + '</span> · ★' + p.rating + img + '<div style="font-size:12px;color:#8aa0a8;margin-top:4px">' + (p.address || '') + '</div></div>');
      if (onPick) mk.on('click', () => onPick(p));
    });
    return group;
  }

  /* ---------------- 工具 ---------------- */
  const catName = c => DEMO.CAT_NAME[c] || c;
  const modeName = m => DEMO.MODE_NAME[m] || m;
  function toast(msg) { /* 简单错误提示由组件 banner 处理 */ }

  /* ---------------- 组件：登录/注册 ---------------- */
  const Login = {
    template: '#tpl-login',
    data() { return { store, tab: 'login', form: { username: '', password: '', email: '' }, loading: false, error: '' }; },
    methods: {
      async submit() {
        this.error = ''; this.loading = true;
        try {
          if (this.tab === 'login') {
            let data;
            try { data = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(this.form) }); }
            catch (e) { if (store.demoMode || e.message.includes('Failed') || e.message.includes('fetch')) { this.demoLogin(this.form.username); return; } throw e; }
            this.afterAuth(data);
          } else {
            let data;
            try { data = await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(this.form) }); }
            catch (e) { if (store.demoMode || e.message.includes('Failed') || e.message.includes('fetch')) { this.demoLogin(this.form.username); return; } throw e; }
            this.afterAuth(data);
          }
        } catch (e) { this.error = e.message; }
        finally { this.loading = false; }
      },
      demoLogin(username) {
        store.user = { username, role: 'USER', email: '', preferences: null, createdAt: new Date().toISOString() };
        store.token = 'demo-' + username;
        localStorage.setItem('ut_token', store.token); localStorage.setItem('ut_user', JSON.stringify(store.user));
        store.demoMode = true; loadFavs(); store.view = 'discover';
      },
      afterAuth(d) {
        store.token = d.token; store.user = d.user;
        localStorage.setItem('ut_token', d.token); localStorage.setItem('ut_user', JSON.stringify(d.user));
        loadFavs(); store.view = 'discover';
      }
    }
  };

  /* ---------------- 组件：发现/地图 ---------------- */
  const Discover = {
    template: '#tpl-discover',
    data() {
      return {
        store, pois: [], provinces: [], cities: [], province: '', city: '',
        map: null, markers: null,
        provinceNames: DEMO.PROVINCES.map(p => p.name)
      };
    },
    computed: {
      initial() { return (store.user && store.user.username || '?')[0].toUpperCase(); },
      cityOptions() {
        if (!this.province) return this.cities;
        const p = DEMO.PROVINCES.find(x => x.name === this.province);
        return p ? p.cities.map(c => c.name) : [];
      }
    },
    mounted() {
      this.cities = store.cities.length ? store.cities : DEMO.ALL_CITIES;
      this.load();
    },
    onUnmounted() { if (this.map) this.map.remove(); },
    methods: {
      onProvince() { this.city = ''; this.load(); },
      async load() {
        let list;
        try {
          list = await apiFetch('/pois' + (this.city ? '?city=' + encodeURIComponent(this.city) : ''));
          store.demoMode = false;
        } catch (e) {
          list = DEMO.POIS.filter(p =>
            (!this.city || p.city === this.city) &&
            (!this.province || p.province === this.province));
          store.demoMode = true;
        }
        this.pois = list;
        list.forEach(p => loadWikiImage(p));
        await nextTick();
        let center, zoom;
        if (this.city && DEMO.CITY_CENTERS[this.city]) { center = DEMO.CITY_CENTERS[this.city]; zoom = 12; }
        else if (this.province && DEMO.CENTERS[this.province]) {
          const arr = Object.values(DEMO.CENTERS[this.province]);
          const lat = arr.reduce((s, c) => s + c[0], 0) / arr.length;
          const lng = arr.reduce((s, c) => s + c[1], 0) / arr.length;
          center = [lat, lng]; zoom = 6;
        } else { center = [35, 108]; zoom = 4; }
        if (!this.map) this.map = initMap('map', center, zoom);
        else this.map.setView(center, zoom);
        if (this.markers) this.map.removeLayer(this.markers);
        this.markers = renderPoiMarkers(this.map, this.pois, p => this.focusPoi(p));
      },
      focusPoi(p) { if (this.map) { this.map.setView([p.lat, p.lng], 15); } },
      catName, modeName, iconFor, imgFor, onImgError, phStyle, colorForCat,
      isFav(poiId) { return isFavPoi(poiId); },
      toggleFav(p) { toggleFavPoi(p); },
      go(v) { store.view = v; }
    }
  };

  /* ---------------- 组件：路线规划 ---------------- */
  const Planner = {
    template: '#tpl-planner',
    data() {
      return {
        store,
        cities: [],
        modes: [{ v: 'walk', t: '🚶步行' }, { v: 'bike', t: '🚲骑行' }, { v: 'metro', t: '🚇地铁' }, { v: 'bus', t: '🚌公交' }, { v: 'taxi', t: '🚕打车' }, { v: 'mixed', t: '🔀接驳' }],
        cats: [{ v: 'park', t: '🌳公园' }, { v: 'food', t: '🍜美食' }, { v: 'culture', t: '🏛️文化' }, { v: 'shopping', t: '🛍️购物' }, { v: 'nature', t: '⛰️自然' }, { v: 'night', t: '🌃夜生活' }],
        form: { city: '杭州', transportMode: 'mixed', timeBudgetHours: 5, interests: ['food', 'park', 'culture'], maxBudget: 0, useWeather: true },
        origin: null, plan: null, loading: false, map: null, line: null, arrows: null, stationMarkers: null, originMarker: null, error: '', roadOk: true
      };
    },
    computed: {
      originText() { return this.origin ? (this.origin.lat.toFixed(4) + ', ' + this.origin.lng.toFixed(4)) : '市中心（可点击地图修改）'; }
    },
    mounted() {
      this.cities = store.cities.length ? store.cities : DEMO.ALL_CITIES;
      const c = DEMO.CITY_CENTERS[this.form.city] || [30.2741, 120.1551];
      this.map = initMap('plan-map', c, 12);
      this.map.on('click', e => { this.origin = { lat: e.latlng.lat, lng: e.latlng.lng }; if (this.plan) this.drawPlan(); });
    },
    onUnmounted() { if (this.map) this.map.remove(); },
    methods: {
      catName, modeName, colorForMode,
      onCity() {
        const c = DEMO.CITY_CENTERS[this.form.city]; if (c && this.map) this.map.setView(c, 12);
      },
      toggleCat(v) { const i = this.form.interests.indexOf(v); if (i >= 0) this.form.interests.splice(i, 1); else this.form.interests.push(v); },
      async plan() {
        this.error = ''; this.loading = true;
        const center = this.origin || DEMO.CITY_CENTERS[this.form.city] || [30.2741, 120.1551];
        const req = {
          originLat: center[0], originLng: center[1], city: this.form.city,
          transportMode: this.form.transportMode, timeBudgetHours: this.form.timeBudgetHours,
          interests: this.form.interests, maxBudget: this.form.maxBudget > 0 ? this.form.maxBudget : null,
          useWeather: this.form.useWeather
        };
        try {
          let data;
          try { data = await apiFetch('/plan', { method: 'POST', body: JSON.stringify(req) }); store.demoMode = false; }
          catch (e) { data = DEMO.recommend(req); store.demoMode = true; }
          this.plan = data; await this.drawPlan();
        } catch (e) { this.error = e.message; }
        finally { this.loading = false; }
      },
      // 拉取 OSRM 真实道路几何（公共实例）；失败则降级为直线
      async fetchRoad(stops) {
        // stops: [ [lat,lng], ... ] —— OSRM 需要 lon,lat 顺序
        const coordStr = stops.map(p => p[1] + ',' + p[0]).join(';');
        const url = 'https://router.project-osrm.org/route/v1/driving/' + coordStr +
          '?overview=full&geometries=geojson';
        const res = await fetch(url);
        if (!res.ok) throw new Error('OSRM ' + res.status);
        const d = await res.json();
        if (!d.routes || !d.routes.length) throw new Error('no route');
        const line = d.routes[0].geometry.coordinates; // [lon,lat]
        return line.map(c => [c[1], c[0]]); // -> [lat,lon]
      },
      async drawPlan() {
        if (!this.map || !this.plan) return;
        if (this.line) this.map.removeLayer(this.line);
        if (this.arrows) this.map.removeLayer(this.arrows);
        if (this.stationMarkers) this.map.removeLayer(this.stationMarkers);
        if (this.originMarker) { this.map.removeLayer(this.originMarker); this.originMarker = null; }

        const stops = this.plan.steps.map(s => [s.poi.lat, s.poi.lng]);
        const ptsLL = stops.map(p => [p[0], p[1]]);

        if (this.origin) {
          this.originMarker = L.circleMarker([this.origin.lat, this.origin.lng],
            { radius: 7, color: '#ff6b5e', fillColor: '#ff6b5e', fillOpacity: 1 }).addTo(this.map);
        }

        // 带序号的水滴站点标记
        this.stationMarkers = L.featureGroup().addTo(this.map);
        this.plan.steps.forEach((s, i) => {
          const mk = L.marker([s.poi.lat, s.poi.lng],
            { icon: dropIcon(i + 1, colorForMode(s.mode)), zIndexOffset: 1000 - i }).addTo(this.stationMarkers);
          mk.bindPopup('<b>' + (i + 1) + '. ' + s.poi.name + '</b><br><span style="color:#0b8f76">' +
            modeName(s.mode) + '</span> · 距上站 ' + s.distanceFromPrevKm + 'km');
        });

        // 真实道路几何
        let road = null;
        try { road = await this.fetchRoad(stops); this.roadOk = true; }
        catch (e) { road = null; this.roadOk = false; }

        if (road && road.length > 1) {
          this.line = L.polyline(road, { color: '#0fae8e', weight: 6, opacity: .9, lineCap: 'round', lineJoin: 'round' }).addTo(this.map);
          if (window.L.polylineDecorator) {
            this.arrows = L.polylineDecorator(this.line, {
              patterns: [{ offset: '6%', repeat: '70px', symbol: L.polylineDecorator.symbols.arrowHead({ pixelSize: 13, polygon: false, pathOptions: { stroke: true, color: '#0fae8e', weight: 3, opacity: .9 } }) }]
            }).addTo(this.map);
          }
          this.map.fitBounds(this.line.getBounds(), { padding: [40, 40] });
        } else {
          this.line = L.polyline(ptsLL, { color: '#0fae8e', weight: 5, opacity: .85, dashArray: '1,8', lineCap: 'round' }).addTo(this.map);
          this.map.fitBounds(this.line.getBounds(), { padding: [40, 40] });
        }
      },
      savePlan() { saveRoute(this.plan, this.form.transportMode); },
      async saveStep(s) { await toggleFavPoi(s.poi); alert(isFavPoi(s.poi.id) ? '已加入收藏 ❤️' : '已取消收藏'); }
    }
  };

  /* ---------------- 组件：AI 助手 ---------------- */
  const Ai = {
    template: '#tpl-ai',
    data() {
      return {
        store, input: '', thinking: false, llm: store.llm,
        messages: [{ role: 'bot', text: '嗨～我是你的城市轻出行 AI 助手 🤖\n试着说：「帮我规划杭州一天的行程，喜欢美食和公园」', plan: null }],
        quick: ['杭州一天游，喜欢美食和公园', '成都半天怎么玩', '北京适合雨天室内游', '上海购物+美食半日']
      };
    },
    mounted() { this.scroll(); },
    updated() { this.scroll(); },
    methods: {
      catName, modeName,
      scroll() { this.$nextTick(() => { if (this.$refs.log) this.$refs.log.scrollTop = this.$refs.log.scrollHeight; }); },
      async send(text) {
        const msg = (text != null ? text : this.input).trim();
        if (!msg || this.thinking) return;
        this.input = ''; this.messages.push({ role: 'user', text: msg, plan: null });
        this.thinking = true;
        try {
          let data;
          try {
            data = await apiFetch('/ai/chat', { method: 'POST', body: JSON.stringify({ message: msg, history: [] }) });
            store.demoMode = false; this.llm = data.usedLlm;
          } catch (e) { data = DEMO.chat(msg); store.demoMode = true; this.llm = false; }
          this.messages.push({ role: 'bot', text: data.reply, plan: data.plan || null });
        } catch (e) {
          this.messages.push({ role: 'bot', text: '出错了：' + e.message, plan: null });
        } finally { this.thinking = false; }
      }
    }
  };

  /* ---------------- 组件：收藏 ---------------- */
  const Favorites = {
    template: '#tpl-favorites',
    data() { return { store, fav, favPois: computed(() => fav.pois), favRoutes: computed(() => fav.routes) }; },
    mounted() { if (store.user && !fav.pois.length && !fav.routes.length && !store.demoMode) loadFavs(); },
    methods: { catName, modeName, delRoute }
  };

  /* ---------------- 组件：个人中心 ---------------- */
  const Profile = {
    template: '#tpl-profile',
    data() {
      const p = { transportModes: ['walk', 'bike', 'metro'], interests: ['park', 'food', 'culture'], maxBudget: 300, maxDistanceKm: 12 };
      try { if (store.user && store.user.preferences) { const x = JSON.parse(store.user.preferences); Object.assign(p, x); } } catch (e) {}
      return {
        store, prefs: p, saving: false, saved: false,
        modes: [{ v: 'walk', t: '🚶步行' }, { v: 'bike', t: '🚲骑行' }, { v: 'metro', t: '🚇地铁' }, { v: 'bus', t: '🚌公交' }, { v: 'taxi', t: '🚕打车' }, { v: 'mixed', t: '🔀接驳' }],
        cats: [{ v: 'park', t: '🌳公园' }, { v: 'food', t: '🍜美食' }, { v: 'culture', t: '🏛️文化' }, { v: 'shopping', t: '🛍️购物' }, { v: 'nature', t: '⛰️自然' }, { v: 'night', t: '🌃夜生活' }]
      };
    },
    computed: { initial() { return (store.user && store.user.username || '?')[0].toUpperCase(); } },
    methods: {
      catName, modeName,
      togglePref(v) { const i = this.prefs.transportModes.indexOf(v); if (i >= 0) this.prefs.transportModes.splice(i, 1); else this.prefs.transportModes.push(v); },
      toggleInt(v) { const i = this.prefs.interests.indexOf(v); if (i >= 0) this.prefs.interests.splice(i, 1); else this.prefs.interests.push(v); },
      async save() {
        this.saving = true; this.saved = false;
        const body = JSON.stringify(this.prefs);
        try {
          if (store.demoMode || !store.token) { if (store.user) store.user.preferences = body; this.saved = true; }
          else { const u = await apiFetch('/users/me/preferences', { method: 'PUT', body }); store.user = u; localStorage.setItem('ut_user', JSON.stringify(u)); this.saved = true; }
        } catch (e) { alert(e.message); }
        finally { this.saving = false; setTimeout(() => this.saved = false, 2000); }
      }
    }
  };

  /* ---------------- 根组件 ---------------- */
  const Root = {
    template: '#tpl-root',
    data() { return { store }; },
    computed: { initial() { return (store.user && store.user.username || '?')[0].toUpperCase(); } },
    methods: {
      go(view) {
        if ((view === 'favorites' || view === 'profile') && !store.user) { store.view = 'login'; return; }
        store.view = view;
      },
      logout() {
        store.token = ''; store.user = null; localStorage.removeItem('ut_token'); localStorage.removeItem('ut_user');
        fav.pois = []; fav.routes = []; store.view = 'discover';
      }
    }
  };

  /* ---------------- 启动 ---------------- */
  async function bootstrap() {
    // 探活后端
    try {
      const h = await apiFetch('/health');
      store.demoMode = false; store.llm = false;
      if (Array.isArray(h.cities)) store.cities = h.cities;
    } catch (e) {
      store.demoMode = true; store.cities = DEMO.ALL_CITIES;
    }
    if (store.user && !store.demoMode) loadFavs();
    if (store.demoMode && store.user) loadFavs();

    const app = createApp(Root);
    app.component('discover', Discover);
    app.component('planner', Planner);
    app.component('ai', Ai);
    app.component('favorites', Favorites);
    app.component('profile', Profile);
    app.component('login', Login);
    app.mount('#app');
  }

  bootstrap();
})();
