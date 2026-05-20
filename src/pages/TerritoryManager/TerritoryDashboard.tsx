import { useState, useRef, useEffect } from 'react'
import * as echarts from 'echarts'
import {
  mockTwoAssociations as _assocData, mockChannelPartners as _partnerData,
  mockVisits as _mockVisitsData, mockTasks as _mockTasksData,
  mockPartnerVisits, mockCpsIndicators,
} from '../../data/mockData'
import type { PartnerVisit, VisitItem, TwoAssociationsItem, ChannelPartner, TaskItem } from '../../types'
import AIAssistant from '../../components/AIAssistant/AIAssistant'
import './TerritoryDashboard.css'

// ==================== Data Types ====================

interface AssocCompany {
  id: string
  cdbid: string
  name: string
  industry: string
  mainBusiness: string
  businessScale: string
  employeeCount: number
  foundedDate: string
  decisionMakerName: string
  decisionMakerPhone: string
  contactName: string
  contactPhone: string
  isHighValue: boolean
  cooperationStatus: '已合作' | '洽谈中' | '待跟进'
  lastVisitDate: string
  visitRecords: CompanyVisitRecord[]
}

interface CompanyVisitRecord {
  id: string
  visitDate: string
  visitTarget: string
  visitType: string
  attendees: string
  summary: string
  feedback: string
  nextPlan: string
}

interface AssocMarkerItem {
  id: string
  name: string
  type: string
  value: [number, number]
  status: string
  address: string
  contact: string
  contactPhone: string
  memberCount: number
  signedPartner?: string
  companies: AssocCompany[]
}

interface PartnerMarkerItem {
  id: string
  name: string
  level: string
  value: [number, number]
  status: string
  monthlySTI: number
  lockRate: number
  attachRate: number
  visitStatus: string
  lastVisit: string
}

// ==================== Data Generators ====================

const industries = ['互联网', '制造业', '金融', '半导体', '人工智能', '生物医药', '新能源', '企业服务', '电子商务', '物流']
const mainBusinesses = [
  '云计算与大数据服务', '智能硬件研发与制造', '企业IT解决方案', '芯片设计与研发',
  '软件开发与外包', '人工智能算法研发', '物联网平台运营', '企业数字化转型咨询',
  '网络安全产品研发', '工业互联网平台', 'SaaS企业管理软件', '数据中心运营',
  '智能终端制造', '自动驾驶技术研发', '医疗信息化服务'
]
const businessScales = ['1000万以下', '1000万-5000万', '5000万-1亿', '1亿-5亿', '5亿-10亿', '10亿以上']
const cooperationStatuses: AssocCompany['cooperationStatus'][] = ['已合作', '洽谈中', '待跟进']

function generateVisitRecords(companyId: string, count: number): CompanyVisitRecord[] {
  const records: CompanyVisitRecord[] = []
  const baseDate = new Date('2026-04-01')
  const visitTypeOptions = ['上门拜访', '电话沟通', '腾讯会议']
  const visitTargets = [
    '总经理 王总', 'IT总监 李总', '采购经理 张经理', '技术总监 陈总',
    '行政总监 赵总', '副总 钱总', 'COO 孙总', 'CIO 周总'
  ]
  const attendees = ['黄俊', '黄俊、张经理', '黄俊、李工程师', '黄俊、张经理、王顾问', '黄俊、赵总']
  const summaries = [
    '本次拜访深入沟通了企业IT设备更新需求，客户对联想ThinkCentre产品线认可度高，初步确认了采购数量和时间节点。',
    '就公司数字化转型方案进行了详细交流，客户对云计算解决方案表现出强烈兴趣，同意安排后续技术对接。',
    '完成了产品演示和价格沟通，客户对ThinkPad X1系列评价积极，表示将在预算审批后正式启动采购流程。',
    '沟通了年度IT设备采购计划，客户计划分两批采购共计约80台设备，已初步锁定联想品牌。',
    '针对客户网络安全需求，介绍了联想安全解决方案，客户表示将与技术团队讨论后反馈。',
  ]
  const feedbacks = [
    '客户对产品性能满意，希望价格方面能有更大优惠空间，同时关注售后响应速度。',
    '客户反馈联想服务体系完善，但对部分高端产品交货周期有顾虑，希望加快交付。',
    '客户表示产品方案契合需求，但需要更多行业案例支撑决策，期待后续提供参考案例。',
    '沟通效果良好，客户对品牌认知度提升，但竞品也在积极跟进，需要加快商务节奏。',
  ]
  for (let i = 0; i < count; i++) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + i * 12 + (companyId.charCodeAt(companyId.length - 1) % 7))
    records.push({
      id: `VR-${companyId}-${i + 1}`,
      visitDate: date.toISOString().split('T')[0],
      visitTarget: visitTargets[(i + companyId.charCodeAt(0)) % visitTargets.length],
      visitType: visitTypeOptions[i % 3],
      attendees: attendees[i % attendees.length],
      summary: summaries[i % summaries.length],
      feedback: feedbacks[i % feedbacks.length],
      nextPlan: `${i + 1}. ${['本周内发送正式报价单及方案书', '安排技术团队进行深度对接', '跟进决策人审批进度', '协调样品/试用设备'][i % 4]}；确定下次沟通时间。`,
    })
  }
  return records
}

const companyNamePool: Record<string, string[]> = {
  'TA-001': [
    '上海云智科技有限公司', '浦软信息技术有限公司', '申城数据服务有限公司', '华东软件外包有限公司',
    '上海码农科技有限公司', '张江云计算中心', '上海IT咨询服务有限公司', '东方软件科技有限公司',
    '上海银江信息技术有限公司', '浦东智联科技有限公司', '申信数据科技有限公司', '上海博达软件有限公司',
  ],
  'TA-002': [
    '浦东贸易有限公司', '上海金贸投资有限公司', '东方商务咨询有限公司', '上海企业服务有限公司',
    '浦东创业投资有限公司', '上海商业管理有限公司', '东方资本投资有限公司', '上海联合商务有限公司',
    '浦东国际商贸有限公司', '上海汇丰企业管理有限公司', '东方瑞丰投资有限公司', '浦东新区进出口有限公司',
  ],
  'TA-003': [
    '张江芯片设计有限公司', '上海半导体科技有限公司', '张江集成电路有限公司', '上海微电子研究院',
    '张江智能制造有限公司', '上海物联网科技有限公司', '张江机器人有限公司', '上海人工智能研究院',
    '张江新材料科技有限公司', '上海量子信息技术有限公司', '张江生物芯片有限公司', '上海光电子有限公司',
  ],
  'TA-004': [
    '上海深度学习科技有限公司', '浦东神经网络研究院', '上海智能算法有限公司', '东方机器学习科技有限公司',
    '上海计算机视觉有限公司', '浦东自然语言处理有限公司', '上海语音识别科技有限公司', '东方智能科技有限公司',
    '上海认知计算有限公司', '浦东智能决策有限公司', '上海多模态AI有限公司', '东方大模型科技有限公司',
  ],
  'TA-005': [
    '金桥电子制造有限公司', '上海出口加工有限公司', '金桥精密制造有限公司', '上海外贸服务有限公司',
    '金桥物流科技有限公司', '上海供应链管理有限公司', '金桥包装印刷有限公司', '上海质检服务有限公司',
    '金桥汽车零部件有限公司', '上海精密仪器有限公司', '金桥新能源科技有限公司', '上海智能制造有限公司',
  ],
  'TA-006': [
    '浦东青年创业有限公司', '上海青年投资有限公司', '东方青年科技有限公司', '浦东青年商务有限公司',
    '上海青年服务有限公司', '东方青年传媒有限公司', '浦东青年培训有限公司', '上海青年网络有限公司',
    '浦东新锐科技有限公司', '上海青年创投有限公司', '东方青年文创有限公司', '浦东青年供应链有限公司',
  ],
  'TA-007': [
    '浦东软件园科技有限公司', '上海软件园服务有限公司', '东方软件园投资有限公司', '浦东软件园孵化有限公司',
    '上海软件园培训有限公司', '东方软件园数据有限公司', '浦东软件园网络有限公司', '上海软件园咨询有限公司',
    '浦东软件园云服务有限公司', '上海软件园安全技术有限公司', '东方软件园大数据有限公司', '浦东软件园移动互联有限公司',
  ],
  'TA-008': [
    '漕河泾科技有限公司', '上海远中投资有限公司', '漕河泾商务服务有限公司', '上海远中科技有限公司',
    '漕河泾创业孵化有限公司', '上海远中商务有限公司', '漕河泾信息技术有限公司', '上海远中服务有限公司',
    '漕河泾微电子有限公司', '上海远中光电科技有限公司', '漕河泾生物医药有限公司', '上海远中新能源有限公司',
  ],
}

function generateCompaniesForAssoc(assocId: string, assocName: string): AssocCompany[] {
  const count = 8 + (assocId.charCodeAt(assocId.length - 1) % 5)
  const names = companyNamePool[assocId] || ['上海科技有限公司', '东方信息技术有限公司', '浦东服务有限公司', '上海网络有限公司', '东方数据有限公司', '浦东科创有限公司', '上海翔宇科技有限公司', '东方瑞达有限公司', '浦东融信有限公司', '上海云端科技有限公司']
  const companies: AssocCompany[] = []

  for (let i = 0; i < count; i++) {
    const isHighValue = (assocId.charCodeAt(assocId.length - 1) + i) % 3 === 0
    const visitCount = 1 + (i % 3)
    const companyId = `${assocId}-C${String(i + 1).padStart(3, '0')}`
    const lastVisit = new Date('2026-04-01')
    lastVisit.setDate(lastVisit.getDate() + i * 15 + (assocId.charCodeAt(0) % 10))
    const dmNames = ['王建国', '李明远', '张伟民', '刘德华', '陈志强', '赵俊峰', '周海滨', '钱学明', '孙丽华', '吴国栋', '郑海涛', '冯建国']
    const dmPhones = ['138****1234', '139****5678', '136****9012', '137****3456', '158****7890', '159****2345', '186****6789', '187****0123', '188****4567', '189****8901', '135****1111', '133****2222']
    const contactNames = ['王丽', '李强', '张敏', '刘洋', '陈静', '赵磊', '周芳', '钱伟', '孙明', '吴婷', '郑华', '冯娟']
    const contactPhones = ['139****1011', '138****2022', '137****3033', '136****4044', '158****5055', '159****6066', '186****7077', '187****8088', '188****9099', '189****0100', '135****1212', '133****2323']

    const year = 2023 - (assocId.charCodeAt(assocId.length - 1) % 3)
    const month = 1 + (i % 12)
    const day = 1 + (i % 28)
    const cdbidDate = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`
    const cdbidSeq = String(i * 7 + (assocId.charCodeAt(0) % 100) + 1).padStart(3, '0')

    companies.push({
      id: companyId,
      cdbid: `CDB-${cdbidDate}-${cdbidSeq}`,
      name: names[i % names.length],
      industry: industries[(assocId.charCodeAt(0) + i * 3) % industries.length],
      mainBusiness: mainBusinesses[(assocId.charCodeAt(assocId.length - 1) + i * 2) % mainBusinesses.length],
      businessScale: businessScales[(assocId.charCodeAt(0) + i * 7) % businessScales.length],
      employeeCount: 30 + (i * 85) + (assocId.charCodeAt(assocId.length - 1) * 15),
      foundedDate: `${2005 + (i % 18)}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`,
      decisionMakerName: dmNames[i % dmNames.length],
      decisionMakerPhone: dmPhones[i % dmPhones.length],
      contactName: contactNames[i % contactNames.length],
      contactPhone: contactPhones[i % contactPhones.length],
      isHighValue,
      cooperationStatus: cooperationStatuses[i % 3],
      lastVisitDate: lastVisit.toISOString().split('T')[0],
      visitRecords: generateVisitRecords(companyId, visitCount),
    })
  }

  return companies.sort((a, b) => (b.isHighValue ? 1 : 0) - (a.isHighValue ? 1 : 0))
}

function getCompanyVisitLog(companyId: string, assocMarkerData: AssocMarkerItem[]): CompanyVisitRecord[] {
  for (const assoc of assocMarkerData) {
    const company = assoc.companies.find(c => c.id === companyId)
    if (company) return company.visitRecords
  }
  return []
}

function getCompanyById(companyId: string, assocMarkerData: AssocMarkerItem[]): AssocCompany | undefined {
  for (const assoc of assocMarkerData) {
    const company = assoc.companies.find(c => c.id === companyId)
    if (company) return company
  }
  return undefined
}

// ==================== Data ====================

const assocMarkerData: AssocMarkerItem[] = [
  { id: 'TA-001', name: '上海软件行业协会', type: '协会', value: [121.455, 31.245], status: '洽谈中', address: '静安区江场西路299弄4号楼1205室', contact: '周会长', contactPhone: '13800138001', memberCount: 350, signedPartner: '上海辰晔信息科技有限公司' },
  { id: 'TA-002', name: '浦东新区商会', type: '商会', value: [121.525, 31.225], status: '洽谈中', address: '浦东新区民生路1286号汇商大厦6楼', contact: '钱秘书长', contactPhone: '13800138002', memberCount: 500 },
  { id: 'TA-003', name: '张江高科技园区', type: '园区', value: [121.585, 31.205], status: '待开发', address: '浦东新区张江高科技园区祖冲之路899号', contact: '郑主任', contactPhone: '13800138003', memberCount: 280 },
  { id: 'TA-004', name: '上海人工智能协会', type: '协会', value: [121.515, 31.195], status: '洽谈中', address: '浦东新区世博村路231号306室', contact: '赵副会长', contactPhone: '13800138004', memberCount: 420, signedPartner: '上海东讯科技' },
  { id: 'TA-005', name: '金桥出口加工区', type: '园区', value: [121.605, 31.255], status: '待开发', address: '浦东新区金桥出口加工区金海路1000号', contact: '吴主任', contactPhone: '13800138005', memberCount: 380 },
  { id: 'TA-006', name: '浦东青年商会', type: '商会', value: [121.555, 31.175], status: '待开发', address: '浦东新区纳贤路800号张江科学城', contact: '孙会长', contactPhone: '13800138006', memberCount: 200 },
  { id: 'TA-007', name: '上海浦东软件园', type: '园区', value: [121.595, 31.185], status: '已签约', address: '浦东新区博云路2号', contact: '韩主任', contactPhone: '13800138007', memberCount: 510, signedPartner: '上海致柏商贸有限公司' },
  { id: 'TA-008', name: '上海漕河泾远中产业园', type: '园区', value: [121.535, 31.265], status: '已签约', address: '浦东新区张江碧波路500号', contact: '李秘书长', contactPhone: '13800138008', memberCount: 280, signedPartner: '上海联创世纪' },
].map(a => ({ ...a, companies: generateCompaniesForAssoc(a.id, a.name) } as AssocMarkerItem))

const partnerMarkerData: PartnerMarkerItem[] = [
  { id: 'CH-001', name: '神州数码', level: '钻石', value: [121.435, 31.285], status: '活跃', monthlySTI: 650, lockRate: 82, attachRate: 58, visitStatus: '已拜访', lastVisit: '2026-05-04' },
  { id: 'CH-002', name: '联强国际', level: '钻石', value: [121.465, 31.215], status: '活跃', monthlySTI: 580, lockRate: 80, attachRate: 55, visitStatus: '已拜访', lastVisit: '2026-05-02' },
  { id: 'CH-003', name: '上海金陵网络', level: '金牌', value: [121.505, 31.265], status: '活跃', monthlySTI: 350, lockRate: 72, attachRate: 45, visitStatus: '本月已访', lastVisit: '2026-04-28' },
  { id: 'CH-004', name: '伟仕佳杰', level: '金牌', value: [121.545, 31.185], status: '活跃', monthlySTI: 420, lockRate: 75, attachRate: 48, visitStatus: '已拜访', lastVisit: '2026-05-05' },
  { id: 'CH-005', name: '上海康硕信息', level: '银牌', value: [121.575, 31.235], status: '活跃', monthlySTI: 180, lockRate: 62, attachRate: 35, visitStatus: '本月已访', lastVisit: '2026-04-30' },
  { id: 'CH-006', name: '上海翎云科技', level: '银牌', value: [121.485, 31.155], status: '一般', monthlySTI: 155, lockRate: 58, attachRate: 30, visitStatus: '超过1月', lastVisit: '2026-03-20' },
  { id: 'CH-007', name: '上海贝加信息', level: '铜牌', value: [121.615, 31.195], status: '一般', monthlySTI: 95, lockRate: 50, attachRate: 28, visitStatus: '超过1月', lastVisit: '2026-03-15' },
  { id: 'CH-008', name: '英迈中国', level: '铜牌', value: [121.525, 31.295], status: '一般', monthlySTI: 72, lockRate: 42, attachRate: 18, visitStatus: '超过1月', lastVisit: '2026-02-28' },
  { id: 'CH-009', name: '上海赢家信息', level: '注册', value: [121.405, 31.225], status: '沉默', monthlySTI: 48, lockRate: 35, attachRate: 12, visitStatus: '无', lastVisit: '—' },
  { id: 'CH-010', name: '上海华信科技', level: '注册', value: [121.635, 31.245], status: '沉默', monthlySTI: 35, lockRate: 30, attachRate: 10, visitStatus: '无', lastVisit: '—' },
  { id: 'CH-011', name: '上海东讯科技', level: '金牌', value: [121.445, 31.175], status: '活跃', monthlySTI: 380, lockRate: 74, attachRate: 42, visitStatus: '已拜访', lastVisit: '2026-05-03' },
  { id: 'CH-012', name: '上海辰晔信息', level: '金牌', value: [121.565, 31.275], status: '活跃', monthlySTI: 290, lockRate: 68, attachRate: 38, visitStatus: '已拜访', lastVisit: '2026-05-04' },
  { id: 'CH-013', name: '上海致柏商贸', level: '银牌', value: [121.495, 31.205], status: '活跃', monthlySTI: 165, lockRate: 60, attachRate: 32, visitStatus: '本月已访', lastVisit: '2026-04-25' },
  { id: 'CH-014', name: '上海恒盈科技', level: '银牌', value: [121.585, 31.165], status: '一般', monthlySTI: 140, lockRate: 55, attachRate: 28, visitStatus: '超过1月', lastVisit: '2026-03-10' },
  { id: 'CH-015', name: '上海智远科技', level: '铜牌', value: [121.515, 31.255], status: '一般', monthlySTI: 88, lockRate: 48, attachRate: 25, visitStatus: '超过1月', lastVisit: '2026-03-05' },
  { id: 'CH-016', name: '上海联创世纪', level: '铜牌', value: [121.455, 31.195], status: '一般', monthlySTI: 65, lockRate: 40, attachRate: 20, visitStatus: '无', lastVisit: '—' },
  { id: 'CH-017', name: '上海博睿信息', level: '注册', value: [121.595, 31.215], status: '沉默', monthlySTI: 42, lockRate: 32, attachRate: 10, visitStatus: '无', lastVisit: '—' },
  { id: 'CH-018', name: '上海云图科技', level: '注册', value: [121.475, 31.275], status: '沉默', monthlySTI: 38, lockRate: 28, attachRate: 8, visitStatus: '无', lastVisit: '—' },
  { id: 'CH-019', name: '上海华勤信息', level: '银牌', value: [121.555, 31.225], status: '活跃', monthlySTI: 175, lockRate: 64, attachRate: 36, visitStatus: '已拜访', lastVisit: '2026-05-01' },
  { id: 'CH-020', name: '上海盛美电子', level: '铜牌', value: [121.425, 31.235], status: '一般', monthlySTI: 78, lockRate: 46, attachRate: 22, visitStatus: '超过1月', lastVisit: '2026-03-18' },
]

const b4Customers = [
  { id: 'B4-001', name: '上海华信科技有限公司', industry: '制造业', potential: '高', currentRevenue: 120, potentialRevenue: 500, lastContact: '2026-05-06', status: '跟进中', owner: '黄俊', nextAction: '方案演示' },
  { id: 'B4-002', name: '上海浦东发展银行股份有限公司', industry: '金融', potential: '高', currentRevenue: 0, potentialRevenue: 800, lastContact: '2026-05-05', status: '初步接触', owner: '黄俊', nextAction: '需求调研' },
  { id: 'B4-003', name: '上海微电子装备有限公司', industry: '半导体', potential: '高', currentRevenue: 200, potentialRevenue: 600, lastContact: '2026-05-04', status: '跟进中', owner: '黄俊', nextAction: '技术交流' },
  { id: 'B4-004', name: '中芯国际集成电路制造', industry: '半导体', potential: '高', currentRevenue: 350, potentialRevenue: 1200, lastContact: '2026-05-03', status: '谈判中', owner: '黄俊', nextAction: '商务谈判' },
  { id: 'B4-005', name: '上海汽车集团股份有限公司', industry: '汽车', potential: '高', currentRevenue: 180, potentialRevenue: 900, lastContact: '2026-05-02', status: '跟进中', owner: '黄俊', nextAction: '产品试用' },
  { id: 'B4-006', name: '交通银行股份有限公司', industry: '金融', potential: '高', currentRevenue: 0, potentialRevenue: 750, lastContact: '2026-05-01', status: '初步接触', owner: '黄俊', nextAction: '高层拜访' },
  { id: 'B4-007', name: '上海电气集团股份有限公司', industry: '装备制造', potential: '高', currentRevenue: 280, potentialRevenue: 850, lastContact: '2026-04-30', status: '跟进中', owner: '黄俊', nextAction: '方案优化' },
  { id: 'B4-008', name: '拼多多网络科技有限公司', industry: '互联网', potential: '高', currentRevenue: 150, potentialRevenue: 650, lastContact: '2026-04-29', status: '谈判中', owner: '黄俊', nextAction: '合同审核' },
  { id: 'B4-009', name: '上海医药集团股份有限公司', industry: '医药', potential: '高', currentRevenue: 220, potentialRevenue: 700, lastContact: '2026-04-28', status: '跟进中', owner: '黄俊', nextAction: '样品测试' },
  { id: 'B4-010', name: '携程计算机技术有限公司', industry: '互联网', potential: '高', currentRevenue: 190, potentialRevenue: 580, lastContact: '2026-04-27', status: '跟进中', owner: '黄俊', nextAction: '方案演示' },
  { id: 'B4-011', name: '上海宝钢股份有限公司', industry: '钢铁', potential: '中', currentRevenue: 320, potentialRevenue: 680, lastContact: '2026-04-26', status: '跟进中', owner: '黄俊', nextAction: '技术对接' },
  { id: 'B4-012', name: '东方财富证券股份有限公司', industry: '金融', potential: '高', currentRevenue: 0, potentialRevenue: 520, lastContact: '2026-04-25', status: '初步接触', owner: '黄俊', nextAction: '需求沟通' },
  { id: 'B4-013', name: '上海机场集团股份有限公司', industry: '交通', potential: '中', currentRevenue: 260, potentialRevenue: 620, lastContact: '2026-04-24', status: '跟进中', owner: '黄俊', nextAction: '方案调整' },
  { id: 'B4-014', name: '上海复星医药有限公司', industry: '医药', potential: '高', currentRevenue: 175, potentialRevenue: 590, lastContact: '2026-04-23', status: '谈判中', owner: '黄俊', nextAction: '价格谈判' },
  { id: 'B4-015', name: '上海建工集团股份有限公司', industry: '建筑', potential: '中', currentRevenue: 240, potentialRevenue: 560, lastContact: '2026-04-22', status: '跟进中', owner: '黄俊', nextAction: '现场考察' },
  { id: 'B4-016', name: '圆通速递股份有限公司', industry: '物流', potential: '中', currentRevenue: 130, potentialRevenue: 480, lastContact: '2026-04-21', status: '跟进中', owner: '黄俊', nextAction: '方案优化' },
  { id: 'B4-017', name: '上海光明食品集团', industry: '食品', potential: '中', currentRevenue: 95, potentialRevenue: 420, lastContact: '2026-04-20', status: '初步接触', owner: '黄俊', nextAction: '产品推介' },
  { id: 'B4-018', name: '上海家化联合股份有限公司', industry: '日化', potential: '中', currentRevenue: 110, potentialRevenue: 450, lastContact: '2026-04-19', status: '跟进中', owner: '黄俊', nextAction: '样品提供' },
  { id: 'B4-019', name: '申能股份有限公司', industry: '能源', potential: '高', currentRevenue: 290, potentialRevenue: 820, lastContact: '2026-04-18', status: '谈判中', owner: '黄俊', nextAction: '商务洽谈' },
  { id: 'B4-020', name: '上海临港经济发展集团', industry: '园区开发', potential: '高', currentRevenue: 0, potentialRevenue: 950, lastContact: '2026-04-17', status: '初步接触', owner: '黄俊', nextAction: '战略沟通' },
  { id: 'B4-021', name: '上海张江高科技园区开发', industry: '园区开发', potential: '高', currentRevenue: 160, potentialRevenue: 720, lastContact: '2026-04-16', status: '跟进中', owner: '黄俊', nextAction: '园区考察' },
  { id: 'B4-022', name: '上海外高桥保税区开发', industry: '园区开发', potential: '中', currentRevenue: 185, potentialRevenue: 540, lastContact: '2026-04-15', status: '跟进中', owner: '黄俊', nextAction: '需求确认' },
  { id: 'B4-023', name: '上海隧道工程股份有限公司', industry: '建筑', potential: '中', currentRevenue: 210, potentialRevenue: 510, lastContact: '2026-04-14', status: '跟进中', owner: '黄俊', nextAction: '技术方案' },
  { id: 'B4-024', name: '上海华谊集团股份有限公司', industry: '化工', potential: '中', currentRevenue: 145, potentialRevenue: 470, lastContact: '2026-04-13', status: '初步接触', owner: '黄俊', nextAction: '产品演示' },
  { id: 'B4-025', name: '上海锦江国际酒店发展', industry: '酒店', potential: '中', currentRevenue: 125, potentialRevenue: 490, lastContact: '2026-04-12', status: '跟进中', owner: '黄俊', nextAction: '方案沟通' },
  { id: 'B4-026', name: '上海豫园旅游商城股份', industry: '商业', potential: '中', currentRevenue: 105, potentialRevenue: 430, lastContact: '2026-04-11', status: '初步接触', owner: '黄俊', nextAction: '需求调研' },
]

// ==================== Component ====================

export default function TerritoryDashboard() {
  const [mapMode, setMapMode] = useState<'assoc' | 'partner'>('assoc')
  const [selectedAssoc, setSelectedAssoc] = useState<AssocMarkerItem | null>(null)
  const [selectedVisitCompanyId, setSelectedVisitCompanyId] = useState<string | null>(null)
  const [companyDetailModal, setCompanyDetailModal] = useState<{ assoc: AssocMarkerItem } | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<echarts.ECharts | null>(null)

  const indicators = mockCpsIndicators
  const rate = (actual: number, target: number) => Math.round((actual / target) * 100)
  const progressWidth = (actual: number, target: number) => Math.min(100, (actual / target) * 100)
  const totalWeight = indicators.reduce((s, i) => s + i.weight, 0)
  const cpsScore = indicators.reduce((s, i) => s + rate(i.actual, i.target) * i.weight, 0) / totalWeight

  const shanghaiCenter = [121.48, 31.23]
  const mapData = mapMode === 'assoc' ? assocMarkerData : partnerMarkerData

  useEffect(() => {
    if (!mapRef.current) return
    const fetchAndInit = async () => {
      const resp = await fetch(import.meta.env.BASE_URL + 'data/上海市.geojson')
      const geoJson = await resp.json()
      echarts.registerMap('shanghai', geoJson)
      if (!mapRef.current) return
      if (mapInstanceRef.current) mapInstanceRef.current.dispose()
      const chart = echarts.init(mapRef.current)
      mapInstanceRef.current = chart

      const renderData = mapData.map(item => {
        const isAssoc = mapMode === 'assoc'
        let color = '#4C6EF5'
        if (isAssoc) {
          color = (item as AssocMarkerItem).status === '已签约' ? '#2F9E44' : (item as AssocMarkerItem).status === '洽谈中' ? '#F08C00' : '#868E96'
        } else {
          const vs = (item as PartnerMarkerItem).visitStatus
          color = vs === '已拜访' ? '#2F9E44' : vs === '本月已访' ? '#F08C00' : vs === '超过1月' ? '#E03131' : '#868E96'
        }
        return {
          name: item.name,
          value: [...(item as any).value, mapMode === 'assoc' ? (item as AssocMarkerItem).memberCount : (item as PartnerMarkerItem).monthlySTI],
          itemStyle: { color },
        }
      })

      const option: echarts.EChartsOption = {
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            if (!params.data) return ''
            const n = params.data.name
            const addr = mapData.find(d => d.name === n)
            if (!addr) return n
            const a = addr as any
            if (mapMode === 'assoc') {
              return `<strong>${n}</strong><br/>类型：${a.type}<br/>企业数：${a.memberCount}家<br/>状态：${a.status}<br/>联系人：${a.contact} ${a.contactPhone || ''}<br/>地址：${a.address || ''}`
            }
            return `<strong>${n}</strong><br/>等级：${a.level}<br/>月STI：${a.monthlySTI}台<br/>锁定率：${a.lockRate}%<br/>承载率：${a.attachRate}%<br/>拜访状态：${a.visitStatus}`
          },
        },
        geo: {
          map: 'shanghai',
          roam: true,
          zoom: 1.2,
          center: [121.47, 31.22],
          label: { show: true, fontSize: 10, color: '#e2e8f0', fontWeight: 600 },
          itemStyle: { areaColor: '#1e3a5f', borderColor: '#00d4ff', borderWidth: 1.2, shadowColor: 'rgba(0, 212, 255, 0.3)', shadowBlur: 10 },
          emphasis: { itemStyle: { areaColor: '#2d6aa0', borderColor: '#00ffff', borderWidth: 2 }, label: { show: true, fontSize: 12, color: '#fff', fontWeight: 700 } },
        },
        series: [{
          type: 'scatter',
          coordinateSystem: 'geo',
          data: renderData,
          symbol: 'pin',
          symbolSize: 28,
          itemStyle: { borderColor: '#fff', borderWidth: 1.5, shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.3)' },
          label: { show: true, position: 'top', formatter: '{b}', color: '#fff', fontSize: 10, fontWeight: 600, textShadowBlur: 4, textShadowColor: '#000', distance: 6 },
          emphasis: { scale: 1.5 },
        }],
      }

      chart.setOption(option)
    }
    fetchAndInit()
    const handleResize = () => mapInstanceRef.current?.resize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (mapInstanceRef.current) { mapInstanceRef.current.dispose(); mapInstanceRef.current = null }
    }
  }, [mapMode, mapData])

  const getPartnerVisit = (partnerId: string): PartnerVisit | undefined => {
    return mockPartnerVisits.find(v => v.partnerId === partnerId)
  }

  const getPartnerVisitStatus = (visit: PartnerVisit | undefined): string => {
    if (!visit) return '无'
    const days = Math.floor((Date.now() - new Date(visit.visitDate).getTime()) / (1000 * 60 * 60 * 24))
    if (days <= 7) return '已拜访'
    if (days <= 30) return '本月已访'
    return '超过1月'
  }

  function levelClass(level: string): string {
    switch (level) {
      case '钻石': return 'diamond'
      case '金牌': return 'gold'
      case '银牌': return 'silver'
      case '铜牌': return 'bronze'
      default: return 'reg'
    }
  }

  // ==================== Company List Modal (filtering) ====================

  const [companySearch, setCompanySearch] = useState('')
  const [industryFilter, setIndustryFilter] = useState('全部')
  const [highValueFilter, setHighValueFilter] = useState('全部')
  const [cooperationFilter, setCooperationFilter] = useState('全部')

  function getFilteredCompanies(assoc: AssocMarkerItem): AssocCompany[] {
    return assoc.companies.filter(c => {
      if (companySearch && !c.name.toLowerCase().includes(companySearch.toLowerCase())) return false
      if (industryFilter !== '全部' && c.industry !== industryFilter) return false
      if (highValueFilter === '是' && !c.isHighValue) return false
      if (highValueFilter === '否' && c.isHighValue) return false
      if (cooperationFilter !== '全部' && c.cooperationStatus !== cooperationFilter) return false
      return true
    })
  }

  function resetCompanyFilters() {
    setCompanySearch('')
    setIndustryFilter('全部')
    setHighValueFilter('全部')
    setCooperationFilter('全部')
  }

  const allIndustries = [...new Set(assocMarkerData.flatMap(a => a.companies.map(c => c.industry)))]

  function getCompanyStats(assoc: AssocMarkerItem) {
    const filtered = getFilteredCompanies(assoc)
    const total = filtered.length
    const highValue = filtered.filter(c => c.isHighValue).length
    const cooperated = filtered.filter(c => c.cooperationStatus === '已合作').length
    const negotiating = filtered.filter(c => c.cooperationStatus === '洽谈中').length
    const pending = filtered.filter(c => c.cooperationStatus === '待跟进').length
    return { total, highValue, cooperated, negotiating, pending }
  }

  const companyFormats: Record<string, string> = {
    showAll: '全部',
    ...assocMarkerData.reduce((acc, a) => {
      acc[a.id] = a.name
      return acc
    }, {} as Record<string, string>),
  }

  return (
    <div>
      {/* ===== Top Greeting & CPS Summary ===== */}
      <div className="dash-top">
        <div className="dash-greet">
          <h2>您好，黄俊</h2>
          <p>华东战区 | 上海 | 2026年5月9日 周六</p>
        </div>
        <div className="dash-cps-summary">
          <div className="cps-summary-inner">
            <div className="cps-summary-col">
              <div className="cps-summary-label">总CPS达成率</div>
              <div className="cps-summary-value" style={{ color: cpsScore >= 100 ? 'var(--success)' : cpsScore >= 85 ? 'var(--brand-600)' : 'var(--danger)' }}>{cpsScore.toFixed(1)}%</div>
            </div>
            <div className="cps-summary-divider" />
            <div className="cps-summary-col">
              <div className="cps-summary-label">当季REV</div>
              <div className="cps-summary-value" style={{ color: 'var(--brand-600)' }}>¥5,820万</div>
              <div className="cps-summary-sub">目标 ¥6,500万</div>
            </div>
            <div className="cps-summary-divider" />
            <div className="cps-summary-col">
              <div className="cps-summary-label">当前CA</div>
              <div className="cps-summary-value" style={{ color: 'var(--warning)' }}>¥4,350万</div>
              <div className="cps-summary-sub">vs Q1 +12%</div>
            </div>
            <div className="cps-summary-divider" />
            <div className="cps-summary-col">
              <div className="cps-summary-label">团队排名</div>
              <div className="cps-summary-value" style={{ color: 'var(--brand-600)' }}>🥈 上海第2</div>
              <div className="cps-summary-sub">全国 12/86</div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Map + Indicators Row ===== */}
      <div className="map-indicators-row">
        <div className="map-col">
          <div className="shanghai-map-container">
            <div className="shanghai-map-title">
              <span>🗺️ 上海辖区总览</span>
              <div className="map-mode-switch">
                <button className={`map-mode-btn ${mapMode === 'assoc' ? 'active' : ''}`} onClick={() => setMapMode('assoc')}>两会一园</button>
                <button className={`map-mode-btn ${mapMode === 'partner' ? 'active' : ''}`} onClick={() => setMapMode('partner')}>联想伙伴</button>
              </div>
            </div>
            <div className="chart-sizer">
              <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
            </div>
            <div className="shanghai-map-legend">
              {mapMode === 'assoc' ? (
                <>
                  <div className="map-legend-item"><div className="map-legend-dot legend-dot-signed" /><span>已签约</span></div>
                  <div className="map-legend-item"><div className="map-legend-dot legend-dot-negotiating" /><span>洽谈中</span></div>
                  <div className="map-legend-item"><div className="map-legend-dot legend-dot-pending" /><span>待开发</span></div>
                </>
              ) : (
                <>
                  <div className="map-legend-item"><div className="map-legend-dot legend-dot-signed" /><span>已拜访</span></div>
                  <div className="map-legend-item"><div className="map-legend-dot legend-dot-negotiating" /><span>本月已访</span></div>
                  <div className="map-legend-item"><div className="map-legend-dot legend-dot-pending" /><span>超过1月</span></div>
                  <div className="map-legend-item"><div className="map-legend-dot" style={{ background: '#868E96' }} /><span>无</span></div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="indicators-col">
          <div className="indicators-stack">
            {indicators.map(ind => {
              const pct = rate(ind.actual, ind.target)
              const isBehind = ind.actual < ind.target
              return (
                <div key={ind.key} className={`indicator-mini-card ${isBehind ? 'behind' : ''}`}>
                  <div className="indicator-mini-header">
                    <span className="indicator-mini-label">{ind.label}</span>
                    <span className={`indicator-mini-rank ${isBehind ? 'rank-warn' : 'rank-ok'}`}>{ind.rank}</span>
                  </div>
                  <div className="indicator-mini-body">
                    <span className={`indicator-mini-actual ${isBehind ? 'actual-warn' : ''}`}>
                      {ind.actual}<span className="indicator-mini-unit">{ind.unit}</span>
                    </span>
                    <span className="indicator-mini-goal">目标{ind.target}</span>
                    <div className="indicator-mini-rate">
                      <span className={`indicator-mini-rate-val ${isBehind ? 'rate-warn' : ''}`}>{pct}%</span>
                      <span className={`indicator-mini-trend ${ind.trend}`}>{ind.trend === 'up' ? '▲' : '▼'} {ind.trendValue}</span>
                    </div>
                  </div>
                  <div className="indicator-mini-progress">
                    <div className={`indicator-mini-progress-fill ${isBehind ? 'fill-warn' : ''}`} style={{ width: `${progressWidth(ind.actual, ind.target)}%` }} />
                  </div>
                </div>
              )
            })}
            <div className="action-suggest-card">
              <div className="action-suggest-title">⚡ 行动建议</div>
              <div className="action-suggest-list">
                {indicators.map((ind, i) => (
                  <div key={ind.key} className="action-suggest-item">
                    <span className="action-suggest-num">{i + 1}</span>
                    <span className="action-suggest-text">{ind.topAction}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 两会一园 + 联想伙伴 Row ===== */}
      <div className="row-assoc-partner" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="assoc-section">
          <div className="section-card-top">
            <span className="section-card-title">两会一园</span>
            <span className="leads-card-count">共 {assocMarkerData.length} 家</span>
          </div>
          <div className="assoc-list">
            {assocMarkerData.map(item => (
              <div key={item.id} className="assoc-item-new">
                <div className="assoc-item-new-row1">
                  <span className={`assoc-type ${item.type === '协会' ? 'type-assoc' : item.type === '商会' ? 'type-chamber' : 'type-park'}`}>
                    {item.type}
                  </span>
                  <span className="assoc-name-link" onClick={() => setCompanyDetailModal({ assoc: item })} title="点击查看会员企业">
                    {item.name}
                  </span>
                  <span className="assoc-company-count" onClick={() => setCompanyDetailModal({ assoc: item })} title="点击查看会员企业">
                    {item.companies.length} 家
                  </span>
                  <span className={`assoc-status ${item.status === '已签约' ? 'as-signed' : item.status === '洽谈中' ? 'as-negotiating' : 'as-pending'}`}>
                    {item.status}
                  </span>
                </div>
                <div className="assoc-item-new-row2">
                  <span className="assoc-item-info">👤 {item.contact}</span>
                  <span className="assoc-item-info">📞 {item.contactPhone}</span>
                  <span className="assoc-item-info">📍 {item.address}</span>
                  <span className="assoc-item-info">🤝 {item.signedPartner || '—'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="partner-section">
          <div className="section-card-top">
            <span className="section-card-title">联想伙伴——增值服务商</span>
            <span className="leads-card-count">共 {partnerMarkerData.length} 家</span>
          </div>
          <div className="partner-table-wrapper">
            <table className="partner-table">
              <thead>
                <tr>
                  <th>伙伴名称</th><th>等级</th><th>月STI</th><th>锁定率</th><th>承载率</th><th>状态</th><th>拜访状态</th><th>拜访记录</th>
                </tr>
              </thead>
              <tbody>
                {partnerMarkerData.map(p => {
                  const visit = getPartnerVisit(p.id)
                  const vs = visit ? getPartnerVisitStatus(visit) : '无'
                  return (
                    <tr key={p.id}>
                      <td><span className="partner-name-link">{p.name}</span></td>
                      <td><span className={`partner-lvl lvl-${levelClass(p.level)}`}>{p.level}</span></td>
                      <td>{p.monthlySTI}台</td>
                      <td>{p.lockRate}%</td>
                      <td>{p.attachRate}%</td>
                      <td>
                        <span className={`partner-dot ${p.status === '活跃' ? 'dot-active' : p.status === '一般' ? 'dot-normal' : 'dot-silent'}`} />
                        {p.status}
                      </td>
                      <td>
                        <span className={`partner-visit-status ${vs === '已拜访' ? 'pv-recent' : vs === '本月已访' ? 'pv-month' : vs === '超过1月' ? 'pv-old' : 'pv-none'}`}>
                          {vs}
                        </span>
                      </td>
                      <td>
                        {visit ? (
                          <span className="partner-visit-link" onClick={() => setSelectedAssoc(null)}>
                            {visit.visitDate}
                          </span>
                        ) : (
                          <span className="partner-visit-none">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AIAssistant />

      {/* ===== B4 Customer List ===== */}
      <div className="b4-customers-section">
        <div className="section-card">
          <div className="section-card-top">
            <span className="section-card-title">B4 客户清单</span>
            <span className="leads-card-count">共 {b4Customers.length} 条</span>
          </div>
          <div className="b4-table-wrapper">
            <table className="b4-table">
              <thead>
                <tr>
                  <th>客户名称</th><th>行业</th><th>潜力</th><th>当前收入(万)</th><th>潜在收入(万)</th><th>状态</th><th>负责人</th><th>下一步</th>
                </tr>
              </thead>
              <tbody>
                {b4Customers.map(c => (
                  <tr key={c.id}>
                    <td><span className="b4-customer-name">{c.name}</span></td>
                    <td><span className="b4-industry">{c.industry}</span></td>
                    <td><span className={`b4-potential potential-${c.potential}`}>{c.potential}</span></td>
                    <td>{c.currentRevenue}</td>
                    <td>{c.potentialRevenue}</td>
                    <td>
                      <span className={`b4-status ${c.status === '跟进中' ? 'status-following' : c.status === '谈判中' ? 'status-negotiating' : 'status-initial'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>{c.owner}</td>
                    <td>{c.nextAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===== Company List Modal ===== */}
      {companyDetailModal && (() => {
        const { assoc } = companyDetailModal
        const filtered = getFilteredCompanies(assoc)
        const stats = getCompanyStats(assoc)
        return (
          <div className="modal-overlay" onClick={() => { setCompanyDetailModal(null); resetCompanyFilters() }}>
            <div className="company-list-modal" onClick={e => e.stopPropagation()} style={{ width: 900, maxWidth: '95vw', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
              <div className="visit-modal-head">
                <span className="visit-modal-title">{assoc.name} · 会员企业清单</span>
                <button className="modal-close" onClick={() => { setCompanyDetailModal(null); resetCompanyFilters() }}>✕</button>
              </div>
              <div style={{ padding: 'var(--space-lg) var(--space-xl)', overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: 1 }}>
                {/* Stats Overview */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                  {[
                    { label: '总企业数', value: stats.total, color: 'var(--brand-600)' },
                    { label: '⭐ 高价值客户', value: stats.highValue, color: 'var(--warning)' },
                    { label: '已合作', value: stats.cooperated, color: 'var(--success)' },
                    { label: '洽谈中', value: stats.negotiating, color: 'var(--accent)' },
                    { label: '待跟进', value: stats.pending, color: 'var(--text-muted)' },
                  ].map(s => (
                    <div key={s.label} style={{ background: 'var(--bg-body)', borderRadius: 'var(--radius)', padding: 'var(--space-md)', textAlign: 'center' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{s.label}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)', flexWrap: 'wrap', alignItems: 'center' }}>
                  <input
                    className="filter-input"
                    placeholder="🔍 搜索公司名称..."
                    value={companySearch}
                    onChange={e => setCompanySearch(e.target.value)}
                    style={{ flex: 1, minWidth: 160 }}
                  />
                  <select className="filter-select" value={industryFilter} onChange={e => setIndustryFilter(e.target.value)}>
                    <option value="全部">全部行业</option>
                    {allIndustries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                  <select className="filter-select" value={highValueFilter} onChange={e => setHighValueFilter(e.target.value)}>
                    <option value="全部">高价值客户：全部</option>
                    <option value="是">高价值客户：是</option>
                    <option value="否">高价值客户：否</option>
                  </select>
                  <select className="filter-select" value={cooperationFilter} onChange={e => setCooperationFilter(e.target.value)}>
                    <option value="全部">合作状态：全部</option>
                    <option value="已合作">已合作</option>
                    <option value="洽谈中">洽谈中</option>
                    <option value="待跟进">待跟进</option>
                  </select>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto', overflowY: 'auto', flex: 1 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, whiteSpace: 'nowrap', minWidth: 1200 }}>
                    <thead>
                      <tr style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                        {['CDBID', '公司名称', '行业', '主营业务', '营业规模', '员工人数', '成立时间', '决策人', '决策人电话', '联系人', '联系人电话', '高价值', '合作状态', '最近拜访'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '6px 8px', fontSize: 11, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', fontWeight: 600, background: 'var(--bg-surface)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((c, idx) => {
                        const isHigh = c.isHighValue
                        return (
                          <tr
                            key={c.id}
                            style={{
                              borderBottom: '1px solid var(--border-light)',
                              background: isHigh ? 'rgba(255, 215, 0, 0.08)' : idx % 2 === 0 ? 'var(--bg-body)' : 'transparent',
                            }}
                          >
                            <td style={{ padding: '6px 8px', fontFamily: 'monospace', fontSize: 11, color: 'var(--text-secondary)' }}>{c.cdbid}</td>
                            <td style={{ padding: '6px 8px', fontWeight: 600 }}>{c.name}</td>
                            <td style={{ padding: '6px 8px', color: 'var(--text-secondary)' }}>{c.industry}</td>
                            <td style={{ padding: '6px 8px', color: 'var(--text-secondary)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.mainBusiness}</td>
                            <td style={{ padding: '6px 8px' }}>{c.businessScale}</td>
                            <td style={{ padding: '6px 8px' }}>{c.employeeCount}人</td>
                            <td style={{ padding: '6px 8px', color: 'var(--text-secondary)' }}>{c.foundedDate}</td>
                            <td style={{ padding: '6px 8px' }}>{c.decisionMakerName}</td>
                            <td style={{ padding: '6px 8px', color: 'var(--text-secondary)' }}>{c.decisionMakerPhone}</td>
                            <td style={{ padding: '6px 8px' }}>{c.contactName}</td>
                            <td style={{ padding: '6px 8px', color: 'var(--text-secondary)' }}>{c.contactPhone}</td>
                            <td style={{ padding: '6px 8px', textAlign: 'center' }}>{isHigh ? <span title="高价值客户" style={{ cursor: 'default' }}>⭐</span> : '—'}</td>
                            <td style={{ padding: '6px 8px' }}>
                              <span style={{
                                fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                                background: c.cooperationStatus === '已合作' ? 'var(--success-light)' : c.cooperationStatus === '洽谈中' ? 'var(--warning-light)' : 'var(--bg-body)',
                                color: c.cooperationStatus === '已合作' ? 'var(--success)' : c.cooperationStatus === '洽谈中' ? 'var(--warning)' : 'var(--text-muted)',
                              }}>
                                {c.cooperationStatus}
                              </span>
                            </td>
                            <td style={{ padding: '6px 8px' }}>
                              <span
                                style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 2 }}
                                onClick={() => setSelectedVisitCompanyId(c.id)}
                              >
                                {c.lastVisitDate}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={14} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>暂无匹配的企业数据</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ===== Visit Record Modal ===== */}
      {selectedVisitCompanyId && (() => {
        const company = getCompanyById(selectedVisitCompanyId, assocMarkerData)
        const records = company ? company.visitRecords : []
        return (
          <div className="modal-overlay" onClick={() => setSelectedVisitCompanyId(null)}>
            <div className="visit-record-modal" onClick={e => e.stopPropagation()}>
              <div className="visit-modal-head">
                <span className="visit-modal-title">📋 {company?.name || ''} 拜访记录</span>
                <button className="modal-close" onClick={() => setSelectedVisitCompanyId(null)}>✕</button>
              </div>
              <div style={{ padding: 'var(--space-xl)', maxHeight: '70vh', overflowY: 'auto' }}>
                {records.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>暂无拜访记录</div>
                ) : (
                  records.map(record => (
                    <div key={record.id} style={{
                      background: 'var(--bg-body)', borderRadius: 'var(--radius)', padding: 'var(--space-lg)',
                      marginBottom: 'var(--space-md)', border: '1px solid var(--border-light)',
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                        <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 'var(--space-sm) var(--space-md)', border: '1px solid var(--border-light)' }}>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>拜访日期</div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{record.visitDate}</div>
                        </div>
                        <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 'var(--space-sm) var(--space-md)', border: '1px solid var(--border-light)' }}>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>拜访对象</div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{record.visitTarget}</div>
                        </div>
                        <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 'var(--space-sm) var(--space-md)', border: '1px solid var(--border-light)' }}>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>拜访方式</div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{record.visitType}</div>
                        </div>
                        <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 'var(--space-sm) var(--space-md)', border: '1px solid var(--border-light)' }}>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>参与人员</div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{record.attendees}</div>
                        </div>
                      </div>
                      <div style={{ marginBottom: 'var(--space-md)' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 'var(--space-sm)', color: 'var(--text-primary)' }}>📝 拜访摘要</div>
                        <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 'var(--space-md)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, borderLeft: '3px solid var(--accent)' }}>{record.summary}</div>
                      </div>
                      <div style={{ marginBottom: 'var(--space-md)' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 'var(--space-sm)', color: 'var(--text-primary)' }}>💬 客户反馈</div>
                        <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 'var(--space-md)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, borderLeft: '3px solid var(--warning)' }}>{record.feedback}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 'var(--space-sm)', color: 'var(--text-primary)' }}>🔜 下一步计划 / 复盘</div>
                        <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 'var(--space-md)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, borderLeft: '3px solid var(--success)' }}>{record.nextPlan}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
