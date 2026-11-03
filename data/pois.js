/* ============================================================================
 * 全国统一 POI 数据源（单一事实来源 / Single Source of Truth）
 * ----------------------------------------------------------------------------
 * 省份 → 城市 → 景点 三级结构，覆盖全国 34 个省级行政区：
 *   4 直辖市 · 23 省（含台湾省）· 5 自治区 · 香港 / 澳门 特别行政区
 * 每个 POI 含真实经纬度与精确中文维基百科词条名（wiki 字段）。
 *
 * 该文件被 tools/generate-data.js 读取，并生成：
 *   - frontend/js/demo-data.js  （前端离线示例数据 + 推荐/聊天逻辑）
 *   - backend/src/main/resources/pois.json （后端 DataSeeder 读取）
 * 保证前端与后端城市数据完全一致。请勿在生成产物中手工修改数据。
 * ==========================================================================*/
'use strict';

const PROVINCES = [
  /* ============ 直辖市 ============ */
  {
    name: '北京市',
    cities: [
      {
        name: '北京', center: [39.9042, 116.4074],
        pois: [
          { id: 201, name: '故宫博物院', category: 'culture', lng: 116.3972, lat: 39.9163, address: '北京市东城区景山前街4号', rating: 4.9, priceLevel: 3, tags: '古迹,博物馆,历史', avgDurationMin: 180, openHours: '08:30-17:00', description: '明清两代皇宫，世界最大的木结构宫殿群。', wiki: '故宫' },
          { id: 202, name: '颐和园', category: 'park', lng: 116.2755, lat: 39.9999, address: '北京市海淀区新建宫门路19号', rating: 4.7, priceLevel: 2, tags: '园林,湖,长廊', avgDurationMin: 150, openHours: '06:30-18:00', description: '皇家园林，昆明湖与万寿山相映。', wiki: '颐和园' },
          { id: 203, name: '南锣鼓巷', category: 'food', lng: 116.4030, lat: 39.9350, address: '北京市东城区南锣鼓巷', rating: 4.3, priceLevel: 2, tags: '小吃,胡同,文创', avgDurationMin: 60, openHours: '全天', description: '最富老北京味的胡同小吃街。', wiki: '南锣鼓巷' },
          { id: 204, name: '天安门广场', category: 'culture', lng: 116.3976, lat: 39.9055, address: '北京市东城区长安街', rating: 4.6, priceLevel: 1, tags: '地标,广场,升旗', avgDurationMin: 60, openHours: '全天', description: '世界最大城市广场，清晨升旗仪式壮观。', wiki: '天安门广场' },
          { id: 205, name: '798艺术区', category: 'culture', lng: 116.4950, lat: 39.9840, address: '北京市朝阳区酒仙桥路4号', rating: 4.4, priceLevel: 1, tags: '艺术,展览,工业风', avgDurationMin: 120, openHours: '全天', description: '由老工厂改造的当代艺术聚集地。', wiki: '798艺术区' },
          { id: 206, name: '什刹海', category: 'night', lng: 116.3890, lat: 39.9400, address: '北京市西城区什刹海', rating: 4.3, priceLevel: 2, tags: '酒吧,湖,夜景,胡同', avgDurationMin: 120, openHours: '全天', description: '后海酒吧街与胡同游船，夜生活地标。', wiki: '什刹海' }
        ]
      }
    ]
  },
  {
    name: '上海市',
    cities: [
      {
        name: '上海', center: [31.2304, 121.4737],
        pois: [
          { id: 301, name: '外滩', category: 'night', lng: 121.4900, lat: 31.2397, address: '上海市黄浦区中山东一路', rating: 4.8, priceLevel: 1, tags: '夜景,江景,地标', avgDurationMin: 90, openHours: '全天', description: '万国建筑博览群，浦江夜景绝美。', wiki: '外滩' },
          { id: 302, name: '豫园', category: 'culture', lng: 121.4920, lat: 31.2270, address: '上海市黄浦区安仁街218号', rating: 4.5, priceLevel: 2, tags: '园林,古迹,城隍庙', avgDurationMin: 90, openHours: '08:30-17:00', description: '明代私家园林，旁有城隍庙小吃。', wiki: '豫园' },
          { id: 303, name: '南京路步行街', category: 'shopping', lng: 121.4780, lat: 31.2340, address: '上海市黄浦区南京东路', rating: 4.4, priceLevel: 2, tags: '购物,步行街,老字号', avgDurationMin: 60, openHours: '全天', description: '中华商业第一街，霓虹璀璨。', wiki: '南京路步行街' },
          { id: 304, name: '上海博物馆', category: 'culture', lng: 121.4730, lat: 31.2280, address: '上海市黄浦区人民大道201号', rating: 4.6, priceLevel: 1, tags: '博物馆,历史,青铜器', avgDurationMin: 120, openHours: '09:00-17:00', description: '顶级中国古代艺术馆，免费预约。', wiki: '上海博物馆' },
          { id: 305, name: '田子坊', category: 'food', lng: 121.4730, lat: 31.2100, address: '上海市黄浦区泰康路210弄', rating: 4.2, priceLevel: 2, tags: '弄堂,小吃,文创', avgDurationMin: 60, openHours: '全天', description: '石库门里弄改造的文艺集市。', wiki: '田子坊' },
          { id: 306, name: '世纪公园', category: 'park', lng: 121.5500, lat: 31.2190, address: '上海市浦东新区锦绣路1001号', rating: 4.3, priceLevel: 1, tags: '绿地,亲子,骑行', avgDurationMin: 90, openHours: '07:00-18:00', description: '浦东最大的生态公园，草坪广阔。', wiki: '世纪公园' }
        ]
      }
    ]
  },
  {
    name: '天津市',
    cities: [
      {
        name: '天津', center: [39.0842, 117.2009],
        pois: [
          { id: 1201, name: '五大道', category: 'culture', lng: 117.2080, lat: 39.1140, address: '天津市和平区五大道', rating: 4.4, priceLevel: 1, tags: '洋楼,散步,历史', avgDurationMin: 90, openHours: '全天', description: '万国建筑博览苑，名人旧居。', wiki: '五大道' },
          { id: 1202, name: '天津之眼', category: 'night', lng: 117.1850, lat: 39.0870, address: '天津市红桥区永乐桥', rating: 4.3, priceLevel: 2, tags: '摩天轮,夜景,地标', avgDurationMin: 60, openHours: '09:30-21:30', description: '横跨永乐桥的巨型摩天轮。', wiki: '天津之眼摩天轮' },
          { id: 1203, name: '古文化街', category: 'culture', lng: 117.1900, lat: 39.1390, address: '天津市南开区古文化街', rating: 4.2, priceLevel: 2, tags: '古街,小吃,民俗', avgDurationMin: 60, openHours: '全天', description: '津味民俗与杨柳青年画。', wiki: '古文化街' },
          { id: 1204, name: '意大利风情区', category: 'night', lng: 117.2000, lat: 39.1300, address: '天津市河北区意式风情区', rating: 4.1, priceLevel: 2, tags: '欧式建筑,酒吧,夜景', avgDurationMin: 90, openHours: '全天', description: '地中海风格街区的夜生活。', wiki: '天津意式风情区' },
          { id: 1205, name: '海河', category: 'nature', lng: 117.2000, lat: 39.1000, address: '天津市海河', rating: 4.2, priceLevel: 1, tags: '河,夜景,游船', avgDurationMin: 90, openHours: '全天', description: '城市母亲河，夜游灯光璀璨。', wiki: '海河' },
          { id: 1206, name: '瓷房子', category: 'culture', lng: 117.1850, lat: 39.1210, address: '天津市和平区赤峰道', rating: 4.0, priceLevel: 2, tags: '建筑,瓷片,奇景', avgDurationMin: 60, openHours: '09:00-18:00', description: '用数万件瓷片装饰的奇楼。', wiki: '瓷房子' }
        ]
      }
    ]
  },
  {
    name: '重庆市',
    cities: [
      {
        name: '重庆', center: [29.5630, 106.5516],
        pois: [
          { id: 801, name: '洪崖洞', category: 'night', lng: 106.5830, lat: 29.5630, address: '重庆市渝中区嘉陵江滨江路', rating: 4.5, priceLevel: 2, tags: '夜景,吊脚楼,小吃', avgDurationMin: 90, openHours: '全天', description: '魔幻吊脚楼夜景，重庆地标。', wiki: '洪崖洞' },
          { id: 802, name: '解放碑', category: 'shopping', lng: 106.5770, lat: 29.5580, address: '重庆市渝中区解放碑', rating: 4.3, priceLevel: 2, tags: '商圈,地标,购物', avgDurationMin: 60, openHours: '全天', description: '重庆核心商圈与城市原点。', wiki: '解放碑' },
          { id: 803, name: '磁器口古镇', category: 'culture', lng: 106.4560, lat: 29.5800, address: '重庆市沙坪坝区磁器口', rating: 4.2, priceLevel: 2, tags: '古镇,小吃,文创', avgDurationMin: 90, openHours: '全天', description: '千年古镇，麻花与老火锅飘香。', wiki: '磁器口古镇' },
          { id: 804, name: '长江索道', category: 'transit', lng: 106.5890, lat: 29.5460, address: '重庆市渝中区新华路', rating: 4.3, priceLevel: 2, tags: '索道,江景,观光', avgDurationMin: 30, openHours: '07:00-22:00', description: '空中跨越长江的城市缆车。', wiki: '长江索道' },
          { id: 805, name: '南山一棵树', category: 'night', lng: 106.6060, lat: 29.5350, address: '重庆市南岸区南山', rating: 4.4, priceLevel: 1, tags: '夜景,观景台,城市全景', avgDurationMin: 90, openHours: '09:00-22:30', description: '俯瞰山城两江四岸夜景的最佳点。', wiki: '南山一棵树观景台' },
          { id: 806, name: '朝天门', category: 'culture', lng: 106.5830, lat: 29.5730, address: '重庆市渝中区朝天门', rating: 4.3, priceLevel: 1, tags: '码头,两江汇,地标', avgDurationMin: 60, openHours: '全天', description: '长江与嘉陵江交汇处，来福士旁。', wiki: '朝天门' }
        ]
      }
    ]
  },

  /* ============ 省 ============ */
  {
    name: '河北省',
    cities: [
      {
        name: '石家庄', center: [38.0428, 114.5149],
        pois: [
          { id: 3301, name: '正定古城', category: 'culture', lng: 114.5700, lat: 38.1500, address: '石家庄市正定县', rating: 4.2, priceLevel: 1, tags: '古城,古寺,塔', avgDurationMin: 150, openHours: '全天', description: '古刹林立的千年古城。', wiki: '正定县' },
          { id: 3302, name: '西柏坡', category: 'culture', lng: 113.8200, lat: 38.3200, address: '石家庄市平山县', rating: 4.3, priceLevel: 1, tags: '红色,纪念馆,旧址', avgDurationMin: 120, openHours: '08:30-17:00', description: '新中国从这里走来。', wiki: '西柏坡' },
          { id: 3303, name: '赵州桥', category: 'culture', lng: 114.7800, lat: 37.7400, address: '石家庄市赵县', rating: 4.1, priceLevel: 2, tags: '古桥,隋代,世界遗产', avgDurationMin: 90, openHours: '08:00-17:30', description: '隋代李春所建千年石拱桥。', wiki: '赵州桥' },
          { id: 3304, name: '河北博物院', category: 'culture', lng: 114.5200, lat: 38.0700, address: '石家庄市长安区东大街', rating: 4.2, priceLevel: 1, tags: '博物馆,长信宫灯,满城汉墓', avgDurationMin: 120, openHours: '09:00-17:00', description: '满城汉墓与长信宫灯。', wiki: '河北博物院' },
          { id: 3305, name: '抱犊寨', category: 'nature', lng: 114.3800, lat: 38.0800, address: '石家庄市鹿泉区', rating: 3.9, priceLevel: 2, tags: '山,寨,登山', avgDurationMin: 150, openHours: '08:00-17:00', description: '山顶寨堡，长城式城墙。', wiki: '抱犊寨' },
          { id: 3306, name: '柏林禅寺', category: 'culture', lng: 114.7800, lat: 37.7400, address: '石家庄市赵县', rating: 3.8, priceLevel: 1, tags: '寺庙,禅宗,古刹', avgDurationMin: 90, openHours: '全天', description: '赵州祖庭，禅宗道场。', wiki: '柏林禅寺' }
        ]
      },
      {
        name: '秦皇岛', center: [39.9350, 119.6000],
        pois: [
          { id: 4001, name: '山海关', category: 'culture', lng: 119.7700, lat: 39.9700, address: '秦皇岛市山海关区', rating: 4.4, priceLevel: 2, tags: '长城,古城,天下第一关', avgDurationMin: 120, openHours: '07:30-17:30', description: '天下第一关，长城起点。', wiki: '山海关' },
          { id: 4002, name: '北戴河', category: 'nature', lng: 119.4800, lat: 39.8300, address: '秦皇岛市北戴河区', rating: 4.2, priceLevel: 2, tags: '海滨,避暑,度假', avgDurationMin: 150, openHours: '全天', description: '避暑胜地，观海听涛。', wiki: '北戴河' },
          { id: 4003, name: '老龙头', category: 'culture', lng: 119.8000, lat: 39.9600, address: '秦皇岛市山海关区', rating: 4.2, priceLevel: 2, tags: '长城,入海,古迹', avgDurationMin: 90, openHours: '07:30-17:30', description: '长城入海处。', wiki: '老龙头' }
        ]
      }
    ]
  },
  {
    name: '山西省',
    cities: [
      {
        name: '太原', center: [37.8706, 112.5489],
        pois: [
          { id: 3201, name: '晋祠', category: 'culture', lng: 112.4400, lat: 37.7100, address: '太原市晋源区晋祠镇', rating: 4.5, priceLevel: 2, tags: '古祠,园林,宋塑', avgDurationMin: 150, openHours: '08:30-18:00', description: '千年祠庙与宋代彩塑。', wiki: '晋祠' },
          { id: 3202, name: '平遥古城', category: 'culture', lng: 112.1800, lat: 37.2000, address: '晋中市平遥县', rating: 4.6, priceLevel: 3, tags: '古城,世界遗产,明清', avgDurationMin: 240, openHours: '全天', description: '保存最完整的明清县城。', wiki: '平遥古城' },
          { id: 3203, name: '双塔寺(永祚寺)', category: 'culture', lng: 112.5900, lat: 37.8500, address: '太原市迎泽区郝庄', rating: 4.0, priceLevel: 1, tags: '古塔,寺庙,牡丹', avgDurationMin: 90, openHours: '08:00-18:00', description: '明代双塔，太原地标。', wiki: '永祚寺' },
          { id: 3204, name: '山西博物院', category: 'culture', lng: 112.5200, lat: 37.8700, address: '太原市万柏林区滨河西路', rating: 4.3, priceLevel: 1, tags: '博物馆,晋文化,青铜', avgDurationMin: 150, openHours: '09:00-17:00', description: '晋侯鸟尊与三晋文明。', wiki: '山西博物院' },
          { id: 3205, name: '柳巷', category: 'shopping', lng: 112.5600, lat: 37.8700, address: '太原市迎泽区柳巷', rating: 3.9, priceLevel: 2, tags: '步行街,购物,小吃', avgDurationMin: 60, openHours: '全天', description: '太原最热闹的商业街。', wiki: '柳巷' },
          { id: 3206, name: '蒙山大佛', category: 'nature', lng: 112.3800, lat: 37.7800, address: '太原市晋源区蒙山', rating: 4.1, priceLevel: 1, tags: '大佛,山,石窟', avgDurationMin: 150, openHours: '08:00-18:00', description: '开凿于北齐的巨型摩崖佛像。', wiki: '蒙山大佛' }
        ]
      },
      {
        name: '大同', center: [40.0760, 113.3000],
        pois: [
          { id: 4011, name: '云冈石窟', category: 'culture', lng: 113.1300, lat: 40.1100, address: '大同市云冈区云冈镇', rating: 4.6, priceLevel: 2, tags: '石窟,世界遗产,北魏', avgDurationMin: 150, openHours: '08:30-17:30', description: '北魏皇家石窟艺术。', wiki: '云冈石窟' },
          { id: 4012, name: '恒山(悬空寺)', category: 'culture', lng: 113.5300, lat: 39.7300, address: '大同市浑源县恒山', rating: 4.5, priceLevel: 2, tags: '寺庙,悬崖,奇观', avgDurationMin: 120, openHours: '08:00-17:30', description: '悬挂绝壁的千年古寺。', wiki: '悬空寺' },
          { id: 4013, name: '大同古城墙', category: 'culture', lng: 113.3000, lat: 40.0760, address: '大同市平城区', rating: 4.1, priceLevel: 1, tags: '城墙,夜景,古迹', avgDurationMin: 90, openHours: '全天', description: '明代府城垣，气势恢宏。', wiki: '大同古城墙' }
        ]
      }
    ]
  },
  {
    name: '内蒙古自治区',
    cities: [
      {
        name: '呼和浩特', center: [40.8420, 111.7490],
        pois: [
          { id: 4021, name: '大召寺', category: 'culture', lng: 111.6740, lat: 40.8080, address: '呼和浩特市玉泉区大召前街', rating: 4.3, priceLevel: 1, tags: '寺庙,藏传,银佛', avgDurationMin: 90, openHours: '08:00-18:00', description: '内蒙古最大藏传寺庙。', wiki: '大召' },
          { id: 4022, name: '内蒙古博物院', category: 'culture', lng: 111.7300, lat: 40.8500, address: '呼和浩特市新城区新华东街', rating: 4.1, priceLevel: 1, tags: '博物馆,草原,恐龙', avgDurationMin: 120, openHours: '09:00-17:00', description: '草原文明与恐龙化石。', wiki: '内蒙古博物院' },
          { id: 4023, name: '昭君墓', category: 'culture', lng: 111.6300, lat: 40.7400, address: '呼和浩特市玉泉区昭君路', rating: 4.0, priceLevel: 1, tags: '陵墓,和亲,古迹', avgDurationMin: 60, openHours: '08:00-18:00', description: '青冢拥黛，和亲佳话。', wiki: '昭君墓' }
        ]
      },
      {
        name: '呼伦贝尔', center: [49.2120, 119.7700],
        pois: [
          { id: 4031, name: '呼伦贝尔大草原', category: 'nature', lng: 119.9300, lat: 49.2300, address: '呼伦贝尔市陈巴尔虎旗', rating: 4.6, priceLevel: 1, tags: '草原,骑马,风光', avgDurationMin: 240, openHours: '全天', description: '天下最美草原。', wiki: '呼伦贝尔草原' },
          { id: 4032, name: '额尔古纳湿地', category: 'nature', lng: 120.2100, lat: 50.2500, address: '呼伦贝尔市额尔古纳市', rating: 4.3, priceLevel: 2, tags: '湿地,河流,生态', avgDurationMin: 150, openHours: '07:30-18:00', description: '亚洲第一湿地。', wiki: '额尔古纳湿地' },
          { id: 4033, name: '满洲里', category: 'culture', lng: 117.3800, lat: 49.5900, address: '呼伦贝尔市满洲里市', rating: 4.2, priceLevel: 1, tags: '口岸,俄式,夜景', avgDurationMin: 120, openHours: '全天', description: '中俄蒙风情口岸城。', wiki: '满洲里' }
        ]
      }
    ]
  },
  {
    name: '辽宁省',
    cities: [
      {
        name: '沈阳', center: [41.8057, 123.4315],
        pois: [
          { id: 2601, name: '沈阳故宫', category: 'culture', lng: 123.4500, lat: 41.8000, address: '沈阳市沈河区沈阳路', rating: 4.5, priceLevel: 2, tags: '皇宫,清,古迹', avgDurationMin: 120, openHours: '08:30-17:00', description: '清初皇宫，关外紫禁城。', wiki: '沈阳故宫' },
          { id: 2602, name: '张氏帅府', category: 'culture', lng: 123.4600, lat: 41.7900, address: '沈阳市沈河区朝阳街', rating: 4.2, priceLevel: 2, tags: '民国,帅府,古迹', avgDurationMin: 90, openHours: '08:30-17:00', description: '张作霖张学良父子的府邸。', wiki: '张氏帅府' },
          { id: 2603, name: '九一八历史博物馆', category: 'culture', lng: 123.4700, lat: 41.7800, address: '沈阳市大东区望花南街', rating: 4.4, priceLevel: 1, tags: '历史,纪念馆,教育', avgDurationMin: 90, openHours: '09:00-16:30(周一闭馆)', description: '铭记九一八事变的场馆。', wiki: '九一八历史博物馆' },
          { id: 2604, name: '中街', category: 'shopping', lng: 123.4600, lat: 41.8000, address: '沈阳市沈河区中街', rating: 4.1, priceLevel: 2, tags: '步行街,购物,老字号', avgDurationMin: 60, openHours: '全天', description: '中国第一条商业步行街。', wiki: '中街' },
          { id: 2605, name: '北陵公园', category: 'park', lng: 123.4300, lat: 41.8400, address: '沈阳市皇姑区泰山路', rating: 4.2, priceLevel: 1, tags: '清昭陵,园林,古迹', avgDurationMin: 120, openHours: '06:00-20:00', description: '清昭陵，陵寝与园林合一。', wiki: '清昭陵' },
          { id: 2606, name: '怪坡', category: 'nature', lng: 123.6000, lat: 42.0000, address: '沈阳市沈北新区', rating: 3.8, priceLevel: 1, tags: '奇观,坡,自驾', avgDurationMin: 60, openHours: '全天', description: '车辆上坡自动滑行的奇坡。', wiki: '怪坡 (沈阳)' }
        ]
      },
      {
        name: '大连', center: [38.9140, 121.6147],
        pois: [
          { id: 1801, name: '星海广场', category: 'night', lng: 121.5900, lat: 38.8700, address: '大连市沙河口区星海广场', rating: 4.3, priceLevel: 1, tags: '广场,地标,夜景', avgDurationMin: 60, openHours: '全天', description: '亚洲最大城市广场。', wiki: '星海广场' },
          { id: 1802, name: '金石滩', category: 'nature', lng: 122.0800, lat: 39.0600, address: '大连市金州区金石滩', rating: 4.4, priceLevel: 2, tags: '海岸,奇石,度假', avgDurationMin: 180, openHours: '全天', description: '国家地质公园，奇礁海岸。', wiki: '金石滩' },
          { id: 1803, name: '老虎滩海洋公园', category: 'nature', lng: 121.6100, lat: 38.8700, address: '大连市中山区滨海中路', rating: 4.1, priceLevel: 3, tags: '海洋,动物园,亲子', avgDurationMin: 180, openHours: '08:30-17:00', description: '滨海海洋主题乐园。', wiki: '老虎滩海洋公园' },
          { id: 1804, name: '滨海路', category: 'nature', lng: 121.6200, lat: 38.8800, address: '大连市中山区滨海路', rating: 4.2, priceLevel: 1, tags: '海滨,风光,徒步', avgDurationMin: 120, openHours: '全天', description: '依山傍海的风光公路。', wiki: '滨海路 (大连)' },
          { id: 1805, name: '俄罗斯风情街', category: 'culture', lng: 121.6300, lat: 38.9200, address: '大连市西岗区团结街', rating: 3.9, priceLevel: 1, tags: '欧式建筑,老街,购物', avgDurationMin: 60, openHours: '全天', description: '俄式建筑改造的文旅街。', wiki: '俄罗斯风情街' },
          { id: 1806, name: '棒棰岛', category: 'nature', lng: 121.6800, lat: 38.8700, address: '大连市中山区棒棰岛', rating: 4.2, priceLevel: 2, tags: '海岛,浴场,国宾馆', avgDurationMin: 120, openHours: '08:30-17:00', description: '三面环海的清幽浴场。', wiki: '棒棰岛' }
        ]
      }
    ]
  },
  {
    name: '吉林省',
    cities: [
      {
        name: '长春', center: [43.8170, 125.3230],
        pois: [
          { id: 4041, name: '伪满皇宫博物院', category: 'culture', lng: 125.3500, lat: 43.8800, address: '长春市宽城区光复路', rating: 4.4, priceLevel: 2, tags: '博物馆,近代,皇宫', avgDurationMin: 120, openHours: '08:30-17:00', description: '末代皇帝居所。', wiki: '伪满皇宫博物院' },
          { id: 4042, name: '净月潭', category: 'nature', lng: 125.4200, lat: 43.7300, address: '长春市南关区净月大街', rating: 4.2, priceLevel: 1, tags: '森林公园,湖,滑雪', avgDurationMin: 150, openHours: '全天', description: '绿海明珠，城市绿肺。', wiki: '净月潭' },
          { id: 4043, name: '长影世纪城', category: 'culture', lng: 125.4500, lat: 43.7600, address: '长春市南关区净月大街', rating: 4.0, priceLevel: 3, tags: '电影,主题公园,游乐', avgDurationMin: 180, openHours: '09:00-17:00', description: '电影主题乐园。', wiki: '长影世纪城' }
        ]
      },
      {
        name: '吉林市', center: [43.8370, 126.5490],
        pois: [
          { id: 4051, name: '松花湖', category: 'nature', lng: 126.9500, lat: 43.6500, address: '吉林市丰满区', rating: 4.1, priceLevel: 1, tags: '湖,滑雪,度假', avgDurationMin: 150, openHours: '全天', description: '群山环抱的人工湖。', wiki: '松花湖' },
          { id: 4052, name: '雾凇岛', category: 'nature', lng: 126.4700, lat: 44.0500, address: '吉林市龙潭区乌拉街', rating: 4.3, priceLevel: 1, tags: '雾凇,冬景,奇观', avgDurationMin: 120, openHours: '全天', description: '冬日玉树琼花。', wiki: '雾凇岛' },
          { id: 4053, name: '北山公园', category: 'park', lng: 126.5400, lat: 43.8300, address: '吉林市船营区德胜路', rating: 4.0, priceLevel: 1, tags: '公园,庙会,古迹', avgDurationMin: 90, openHours: '全天', description: '关东庙会胜地。', wiki: '北山公园 (吉林)' }
        ]
      },
      {
        name: '延边', center: [42.9100, 129.5100],
        pois: [
          { id: 4061, name: '长白山(北坡)', category: 'nature', lng: 128.0600, lat: 42.0700, address: '延边州安图县', rating: 4.7, priceLevel: 3, tags: '火山,天池,滑雪', avgDurationMin: 240, openHours: '07:00-16:30', description: '休眠火山与天池。', wiki: '长白山' },
          { id: 4062, name: '延边朝鲜族民俗园', category: 'culture', lng: 129.5100, lat: 42.9100, address: '延边州延吉市', rating: 4.0, priceLevel: 1, tags: '民俗,朝鲜族,美食', avgDurationMin: 90, openHours: '全天', description: '朝鲜族风情体验。', wiki: '延边朝鲜族自治州' },
          { id: 4063, name: '帽儿山', category: 'nature', lng: 129.5600, lat: 42.8800, address: '延边州延吉市', rating: 3.9, priceLevel: 1, tags: '山,公园,徒步', avgDurationMin: 120, openHours: '全天', description: '城郊森林公园。', wiki: '帽儿山 (延吉)' }
        ]
      }
    ]
  },
  {
    name: '黑龙江省',
    cities: [
      {
        name: '哈尔滨', center: [45.8038, 126.5350],
        pois: [
          { id: 1701, name: '中央大街', category: 'shopping', lng: 126.6180, lat: 45.7760, address: '哈尔滨市道里区中央大街', rating: 4.4, priceLevel: 1, tags: '步行街,欧式建筑,冰雪', avgDurationMin: 90, openHours: '全天', description: '百年面包石步行街。', wiki: '中央大街' },
          { id: 1702, name: '圣索菲亚大教堂', category: 'culture', lng: 126.6220, lat: 45.7700, address: '哈尔滨市道里区透笼街', rating: 4.4, priceLevel: 1, tags: '教堂,地标,夜景', avgDurationMin: 60, openHours: '08:30-17:00', description: '远东最大东正教堂，雪花穹顶。', wiki: '圣索菲亚教堂 (哈尔滨)' },
          { id: 1703, name: '冰雪大世界', category: 'night', lng: 126.5500, lat: 45.8000, address: '哈尔滨市松北区', rating: 4.6, priceLevel: 3, tags: '冰雕,冰雪,冬季', avgDurationMin: 180, openHours: '11:00-21:30(冬季)', description: '世界级冰雪主题乐园。', wiki: '哈尔滨冰雪大世界' },
          { id: 1704, name: '松花江', category: 'nature', lng: 126.6300, lat: 45.7900, address: '哈尔滨市松花江', rating: 4.1, priceLevel: 1, tags: '江,冰雪,观光', avgDurationMin: 90, openHours: '全天', description: '冬季冰封可行走的江面。', wiki: '松花江' },
          { id: 1705, name: '太阳岛', category: 'nature', lng: 126.5800, lat: 45.8000, address: '哈尔滨市松北区太阳岛', rating: 4.2, priceLevel: 2, tags: '岛,雪博会,湿地', avgDurationMin: 150, openHours: '08:30-17:00', description: '松花江北岸的避暑胜地。', wiki: '太阳岛 (哈尔滨)' },
          { id: 1706, name: '老道外', category: 'culture', lng: 126.6500, lat: 45.7700, address: '哈尔滨市道外区', rating: 4.0, priceLevel: 1, tags: '中华巴洛克,老街,美食', avgDurationMin: 90, openHours: '全天', description: '中华巴洛克建筑群老街区。', wiki: '老道外' }
        ]
      },
      {
        name: '牡丹江', center: [44.5510, 129.6330],
        pois: [
          { id: 4071, name: '中国雪乡', category: 'nature', lng: 128.8900, lat: 44.4300, address: '牡丹江市海林市双峰林场', rating: 4.5, priceLevel: 2, tags: '雪乡,冰雪,冬季', avgDurationMin: 180, openHours: '全天(冬季)', description: '童话般的雪景村落。', wiki: '中国雪乡' },
          { id: 4072, name: '镜泊湖', category: 'nature', lng: 128.9400, lat: 43.8800, address: '牡丹江市宁安市', rating: 4.3, priceLevel: 2, tags: '湖,瀑布,火山', avgDurationMin: 180, openHours: '08:00-17:00', description: '高山堰塞湖。', wiki: '镜泊湖' },
          { id: 4073, name: '吊水楼瀑布', category: 'nature', lng: 128.9500, lat: 43.8700, address: '牡丹江市宁安市镜泊湖', rating: 4.1, priceLevel: 1, tags: '瀑布,湖,奇观', avgDurationMin: 90, openHours: '08:00-17:00', description: '镜泊湖瀑布奇观。', wiki: '吊水楼瀑布' }
        ]
      }
    ]
  },
  {
    name: '江苏省',
    cities: [
      {
        name: '南京', center: [32.0603, 118.7969],
        pois: [
          { id: 1001, name: '中山陵', category: 'culture', lng: 118.8560, lat: 32.0630, address: '南京市玄武区紫金山', rating: 4.7, priceLevel: 1, tags: '陵墓,民国,登山', avgDurationMin: 120, openHours: '08:30-17:00', description: '孙中山先生陵寝，气势恢宏。', wiki: '中山陵' },
          { id: 1002, name: '夫子庙', category: 'culture', lng: 118.7900, lat: 32.0430, address: '南京市秦淮区夫子庙', rating: 4.4, priceLevel: 2, tags: '古街,小吃,秦淮河', avgDurationMin: 90, openHours: '全天', description: '秦淮风光带核心，桨声灯影。', wiki: '夫子庙' },
          { id: 1003, name: '玄武湖', category: 'nature', lng: 118.7980, lat: 32.0650, address: '南京市玄武区玄武巷', rating: 4.5, priceLevel: 1, tags: '湖,划船,散步', avgDurationMin: 120, openHours: '06:00-21:00', description: '六朝皇家园林湖泊，城墙环抱。', wiki: '玄武湖' },
          { id: 1004, name: '南京博物院', category: 'culture', lng: 118.8500, lat: 32.0400, address: '南京市玄武区中山东路', rating: 4.6, priceLevel: 1, tags: '博物馆,历史,文创', avgDurationMin: 150, openHours: '09:00-17:00', description: '中国三大博物馆之一。', wiki: '南京博物院' },
          { id: 1005, name: '明孝陵', category: 'culture', lng: 118.8480, lat: 32.0490, address: '南京市玄武区紫金山', rating: 4.5, priceLevel: 2, tags: '明陵,古迹,石像路', avgDurationMin: 120, openHours: '06:30-18:00', description: '明太祖朱元璋陵，石像生大道。', wiki: '明孝陵' },
          { id: 1006, name: '侵华日军南京大屠杀遇难同胞纪念馆', category: 'culture', lng: 118.7300, lat: 32.0350, address: '南京市建邺区水西门大街', rating: 4.7, priceLevel: 1, tags: '历史,纪念馆,教育', avgDurationMin: 120, openHours: '08:30-16:30(周一闭馆)', description: '铭记历史的庄严场馆。', wiki: '侵华日军南京大屠杀遇难同胞纪念馆' }
        ]
      },
      {
        name: '苏州', center: [31.2989, 120.5853],
        pois: [
          { id: 1101, name: '拙政园', category: 'culture', lng: 120.6270, lat: 31.3250, address: '苏州市姑苏区东北街', rating: 4.6, priceLevel: 2, tags: '园林,世界遗产,古典', avgDurationMin: 90, openHours: '07:30-17:30', description: '中国四大名园之首。', wiki: '拙政园' },
          { id: 1102, name: '苏州博物馆', category: 'culture', lng: 120.6250, lat: 31.3230, address: '苏州市姑苏区东北街', rating: 4.7, priceLevel: 1, tags: '博物馆,贝聿铭,建筑', avgDurationMin: 90, openHours: '09:00-17:00', description: '贝聿铭设计的现代中式建筑。', wiki: '苏州博物馆' },
          { id: 1103, name: '平江路', category: 'culture', lng: 120.6340, lat: 31.3170, address: '苏州市姑苏区平江路', rating: 4.4, priceLevel: 2, tags: '古街,小吃,水巷', avgDurationMin: 90, openHours: '全天', description: '保持水城原貌的历史老街。', wiki: '平江路' },
          { id: 1104, name: '虎丘', category: 'culture', lng: 120.5890, lat: 31.3330, address: '苏州市姑苏区虎丘山', rating: 4.4, priceLevel: 2, tags: '古塔,园林,古迹', avgDurationMin: 90, openHours: '07:30-17:30', description: '吴中第一名胜，云岩寺塔。', wiki: '虎丘' },
          { id: 1105, name: '狮子林', category: 'culture', lng: 120.6300, lat: 31.3230, address: '苏州市姑苏区园林路', rating: 4.3, priceLevel: 2, tags: '园林,假山,古典', avgDurationMin: 60, openHours: '07:30-17:30', description: '以叠石假山闻名的古典园林。', wiki: '狮子林' },
          { id: 1106, name: '山塘街', category: 'culture', lng: 120.5950, lat: 31.3140, address: '苏州市姑苏区山塘街', rating: 4.2, priceLevel: 2, tags: '古街,夜景,小吃', avgDurationMin: 90, openHours: '全天', description: '七里山塘，水巷夜色。', wiki: '山塘街' }
        ]
      },
      {
        name: '无锡', center: [31.4912, 120.3119],
        pois: [
          { id: 3501, name: '鼋头渚', category: 'nature', lng: 120.2200, lat: 31.5200, address: '无锡市滨湖区鼋头渚', rating: 4.5, priceLevel: 2, tags: '太湖,樱花,湖景', avgDurationMin: 150, openHours: '08:00-17:30', description: '太湖第一名胜，春日樱花。', wiki: '鼋头渚' },
          { id: 3502, name: '灵山大佛', category: 'culture', lng: 120.0800, lat: 31.4200, address: '无锡市滨湖区马山', rating: 4.5, priceLevel: 3, tags: '大佛,佛教,景区', avgDurationMin: 180, openHours: '07:00-17:30', description: '88米青铜释迦立像。', wiki: '灵山大佛' },
          { id: 3503, name: '拈花湾', category: 'night', lng: 120.0800, lat: 31.4300, address: '无锡市滨湖区马山', rating: 4.2, priceLevel: 3, tags: '禅意,小镇,夜景', avgDurationMin: 150, openHours: '09:00-21:00', description: '唐风禅意小镇，夜景灯光。', wiki: '拈花湾' },
          { id: 3504, name: '惠山古镇', category: 'culture', lng: 120.2800, lat: 31.5800, address: '无锡市梁溪区惠山', rating: 4.1, priceLevel: 2, tags: '古镇,小吃,祠堂', avgDurationMin: 120, openHours: '全天', description: '祠堂群与惠山泥人。', wiki: '惠山古镇' },
          { id: 3505, name: '太湖', category: 'nature', lng: 120.2000, lat: 31.3000, address: '无锡市太湖', rating: 4.2, priceLevel: 1, tags: '湖,风光,度假', avgDurationMin: 150, openHours: '全天', description: '烟波浩渺的太湖风光。', wiki: '太湖' },
          { id: 3506, name: '南禅寺', category: 'night', lng: 120.3000, lat: 31.5700, address: '无锡市梁溪区', rating: 3.9, priceLevel: 1, tags: '寺庙,古街,夜市', avgDurationMin: 60, openHours: '全天', description: '古刹与南长街夜市。', wiki: '南禅寺 (无锡)' }
        ]
      },
      {
        name: '扬州', center: [32.3940, 119.4120],
        pois: [
          { id: 4081, name: '瘦西湖', category: 'culture', lng: 119.4070, lat: 32.4100, address: '扬州市邗江区大虹桥路', rating: 4.6, priceLevel: 2, tags: '园林,湖,世界遗产', avgDurationMin: 150, openHours: '07:00-17:30', description: '二十四桥明月夜。', wiki: '瘦西湖' },
          { id: 4082, name: '个园', category: 'culture', lng: 119.4200, lat: 32.4000, address: '扬州市广陵区盐阜东路', rating: 4.3, priceLevel: 2, tags: '园林,竹,古典', avgDurationMin: 90, openHours: '07:30-17:00', description: '四季假山名园。', wiki: '个园' },
          { id: 4083, name: '东关街', category: 'culture', lng: 119.4350, lat: 32.3960, address: '扬州市广陵区东关街', rating: 4.1, priceLevel: 1, tags: '古街,小吃,老字号', avgDurationMin: 90, openHours: '全天', description: '扬州历史老街。', wiki: '东关街' }
        ]
      }
    ]
  },
  {
    name: '浙江省',
    cities: [
      {
        name: '杭州', center: [30.2741, 120.1551],
        pois: [
          { id: 101, name: '西湖', category: 'nature', lng: 120.1480, lat: 30.2590, address: '杭州市西湖区龙井路1号', rating: 4.8, priceLevel: 1, tags: '湖,风景,散步,骑行', avgDurationMin: 90, openHours: '全天', description: '世界文化遗产，城市绿芯，可步行或骑行环湖。', wiki: '西湖' },
          { id: 102, name: '灵隐寺', category: 'culture', lng: 120.1010, lat: 30.2410, address: '杭州市西湖区法云弄1号', rating: 4.7, priceLevel: 2, tags: '寺庙,古迹,祈福', avgDurationMin: 90, openHours: '07:00-18:00', description: '千年古刹，背靠北高峰，禅意浓厚。', wiki: '灵隐寺' },
          { id: 103, name: '河坊街', category: 'food', lng: 120.1690, lat: 30.2440, address: '杭州市上城区河坊街', rating: 4.5, priceLevel: 2, tags: '小吃,古街,夜市', avgDurationMin: 60, openHours: '全天', description: '南宋御街旁的老字号小吃集中地。', wiki: '河坊街' },
          { id: 104, name: '西溪湿地', category: 'nature', lng: 120.0630, lat: 30.2680, address: '杭州市西湖区天目山路518号', rating: 4.6, priceLevel: 2, tags: '湿地,生态,船游', avgDurationMin: 120, openHours: '08:00-17:30', description: '城市湿地国家公园，秋冬芦花飞雪。', wiki: '西溪湿地' },
          { id: 105, name: '杭州植物园', category: 'park', lng: 120.1260, lat: 30.2620, address: '杭州市西湖区桃源岭1号', rating: 4.4, priceLevel: 1, tags: '植物,亲子,漫步', avgDurationMin: 90, openHours: '08:30-16:30', description: '草木葱茏，适合慢节奏散步。', wiki: '杭州植物园' },
          { id: 106, name: '南宋御街', category: 'culture', lng: 120.1700, lat: 30.2450, address: '杭州市上城区中山中路', rating: 4.3, priceLevel: 2, tags: '历史,步行街,文创', avgDurationMin: 60, openHours: '全天', description: '千年御道，串联老字号与文创小店。', wiki: '中山南路 (杭州)' }
        ]
      },
      {
        name: '宁波', center: [29.8683, 121.5440],
        pois: [
          { id: 3401, name: '天一阁', category: 'culture', lng: 121.5500, lat: 29.8700, address: '宁波市海曙区天一街', rating: 4.4, priceLevel: 2, tags: '藏书楼,古迹,园林', avgDurationMin: 90, openHours: '08:30-17:30', description: '亚洲现存最古的私家藏书楼。', wiki: '天一阁' },
          { id: 3402, name: '东钱湖', category: 'nature', lng: 121.6300, lat: 29.7900, address: '宁波市鄞州区', rating: 4.1, priceLevel: 1, tags: '湖,骑行,度假', avgDurationMin: 150, openHours: '全天', description: '浙东最大的淡水湖。', wiki: '东钱湖' },
          { id: 3403, name: '老外滩', category: 'night', lng: 121.5600, lat: 29.8700, address: '宁波市江北区外滩', rating: 4.1, priceLevel: 2, tags: '酒吧,欧式,夜景', avgDurationMin: 90, openHours: '全天', description: '开埠老外滩的夜生活。', wiki: '老外滩 (宁波)' },
          { id: 3404, name: '溪口', category: 'culture', lng: 121.2800, lat: 29.6600, address: '宁波市奉化区', rating: 4.0, priceLevel: 2, tags: '蒋氏,古镇,山', avgDurationMin: 180, openHours: '08:00-17:00', description: '蒋氏故里与雪窦山。', wiki: '溪口镇' },
          { id: 3405, name: '南塘老街', category: 'food', lng: 121.5500, lat: 29.8600, address: '宁波市海曙区南塘街', rating: 3.9, priceLevel: 2, tags: '古街,小吃,老字号', avgDurationMin: 60, openHours: '全天', description: '甬城老字号美食街。', wiki: '南塘老街' },
          { id: 3406, name: '三江口', category: 'night', lng: 121.5500, lat: 29.8700, address: '宁波市海曙区三江口', rating: 3.9, priceLevel: 1, tags: '江,夜景,地标', avgDurationMin: 60, openHours: '全天', description: '三江汇流的城市客厅夜景。', wiki: '三江口 (宁波)' }
        ]
      },
      {
        name: '绍兴', center: [30.0010, 120.5820],
        pois: [
          { id: 4091, name: '鲁迅故里', category: 'culture', lng: 120.5860, lat: 30.0030, address: '绍兴市越城区鲁迅中路', rating: 4.5, priceLevel: 1, tags: '故居,水乡,文化', avgDurationMin: 120, openHours: '08:30-17:00', description: '鲁迅笔下的故土风情。', wiki: '鲁迅故里' },
          { id: 4092, name: '沈园', category: 'culture', lng: 120.5900, lat: 30.0000, address: '绍兴市越城区鲁迅中路', rating: 4.2, priceLevel: 2, tags: '园林,陆游,爱情', avgDurationMin: 60, openHours: '08:00-17:00', description: '宋代名园，钗头凤题壁。', wiki: '沈园' },
          { id: 4093, name: '东湖(绍兴)', category: 'nature', lng: 120.6000, lat: 30.0200, address: '绍兴市越城区东湖', rating: 4.0, priceLevel: 2, tags: '湖,崖壁,乌篷船', avgDurationMin: 90, openHours: '07:30-17:00', description: '人工开凿的崖壁湖景。', wiki: '东湖 (绍兴)' }
        ]
      }
    ]
  },
  {
    name: '安徽省',
    cities: [
      {
        name: '合肥', center: [31.8206, 117.2272],
        pois: [
          { id: 2401, name: '包公园', category: 'culture', lng: 117.2800, lat: 31.8500, address: '合肥市包河区芜湖路', rating: 4.2, priceLevel: 1, tags: '包拯,古迹,园林', avgDurationMin: 90, openHours: '08:00-18:00', description: '包公祠与包河秀色。', wiki: '包公园' },
          { id: 2402, name: '巢湖', category: 'nature', lng: 117.4000, lat: 31.5000, address: '合肥市巢湖市', rating: 4.0, priceLevel: 1, tags: '湖,姥山岛,度假', avgDurationMin: 180, openHours: '全天', description: '中国五大淡水湖之一。', wiki: '巢湖' },
          { id: 2403, name: '三河古镇', category: 'culture', lng: 117.2200, lat: 31.5000, address: '合肥市肥西县', rating: 4.1, priceLevel: 1, tags: '古镇,小吃,水乡', avgDurationMin: 120, openHours: '全天', description: '巢湖之滨的水乡古镇。', wiki: '三河古镇' },
          { id: 2404, name: '安徽博物院', category: 'culture', lng: 117.2800, lat: 31.8900, address: '合肥市蜀山区怀宁路', rating: 4.0, priceLevel: 1, tags: '博物馆,徽文化,青铜', avgDurationMin: 120, openHours: '09:00-17:00', description: '楚大鼎与徽州古建陈列。', wiki: '安徽博物院' },
          { id: 2405, name: '天鹅湖', category: 'night', lng: 117.2200, lat: 31.8200, address: '合肥市蜀山区', rating: 3.9, priceLevel: 1, tags: '湖,夜景,散步', avgDurationMin: 60, openHours: '全天', description: '政务区城市景观湖。', wiki: '天鹅湖 (合肥)' },
          { id: 2406, name: '罍街', category: 'food', lng: 117.3000, lat: 31.8400, address: '合肥市包河区', rating: 4.0, priceLevel: 2, tags: '小吃,夜市,徽菜', avgDurationMin: 60, openHours: '全天', description: '徽味小吃与夜市集合地。', wiki: '罍街' }
        ]
      },
      {
        name: '黄山', center: [29.7150, 118.3400],
        pois: [
          { id: 4101, name: '黄山风景区', category: 'nature', lng: 118.1700, lat: 30.1300, address: '黄山市黄山区', rating: 4.8, priceLevel: 3, tags: '山,云海,奇松怪石', avgDurationMin: 240, openHours: '06:30-16:30', description: '奇松怪石云海温泉。', wiki: '黄山' },
          { id: 4102, name: '宏村', category: 'culture', lng: 117.9800, lat: 30.0300, address: '黄山市黟县宏村镇', rating: 4.6, priceLevel: 2, tags: '古村,徽派,世界遗产', avgDurationMin: 150, openHours: '07:30-17:30', description: '画里乡村，徽派民居。', wiki: '宏村' },
          { id: 4103, name: '西递', category: 'culture', lng: 117.9500, lat: 30.1000, address: '黄山市黟县西递镇', rating: 4.4, priceLevel: 2, tags: '古村,徽派,牌坊', avgDurationMin: 120, openHours: '07:30-17:30', description: '桃花源里人家。', wiki: '西递' },
          { id: 4104, name: '屯溪老街', category: 'culture', lng: 118.3100, lat: 29.7100, address: '黄山市屯溪区老街', rating: 4.1, priceLevel: 1, tags: '古街,徽商,小吃', avgDurationMin: 60, openHours: '全天', description: '流动的清明上河图。', wiki: '屯溪老街' }
        ]
      }
    ]
  },
  {
    name: '福建省',
    cities: [
      {
        name: '福州', center: [26.0745, 119.2965],
        pois: [
          { id: 2201, name: '三坊七巷', category: 'culture', lng: 119.2900, lat: 26.0800, address: '福州市鼓楼区三坊七巷', rating: 4.4, priceLevel: 1, tags: '古街,名人,小吃', avgDurationMin: 120, openHours: '全天', description: '明清里坊制度的活化石。', wiki: '三坊七巷' },
          { id: 2202, name: '鼓山', category: 'nature', lng: 119.3700, lat: 26.0700, address: '福州市晋安区鼓山', rating: 4.2, priceLevel: 1, tags: '山,涌泉寺,摩崖', avgDurationMin: 150, openHours: '全天', description: '闽都名山，千年涌泉寺。', wiki: '鼓山' },
          { id: 2203, name: '福州西湖公园', category: 'park', lng: 119.2900, lat: 26.0900, address: '福州市鼓楼区湖滨路', rating: 4.0, priceLevel: 1, tags: '公园,湖,散步', avgDurationMin: 90, openHours: '全天', description: '八闽首府的古典园林湖。', wiki: '福州西湖' },
          { id: 2204, name: '平潭', category: 'nature', lng: 119.7900, lat: 25.5000, address: '福州市平潭县', rating: 4.3, priceLevel: 1, tags: '海岛,蓝眼泪,风车', avgDurationMin: 180, openHours: '全天', description: '离台湾最近的海岛，追蓝眼泪。', wiki: '平潭县' },
          { id: 2205, name: '上下杭', category: 'culture', lng: 119.3000, lat: 26.0600, address: '福州市台江区', rating: 4.0, priceLevel: 2, tags: '古街,商贸,小吃', avgDurationMin: 90, openHours: '全天', description: '闽商发祥地的历史街区。', wiki: '上下杭' },
          { id: 2206, name: '马尾船政', category: 'culture', lng: 119.4500, lat: 26.0300, address: '福州市马尾区', rating: 3.9, priceLevel: 2, tags: '船政,博物馆,近代', avgDurationMin: 90, openHours: '08:30-17:00', description: '中国近代海军与船政摇篮。', wiki: '马尾船政' }
        ]
      },
      {
        name: '厦门', center: [24.4798, 118.0894],
        pois: [
          { id: 1401, name: '鼓浪屿', category: 'nature', lng: 118.0730, lat: 24.4470, address: '厦门市思明区鼓浪屿', rating: 4.6, priceLevel: 2, tags: '海岛,万国建筑,钢琴', avgDurationMin: 240, openHours: '全天(船运)', description: '世界文化遗产钢琴之岛。', wiki: '鼓浪屿' },
          { id: 1402, name: '厦门大学', category: 'culture', lng: 118.0970, lat: 24.4380, address: '厦门市思明区思明南路', rating: 4.5, priceLevel: 1, tags: '校园,芙蓉湖,建筑', avgDurationMin: 90, openHours: '限流预约', description: '面朝大海的最美大学之一。', wiki: '厦门大学' },
          { id: 1403, name: '曾厝垵', category: 'food', lng: 118.1200, lat: 24.4300, address: '厦门市思明区曾厝垵', rating: 4.0, priceLevel: 2, tags: '文创,小吃,民宿', avgDurationMin: 90, openHours: '全天', description: '文艺渔村改造的文创小吃村。', wiki: '曾厝垵' },
          { id: 1404, name: '南普陀寺', category: 'culture', lng: 118.0950, lat: 24.4350, address: '厦门市思明区思明南路', rating: 4.5, priceLevel: 1, tags: '寺庙,祈福,素斋', avgDurationMin: 60, openHours: '08:00-17:00', description: '闽南名刹，素斋闻名。', wiki: '南普陀寺' },
          { id: 1405, name: '环岛路', category: 'nature', lng: 118.1300, lat: 24.4500, address: '厦门市思明区环岛路', rating: 4.3, priceLevel: 1, tags: '海滨,骑行,风景', avgDurationMin: 120, openHours: '全天', description: '最美海滨骑行道。', wiki: '环岛路' },
          { id: 1406, name: '胡里山炮台', category: 'culture', lng: 118.1100, lat: 24.4260, address: '厦门市思明区曾厝垵路', rating: 4.1, priceLevel: 2, tags: '炮台,古迹,海景', avgDurationMin: 60, openHours: '08:00-17:30', description: '清代海岸炮台，巨炮遗存。', wiki: '胡里山炮台' }
        ]
      },
      {
        name: '泉州', center: [24.8740, 118.6750],
        pois: [
          { id: 4111, name: '开元寺', category: 'culture', lng: 118.6750, lat: 24.9070, address: '泉州市鲤城区西街', rating: 4.5, priceLevel: 1, tags: '古寺,双塔,世界遗产', avgDurationMin: 90, openHours: '06:30-17:30', description: '闽南第一古刹，东西双塔。', wiki: '开元寺 (泉州)' },
          { id: 4112, name: '清源山', category: 'nature', lng: 118.6500, lat: 24.9400, address: '泉州市丰泽区清源山', rating: 4.3, priceLevel: 2, tags: '山,老君岩,道教', avgDurationMin: 150, openHours: '07:00-17:30', description: '道教名山，老君造像。', wiki: '清源山' },
          { id: 4113, name: '西街', category: 'culture', lng: 118.6750, lat: 24.9050, address: '泉州市鲤城区西街', rating: 4.1, priceLevel: 1, tags: '古街,小吃,夜市', avgDurationMin: 60, openHours: '全天', description: '千年古街，红砖古厝。', wiki: '泉州西街' }
        ]
      }
    ]
  },
  {
    name: '江西省',
    cities: [
      {
        name: '南昌', center: [28.6820, 115.8570],
        pois: [
          { id: 4121, name: '滕王阁', category: 'culture', lng: 115.8800, lat: 28.6860, address: '南昌市东湖区榕门路', rating: 4.4, priceLevel: 2, tags: '名楼,古迹,赣江', avgDurationMin: 90, openHours: '07:30-17:30', description: '江南三大名楼之一。', wiki: '滕王阁' },
          { id: 4122, name: '八一起义纪念馆', category: 'culture', lng: 115.9000, lat: 28.6800, address: '南昌市西湖区中山路', rating: 4.3, priceLevel: 1, tags: '红色,革命,纪念馆', avgDurationMin: 90, openHours: '09:00-17:00(周一闭馆)', description: '军旗升起的地方。', wiki: '南昌八一起义纪念馆' },
          { id: 4123, name: '秋水广场', category: 'night', lng: 115.8700, lat: 28.6800, address: '南昌市红谷滩新区', rating: 4.0, priceLevel: 1, tags: '广场,喷泉,夜景', avgDurationMin: 60, openHours: '全天', description: '赣江之滨音乐喷泉。', wiki: '秋水广场' }
        ]
      },
      {
        name: '九江', center: [29.7170, 115.9920],
        pois: [
          { id: 4131, name: '庐山', category: 'nature', lng: 115.9700, lat: 29.5500, address: '九江市庐山市', rating: 4.5, priceLevel: 3, tags: '山,避暑,云海', avgDurationMin: 240, openHours: '全天', description: '匡庐奇秀甲天下。', wiki: '庐山' },
          { id: 4132, name: '鄱阳湖', category: 'nature', lng: 116.0800, lat: 29.1500, address: '九江市永修县', rating: 4.2, priceLevel: 1, tags: '湖,候鸟,湿地', avgDurationMin: 150, openHours: '全天', description: '中国最大淡水湖。', wiki: '鄱阳湖' },
          { id: 4133, name: '浔阳楼', category: 'culture', lng: 115.9900, lat: 29.7300, address: '九江市浔阳区长江边', rating: 3.9, priceLevel: 1, tags: '名楼,江,古迹', avgDurationMin: 60, openHours: '08:00-17:30', description: '水浒浔阳楼。', wiki: '浔阳楼' }
        ]
      }
    ]
  },
  {
    name: '山东省',
    cities: [
      {
        name: '济南', center: [36.6512, 117.1201],
        pois: [
          { id: 2301, name: '趵突泉', category: 'nature', lng: 117.0100, lat: 36.6600, address: '济南市历下区趵突泉南路', rating: 4.4, priceLevel: 2, tags: '泉,园林,老舍', avgDurationMin: 60, openHours: '07:00-19:00', description: '天下第一泉，三股水涌。', wiki: '趵突泉' },
          { id: 2302, name: '大明湖', category: 'nature', lng: 117.0200, lat: 36.6700, address: '济南市历下区大明湖路', rating: 4.3, priceLevel: 1, tags: '湖,夏雨荷,散步', avgDurationMin: 120, openHours: '全天', description: '四面荷花三面柳的城湖。', wiki: '大明湖' },
          { id: 2303, name: '千佛山', category: 'nature', lng: 117.0300, lat: 36.6400, address: '济南市历下区经十一路', rating: 4.1, priceLevel: 2, tags: '山,佛像,登山', avgDurationMin: 120, openHours: '06:30-18:00', description: '城南屏障，摩崖石刻。', wiki: '千佛山' },
          { id: 2304, name: '泉城广场', category: 'night', lng: 117.0100, lat: 36.6600, address: '济南市历下区泉城广场', rating: 4.0, priceLevel: 1, tags: '广场,地标,夜景', avgDurationMin: 60, openHours: '全天', description: '济南城市客厅与音乐喷泉。', wiki: '泉城广场' },
          { id: 2305, name: '五龙潭', category: 'park', lng: 117.0000, lat: 36.6600, address: '济南市天桥区', rating: 3.9, priceLevel: 1, tags: '泉,公园,潭', avgDurationMin: 60, openHours: '07:00-19:00', description: '清泉碧潭的城中公园。', wiki: '五龙潭公园' },
          { id: 2306, name: '山东博物馆', category: 'culture', lng: 117.0900, lat: 36.6600, address: '济南市历下区经十路', rating: 4.0, priceLevel: 1, tags: '博物馆,历史,青铜', avgDurationMin: 120, openHours: '09:00-17:00', description: '齐鲁文明与青铜器大馆。', wiki: '山东博物馆' }
        ]
      },
      {
        name: '青岛', center: [36.0671, 120.3826],
        pois: [
          { id: 1301, name: '栈桥', category: 'culture', lng: 120.3200, lat: 36.0550, address: '青岛市南区太平路', rating: 4.4, priceLevel: 1, tags: '地标,海,观光', avgDurationMin: 60, openHours: '全天', description: '青岛城市符号，伸入海湾。', wiki: '栈桥' },
          { id: 1302, name: '八大关', category: 'nature', lng: 120.3500, lat: 36.0530, address: '青岛市南区八大关', rating: 4.5, priceLevel: 1, tags: '别墅,花石楼,散步', avgDurationMin: 120, openHours: '全天', description: '万国建筑与林荫小道。', wiki: '八大关' },
          { id: 1303, name: '崂山', category: 'nature', lng: 120.6400, lat: 36.1600, address: '青岛市崂山区', rating: 4.5, priceLevel: 3, tags: '山,道教,海', avgDurationMin: 240, openHours: '07:00-17:00', description: '海上名山，道教圣地。', wiki: '崂山' },
          { id: 1304, name: '五四广场', category: 'night', lng: 120.3840, lat: 36.0620, address: '青岛市南区东海西路', rating: 4.3, priceLevel: 1, tags: '地标,夜景,雕塑', avgDurationMin: 60, openHours: '全天', description: '红色火炬雕塑，滨海夜景。', wiki: '五四广场' },
          { id: 1305, name: '青岛啤酒博物馆', category: 'culture', lng: 120.3600, lat: 36.0700, address: '青岛市北区登州路', rating: 4.2, priceLevel: 2, tags: '啤酒,博物馆,工业游', avgDurationMin: 90, openHours: '08:30-17:00', description: '百年啤酒厂里的工业旅游。', wiki: '青岛啤酒博物馆' },
          { id: 1306, name: '金沙滩', category: 'nature', lng: 120.2700, lat: 35.9700, address: '青岛市黄岛区金沙滩', rating: 4.3, priceLevel: 1, tags: '海滩,戏水,度假', avgDurationMin: 120, openHours: '全天', description: '细软沙滩，夏日戏水胜地。', wiki: '金沙滩 (青岛)' }
        ]
      },
      {
        name: '泰安', center: [36.2010, 117.0780],
        pois: [
          { id: 4141, name: '泰山', category: 'nature', lng: 117.1020, lat: 36.2530, address: '泰安市泰山区红门路', rating: 4.8, priceLevel: 3, tags: '五岳,日出,登山', avgDurationMin: 240, openHours: '全天', description: '五岳之首，天下第一山。', wiki: '泰山' },
          { id: 4142, name: '岱庙', category: 'culture', lng: 117.1300, lat: 36.1980, address: '泰安市泰山区东岳大街', rating: 4.3, priceLevel: 2, tags: '古庙,帝王,古迹', avgDurationMin: 90, openHours: '07:30-17:30', description: '泰山脚下历代帝王封禅之所。', wiki: '岱庙' }
        ]
      }
    ]
  },
  {
    name: '河南省',
    cities: [
      {
        name: '郑州', center: [34.7466, 113.6253],
        pois: [
          { id: 2501, name: '少林寺', category: 'culture', lng: 112.9400, lat: 34.5100, address: '郑州市登封市嵩山', rating: 4.5, priceLevel: 3, tags: '少林,武术,古迹', avgDurationMin: 180, openHours: '07:30-18:00', description: '天下第一名刹与少林功夫。', wiki: '少林寺' },
          { id: 2502, name: '河南博物院', category: 'culture', lng: 113.5300, lat: 34.8200, address: '郑州市金水区农业路', rating: 4.6, priceLevel: 1, tags: '博物馆,中原,青铜', avgDurationMin: 150, openHours: '09:00-17:00', description: '贾湖骨笛与中原文明。', wiki: '河南博物院' },
          { id: 2503, name: '二七纪念塔', category: 'night', lng: 113.6300, lat: 34.7500, address: '郑州市二七区二七广场', rating: 4.0, priceLevel: 1, tags: '地标,纪念塔,夜景', avgDurationMin: 60, openHours: '全天', description: '郑州城市地标双塔。', wiki: '二七纪念塔' },
          { id: 2504, name: '黄河风景名胜区', category: 'nature', lng: 113.5500, lat: 34.9200, address: '郑州市惠济区', rating: 4.0, priceLevel: 2, tags: '黄河,母亲河,观光', avgDurationMin: 150, openHours: '08:00-18:00', description: '临河观母亲河的壮阔。', wiki: '郑州黄河文化公园' },
          { id: 2505, name: '嵩山', category: 'nature', lng: 112.9400, lat: 34.4900, address: '郑州市登封市', rating: 4.2, priceLevel: 2, tags: '山,少林,地质', avgDurationMin: 240, openHours: '07:30-17:30', description: '五岳之中岳，地质公园。', wiki: '嵩山' },
          { id: 2506, name: '郑州商城遗址', category: 'culture', lng: 113.6500, lat: 34.7500, address: '郑州市管城区', rating: 3.8, priceLevel: 1, tags: '遗址,商代,城墙', avgDurationMin: 60, openHours: '全天', description: '3600年前的商代都邑城墙。', wiki: '郑州商城' }
        ]
      },
      {
        name: '洛阳', center: [34.6190, 112.4540],
        pois: [
          { id: 4151, name: '龙门石窟', category: 'culture', lng: 112.4700, lat: 34.5620, address: '洛阳市洛龙区龙门镇', rating: 4.7, priceLevel: 3, tags: '石窟,世界遗产,佛教', avgDurationMin: 180, openHours: '08:00-18:00', description: '北魏石刻艺术宝库。', wiki: '龙门石窟' },
          { id: 4152, name: '白马寺', category: 'culture', lng: 112.6000, lat: 34.7200, address: '洛阳市洛龙区白马寺镇', rating: 4.4, priceLevel: 2, tags: '寺庙,佛教祖庭,古迹', avgDurationMin: 90, openHours: '07:30-17:30', description: '中国第一古刹。', wiki: '白马寺' },
          { id: 4153, name: '老君山', category: 'nature', lng: 111.7300, lat: 33.7800, address: '洛阳市栾川县', rating: 4.6, priceLevel: 3, tags: '山,道教,金顶', avgDurationMin: 240, openHours: '全天', description: '云端金顶，道教圣地。', wiki: '老君山' },
          { id: 4154, name: '王城公园', category: 'park', lng: 112.4400, lat: 34.6300, address: '洛阳市西工区中州中路', rating: 4.2, priceLevel: 2, tags: '公园,牡丹,赏花', avgDurationMin: 90, openHours: '06:00-22:00', description: '洛阳牡丹花会主会场。', wiki: '王城公园' }
        ]
      }
    ]
  },
  {
    name: '湖北省',
    cities: [
      {
        name: '武汉', center: [30.5928, 114.3055],
        pois: [
          { id: 901, name: '黄鹤楼', category: 'culture', lng: 114.3060, lat: 30.5460, address: '武汉市武昌区蛇山西坡', rating: 4.6, priceLevel: 2, tags: '名楼,古迹,江景', avgDurationMin: 90, openHours: '08:00-18:00', description: '江南三大名楼之首，俯瞰长江。', wiki: '黄鹤楼' },
          { id: 902, name: '东湖', category: 'nature', lng: 114.3900, lat: 30.5600, address: '武汉市武昌区东湖路', rating: 4.5, priceLevel: 1, tags: '湖,骑行,绿道', avgDurationMin: 150, openHours: '全天', description: '中国最大城中湖，百公里绿道。', wiki: '东湖 (武汉)' },
          { id: 903, name: '户部巷', category: 'food', lng: 114.3080, lat: 30.5520, address: '武汉市武昌区自由路', rating: 4.2, priceLevel: 2, tags: '小吃,夜市,美食', avgDurationMin: 60, openHours: '全天', description: '武汉早点与小吃第一街。', wiki: '户部巷' },
          { id: 904, name: '武汉大学', category: 'culture', lng: 114.3670, lat: 30.5380, address: '武汉市武昌区八一路', rating: 4.7, priceLevel: 1, tags: '樱花,校园,春游', avgDurationMin: 90, openHours: '樱花季限流', description: '樱花烂漫的百年学府。', wiki: '武汉大学' },
          { id: 905, name: '江汉路步行街', category: 'shopping', lng: 114.2900, lat: 30.5860, address: '武汉市江汉区江汉路', rating: 4.2, priceLevel: 2, tags: '步行街,购物,老建筑', avgDurationMin: 60, openHours: '全天', description: '百年商业街，万国建筑荟萃。', wiki: '江汉路' },
          { id: 906, name: '湖北省博物馆', category: 'culture', lng: 114.3680, lat: 30.5600, address: '武汉市武昌区东湖路', rating: 4.6, priceLevel: 1, tags: '博物馆,编钟,历史', avgDurationMin: 120, openHours: '09:00-17:00', description: '曾侯乙编钟出土地，荆楚文明殿堂。', wiki: '湖北省博物馆' }
        ]
      },
      {
        name: '宜昌', center: [30.6910, 111.2860],
        pois: [
          { id: 4161, name: '三峡大坝', category: 'culture', lng: 111.0040, lat: 30.8280, address: '宜昌市夷陵区三斗坪', rating: 4.4, priceLevel: 1, tags: '大坝,工程,观光', avgDurationMin: 150, openHours: '08:00-17:00', description: '世界最大水利枢纽。', wiki: '三峡大坝' },
          { id: 4162, name: '三峡人家', category: 'nature', lng: 111.2000, lat: 30.8500, address: '宜昌市夷陵区', rating: 4.3, priceLevel: 2, tags: '峡谷,民俗,江', avgDurationMin: 180, openHours: '08:00-17:30', description: '巴楚风情画廊。', wiki: '三峡人家' },
          { id: 4163, name: '清江画廊', category: 'nature', lng: 111.1000, lat: 30.5000, address: '宜昌市长阳土家族自治县', rating: 4.2, priceLevel: 2, tags: '江,山水,船游', avgDurationMin: 150, openHours: '08:00-17:00', description: '八百里清江如画。', wiki: '清江画廊' }
        ]
      }
    ]
  },
  {
    name: '湖南省',
    cities: [
      {
        name: '长沙', center: [28.2282, 112.9388],
        pois: [
          { id: 1601, name: '岳麓山', category: 'nature', lng: 112.9400, lat: 28.1680, address: '长沙市岳麓区', rating: 4.5, priceLevel: 1, tags: '山,岳麓书院,爱晚亭', avgDurationMin: 150, openHours: '全天', description: '湘江西岸名山，红叶爱晚亭。', wiki: '岳麓山' },
          { id: 1602, name: '橘子洲', category: 'nature', lng: 112.9500, lat: 28.1800, address: '长沙市岳麓区橘子洲', rating: 4.4, priceLevel: 1, tags: '江心洲,毛泽东像,夜景', avgDurationMin: 120, openHours: '全天', description: '湘江中流的青年毛泽东雕像。', wiki: '橘子洲' },
          { id: 1603, name: '坡子街(火宫殿)', category: 'food', lng: 112.9780, lat: 28.1950, address: '长沙市天心区坡子街', rating: 4.2, priceLevel: 2, tags: '小吃,夜市,湘菜', avgDurationMin: 60, openHours: '全天', description: '长沙美食地标，火宫殿小吃。', wiki: '火宫殿' },
          { id: 1604, name: '湖南博物院', category: 'culture', lng: 112.9400, lat: 28.2100, address: '长沙市开福区东风路', rating: 4.7, priceLevel: 1, tags: '博物馆,马王堆,辛追', avgDurationMin: 150, openHours: '09:00-17:00', description: '马王堆汉墓陈列，辛追夫人。', wiki: '湖南博物院' },
          { id: 1605, name: '太平老街', category: 'culture', lng: 112.9760, lat: 28.2000, address: '长沙市天心区太平街', rating: 4.1, priceLevel: 2, tags: '古街,小吃,文创', avgDurationMin: 60, openHours: '全天', description: '千年老街，贾谊故居。', wiki: '太平街' },
          { id: 1606, name: '天心阁', category: 'culture', lng: 112.9800, lat: 28.1900, address: '长沙市天心区天心路', rating: 4.0, priceLevel: 2, tags: '古城墙,楼阁,古迹', avgDurationMin: 60, openHours: '08:00-17:30', description: '长沙仅存古城墙与阁楼。', wiki: '天心阁' }
        ]
      },
      {
        name: '张家界', center: [29.1170, 110.4790],
        pois: [
          { id: 4171, name: '武陵源', category: 'nature', lng: 110.4790, lat: 29.3170, address: '张家界市武陵源区', rating: 4.7, priceLevel: 3, tags: '峰林,世界遗产,石英砂岩', avgDurationMin: 240, openHours: '07:00-18:00', description: '三千奇峰，云海仙境。', wiki: '武陵源' },
          { id: 4172, name: '天门山', category: 'nature', lng: 110.4790, lat: 29.0500, address: '张家界市永定区', rating: 4.6, priceLevel: 3, tags: '索道,天门洞,玻璃栈道', avgDurationMin: 180, openHours: '07:30-17:30', description: '空中花园，天门洞开。', wiki: '天门山' },
          { id: 4173, name: '黄龙洞', category: 'nature', lng: 110.4500, lat: 29.3500, address: '张家界市武陵源区', rating: 4.2, priceLevel: 2, tags: '溶洞,钟乳石,奇观', avgDurationMin: 120, openHours: '08:00-17:30', description: '地下魔幻龙宫。', wiki: '黄龙洞' }
        ]
      }
    ]
  },
  {
    name: '广东省',
    cities: [
      {
        name: '广州', center: [23.1291, 113.2644],
        pois: [
          { id: 601, name: '广州塔', category: 'culture', lng: 113.3245, lat: 23.1066, address: '广州市海珠区阅江西路222号', rating: 4.6, priceLevel: 3, tags: '地标,夜景,观光', avgDurationMin: 90, openHours: '09:30-22:30', description: '小蛮腰，城市天际线地标与高空观景。', wiki: '广州塔' },
          { id: 602, name: '陈家祠', category: 'culture', lng: 113.2450, lat: 23.1290, address: '广州市荔湾区中山七路恩龙里34号', rating: 4.6, priceLevel: 2, tags: '祠堂,建筑,古迹', avgDurationMin: 60, openHours: '08:30-17:30', description: '岭南建筑装饰艺术的集大成者。', wiki: '陈氏书院' },
          { id: 603, name: '沙面岛', category: 'culture', lng: 113.2450, lat: 23.1050, address: '广州市荔湾区沙面', rating: 4.4, priceLevel: 1, tags: '欧陆建筑,江景,散步', avgDurationMin: 60, openHours: '全天', description: '昔日租界岛，欧陆风情与江景。', wiki: '沙面' },
          { id: 604, name: '北京路步行街', category: 'shopping', lng: 113.2660, lat: 23.1280, address: '广州市越秀区北京路', rating: 4.3, priceLevel: 2, tags: '购物,小吃,古街', avgDurationMin: 60, openHours: '全天', description: '千年古道上的繁华商业街。', wiki: '北京路' },
          { id: 605, name: '白云山', category: 'nature', lng: 113.2990, lat: 23.1790, address: '广州市白云区同和', rating: 4.4, priceLevel: 2, tags: '山,登山,自然', avgDurationMin: 180, openHours: '06:00-21:00', description: '羊城第一秀，城市绿肺。', wiki: '白云山 (广州)' },
          { id: 606, name: '长隆欢乐世界', category: 'culture', lng: 113.3260, lat: 23.0040, address: '广州市番禺区汉溪大道', rating: 4.5, priceLevel: 3, tags: '主题公园,游乐,亲子', avgDurationMin: 240, openHours: '09:30-21:00', description: '大型主题乐园，游乐设施丰富。', wiki: '长隆欢乐世界' }
        ]
      },
      {
        name: '深圳', center: [22.5431, 114.0579],
        pois: [
          { id: 501, name: '世界之窗', category: 'culture', lng: 113.9730, lat: 22.5370, address: '深圳市南山区深南大道9037号', rating: 4.2, priceLevel: 3, tags: '微缩景观,主题公园', avgDurationMin: 180, openHours: '09:00-21:30', description: '汇聚世界名胜微缩景观的主题公园。', wiki: '世界之窗' },
          { id: 502, name: '深圳湾公园', category: 'park', lng: 113.9500, lat: 22.5200, address: '深圳市南山区滨海大道', rating: 4.6, priceLevel: 1, tags: '海滨,骑行,红树林,观鸟', avgDurationMin: 120, openHours: '全天', description: '滨海休闲带，骑行观海看候鸟。', wiki: '深圳湾公园' },
          { id: 503, name: '欢乐海岸', category: 'night', lng: 113.9600, lat: 22.5300, address: '深圳市南山区白石路东8号', rating: 4.3, priceLevel: 2, tags: '夜景,购物,美食,水秀', avgDurationMin: 120, openHours: '全天', description: '都市亲水商业区，夜晚水秀表演。', wiki: '欢乐海岸' },
          { id: 504, name: '莲花山公园', category: 'park', lng: 114.0700, lat: 22.5600, address: '深圳市福田区红荔路6030号', rating: 4.5, priceLevel: 1, tags: '风筝,城市景观,邓小平像', avgDurationMin: 90, openHours: '06:00-23:00', description: '登顶可俯瞰市中心CBD全景。', wiki: '莲花山公园' },
          { id: 505, name: '东门老街', category: 'food', lng: 114.1230, lat: 22.5470, address: '深圳市罗湖区东门中路', rating: 4.1, priceLevel: 2, tags: '小吃,老街,批发', avgDurationMin: 60, openHours: '全天', description: '深圳历史最久的商业街区，烟火气十足。', wiki: '东门 (深圳)' }
        ]
      },
      {
        name: '珠海', center: [22.2710, 113.5767],
        pois: [
          { id: 4181, name: '珠海渔女', category: 'culture', lng: 113.5730, lat: 22.2620, address: '珠海市香洲区情侣路', rating: 4.2, priceLevel: 1, tags: '地标,雕塑,海', avgDurationMin: 60, openHours: '全天', description: '珠海城市地标雕塑。', wiki: '珠海渔女' },
          { id: 4182, name: '珠海长隆海洋王国', category: 'culture', lng: 113.5500, lat: 22.0700, address: '珠海市横琴新区', rating: 4.6, priceLevel: 3, tags: '海洋,主题公园,亲子', avgDurationMin: 240, openHours: '10:00-20:00', description: '大型海洋主题乐园。', wiki: '珠海长隆海洋王国' },
          { id: 4183, name: '情侣路', category: 'nature', lng: 113.5800, lat: 22.2600, address: '珠海市香洲区情侣路', rating: 4.1, priceLevel: 1, tags: '海滨,骑行,风光', avgDurationMin: 120, openHours: '全天', description: '滨海观光大道。', wiki: '情侣路' }
        ]
      }
    ]
  },
  {
    name: '广西壮族自治区',
    cities: [
      {
        name: '南宁', center: [22.8170, 108.3665],
        pois: [
          { id: 3001, name: '青秀山', category: 'nature', lng: 108.3800, lat: 22.8000, address: '南宁市青秀区凤岭南路', rating: 4.4, priceLevel: 2, tags: '山,寺庙,园林', avgDurationMin: 180, openHours: '06:30-23:00', description: '绿城南宁的城市绿肺。', wiki: '青秀山' },
          { id: 3002, name: '南湖公园', category: 'park', lng: 108.3400, lat: 22.8000, address: '南宁市青秀区南湖', rating: 4.0, priceLevel: 1, tags: '公园,湖,夜景', avgDurationMin: 90, openHours: '全天', description: '环湖步道与夜景灯光。', wiki: '南湖公园 (南宁)' },
          { id: 3003, name: '扬美古镇', category: 'culture', lng: 108.1300, lat: 22.6800, address: '南宁市江南区扬美镇', rating: 3.9, priceLevel: 1, tags: '古镇,明清,江', avgDurationMin: 120, openHours: '全天', description: '左江之滨的明清古镇。', wiki: '扬美古镇' },
          { id: 3004, name: '大明山', category: 'nature', lng: 108.4800, lat: 23.4000, address: '南宁市武鸣区', rating: 4.1, priceLevel: 2, tags: '山,杜鹃,养生', avgDurationMin: 180, openHours: '08:00-17:00', description: '北回归线上的高山绿洲。', wiki: '大明山 (广西)' },
          { id: 3005, name: '三街两巷', category: 'culture', lng: 108.3200, lat: 22.8200, address: '南宁市兴宁区', rating: 3.9, priceLevel: 2, tags: '老街,小吃,文创', avgDurationMin: 60, openHours: '全天', description: '老南宁的历史文化街区。', wiki: '三街两巷' },
          { id: 3006, name: '广西民族博物馆', category: 'culture', lng: 108.3500, lat: 22.8500, address: '南宁市青秀区', rating: 3.8, priceLevel: 1, tags: '博物馆,铜鼓,民族', avgDurationMin: 120, openHours: '09:00-17:00', description: '铜鼓与民族服饰大馆。', wiki: '广西民族博物馆' }
        ]
      },
      {
        name: '桂林', center: [25.2736, 110.2990],
        pois: [
          { id: 1901, name: '漓江', category: 'nature', lng: 110.3400, lat: 25.2300, address: '桂林市漓江', rating: 4.7, priceLevel: 3, tags: '江,山水画,竹筏', avgDurationMin: 240, openHours: '全天', description: '桂林山水甲天下。', wiki: '漓江' },
          { id: 1902, name: '象鼻山', category: 'nature', lng: 110.2900, lat: 25.2600, address: '桂林市象山区滨江路', rating: 4.3, priceLevel: 2, tags: '山,地标,象鼻', avgDurationMin: 60, openHours: '07:00-18:00', description: '桂林城徽，神似象鼻饮水。', wiki: '象鼻山' },
          { id: 1903, name: '阳朔西街', category: 'food', lng: 110.4900, lat: 24.7800, address: '桂林市阳朔县西街', rating: 4.4, priceLevel: 2, tags: '古街,夜市,洋人街', avgDurationMin: 90, openHours: '全天', description: '阳朔最热闹的中西合璧老街。', wiki: '阳朔西街' },
          { id: 1904, name: '龙脊梯田', category: 'nature', lng: 110.0800, lat: 25.7600, address: '桂林市龙胜县', rating: 4.6, priceLevel: 2, tags: '梯田,民俗,摄影', avgDurationMin: 240, openHours: '全天', description: '层叠如链的壮美梯田。', wiki: '龙脊梯田' },
          { id: 1905, name: '两江四湖', category: 'night', lng: 110.3000, lat: 25.2700, address: '桂林市区', rating: 4.2, priceLevel: 2, tags: '夜景,湖,游船', avgDurationMin: 120, openHours: '全天', description: '环城水系夜游，灯火璀璨。', wiki: '两江四湖' },
          { id: 1906, name: '芦笛岩', category: 'nature', lng: 110.2500, lat: 25.2900, address: '桂林市秀峰区芦笛路', rating: 4.1, priceLevel: 2, tags: '溶洞,钟乳石,奇观', avgDurationMin: 90, openHours: '08:00-17:30', description: '国宾洞，瑰丽钟乳石。', wiki: '芦笛岩' }
        ]
      },
      {
        name: '北海', center: [21.4800, 109.1200],
        pois: [
          { id: 4191, name: '银滩', category: 'nature', lng: 109.0800, lat: 21.4300, address: '北海市银海区银滩', rating: 4.4, priceLevel: 1, tags: '海滩,银沙,度假', avgDurationMin: 120, openHours: '全天', description: '天下第一滩，洁白沙滩。', wiki: '北海银滩' },
          { id: 4192, name: '涠洲岛', category: 'nature', lng: 109.1000, lat: 21.0400, address: '北海市海城区涠洲镇', rating: 4.5, priceLevel: 3, tags: '海岛,火山,潜水', avgDurationMin: 240, openHours: '全天(船运)', description: '火山海岛，碧海珊瑚。', wiki: '涠洲岛' },
          { id: 4193, name: '北海老街', category: 'culture', lng: 109.1100, lat: 21.4900, address: '北海市海城区珠海路', rating: 4.0, priceLevel: 1, tags: '老街,骑楼,小吃', avgDurationMin: 60, openHours: '全天', description: '西洋骑楼老街。', wiki: '珠海路 (北海)' }
        ]
      }
    ]
  },
  {
    name: '海南省',
    cities: [
      {
        name: '海口', center: [20.0440, 110.1999],
        pois: [
          { id: 4201, name: '骑楼老街', category: 'culture', lng: 110.3420, lat: 20.0440, address: '海口市龙华区骑楼老街', rating: 4.2, priceLevel: 1, tags: '老街,骑楼,小吃', avgDurationMin: 90, openHours: '全天', description: '南洋风格骑楼建筑街区。', wiki: '海口骑楼老街' },
          { id: 4202, name: '雷琼世界地质公园', category: 'nature', lng: 110.2330, lat: 19.9280, address: '海口市秀英区石山镇', rating: 4.1, priceLevel: 2, tags: '火山,地质,公园', avgDurationMin: 120, openHours: '08:30-17:30', description: '休眠火山口与熔岩景观。', wiki: '雷琼世界地质公园' },
          { id: 4203, name: '假日海滩', category: 'nature', lng: 110.2410, lat: 20.0310, address: '海口市秀英区滨海大道', rating: 4.0, priceLevel: 1, tags: '海滩,度假,戏水', avgDurationMin: 120, openHours: '全天', description: '椰风海韵的城市海滩。', wiki: '假日海滩' }
        ]
      },
      {
        name: '三亚', center: [18.2528, 109.5119],
        pois: [
          { id: 2101, name: '亚龙湾', category: 'nature', lng: 109.6400, lat: 18.2100, address: '三亚市吉阳区亚龙湾', rating: 4.5, priceLevel: 1, tags: '海滩,度假,潜水', avgDurationMin: 180, openHours: '全天', description: '天下第一湾，细白沙滩。', wiki: '亚龙湾' },
          { id: 2102, name: '天涯海角', category: 'nature', lng: 109.4600, lat: 18.2700, address: '三亚市天涯区', rating: 4.1, priceLevel: 2, tags: '海,地标,石刻', avgDurationMin: 120, openHours: '07:30-18:30', description: '天之涯海之角的经典石刻。', wiki: '天涯海角游览区' },
          { id: 2103, name: '南山文化旅游区', category: 'culture', lng: 109.2000, lat: 18.3000, address: '三亚市崖州区南山', rating: 4.3, priceLevel: 3, tags: '佛教,海上观音,文化', avgDurationMin: 180, openHours: '08:00-17:30', description: '108米海上观音圣像。', wiki: '南山文化旅游区' },
          { id: 2104, name: '蜈支洲岛', category: 'nature', lng: 109.7600, lat: 18.3100, address: '三亚市海棠区', rating: 4.5, priceLevel: 3, tags: '海岛,潜水,度假', avgDurationMin: 240, openHours: '08:00-17:30', description: '潜水天堂的情人岛。', wiki: '蜈支洲岛' },
          { id: 2105, name: '大东海', category: 'nature', lng: 109.5200, lat: 18.2300, address: '三亚市吉阳区', rating: 4.0, priceLevel: 1, tags: '海滩,游泳,夜景', avgDurationMin: 120, openHours: '全天', description: '距市区最近的海滨浴场。', wiki: '大东海' },
          { id: 2106, name: '三亚湾', category: 'night', lng: 109.5000, lat: 18.2500, address: '三亚市天涯区三亚湾', rating: 4.1, priceLevel: 1, tags: '海滩,日落,椰梦长廊', avgDurationMin: 120, openHours: '全天', description: '椰梦长廊，绝美日落。', wiki: '三亚湾' }
        ]
      }
    ]
  },
  {
    name: '四川省',
    cities: [
      {
        name: '成都', center: [30.5728, 104.0668],
        pois: [
          { id: 401, name: '宽窄巷子', category: 'food', lng: 104.0560, lat: 30.6690, address: '成都市青羊区金河路口', rating: 4.5, priceLevel: 2, tags: '小吃,茶馆,古街', avgDurationMin: 90, openHours: '全天', description: '由宽巷子、窄巷子、井巷子组成的老成都院落。', wiki: '宽窄巷子' },
          { id: 402, name: '锦里', category: 'food', lng: 104.0610, lat: 30.6410, address: '成都市武侯区武侯祠大街231号', rating: 4.4, priceLevel: 2, tags: '小吃,三国,古街', avgDurationMin: 60, openHours: '全天', description: '川西风情古街，紧邻武侯祠。', wiki: '锦里' },
          { id: 403, name: '大熊猫繁育研究基地', category: 'nature', lng: 104.1460, lat: 30.7330, address: '成都市成华区熊猫大道1375号', rating: 4.8, priceLevel: 2, tags: '熊猫,亲子,萌宠', avgDurationMin: 180, openHours: '07:30-18:00', description: '近距离看国宝大熊猫的必去之地。', wiki: '成都大熊猫繁育研究基地' },
          { id: 404, name: '武侯祠', category: 'culture', lng: 104.0590, lat: 30.6420, address: '成都市武侯区武侯祠大街231号', rating: 4.4, priceLevel: 2, tags: '三国,古迹,祠堂', avgDurationMin: 90, openHours: '08:00-21:00', description: '中国唯一的君臣合祀祠庙，三国文化圣地。', wiki: '武侯祠' },
          { id: 405, name: '春熙路', category: 'shopping', lng: 104.0810, lat: 30.6570, address: '成都市锦江区春熙路', rating: 4.3, priceLevel: 2, tags: '购物,商圈,地标', avgDurationMin: 60, openHours: '全天', description: '成都最繁华的商业中心。', wiki: '春熙路' },
          { id: 406, name: '杜甫草堂', category: 'culture', lng: 104.0250, lat: 30.6580, address: '成都市青羊区青华路37号', rating: 4.3, priceLevel: 2, tags: '诗人,园林,古迹', avgDurationMin: 90, openHours: '08:00-18:00', description: '诗圣杜甫流寓成都的居所，竹林清幽。', wiki: '杜甫草堂' }
        ]
      },
      {
        name: '乐山', center: [29.5568, 103.7653],
        pois: [
          { id: 4211, name: '乐山大佛', category: 'culture', lng: 103.7765, lat: 29.5450, address: '乐山市市中区凌云路', rating: 4.7, priceLevel: 3, tags: '大佛,世界遗产,江', avgDurationMin: 180, openHours: '07:30-18:30', description: '唐代弥勒坐佛，山是一尊佛。', wiki: '乐山大佛' },
          { id: 4212, name: '峨眉山', category: 'nature', lng: 103.3360, lat: 29.5170, address: '乐山市峨眉山市', rating: 4.7, priceLevel: 3, tags: '佛教名山,金顶,猴', avgDurationMin: 240, openHours: '06:00-18:00', description: '普贤道场，秀甲天下。', wiki: '峨眉山' }
        ]
      }
    ]
  },
  {
    name: '贵州省',
    cities: [
      {
        name: '贵阳', center: [26.6477, 106.6302],
        pois: [
          { id: 2901, name: '甲秀楼', category: 'culture', lng: 106.7200, lat: 26.5800, address: '贵阳市南明区翠微巷', rating: 4.2, priceLevel: 1, tags: '古楼,地标,夜景', avgDurationMin: 60, openHours: '全天', description: '南明河畔的明代楼阁。', wiki: '甲秀楼' },
          { id: 2902, name: '黔灵山公园', category: 'park', lng: 106.7000, lat: 26.6000, address: '贵阳市云岩区枣山路', rating: 4.4, priceLevel: 1, tags: '公园,猕猴,弘福寺', avgDurationMin: 150, openHours: '06:30-22:00', description: '市中心的灵秀山林与猕猴。', wiki: '黔灵山公园' },
          { id: 2903, name: '青岩古镇', category: 'culture', lng: 106.7000, lat: 26.3500, address: '贵阳市花溪区青岩镇', rating: 4.2, priceLevel: 2, tags: '古镇,小吃,城墙', avgDurationMin: 150, openHours: '全天', description: '明清军事古镇与卤猪脚。', wiki: '青岩古镇' },
          { id: 2904, name: '黄果树瀑布', category: 'nature', lng: 105.6100, lat: 25.9900, address: '安顺市黄果树', rating: 4.6, priceLevel: 3, tags: '瀑布,亚洲最大,水帘洞', avgDurationMin: 240, openHours: '07:30-18:00', description: '亚洲第一大瀑布。', wiki: '黄果树瀑布' },
          { id: 2905, name: '花溪夜郎谷', category: 'culture', lng: 106.6500, lat: 26.4000, address: '贵阳市花溪区', rating: 4.0, priceLevel: 2, tags: '怪诞,石雕,艺术', avgDurationMin: 120, openHours: '08:30-18:00', description: '石头垒砌的奇幻艺术谷。', wiki: '夜郎谷' },
          { id: 2906, name: '贵州省博物馆', category: 'culture', lng: 106.7100, lat: 26.6300, address: '贵阳市观山湖区', rating: 3.9, priceLevel: 1, tags: '博物馆,少数民族,展', avgDurationMin: 120, openHours: '09:00-17:00', description: '苗族侗族文化与侗寨模型。', wiki: '贵州省博物馆' }
        ]
      },
      {
        name: '遵义', center: [27.7270, 106.9300],
        pois: [
          { id: 4221, name: '遵义会议会址', category: 'culture', lng: 106.9300, lat: 27.7300, address: '遵义市红花岗区子尹路', rating: 4.4, priceLevel: 1, tags: '红色,会议,旧址', avgDurationMin: 90, openHours: '08:30-17:00', description: '中国革命转折点。', wiki: '遵义会议会址' },
          { id: 4222, name: '赤水丹霞', category: 'nature', lng: 105.7000, lat: 28.5700, address: '遵义市赤水市', rating: 4.2, priceLevel: 2, tags: '丹霞,瀑布,世界遗产', avgDurationMin: 180, openHours: '08:00-17:30', description: '红色砂砾地貌奇观。', wiki: '赤水丹霞' },
          { id: 4223, name: '茅台镇', category: 'culture', lng: 106.3900, lat: 27.8600, address: '遵义市仁怀市茅台镇', rating: 4.0, priceLevel: 2, tags: '酒,古镇,工业游', avgDurationMin: 90, openHours: '全天', description: '中国酒都，酱香之源。', wiki: '茅台镇' }
        ]
      }
    ]
  },
  {
    name: '云南省',
    cities: [
      {
        name: '昆明', center: [25.0389, 102.7183],
        pois: [
          { id: 1501, name: '石林', category: 'nature', lng: 103.3190, lat: 24.8900, address: '昆明市石林县', rating: 4.5, priceLevel: 3, tags: '喀斯特,奇石,世界遗产', avgDurationMin: 240, openHours: '08:00-18:00', description: '天下第一奇观的喀斯特石林。', wiki: '石林 (云南)' },
          { id: 1502, name: '滇池', category: 'nature', lng: 102.6500, lat: 24.9500, address: '昆明市西山区滇池', rating: 4.3, priceLevel: 1, tags: '湖,海鸥,西山', avgDurationMin: 120, openHours: '全天', description: '高原明珠，冬日红嘴鸥。', wiki: '滇池' },
          { id: 1503, name: '翠湖公园', category: 'park', lng: 102.7100, lat: 25.0500, address: '昆明市五华区翠湖南路', rating: 4.3, priceLevel: 1, tags: '公园,红嘴鸥,散步', avgDurationMin: 60, openHours: '全天', description: '市中心绿洲，冬日观鸥。', wiki: '翠湖 (昆明)' },
          { id: 1504, name: '云南民族村', category: 'culture', lng: 102.6700, lat: 25.0000, address: '昆明市西山区滇池路', rating: 4.2, priceLevel: 2, tags: '民族,村寨,表演', avgDurationMin: 150, openHours: '09:00-18:00', description: '荟萃云南25个民族风情。', wiki: '云南民族村' },
          { id: 1505, name: '金马碧鸡坊', category: 'culture', lng: 102.7100, lat: 25.0200, address: '昆明市西山区金碧路', rating: 4.0, priceLevel: 1, tags: '牌坊,地标,夜景', avgDurationMin: 60, openHours: '全天', description: '昆明地标双坊，日落奇观。', wiki: '金马碧鸡坊' },
          { id: 1506, name: '大观楼', category: 'culture', lng: 102.6700, lat: 25.0300, address: '昆明市西山区大观路', rating: 4.1, priceLevel: 1, tags: '楼,长联,滇池', avgDurationMin: 60, openHours: '07:00-19:00', description: '天下第一长联所在地。', wiki: '大观楼 (昆明)' }
        ]
      },
      {
        name: '丽江', center: [26.8550, 100.2290],
        pois: [
          { id: 2001, name: '丽江古城', category: 'culture', lng: 100.2300, lat: 26.8700, address: '丽江市古城区', rating: 4.5, priceLevel: 1, tags: '古城,纳西,世界遗产', avgDurationMin: 180, openHours: '全天', description: '纳西风情的世界文化遗产。', wiki: '丽江古城' },
          { id: 2002, name: '玉龙雪山', category: 'nature', lng: 100.1800, lat: 27.1000, address: '丽江市玉龙县', rating: 4.6, priceLevel: 3, tags: '雪山,索道,高山', avgDurationMin: 240, openHours: '07:30-16:30', description: '终年积雪的纳西神山。', wiki: '玉龙雪山' },
          { id: 2003, name: '束河古镇', category: 'culture', lng: 100.2000, lat: 26.8800, address: '丽江市古城区束河', rating: 4.3, priceLevel: 1, tags: '古镇,安静,茶马古道', avgDurationMin: 120, openHours: '全天', description: '比大研更清静的茶马古镇。', wiki: '束河古镇' },
          { id: 2004, name: '拉市海', category: 'nature', lng: 100.1500, lat: 26.9200, address: '丽江市玉龙县拉市海', rating: 4.1, priceLevel: 2, tags: '湿地,骑马,候鸟', avgDurationMin: 150, openHours: '全天', description: '高原湿地，骑马走茶马古道。', wiki: '拉市海' },
          { id: 2005, name: '泸沽湖', category: 'nature', lng: 100.7000, lat: 27.7000, address: '丽江市宁蒗县', rating: 4.6, priceLevel: 2, tags: '湖,摩梭,走婚', avgDurationMin: 240, openHours: '全天', description: '摩梭母系家园的高原湖泊。', wiki: '泸沽湖' },
          { id: 2006, name: '黑龙潭公园', category: 'park', lng: 100.2300, lat: 26.8800, address: '丽江市古城区黑龙潭', rating: 4.2, priceLevel: 1, tags: '公园,泉水,雪山倒影', avgDurationMin: 60, openHours: '07:00-19:00', description: '玉龙雪山倒影的清泉公园。', wiki: '黑龙潭公园 (丽江)' }
        ]
      },
      {
        name: '大理', center: [25.6060, 100.2670],
        pois: [
          { id: 4231, name: '洱海', category: 'nature', lng: 100.2500, lat: 25.6300, address: '大理市洱海', rating: 4.6, priceLevel: 1, tags: '湖,骑行,风光', avgDurationMin: 180, openHours: '全天', description: '高原明珠，环海骑行。', wiki: '洱海' },
          { id: 4232, name: '大理古城', category: 'culture', lng: 100.2670, lat: 25.6060, address: '大理市古城区', rating: 4.4, priceLevel: 1, tags: '古城,白族,南诏', avgDurationMin: 120, openHours: '全天', description: '南诏古都，风花雪月。', wiki: '大理古城' },
          { id: 4233, name: '苍山', category: 'nature', lng: 100.1300, lat: 25.6200, address: '大理市苍山', rating: 4.3, priceLevel: 2, tags: '山,索道,云杉', avgDurationMin: 180, openHours: '08:30-16:30', description: '十九峰十八溪，苍翠如黛。', wiki: '苍山' },
          { id: 4234, name: '崇圣寺三塔', category: 'culture', lng: 100.2500, lat: 25.6480, address: '大理市崇圣寺', rating: 4.3, priceLevel: 2, tags: '古塔,佛教,地标', avgDurationMin: 60, openHours: '07:30-18:30', description: '大理地标三塔。', wiki: '崇圣寺三塔' }
        ]
      }
    ]
  },
  {
    name: '西藏自治区',
    cities: [
      {
        name: '拉萨', center: [29.6520, 91.1721],
        pois: [
          { id: 2701, name: '布达拉宫', category: 'culture', lng: 91.1170, lat: 29.6570, address: '拉萨市城关区北京中路', rating: 4.8, priceLevel: 3, tags: '宫殿,世界遗产,藏传佛教', avgDurationMin: 150, openHours: '09:00-15:30(预约)', description: '世界屋脊上的宫殿。', wiki: '布达拉宫' },
          { id: 2702, name: '大昭寺', category: 'culture', lng: 91.1320, lat: 29.6500, address: '拉萨市城关区八廓街', rating: 4.7, priceLevel: 2, tags: '寺庙,朝拜,藏传', avgDurationMin: 90, openHours: '08:00-18:30', description: '藏传佛教圣地，释迦牟尼等身像。', wiki: '大昭寺' },
          { id: 2703, name: '八廓街', category: 'culture', lng: 91.1300, lat: 29.6480, address: '拉萨市城关区八廓街', rating: 4.4, priceLevel: 1, tags: '转经,古街,购物', avgDurationMin: 90, openHours: '全天', description: '环绕大昭寺的转经古道。', wiki: '八廓街' },
          { id: 2704, name: '羊卓雍措', category: 'nature', lng: 90.7000, lat: 28.9500, address: '山南市浪卡子县', rating: 4.7, priceLevel: 1, tags: '圣湖,蓝湖,高原', avgDurationMin: 240, openHours: '全天', description: '碧蓝如宝石的高原圣湖。', wiki: '羊卓雍错' },
          { id: 2705, name: '纳木措', category: 'nature', lng: 90.6000, lat: 30.7200, address: '拉萨市当雄县', rating: 4.6, priceLevel: 1, tags: '圣湖,雪山,高原', avgDurationMin: 240, openHours: '全天', description: '天湖，西藏三大圣湖之一。', wiki: '纳木错' },
          { id: 2706, name: '罗布林卡', category: 'park', lng: 91.1000, lat: 29.6400, address: '拉萨市城关区罗布林卡', rating: 4.1, priceLevel: 1, tags: '园林,夏宫,藏式', avgDurationMin: 90, openHours: '09:00-18:00', description: '达赖喇嘛的夏宫园林。', wiki: '罗布林卡' }
        ]
      },
      {
        name: '林芝', center: [29.6520, 94.3620],
        pois: [
          { id: 4241, name: '雅鲁藏布大峡谷', category: 'nature', lng: 95.0600, lat: 29.5800, address: '林芝市米林县', rating: 4.5, priceLevel: 3, tags: '峡谷,江,世界最深', avgDurationMin: 240, openHours: '08:00-18:00', description: '世界第一大峡谷。', wiki: '雅鲁藏布大峡谷' },
          { id: 4242, name: '南迦巴瓦峰', category: 'nature', lng: 95.0400, lat: 29.6300, address: '林芝市米林县', rating: 4.4, priceLevel: 1, tags: '雪山,神山,云中', avgDurationMin: 180, openHours: '全天', description: '中国最美雪山。', wiki: '南迦巴瓦峰' },
          { id: 4243, name: '巴松措', category: 'nature', lng: 94.0500, lat: 30.0600, address: '林芝市工布江达县', rating: 4.3, priceLevel: 2, tags: '湖,雪山,森林', avgDurationMin: 180, openHours: '08:00-18:00', description: '藏东绿宝石湖。', wiki: '巴松措' }
        ]
      }
    ]
  },
  {
    name: '陕西省',
    cities: [
      {
        name: '西安', center: [34.2658, 108.9541],
        pois: [
          { id: 701, name: '秦始皇兵马俑', category: 'culture', lng: 109.2734, lat: 34.3853, address: '西安市临潼区秦陵北路', rating: 4.8, priceLevel: 3, tags: '古迹,博物馆,世界遗产', avgDurationMin: 180, openHours: '08:30-17:00', description: '世界第八大奇迹，地下军阵。', wiki: '兵马俑' },
          { id: 702, name: '大雁塔', category: 'culture', lng: 108.9640, lat: 34.2180, address: '西安市雁塔区大雁塔', rating: 4.6, priceLevel: 2, tags: '古塔,古迹,音乐喷泉', avgDurationMin: 90, openHours: '08:00-17:30', description: '唐代古塔，夜景音乐喷泉。', wiki: '大雁塔' },
          { id: 703, name: '西安城墙', category: 'culture', lng: 108.9480, lat: 34.2580, address: '西安市碑林区南大街', rating: 4.7, priceLevel: 2, tags: '城墙,骑行,古迹', avgDurationMin: 120, openHours: '08:00-22:00', description: '保存最完整的古代城垣，可骑行。', wiki: '西安城墙' },
          { id: 704, name: '回民街', category: 'food', lng: 108.9540, lat: 34.2650, address: '西安市莲湖区回民街', rating: 4.4, priceLevel: 2, tags: '小吃,夜市,美食', avgDurationMin: 60, openHours: '全天', description: '西安美食集中地，泡馍与小吃。', wiki: '回民街' },
          { id: 705, name: '钟楼', category: 'culture', lng: 108.9540, lat: 34.2610, address: '西安市碑林区西大街', rating: 4.5, priceLevel: 2, tags: '古楼,地标,夜景', avgDurationMin: 60, openHours: '08:30-21:30', description: '古城中心地标，夜景绚丽。', wiki: '西安钟楼' },
          { id: 706, name: '华清宫', category: 'culture', lng: 109.2130, lat: 34.3570, address: '西安市临潼区华清路', rating: 4.4, priceLevel: 3, tags: '温泉,古迹,唐文化', avgDurationMin: 120, openHours: '07:30-18:00', description: '唐玄宗与杨贵妃的华清池。', wiki: '华清宫' }
        ]
      },
      {
        name: '延安', center: [36.5960, 109.4900],
        pois: [
          { id: 4251, name: '宝塔山', category: 'culture', lng: 109.4900, lat: 36.5830, address: '延安市宝塔区', rating: 4.1, priceLevel: 1, tags: '革命,古塔,地标', avgDurationMin: 90, openHours: '08:00-17:30', description: '延安革命圣地象征。', wiki: '宝塔山' },
          { id: 4252, name: '黄帝陵', category: 'culture', lng: 109.2800, lat: 35.5600, address: '延安市黄陵县', rating: 4.2, priceLevel: 2, tags: '陵墓,人文初祖,古迹', avgDurationMin: 120, openHours: '08:00-17:30', description: '中华民族人文初祖陵寝。', wiki: '黄帝陵' },
          { id: 4253, name: '壶口瀑布(陕西侧)', category: 'nature', lng: 110.4500, lat: 36.1300, address: '延安市宜川县', rating: 4.5, priceLevel: 2, tags: '瀑布,黄河,奇观', avgDurationMin: 120, openHours: '08:00-17:30', description: '黄河之水天上来。', wiki: '壶口瀑布' }
        ]
      }
    ]
  },
  {
    name: '甘肃省',
    cities: [
      {
        name: '兰州', center: [36.0611, 103.8343],
        pois: [
          { id: 3101, name: '中山桥', category: 'culture', lng: 103.8300, lat: 36.0600, address: '兰州市城关区滨河路', rating: 4.3, priceLevel: 1, tags: '黄河铁桥,地标,夜景', avgDurationMin: 60, openHours: '全天', description: '黄河上第一座铁桥，百年沧桑。', wiki: '中山桥 (兰州)' },
          { id: 3102, name: '黄河风情线', category: 'nature', lng: 103.8300, lat: 36.0500, address: '兰州市城关区黄河南岸', rating: 4.0, priceLevel: 1, tags: '黄河,步道,夜景', avgDurationMin: 120, openHours: '全天', description: '沿黄河南岸的百里风情线。', wiki: '黄河风情线' },
          { id: 3103, name: '白塔山公园', category: 'park', lng: 103.8300, lat: 36.0700, address: '兰州市城关区白塔山', rating: 4.0, priceLevel: 1, tags: '公园,白塔,俯瞰', avgDurationMin: 90, openHours: '06:30-20:00', description: '登顶俯瞰黄河与铁桥。', wiki: '白塔山公园' },
          { id: 3104, name: '甘肃省博物馆', category: 'culture', lng: 103.7800, lat: 36.0600, address: '兰州市七里河区西津西路', rating: 4.4, priceLevel: 1, tags: '博物馆,马踏飞燕,丝路', avgDurationMin: 120, openHours: '09:00-17:00', description: '马踏飞燕出土地，丝路文明。', wiki: '甘肃省博物馆' },
          { id: 3105, name: '五泉山公园', category: 'park', lng: 103.8500, lat: 36.0400, address: '兰州市城关区五泉南路', rating: 3.9, priceLevel: 1, tags: '公园,泉水,寺庙', avgDurationMin: 90, openHours: '06:30-20:00', description: '因五眼泉得名的城中公园。', wiki: '五泉山公园' },
          { id: 3106, name: '正宁路夜市', category: 'food', lng: 103.8400, lat: 36.0500, address: '兰州市城关区正宁路', rating: 4.0, priceLevel: 2, tags: '小吃,夜市,烤肉', avgDurationMin: 60, openHours: '全天(夜)', description: '兰州深夜美食街，牛奶鸡蛋醪糟。', wiki: '正宁路夜市' }
        ]
      },
      {
        name: '敦煌', center: [40.1420, 94.6620],
        pois: [
          { id: 4261, name: '莫高窟', category: 'culture', lng: 94.8100, lat: 40.0400, address: '敦煌市东南25公里', rating: 4.8, priceLevel: 3, tags: '石窟,世界遗产,壁画', avgDurationMin: 180, openHours: '08:30-18:00', description: '千年壁画艺术宝库。', wiki: '莫高窟' },
          { id: 4262, name: '鸣沙山月牙泉', category: 'nature', lng: 94.6800, lat: 40.0900, address: '敦煌市城南5公里', rating: 4.6, priceLevel: 2, tags: '沙漠,泉,奇观', avgDurationMin: 150, openHours: '05:30-21:30', description: '沙山环抱清泉。', wiki: '鸣沙山月牙泉' },
          { id: 4263, name: '玉门关', category: 'culture', lng: 93.8700, lat: 40.3600, address: '敦煌市西北90公里', rating: 4.0, priceLevel: 2, tags: '关隘,汉长城,古迹', avgDurationMin: 180, openHours: '08:30-18:00', description: '春风不度玉门关。', wiki: '玉门关' }
        ]
      }
    ]
  },
  {
    name: '青海省',
    cities: [
      {
        name: '西宁', center: [36.6170, 101.7780],
        pois: [
          { id: 4271, name: '塔尔寺', category: 'culture', lng: 101.5700, lat: 36.4900, address: '西宁市湟中区鲁沙尔镇', rating: 4.5, priceLevel: 2, tags: '寺庙,藏传,艺术', avgDurationMin: 120, openHours: '08:00-17:30', description: '藏传佛教格鲁派名刹。', wiki: '塔尔寺' },
          { id: 4272, name: '东关清真大寺', category: 'culture', lng: 101.8000, lat: 36.6200, address: '西宁市城东区东关大街', rating: 4.2, priceLevel: 1, tags: '清真寺,伊斯兰,地标', avgDurationMin: 60, openHours: '08:00-18:00', description: '西北最大清真寺之一。', wiki: '东关清真大寺' },
          { id: 4273, name: '青海省博物馆', category: 'culture', lng: 101.7700, lat: 36.6300, address: '西宁市城西区西关大街', rating: 3.9, priceLevel: 1, tags: '博物馆,彩陶,文化', avgDurationMin: 90, openHours: '09:00-17:00', description: '河湟文明与彩陶。', wiki: '青海省博物馆' },
          { id: 4274, name: '青海湖', category: 'nature', lng: 100.2000, lat: 36.8900, address: '海北州刚察县青海湖', rating: 4.6, priceLevel: 2, tags: '湖,鸟岛,骑行', avgDurationMin: 240, openHours: '全天', description: '中国最大咸水湖。', wiki: '青海湖' }
        ]
      }
    ]
  },
  {
    name: '宁夏回族自治区',
    cities: [
      {
        name: '银川', center: [38.4870, 106.2300],
        pois: [
          { id: 4281, name: '沙湖', category: 'nature', lng: 106.3200, lat: 38.7600, address: '银川市平罗县沙湖', rating: 4.2, priceLevel: 2, tags: '湖,沙丘,候鸟', avgDurationMin: 150, openHours: '08:00-18:00', description: '塞上明珠，沙水相依。', wiki: '沙湖 (宁夏)' },
          { id: 4282, name: '镇北堡西部影城', category: 'culture', lng: 106.0300, lat: 38.5200, address: '银川市西夏区镇北堡', rating: 4.3, priceLevel: 2, tags: '影视,古城,拍照', avgDurationMin: 150, openHours: '08:30-17:30', description: '大话西游取景地。', wiki: '镇北堡西部影城' },
          { id: 4283, name: '西夏陵', category: 'culture', lng: 106.0000, lat: 38.4600, address: '银川市西夏区贺兰山', rating: 4.2, priceLevel: 2, tags: '王陵,西夏,遗迹', avgDurationMin: 120, openHours: '08:00-18:00', description: '神秘的西夏王陵。', wiki: '西夏陵' }
        ]
      }
    ]
  },
  {
    name: '新疆维吾尔自治区',
    cities: [
      {
        name: '乌鲁木齐', center: [43.8256, 87.6168],
        pois: [
          { id: 2801, name: '天山天池', category: 'nature', lng: 88.1200, lat: 43.8800, address: '昌吉州阜康市', rating: 4.6, priceLevel: 3, tags: '湖,雪山,高山', avgDurationMin: 240, openHours: '09:00-19:00', description: '雪峰映湖的高山明珠。', wiki: '天山天池' },
          { id: 2802, name: '国际大巴扎', category: 'shopping', lng: 87.6200, lat: 43.8000, address: '乌鲁木齐市天山区解放南路', rating: 4.3, priceLevel: 1, tags: '集市,民族,美食', avgDurationMin: 90, openHours: '全天', description: '中亚风情的最大集市。', wiki: '新疆国际大巴扎' },
          { id: 2803, name: '红山公园', category: 'park', lng: 87.6200, lat: 43.8100, address: '乌鲁木齐市水磨沟区红山路', rating: 4.1, priceLevel: 1, tags: '公园,地标,城市景观', avgDurationMin: 60, openHours: '全天', description: '城市中心的红山地标。', wiki: '红山公园 (乌鲁木齐)' },
          { id: 2804, name: '新疆博物馆', category: 'culture', lng: 87.5800, lat: 43.8000, address: '乌鲁木齐市沙依巴克区西北路', rating: 4.2, priceLevel: 1, tags: '博物馆,干尸,西域', avgDurationMin: 120, openHours: '10:00-18:00(周一闭馆)', description: '西域文物与楼兰干尸。', wiki: '新疆博物馆 (乌鲁木齐)' },
          { id: 2805, name: '南山', category: 'nature', lng: 87.5000, lat: 43.5000, address: '乌鲁木齐县', rating: 4.0, priceLevel: 1, tags: '草原,滑雪,避暑', avgDurationMin: 180, openHours: '全天', description: '近郊草原与滑雪场。', wiki: '南山 (乌鲁木齐)' },
          { id: 2806, name: '水磨沟', category: 'park', lng: 87.6600, lat: 43.8200, address: '乌鲁木齐市水磨沟区', rating: 3.9, priceLevel: 1, tags: '公园,温泉,溪流', avgDurationMin: 90, openHours: '全天', description: '市区内的温泉溪流公园。', wiki: '水磨沟公园' }
        ]
      },
      {
        name: '喀什', center: [39.4670, 75.9900],
        pois: [
          { id: 4291, name: '喀什古城', category: 'culture', lng: 75.9900, lat: 39.4700, address: '喀什市喀什噶尔老城', rating: 4.5, priceLevel: 1, tags: '古城,维吾尔,民俗', avgDurationMin: 150, openHours: '全天', description: '活着的西域古城。', wiki: '喀什古城' },
          { id: 4292, name: '艾提尕尔清真寺', category: 'culture', lng: 75.9900, lat: 39.4650, address: '喀什市艾提尕尔广场', rating: 4.2, priceLevel: 1, tags: '清真寺,伊斯兰,地标', avgDurationMin: 60, openHours: '08:00-22:00', description: '新疆最大清真寺。', wiki: '艾提尕尔清真寺' },
          { id: 4293, name: '帕米尔高原', category: 'nature', lng: 75.2300, lat: 38.1800, address: '喀什地区塔什库尔干县', rating: 4.4, priceLevel: 3, tags: '高原,雪山,边境', avgDurationMin: 240, openHours: '全天', description: '世界屋脊的西极。', wiki: '帕米尔高原' }
        ]
      }
    ]
  },
  {
    name: '台湾省',
    cities: [
      {
        name: '台北', center: [25.0330, 121.5650],
        pois: [
          { id: 4301, name: '台北101', category: 'culture', lng: 121.5640, lat: 25.0340, address: '台北市信义区', rating: 4.5, priceLevel: 2, tags: '地标,摩天楼,夜景', avgDurationMin: 90, openHours: '11:00-21:00', description: '台湾第一高楼。', wiki: '台北101' },
          { id: 4302, name: '台北故宫博物院', category: 'culture', lng: 121.5500, lat: 25.1020, address: '台北市士林区', rating: 4.6, priceLevel: 2, tags: '博物馆,文物,瑰宝', avgDurationMin: 150, openHours: '09:00-17:00', description: '中华文物典藏重镇。', wiki: '国立故宫博物院' },
          { id: 4303, name: '士林夜市', category: 'food', lng: 121.5500, lat: 25.0880, address: '台北市士林区', rating: 4.2, priceLevel: 2, tags: '夜市,小吃,美食', avgDurationMin: 90, openHours: '全天(夜)', description: '台湾最知名夜市。', wiki: '士林夜市' },
          { id: 4304, name: '阳明山', category: 'nature', lng: 121.5600, lat: 25.1600, address: '台北市北投区', rating: 4.1, priceLevel: 1, tags: '山,温泉,花季', avgDurationMin: 120, openHours: '全天', description: '火山地质公园。', wiki: '阳明山' }
        ]
      },
      {
        name: '高雄', center: [22.6270, 120.3010],
        pois: [
          { id: 4311, name: '打狗英国领事馆', category: 'culture', lng: 120.2700, lat: 22.6200, address: '高雄市鼓山区', rating: 4.0, priceLevel: 1, tags: '古迹,海,夜景', avgDurationMin: 60, openHours: '09:00-21:00', description: '百年洋楼临海。', wiki: '打狗英国领事馆' },
          { id: 4312, name: '驳二艺术特区', category: 'culture', lng: 120.2800, lat: 22.6200, address: '高雄市盐埕区', rating: 4.1, priceLevel: 1, tags: '艺术,仓库,文创', avgDurationMin: 90, openHours: '10:00-18:00', description: '旧仓库改造艺术区。', wiki: '驳二艺术特区' },
          { id: 4313, name: '爱河', category: 'night', lng: 120.3000, lat: 22.6300, address: '高雄市苓雅区', rating: 3.9, priceLevel: 1, tags: '河,夜景,游船', avgDurationMin: 60, openHours: '全天', description: '高雄母亲河夜景。', wiki: '爱河' }
        ]
      }
    ]
  },
  {
    name: '香港特别行政区',
    cities: [
      {
        name: '香港', center: [22.3190, 114.1690],
        pois: [
          { id: 4321, name: '维多利亚港', category: 'night', lng: 114.1730, lat: 22.2940, address: '香港九龙尖沙咀', rating: 4.6, priceLevel: 1, tags: '海港,夜景,烟花', avgDurationMin: 90, openHours: '全天', description: '世界三大夜景之一。', wiki: '维多利亚港' },
          { id: 4322, name: '太平山顶', category: 'nature', lng: 114.1550, lat: 22.2750, address: '香港岛太平山', rating: 4.5, priceLevel: 2, tags: '山,俯瞰,缆车', avgDurationMin: 120, openHours: '全天', description: '俯瞰维港全景。', wiki: '太平山顶' },
          { id: 4323, name: '香港迪士尼乐园', category: 'culture', lng: 113.9180, lat: 22.3130, address: '香港大屿山竹篙湾', rating: 4.3, priceLevel: 3, tags: '主题公园,亲子,童话', avgDurationMin: 240, openHours: '10:00-20:00', description: '欢乐童话王国。', wiki: '香港迪士尼乐园' },
          { id: 4324, name: '铜锣湾', category: 'shopping', lng: 114.1830, lat: 22.2800, address: '香港岛铜锣湾', rating: 4.1, priceLevel: 2, tags: '购物,商圈,美食', avgDurationMin: 90, openHours: '全天', description: '繁华购物街区。', wiki: '铜锣湾' }
        ]
      }
    ]
  },
  {
    name: '澳门特别行政区',
    cities: [
      {
        name: '澳门', center: [22.1990, 113.5430],
        pois: [
          { id: 4331, name: '大三巴牌坊', category: 'culture', lng: 113.5430, lat: 22.1970, address: '澳门半岛花王堂区', rating: 4.5, priceLevel: 1, tags: '古迹,教堂,地标', avgDurationMin: 60, openHours: '全天', description: '圣保禄教堂遗址。', wiki: '大三巴牌坊' },
          { id: 4332, name: '澳门威尼斯人', category: 'shopping', lng: 113.5600, lat: 22.1500, address: '澳门路氹填海区', rating: 4.3, priceLevel: 1, tags: '度假村,购物,运河', avgDurationMin: 150, openHours: '全天', description: '仿威尼斯水上小镇。', wiki: '澳门威尼斯人度假村' },
          { id: 4333, name: '妈阁庙', category: 'culture', lng: 113.5300, lat: 22.1850, address: '澳门半岛妈阁', rating: 4.1, priceLevel: 1, tags: '庙宇,妈祖,古迹', avgDurationMin: 60, openHours: '全天', description: '澳门最古老庙宇。', wiki: '妈阁庙' },
          { id: 4334, name: '澳门旅游塔', category: 'night', lng: 113.5480, lat: 22.1730, address: '澳门南湾湖', rating: 4.2, priceLevel: 2, tags: '高塔,夜景,蹦极', avgDurationMin: 90, openHours: '10:00-21:00', description: '338米观光塔。', wiki: '澳门旅游塔' }
        ]
      }
    ]
  }
];

module.exports = { PROVINCES: PROVINCES };
