/* 前端运行配置：API 基地址（默认走相对 /api，由 nginx 反向代理；
   也可通过 ?api=https://your-backend 覆盖，便于连接已上线的后端）。 */
(function () {
  const params = new URLSearchParams(location.search);
  const api = params.get('api');
  window.APP_CONFIG = {
    API_BASE: api || '/api',
    MAP_TILES: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    MAP_ATTR: '© OpenStreetMap contributors © CARTO'
  };
})();
