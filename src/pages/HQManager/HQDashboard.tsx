import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts'
import { mockGlobalKPIs, mockRegionPerformance, mockTasks, mockChannelPartners, mockTwoAssociations } from '../../data/mockData'
import AIAssistant from '../../components/AIAssistant/AIAssistant'
import './HQDashboard.css'

export default function HQDashboard() {
  const [expandedCps, setExpandedCps] = useState<string | null>(null)
  const [regionFilter, setRegionFilter] = useState('全部')

  const cpsItems = [
    { key: 'sti', label: '全国 STI 渠道出货总量', target: 39000, actual: 40100, unit: '台', trend: 'up', trendValue: '+11.8%', rank: '5/8战区达标', desc: '全国八大区本月STI合计40,100台。上海战区贡献最大（7,450台，19.5%），东北区达成率仅75%需重点关注。', actions: ['区域预警', '渠道排名'], topAction: '📊 召开东北区渠道专项复盘会 → 制定Q3补货激励方案' },
    { key: 'so', label: '全国 SO 终端销量总量', target: 32500, actual: 33800, unit: '台', trend: 'up', trendValue: '+14.2%', rank: '6/8战区达标', desc: '全国SO合计33,800台，STI→SO转化率84.3%。西南和东北区终端激活率偏低，需加强终端推广政策。', actions: ['区域预警', '销售漏斗'], topAction: '🎯 推动西南区终端激活专项行动 → 联合Top5伙伴开展地推' },
    { key: 'lock', label: '全国平均锁定率', target: 70, actual: 71.2, unit: '%', trend: 'up', trendValue: '+2.9pp', rank: '上海72%领先 / 东北55%垫底', desc: '全国平均锁定率71.2%，超额完成目标。上海72%最高，东北55%最低差距17pp，需重点帮扶。', actions: ['区域预警', '漏斗分析'], topAction: '📋 梳理东北区潜客转化卡点 → 派驻资深经理现场辅导2周' },
    { key: 'attach', label: '全国平均承载率', target: 45, actual: 38, unit: '%', trend: 'down', trendValue: '-7.0pp', rank: '上海48%领先 / 东北33%垫底', desc: '全国承载率38%，距45%目标差7pp。交叉销售能力不足，"整机+服务+云"捆绑方案覆盖率偏低。', actions: ['渠道培训', '产品组合'], topAction: '🤝 启动全国渠道附销能力提升计划 → 首批覆盖钻石/金牌伙伴' },
  ]

  const rate = (actual: number, target: number) => Math.round((actual / target) * 100)
  const progressWidth = (actual: number, target: number) => Math.min(100, (actual / target) * 100)

  const alerts = [
    { icon: '⚠️', title: '东北区 STI 达成率仅 75%', desc: '远低于全国平均 103%，需重点关注渠道开拓', color: 'var(--danger)' },
    { icon: '📊', title: '西北区承载率偏低', desc: '当前仅 36%，低于全国平均 38%，建议加强附销培训', color: 'var(--warning)' },
    { icon: '🎯', title: '园区渠道突破机会', desc: '全国待开发园区 62 家，中东和西南区机会最多', color: 'var(--accent)' },
    { icon: '💡', title: '铜牌渠道升级窗口', desc: '全国 89 家铜牌渠道中 32 家具备银牌升级潜力', color: 'var(--success)' },
  ]

  const topSTI = [
    { name: '张经理', region: '上海战区·浦东', value: '7,450台', rate: '106.4%' },
    { name: '陈华', region: '华北战区·北京', value: '6,800台', rate: '104.6%' },
    { name: '赵丽', region: '华南战区·深圳', value: '5,600台', rate: '96.6%' },
    { name: '林峰', region: '东南战区·福州', value: '5,100台', rate: '102.0%' },
    { name: '刘强', region: '中东战区·武汉', value: '4,300台', rate: '95.6%' },
  ]

  const topSO = [
    { name: '张经理', region: '上海战区·浦东', value: '6,100台', rate: '105.2%' },
    { name: '陈华', region: '华北战区·北京', value: '5,550台', rate: '102.8%' },
    { name: '赵丽', region: '华南战区·深圳', value: '4,650台', rate: '96.9%' },
    { name: '林峰', region: '东南战区·福州', value: '4,350台', rate: '103.6%' },
    { name: '王芳', region: '西南战区·成都', value: '3,300台', rate: '94.3%' },
  ]

  const bigNums = [
    { label: '线索总量', value: '1,680' },
    { label: '商机数量', value: '456' },
    { label: '总订单数', value: '1,150' },
    { label: '渠道伙伴', value: '486' },
    { label: '两会一园签约', value: '142' },
    { label: '辖区经理数', value: '86' },
  ]

  const funnel = [
    { stage: '线索总量', count: 1680, color: 'oklch(0.55 0.17 265)', width: '100%' },
    { stage: '有效线索', count: 1180, color: 'oklch(0.6 0.14 265)', width: '90%' },
    { stage: '商机创建', count: 456, color: 'oklch(0.68 0.1 265)', width: '78%' },
    { stage: '方案报价', count: 248, color: 'oklch(0.78 0.06 265)', width: '62%' },
    { stage: '商务谈判', count: 128, color: 'oklch(0.88 0.03 265)', textColor: 'var(--text-primary)', width: '46%' },
    { stage: '赢单', count: 82, color: 'var(--success)', width: '34%' },
  ]

  const partnerLevelData = [
    { name: '钻石', value: 12, color: 'var(--warning)' },
    { name: '金牌', value: 48, color: 'var(--brand-600)' },
    { name: '银牌', value: 156, color: 'var(--accent)' },
    { name: '铜牌', value: 270, color: 'var(--text-muted)' },
  ]

  const assocStatusData = [
    { name: '已签约', value: 142, color: 'var(--success)' },
    { name: '洽谈中', value: 86, color: 'var(--warning)' },
    { name: '待开发', value: 62, color: 'var(--text-muted)' },
  ]

  const filteredRegions = regionFilter === '全部' ? mockRegionPerformance : mockRegionPerformance.filter(r => r.region.includes(regionFilter))

  return (
    <div>
      <div className="dash-top">
        <div className="dash-greet">
          <h2>上午好，李经理</h2>
          <p>总部管理中心 · 全国 | 2026年5月7日 周四</p>
        </div>
      </div>

      <div className="hq-big-row">
        {bigNums.map((bn, i) => (
          <div key={i} className="hq-big-cell">
            <div className="hq-big-label">{bn.label}</div>
            <div className="hq-big-value">{bn.value}</div>
          </div>
        ))}
      </div>

      <div className="cps-section">
        <div className="cps-section-label">CPS 核心指标（全国）</div>
        <div className="cps-row">
          {cpsItems.map(cps => {
            const isExpanded = expandedCps === cps.key
            const pct = rate(cps.actual, cps.target)
            const isAchieved = cps.actual >= cps.target
            return (
              <div key={cps.key} className={`cps-card ${isExpanded ? 'expanded' : ''} ${!isAchieved ? 'behind' : ''}`} onClick={() => setExpandedCps(isExpanded ? null : cps.key)}>
                <div className="cps-card-header">
                  <span className="cps-card-label">{cps.label}</span>
                  <span className={`cps-rank-tag ${isAchieved ? 'rank-ok' : 'rank-warn'}`}>🏆 {cps.rank}</span>
                </div>
                <div className="cps-card-metrics">
                  <div className={`cps-card-actual ${!isAchieved ? 'actual-warn' : ''}`}>
                    {cps.actual >= 1000 ? (cps.actual / 1000).toFixed(1) + '万' : cps.actual}<span>{cps.unit}</span>
                  </div>
                  <div className="cps-card-goal">
                    目标 <strong>{cps.target >= 1000 ? (cps.target / 1000).toFixed(1) + '万' : cps.target}{cps.unit}</strong>
                  </div>
                </div>
                <div className="cps-progress-bar">
                  <div className={`cps-progress-fill ${!isAchieved ? 'fill-warn' : ''}`} style={{ width: `${progressWidth(cps.actual, cps.target)}%` }} />
                </div>
                <div className="cps-card-sub">
                  <span className={`cps-rate ${!isAchieved ? 'rate-warn' : ''}`}>{pct}%</span>
                  <span className={`cps-trend ${cps.trend}`}>{cps.trend === 'up' ? '▲' : '▼'} {cps.trendValue}</span>
                </div>
                <div className="cps-top-action">
                  <span className="top-action-icon">⚡</span>
                  <span className="top-action-text">{cps.topAction}</span>
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
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>排名情况</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{cps.rank}</div>
                      </div>
                      <div style={{ background: 'var(--bg-body)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>差距</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: isAchieved ? 'var(--success)' : 'var(--danger)' }}>
                          {isAchieved ? `+${(cps.actual - cps.target).toLocaleString()}` : `-${(cps.target - cps.actual).toLocaleString()}`}{cps.unit}
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
        </div>
      </div>

      <AIAssistant />

      <div className="triple-row">
        <div className="triple-card">
          <div className="triple-card-top"><span className="triple-card-title">🔔 管理预警</span><span className="triple-card-badge">{alerts.length}条</span></div>
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
          <div className="triple-card-top"><span className="triple-card-title">📊 核心数据概览</span><span className="triple-card-badge">{bigNums.length}项</span></div>
          <div className="hq-big-grid">
            {bigNums.map((bn, i) => (
              <div key={i} className="hq-big-cell"><div className="hq-big-label">{bn.label}</div><div className="hq-big-value">{bn.value}</div></div>
            ))}
          </div>
        </div>
      </div>

      <div className="row-2col">
        <div className="section-card">
          <div className="section-card-top">
            <span className="section-card-title">八大区 STI / SO 对比</span>
            <select className="filter-select" value={regionFilter} onChange={e => setRegionFilter(e.target.value)} style={{ marginLeft: 'auto' }}>
              <option value="全部">全部大区</option>
              <option value="上海">上海战区</option>
              <option value="华北">华北战区</option>
              <option value="华南">华南战区</option>
              <option value="东南">东南战区</option>
              <option value="西南">西南战区</option>
              <option value="东北">东北战区</option>
              <option value="西北">西北战区</option>
              <option value="中东">中东战区</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={filteredRegions} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="region" fontSize={11} tick={{ fill: 'var(--text-secondary)' }} />
              <YAxis fontSize={11} tick={{ fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="stiActual" name="STI实际" fill="var(--brand-600)" radius={[5, 5, 0, 0]} />
              <Bar dataKey="soActual" name="SO实际" fill="var(--success)" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="section-card">
          <div className="section-card-top"><span className="section-card-title">各大区 KPI 达成明细</span></div>
          <div style={{ overflowX: 'auto' }}>
            <table className="region-table">
              <thead><tr><th>大区</th><th>STI达成</th><th>SO达成</th><th>锁定率</th><th>承载率</th></tr></thead>
              <tbody>
                {mockRegionPerformance.map(r => {
                  const stiR = Math.round((r.stiActual / r.stiTarget) * 100)
                  const soR = Math.round((r.soActual / r.soTarget) * 100)
                  return (
                    <tr key={r.region}>
                      <td style={{ fontWeight: 600 }}>{r.region}</td>
                      <td><span className="region-bar-bg"><span className="region-bar-fill" style={{ width: `${Math.min(stiR, 100)}%`, background: stiR >= 100 ? 'var(--success)' : stiR >= 85 ? 'var(--warning)' : 'var(--danger)' }} /></span> {stiR}%</td>
                      <td><span className="region-bar-bg"><span className="region-bar-fill" style={{ width: `${Math.min(soR, 100)}%`, background: soR >= 100 ? 'var(--success)' : soR >= 85 ? 'var(--warning)' : 'var(--danger)' }} /></span> {soR}%</td>
                      <td>{r.lockRate}%</td>
                      <td>{r.attachRate}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="row-2col">
        <div className="section-card">
          <div className="section-card-top"><span className="section-card-title">全国销售漏斗</span></div>
          <div className="sales-funnel">
            {funnel.map((f, i) => (
              <div key={i} className="funnel-stage" style={{ background: f.color, width: f.width, color: f.textColor || '#fff' }}>
                <span className="funnel-stage-label">{f.stage}</span><span className="funnel-stage-count">{f.count}</span>
              </div>
            ))}
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>线索 → 赢单转化率：{((82 / 1680) * 100).toFixed(1)}%</div>
          </div>
        </div>
        <div className="section-card">
          <div className="section-card-top"><span className="section-card-title">覆盖率总览</span></div>
          <div className="kpi-detail-grid" style={{ marginBottom: 0 }}>
            <div className="kpi-detail-metric"><div className="kpi-detail-m-label">活跃渠道覆盖率</div><div className="kpi-detail-m-value" style={{ color: 'var(--success)' }}>78.5%</div></div>
            <div className="kpi-detail-metric"><div className="kpi-detail-m-label">两会一园签约率</div><div className="kpi-detail-m-value" style={{ color: 'var(--accent)' }}>65.2%</div></div>
            <div className="kpi-detail-metric"><div className="kpi-detail-m-label">线索响应时效</div><div className="kpi-detail-m-value" style={{ color: 'var(--warning)' }}>4.2h</div></div>
            <div className="kpi-detail-metric"><div className="kpi-detail-m-label">商机转赢单率</div><div className="kpi-detail-m-value" style={{ color: 'var(--purple)' }}>18.0%</div></div>
          </div>
        </div>
      </div>

      <div className="row-2col">
        <div className="section-card">
          <div className="section-card-top"><span className="section-card-title">伙伴等级分布</span></div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={partnerLevelData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {partnerLevelData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="section-card">
          <div className="section-card-top"><span className="section-card-title">两会一园状态分布</span></div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={assocStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {assocStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="row-2col">
        <div className="section-card">
          <div className="section-card-top"><span className="section-card-title">STI 出货排名 TOP5</span></div>
          <div className="top-list">
            {topSTI.map((m, i) => (
              <div key={i} className="top-item">
                <div className={`top-rank ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other'}`}>{i + 1}</div>
                <div className="top-info"><div className="top-name">{m.name}</div><div className="top-sub">{m.region}</div></div>
                <div className="top-val" style={{ color: i === 0 ? 'var(--brand-600)' : 'var(--text-primary)' }}>{m.value} <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>({m.rate})</span></div>
              </div>
            ))}
          </div>
        </div>
        <div className="section-card">
          <div className="section-card-top"><span className="section-card-title">SO 终端销量排名 TOP5</span></div>
          <div className="top-list">
            {topSO.map((m, i) => (
              <div key={i} className="top-item">
                <div className={`top-rank ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other'}`}>{i + 1}</div>
                <div className="top-info"><div className="top-name">{m.name}</div><div className="top-sub">{m.region}</div></div>
                <div className="top-val" style={{ color: i === 0 ? 'var(--success)' : 'var(--text-primary)' }}>{m.value} <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>({m.rate})</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cps-charts">
        <div className="chart-card">
          <div className="chart-card-top">
            <span className="chart-card-title">八大区月度 STI 趋势</span>
            <span className="chart-card-badge badge-sti">Q2</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockRegionPerformance} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="region" fontSize={11} tick={{ fill: 'var(--text-muted)' }} />
              <YAxis fontSize={11} tick={{ fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="stiTarget" name="目标" fill="var(--brand-300)" radius={[5, 5, 0, 0]} />
              <Bar dataKey="stiActual" name="实际" fill="var(--brand-600)" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <div className="chart-card-top">
            <span className="chart-card-title">八大区月度 SO 趋势</span>
            <span className="chart-card-badge badge-so">Q2</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mockRegionPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="region" fontSize={11} tick={{ fill: 'var(--text-muted)' }} />
              <YAxis fontSize={11} tick={{ fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="soActual" name="SO实际" stroke="var(--success)" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="soTarget" name="目标" stroke="var(--brand-300)" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
