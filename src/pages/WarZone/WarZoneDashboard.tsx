import { useState, useRef, useEffect, useCallback } from 'react'
import * as echarts from 'echarts'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line
} from 'recharts'
import {
  mockTwoAssociations, mockChannelPartners,
  mockVisits, mockTasks,
  mockPartnerVisits,
} from '../../data/mockData'
import type { PartnerVisit } from '../../types'
import AIAssistant from '../../components/AIAssistant/AIAssistant'
import './WarZoneDashboard.css'

const markerData: {
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
  { id: 'TA-009', name: '上海市物联网协会', type: '协会', value: [121.475, 31.235], status: '洽谈中', address: '徐汇区漕溪北路18号', contact: '王秘书长', memberCount: 320 },
  { id: 'TA-010', name: '虹桥商务区商会', type: '商会', value: [121.395, 31.195], status: '待开发', address: '闵行区申长路988号', contact: '张会长', memberCount: 450 },
  { id: 'TA-011', name: '临港新片区产业园', type: '园区', value: [121.815, 30.885], status: '已签约', address: '浦东新区南汇新城镇', contact: '陈主任', memberCount: 380, signedPartner: '上海智远科技有限公司' },
  { id: 'TA-012', name: '上海市云计算协会', type: '协会', value: [121.445, 31.215], status: '洽谈中', address: '黄浦区人民大道200号', contact: '刘副会长', memberCount: 290 },
]

function markerColor(status: string): string {
  if (status === '已签约') return '#22c55e'
  if (status === '洽谈中') return '#f59e0b'
  return '#9ca3af'
}

function ShanghaiMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<echarts.ECharts | null>(null)

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
      const option: echarts.EChartsOption = {
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            if (params.seriesType === 'scatter') {
              const d = params.data as any
              if (!d || !d._raw) return ''
              const r = d._raw
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
            }
            return params.name || ''
          },
          backgroundColor: '#fff', borderColor: '#e2e8f0',
          textStyle: { color: '#1e293b' },
          extraCssText: 'border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);padding:10px;',
        },
        geo: {
          map: 'shanghai', roam: true, zoom: 1.2, center: [121.47, 31.22],
          label: { show: true, fontSize: 10, color: '#e2e8f0', fontWeight: 600 },
          itemStyle: { areaColor: '#1e3a5f', borderColor: '#00d4ff', borderWidth: 1.2, shadowColor: 'rgba(0, 212, 255, 0.3)', shadowBlur: 10 },
          emphasis: { itemStyle: { areaColor: '#2d6aa0', borderColor: '#00ffff', borderWidth: 2 }, label: { show: true, fontSize: 12, color: '#fff', fontWeight: 700 } },
          select: { itemStyle: { areaColor: '#2d6aa0' } },
        },
        series: [{
          type: 'scatter', coordinateSystem: 'geo',
          data: markerData.map(m => ({ name: m.name, value: m.value, _raw: m, itemStyle: { color: markerColor(m.status) } })),
          symbol: 'pin', symbolSize: 28,
          itemStyle: { color: '#ef4444', borderColor: '#fff', borderWidth: 1.5, shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.3)' },
          label: { show: true, position: 'top', formatter: '{b}', color: '#fff', fontSize: 10, fontWeight: 600, textShadowBlur: 4, textShadowColor: '#000', distance: 6 },
          emphasis: { scale: 1.5, itemStyle: { color: '#ff6666' } },
        }],
      }
      chart.setOption(option)
    }
    fetchAndInit()
    const handleResize = () => chartRef.current?.resize()
    window.addEventListener('resize', handleResize)
    return () => { window.removeEventListener('resize', handleResize); if (chartRef.current) { chartRef.current.dispose(); chartRef.current = null } }
  }, [])

  return (
    <div className="shanghai-map-container">
      <div className="shanghai-map-title">作战地图</div>
      <div className="chart-sizer" ref={containerRef} />
      <div className="shanghai-map-legend">
        <span className="map-legend-item"><span className="map-legend-dot legend-dot-assoc" />协会</span>
        <span className="map-legend-item"><span className="map-legend-dot legend-dot-chamber" />商会</span>
        <span className="map-legend-item"><span className="map-legend-dot legend-dot-park" />园区</span>
        <span className="map-legend-item" style={{ marginLeft: 'auto', gap: 6 }}>
          <span className="map-legend-dot legend-dot-signed" />已签约
          <span className="map-legend-dot legend-dot-negotiating" />洽谈中
          <span className="map-legend-dot legend-dot-pending" />待开发
        </span>
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

export default function WarZoneDashboard() {
  const [expandedCps, setExpandedCps] = useState<string | null>(null)
  const [districtChart, setDistrictChart] = useState<string | null>(null)
  const [visitModal, setVisitModal] = useState<PartnerVisit | null>(null)
  const [partnerManagerModal, setPartnerManagerModal] = useState<string | null>(null)
  const [assocFilter, setAssocFilter] = useState<string>('全部')
  const [assocSearch, setAssocSearch] = useState('')
  const [partnerFilter, setPartnerFilter] = useState<string>('全部')
  const [partnerSearch, setPartnerSearch] = useState('')

  // 5 KPI cards with weights 2.5 : 2 : 2.5 : 1 : 2
  const cpsItems = [
    { key: 'k1', label: 'K1：PC提货完成率', target: 1200, actual: 1080, unit: '台', weight: 2.5, trend: 'up', trendValue: '+3.2%', rank: '华东战区第2', desc: 'PC产品线提货完成1,080台，目标1,200台。需推动中芯国际/华勤技术大单交付，加速Q2出货节奏。', actions: ['辖区排名', '渠道管理'], topAction: '📋 推动中芯国际/华勤技术大单交付 → 加速Q2出货节奏' },
    { key: 'k2', label: 'K2：百应及thinkplus完成率', target: 300, actual: 330, unit: '台', weight: 2, trend: 'up', trendValue: '+10.0%', rank: '华东战区第1', desc: '百应及thinkplus完成330台，超额完成目标。联合神州数码开展中小企业专属推广活动，提升配件覆盖率。', actions: ['终端推广', '产品组合'], topAction: '🎯 联合神州数码开展中小企业专属推广活动 → 提升配件覆盖率' },
    { key: 'k3', label: 'K3：PC出货完成率', target: 1500, actual: 1420, unit: '台', weight: 2.5, trend: 'up', trendValue: '+5.8%', rank: '华东战区第2', desc: 'PC出货完成1,420台，目标1,500台。梳理浦发银行/上海微电子重点产品需求，制定专项攻坚方案。', actions: ['大客户攻坚', '需求梳理'], topAction: '📊 梳理浦发银行/上海微电子重点产品需求 → 制定专项攻坚方案' },
    { key: 'k4', label: 'K4：重点产品PO完成率', target: 150, actual: 135, unit: '台', weight: 1, trend: 'down', trendValue: '-5.3%', rank: '华东战区第3', desc: '重点产品PO完成135台，距150台目标差15台。需加强重点产品推广力度，提升PO转化率。', actions: ['产品培训', '渠道激励'], topAction: '📈 加强重点产品推广力度 → 提升PO转化率' },
    { key: 'k5', label: 'K5：战略指标完成率', target: 100, actual: 85, unit: '%', weight: 2, trend: 'down', trendValue: '-15.0pp', rank: '华东战区第4', desc: '战略指标完成率85%，距100%目标差15pp。启动园区渠道覆盖提升计划，重点突破张江/金桥园区。', actions: ['园区拓展', '渠道覆盖'], topAction: '🤝 启动园区渠道覆盖提升计划 → 重点突破张江/金桥园区' },
  ]

  // Calculate weighted CPS score
  const totalWeight = cpsItems.reduce((s, i) => s + i.weight, 0)
  const cpsScore = cpsItems.reduce((s, i) => s + (Math.round((i.actual / i.target) * 100)) * i.weight, 0) / totalWeight

  const rate = (actual: number, target: number) => Math.round((actual / target) * 100)
  const progressWidth = (actual: number, target: number) => Math.min(100, (actual / target) * 100)

  const districts = [
    { id: 'pudong', name: '浦东辖区', manager: '张经理', sti: 1058, so: 842, lockRate: 72.5, attachRate: 28.6, status: '活跃' },
    { id: 'xuhui', name: '徐汇辖区', manager: '王经理', sti: 920, so: 710, lockRate: 68.2, attachRate: 35.1, status: '活跃' },
    { id: 'minhang', name: '闵行辖区', manager: '刘经理', sti: 850, so: 680, lockRate: 65.0, attachRate: 42.3, status: '一般' },
    { id: 'yangpu', name: '杨浦辖区', manager: '陈经理', sti: 780, so: 620, lockRate: 70.1, attachRate: 31.5, status: '活跃' },
    { id: 'jingan', name: '静安辖区', manager: '赵经理', sti: 720, so: 580, lockRate: 73.8, attachRate: 39.2, status: '活跃' },
    { id: 'changning', name: '长宁辖区', manager: '孙经理', sti: 680, so: 540, lockRate: 66.5, attachRate: 36.8, status: '一般' },
    { id: 'putuo', name: '普陀辖区', manager: '周经理', sti: 620, so: 490, lockRate: 62.3, attachRate: 44.1, status: '一般' },
    { id: 'hongkou', name: '虹口辖区', manager: '吴经理', sti: 580, so: 460, lockRate: 69.7, attachRate: 33.6, status: '活跃' },
    { id: 'baoshan', name: '宝山辖区', manager: '郑经理', sti: 520, so: 410, lockRate: 58.9, attachRate: 40.5, status: '一般' },
    { id: 'songjiang', name: '松江辖区', manager: '钱经理', sti: 470, so: 370, lockRate: 71.2, attachRate: 37.9, status: '活跃' },
  ]

  const districtDataMap: Record<string, { month: string; STI: number; SO: number }[]> = {
    'pudong': [{ month: '1月', STI: 920, SO: 730 }, { month: '2月', STI: 960, SO: 765 }, { month: '3月', STI: 1000, SO: 800 }, { month: '4月', STI: 1030, SO: 825 }, { month: '5月', STI: 1058, SO: 842 }],
    'xuhui': [{ month: '1月', STI: 800, SO: 620 }, { month: '2月', STI: 830, SO: 645 }, { month: '3月', STI: 870, SO: 675 }, { month: '4月', STI: 900, SO: 695 }, { month: '5月', STI: 920, SO: 710 }],
    'minhang': [{ month: '1月', STI: 740, SO: 590 }, { month: '2月', STI: 770, SO: 615 }, { month: '3月', STI: 800, SO: 640 }, { month: '4月', STI: 830, SO: 660 }, { month: '5月', STI: 850, SO: 680 }],
    'yangpu': [{ month: '1月', STI: 680, SO: 540 }, { month: '2月', STI: 710, SO: 565 }, { month: '3月', STI: 740, SO: 590 }, { month: '4月', STI: 760, SO: 605 }, { month: '5月', STI: 780, SO: 620 }],
    'jingan': [{ month: '1月', STI: 630, SO: 505 }, { month: '2月', STI: 655, SO: 525 }, { month: '3月', STI: 680, SO: 545 }, { month: '4月', STI: 700, SO: 565 }, { month: '5月', STI: 720, SO: 580 }],
    'changning': [{ month: '1月', STI: 590, SO: 470 }, { month: '2月', STI: 615, SO: 490 }, { month: '3月', STI: 640, SO: 510 }, { month: '4月', STI: 660, SO: 525 }, { month: '5月', STI: 680, SO: 540 }],
    'putuo': [{ month: '1月', STI: 540, SO: 425 }, { month: '2月', STI: 565, SO: 445 }, { month: '3月', STI: 585, SO: 460 }, { month: '4月', STI: 605, SO: 478 }, { month: '5月', STI: 620, SO: 490 }],
    'hongkou': [{ month: '1月', STI: 500, SO: 395 }, { month: '2月', STI: 525, SO: 415 }, { month: '3月', STI: 545, SO: 432 }, { month: '4月', STI: 565, SO: 448 }, { month: '5月', STI: 580, SO: 460 }],
    'baoshan': [{ month: '1月', STI: 450, SO: 355 }, { month: '2月', STI: 470, SO: 372 }, { month: '3月', STI: 490, SO: 388 }, { month: '4月', STI: 505, SO: 400 }, { month: '5月', STI: 520, SO: 410 }],
    'songjiang': [{ month: '1月', STI: 400, SO: 315 }, { month: '2月', STI: 425, SO: 335 }, { month: '3月', STI: 440, SO: 348 }, { month: '4月', STI: 458, SO: 362 }, { month: '5月', STI: 470, SO: 370 }],
  }

  function getDistrictData(id: string) { return districtDataMap[id] || districtDataMap['pudong'] }

  const alerts = [
    { icon: '⚠️', title: '闵行辖区锁定率仅65%', desc: '低于战区平均72%，需重点帮扶潜客转化', color: 'var(--danger)' },
    { icon: '📊', title: '普陀辖区承载率偏高但STI偏低', desc: '承载率44%但出货仅620台，需扩大客户基数', color: 'var(--warning)' },
    { icon: '🎯', title: '宝山辖区渠道突破机会', desc: '待开发园区8家，制造业客户密度高', color: 'var(--accent)' },
    { icon: '💡', title: '浦东承载率严重偏低', desc: '承载率仅28.6%，远低于战区平均38%，需推动捆绑方案', color: 'var(--success)' },
  ]

  const topDistricts = [
    { name: '浦东辖区', manager: '张经理', sti: '1,058台', rate: '106%' },
    { name: '徐汇辖区', manager: '王经理', sti: '920台', rate: '92%' },
    { name: '闵行辖区', manager: '刘经理', sti: '850台', rate: '85%' },
    { name: '杨浦辖区', manager: '陈经理', sti: '780台', rate: '78%' },
    { name: '静安辖区', manager: '赵经理', sti: '720台', rate: '72%' },
  ]

  const getPartnerVisit = (partnerId: string): PartnerVisit | undefined => mockPartnerVisits.find(v => v.partnerId === partnerId)
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

  const filteredAssocs = mockTwoAssociations.filter(a => {
    if (assocFilter !== '全部' && a.status !== assocFilter) return false
    if (assocSearch && !a.name.includes(assocSearch)) return false
    return true
  })

  const filteredPartners = mockChannelPartners.filter(p => {
    if (partnerFilter !== '全部' && p.level !== partnerFilter) return false
    if (partnerSearch && !p.name.includes(partnerSearch)) return false
    return true
  })

  const visitTypeIcon = (t: string) => {
    switch (t) { case '例行拜访': return '🔄'; case '专项沟通': return '💬'; case '问题处理': return '🔧'; case '签约拜访': return '✍️'; default: return '📋' }
  }

  return (
    <div>
      <div className="dash-top">
        <div className="dash-greet">
          <h2>上午好，张岚</h2>
          <p>华东战区 · 战区总经理 | 2026年5月9日 周六</p>
        </div>
        <div className="dash-cps-summary" style={{ maxWidth: 720 }}>
          <div className="cps-summary-inner">
            <div className="cps-summary-col">
              <div className="cps-summary-label">总CPS达成率</div>
              <div className="cps-summary-value" style={{ color: 'var(--brand-600)' }}>{cpsScore.toFixed(1)}%</div>
            </div>
            <div className="cps-summary-divider" />
            <div className="cps-summary-col">
              <div className="cps-summary-label">当季REV/CA目标及达成</div>
              <div className="cps-summary-value" style={{ color: 'var(--success)' }}>¥5.82亿 / ¥6.50亿</div>
              <div className="cps-summary-sub">达成率 89.5%</div>
            </div>
            <div className="cps-summary-divider" />
            <div className="cps-summary-col">
              <div className="cps-summary-label">团队内排名</div>
              <div className="cps-summary-value" style={{ color: 'var(--brand-600)' }}>🥇 全国第1</div>
              <div className="cps-summary-sub">8大战区</div>
            </div>
          </div>
        </div>
      </div>

      <div className="map-indicators-row">
        <div className="map-col">
          <ShanghaiMap />
        </div>
        <div className="indicators-col">
          <div className="indicators-stack">
            {cpsItems.map(cps => {
              const isExpanded = expandedCps === cps.key
              const pct = rate(cps.actual, cps.target)
              const isAchieved = cps.actual >= cps.target
              return (
                <div key={cps.key} className={`indicator-mini-card ${isExpanded ? 'expanded' : ''} ${!isAchieved ? 'behind' : ''}`} onClick={() => setExpandedCps(isExpanded ? null : cps.key)}>
                  <div className="indicator-mini-header">
                    <span className="indicator-mini-label">{cps.label}</span>
                    <span className={`indicator-mini-rank ${isAchieved ? 'rank-ok' : 'rank-warn'}`}>🏆 {cps.rank}</span>
                  </div>
                  <div className="indicator-mini-body">
                    <div className={`indicator-mini-actual ${!isAchieved ? 'actual-warn' : ''}`}>
                      {cps.actual >= 1000 ? (cps.actual / 1000).toFixed(1) + '万' : cps.actual}<span className="indicator-mini-unit">{cps.unit}</span>
                    </div>
                    <div className="indicator-mini-goal">目标 {cps.target >= 1000 ? (cps.target / 1000).toFixed(1) + '万' : cps.target}{cps.unit}</div>
                    <div className="indicator-mini-rate">
                      <span className={`indicator-mini-rate-val ${!isAchieved ? 'rate-warn' : ''}`}>{pct}%</span>
                      <span className={`indicator-mini-trend ${cps.trend}`}>{cps.trend === 'up' ? '▲' : '▼'} {cps.trendValue}</span>
                    </div>
                  </div>
                  <div className="indicator-mini-progress">
                    <div className={`indicator-mini-progress-fill ${!isAchieved ? 'fill-warn' : ''}`} style={{ width: `${progressWidth(cps.actual, cps.target)}%` }} />
                  </div>
                  {isExpanded && (
                    <div className="cps-detail" onClick={e => e.stopPropagation()}>
                      <div className="cps-detail-desc">{cps.desc}</div>
                      <div className="cps-detail-metrics">
                        <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>达成率</div>
                          <div style={{ fontSize: 18, fontWeight: 700, color: isAchieved ? 'var(--brand-600)' : 'var(--danger)' }}>{pct}%</div>
                        </div>
                        <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>全国排名</div>
                          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{cps.rank}</div>
                        </div>
                        <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>差距</div>
                          <div style={{ fontSize: 18, fontWeight: 700, color: isAchieved ? 'var(--success)' : 'var(--danger)' }}>
                            {isAchieved ? `+${cps.actual - cps.target}` : `-${cps.target - cps.actual}`}{cps.unit}
                          </div>
                        </div>
                        <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>关联行动</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{cps.actions.join(' · ')}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            <div className="action-suggest-card">
              <div className="action-suggest-title">⚡ 行动建议</div>
              <div className="action-suggest-list">
                {cpsItems.map((cps, i) => (
                  <div key={cps.key} className="action-suggest-item">
                    <span className="action-suggest-num">{i + 1}</span>
                    <span className="action-suggest-text">{cps.topAction}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row-assoc-partner">
        <div className="assoc-section">
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
          <div className="scrollable-list">
            {filteredAssocs.map(item => (
              <div key={item.id} className="assoc-item">
                <div className="assoc-left">
                  <span className={`assoc-type ${item.type === '协会' ? 'type-assoc' : item.type === '商会' ? 'type-chamber' : 'type-park'}`}>{item.type}</span>
                  <span className="assoc-name">{item.name}</span>
                </div>
                <div className="assoc-right">
                  <span>👥 {item.memberCount}家</span>
                  <span>🎯 {item.potentialCustomers}潜客</span>
                  <span className={`assoc-status ${item.status === '已签约' ? 'as-signed' : item.status === '洽谈中' ? 'as-negotiating' : 'as-pending'}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
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
            </select>
          </div>
          <div className="scrollable-list">
            <table className="partner-table">
              <thead><tr><th>伙伴名称</th><th>等级</th><th>月STI</th><th>锁定率</th><th>承载率</th><th>状态</th><th>拜访情况</th><th>最近拜访</th></tr></thead>
              <tbody>
                {filteredPartners.map(p => {
                  const visit = getPartnerVisit(p.id)
                  return (
                    <tr key={p.id}>
                      <td><span className="partner-name-link" onClick={() => setPartnerManagerModal(p.id)}>{p.name}</span></td>
                      <td><span className={`partner-lvl lvl-${levelClass(p.level)}`}>{p.level}</span></td>
                      <td>{p.monthlySTI}台</td>
                      <td>{p.lockRate}%</td>
                      <td>{p.attachRate}%</td>
                      <td><span className={`partner-dot ${p.status === '活跃' ? 'dot-active' : p.status === '一般' ? 'dot-normal' : 'dot-silent'}`} />{p.status}</td>
                      <td><span className={`partner-visit-status ${getPartnerVisitStatusClass(visit)}`}>{getPartnerVisitStatus(visit)}</span></td>
                      <td>{visit ? <span className="partner-visit-link" onClick={() => setVisitModal(visit)}>{visit.visitDate}</span> : <span className="partner-visit-none">—</span>}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="row-2col">
        <div className="section-card" style={{ gridColumn: '1 / -1' }}>
          <div className="section-card-top"><span className="section-card-title">各辖区 KPI 达成明细</span></div>
          <div style={{ overflowX: 'auto' }}>
            <table className="district-table">
              <thead><tr><th>辖区</th><th>辖区经理</th><th>月STI</th><th>锁定率</th><th>承载率</th><th>状态</th></tr></thead>
              <tbody>
                {districts.map(d => (
                  <tr key={d.id}>
                    <td><span className="district-name-link" onClick={() => setDistrictChart(districtChart === d.id ? null : d.id)}>{d.name}</span></td>
                    <td>{d.manager}</td>
                    <td>{d.sti}台</td>
                    <td><span className="region-bar-bg"><span className="region-bar-fill" style={{ width: `${d.lockRate}%`, background: d.lockRate >= 70 ? 'var(--success)' : d.lockRate >= 65 ? 'var(--warning)' : 'var(--danger)' }} /></span> {d.lockRate}%</td>
                    <td><span className="region-bar-bg"><span className="region-bar-fill" style={{ width: `${d.attachRate}%`, background: d.attachRate >= 40 ? 'var(--success)' : d.attachRate >= 30 ? 'var(--warning)' : 'var(--danger)' }} /></span> {d.attachRate}%</td>
                    <td><span className={`partner-dot ${d.status==='活跃'?'dot-active':'dot-normal'}`} />{d.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {districtChart && (
            <div className="district-chart-overlay">
              <div className="district-chart-header">
                <span>{districts.find(d=>d.id===districtChart)?.name} · STI/SO 趋势</span>
                <button className="district-chart-close" onClick={() => setDistrictChart(null)}>✕</button>
              </div>
              <div className="district-chart-grid">
                <div className="district-chart-item">
                  <div className="district-chart-item-title">STI 渠道出货</div>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={getDistrictData(districtChart)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                      <XAxis dataKey="month" fontSize={10} tick={{ fill: 'var(--text-muted)' }} />
                      <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                      <Bar dataKey="STI" fill="var(--brand-600)" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="district-chart-item">
                  <div className="district-chart-item-title">SO 终端销量</div>
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={getDistrictData(districtChart)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                      <XAxis dataKey="month" fontSize={10} tick={{ fill: 'var(--text-muted)' }} />
                      <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                      <Line type="monotone" dataKey="SO" stroke="var(--success)" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="triple-row">
        <div className="triple-card">
          <div className="triple-card-top"><span className="triple-card-title">🔔 战区预警</span><span className="triple-card-badge">{alerts.length}条</span></div>
          <div className="alert-list">
            {alerts.map((a, i) => (
              <div key={i} className="alert-item">
                <span className="alert-icon">{a.icon}</span>
                <div className="alert-content"><div className="alert-title" style={{color:a.color}}>{a.title}</div><div className="alert-desc">{a.desc}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div className="triple-card">
          <div className="triple-card-top"><span className="triple-card-title">📝 管理任务</span><span className="triple-card-badge">{mockTasks.filter(t=>t.priority==='高').length}条高优</span></div>
          <div className="triple-list">
            {mockTasks.filter(t=>t.priority==='高').slice(0,3).map(t => (
              <div key={t.id} className="triple-item">
                <div className="triple-item-top"><span className="triple-item-name">{t.content}</span><span className={`triple-item-tag ${t.priority==='高'?'tag-task-high':t.priority==='中'?'tag-task-mid':'tag-task-low'}`}>{t.priority}</span></div>
                <div className="triple-item-meta"><span>截止：{t.dueDate}</span><span>{t.status}</span>{t.relatedCompany&&<span>🏢 {t.relatedCompany}</span>}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="triple-card">
          <div className="triple-card-top"><span className="triple-card-title">🏆 辖区STI排名</span><span className="triple-card-badge">TOP5</span></div>
          <div className="top-list">
            {topDistricts.map((d, i) => (
              <div key={i} className="top-item">
                <div className={`top-rank ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other'}`}>{i + 1}</div>
                <div className="top-info"><div className="top-name">{d.name}</div><div className="top-sub">{d.manager}</div></div>
                <div className="top-val" style={{ color: i === 0 ? 'var(--brand-600)' : 'var(--text-primary)' }}>{d.sti} <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>({d.rate})</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cps-charts">
        <div className="chart-card">
          <div className="chart-card-top"><span className="chart-card-title">各辖区 STI 出货对比</span><span className="chart-card-badge badge-sti">5月</span></div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={districts.slice(0, 8)} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="name" fontSize={10} tick={{ fill: 'var(--text-secondary)' }} />
              <YAxis fontSize={11} tick={{ fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="sti" name="STI出货" fill="var(--brand-600)" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <div className="chart-card-top"><span className="chart-card-title">各辖区 SO 终端销量对比</span><span className="chart-card-badge badge-so">5月</span></div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={districts.slice(0, 8)} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="name" fontSize={10} tick={{ fill: 'var(--text-secondary)' }} />
              <YAxis fontSize={11} tick={{ fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="so" name="SO销量" fill="var(--success)" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
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

      {partnerManagerModal && (
        <div className="modal-overlay" onClick={() => setPartnerManagerModal(null)}>
          <div className="visit-modal" onClick={e => e.stopPropagation()} style={{ width: 360 }}>
            <div className="visit-modal-head">
              <span className="visit-modal-title">👤 渠道商信息</span>
              <button className="modal-close" onClick={() => setPartnerManagerModal(null)}>✕</button>
            </div>
            <div className="visit-modal-body">
              {(() => {
                const partner = mockChannelPartners.find(p => p.id === partnerManagerModal)
                const info = partnerDistrictMap[partnerManagerModal]
                if (!partner || !info) return null
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ background: 'var(--bg-body)', padding: 16, borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>渠道商名称</div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{partner.name}</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>所属辖区</div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{info.district}</div>
                      </div>
                      <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>辖区经理</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>{info.manager}</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>等级</div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{partner.level}</div>
                      </div>
                      <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>月STI</div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{partner.monthlySTI}台</div>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
