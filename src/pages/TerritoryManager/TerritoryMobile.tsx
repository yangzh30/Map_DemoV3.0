import { useState, useRef, useEffect, useCallback } from 'react'
import {
  mockTwoAssociations, mockChannelPartners,
  mockVisits, mockTasks,
  mockCpsIndicators, mockPartnerVisits,
} from '../../data/mockData'
import type { PartnerVisit } from '../../types'
import AIAssistant from '../../components/AIAssistant/AIAssistant'
import './Mobile.css'

function levelClass(level: string) {
  switch (level) {
    case '钻石': return 'diamond'
    case '金牌': return 'gold'
    case '银牌': return 'silver'
    case '铜牌': return 'bronze'
    default: return 'reg'
  }
}

function useCarousel<T>(items: T[], intervalMs = 4000) {
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

function HorizontalScrollCards({ children, title, count, className }: { children: React.ReactNode; title: string; count?: number; className?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    isDragging.current = true
    startX.current = e.pageX - scrollRef.current.offsetLeft
    scrollLeft.current = scrollRef.current.scrollLeft
    scrollRef.current.style.cursor = 'grabbing'
    scrollRef.current.style.userSelect = 'none'
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX.current) * 1.2
    scrollRef.current.scrollLeft = scrollLeft.current - walk
  }
  const onMouseUp = () => {
    isDragging.current = false
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab'
      scrollRef.current.style.userSelect = ''
    }
  }
  const onMouseLeave = () => {
    isDragging.current = false
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab'
      scrollRef.current.style.userSelect = ''
    }
  }

  return (
    <div className="mobile-section">
      <div className="mobile-section-title">{title}{count !== undefined && <span style={{ marginLeft: 6, color: 'var(--text-muted)', fontSize: 11, fontWeight: 400 }}>({count})</span>}</div>
      <div
        ref={scrollRef}
        className={`mobile-scroll-row ${className || ''}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        style={{ cursor: 'grab' }}
      >
        {children}
      </div>
    </div>
  )
}

export default function TerritoryMobile() {
  const [visitModal, setVisitModal] = useState<PartnerVisit | null>(null)
  const [page, setPage] = useState(0)
  const page0Ref = useRef<HTMLDivElement>(null)
  const page1Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (page === 0 && page0Ref.current) page0Ref.current.scrollTop = 0
    if (page === 1 && page1Ref.current) page1Ref.current.scrollTop = 0
  }, [page])

  const indicators = mockCpsIndicators
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

  const visitCarousel = useCarousel(mockVisits.filter(v => v.status === '待拜访'), 4000)
  const taskCarousel = useCarousel(mockTasks.filter(t => t.status !== '已完成'), 4000)

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
    <div className="phone-scene">
      <button className="phone-nav phone-nav-left" onClick={() => setPage(p => p === 0 ? 1 : 0)}>◀</button>
      <button className="phone-nav phone-nav-right" onClick={() => setPage(p => p === 0 ? 1 : 0)}>▶</button>
      <div className="phone-nav-dots">
        <div className={`phone-nav-dot ${page === 0 ? 'active' : ''}`} />
        <div className={`phone-nav-dot ${page === 1 ? 'active' : ''}`} />
      </div>

      <div className="phone-frame">
        {/* Page 0 — Dashboard */}
        <div className={`phone-page ${page === 0 ? 'active' : ''}`} ref={page0Ref}>
          {/* Greeting */}
          <div className="mobile-greet">
            <h2>早上好，张经理</h2>
            <p>上海战区 · 浦东辖区</p>
          </div>

          {/* CPS Summary */}
          <div className="mobile-cps-card">
            <div className="mobile-cps-row">
              <div className="mobile-cps-col">
                <div className="mobile-cps-label">总CPS达成率</div>
                <div className="mobile-cps-value" style={{ color: cpsScore >= 100 ? 'var(--success)' : cpsScore >= 85 ? 'var(--brand-600)' : 'var(--danger)' }}>{cpsScore.toFixed(1)}%</div>
              </div>
              <div className="mobile-cps-divider" />
              <div className="mobile-cps-col">
                <div className="mobile-cps-label">当季REV/CA</div>
                <div className="mobile-cps-value" style={{ color: 'var(--success)', fontSize: 12 }}>¥5,820万/¥6,500万</div>
                <div className="mobile-cps-sub">达成率 89.5%</div>
              </div>
              <div className="mobile-cps-divider" />
              <div className="mobile-cps-col">
                <div className="mobile-cps-label">团队内排名</div>
                <div className="mobile-cps-value" style={{ color: 'var(--brand-600)' }}>🥈 上海战区第2</div>
                <div className="mobile-cps-sub">全国 12/86</div>
              </div>
            </div>
          </div>

          {/* 4 Indicator Cards — Compact Grid */}
          <div className="mobile-section">
            <div className="mobile-section-title">CPS指标</div>
            <div className="mobile-indicator-grid">
              {indicators.map(ind => {
                const pct = rate(ind.actual, ind.target)
                const isAchieved = ind.actual >= ind.target
                return (
                  <div key={ind.key} className={`mobile-indicator-compact ${!isAchieved ? 'behind' : ''}`}>
                    <div className="mobile-indicator-c-label">{ind.label}</div>
                    <div className="mobile-indicator-c-body">
                      <span className={`mobile-indicator-c-actual ${!isAchieved ? 'actual-warn' : ''}`}>{ind.actual}<span className="mobile-indicator-c-unit">{ind.unit}</span></span>
                      <span className={`mobile-indicator-c-rate ${!isAchieved ? 'rate-warn' : ''}`}>{pct}%</span>
                    </div>
                    <div className="mobile-indicator-c-sub">
                      <span className="mobile-indicator-c-goal">目标{ind.target}</span>
                      <span className={`mobile-indicator-c-trend ${ind.trend}`}>{ind.trend === 'up' ? '▲' : '▼'} {ind.trendValue}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Suggestions */}
          <div className="mobile-section">
            <div className="mobile-section-title">⚡ 行动建议</div>
            <div className="mobile-action-list">
              {indicators.map((ind, i) => (
                <div key={ind.key} className="mobile-action-item">
                  <span className="mobile-action-num">{i + 1}</span>
                  <span className="mobile-action-text">{ind.topAction}</span>
                </div>
              ))}
            </div>
          </div>

          <AIAssistant />

          {/* 两会一园 */}
          <HorizontalScrollCards title="两会一园" count={mockTwoAssociations.length}>
            {mockTwoAssociations.map(item => (
              <div key={item.id} className="mobile-assoc-card">
                <div className="mobile-assoc-top">
                  <span className={`mobile-assoc-type ${item.type === '协会' ? 'type-assoc' : item.type === '商会' ? 'type-chamber' : 'type-park'}`}>{item.type}</span>
                  <span className={`mobile-assoc-status ${item.status === '已签约' ? 'as-signed' : item.status === '洽谈中' ? 'as-negotiating' : 'as-pending'}`}>{item.status}</span>
                </div>
                <div className="mobile-assoc-name">{item.name}</div>
                <div className="mobile-assoc-meta">👥 {item.memberCount}家 · 🎯 {item.potentialCustomers}潜客</div>
              </div>
            ))}
          </HorizontalScrollCards>

          {/* 联想伙伴——增值服务商 */}
          <HorizontalScrollCards title="联想伙伴——增值服务商" count={mockChannelPartners.length}>
            {mockChannelPartners.map(p => {
              const visit = getPartnerVisit(p.id)
              return (
                <div key={p.id} className="mobile-partner-card">
                  <div className="mobile-partner-top">
                    <span className="mobile-partner-name">{p.name}</span>
                    <span className={`mobile-partner-lvl lvl-${levelClass(p.level)}`}>{p.level}</span>
                  </div>
                  <div className="mobile-partner-meta">
                    <span>STI {p.monthlySTI}台</span>
                    <span>锁定{p.lockRate}%</span>
                    <span>承载{p.attachRate}%</span>
                  </div>
                  <div className="mobile-partner-bottom">
                    <span className={`mobile-partner-dot ${p.status === '活跃' ? 'dot-active' : p.status === '一般' ? 'dot-normal' : 'dot-silent'}`} />{p.status}
                    <span className={`mobile-pv-status ${getPartnerVisitStatusClass(visit)}`}>{getPartnerVisitStatus(visit)}</span>
                  </div>
                </div>
              )
            })}
          </HorizontalScrollCards>
        </div>

        {/* Page 1 — Visits / Tasks */}
        <div className={`phone-page ${page === 1 ? 'active' : ''}`} ref={page1Ref}>
          {/* 拜访提醒 Carousel */}
          <div className="carousel-area">
            <div className="carousel-area-label">📅 拜访提醒</div>
            <div className="carousel-card">
              {visitCarousel.item ? (
                <>
                  <div className="mobile-item-top"><span className="mobile-item-name">{visitCarousel.item.companyName}</span><span className="mobile-tag tag-visit-pending">待拜访</span></div>
                  <div className="mobile-item-sub" style={{ marginTop: 4 }}>{visitCarousel.item.purpose}</div>
                  <div className="mobile-item-meta" style={{ marginTop: 8 }}>{visitCarousel.item.date} {visitCarousel.item.time}</div>
                  <div className="mobile-item-meta">📍 {visitCarousel.item.address}</div>
                </>
              ) : <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: 30 }}>暂无待拜访记录</div>}
            </div>
            <CarouselNav index={visitCarousel.index} total={visitCarousel.total} goPrev={visitCarousel.goPrev} goNext={visitCarousel.goNext} />
          </div>

          {/* 任务提醒 Carousel */}
          <div className="carousel-area">
            <div className="carousel-area-label">📝 任务提醒</div>
            <div className="carousel-card">
              {taskCarousel.item ? (
                <>
                  <div className="mobile-item-top"><span className="mobile-item-name">{taskCarousel.item.content}</span><span className={`mobile-tag ${taskCarousel.item.priority === '高' ? 'tag-task-high' : taskCarousel.item.priority === '中' ? 'tag-task-mid' : 'tag-task-low'}`}>{taskCarousel.item.priority}</span></div>
                  <div className="mobile-item-meta" style={{ marginTop: 4 }}>截止：{taskCarousel.item.dueDate} · {taskCarousel.item.status}</div>
                  {taskCarousel.item.relatedCompany && <div className="mobile-item-meta">🏢 {taskCarousel.item.relatedCompany}</div>}
                </>
              ) : <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: 30 }}>暂无待办任务</div>}
            </div>
            <CarouselNav index={taskCarousel.index} total={taskCarousel.total} goPrev={taskCarousel.goPrev} goNext={taskCarousel.goNext} />
          </div>
        </div>

        <div className="phone-home-bar" />
      </div>

      {visitModal && (
        <div className="modal-overlay" onClick={() => setVisitModal(null)}>
          <div className="mobile-modal" onClick={e => e.stopPropagation()}>
            <div className="mobile-modal-head"><span className="mobile-modal-title">{visitTypeIcon(visitModal.visitType)} {visitModal.partnerName} · 拜访纪要</span><button className="modal-close" onClick={() => setVisitModal(null)}>✕</button></div>
            <div className="mobile-modal-body">
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
    </div>
  )
}
