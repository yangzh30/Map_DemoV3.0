import { useState, useRef, useEffect } from 'react'
import * as echarts from 'echarts'
import {
  mockTwoAssociations as _assocData, mockChannelPartners as _partnerData,
  mockVisits as _mockVisitsData, mockTasks as _mockTasksData,
  mockPartnerVisits,
} from '../../data/mockData'
import type { PartnerVisit, VisitItem, TwoAssociationsItem, ChannelPartner, TaskItem } from '../../types'
import AIAssistant from '../../components/AIAssistant/AIAssistant'
import './TerritoryDashboard.css'

const assocMarkerData: {
  id: string; name: string; type: string; value: [number, number];
  status: string; address: string; contact: string; memberCount: number;
  signedPartner?: string;
}[] = [
  { id: 'TA-001', name: '上海软件行业协会', type: '协会', value: [121.455, 31.245], status: '洽谈中', address: '静安区江场西路299弄4号楼1205室', contact: '周会长', memberCount: 350 },
  { id: 'TA-002', name: '浦东新区商会', type: '商会', value: [121.525, 31.225], status: '洽谈中', address: '浦东新区民生路1286号汇商大厦6楼', contact: '钱秘书长', memberCount: 500 },
  { id: 'TA-003', name: '张江高科技园区', type: '园区', value: [121.585, 31.205], status: '待开发', address: '浦东新区张江高科技园区', contact: '郑主任', memberCount: 280 },
  { id: 'TA-004', name: '上海人工智能协会', type: '协会', value: [121.515, 31.195], status: '洽谈中', address: '浦东新区世博村路231号306室', contact: '赵副会长', memberCount: 420 },
  { id: 'TA-005', name: '金桥出口加工区', type: '园区', value: [121.605, 31.255], status: '待开发', address: '浦东新区金桥出口加工区', contact: '吴主任', memberCount: 380 },
  { id: 'TA-006', name: '浦东青年商会', type: '商会', value: [121.555, 31.175], status: '待开发', address: '浦东新区纳贤路800号张江科学城', contact: '孙会长', memberCount: 200 },
  { id: 'TA-007', name: '上海浦东软件园', type: '园区', value: [121.595, 31.185], status: '已签约', address: '浦东新区博云路2号', contact: '韩主任', memberCount: 510, signedPartner: '上海辰晔信息科技有限公司' },
  { id: 'TA-008', name: '上海漕河泾远中产业园', type: '园区', value: [121.535, 31.265], status: '已签约', address: '浦东新区张江碧波路500号', contact: '李秘书长', memberCount: 280, signedPartner: '上海致柏商贸有限公司' },
]

const partnerMarkerData: {
  id: string; name: string; level: string; value: [number, number];
  status: string; monthlySTI: number; lockRate: number; attachRate: number;
  visitStatus: string; lastVisit: string;
}[] = [
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

// B4 客户清单数据
const b4Customers: {
  id: string; name: string; industry: string; potential: string;
  currentRevenue: number; potentialRevenue: number; lastContact: string;
  status: string; owner: string; nextAction: string;
}[] = [
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
  { id: 'B4-026', name: '上海豫园旅游商城股份', industry: '商业', potential: '中', currentRevenue: 105, potentialRevenue: 430, lastContact: '2026-04-11', status: '跟进中', owner: '黄俊', nextAction: '商务拜访' },
  { id: 'B4-027', name: '上海兰生股份有限公司', industry: '贸易', potential: '中', currentRevenue: 88, potentialRevenue: 380, lastContact: '2026-04-10', status: '初步接触', owner: '黄俊', nextAction: '需求调研' },
  { id: 'B4-028', name: '上海开开实业股份有限公司', industry: '纺织', potential: '低', currentRevenue: 65, potentialRevenue: 320, lastContact: '2026-04-09', status: '跟进中', owner: '黄俊', nextAction: '产品推介' },
  { id: 'B4-029', name: '上海三枪集团股份有限公司', industry: '纺织', potential: '低', currentRevenue: 72, potentialRevenue: 340, lastContact: '2026-04-08', status: '初步接触', owner: '黄俊', nextAction: '初步沟通' },
  { id: 'B4-030', name: '上海龙头集团股份有限公司', industry: '纺织', potential: '低', currentRevenue: 58, potentialRevenue: 290, lastContact: '2026-04-07', status: '跟进中', owner: '黄俊', nextAction: '方案准备' },
  { id: 'B4-031', name: '上海友谊集团股份有限公司', industry: '商业', potential: '中', currentRevenue: 98, potentialRevenue: 410, lastContact: '2026-04-06', status: '跟进中', owner: '黄俊', nextAction: '商务洽谈' },
  { id: 'B4-032', name: '上海第一百货商店股份', industry: '商业', potential: '中', currentRevenue: 115, potentialRevenue: 440, lastContact: '2026-04-05', status: '谈判中', owner: '黄俊', nextAction: '合同准备' },
]

// Drill-down data types
type DrillLevel = 'assoc' | 'partner' | 'visit' | 'task'
interface DrillState {
  open: boolean
  level: DrillLevel
  title: string
  data: any
}

// Mock drill-down data generators
function getAssocMembers(assocId: string) {
  const members: { id: string; name: string; industry: string; contact: string; potential: string; status: string }[] = [
    { id: 'M-001', name: '中芯国际集成电路', industry: '半导体', contact: '黄总 138****1234', potential: '高', status: '已合作' },
    { id: 'M-002', name: '韦尔股份', industry: '芯片设计', contact: '马总 186****5678', potential: '高', status: '洽谈中' },
    { id: 'M-003', name: '华勤技术', industry: 'ODM', contact: '赵总监 139****9012', potential: '高', status: '已合作' },
    { id: 'M-004', name: '盛美半导体', industry: '半导体设备', contact: '王总 138****6789', potential: '中', status: '待跟进' },
    { id: 'M-005', name: '芯原股份', industry: '芯片设计服务', contact: '陈总 139****4567', potential: '中', status: '已合作' },
    { id: 'M-006', name: '上海微电子', industry: '光刻设备', contact: '林主任 136****0123', potential: '高', status: '洽谈中' },
    { id: 'M-007', name: '安集微电子', industry: '半导体材料', contact: '赵总监 177****3456', potential: '中', status: '待跟进' },
    { id: 'M-008', name: '智元机器人', industry: '具身智能', contact: '李经理 186****8901', potential: '低', status: '待跟进' },
  ]
  return members.filter((_, i) => (assocId.charCodeAt(assocId.length - 1) + i) % 3 !== 0).slice(0, 5 + (assocId.charCodeAt(assocId.length - 1) % 4))
}

function getPartnerOrders(partnerId: string) {
  const orders: { id: string; product: string; quantity: number; amount: number; status: string; date: string }[] = [
    { id: 'E011847924', product: 'ThinkPad X1 Carbon Gen 12', quantity: 50, amount: 625000, status: '排产中', date: '2026-05-01' },
    { id: 'E012498733', product: 'ThinkPad T14 Gen 6 + 扩展坞', quantity: 80, amount: 1120000, status: '生产中', date: '2026-04-25' },
    { id: 'E012320880', product: 'ThinkSystem SR650 V3 + 存储', quantity: 8, amount: 1860000, status: '运输中', date: '2026-04-28' },
    { id: 'E011596720', product: 'ThinkCentre M75q Gen5', quantity: 200, amount: 960000, status: '已签收', date: '2026-04-20' },
    { id: 'E011596719', product: 'ThinkBook 16 G7+', quantity: 30, amount: 255000, status: '排产中', date: '2026-05-02' },
    { id: 'E011596704', product: 'ThinkSystem SD530 V4', quantity: 20, amount: 2800000, status: '待排产', date: '2026-05-04' },
  ]
  return orders.filter((_, i) => (partnerId.charCodeAt(partnerId.length - 1) + i) % 2 === 0).slice(0, 3 + (partnerId.charCodeAt(partnerId.length - 1) % 3))
}

function getPartnerTasks(partnerId: string): TaskItem[] {
  const allTasks: TaskItem[] = [
    { id: 'T-001', content: '完成中芯国际需求调研报告', priority: '高', dueDate: '2026-05-08', status: '待处理', relatedCompany: '中芯国际' },
    { id: 'T-002', content: '提交浦发银行投标文件', priority: '高', dueDate: '2026-05-13', status: '处理中', relatedCompany: '浦发银行' },
    { id: 'T-003', content: '审核伟仕佳杰金牌升级材料', priority: '中', dueDate: '2026-05-10', status: '待处理', relatedCompany: '伟仕佳杰' },
    { id: 'T-004', content: '跟进华勤技术数据中心方案报价', priority: '高', dueDate: '2026-05-09', status: '处理中', relatedCompany: '华勤技术' },
    { id: 'T-005', content: '更新上海市软件行业协会会员联系名录', priority: '低', dueDate: '2026-05-15', status: '待处理' },
    { id: 'T-006', content: '处理上海翎云科技注册伙伴激活流程', priority: '中', dueDate: '2026-05-08', status: '待处理', relatedCompany: '上海翎云科技' },
    { id: 'T-007', content: '神州数码季度对账确认', priority: '中', dueDate: '2026-05-12', status: '处理中', relatedCompany: '神州数码' },
    { id: 'T-008', content: '联强国际承载率提升方案制定', priority: '高', dueDate: '2026-05-11', status: '待处理', relatedCompany: '联强国际' },
  ]
  return allTasks.filter((_, i) => (partnerId.charCodeAt(partnerId.length - 1) + i) % 3 !== 0).slice(0, 3)
}

function getPartnerVisits(partnerId: string): VisitItem[] {
  const allVisits: VisitItem[] = [
    { id: 'V-001', companyName: '中芯国际', contact: '黄总', purpose: '初次拜访，介绍联想ThinkSystem服务器方案', date: '2026-05-07', time: '09:30', status: '待拜访', address: '浦东新区张江路18号' },
    { id: 'V-002', companyName: '韦尔股份', contact: '马总', purpose: '智慧工厂项目需求深化沟通', date: '2026-05-07', time: '14:00', status: '待拜访', address: '浦东新区张江高科技园区' },
    { id: 'V-003', companyName: '华勤技术', contact: '赵总监', purpose: '数据中心二期扩容方案汇报', date: '2026-05-08', time: '10:00', status: '待拜访', address: '浦东新区科苑路399号' },
    { id: 'V-004', companyName: '神州数码', contact: '周总', purpose: '季度业务回顾及下季度订货计划', date: '2026-05-06', time: '15:30', status: '已拜访', address: '浦东新区世纪大道88号' },
    { id: 'V-005', companyName: '芯原股份', contact: '赵总监', purpose: '芯片设计EDA平台IT设备需求调研', date: '2026-05-09', time: '09:00', status: '待拜访', address: '浦东新区松涛路560号' },
    { id: 'V-006', companyName: '上海金陵网络', contact: '姚经理', purpose: '政府集采项目合作洽谈', date: '2026-05-10', time: '10:00', status: '待拜访', address: '浦东新区张杨路550号' },
  ]
  return allVisits.filter((_, i) => (partnerId.charCodeAt(partnerId.length - 1) + i) % 2 === 0).slice(0, 3)
}

function markerColor(status: string): string {
  if (status === '已签约') return '#22c55e'
  if (status === '洽谈中') return '#f59e0b'
  return '#9ca3af'
}

function partnerMarkerColor(level: string): string {
  if (level === '钻石') return '#f59e0b'
  if (level === '金牌') return '#6366f1'
  if (level === '银牌') return '#3b82f6'
  if (level === '铜牌') return '#64748b'
  return '#9ca3af'
}

function ShanghaiMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<echarts.ECharts | null>(null)
  const [mode, setMode] = useState<'assoc' | 'partner'>('assoc')

  useEffect(() => {
    if (!containerRef.current) return

    const fetchAndInit = async () => {
      const resp = await fetch(import.meta.env.BASE_URL + 'data/上海市.geojson')
      const geoJson = await resp.json()
      echarts.registerMap('shanghai', geoJson)

      if (!containerRef.current) return

      if (chartRef.current) chartRef.current.dispose()
      const chart = echarts.init(containerRef.current)
      chartRef.current = chart

      const isAssoc = mode === 'assoc'
      const seriesData = isAssoc
        ? assocMarkerData.map(m => ({ name: m.name, value: m.value, _raw: m, itemStyle: { color: markerColor(m.status) } }))
        : partnerMarkerData.map(m => ({ name: m.name, value: m.value, _raw: m, itemStyle: { color: partnerMarkerColor(m.level) } }))

      const option: echarts.EChartsOption = {
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            if (params.seriesType === 'scatter') {
              const d = params.data as any
              if (!d || !d._raw) return ''
              const r = d._raw
              if (isAssoc) {
                const statusColor = r.status === '已签约' ? '#22c55e' : r.status === '洽谈中' ? '#f59e0b' : '#9ca3af'
                const signedHtml = r.signedPartner ? `<div style="font-size:11px;color:#22c55e;margin-bottom:4px;font-weight:600;">✅ 已签约的客户代理商：${r.signedPartner}</div>` : ''
                return `<div style="min-width:180px;font-size:12px;">
                  <div style="font-weight:700;font-size:14px;margin-bottom:4px;">${r.name}</div>
                  <div style="display:flex;gap:6px;margin-bottom:4px;">
                    <span style="display:inline-block;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:600;background:#e0e7ff;color:#4338ca">${r.type}</span>
                    <span style="display:inline-block;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:600;color:${statusColor}">${r.status}</span>
                  </div>
                  ${signedHtml}
                  <div style="font-size:11px;color:#64748b;margin-bottom:2px;">📍 ${r.address}</div>
                  <div style="font-size:11px;color:#94a3b8;">👤 ${r.contact} · 👥 ${r.memberCount}家会员</div>
                </div>`
              } else {
                const levelColor = partnerMarkerColor(r.level)
                const statusColor = r.status === '活跃' ? '#22c55e' : r.status === '一般' ? '#f59e0b' : '#9ca3af'
                const visitColor = r.visitStatus === '已拜访' ? '#22c55e' : r.visitStatus === '本月已访' ? '#f59e0b' : '#9ca3af'
                return `<div style="min-width:220px;font-size:12px;">
                  <div style="font-weight:700;font-size:14px;margin-bottom:4px;">${r.name}</div>
                  <div style="display:flex;gap:6px;margin-bottom:6px;">
                    <span style="display:inline-block;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:600;background:${levelColor}20;color:${levelColor}">${r.level}</span>
                    <span style="display:inline-block;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:600;color:${statusColor}">${r.status}</span>
                  </div>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:11px;color:#64748b;margin-bottom:4px;">
                    <div>📊 月STI: <b>${r.monthlySTI}</b>台</div>
                    <div>🔒 锁定率: <b>${r.lockRate}%</b></div>
                    <div>📎 承载率: <b>${r.attachRate}%</b></div>
                    <div>📅 最近拜访: <b>${r.lastVisit}</b></div>
                  </div>
                  <div style="font-size:11px;color:${visitColor};font-weight:600;">👤 拜访情况: ${r.visitStatus}</div>
                </div>`
              }
            }
            return params.name || ''
          },
          backgroundColor: '#fff',
          borderColor: '#e2e8f0',
          textStyle: { color: '#1e293b' },
          extraCssText: 'border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);padding:10px;',
        },
        geo: {
          map: 'shanghai',
          roam: true,
          zoom: 1.2,
          center: [121.47, 31.22],
          label: {
            show: true,
            fontSize: 10,
            color: '#e2e8f0',
            fontWeight: 600,
          },
          itemStyle: {
            areaColor: '#1e3a5f',
            borderColor: '#00d4ff',
            borderWidth: 1.2,
            shadowColor: 'rgba(0, 212, 255, 0.3)',
            shadowBlur: 10,
          },
          emphasis: {
            itemStyle: {
              areaColor: '#2d6aa0',
              borderColor: '#00ffff',
              borderWidth: 2,
            },
            label: {
              show: true,
              fontSize: 12,
              color: '#fff',
              fontWeight: 700,
            },
          },
          select: {
            itemStyle: {
              areaColor: '#2d6aa0',
            },
          },
        },
        series: [
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            data: seriesData,
            symbol: 'pin',
            symbolSize: 28,
            itemStyle: {
              color: '#ef4444',
              borderColor: '#fff',
              borderWidth: 1.5,
              shadowBlur: 8,
              shadowColor: 'rgba(0,0,0,0.3)',
            },
            label: {
              show: true,
              position: 'top',
              formatter: '{b}',
              color: '#fff',
              fontSize: 10,
              fontWeight: 600,
              textShadowBlur: 4,
              textShadowColor: '#000',
              distance: 6,
            },
            emphasis: {
              scale: 1.5,
              itemStyle: { color: '#ff6666' },
            },
          },
        ],
      }

      chart.setOption(option)
    }

    fetchAndInit()

    const handleResize = () => chartRef.current?.resize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (chartRef.current) {
        chartRef.current.dispose()
        chartRef.current = null
      }
    }
  }, [mode])

  return (
    <div className="shanghai-map-container">
      <div className="shanghai-map-title">
        <span>作战地图</span>
        <div className="map-mode-switch">
          <button className={`map-mode-btn ${mode === 'assoc' ? 'active' : ''}`} onClick={() => setMode('assoc')}>两会一园</button>
          <button className={`map-mode-btn ${mode === 'partner' ? 'active' : ''}`} onClick={() => setMode('partner')}>联想伙伴</button>
        </div>
      </div>
      <div className="chart-sizer" ref={containerRef} />
      <div className="shanghai-map-legend">
        {mode === 'assoc' ? (
          <>
            <span className="map-legend-item"><span className="map-legend-dot legend-dot-assoc" />协会</span>
            <span className="map-legend-item"><span className="map-legend-dot legend-dot-chamber" />商会</span>
            <span className="map-legend-item"><span className="map-legend-dot legend-dot-park" />园区</span>
            <span className="map-legend-item" style={{ marginLeft: 'auto', gap: 6 }}>
              <span className="map-legend-dot legend-dot-signed" />已签约
              <span className="map-legend-dot legend-dot-negotiating" />洽谈中
              <span className="map-legend-dot legend-dot-pending" />待开发
            </span>
          </>
        ) : (
          <>
            <span className="map-legend-item"><span className="map-legend-dot legend-dot-diamond" />钻石</span>
            <span className="map-legend-item"><span className="map-legend-dot legend-dot-gold" />金牌</span>
            <span className="map-legend-item"><span className="map-legend-dot legend-dot-silver" />银牌</span>
            <span className="map-legend-item"><span className="map-legend-dot legend-dot-bronze" />铜牌</span>
            <span className="map-legend-item"><span className="map-legend-dot legend-dot-reg" />注册</span>
          </>
        )}
      </div>
    </div>
  )
}

function levelClass(level: string) {
  switch (level) {
    case '钻石': return 'diamond'
    case '金牌': return 'gold'
    case '银牌': return 'silver'
    case '铜牌': return 'bronze'
    default: return 'reg'
  }
}

// Partner to district manager mapping
const partnerDistrictMap: Record<string, { district: string; manager: string }> = {
  'CH-001': { district: '浦东辖区', manager: '张经理' },
  'CH-002': { district: '徐汇辖区', manager: '王经理' },
  'CH-003': { district: '杨浦辖区', manager: '陈经理' },
  'CH-004': { district: '静安辖区', manager: '赵经理' },
  'CH-005': { district: '闵行辖区', manager: '刘经理' },
  'CH-006': { district: '长宁辖区', manager: '孙经理' },
  'CH-007': { district: '普陀辖区', manager: '周经理' },
  'CH-008': { district: '虹口辖区', manager: '吴经理' },
  'CH-009': { district: '宝山辖区', manager: '郑经理' },
  'CH-010': { district: '松江辖区', manager: '钱经理' },
  'CH-011': { district: '浦东辖区', manager: '张经理' },
  'CH-012': { district: '徐汇辖区', manager: '王经理' },
  'CH-013': { district: '杨浦辖区', manager: '陈经理' },
  'CH-014': { district: '静安辖区', manager: '赵经理' },
  'CH-015': { district: '闵行辖区', manager: '刘经理' },
  'CH-016': { district: '长宁辖区', manager: '孙经理' },
  'CH-017': { district: '普陀辖区', manager: '周经理' },
  'CH-018': { district: '虹口辖区', manager: '吴经理' },
  'CH-019': { district: '宝山辖区', manager: '郑经理' },
  'CH-020': { district: '松江辖区', manager: '钱经理' },
}

export default function TerritoryDashboard() {
  const [recordModal, setRecordModal] = useState<VisitItem | null>(null)
  const [visitNotes, setVisitNotes] = useState('')
  const [visitLoading, setVisitLoading] = useState(false)
  const [visitResult, setVisitResult] = useState<{ summary: string; nextPlan: string } | null>(null)
  const [visits, setVisits] = useState(_mockVisitsData)
  const [tasks, setTasks] = useState(_mockTasksData)
  const [assocData] = useState(_assocData)
  const [partnerData] = useState(_partnerData)
  const [assocFilter, setAssocFilter] = useState<string>('全部')
  const [assocSearch, setAssocSearch] = useState('')
  const [partnerFilter, setPartnerFilter] = useState<string>('全部')
  const [partnerSearch, setPartnerSearch] = useState('')
  const [b4IndustryFilter, setB4IndustryFilter] = useState('全部')
  const [b4PotentialFilter, setB4PotentialFilter] = useState('全部')
  const [b4Search, setB4Search] = useState('')

  // Drill-down modal state
  const [drill, setDrill] = useState<DrillState>({ open: false, level: 'assoc', title: '', data: null })

  const openAssocDrill = (assoc: TwoAssociationsItem) => {
    setDrill({ open: true, level: 'assoc', title: assoc.name, data: assoc })
  }
  const openPartnerDrill = (partner: ChannelPartner) => {
    setDrill({ open: true, level: 'partner', title: partner.name, data: partner })
  }
  const openVisitDrill = (visit: PartnerVisit) => {
    setDrill({ open: true, level: 'visit', title: `${visit.partnerName} · 拜访记录`, data: visit })
  }
  const openTaskDrill = (task: TaskItem) => {
    setDrill({ open: true, level: 'task', title: '任务详情', data: task })
  }
  const closeDrill = () => setDrill(prev => ({ ...prev, open: false }))

  const handleVisitRecord = async () => {
    if (!visitNotes.trim() || !recordModal) return
    setVisitLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    const summary = `本次拜访围绕"${recordModal.purpose}"展开，与${recordModal.contact}进行了深入沟通。客户对联想SMB产品线（尤其是ThinkPad T14 Gen 6和ThinkBook 16 G7+）表现出较强兴趣。客户关注点集中在：1）产品价格竞争力；2）售后服务响应速度；3）DaaS租赁模式的灵活性。客户反馈当前竞品Dell Latitude系列供货周期偏长（4-5周），联想交货速度是核心优势。`
    const nextPlan = `1. 本周内发送ThinkPad T14 Gen 6和ThinkBook 16 G7+详细报价单；2. 安排下周三下午上门演示T14样机；3. 跟进DaaS服务方案的财务测算；4. 约两周后进行第二次深度沟通。`
    setVisitResult({ summary, nextPlan })
    setVisitLoading(false)
  }

  const handleConfirmRecord = () => {
    if (!recordModal) return
    setVisits(prev => prev.map(v => v.id === recordModal.id ? { ...v, status: '已拜访' } : v))
    setRecordModal(null)
  }

  const filteredB4Customers = b4Customers.filter(c => {
    const industryMatch = b4IndustryFilter === '全部' || c.industry === b4IndustryFilter
    const potentialMatch = b4PotentialFilter === '全部' || c.potential === b4PotentialFilter
    const searchMatch = b4Search === '' || c.name.includes(b4Search)
    return industryMatch && potentialMatch && searchMatch
  })

  const filteredAssocs = assocData.filter(a => {
    if (assocFilter !== '全部' && a.status !== assocFilter) return false
    if (assocSearch && !a.name.includes(assocSearch)) return false
    return true
  })

  const filteredPartners = partnerData.filter(p => {
    if (partnerFilter !== '全部' && p.level !== partnerFilter) return false
    if (partnerSearch && !p.name.includes(partnerSearch)) return false
    return true
  })

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

  const getPartnerVisitStatusClass = (visit: PartnerVisit | undefined): string => {
    if (!visit) return 'pv-none'
    const days = Math.floor((Date.now() - new Date(visit.visitDate).getTime()) / (1000 * 60 * 60 * 24))
    if (days <= 7) return 'pv-recent'
    if (days <= 30) return 'pv-month'
    return 'pv-old'
  }

  const visitTypeIcon = (t: string) => {
    switch (t) {
      case '例行拜访': return '🔄'
      case '专项沟通': return '💬'
      case '问题处理': return '🔧'
      case '签约拜访': return '✍️'
      default: return '📋'
    }
  }

  return (
    <div>
      <div className="dash-top">
        <div className="dash-greet">
          <h2>您好，黄俊</h2>
          <p>华东战区 | 上海 | 2026年5月9日 周六</p>
        </div>
      </div>

      <div className="map-indicators-row">
        <div className="map-col">
          <ShanghaiMap />
        </div>
        <div className="indicators-col">
          <div className="assoc-section" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="section-card-top">
              <span className="section-card-title">两会一园</span>
              <span className="leads-card-count">共 {filteredAssocs.length} 家</span>
            </div>
            <div className="filter-bar">
              <input className="filter-input" placeholder="搜索名称..." value={assocSearch} onChange={e => setAssocSearch(e.target.value)} />
              <select className="filter-select" value={assocFilter} onChange={e => setAssocFilter(e.target.value)}>
                <option value="全部">全部状态</option>
                <option value="已签约">已签约</option>
                <option value="洽谈中">洽谈中</option>
                <option value="待开发">待开发</option>
              </select>
            </div>
            <div className="scrollable-list" style={{ flex: 1 }}>
              {filteredAssocs.map(item => (
                <div key={item.id} className="assoc-item" onClick={() => openAssocDrill(item)} style={{ cursor: 'pointer' }}>
                  <div className="assoc-left"><span className={`assoc-type ${item.type === '协会' ? 'type-assoc' : item.type === '商会' ? 'type-chamber' : 'type-park'}`}>{item.type}</span><span className="assoc-name">{item.name}</span></div>
                  <div className="assoc-right"><span>👥 {item.memberCount}家</span><span>🎯 {item.potentialCustomers}潜客</span><span className={`assoc-status ${item.status === '已签约' ? 'as-signed' : item.status === '洽谈中' ? 'as-negotiating' : 'as-pending'}`}>{item.status}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row-assoc-partner" style={{ gridTemplateColumns: '1fr' }}>
        <div className="partner-section">
          <div className="section-card-top">
            <span className="section-card-title">联想伙伴</span>
            <span className="leads-card-count">共 {filteredPartners.length} 家</span>
          </div>
          <div className="filter-bar">
            <input className="filter-input" placeholder="搜索伙伴名称..." value={partnerSearch} onChange={e => setPartnerSearch(e.target.value)} />
            <select className="filter-select" value={partnerFilter} onChange={e => setPartnerFilter(e.target.value)}>
              <option value="全部">全部等级</option>
              <option value="钻石">钻石</option>
              <option value="金牌">金牌</option>
              <option value="银牌">银牌</option>
              <option value="铜牌">铜牌</option>
              <option value="注册">注册</option>
            </select>
          </div>
          <div className="partner-table-wrapper">
            <table className="partner-table">
              <thead><tr><th>伙伴名称</th><th>等级</th><th>月STI</th><th>锁定率</th><th>承载率</th><th>状态</th><th>拜访情况</th><th>最近拜访</th></tr></thead>
              <tbody>
                {filteredPartners.map(p => {
                  const visit = getPartnerVisit(p.id)
                  return (
                    <tr key={p.id}>
                      <td><span className="partner-name-link" onClick={() => openPartnerDrill(p)}>{p.name}</span></td>
                      <td><span className={`partner-lvl lvl-${levelClass(p.level)}`}>{p.level}</span></td>
                      <td>{p.monthlySTI}台</td>
                      <td>{p.lockRate}%</td>
                      <td>{p.attachRate}%</td>
                      <td><span className={`partner-dot ${p.status === '活跃' ? 'dot-active' : p.status === '一般' ? 'dot-normal' : 'dot-silent'}`} />{p.status}</td>
                      <td><span className={`partner-visit-status ${getPartnerVisitStatusClass(visit)}`}>{getPartnerVisitStatus(visit)}</span></td>
                      <td>
                        {visit ? (
                          <span className="partner-visit-link" onClick={() => openVisitDrill(visit)}>{visit.visitDate}</span>
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

      <div className="b4-customers-section">
        <div className="section-card">
          <div className="section-card-top">
            <span className="section-card-title">📋 B4 客户清单</span>
            <span className="triple-card-badge">共 {filteredB4Customers.length} 家</span>
          </div>
          <div className="b4-filter-bar">
            <select className="b4-filter-select" value={b4IndustryFilter} onChange={e => setB4IndustryFilter(e.target.value)}>
              <option value="全部">全部行业</option>
              <option value="制造业">制造业</option>
              <option value="金融">金融</option>
              <option value="半导体">半导体</option>
              <option value="汽车">汽车</option>
              <option value="互联网">互联网</option>
              <option value="医药">医药</option>
              <option value="能源">能源</option>
              <option value="园区开发">园区开发</option>
            </select>
            <select className="b4-filter-select" value={b4PotentialFilter} onChange={e => setB4PotentialFilter(e.target.value)}>
              <option value="全部">全部潜力</option>
              <option value="高">高潜力</option>
              <option value="中">中潜力</option>
              <option value="低">低潜力</option>
            </select>
            <input className="b4-search-input" placeholder="搜索客户名称..." value={b4Search} onChange={e => setB4Search(e.target.value)} />
          </div>
          <div className="b4-table-wrapper">
            <table className="b4-table">
              <thead>
                <tr>
                  <th>客户名称</th>
                  <th>行业</th>
                  <th>潜力</th>
                  <th>当前收入 (万)</th>
                  <th>潜力收入 (万)</th>
                  <th>最近联系</th>
                  <th>状态</th>
                  <th>下一步行动</th>
                </tr>
              </thead>
              <tbody>
                {filteredB4Customers.map(c => (
                  <tr key={c.id}>
                    <td><span className="b4-customer-name">{c.name}</span></td>
                    <td><span className="b4-industry">{c.industry}</span></td>
                    <td><span className={`b4-potential potential-${c.potential}`}>{c.potential}</span></td>
                    <td style={{ fontWeight: 600, color: c.currentRevenue > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>{c.currentRevenue}</td>
                    <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{c.potentialRevenue}</td>
                    <td style={{ fontSize: 11 }}>{c.lastContact}</td>
                    <td><span className={`b4-status status-${c.status === '跟进中' ? 'following' : c.status === '谈判中' ? 'negotiating' : 'initial'}`}>{c.status}</span></td>
                    <td style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{c.nextAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AIAssistant />

      {/* Unified Drill-down Modal */}
      {drill.open && (
        <div className="modal-overlay" onClick={closeDrill}>
          <div className="visit-modal drill-modal" onClick={e => e.stopPropagation()}>
            <div className="visit-modal-head">
              <span className="visit-modal-title">{drill.title}</span>
              <button className="modal-close" onClick={closeDrill}>✕</button>
            </div>
            <div className="visit-modal-body">
              {drill.level === 'assoc' && (() => {
                const assoc = drill.data as TwoAssociationsItem
                const members = getAssocMembers(assoc.id)
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                      <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>类型</div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{assoc.type}</div>
                      </div>
                      <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>联系人</div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{assoc.contactPerson}</div>
                      </div>
                      <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>状态</div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{assoc.status}</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>会员数量</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--brand-600)' }}>{assoc.memberCount}家</div>
                      </div>
                      <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>潜客数量</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>{assoc.potentialCustomers}家</div>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>📋 会员企业清单（{members.length}家）</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {members.map(m => (
                          <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-body)', borderRadius: 6, fontSize: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: 'var(--accent-light)', color: 'var(--accent)', fontWeight: 600 }}>{m.industry}</span>
                              <span style={{ fontWeight: 500 }}>{m.name}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)' }}>
                              <span>{m.contact}</span>
                              <span style={{ fontWeight: 600, color: m.potential === '高' ? 'var(--danger)' : m.potential === '中' ? 'var(--warning)' : 'var(--text-muted)' }}>{m.potential}潜客</span>
                              <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: m.status === '已合作' ? 'var(--success-light)' : m.status === '洽谈中' ? 'var(--warning-light)' : 'var(--bg-surface)', color: m.status === '已合作' ? 'var(--success)' : m.status === '洽谈中' ? 'var(--warning)' : 'var(--text-muted)', fontWeight: 600 }}>{m.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })()}

              {drill.level === 'partner' && (() => {
                const partner = drill.data as ChannelPartner
                const info = partnerDistrictMap[partner.id]
                const orders = getPartnerOrders(partner.id)
                const ptasks = getPartnerTasks(partner.id)
                const pvisits = getPartnerVisits(partner.id)
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
                      <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>等级</div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{partner.level}</div>
                      </div>
                      <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>所属辖区</div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{info?.district || '-'}</div>
                      </div>
                      <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>辖区经理</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>{info?.manager || '-'}</div>
                      </div>
                      <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>状态</div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{partner.status}</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
                      <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>月STI</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--brand-600)' }}>{partner.monthlySTI}台</div>
                      </div>
                      <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>月SO</div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{partner.monthlySO}台</div>
                      </div>
                      <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>锁定率</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: partner.lockRate >= 70 ? 'var(--success)' : partner.lockRate >= 60 ? 'var(--warning)' : 'var(--danger)' }}>{partner.lockRate}%</div>
                      </div>
                      <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>承载率</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: partner.attachRate >= 40 ? 'var(--success)' : partner.attachRate >= 30 ? 'var(--warning)' : 'var(--danger)' }}>{partner.attachRate}%</div>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>📦 近期订单（{orders.length}笔）</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {orders.map(o => (
                          <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-body)', borderRadius: 6, fontSize: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontWeight: 500 }}>{o.product}</span>
                              <span style={{ color: 'var(--text-muted)' }}>×{o.quantity}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)' }}>
                              <span style={{ fontWeight: 600 }}>¥{(o.amount / 10000).toFixed(1)}万</span>
                              <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: o.status === '已签收' ? 'var(--success-light)' : o.status === '运输中' || o.status === '生产中' ? 'var(--warning-light)' : 'var(--accent-light)', color: o.status === '已签收' ? 'var(--success)' : o.status === '运输中' || o.status === '生产中' ? 'var(--warning)' : 'var(--accent)', fontWeight: 600 }}>{o.status}</span>
                              <span>{o.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>📝 关联任务（{ptasks.length}条）</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {ptasks.map(t => (
                          <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-body)', borderRadius: 6, fontSize: 12, cursor: 'pointer' }} onClick={() => openTaskDrill(t)}>
                            <div style={{ fontWeight: 500 }}>{t.content}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)' }}>
                              <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: t.priority === '高' ? 'var(--danger-light)' : t.priority === '中' ? 'var(--warning-light)' : 'var(--bg-surface)', color: t.priority === '高' ? 'var(--danger)' : t.priority === '中' ? 'var(--warning)' : 'var(--text-muted)', fontWeight: 600 }}>{t.priority}</span>
                              <span>截止：{t.dueDate}</span>
                              <span>{t.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>🚶 拜访提醒（{pvisits.length}条）</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {pvisits.map(v => (
                          <div key={v.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-body)', borderRadius: 6, fontSize: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontWeight: 500 }}>{v.companyName}</span>
                              <span style={{ color: 'var(--text-muted)' }}>{v.contact}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)' }}>
                              <span>{v.purpose}</span>
                              <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: v.status === '已拜访' ? 'var(--success-light)' : 'var(--accent-light)', color: v.status === '已拜访' ? 'var(--success)' : 'var(--accent)', fontWeight: 600 }}>{v.status}</span>
                              <span>{v.date} {v.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })()}

              {drill.level === 'visit' && (() => {
                const visit = drill.data as PartnerVisit
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                      <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>拜访日期</div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{visit.visitDate}</div>
                      </div>
                      <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>拜访类型</div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{visit.visitType}</div>
                      </div>
                      <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>参与人员</div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{visit.attendees}</div>
                      </div>
                    </div>
                    <div style={{ background: 'var(--bg-body)', padding: 16, borderRadius: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>📋 拜访摘要</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{visit.summary}</div>
                    </div>
                    <div style={{ background: 'var(--bg-body)', padding: 16, borderRadius: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>📌 下一步计划</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{visit.nextPlan}</div>
                    </div>
                  </div>
                )
              })()}

              {drill.level === 'task' && (() => {
                const task = drill.data as TaskItem
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ background: 'var(--bg-body)', padding: 16, borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>任务内容</div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{task.content}</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                      <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>优先级</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: task.priority === '高' ? 'var(--danger)' : task.priority === '中' ? 'var(--warning)' : 'var(--text-muted)' }}>{task.priority}</div>
                      </div>
                      <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>截止日期</div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{task.dueDate}</div>
                      </div>
                      <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>状态</div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{task.status}</div>
                      </div>
                    </div>
                    {task.relatedCompany && (
                      <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>关联企业</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>{task.relatedCompany}</div>
                      </div>
                    )}
                    <div style={{ background: 'var(--bg-body)', padding: 16, borderRadius: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>📋 任务说明</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                        该任务由辖区经理于本周创建，需在规定时间内完成并提交相关报告。请确保与相关渠道商保持密切沟通，按时推进任务进度。如有困难请及时上报战区协调资源。
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      {recordModal && (
        <div className="modal-overlay" onClick={() => !visitLoading && setRecordModal(null)}>
          <div className="visit-record-modal" onClick={e => e.stopPropagation()}>
            <div className="visit-modal-head">
              <span className="visit-modal-title">✍️ 拜访记录 · {recordModal.companyName}</span>
              <button className="modal-close" onClick={() => !visitLoading && setRecordModal(null)}>✕</button>
            </div>
            <div className="visit-record-body">
              <div className="visit-record-info">
                <div className="visit-record-info-item"><span className="vm-label">拜访对象</span><span className="vm-value">{recordModal.companyName}</span></div>
                <div className="visit-record-info-item"><span className="vm-label">联系人</span><span className="vm-value">{recordModal.contact}</span></div>
                <div className="visit-record-info-item"><span className="vm-label">拜访目的</span><span className="vm-value">{recordModal.purpose}</span></div>
                <div className="visit-record-info-item"><span className="vm-label">计划时间</span><span className="vm-value">{recordModal.date} {recordModal.time}</span></div>
              </div>
              <div className="visit-record-input-area">
                <div className="visit-record-label">📝 语音/文字输入拜访内容</div>
                <textarea
                  className="visit-record-textarea"
                  placeholder="请描述本次拜访的内容、讨论要点、客户反馈等...&#10;&#10;支持直接粘贴语音转文字内容，或手动输入拜访记录"
                  value={visitNotes}
                  onChange={e => setVisitNotes(e.target.value)}
                  rows={5}
                />
                <div className="visit-record-actions">
                  <button className="voice-btn" title="语音输入（浏览器语音识别）" onClick={() => {
                    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
                    if (!SpeechRecognition) { alert('当前浏览器不支持语音识别，请使用Chrome或Edge浏览器'); return }
                    const recognition = new SpeechRecognition()
                    recognition.lang = 'zh-CN'
                    recognition.continuous = true
                    recognition.interimResults = true
                    let finalTranscript = visitNotes
                    recognition.onresult = (event: any) => {
                      let interimTranscript = ''
                      for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript
                        if (event.results[i].isFinal) finalTranscript += transcript
                        else interimTranscript += transcript
                      }
                      setVisitNotes(finalTranscript + (interimTranscript ? ' ' + interimTranscript : ''))
                    }
                    recognition.onerror = () => recognition.stop()
                    recognition.start()
                  }}>🎤 语音输入</button>
                </div>
              </div>
              {!visitResult && (
                <button className="visit-record-submit" onClick={handleVisitRecord} disabled={!visitNotes.trim() || visitLoading}>
                  {visitLoading ? <span>🤖 AI整理中...</span> : <span>🤖 AI整理纪要和待办</span>}
                </button>
              )}
              {visitResult && (
                <div className="visit-result">
                  <div className="visit-result-section">
                    <div className="visit-result-title">📋 AI 整理的拜访摘要</div>
                    <div className="visit-result-content">{visitResult.summary}</div>
                  </div>
                  <div className="visit-result-section">
                    <div className="visit-result-title">📌 下一步计划（待办）</div>
                    <div className="visit-result-content">{visitResult.nextPlan}</div>
                  </div>
                  <div className="visit-confirm-actions">
                    <button className="visit-confirm-btn" onClick={handleConfirmRecord}>✅ 确认完成拜访</button>
                    <button className="visit-retry-btn" onClick={() => { setVisitResult(null); setVisitNotes('') }}>🔄 重新输入</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}