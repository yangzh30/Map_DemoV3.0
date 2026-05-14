import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
  mockLeads, mockOpportunities, mockSTIData, mockSOData,
  mockTwoAssociations, mockChannelPartners, mockVisits, mockBids, mockTasks,
} from '../../data/mockData'
import AIAssistant from '../../components/AIAssistant/AIAssistant'
import './TerritoryDashboardOld.css'

function sourceClass(source: string): string {
  switch (source) {
    case '官网': return 'web'
    case 'IS Sales': return 'is'
    case '400电话': return 'phone'
    case '渠道推荐': return 'channel'
    case '园区活动': return 'park'
    case '转介绍': return 'referral'
    default: return 'web'
  }
}

export default function TerritoryDashboard() {
  const [leadsOpen, setLeadsOpen] = useState(false)
  const [oppsOpen, setOppsOpen] = useState(false)
  const [leadFilter, setLeadFilter] = useState('all')
  const [oppFilter, setOppFilter] = useState('all')
  const [kpiDetail, setKpiDetail] = useState<string | null>(null)

  const kpis = [
    { key: 'sti', label: 'STI 渠道出货量', value: '1,100', unit: '台', trend: 'up' as const, trendValue: '+14.5%', icon: '📤', color: 'var(--brand-600)' },
    { key: 'so', label: 'SO 终端销量', value: '850', unit: '台', trend: 'up' as const, trendValue: '+9.0%', icon: '🎯', color: 'var(--success)' },
    { key: 'lock', label: '锁定率', value: '72', unit: '%', trend: 'up' as const, trendValue: '+3.2pp', icon: '🔒', color: 'var(--warning)' },
    { key: 'attach', label: '承载率', value: '45', unit: '%', trend: 'up' as const, trendValue: '+5.1pp', icon: '📎', color: 'var(--purple)' },
  ]

  const fltLeads = leadFilter === 'all' ? mockLeads : mockLeads.filter(l => l.source === leadFilter)
  const fltOpps = oppFilter === 'all' ? mockOpportunities : mockOpportunities.filter(o => o.source === oppFilter)
  const sources = ['all', '官网', 'IS Sales', '400电话', '渠道推荐', '园区活动', '转介绍']

  function levelClass(level: string): string {
    switch (level) {
      case '钻石': return 'diamond'
      case '金牌': return 'gold'
      case '银牌': return 'silver'
      case '铜牌': return 'bronze'
      case '注册': return 'reg'
      default: return 'reg'
    }
  }

  return (
    <div>
      <div className="dash-top">
        <div className="dash-greet">
          <h2>早上好，张经理</h2>
          <p>上海战区 · 浦东辖区 | 2026年5月6日 周三</p>
        </div>
        <div className="dash-date">
          本月 STI 目标达成 <strong style={{ color: 'var(--success)' }}>110%</strong>
        </div>
      </div>

      <div className="kpi-row">
        {kpis.map(kpi => (
          <div key={kpi.key} className="kpi-cell" onClick={() => setKpiDetail(kpi.key)}>
            <div className="kpi-cell-label">
              <span>{kpi.icon}</span> {kpi.label}
            </div>
            <div className="kpi-cell-value" style={{ color: kpi.color }}>
              {kpi.value}<span>{kpi.unit}</span>
            </div>
            <div className="kpi-cell-sub">
              <span className={kpi.trend === 'up' ? 'up' : 'down'}>
                {kpi.trend === 'up' ? '▲' : '▼'} {kpi.trendValue}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>vs 上月</span>
            </div>
          </div>
        ))}
      </div>

      <AIAssistant />

      <div className="chart-row">
        <div className="chart-card">
          <div className="chart-card-top">
            <span className="chart-card-title">STI 渠道出货趋势</span>
            <span className="chart-card-badge badge-sti">1-6月</span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={mockSTIData} barGap={-14}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="month" fontSize={11} tick={{ fill: 'var(--text-muted)' }} />
              <YAxis fontSize={11} tick={{ fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="目标" fill="var(--brand-300)" radius={[5, 5, 0, 0]} />
              <Bar dataKey="实际" fill="var(--brand-600)" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <div className="chart-card-top">
            <span className="chart-card-title">SO 终端销量趋势</span>
            <span className="chart-card-badge badge-so">1-6月</span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={mockSOData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="month" fontSize={11} tick={{ fill: 'var(--text-muted)' }} />
              <YAxis fontSize={11} tick={{ fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="激活量" stroke="var(--success)" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="目标" stroke="var(--brand-300)" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="triple-row">
        <div className="triple-card">
          <div className="triple-card-top">
            <span className="triple-card-title">📅 拜访提醒</span>
            <span className="triple-card-badge">{mockVisits.filter(v=>v.status==='待拜访').length}条待拜访</span>
          </div>
          <div className="triple-list">
            {mockVisits.slice(0, 3).map(v => (
              <div key={v.id} className="triple-item">
                <div className="triple-item-top">
                  <span className="triple-item-name">{v.companyName}</span>
                  <span className={`triple-item-tag ${v.status === '待拜访' ? 'tag-visit-pending' : 'tag-visit-done'}`}>{v.status}</span>
                </div>
                <div className="triple-item-sub">{v.purpose}</div>
                <div className="triple-item-meta"><span>{v.date} {v.time}</span><span>📍 {v.address.slice(0,12)}...</span></div>
              </div>
            ))}
          </div>
        </div>
        <div className="triple-card">
          <div className="triple-card-top">
            <span className="triple-card-title">🏗️ 重要标讯</span>
            <span className="triple-card-badge">{mockBids.filter(b=>b.status==='可投标').length}条可投</span>
          </div>
          <div className="triple-list">
            {mockBids.slice(0, 3).map(b => (
              <div key={b.id} className="triple-item">
                <div className="triple-item-top">
                  <span className="triple-item-name">{b.title.slice(0, 20)}...</span>
                  <span className={`triple-item-tag ${b.status === '可投标' ? 'tag-bid-open' : 'tag-bid-done'}`}>{b.status}</span>
                </div>
                <div className="triple-item-meta">
                  <span>{b.publishOrg}</span>
                  <span className="triple-item-score">匹配度 {b.matchScore}%</span>
                  <span>¥{(b.budget/10000).toFixed(0)}万</span>
                </div>
                <div className="triple-item-sub">截止：{b.deadline}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="triple-card">
          <div className="triple-card-top">
            <span className="triple-card-title">📝 任务提醒</span>
            <span className="triple-card-badge">{mockTasks.filter(t=>t.status!=='已完成').length}条待办</span>
          </div>
          <div className="triple-list">
            {mockTasks.slice(0, 3).map(t => (
              <div key={t.id} className="triple-item">
                <div className="triple-item-top">
                  <span className="triple-item-name">{t.content}</span>
                  <span className={`triple-item-tag ${t.priority==='高'?'tag-task-high':t.priority==='中'?'tag-task-mid':'tag-task-low'}`}>{t.priority}</span>
                </div>
                <div className="triple-item-meta">
                  <span>截止：{t.dueDate}</span>
                  <span>{t.status}</span>
                  {t.relatedCompany && <span>🏢 {t.relatedCompany}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="leads-row">
        <div className="leads-card">
          <div className="leads-card-top">
            <span className="leads-card-title">线索池</span>
            <span className="leads-card-count">共 {mockLeads.length} 条</span>
            <button className="leads-card-expand" onClick={() => setLeadsOpen(true)}>查看全部</button>
          </div>
          {mockLeads.slice(0, 4).map(lead => (
            <div key={lead.id} className="lead-mini" onClick={() => setLeadsOpen(true)}>
              <div className="lead-mini-left">
                <span className={`source-tag src-${sourceClass(lead.source)}`}>{lead.source}</span>
                <span className="lead-mini-name">{lead.companyName}</span>
              </div>
              <span className="lead-mini-right">¥{(lead.estimatedValue / 10000).toFixed(0)}万 · {lead.status}</span>
            </div>
          ))}
        </div>
        <div className="leads-card">
          <div className="leads-card-top">
            <span className="leads-card-title">商机管道</span>
            <span className="leads-card-count">共 {mockOpportunities.length} 条</span>
            <button className="leads-card-expand" onClick={() => setOppsOpen(true)}>查看全部</button>
          </div>
          {mockOpportunities.slice(0, 4).map(opp => (
            <div key={opp.id} className="lead-mini" onClick={() => setOppsOpen(true)}>
              <div className="lead-mini-left">
                <span className="lead-mini-name">{opp.name}</span>
              </div>
              <span className="lead-mini-right">{opp.stage} · ¥{(opp.expectedAmount / 10000).toFixed(0)}万</span>
            </div>
          ))}
        </div>
      </div>

      <div className="row-2col">
        <div className="section-card">
          <div className="section-card-top">
            <span className="section-card-title">两会一园</span>
            <span className="leads-card-count">共 {mockTwoAssociations.length} 家</span>
          </div>
          <div className="assoc-list">
            {mockTwoAssociations.map(item => (
              <div key={item.id} className="assoc-item">
                <div className="assoc-left">
                  <span className={`assoc-type ${item.type === '协会' ? 'type-assoc' : item.type === '商会' ? 'type-chamber' : 'type-park'}`}>
                    {item.type}
                  </span>
                  <span className="assoc-name">{item.name}</span>
                </div>
                <div className="assoc-right">
                  <span>👥 {item.memberCount}家</span>
                  <span>🎯 {item.potentialCustomers}潜客</span>
                  <span className={`assoc-status ${item.status === '已签约' ? 'as-signed' : item.status === '洽谈中' ? 'as-negotiating' : 'as-pending'}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="section-card">
          <div className="section-card-top">
            <span className="section-card-title">渠道伙伴</span>
            <span className="leads-card-count">共 {mockChannelPartners.length} 家</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="partner-table">
              <thead>
                <tr>
                  <th>伙伴名称</th><th>等级</th><th>月STI</th><th>锁定率</th><th>承载率</th><th>状态</th>
                </tr>
              </thead>
              <tbody>
                {mockChannelPartners.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td><span className={`partner-lvl lvl-${levelClass(p.level)}`}>{p.level}</span></td>
                    <td>{p.monthlySTI}台</td>
                    <td>{p.lockRate}%</td>
                    <td>{p.attachRate}%</td>
                    <td>
                      <span className={`partner-dot ${p.status === '活跃' ? 'dot-active' : p.status === '一般' ? 'dot-normal' : 'dot-silent'}`} />
                      {p.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {leadsOpen && (
        <div className="modal-overlay" onClick={() => setLeadsOpen(false)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-title">线索池明细</span>
              <button className="modal-close" onClick={() => setLeadsOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-filters">
                {sources.map(src => (
                  <button key={src} className={`filter-btn ${leadFilter === src ? 'on' : ''}`} onClick={() => setLeadFilter(src)}>
                    {src === 'all' ? '全部来源' : src}
                  </button>
                ))}
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>编号</th><th>来源</th><th>公司名称</th><th>联系人</th>
                    <th>行业</th><th>预估价值</th><th>状态</th><th>创建时间</th>
                  </tr>
                </thead>
                <tbody>
                  {fltLeads.map(lead => (
                    <tr key={lead.id}>
                      <td>{lead.id}</td>
                      <td><span className={`source-tag src-${sourceClass(lead.source)}`}>{lead.source}</span></td>
                      <td style={{ fontWeight: 500 }}>{lead.companyName}</td>
                      <td>{lead.contact}</td>
                      <td>{lead.industry}</td>
                      <td>¥{(lead.estimatedValue / 10000).toFixed(0)}万</td>
                      <td><span style={{ color: lead.status === '已转化' ? 'var(--success)' : lead.status === '跟进中' ? 'var(--warning)' : lead.status === '新线索' ? 'var(--info)' : 'var(--text-muted)', fontWeight: 500 }}>{lead.status}</span></td>
                      <td>{lead.createTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {oppsOpen && (
        <div className="modal-overlay" onClick={() => setOppsOpen(false)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-title">商机管道明细</span>
              <button className="modal-close" onClick={() => setOppsOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-filters">
                {sources.map(src => (
                  <button key={src} className={`filter-btn ${oppFilter === src ? 'on' : ''}`} onClick={() => setOppFilter(src)}>
                    {src === 'all' ? '全部来源' : src}
                  </button>
                ))}
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>编号</th><th>商机名称</th><th>来源</th><th>公司</th>
                    <th>阶段</th><th>成交概率</th><th>预计金额</th><th>预计成交</th>
                  </tr>
                </thead>
                <tbody>
                  {fltOpps.map(opp => (
                    <tr key={opp.id}>
                      <td>{opp.id}</td>
                      <td style={{ fontWeight: 500 }}>{opp.name}</td>
                      <td><span className={`source-tag src-${sourceClass(opp.source)}`}>{opp.source}</span></td>
                      <td>{opp.companyName}</td>
                      <td><span style={{ color: opp.stage === '赢单' ? 'var(--success)' : opp.stage === '输单' ? 'var(--danger)' : opp.probability >= 60 ? 'var(--warning)' : 'var(--text-secondary)', fontWeight: 500 }}>{opp.stage}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 50, height: 5, background: 'var(--border-light)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: `${opp.probability}%`, height: '100%', background: opp.probability >= 60 ? 'var(--success)' : opp.probability >= 30 ? 'var(--warning)' : 'var(--danger)', borderRadius: 3 }} />
                          </div>
                          <span>{opp.probability}%</span>
                        </div>
                      </td>
                      <td>¥{(opp.expectedAmount / 10000).toFixed(0)}万</td>
                      <td>{opp.expectedCloseDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {kpiDetail && (
        <div className="modal-overlay" onClick={() => setKpiDetail(null)}>
          <div className="kpi-detail-modal" onClick={e => e.stopPropagation()}>
            <div className="kpi-detail-head">
              <span className="modal-title">
                {kpiDetail === 'sti' ? 'STI 渠道出货量' : kpiDetail === 'so' ? 'SO 终端销量' : kpiDetail === 'lock' ? '锁定率' : '承载率'}
              </span>
              <button className="modal-close" onClick={() => setKpiDetail(null)}>✕</button>
            </div>
            <div className="kpi-detail-body">
              {kpiDetail === 'sti' && (
                <div>
                  <div className="kpi-detail-grid">
                    <div className="kpi-detail-metric"><div className="kpi-detail-m-label">本月 STI</div><div className="kpi-detail-m-value" style={{ color: 'var(--brand-600)' }}>1,100 台</div></div>
                    <div className="kpi-detail-metric"><div className="kpi-detail-m-label">月度目标</div><div className="kpi-detail-m-value">1,000 台</div></div>
                    <div className="kpi-detail-metric"><div className="kpi-detail-m-label">达成率</div><div className="kpi-detail-m-value" style={{ color: 'var(--success)' }}>110%</div></div>
                    <div className="kpi-detail-metric"><div className="kpi-detail-m-label">环比增长</div><div className="kpi-detail-m-value" style={{ color: 'var(--success)' }}>+14.5%</div></div>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    STI（Sell-Through-In）渠道出货量：指商品从联想出货到下游代理商、分销商的数量。反映渠道库存补充速度。本月 1,100 台，超出目标 10%。
                  </p>
                </div>
              )}
              {kpiDetail === 'so' && (
                <div>
                  <div className="kpi-detail-grid">
                    <div className="kpi-detail-metric"><div className="kpi-detail-m-label">本月 SO</div><div className="kpi-detail-m-value" style={{ color: 'var(--success)' }}>850 台</div></div>
                    <div className="kpi-detail-metric"><div className="kpi-detail-m-label">月度目标</div><div className="kpi-detail-m-value">800 台</div></div>
                    <div className="kpi-detail-metric"><div className="kpi-detail-m-label">达成率</div><div className="kpi-detail-m-value" style={{ color: 'var(--success)' }}>106.3%</div></div>
                    <div className="kpi-detail-metric"><div className="kpi-detail-m-label">环比增长</div><div className="kpi-detail-m-value" style={{ color: 'var(--success)' }}>+9.0%</div></div>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    SO（Sell-Out）终端销量：商品最终卖给终端用户的数量，以开箱激活/扫码认证为统计标准。本月 850 台，超出目标 6.3%。
                  </p>
                </div>
              )}
              {kpiDetail === 'lock' && (
                <div>
                  <div className="kpi-detail-grid">
                    <div className="kpi-detail-metric"><div className="kpi-detail-m-label">当前锁定率</div><div className="kpi-detail-m-value" style={{ color: 'var(--warning)' }}>72%</div></div>
                    <div className="kpi-detail-metric"><div className="kpi-detail-m-label">上月锁定率</div><div className="kpi-detail-m-value">68.8%</div></div>
                    <div className="kpi-detail-metric"><div className="kpi-detail-m-label">增长</div><div className="kpi-detail-m-value" style={{ color: 'var(--success)' }}>+3.2pp</div></div>
                    <div className="kpi-detail-metric"><div className="kpi-detail-m-label">潜在客户池</div><div className="kpi-detail-m-value">320 家</div></div>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    锁定率：衡量从确定的潜在客户中成功转化为付款客户的比例。当前 72%，每 100 家目标客户中转化 72 家。
                  </p>
                </div>
              )}
              {kpiDetail === 'attach' && (
                <div>
                  <div className="kpi-detail-grid">
                    <div className="kpi-detail-metric"><div className="kpi-detail-m-label">当前承载率</div><div className="kpi-detail-m-value" style={{ color: 'var(--purple)' }}>45%</div></div>
                    <div className="kpi-detail-metric"><div className="kpi-detail-m-label">上月承载率</div><div className="kpi-detail-m-value">39.9%</div></div>
                    <div className="kpi-detail-metric"><div className="kpi-detail-m-label">增长</div><div className="kpi-detail-m-value" style={{ color: 'var(--success)' }}>+5.1pp</div></div>
                    <div className="kpi-detail-metric"><div className="kpi-detail-m-label">附销品类</div><div className="kpi-detail-m-value">8 类</div></div>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    承载率：主营产品销售时附带其他产品/服务的成功概率。当前 45%，每 100 笔主产品销售中 45 笔产生附销。
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
