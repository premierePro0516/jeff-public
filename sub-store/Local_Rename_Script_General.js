// July 20, 2026: 1）Gemini created js script with nodes renaming.
//                2) 更广泛的通用性 & 反引号多行正则排版.
/**
 * 机场节点全兼容精简、1及以下倍率保留、国旗Emoji字符防降级与补全独立脚本
 * 适用环境：Sub-Store 脚本操作
 */

function operator(proxies) {
  // ==================== 1. 自定义配置项 ====================
  const FNAME = "机场名"; // 在这里修改你的机场名字
  const FGF = " | ";      // 自定义分隔符

  // 多行构建“其它”地区的匹配模式
  const otherRegionPattern = `
    加|CA|印尼|ID|印|IN|India|泰|TH|韩|KR|英|UK|法|FR|德|DE|土|TR|
    摩尔多瓦|MD|乌克兰|UA|意大利|IT|匈牙利|HU|西班牙|ES|荷兰|NL|
    阿根廷|AR|巴西|BR|智利|CL|澳大利亚|AU|新西兰|NZ|越南|VN|
    巴基斯坦|PK|以色列|IL|阿联酋|AE|菲律宾|PH|马来西亚|MY|埃及|EG|尼日利亚|NG
  `.replace(/\s+/g, "");

  // 地区白名单：配置各地区的正则匹配、中文名称以及对应的标准 Emoji 国旗
  const regions = [
    { key: "港", cn: "香港", flag: "🇭🇰", regex: /港|HK|Hong\s*Kong/i },
    { key: "台", cn: "台湾", flag: "🇹🇼", regex: /台|TW|Tai\s*wan/i },
    { key: "新", cn: "新加坡", flag: "🇸🇬", regex: /新加坡|狮城|SG|Singapore/i },
    // ⚠️ 防混淆重点：日本仅精确匹配 日/川崎/东京/大阪/JP/JPN/Japan，严禁误触 NG/Nigeria/尼日利亚
    { key: "日", cn: "日本", flag: "🇯🇵", regex: /日本|川崎|东京|大阪|JP|JPN|Japan/i },
    { key: "美", cn: "美国", flag: "🇺🇸", regex: /美国|波特兰|硅谷|俄勒冈|US|United\s*States|America/i },
    { key: "其它", cn: "", flag: "", regex: new RegExp(otherRegionPattern, "i") }
  ];

  // 常见小众国家（其它分区）的默认国旗与中文映射字典
  const otherDict = [
    // ⚠️ 印度与印尼防误判（印度在前，负向先行断言排除“尼”）
    { regex: /印(?!\s*尼)|IN|India/i, cn: "印度", flag: "🇮🇳" },
    { regex: /印尼|ID|Indonesia/i, cn: "印尼", flag: "🇮🇩" },
    
    // ⚠️ 尼日利亚专属防混淆匹配（NG/Nigeria/尼日利亚）
    { regex: /尼日利亚|NG|Nigeria/i, cn: "尼日利亚", flag: "🇳🇬" },

    // 更多常用国家/地区配置
    { regex: /加|CA|Canada/i, cn: "加拿大", flag: "🇨🇦" },
    { regex: /韩|KR|Korea/i, cn: "韩国", flag: "🇰🇷" },
    { regex: /英|UK|Great\s*Britain/i, cn: "英国", flag: "🇬🇧" },
    { regex: /德|DE|Germany/i, cn: "德国", flag: "德" },
    { regex: /法|FR|France/i, cn: "法国", flag: "🇫🇷" },
    { regex: /荷|NL|Netherlands/i, cn: "荷兰", flag: "🇳🇱" },
    { regex: /澳|AU|Australia/i, cn: "澳大利亚", flag: "🇦🇺" },
    { regex: /泰|TH|Thailand/i, cn: "泰国", flag: "🇹🇭" },
    { regex: /土|TR|Turkey/i, cn: "土耳其", flag: "🇹🇷" },
    { regex: /摩尔多瓦|MD|Moldova/i, cn: "摩尔多瓦", flag: "🇲🇩" },
    { regex: /乌克兰|UA|Ukraine/i, cn: "乌克兰", flag: "🇺🇦" },
    { regex: /意|IT|Italy|意大利/i, cn: "意大利", flag: "🇮🇹" },
    { regex: /匈牙利|HU|Hungary/i, cn: "匈牙利", flag: "🇭🇺" },
    { regex: /西班牙|ES|Spain/i, cn: "西班牙", flag: "🇪🇸" },
    { regex: /阿根廷|AR|Argentina/i, cn: "阿根廷", flag: "🇦🇷" },
    { regex: /巴西|BR|Brazil/i, cn: "巴西", flag: "🇧🇷" },
    { regex: /智利|CL|Chile/i, cn: "智利", flag: "🇨🇱" },
    { regex: /新西兰|NZ|New\s*Zealand/i, cn: "新西兰", flag: "🇳🇿" },
    { regex: /越南|VN|Vietnam/i, cn: "越南", flag: "🇻🇳" },
    { regex: /巴基斯坦|PK|Pakistan/i, cn: "巴基斯坦", flag: "🇵🇰" },
    { regex: /以色列|IL|Israel/i, cn: "以色列", flag: "🇮🇱" },
    { regex: /阿联酋|AE|UAE/i, cn: "阿联酋", flag: "🇦🇪" },
    { regex: /菲律宾|PH|Philippines/i, cn: "菲律宾", flag: "🇵🇭" },
    { regex: /马来西亚|MY|Malaysia/i, cn: "马来西亚", flag: "🇲🇾" },
    { regex: /埃及|EG|Egypt/i, cn: "埃及", flag: "🇪🇬" }
  ];

  // 🛑 扩展黑名单（使用反引号 `` 换行排版）
  const blacklistKeywords = `
    邀请|返利|循环|官网|客服|网站|网址|获取|订阅|机场|下次|版本|官址|备用|已用|联系|邮箱|工单|
    贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|使用|提示|特别|访问|支持|教程|关注|更新|作者|
    加入|USE|USED|TOTAL|EMAIL|Panel|Channel|Author|防失联|kqs|官方|群|重置
  `.replace(/\s+/g, ""); 

  const blacklistRegex = new RegExp(blacklistKeywords, "i");

  // ==================== 2. 初始化分类容器 ====================
  let infoNodes = [];
  let regionPools = { "港": [], "台": [], "新": [], "日": [], "美": [], "其它": [] };

  // 国旗 Unicode 提取正则
  const flagRegex = /\uD83C[\uDDE6-\uDDFF]{2}/g;

  // ==================== 3. 遍历、过滤与重命名 ====================
  proxies.forEach((proxy) => {
    if (!proxy || !proxy.name) return;
    
    let name = proxy.name.trim();

    // 🌟 1. 信息节点打捞与格式化
    if (/Traffic|Expire|剩余流量|套餐到期/i.test(name)) {
      name = name.replace(/^Traffic\s*:\s*/i, "剩余流量：")
                 .replace(/^Expire\s*:\s*/i, "套餐到期：")
                 .replace(flagRegex, "")
                 .trim(); 
      // 这里的 🔔 无论原名有没有国旗，都能保证百分之百加进去！
      proxy.name = `${FNAME}${FGF}🔔 ${name}`;
      infoNodes.push(proxy);
      return; 
    }

    // 🛑 2. 清洗黑名单（命中直接丢弃）
    if (blacklistRegex.test(name)) {
      return; 
    }

    // 🌍 3. 地区识别、倍率过滤与格式重组
    for (const region of regions) {
      if (region.regex.test(name)) {
        
        let targetCn = region.cn;
        let finalFlag = region.flag;

        if (!region.cn) {
          for (const item of otherDict) {
            if (item.regex.test(name)) {
              targetCn = item.cn;
              finalFlag = item.flag;
              break;
            }
          }
        }

        // 🧼 清洗步骤：保留 <= 1 的倍率（如 0.5x, 1x），并暂存
        const multMatch = name.match(/(?:0\.\d+|1(?:\.0+)?)\s*[xX×倍]/i);
        const multStr = multMatch ? ` ${multMatch[0]}` : "";

        // 🧼 步骤 A：清洗基础杂质
        let cleanText = name
          .replace(flagRegex, " ") 
          .replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]/g, " ") 
          .replace(/VIP|高速|专线|流媒体|实验性|高级|标准|IEPL/ig, " ")
          .replace(/(?:CTCUCM|CTCU|CMCU|CUCM|BGP|CMCC|CT|CU|CM)/ig, " ")
          .replace(/[\[\(（【][^\]\)）】]*[\]\)）】]/g, " ");

        // 补全标准中文名
        if (targetCn && !cleanText.includes(targetCn)) {
          cleanText = cleanText.replace(new RegExp(region.regex.source, "i"), targetCn);
        }

        // 🧼 步骤 B：彻底抹掉所有旧数字（如 1, 2, 01）和倍率，只留纯名称主体
        cleanText = cleanText
          .replace(/(?:0\.\d+|1(?:\.0+)?)\s*[xX×倍]/gi, " ") // 先抹倍率
          .replace(/\d+/g, " ")                              // 抹掉所有旧数字
          .replace(/[\-_|]+/g, " ")                          // 把 - _ | 换成空格
          .replace(/\s+/g, " ")                              // 清理多余空格
          .trim();

        // 避免出现“香香港”
        if (targetCn && !cleanText.includes(targetCn)) {
          cleanText = cleanText.replace(new RegExp(region.regex.source, "i"), targetCn);
        }

        cleanText = cleanText.replace(/[\-_|]+/g, " ").replace(/\s+/g, " ").trim();

        // 🔒 组装：拼装纯净基础名，挂载暂存的倍率
        proxy.name = `${FNAME}${FGF}${finalFlag} ${cleanText}${multStr}`.trim();
        regionPools[region.key].push(proxy);
        break; 
      }
    }
  });

  // ==================== ✨ 3.5 节点重名自动去重编号 (01, 02, 03...) ====================
  Object.keys(regionPools).forEach((key) => {
    const nameCounts = {}; // 统计每个名字出现的总次数
    
    // 第一遍：统计频次
    regionPools[key].forEach((proxy) => {
      nameCounts[proxy.name] = (nameCounts[proxy.name] || 0) + 1;
    });

    // 第二遍：统一按 01, 02, 03 顺序平滑编号
    const nameTracker = {};
    regionPools[key].forEach((proxy) => {
      const originName = proxy.name;
      
      // 提取先前保留的倍率（如 0.5x）
      const multMatch = originName.match(/(?:0\.\d+|1(?:\.0+)?)\s*[xX×倍]/i);
      const multStr = multMatch ? ` ${multMatch[0]}` : "";
      
      // 去掉倍率后的纯文本
      const pureBaseName = originName.replace(/(?:0\.\d+|1(?:\.0+)?)\s*[xX×倍]/gi, "").trim();

      if (nameCounts[originName] > 1) {
        nameTracker[originName] = (nameTracker[originName] || 0) + 1;
        const numStr = String(nameTracker[originName]).padStart(2, '0'); 
        proxy.name = `${pureBaseName} ${numStr}${multStr}`;
      }
    });
  }); 
  
  // ==================== 4. 分区内自然排序 ====================
  Object.keys(regionPools).forEach((key) => {
    regionPools[key].sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN', { numeric: true }));
  });

  // ==================== 5. 组装最终结果 ====================
  return [
    ...infoNodes,
    ...regionPools["港"],
    ...regionPools["台"],
    ...regionPools["新"],
    ...regionPools["日"],
    ...regionPools["美"],
    ...regionPools["其它"]
  ];
}