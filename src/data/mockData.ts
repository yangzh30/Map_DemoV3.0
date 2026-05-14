import {
  LeadItem, OpportunityItem, OrderItem, STIDataPoint, SODataPoint,
  TwoAssociationsItem, ChannelPartner, ChatMessage, RegionPerformance,
  NewsItem, VisitItem, BidItem, TaskItem, ChatSession, LogisticsCardData, ProductionCardData,
  PartnerVisit, CpsIndicator
} from '../types'

export const territoryManagerInfo = { name: '张经理', role: '辖区经理', region: '上海战区 - 浦东辖区' }
export const hqManagerInfo = { name: '李经理', role: '总部销售管理总监', region: '全国' }

export const mockNews: NewsItem[] = [
  { id: 1, text: 'IDC：2026年Q1全球PC出货同比增长2.5%，美洲市场下滑3.3%', time: '今日', tag: '市场', tagColor: '#3b82f6', url: 'https://www.ithome.com/tags/PC/' },
  { id: 2, text: 'Gartner：DRAM与SSD全年价格涨幅将达130%，入门级PC市场面临毁灭', time: '今日', tag: '供应链', tagColor: '#ef4444', url: 'https://www.ithome.com/0/924/484.htm' },
  { id: 3, text: 'Omdia：2025年中国PC市场同比增长6%，2026年预计下滑10%', time: '昨日', tag: '市场', tagColor: '#3b82f6', url: 'http://finance.sina.cn/tech/2026-04-09/detail-inhtxcut8696215.d.html' },
  { id: 4, text: '2026年1-2月中国笔记本线上零售销量同比暴跌40.5%', time: '昨日', tag: '销售', tagColor: '#f59e0b', url: 'https://m.21jingji.com/article/20260408/herald/eaf3603f92d9c830a6782d644a18e7db.html' },
  { id: 5, text: '内存短缺持续：日本多家PC整机厂商大幅延长交付周期', time: '前日', tag: '供应链', tagColor: '#ef4444', url: 'https://www.ithome.com/tags/PC/' },
  { id: 6, text: '2026年全球PC出货量预计同比下滑11.3%，AI PC渗透率突破52%', time: '前日', tag: '趋势', tagColor: '#10b981', url: 'https://browser.qq.com/mobile/news?doc_id=70869c0137b93252' },
  { id: 7, text: 'Win10停服+内存涨价双重冲击，企业PC采购窗口正在收窄', time: '4/6', tag: '商机', tagColor: '#8b5cf6', url: 'https://www.ithome.com/0/912/957.htm' },
  { id: 8, text: '中国PC市场2026年出货量预计4222万台，AI PC激增146.5%', time: '4/5', tag: '趋势', tagColor: '#10b981', url: 'https://browser.qq.com/mobile/news?doc_id=70869c0137b93252' },
]

export const mockVisits: VisitItem[] = [
  { id: 'V-001', companyName: '中芯国际', contact: '黄总', purpose: '初次拜访，介绍联想ThinkSystem服务器方案', date: '2026-05-07', time: '09:30', status: '待拜访', address: '浦东新区张江路18号' },
  { id: 'V-002', companyName: '韦尔股份', contact: '马总', purpose: '智慧工厂项目需求深化沟通', date: '2026-05-07', time: '14:00', status: '待拜访', address: '浦东新区张江高科技园区' },
  { id: 'V-003', companyName: '华勤技术', contact: '赵总监', purpose: '数据中心二期扩容方案汇报', date: '2026-05-08', time: '10:00', status: '待拜访', address: '浦东新区科苑路399号' },
  { id: 'V-004', companyName: '神州数码', contact: '周总', purpose: '季度业务回顾及下季度订货计划', date: '2026-05-06', time: '15:30', status: '已拜访', address: '浦东新区世纪大道88号' },
  { id: 'V-005', companyName: '芯原股份', contact: '赵总监', purpose: '芯片设计EDA平台IT设备需求调研', date: '2026-05-09', time: '09:00', status: '待拜访', address: '浦东新区松涛路560号' },
  { id: 'V-006', companyName: '上海金陵网络', contact: '姚经理', purpose: '政府集采项目合作洽谈', date: '2026-05-10', time: '10:00', status: '待拜访', address: '浦东新区张杨路550号' },
]

export const mockBids: BidItem[] = [
  { id: 'B-001', title: '上海市卫健委2026年IT设备采购项目', publishOrg: '上海市政府采购中心', budget: 5800000, deadline: '2026-05-20', matchScore: 92, status: '可投标', industry: '医疗' },
  { id: 'B-002', title: '浦东新区大数据中心服务器集群采购', publishOrg: '浦东新区科委', budget: 12800000, deadline: '2026-05-25', matchScore: 88, status: '可投标', industry: '政务' },
  { id: 'B-003', title: '浦东新区教育局智慧校园终端设备采购', publishOrg: '上海市教委', budget: 3200000, deadline: '2026-05-18', matchScore: 85, status: '可投标', industry: '教育' },
  { id: 'B-004', title: '上海浦东发展银行网点IT设备升级项目', publishOrg: '浦发银行总行', budget: 4500000, deadline: '2026-05-15', matchScore: 91, status: '已投标', industry: '金融' },
  { id: 'B-005', title: '上海自贸区政务云扩容服务器采购', publishOrg: '上海自贸区管委会', budget: 6800000, deadline: '2026-05-12', matchScore: 78, status: '已投标', industry: '政务' },
  { id: 'B-006', title: '浦东张江科学城制造业数字化转型设备采购', publishOrg: '张江科学城建设办', budget: 2600000, deadline: '2026-05-08', matchScore: 81, status: '已过期', industry: '制造业' },
]

export const mockTasks: TaskItem[] = [
  { id: 'T-001', content: '完成中芯国际需求调研报告', priority: '高', dueDate: '2026-05-08', status: '待处理', relatedCompany: '中芯国际' },
  { id: 'T-002', content: '提交浦发银行投标文件', priority: '高', dueDate: '2026-05-13', status: '处理中', relatedCompany: '浦发银行' },
  { id: 'T-003', content: '审核伟仕佳杰金牌升级材料', priority: '中', dueDate: '2026-05-10', status: '待处理', relatedCompany: '伟仕佳杰' },
  { id: 'T-004', content: '跟进华勤技术数据中心方案报价', priority: '高', dueDate: '2026-05-09', status: '处理中', relatedCompany: '华勤技术' },
  { id: 'T-005', content: '更新上海市软件行业协会会员联系名录', priority: '低', dueDate: '2026-05-15', status: '待处理' },
  { id: 'T-006', content: '处理上海翎云科技注册伙伴激活流程', priority: '中', dueDate: '2026-05-08', status: '待处理', relatedCompany: '上海翎云科技' },
]

export const mockInitSessions: ChatSession[] = [
  {
    id: 'session-1', title: '订单产出时间查询', lastMessage: 'E011847924 生产中', time: '今天 10:30',
    messages: [
      { id: 's1-1', role: 'user', content: '订单 E011847924什么时候可以产出', sessionId: 'session-1' },
      { id: 's1-2', role: 'assistant', content: '订单 E011847924（ThinkPad X1 Carbon Gen 12 × 50台）当前状态：排产中，预计产出时间 2026-05-25，预计交付 2026-05-25。已加急处理。', sessionId: 'session-1' }
    ]
  },
  {
    id: 'session-2', title: '物流追踪', lastMessage: 'E012320880 运输中', time: '今天 09:15',
    messages: [
      { id: 's2-1', role: 'user', content: 'E012320880 订单物流情况查询', sessionId: 'session-2' },
      { id: 's2-2', role: 'assistant', content: '订单 E012320880（ThinkSystem SR650 V3 × 8台）当前运输中，顺丰物流 SF1234567890，当前位置上海市浦东分拣中心，预计5月8日14:00送达。', sessionId: 'session-2' }
    ]
  },
  {
    id: 'session-3', title: '渠道政策咨询', lastMessage: 'SMB渠道伙伴返点政策', time: '昨天 16:00',
    messages: [
      { id: 's3-1', role: 'user', content: '现在渠道伙伴的返点政策是怎样的？', sessionId: 'session-3' },
      { id: 's3-2', role: 'assistant', content: 'SMB渠道伙伴等级与返点政策（2026 Q2）：钻石（季STI≥500台，返点6.5%）、金牌（≥200台，5.0%）、银牌（≥100台，3.5%）、铜牌（≥50台，2.0%）、注册（<50台，1.0%）。当前您辖区钻石伙伴2家，金牌2家。', sessionId: 'session-3' }
    ]
  },
  {
    id: 'session-4', title: 'SN查SO', lastMessage: 'SN→SO查询', time: '昨天 14:30',
    messages: [
      { id: 's4-1', role: 'user', content: '通过SN号查SO号 SN20260501001', sessionId: 'session-4' },
      { id: 's4-2', role: 'assistant', content: 'SN SN20260501001 对应的SO号为 SO-2026-05821，关联订单 E011847924，产品 ThinkPad X1 Carbon Gen 12，当前激活状态：已激活。', sessionId: 'session-4' }
    ]
  },
]

export const mockSNtoSO: { sn: string; soNumber: string; orderId: string; product: string; activated: boolean }[] = [
  { sn: 'SN20260501001', soNumber: 'SO-2026-05821', orderId: 'E011847924', product: 'ThinkPad X1 Carbon Gen 12', activated: true },
  { sn: 'SN20260428002', soNumber: 'SO-2026-04890', orderId: 'E012320880', product: 'ThinkSystem SR650 V3', activated: false },
  { sn: 'SN20260425003', soNumber: 'SO-2026-04512', orderId: 'E012498733', product: 'ThinkPad T14 Gen 6', activated: true },
  { sn: 'SN20260420004', soNumber: 'SO-2026-04108', orderId: 'E011596720', product: 'ThinkCentre M75q Gen5', activated: true },
  { sn: 'SN20260502005', soNumber: 'SO-2026-05933', orderId: 'E011596719', product: 'ThinkBook 16 G7+', activated: false },
]

export const mockLeads: LeadItem[] = [
  { id: 'LD-20260506', companyName: '中芯国际', contact: '黄总', phone: '138****1234', source: '官网', status: '新线索', createTime: '2026-05-06', estimatedValue: 3800000, industry: '半导体' },
  { id: 'LD-20260505', companyName: '沐曦股份', contact: '杨经理', phone: '186****5678', source: 'IS Sales', status: '新线索', createTime: '2026-05-05', estimatedValue: 720000, industry: 'GPU芯片' },
  { id: 'LD-20260503', companyName: '华勤技术', contact: '马总', phone: '139****9012', source: '转介绍', status: '跟进中', createTime: '2026-05-03', estimatedValue: 4500000, industry: 'ODM' },
  { id: 'LD-20260501', companyName: '盛美半导体', contact: '王总', phone: '138****6789', source: '官网', status: '跟进中', createTime: '2026-05-01', estimatedValue: 1200000, industry: '半导体设备' },
  { id: 'LD-20260430', companyName: '安集微电子', contact: '赵总监', phone: '177****3456', source: '园区活动', status: '跟进中', createTime: '2026-04-30', estimatedValue: 2800000, industry: '半导体材料' },
  { id: 'LD-20260428', companyName: '智元机器人', contact: '李经理', phone: '186****8901', source: 'IS Sales', status: '跟进中', createTime: '2026-04-28', estimatedValue: 850000, industry: '具身智能' },
  { id: 'LD-20260427', companyName: '燧原科技', contact: '郑总', phone: '158****7890', source: '渠道推荐', status: '跟进中', createTime: '2026-04-27', estimatedValue: 1650000, industry: 'AI算力' },
  { id: 'LD-20260425', companyName: '芯原股份', contact: '陈总', phone: '139****4567', source: '400电话', status: '已转化', createTime: '2026-04-25', estimatedValue: 500000, industry: '芯片设计服务' },
  { id: 'LD-20260424', companyName: '上海微电子', contact: '林主任', phone: '136****0123', source: '转介绍', status: '已转化', createTime: '2026-04-24', estimatedValue: 920000, industry: '光刻设备' },
  { id: 'LD-20260422', companyName: '浦发银行', contact: '赵总监', phone: '158****2345', source: '渠道推荐', status: '跟进中', createTime: '2026-04-22', estimatedValue: 2100000, industry: '金融' },
  { id: 'LD-20260420', companyName: '振华重工', contact: '刘总', phone: '177****0123', source: '园区活动', status: '跟进中', createTime: '2026-04-20', estimatedValue: 680000, industry: '港口机械' },
  { id: 'LD-20260418', companyName: '中远海发', contact: '周经理', phone: '136****5678', source: '官网', status: '跟进中', createTime: '2026-04-18', estimatedValue: 1500000, industry: '航运' },
  { id: 'LD-20260416', companyName: '韦尔股份', contact: '吴总', phone: '185****4567', source: '官网', status: '已转化', createTime: '2026-04-16', estimatedValue: 560000, industry: 'CIS芯片' },
  { id: 'LD-20260415', companyName: '浦东金桥', contact: '孙总', phone: '185****3456', source: 'IS Sales', status: '已关闭', createTime: '2026-04-15', estimatedValue: 300000, industry: '园区运营' },
  { id: 'LD-20260412', companyName: '阿斯利康（浦东）', contact: '吴总监', phone: '132****7890', source: '400电话', status: '跟进中', createTime: '2026-04-12', estimatedValue: 950000, industry: '生物医药' },
  { id: 'LD-20260410', companyName: '博睿康医疗', contact: '姚经理', phone: '156****8901', source: '园区活动', status: '新线索', createTime: '2026-04-10', estimatedValue: 1800000, industry: '脑机接口' },
]

export const mockOpportunities: OpportunityItem[] = [
  { id: 'OPP-20260506', name: '中芯国际服务器集群采购', companyName: '中芯国际', contact: '黄总', source: '官网', stage: '初步接触', probability: 15, expectedAmount: 3800000, expectedCloseDate: '2026-08-01', owner: '张经理' },
  { id: 'OPP-20260503', name: '华勤技术数据中心项目', companyName: '华勤技术', contact: '马总', source: '转介绍', stage: '需求确认', probability: 35, expectedAmount: 4500000, expectedCloseDate: '2026-07-15', owner: '张经理' },
  { id: 'OPP-20260501', name: '盛美半导体工作站采购', companyName: '盛美半导体', contact: '王总', source: '官网', stage: '方案报价', probability: 60, expectedAmount: 1200000, expectedCloseDate: '2026-06-15', owner: '张经理' },
  { id: 'OPP-20260430', name: '安集微电子EDA平台建设', companyName: '安集微电子', contact: '赵总监', source: '园区活动', stage: '需求确认', probability: 30, expectedAmount: 2800000, expectedCloseDate: '2026-08-15', owner: '张经理' },
  { id: 'OPP-20260428', name: '智元机器人办公设备升级', companyName: '智元机器人', contact: '李经理', source: 'IS Sales', stage: '方案报价', probability: 50, expectedAmount: 850000, expectedCloseDate: '2026-07-01', owner: '张经理' },
  { id: 'OPP-20260427', name: '燧原科技AI算力服务器', companyName: '燧原科技', contact: '郑总', source: '渠道推荐', stage: '商务谈判', probability: 70, expectedAmount: 1650000, expectedCloseDate: '2026-06-10', owner: '张经理' },
  { id: 'OPP-20260424', name: '芯原股份工作站采购', companyName: '芯原股份', contact: '林主任', source: '转介绍', stage: '赢单', probability: 100, expectedAmount: 920000, expectedCloseDate: '2026-05-08', owner: '张经理' },
  { id: 'OPP-20260420', name: '浦发银行数据中心建设', companyName: '浦发银行', contact: '赵总监', source: '渠道推荐', stage: '商务谈判', probability: 75, expectedAmount: 2100000, expectedCloseDate: '2026-05-30', owner: '张经理' },
  { id: 'OPP-20260416', name: '韦尔股份设计工作站', companyName: '韦尔股份', contact: '吴总', source: '官网', stage: '赢单', probability: 100, expectedAmount: 560000, expectedCloseDate: '2026-05-12', owner: '张经理' },
  { id: 'OPP-20260415', name: '上海微电子光刻车间IT基础设施', companyName: '上海微电子', contact: '陈总', source: '400电话', stage: '赢单', probability: 100, expectedAmount: 500000, expectedCloseDate: '2026-05-10', owner: '张经理' },
  { id: 'OPP-20260410', name: '振华重工智慧港口项目', companyName: '振华重工', contact: '刘总', source: '园区活动', stage: '初步接触', probability: 20, expectedAmount: 680000, expectedCloseDate: '2026-08-01', owner: '张经理' },
  { id: 'OPP-20260405', name: '中远海发IT基础设施升级', companyName: '中远海发', contact: '周经理', source: '官网', stage: '需求确认', probability: 45, expectedAmount: 1500000, expectedCloseDate: '2026-07-15', owner: '张经理' },
]

export const mockSTIData: STIDataPoint[] = [
  { month: '1月', 目标: 800, 实际: 720 }, { month: '2月', 目标: 750, 实际: 680 },
  { month: '3月', 目标: 900, 实际: 850 }, { month: '4月', 目标: 950, 实际: 1020 },
  { month: '5月', 目标: 1000, 实际: 1100 }, { month: '6月', 目标: 1050, 实际: 0 },
]

export const mockSOData: SODataPoint[] = [
  { month: '1月', 激活量: 520, 目标: 600 }, { month: '2月', 激活量: 480, 目标: 550 },
  { month: '3月', 激活量: 650, 目标: 650 }, { month: '4月', 激活量: 780, 目标: 700 },
  { month: '5月', 激活量: 850, 目标: 800 }, { month: '6月', 激活量: 0, 目标: 900 },
]

export const mockTwoAssociations: TwoAssociationsItem[] = [
  { id: 'TA-001', name: '上海软件行业协会', type: '协会', contactPerson: '周会长', memberCount: 350, potentialCustomers: 42, lastActivity: '2026-04-28', status: '洽谈中' },
  { id: 'TA-002', name: '浦东新区商会', type: '商会', contactPerson: '钱秘书长', memberCount: 500, potentialCustomers: 68, lastActivity: '2026-05-02', status: '洽谈中' },
  { id: 'TA-003', name: '张江高科技园区', type: '园区', contactPerson: '郑主任', memberCount: 280, potentialCustomers: 55, lastActivity: '2026-04-30', status: '待开发' },
  { id: 'TA-004', name: '上海人工智能协会', type: '协会', contactPerson: '赵副会长', memberCount: 420, potentialCustomers: 35, lastActivity: '2026-04-25', status: '洽谈中' },
  { id: 'TA-005', name: '金桥出口加工区', type: '园区', contactPerson: '吴主任', memberCount: 380, potentialCustomers: 50, lastActivity: '2026-04-20', status: '待开发' },
  { id: 'TA-006', name: '浦东青年商会', type: '商会', contactPerson: '孙会长', memberCount: 200, potentialCustomers: 28, lastActivity: '2026-05-01', status: '待开发' },
  { id: 'TA-007', name: '上海浦东软件园', type: '园区', contactPerson: '韩主任', memberCount: 510, potentialCustomers: 72, lastActivity: '2026-05-04', status: '已签约' },
  { id: 'TA-008', name: '上海漕河泾远中产业园', type: '园区', contactPerson: '李秘书长', memberCount: 280, potentialCustomers: 38, lastActivity: '2026-04-29', status: '已签约' },
]

export const mockChannelPartners: ChannelPartner[] = [
  { id: 'CH-001', name: '神州数码', level: '钻石', contactPerson: '周总', monthlySTI: 650, monthlySO: 520, lockRate: 82, attachRate: 58, status: '活跃' },
  { id: 'CH-002', name: '联强国际', level: '钻石', contactPerson: '李总', monthlySTI: 580, monthlySO: 490, lockRate: 80, attachRate: 55, status: '活跃' },
  { id: 'CH-003', name: '上海金陵网络', level: '金牌', contactPerson: '王经理', monthlySTI: 350, monthlySO: 280, lockRate: 72, attachRate: 45, status: '活跃' },
  { id: 'CH-004', name: '伟仕佳杰', level: '金牌', contactPerson: '何总', monthlySTI: 420, monthlySO: 340, lockRate: 75, attachRate: 48, status: '活跃' },
  { id: 'CH-005', name: '上海康硕信息', level: '银牌', contactPerson: '陈总', monthlySTI: 180, monthlySO: 130, lockRate: 62, attachRate: 35, status: '活跃' },
  { id: 'CH-006', name: '上海翎云科技', level: '银牌', contactPerson: '张经理', monthlySTI: 155, monthlySO: 105, lockRate: 58, attachRate: 30, status: '一般' },
  { id: 'CH-007', name: '上海贝加信息', level: '铜牌', contactPerson: '郑经理', monthlySTI: 95, monthlySO: 65, lockRate: 50, attachRate: 28, status: '一般' },
  { id: 'CH-008', name: '英迈中国', level: '铜牌', contactPerson: '刘总监', monthlySTI: 72, monthlySO: 45, lockRate: 42, attachRate: 18, status: '一般' },
  { id: 'CH-009', name: '上海赢家信息', level: '注册', contactPerson: '金经理', monthlySTI: 48, monthlySO: 22, lockRate: 35, attachRate: 12, status: '沉默' },
  { id: 'CH-010', name: '上海华信科技', level: '注册', contactPerson: '戴总', monthlySTI: 35, monthlySO: 18, lockRate: 30, attachRate: 10, status: '沉默' },
  { id: 'CH-011', name: '上海东讯科技', level: '金牌', contactPerson: '孙总', monthlySTI: 380, monthlySO: 310, lockRate: 74, attachRate: 42, status: '活跃' },
  { id: 'CH-012', name: '上海辰晔信息', level: '金牌', contactPerson: '王总监', monthlySTI: 290, monthlySO: 235, lockRate: 68, attachRate: 38, status: '活跃' },
  { id: 'CH-013', name: '上海致柏商贸', level: '银牌', contactPerson: '李经理', monthlySTI: 165, monthlySO: 120, lockRate: 60, attachRate: 32, status: '活跃' },
  { id: 'CH-014', name: '上海恒盈科技', level: '银牌', contactPerson: '张总', monthlySTI: 140, monthlySO: 95, lockRate: 55, attachRate: 28, status: '一般' },
  { id: 'CH-015', name: '上海智远科技', level: '铜牌', contactPerson: '赵总', monthlySTI: 88, monthlySO: 55, lockRate: 48, attachRate: 25, status: '一般' },
  { id: 'CH-016', name: '上海联创世纪', level: '铜牌', contactPerson: '钱经理', monthlySTI: 65, monthlySO: 40, lockRate: 40, attachRate: 20, status: '一般' },
  { id: 'CH-017', name: '上海博睿信息', level: '注册', contactPerson: '吴总', monthlySTI: 42, monthlySO: 20, lockRate: 32, attachRate: 10, status: '沉默' },
  { id: 'CH-018', name: '上海云图科技', level: '注册', contactPerson: '陈经理', monthlySTI: 38, monthlySO: 16, lockRate: 28, attachRate: 8, status: '沉默' },
  { id: 'CH-019', name: '上海华勤信息', level: '银牌', contactPerson: '马总', monthlySTI: 175, monthlySO: 135, lockRate: 64, attachRate: 36, status: '活跃' },
  { id: 'CH-020', name: '上海盛美电子', level: '铜牌', contactPerson: '王总', monthlySTI: 78, monthlySO: 50, lockRate: 46, attachRate: 22, status: '一般' },
]

export const mockOrders: OrderItem[] = [
  {
    orderId: 'E011847924', customerName: '上海华信科技', productLine: 'ThinkPad', isg: false, expedited: true,
    products: 'ThinkPad X1 Carbon Gen 12 × 50台', quantity: 50, amount: 625000, orderDate: '2026-05-01',
    status: '排产中', estimatedDelivery: '2026-05-25', sn: 'SN20260501001', soNumber: 'SO-2026-05821',
    milestones: [
      { stage: '订单确认', date: '2026-05-01', completed: true, description: '订单已确认，进入排产队列' },
      { stage: '排产计划', date: '2026-05-03', completed: true, description: '排产计划已生成【已加急】' },
      { stage: '原料备货', date: '2026-05-06', completed: false, description: '等待核心部件到货' },
      { stage: '产线生产', date: '2026-05-12', completed: false, description: '预计进入SMT产线' },
      { stage: '质检入库', date: '2026-05-18', completed: false, description: '完成质量检测，成品入库' },
      { stage: '物流发货', date: '2026-05-20', completed: false, description: '交运顺丰物流' },
      { stage: '客户签收', date: '2026-05-25', completed: false, description: '预计送达客户' },
    ]
  },
  {
    orderId: 'E012498733', customerName: '上海东讯科技', productLine: 'ThinkPad', isg: false, expedited: false,
    products: 'ThinkPad T14 Gen 6 × 80台 + 扩展坞 × 80', quantity: 80, amount: 1120000, orderDate: '2026-04-25',
    status: '生产中', estimatedDelivery: '2026-05-15', sn: 'SN20260425003', soNumber: 'SO-2026-04512',
    milestones: [
      { stage: '订单确认', date: '2026-04-25', completed: true, description: '订单已确认' },
      { stage: '排产计划', date: '2026-04-26', completed: true, description: '排产计划生成' },
      { stage: '原料备货', date: '2026-04-28', completed: true, description: '部件到货' },
      { stage: '产线生产', date: '2026-05-01', completed: false, description: '生产中，已完成65%' },
      { stage: '质检入库', date: '', completed: false, description: '' }, { stage: '物流发货', date: '', completed: false, description: '' },
      { stage: '客户签收', date: '', completed: false, description: '' },
    ]
  },
  {
    orderId: 'E012320880', customerName: '浦发银行', productLine: 'ThinkSystem', isg: true, expedited: false,
    products: 'ThinkSystem SR650 V3 × 8台 + 存储扩展', quantity: 8, amount: 1860000, orderDate: '2026-04-28',
    status: '运输中', logisticsCompany: '顺丰物流', logisticsNo: 'SF1234567890', estimatedDelivery: '2026-05-08',
    sn: 'SN20260428002', soNumber: 'SO-2026-04890',
    milestones: [
      { stage: '订单确认', date: '2026-04-28', completed: true, description: '订单已确认' },
      { stage: '排产计划', date: '2026-04-29', completed: true, description: '排产计划生成' },
      { stage: '原料备货', date: '2026-04-30', completed: true, description: '部件到货齐全' },
      { stage: '产线生产', date: '2026-05-02', completed: true, description: '完成SMT及组装' },
      { stage: '质检入库', date: '2026-05-04', completed: true, description: '质检通过' },
      { stage: '物流发货', date: '2026-05-05', completed: true, description: '已交运顺丰物流' },
      { stage: '客户签收', date: '2026-05-08', completed: false, description: '运输中，预计5月8日送达' },
    ]
  },
  {
    orderId: 'E011596720', customerName: '伟仕佳杰', productLine: 'ThinkCentre', isg: false, expedited: true,
    products: 'ThinkCentre M75q Gen5 × 200台', quantity: 200, amount: 960000, orderDate: '2026-04-20',
    status: '已签收', logisticsCompany: '京东物流', logisticsNo: 'JD9876543210', estimatedDelivery: '2026-05-03',
    sn: 'SN20260420004', soNumber: 'SO-2026-04108',
    milestones: [
      { stage: '订单确认', date: '2026-04-20', completed: true, description: '订单已确认' },
      { stage: '排产计划', date: '2026-04-21', completed: true, description: '排产计划生成【已加急】' },
      { stage: '原料备货', date: '2026-04-23', completed: true, description: '部件到货' },
      { stage: '产线生产', date: '2026-04-25', completed: true, description: '完成生产组装' },
      { stage: '质检入库', date: '2026-04-28', completed: true, description: '质检通过' },
      { stage: '物流发货', date: '2026-04-30', completed: true, description: '京东物流揽件' },
      { stage: '客户签收', date: '2026-05-03', completed: true, description: '客户已签收' },
    ]
  },
  {
    orderId: 'E011596719', customerName: '上海金陵网络', productLine: 'ThinkBook', isg: false, expedited: true,
    products: 'ThinkBook 16 G7+ × 30台', quantity: 30, amount: 255000, orderDate: '2026-05-02',
    status: '排产中', estimatedDelivery: '2026-05-28', sn: 'SN20260502005', soNumber: 'SO-2026-05933',
    milestones: [
      { stage: '订单确认', date: '2026-05-02', completed: true, description: '订单已确认' },
      { stage: '排产计划', date: '2026-05-04', completed: true, description: '排产计划生成【已加急】' },
      { stage: '原料备货', date: '', completed: false, description: '等待物料齐套' },
      { stage: '产线生产', date: '', completed: false, description: '' }, { stage: '质检入库', date: '', completed: false, description: '' },
      { stage: '物流发货', date: '', completed: false, description: '' }, { stage: '客户签收', date: '', completed: false, description: '' },
    ]
  },
  {
    orderId: 'E011596704', customerName: '燧原科技', productLine: 'ThinkSystem', isg: true, expedited: false,
    products: 'ThinkSystem SD530 V4 × 20节点', quantity: 20, amount: 2800000, orderDate: '2026-05-04',
    status: '待排产', estimatedDelivery: '2026-06-05',
    milestones: [
      { stage: '订单确认', date: '2026-05-04', completed: true, description: '大单审批通过' },
      { stage: '排产计划', date: '', completed: false, description: '' }, { stage: '原料备货', date: '', completed: false, description: '' },
      { stage: '产线生产', date: '', completed: false, description: '' }, { stage: '质检入库', date: '', completed: false, description: '' },
      { stage: '物流发货', date: '', completed: false, description: '' }, { stage: '客户签收', date: '', completed: false, description: '' },
    ]
  },
  {
    orderId: 'E011596703', customerName: '中远海发', productLine: 'ThinkCentre', isg: false, expedited: false,
    products: 'ThinkCentre M75q Gen5 × 120台', quantity: 120, amount: 576000, orderDate: '2026-05-03',
    status: '待排产', estimatedDelivery: '2026-05-30',
    milestones: [
      { stage: '订单确认', date: '2026-05-03', completed: true, description: '订单已确认' },
      { stage: '排产计划', date: '', completed: false, description: '' }, { stage: '原料备货', date: '', completed: false, description: '' },
      { stage: '产线生产', date: '', completed: false, description: '' }, { stage: '质检入库', date: '', completed: false, description: '' },
      { stage: '物流发货', date: '', completed: false, description: '' }, { stage: '客户签收', date: '', completed: false, description: '' },
    ]
  },
  {
    orderId: 'E011596699', customerName: '中芯国际', productLine: 'ThinkSystem', isg: true, expedited: false,
    products: 'ThinkSystem SR680 V3 × 12台 + 存储阵列', quantity: 12, amount: 3800000, orderDate: '2026-05-06',
    status: '待排产', estimatedDelivery: '2026-06-01',
    milestones: [
      { stage: '订单确认', date: '2026-05-06', completed: true, description: '订单已确认' },
      { stage: '排产计划', date: '', completed: false, description: '等待排产' }, { stage: '原料备货', date: '', completed: false, description: '' },
      { stage: '产线生产', date: '', completed: false, description: '' }, { stage: '质检入库', date: '', completed: false, description: '' },
      { stage: '物流发货', date: '', completed: false, description: '' }, { stage: '客户签收', date: '', completed: false, description: '' },
    ]
  },
  {
    orderId: 'E011596698', customerName: '舜宇光学', productLine: 'ThinkSystem', isg: true, expedited: true,
    products: 'ThinkSystem SR650 V3 × 24台 + GPU扩展', quantity: 24, amount: 5800000, orderDate: '2026-05-05',
    status: '排产中', estimatedDelivery: '2026-05-28',
    milestones: [
      { stage: '订单确认', date: '2026-05-05', completed: true, description: '订单已确认【已加急】' },
      { stage: '排产计划', date: '2026-05-06', completed: true, description: '排产计划已生成' },
      { stage: '原料备货', date: '', completed: false, description: 'GPU模组调配中' },
      { stage: '产线生产', date: '', completed: false, description: '' }, { stage: '质检入库', date: '', completed: false, description: '' },
      { stage: '物流发货', date: '', completed: false, description: '' }, { stage: '客户签收', date: '', completed: false, description: '' },
    ]
  },
]

export const mockAllOrders: OrderItem[] = [...mockOrders]

export const mockGlobalKPIs = {
  totalSTI: 38200, stiGrowth: 11.8, totalSO: 29450, soGrowth: 14.2,
  totalLockRate: 67.8, lockRateGrowth: 2.9, totalAttachRate: 41.5, attachRateGrowth: 4.3,
  totalLeads: 1680, totalOpportunities: 456, totalOrders: 1150, totalRevenue: 612000000,
}

export const mockRegionPerformance: RegionPerformance[] = [
  { region: '上海', stiTarget: 7000, stiActual: 7450, soTarget: 5800, soActual: 6100, lockRate: 72, attachRate: 48 },
  { region: '华南', stiTarget: 5800, stiActual: 5600, soTarget: 4800, soActual: 4650, lockRate: 67, attachRate: 44 },
  { region: '华北', stiTarget: 6500, stiActual: 6800, soTarget: 5400, soActual: 5550, lockRate: 70, attachRate: 46 },
  { region: '西南', stiTarget: 4200, stiActual: 3950, soTarget: 3500, soActual: 3300, lockRate: 63, attachRate: 39 },
  { region: '东南', stiTarget: 5000, stiActual: 5100, soTarget: 4200, soActual: 4350, lockRate: 69, attachRate: 43 },
  { region: '中东', stiTarget: 4500, stiActual: 4300, soTarget: 3800, soActual: 3650, lockRate: 65, attachRate: 40 },
  { region: '西北', stiTarget: 3200, stiActual: 2900, soTarget: 2600, soActual: 2400, lockRate: 60, attachRate: 36 },
  { region: '东北', stiTarget: 2800, stiActual: 2100, soTarget: 2300, soActual: 1850, lockRate: 55, attachRate: 33 },
]

export const mockCpsIndicators: CpsIndicator[] = [
  {
    key: 'pc', label: 'K1：PC出货完成率', target: 1200, actual: 1080, unit: '台',
    weight: 5, trend: 'up', trendValue: '+3.2%', rank: '华东战区第2',
    topAction: '📋 PC产品线：推动中芯国际/华勤技术大单交付 → 加速Q2出货节奏',
  },
  {
    key: 'by', label: 'K2：百应及thinkplus完成率', target: 300, actual: 330, unit: '台',
    weight: 2, trend: 'up', trendValue: '+10.0%', rank: '华东战区第1',
    topAction: '🎯 百应/thinkplus：联合神州数码开展中小企业专属推广活动 → 提升配件覆盖率',
  },
  {
    key: 'po', label: 'K3：重点产品PO完成率', target: 150, actual: 135, unit: '台',
    weight: 1, trend: 'down', trendValue: '-5.3%', rank: '华东战区第3',
    topAction: '📊 重点产品PO：梳理浦发银行/上海微电子重点产品需求 → 制定专项攻坚方案',
  },
  {
    key: 'zl', label: 'K4：战略指标完成率', target: 100, actual: 85, unit: '%',
    weight: 2, trend: 'down', trendValue: '-15.0pp', rank: '华东战区第4',
    topAction: '🤝 战略指标：启动园区渠道覆盖提升计划 → 重点突破张江/金桥园区',
  },
]

export const mockPartnerVisits: PartnerVisit[] = [
  { partnerId: 'CH-001', partnerName: '神州数码', visitDate: '2026-05-06', visitType: '例行拜访', summary: '季度业务回顾，STI完成650台超预期。讨论了捆绑促销方案，对方同意推动"整机+服务"套餐向终端客户推荐。下一步将联合制定Q3激励计划。', nextPlan: '下周三提交捆绑促销方案细则', attendees: '周总、张经理' },
  { partnerId: 'CH-002', partnerName: '联强国际', visitDate: '2026-05-04', visitType: '专项沟通', summary: '沟通了承载率提升方案，联强反馈终端客户对云服务捆绑接受度不高，建议先推服务包+延保。确认了Q2剩余200台STI的订货排期。', nextPlan: '两周后跟进服务包试点效果', attendees: '李总、张经理' },
  { partnerId: 'CH-003', partnerName: '上海金陵网络', visitDate: '2026-05-03', visitType: '签约拜访', summary: '政府集采项目合作协议签署，锁定Q2-Q3共计200台ThinkCentre订单。明确了交付标准和付款节点。', nextPlan: '5月15日前确认首批订单排产', attendees: '王经理、张经理、法务' },
  { partnerId: 'CH-004', partnerName: '伟仕佳杰', visitDate: '2026-05-05', visitType: '问题处理', summary: '处理ThinkPad T14订单延迟交付投诉，协调工厂加急排产。伟仕佳杰对金牌渠道升级有明确意向，已收集升级申请材料。', nextPlan: '本周五前完成升级材料审核', attendees: '何总、张经理' },
  { partnerId: 'CH-005', partnerName: '上海康硕信息', visitDate: '2026-04-28', visitType: '例行拜访', summary: '月度业务复盘，锁定率62%表现平稳。对方希望获得更多线索分配，已安排下周起从总部线索池中定向分配。', nextPlan: '下周起定向分配线索', attendees: '陈总、张经理' },
  { partnerId: 'CH-006', partnerName: '上海翎云科技', visitDate: '2026-04-25', visitType: '例行拜访', summary: '激活流程推进，已完成注册伙伴信息完善。月STI 155台距离银牌标准差45台，需加大推广力度。', nextPlan: '两周后检查推广效果', attendees: '张经理（翎云）、张经理' },
  { partnerId: 'CH-007', partnerName: '上海贝加信息', visitDate: '2026-04-20', visitType: '专项沟通', summary: '承载率偏低（28%），沟通了交叉销售激励政策。对方反馈主要是客户群体偏小型，对高端服务需求有限。建议其聚焦百应产品线。', nextPlan: '下月再评估承载率变化', attendees: '郑经理、张经理' },
  { partnerId: 'CH-008', partnerName: '英迈中国', visitDate: '2026-04-18', visitType: '例行拜访', summary: '月STI 72台偏低，分析了原因：以零售客户为主、大单机会少。建议其拓展企业客户渠道，已提供10家潜在线索。', nextPlan: '三周后检查线索转化情况', attendees: '刘总监、张经理' },
  { partnerId: 'CH-009', partnerName: '上海赢家信息', visitDate: '2026-03-30', visitType: '问题处理', summary: '沉默状态持续两个月，沟通后发现主要负责人变动导致业务停滞。新负责人有积极性，已安排产品培训和渠道政策宣贯。', nextPlan: '5月中旬安排第二轮产品培训', attendees: '金经理、张经理' },
  { partnerId: 'CH-010', partnerName: '上海华信科技', visitDate: '2026-03-25', visitType: '例行拜访', summary: '月STI仅35台，处于注册级别。对方主要做系统集成业务，有政府客户资源但缺乏联想产品推广渠道。已在协调总部资源对接。', nextPlan: '5月底前完成资源对接方案', attendees: '戴总、张经理' },
]

// Build chat card responses from mockOrders
function buildCardResponses(): Record<string, ChatMessage['cardData']> {
  const map: Record<string, ChatMessage['cardData']> = {}
  for (const o of mockOrders) {
    map[o.orderId.toLowerCase()] = { type: 'order', order: o }
  }
  map['sf1234567890'] = {
    type: 'logistics', orderId: 'E012320880', logisticsCompany: '顺丰物流', logisticsNo: 'SF1234567890',
    currentLocation: '上海市浦东分拣中心', estimatedArrival: '2026-05-08 14:00',
    milestones: [
      { time: '2026-05-05 09:30', status: '已揽件', location: '上海浦东仓库' },
      { time: '2026-05-05 18:00', status: '运输中', location: '浦东分拣中心' },
      { time: '2026-05-06 06:00', status: '到达中转', location: '上海青浦中转场' },
      { time: '2026-05-06 10:30', status: '分拣中', location: '上海浦东分拣中心' },
      { time: '2026-05-08 14:00', status: '预计派送', location: '客户地址' },
    ]
  }
  map['e012498733'] = {
    type: 'production', orderId: 'E012498733', productName: 'ThinkPad T14 Gen 6 & 扩展坞', currentStage: '产线生产（65%）',
    stages: [
      { name: '订单确认', status: 'completed', date: '2026-04-25' }, { name: '物料齐套', status: 'completed', date: '2026-04-28' },
      { name: 'SMT贴片', status: 'completed', date: '2026-04-30' }, { name: '整机组装', status: 'active', date: '进行中' },
      { name: '功能测试', status: 'pending', date: '预计05-08' }, { name: '老化测试', status: 'pending', date: '预计05-10' },
      { name: '成品包装', status: 'pending', date: '预计05-12' }, { name: '入库发货', status: 'pending', date: '预计05-14' },
    ],
    details: [
      { label: '订单编号', value: 'E012498733' }, { label: '产品型号', value: 'ThinkPad T14 Gen 6 + 扩展坞 × 80套' },
      { label: '当前产线', value: '昆山工厂 3号产线' }, { label: '完成进度', value: '65%' },
      { label: '预计下线', value: '2026-05-12' }, { label: '预计交付', value: '2026-05-15' },
    ]
  }
  return map
}

export const chatResponses = buildCardResponses()
