import { useState, useRef, useEffect, useCallback } from 'react'
import * as echarts from 'echarts'
import {
  mockTwoAssociations as _assocData, mockChannelPartners as _partnerData,
  mockVisits as _mockVisitsData, mockTasks as _mockTasksData,
  mockCpsIndicators, mockPartnerVisits,
} from '../../data/mockData'
import type { PartnerVisit, VisitItem } from '../../types'
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

export default function TerritoryDashboard() {
  const [visitModal, setVisitModal] = useState<PartnerVisit | null>(null)
  const [recordModal, setRecordModal] = useState<VisitItem | null>(null)
  const [visitNotes, setVisitNotes] = useState('')
  const [visitLoading, setVisitLoading] = useState(false)
  const [visitResult, setVisitResult] = useState<{ summary: string; nextPlan: string } | null>(null)
  const [visits, setVisits] = useState(_mockVisitsData)
  const [tasks, setTasks] = useState(_mockTasksData)
  const [assocData, setAssocData] = useState(_assocData)
  const [partnerData, setPartnerData] = useState(_partnerData)
  const [assocRatio, setAssocRatio] = useState(0.31)
  const [visitRatio, setVisitRatio] = useState(0.5)
  const [cpsSize, setCpsSize] = useState<{ w: number; h: number } | null>(null)
  const [b4IndustryFilter, setB4IndustryFilter] = useState('全部')
  const [b4PotentialFilter, setB4PotentialFilter] = useState('全部')
  const [b4Search, setB4Search] = useState('')
  const drapRef = useRef<string | null>(null)
  const assocRowRef = useRef<HTMLDivElement>(null)
  const visitRowRef = useRef<HTMLDivElement>(null)
  const cpsRef = useRef<HTMLDivElement>(null)
  const cpsStartRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null)

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (cpsStartRef.current) {
        const dx = e.clientX - cpsStartRef.current.x
        const dy = e.clientY - cpsStartRef.current.y
        const w = Math.max(280, cpsStartRef.current.w + dx)
        const h = Math.max(40, cpsStartRef.current.h + dy)
        setCpsSize({ w, h })
        return
      }
      if (!drapRef.current) return
      const rowRef = drapRef.current === 'assoc' ? assocRowRef.current : visitRowRef.current
      if (!rowRef) return
      const rect = rowRef.getBoundingClientRect()
      const offset = e.clientX - rect.left
      const ratio = Math.max(0.15, Math.min(0.75, offset / rect.width))
      if (drapRef.current === 'assoc') setAssocRatio(ratio)
      else setVisitRatio(ratio)
    }
    const onMouseUp = () => {
      drapRef.current = null
      cpsStartRef.current = null
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    return () => { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp) }
  }, [])

  const startDrag = useCallback((rowId: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    drapRef.current = rowId
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  const startCpsDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!cpsRef.current) return
    const rect = cpsRef.current.getBoundingClientRect()
    cpsStartRef.current = { x: e.clientX, y: e.clientY, w: rect.width, h: rect.height }
    document.body.style.cursor = 'nwse-resize'
    document.body.style.userSelect = 'none'
  }, [])

  const setVisitModalForRecord = (visit: VisitItem) => {
    setRecordModal(visit)
    setVisitNotes('')
    setVisitResult(null)
  }

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

  const indicators = mockCpsIndicators

  const filteredB4Customers = b4Customers.filter(c => {
    const industryMatch = b4IndustryFilter === '全部' || c.industry === b4IndustryFilter
    const potentialMatch = b4PotentialFilter === '全部' || c.potential === b4PotentialFilter
    const searchMatch = b4Search === '' || c.name.includes(b4Search)
    return industryMatch && potentialMatch && searchMatch
  })

  const rate = (actual: number, target: number) => Math.round((actual / target) * 100)
  const progressWidth = (actual: number, target: number) => Math.min(100, (actual / target) * 100)

  const totalWeight = indicators.reduce((s, i) => s + i.weight, 0)
  const cpsScore = indicators.reduce((s, i) => s + rate(i.actual, i.target) * i.weight, 0) / totalWeight

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
        <div
          className="dash-cps-summary"
          ref={cpsRef}
          style={cpsSize ? { width: cpsSize.w, height: cpsSize.h, maxWidth: 'none', flex: 'none' } : undefined}
        >
          <div className="cps-summary-inner">
            <div className="cps-summary-col">
              <div className="cps-summary-label">总CPS达成率</div>
              <div className="cps-summary-value" style={{ color: cpsScore >= 100 ? 'var(--success)' : cpsScore >= 85 ? 'var(--brand-600)' : 'var(--danger)' }}>{cpsScore.toFixed(1)}%</div>
            </div>
            <div className="cps-summary-divider" />
            <div className="cps-summary-col">
              <div className="cps-summary-label">当季REV/CA目标及达成</div>
              <div className="cps-summary-value" style={{ color: 'var(--success)' }}>¥5,820万 / ¥6,500万</div>
              <div className="cps-summary-sub">达成率 89.5%</div>
            </div>
            <div className="cps-summary-divider" />
            <div className="cps-summary-col">
              <div className="cps-summary-label">团队内排名</div>
              <div className="cps-summary-value" style={{ color: 'var(--brand-600)' }}>🥈 华东战区第2</div>
              <div className="cps-summary-sub">全国 12/86</div>
            </div>
          </div>
          <div className="cps-resize-handle" onMouseDown={startCpsDrag} />
        </div>
      </div>

      <div className="map-indicators-row">
        <div className="map-col">
          <ShanghaiMap />
        </div>
        <div className="indicators-col">
          <div className="indicators-stack">
            {indicators.map(ind => {
              const pct = rate(ind.actual, ind.target)
              const isAchieved = ind.actual >= ind.target
              return (
                <div key={ind.key} className={`indicator-mini-card ${!isAchieved ? 'behind' : ''}`}>
                  <div className="indicator-mini-header">
                    <span className="indicator-mini-label">{ind.label}</span>
                    <span className={`indicator-mini-rank ${isAchieved ? 'rank-ok' : 'rank-warn'}`}>🏆 {ind.rank}</span>
                  </div>
                  <div className="indicator-mini-body">
                    <div className={`indicator-mini-actual ${!isAchieved ? 'actual-warn' : ''}`}>
                      {ind.actual}<span className="indicator-mini-unit">{ind.unit}</span>
                    </div>
                    <div className="indicator-mini-goal">目标 {ind.target}{ind.unit}</div>
                    <div className="indicator-mini-rate">
                      <span className={`indicator-mini-rate-val ${!isAchieved ? 'rate-warn' : ''}`}>{pct}%</span>
                      <span className={`indicator-mini-trend ${ind.trend}`}>{ind.trend === 'up' ? '▲' : '▼'} {ind.trendValue}</span>
                    </div>
                  </div>
                  <div className="indicator-mini-progress">
                    <div className={`indicator-mini-progress-fill ${!isAchieved ? 'fill-warn' : ''}`} style={{ width: `${progressWidth(ind.actual, ind.target)}%` }} />
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

      <div className="row-assoc-partner" ref={assocRowRef} style={{ gridTemplateColumns: `${assocRatio * 100}% 10px 1fr` }}>
        <div className="assoc-section">
          <div className="section-card-top"><span className="section-card-title">两会一园</span><span className="leads-card-count">共 {assocData.length} 家</span></div>
          <div className="assoc-list">
            {assocData.map(item => (
              <div key={item.id} className="assoc-item">
                <div className="assoc-left"><span className={`assoc-type ${item.type === '协会' ? 'type-assoc' : item.type === '商会' ? 'type-chamber' : 'type-park'}`}>{item.type}</span><span className="assoc-name">{item.name}</span></div>
                <div className="assoc-right"><span>👥 {item.memberCount}家</span><span>🎯 {item.potentialCustomers}潜客</span><span className={`assoc-status ${item.status === '已签约' ? 'as-signed' : item.status === '洽谈中' ? 'as-negotiating' : 'as-pending'}`}>{item.status}</span></div>
              </div>
            ))}
          </div>
        </div>
        <div className="resize-handle" onMouseDown={startDrag('assoc')} />
        <div className="partner-section">
          <div className="section-card-top"><span className="section-card-title">联想伙伴</span><span className="leads-card-count">共 {partnerData.length} 家</span></div>
          <div className="partner-table-wrapper">
            <table className="partner-table">
              <thead><tr><th>伙伴名称</th><th>等级</th><th>月STI</th><th>锁定率</th><th>承载率</th><th>状态</th><th>拜访情况</th><th>最近拜访</th></tr></thead>
              <tbody>
                {partnerData.map(p => {
                  const visit = getPartnerVisit(p.id)
                  return (
                    <tr key={p.id}>
                      <td><span className="partner-name-link">{p.name}</span></td>
                      <td><span className={`partner-lvl lvl-${levelClass(p.level)}`}>{p.level}</span></td>
                      <td>{p.monthlySTI}台</td>
                      <td>{p.lockRate}%</td>
                      <td>{p.attachRate}%</td>
                      <td><span className={`partner-dot ${p.status === '活跃' ? 'dot-active' : p.status === '一般' ? 'dot-normal' : 'dot-silent'}`} />{p.status}</td>
                      <td><span className={`partner-visit-status ${getPartnerVisitStatusClass(visit)}`}>{getPartnerVisitStatus(visit)}</span></td>
                      <td>
                        {visit ? (
                          <span className="partner-visit-link" onClick={() => setVisitModal(visit)}>{visit.visitDate}</span>
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

      <div className="row-2col" ref={visitRowRef} style={{ gridTemplateColumns: `${visitRatio * 100}% 10px 1fr` }}>
        <div className="section-card">
          <div className="section-card-top">
            <span className="section-card-title">📅 拜访提醒</span>
            <span className="triple-card-badge">{visits.filter(v => v.status === '待拜访').length}条待拜访</span>
          </div>
          <div className="triple-list">
            {visits.map(v => (
              <div key={v.id} className="triple-item" onClick={() => v.status === '待拜访' && setVisitModalForRecord(v)} style={{ cursor: v.status === '待拜访' ? 'pointer' : 'default' }}>
                <div className="triple-item-top"><span className="triple-item-name">{v.companyName}</span><span className={`triple-item-tag ${v.status === '待拜访' ? 'tag-visit-pending' : 'tag-visit-done'}`}>{v.status}</span></div>
                <div className="triple-item-sub">{v.purpose}</div>
                <div className="triple-item-meta"><span>{v.date} {v.time}</span><span>📍 {v.address.slice(0, 16)}...</span></div>
              </div>
            ))}
          </div>
        </div>
        <div className="resize-handle" onMouseDown={startDrag('visit')} />
        <div className="section-card">
          <div className="section-card-top">
            <span className="section-card-title">📝 任务提醒</span>
            <span className="triple-card-badge">{tasks.filter(t => t.status !== '已完成').length}条待办</span>
          </div>
          <div className="triple-list">
            {tasks.map(t => (
              <div key={t.id} className="triple-item">
                <div className="triple-item-top"><span className="triple-item-name">{t.content}</span><span className={`triple-item-tag ${t.priority === '高' ? 'tag-task-high' : t.priority === '中' ? 'tag-task-mid' : 'tag-task-low'}`}>{t.priority}</span></div>
                <div className="triple-item-meta"><span>截止: {t.dueDate}</span><span>{t.status}</span>{t.relatedCompany && <span>🏢 {t.relatedCompany}</span>}</div>
              </div>
            ))}
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

      {visitModal && (
        <div className="modal-overlay" onClick={() => setVisitModal(null)}>
          <div className="visit-modal" onClick={e => e.stopPropagation()}>
            <div className="visit-modal-head">
              <span className="visit-modal-title">{visitTypeIcon(visitModal.visitType)} {visitModal.partnerName} · 拜访纪要</span>
              <button className="modal-close" onClick={() => setVisitModal(null)}>✕</button>
            </div>
            <div className="visit-modal-body">
              <div className="visit-modal-meta">
                <div className="visit-modal-meta-item"><span className="vm-label">拜访日期</span><span className="vm-value">{visitModal.visitDate}</span></div>
                <div className="visit-modal-meta-item"><span className="vm-label">拜访类型</span><span className="vm-value">{visitModal.visitType}</span></div>
                <div className="visit-modal-meta-item"><span className="vm-label">参与人员</span><span className="vm-value">{visitModal.attendees}</span></div>
              </div>
              <div className="visit-modal-section">
                <div className="visit-modal-section-title">📋 拜访摘要</div>
                <div className="visit-modal-section-content">{visitModal.summary}</div>
              </div>
              <div className="visit-modal-section">
                <div className="visit-modal-section-title">📌 下一步计划</div>
                <div className="visit-modal-section-content">{visitModal.nextPlan}</div>
              </div>
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
