/* 轻出行前端应用：Vue3(CDN) + Leaflet(CDN)，前后端分离。
   优先连接后端 API；若无法连接（纯静态托管）自动进入「演示模式」，使用内置示例数据。 */
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

  /* ---------------- 收藏（在线走 API，演示模式走 localStorage） ---------------- */
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
      alert('已保存到本地收藏（演示模式）'); return;
    }
    await apiFetch('/routes', { method: 'POST', body: JSON.stringify({ title, transportMode, plan }) });
    alert('路线已保存 ✓'); loadFavs();
  }
  async function delRoute(id) {
    if (store.demoMode) { fav.routes = fav.routes.filter(r => r.id !== id); localStorage.setItem(LS_ROUTES, JSON.stringify(fav.routes)); return; }
    await apiFetch('/routes/' + id, { method: 'DELETE' }); loadFavs();
  }

  /* ---------------- 地图辅助 ---------------- */
  function iconFor(cat) {
    return ({ park: '🌳', food: '🍜', culture: '🏛️', shopping: '🛍️', nature: '⛰️', night: '🌃', transit: '🚉' })[cat] || '📍';
  }
  function makeIcon(cat) {
    return L.divIcon({
      className: 'poi-pin', html: '<div style="font-size:22px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.3))">' + iconFor(cat) + '</div>',
      iconSize: [26, 26], iconAnchor: [13, 13]
    });
  }
  function initMap(elId, center, zoom) {
    const m = L.map(elId, { zoomControl: true }).setView(center, zoom || 12);
    L.tileLayer(CFG.MAP_TILES, { attribution: CFG.MAP_ATTR, subdomains: 'abcd', maxZoom: 19 }).addTo(m);
    setTimeout(() => m.invalidateSize(), 60);
    return m;
  }
  function renderPoiMarkers(map, pois, onPick) {
    const group = L.featureGroup().addTo(map);
    pois.forEach(p => {
      const mk = L.marker([p.lat, p.lng], { icon: makeIcon(p.category) }).addTo(group);
      mk.bindPopup('<b>' + p.name + '</b><br>' + (DEMO.CAT_NAME[p.category] || p.category) + ' · ★' + p.rating);
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
    data() { return { store, pois: [], cities: [], city: '', map: null, markers: null }; },
    computed: { initial() { return (store.user && store.user.username || '?')[0].toUpperCase(); } },
    mounted() { this.cities = store.cities.length ? store.cities : Object.keys(DEMO.CENTERS); this.load(); },
    onUnmounted() { if (this.map) this.map.remove(); },
    methods: {
      async load() {
        let list;
        try { list = await apiFetch('/pois' + (this.city ? '?city=' + encodeURIComponent(this.city) : '')); store.demoMode = false; }
        catch (e) { list = DEMO.POIS.filter(p => !this.city || p.city === this.city); store.demoMode = true; }
        this.pois = list;
        await nextTick();
        const center = this.city && DEMO.CENTERS[this.city] ? DEMO.CENTERS[this.city] : [30.27, 115];
        if (!this.map) this.map = initMap('map', center, this.city ? 12 : 4);
        else this.map.setView(center, this.city ? 12 : 4);
        if (this.markers) this.map.removeLayer(this.markers);
        this.markers = renderPoiMarkers(this.map, this.pois, p => this.focusPoi(p));
      },
      focusPoi(p) { if (this.map) { this.map.setView([p.lat, p.lng], 15); } },
      catName, modeName, iconFor,
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
        origin: null, plan: null, loading: false, map: null, line: null, error: ''
      };
    },
    computed: {
      originText() { return this.origin ? (this.origin.lat.toFixed(4) + ', ' + this.origin.lng.toFixed(4)) : '市中心（可点击地图修改）'; }
    },
    mounted() {
      this.cities = store.cities.length ? store.cities : Object.keys(DEMO.CENTERS);
      const c = DEMO.CENTERS[this.form.city] || [30.2741, 120.1551];
      this.map = initMap('plan-map', c, 12);
      this.map.on('click', e => { this.origin = { lat: e.latlng.lat, lng: e.latlng.lng }; if (this.plan) this.drawPlan(); });
    },
    onUnmounted() { if (this.map) this.map.remove(); },
    methods: {
      catName, modeName,
      onCity() {
        const c = DEMO.CENTERS[this.form.city]; if (c && this.map) this.map.setView(c, 12);
      },
      toggleCat(v) { const i = this.form.interests.indexOf(v); if (i >= 0) this.form.interests.splice(i, 1); else this.form.interests.push(v); },
      async plan() {
        this.error = ''; this.loading = true;
        const center = this.origin || DEMO.CENTERS[this.form.city] || [30.2741, 120.1551];
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
          this.plan = data; this.drawPlan();
        } catch (e) { this.error = e.message; }
        finally { this.loading = false; }
      },
      drawPlan() {
        if (!this.map || !this.plan) return;
        if (this.line) this.map.removeLayer(this.line);
        const pts = (this.plan.polyline || []).map(p => [p[1], p[0]]);
        if (pts.length > 1) {
          this.line = L.polyline(pts, { color: '#0fae8e', weight: 5, opacity: .85, dashArray: '1,8', lineCap: 'round' }).addTo(this.map);
          this.map.fitBounds(this.line.getBounds(), { padding: [40, 40] });
        }
        // 起点标记
        if (this.origin) L.circleMarker([this.origin.lat, this.origin.lng], { radius: 7, color: '#ff6b5e', fillColor: '#ff6b5e', fillOpacity: 1 }).addTo(this.map);
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
        if (view === 'discover') { /* 触发重新加载 */ }
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
      if (Array.isArray(h.cities)) store.cities = h.cities; else if (Array.isArray(h.poiCount)) {}
    } catch (e) {
      store.demoMode = true; store.cities = Object.keys(DEMO.CENTERS);
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
