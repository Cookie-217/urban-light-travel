package com.urbantravel.data;

import com.urbantravel.model.entity.Poi;
import com.urbantravel.model.entity.User;
import com.urbantravel.model.enums.Role;
import com.urbantravel.repository.PoiRepository;
import com.urbantravel.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/** 初始化示例 POI 数据与默认账号（仅在库为空时写入） */
@Component
public class DataSeeder implements CommandLineRunner {

    private final PoiRepository poiRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;

    public DataSeeder(PoiRepository poiRepository, UserRepository userRepository, BCryptPasswordEncoder encoder) {
        this.poiRepository = poiRepository;
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        if (poiRepository.count() == 0) {
            poiRepository.saveAll(buildPois());
        }
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPasswordHash(encoder.encode("admin123"));
            admin.setEmail("admin@urbantravel.com");
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
        }
        if (!userRepository.existsByUsername("demo")) {
            User demo = new User();
            demo.setUsername("demo");
            demo.setPasswordHash(encoder.encode("demo123"));
            demo.setEmail("demo@urbantravel.com");
            demo.setRole(Role.USER);
            userRepository.save(demo);
        }
    }

    private Poi p(String name, String category, double lng, double lat, String address,
                  double rating, int price, String tags, int dur, String city, String open, String desc) {
        Poi x = new Poi();
        x.setName(name); x.setCategory(category); x.setLng(lng); x.setLat(lat);
        x.setAddress(address); x.setRating(rating); x.setPriceLevel(price);
        x.setTags(tags); x.setAvgDurationMin(dur); x.setCity(city);
        x.setOpenHours(open); x.setDescription(desc);
        return x;
    }

    private List<Poi> buildPois() {
        return Arrays.asList(
            // 杭州
            p("西湖", "nature", 120.1480, 30.2590, "杭州市西湖区龙井路1号", 4.8, 1, "湖,风景,散步,骑行",
              90, "杭州", "全天", "世界文化遗产，城市绿芯，可步行或骑行环湖。"),
            p("灵隐寺", "culture", 120.1010, 30.2410, "杭州市西湖区法云弄1号", 4.7, 2, "寺庙,古迹,祈福",
              90, "杭州", "07:00-18:00", "千年古刹，背靠北高峰，禅意浓厚。"),
            p("河坊街", "food", 120.1690, 30.2440, "杭州市上城区河坊街", 4.5, 2, "小吃,古街,夜市",
              60, "杭州", "全天", "南宋御街旁的老字号小吃集中地。"),
            p("西溪湿地", "nature", 120.0630, 30.2680, "杭州市西湖区天目山路518号", 4.6, 2, "湿地,生态,船游",
              120, "杭州", "08:00-17:30", "城市湿地国家公园，秋冬芦花飞雪。"),
            p("杭州植物园", "park", 120.1260, 30.2620, "杭州市西湖区桃源岭1号", 4.4, 1, "植物,亲子,漫步",
              90, "杭州", "08:30-16:30", "草木葱茏，适合慢节奏散步。"),
            p("南宋御街", "culture", 120.1700, 30.2450, "杭州市上城区中山中路", 4.3, 2, "历史,步行街,文创",
              60, "杭州", "全天", "千年御道，串联老字号与文创小店。"),
            p("龙井村", "nature", 120.1310, 30.2040, "杭州市西湖区龙井村", 4.5, 2, "茶园,采茶,山景",
              90, "杭州", "全天", "西湖龙井原产地，春日采茶体验。"),

            // 北京
            p("故宫博物院", "culture", 116.3972, 39.9163, "北京市东城区景山前街4号", 4.9, 3, "古迹,博物馆,历史",
              180, "北京", "08:30-17:00", "明清两代皇宫，世界最大的木结构宫殿群。"),
            p("颐和园", "park", 116.2755, 39.9999, "北京市海淀区新建宫门路19号", 4.7, 2, "园林,湖,长廊",
              150, "北京", "06:30-18:00", "皇家园林，昆明湖与万寿山相映。"),
            p("南锣鼓巷", "food", 116.4030, 39.9350, "北京市东城区南锣鼓巷", 4.3, 2, "小吃,胡同,文创",
              60, "北京", "全天", "最富老北京味的胡同小吃街。"),
            p("天安门广场", "culture", 116.3976, 39.9055, "北京市东城区长安街", 4.6, 1, "地标,广场,升旗",
              60, "北京", "全天", "世界最大城市广场，清晨升旗仪式壮观。"),
            p("798艺术区", "culture", 116.4950, 39.9840, "北京市朝阳区酒仙桥路4号", 4.4, 1, "艺术,展览,工业风",
              120, "北京", "全天", "由老工厂改造的当代艺术聚集地。"),
            p("什刹海", "night", 116.3890, 39.9400, "北京市西城区什刹海", 4.3, 2, "酒吧,湖,夜景,胡同",
              120, "北京", "全天", "后海酒吧街与胡同游船，夜生活地标。"),

            // 上海
            p("外滩", "night", 121.4900, 31.2397, "上海市黄浦区中山东一路", 4.8, 1, "夜景,江景,地标",
              90, "上海", "全天", "万国建筑博览群，浦江夜景绝美。"),
            p("豫园", "culture", 121.4920, 31.2270, "上海市黄浦区安仁街218号", 4.5, 2, "园林,古迹,城隍庙",
              90, "上海", "08:30-17:00", "明代私家园林，旁有城隍庙小吃。"),
            p("南京路步行街", "shopping", 121.4780, 31.2340, "上海市黄浦区南京东路", 4.4, 2, "购物,步行街,老字号",
              60, "上海", "全天", "中华商业第一街，霓虹璀璨。"),
            p("上海博物馆", "culture", 121.4730, 31.2280, "上海市黄浦区人民大道201号", 4.6, 1, "博物馆,历史,青铜器",
              120, "上海", "09:00-17:00", "顶级中国古代艺术馆，免费预约。"),
            p("田子坊", "food", 121.4730, 31.2100, "上海市黄浦区泰康路210弄", 4.2, 2, "弄堂,小吃,文创",
              60, "上海", "全天", "石库门里弄改造的文艺集市。"),
            p("世纪公园", "park", 121.5500, 31.2190, "上海市浦东新区锦绣路1001号", 4.3, 1, "绿地,亲子,骑行",
              90, "上海", "07:00-18:00", "浦东最大的生态公园，草坪广阔。"),

            // 成都
            p("宽窄巷子", "food", 104.0560, 30.6690, "成都市青羊区金河路口", 4.5, 2, "小吃,茶馆,古街",
              90, "成都", "全天", "由宽巷子、窄巷子、井巷子组成的老成都院落。"),
            p("锦里", "food", 104.0610, 30.6410, "成都市武侯区武侯祠大街231号", 4.4, 2, "小吃,三国,古街",
              60, "成都", "全天", "川西风情古街，紧邻武侯祠。"),
            p("大熊猫繁育研究基地", "nature", 104.1460, 30.7330, "成都市成华区熊猫大道1375号", 4.8, 2, "熊猫,亲子,萌宠",
              180, "成都", "07:30-18:00", "近距离看国宝大熊猫的必去之地。"),
            p("武侯祠", "culture", 104.0590, 30.6420, "成都市武侯区武侯祠大街231号", 4.4, 2, "三国,古迹,祠堂",
              90, "成都", "08:00-21:00", "中国唯一的君臣合祀祠庙，三国文化圣地。"),
            p("春熙路", "shopping", 104.0810, 30.6570, "成都市锦江区春熙路", 4.3, 2, "购物,商圈,地标",
              60, "成都", "全天", "成都最繁华的商业中心。"),
            p("杜甫草堂", "culture", 104.0250, 30.6580, "成都市青羊区青华路37号", 4.3, 2, "诗人,园林,古迹",
              90, "成都", "08:00-18:00", "诗圣杜甫流寓成都的居所，竹林清幽。"),

            // 深圳
            p("世界之窗", "culture", 113.9730, 22.5370, "深圳市南山区深南大道9037号", 4.2, 3, "微缩景观,主题公园",
              180, "深圳", "09:00-21:30", "汇聚世界名胜微缩景观的主题公园。"),
            p("深圳湾公园", "park", 113.9500, 22.5200, "深圳市南山区滨海大道", 4.6, 1, "海滨,骑行,红树林,观鸟",
              120, "深圳", "全天", "滨海休闲带，骑行观海看候鸟。"),
            p("欢乐海岸", "night", 113.9600, 22.5300, "深圳市南山区白石路东8号", 4.3, 2, "夜景,购物,美食,水秀",
              120, "深圳", "全天", "都市亲水商业区，夜晚水秀表演。"),
            p("莲花山公园", "park", 114.0700, 22.5600, "深圳市福田区红荔路6030号", 4.5, 1, "风筝,城市景观,邓小平像",
              90, "深圳", "06:00-23:00", "登顶可俯瞰市中心CBD全景。"),
            p("华侨城创意文化园", "culture", 113.9800, 22.5400, "深圳市南山区锦绣北街", 4.2, 1, "文创,展览,旧厂房",
              90, "深圳", "全天", "OCT-LOFT，文艺青年打卡地。"),
            p("东门老街", "food", 114.1230, 22.5470, "深圳市罗湖区东门中路", 4.1, 2, "小吃,老街,批发",
              60, "深圳", "全天", "深圳历史最久的商业街区，烟火气十足。")
        );
    }
}
