import { useState, useEffect, useRef, useCallback } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { mockGlobalKPIs, mockRegionPerformance, mockTasks } from '../../data/mockData'
import AIAssistant from '../../components/AIAssistant/AIAssistant'
import '../TerritoryManager/Mobile.css'

function useCarousel<T>(items: T[], intervalMs = 3000) {
  const [index, setIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [paused, setPaused] = useState(false)
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setIndex(p => (p + 1) % items.length), intervalMs)
  }, [items.length, intervalMs])
  useEffect(() => {
    if (items.length <= 1) return
    if (!paused) startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [items.length, paused, startTimer])
  const goPrev = () => { setPaused(true); setIndex(p => (p - 1 + items.length) % items.length) }
  const goNext = () => { setPaused(true); setIndex(p => (p + 1) % items.length) }
  return { index, item: items[index] ?? null, total: items.length, goPrev, goNext }
}

function CarouselNav({ index, total, goPrev, goNext }: { index: number; total: number; goPrev: () => void; goNext: () => void }) {
  if (total <= 1) return null
  return (
    <div className="carousel-nav">
      <button className="carousel-nav-btn" onClick={goPrev}>◀</button>
      <span className="carousel-nav-pos">{index + 1}/{total}</span>
      <button className="carousel-nav-btn" onClick={goNext}>▶</button>
    </div>
  )
}

export default function HQMobile() {
  const [page, setPage] = useState(0)
  const [kpiDetail, setKpiDetail] = useState<string | null>(null)
  const page0Ref = useRef<HTMLDivElement>(null)
  const page1Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (page === 0 && page0Ref.current) page0Ref.current.scrollTop = 0
    if (page === 1 && page1Ref.current) page1Ref.current.scrollTop = 0
  }, [page])

  const topSTI = [
    { name: '张经理', region: '上海战区·浦东', value: '7,450台', rate: '106.4%' },
    { name: '陈华', region: '华北战区·北京', value: '6,800台', rate: '104.6%' },
    { name: '赵丽', region: '华南战区·深圳', value: '5,600台', rate: '96.6%' },
    { name: '林峰', region: '东南战区·福州', value: '5,100台', rate: '102.0%' },
    { name: '刘强', region: '中东战区·武汉', value: '4,300台', rate: '95.6%' },
  ]

  const alerts = [
    { icon: '⚠️', title: '东北区 STI 达成率仅 75%', desc: '远低于全国平均，需重点关注渠道开拓', color: 'var(--danger)' },
    { icon: '📊', title: '西北区承载率偏低', desc: '当前仅 36%，低于全国平均 41.5%', color: 'var(--warning)' },
    { icon: '🎯', title: '园区渠道突破机会', desc: '全国待开发园区 62 家，中东和西南区机会最多', color: 'var(--info)' },
  ]

  const funnel = [
    { stage: '线索总量', count: 1680, color: 'var(--brand-600)', width: '100%' },
    { stage: '有效线索', count: 1180, color: 'var(--brand-500)', width: '88%' },
    { stage: '商机创建', count: 456, color: 'var(--brand-400)', width: '74%' },
    { stage: '方案报价', count: 248, color: 'var(--purple)', width: '58%' },
    { stage: '商务谈判', count: 128, color: 'var(--warning)', width: '42%' },
    { stage: '赢单', count: 82, color: 'var(--success)', width: '32%' },
  ]

  const highTasks = mockTasks.filter(t => t.status !== '已完成' && t.priority === '高')
  const taskCarousel = useCarousel(highTasks, 3000)
  const alertCarousel = useCarousel(alerts, 4000)

  return (
    <div className="phone-scene">
      <button className="phone-nav phone-nav-left"  onClick={() => setPage(p => p === 0 ? 1 : 0)}>◀</button>
      <button className="phone-nav phone-nav-right" onClick={() => setPage(p => p === 0 ? 1 : 0)}>▶</button>
      <div className="phone-nav-dots">
        <div className={`phone-nav-dot ${page === 0 ? 'active' : ''}`} />
        <div className={`phone-nav-dot ${page === 1 ? 'active' : ''}`} />
      </div>

      <div className="phone-frame">
        {/* Page 0 — Dashboard */}
        <div className={`phone-page ${page === 0 ? 'active' : ''}`} ref={page0Ref}>
          <div className="kpi-group">
            <div className="kpi-group-label">全国核心指标</div>
            <div className="mobile-kpi-row">
              <div className="mobile-kpi" onClick={() => setKpiDetail('sti')}><div className="mobile-kpi-label">全国 STI</div><div className="mobile-kpi-value" style={{color:'var(--brand-600)'}}>38,200</div><div className="mobile-kpi-sub"><span className="up">▲ 11.8%</span></div></div>
              <div className="mobile-kpi" onClick={() => setKpiDetail('so')}><div className="mobile-kpi-label">全国 SO</div><div className="mobile-kpi-value" style={{color:'var(--success)'}}>29,450</div><div className="mobile-kpi-sub"><span className="up">▲ 14.2%</span></div></div>
              <div className="mobile-kpi" onClick={() => setKpiDetail('lock')}><div className="mobile-kpi-label">锁定率</div><div className="mobile-kpi-value" style={{color:'var(--warning)'}}>67.8%</div><div className="mobile-kpi-sub"><span className="up">▲ 2.9pp</span></div></div>
              <div className="mobile-kpi" onClick={() => setKpiDetail('attach')}><div className="mobile-kpi-label">承载率</div><div className="mobile-kpi-value" style={{color:'var(--purple)'}}>41.5%</div><div className="mobile-kpi-sub"><span className="up">▲ 4.3pp</span></div></div>
            </div>
          </div>

          <AIAssistant />

          <div className="mobile-section">
            <div className="mobile-section-title">🏆 STI 出货 TOP5</div>
            {topSTI.map((m, i) => (
              <div key={i} className="mobile-item">
                <div className="mobile-item-top">
                  <span style={{ fontWeight: 700, color: i === 0 ? 'var(--brand-600)' : 'var(--text-muted)', marginRight: 8 }}>#{i + 1}</span>
                  <span className="mobile-item-name">{m.name}</span>
                  <span className="mobile-item-sub">{m.value} ({m.rate})</span>
                </div>
                <div className="mobile-item-meta">{m.region}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Page 1 — Chart + Alerts / Tasks */}
        <div className={`phone-page ${page === 1 ? 'active' : ''}`} ref={page1Ref}>
          <div className="compact-chart">
            <div className="compact-chart-title">八大区 STI / SO 对比</div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={mockRegionPerformance} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="region" fontSize={9} tick={{ fill: 'var(--text-muted)' }} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="stiActual" name="STI" fill="var(--brand-600)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="soActual" name="SO" fill="var(--success)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mobile-section">
            <div className="mobile-section-title">全国销售漏斗</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 6 }}>
              {funnel.map((f, i) => (
                <div key={i} className="funnel-stage" style={{ background: f.color, width: f.width }}>
                  <span className="funnel-stage-label">{f.stage}</span><span className="funnel-stage-count">{f.count}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>线索 → 赢单转化率：{((82/1680)*100).toFixed(1)}%</div>
          </div>

          <div className="carousel-area">
            <div className="carousel-area-label">📝 管理任务</div>
            <div className="carousel-card">
              {taskCarousel.item ? (
                <>
                  <div className="mobile-item-top"><span className="mobile-item-name">{taskCarousel.item.content}</span><span className="mobile-tag tag-task-high">{taskCarousel.item.priority}</span></div>
                  <div className="mobile-item-meta" style={{ marginTop: 6 }}>截止：{taskCarousel.item.dueDate} · {taskCarousel.item.status}</div>
                  {taskCarousel.item.relatedCompany && <div className="mobile-item-meta">🏢 {taskCarousel.item.relatedCompany}</div>}
                </>
              ) : <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: 30 }}>暂无高优任务</div>}
            </div>
            <CarouselNav index={taskCarousel.index} total={taskCarousel.total} goPrev={taskCarousel.goPrev} goNext={taskCarousel.goNext} />
          </div>

          <div className="carousel-area">
            <div className="carousel-area-label">🔔 管理预警</div>
            <div className="carousel-card">
              {alertCarousel.item ? (
                <>
                  <div className="mobile-item-top"><span className="mobile-item-name" style={{ color: alertCarousel.item.color }}>{alertCarousel.item.title}</span></div>
                  <div className="mobile-item-sub" style={{ marginTop: 6 }}>{alertCarousel.item.desc}</div>
                </>
              ) : <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: 30 }}>暂无预警</div>}
            </div>
            <CarouselNav index={alertCarousel.index} total={alertCarousel.total} goPrev={alertCarousel.goPrev} goNext={alertCarousel.goNext} />
          </div>
        </div>

        <div className="phone-home-bar" />
      </div>

      {kpiDetail && (
        <div className="modal-overlay" onClick={() => setKpiDetail(null)}>
          <div className="mobile-modal" onClick={e => e.stopPropagation()}>
            <div className="mobile-modal-head"><span className="mobile-modal-title">{kpiDetail==='sti'?'全国 STI':kpiDetail==='so'?'全国 SO':kpiDetail==='lock'?'锁定率':'承载率'}</span><button className="modal-close" onClick={() => setKpiDetail(null)}>✕</button></div>
            <div className="mobile-modal-body">
              {kpiDetail==='sti'&&<p style={{fontSize:13,lineHeight:1.7,color:'var(--text-secondary)'}}>全国八大区本月STI合计38,200台。上海战区贡献19.5%，东北达成率仅75%。</p>}
              {kpiDetail==='so'&&<p style={{fontSize:13,lineHeight:1.7,color:'var(--text-secondary)'}}>全国SO合计29,450台，环比+14.2%。STI→SO转化率77.1%。</p>}
              {kpiDetail==='lock'&&<p style={{fontSize:13,lineHeight:1.7,color:'var(--text-secondary)'}}>全国锁定率67.8%，上海战区最高72%，东北最低55%。</p>}
              {kpiDetail==='attach'&&<p style={{fontSize:13,lineHeight:1.7,color:'var(--text-secondary)'}}>全国承载率41.5%，上海战区最高48%，东北最低33%。</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
