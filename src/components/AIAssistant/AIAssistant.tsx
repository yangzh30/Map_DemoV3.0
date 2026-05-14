import { useState, useRef, useEffect } from 'react'
import './AIAssistant.css'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  cardData?: ChatMessage['cardData']
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  cardData?: {
    type: 'order' | 'logistics' | 'production' | 'visit'
    order?: OrderItem
    logisticsData?: LogisticsData
    productionData?: ProductionData
    visitCard?: VisitInfoCard
  }
}

interface OrderItem {
  orderId: string; customerName: string; productLine: string; isg: boolean; expedited: boolean
  products: string; quantity: number; amount: number; orderDate: string
  status: string; estimatedDelivery: string; sn: string; soNumber: string
  milestones?: { stage: string; date: string; completed: boolean; description?: string }[]
  logisticsCompany?: string; logisticsNo?: string
}

interface LogisticsData {
  orderId: string; logisticsCompany: string; logisticsNo: string
  currentLocation: string; estimatedArrival: string
  milestones: { time: string; status: string; location: string }[]
}

interface ProductionData {
  orderId: string; productName: string; currentStage: string
  stages: { name: string; status: string; date: string }[]
  details: { label: string; value: string }[]
}

interface VisitInfoCard {
  companyName: string; contact: string; lastVisit: string; visitCount: number; status: string
  recentVisits: { date: string; type: string; summary: string; nextPlan: string }[]
}

interface ChatCardData {
  type: 'order' | 'logistics' | 'production' | 'visit'
  order?: OrderItem
  logisticsData?: LogisticsData
  productionData?: ProductionData
  visitCard?: VisitInfoCard
}

// ── Mock Data ────────────────────────────────────────────────
const mockOrders: OrderItem[] = [
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
]

const logisticsMap: Record<string, LogisticsData> = {
  'sf1234567890': {
    orderId: 'E012320880', logisticsCompany: '顺丰物流', logisticsNo: 'SF1234567890',
    currentLocation: '上海市浦东分拣中心', estimatedArrival: '2026-05-08 14:00',
    milestones: [
      { time: '2026-05-05 09:30', status: '已揽件', location: '上海浦东仓库' },
      { time: '2026-05-05 18:00', status: '运输中', location: '浦东分拣中心' },
      { time: '2026-05-06 06:00', status: '到达中转', location: '上海青浦中转场' },
      { time: '2026-05-06 10:30', status: '分拣中', location: '上海浦东分拣中心' },
      { time: '2026-05-08 14:00', status: '预计派送', location: '客户地址' },
    ]
  }
}

const productionMap: Record<string, ProductionData> = {
  'e012498733': {
    orderId: 'E012498733', productName: 'ThinkPad T14 Gen 6 & 扩展坞', currentStage: '产线生产（65%）',
    stages: [
      { name: '订单确认', status: 'completed', date: '2026-04-25' },
      { name: '物料齐套', status: 'completed', date: '2026-04-28' },
      { name: 'SMT贴片', status: 'completed', date: '2026-04-30' },
      { name: '整机组装', status: 'active', date: '进行中' },
      { name: '功能测试', status: 'pending', date: '预计05-08' },
      { name: '老化测试', status: 'pending', date: '预计05-10' },
      { name: '成品包装', status: 'pending', date: '预计05-12' },
      { name: '入库发货', status: 'pending', date: '预计05-14' },
    ],
    details: [
      { label: '订单编号', value: 'E012498733' },
      { label: '产品型号', value: 'ThinkPad T14 Gen 6 + 扩展坞 × 80套' },
      { label: '当前产线', value: '昆山工厂 3号产线' },
      { label: '完成进度', value: '65%' },
      { label: '预计下线', value: '2026-05-12' },
      { label: '预计交付', value: '2026-05-15' },
    ]
  }
}

const mockVisitData: Record<string, VisitInfoCard> = {
  '上海恒盈科技有限公司': {
    companyName: '上海恒盈科技有限公司', contact: '张总', lastVisit: '2026-04-28', visitCount: 5, status: '活跃',
    recentVisits: [
      { date: '2026-04-28', type: '例行拜访', summary: '围绕ThinkPad T14 Gen6新品进行产品演示，客户对DaaS租赁模式表示认可，计划6月采购20台。', nextPlan: '发送正式报价单，安排技术对接会' },
      { date: '2026-03-15', type: '专项沟通', summary: '针对企业采购流程进行深入沟通，协助完成内部审批材料。', nextPlan: '跟进财务审批结果' },
      { date: '2026-02-20', type: '签约拜访', summary: '完成年度框架协议签署，确认首批订单50台ThinkBook 16 G7+。', nextPlan: '协调发货及部署' },
    ],
  },
  '上海致柏商贸有限公司': {
    companyName: '上海致柏商贸有限公司', contact: '李经理', lastVisit: '2026-05-02', visitCount: 3, status: '洽谈中',
    recentVisits: [
      { date: '2026-05-02', type: '专项沟通', summary: '探讨战略合作模式，就渠道激励政策进行深度沟通，对方希望获得更多样化的支持。', nextPlan: '提交定制化合作方案' },
      { date: '2026-04-10', type: '例行拜访', summary: '介绍联想全产品线及最新渠道政策，了解对方业务结构及客户群体。', nextPlan: '安排产品培训' },
    ],
  },
  '上海辰晔信息科技有限公司': {
    companyName: '上海辰晔信息科技有限公司', contact: '王总监', lastVisit: '2026-05-04', visitCount: 8, status: '已签约',
    recentVisits: [
      { date: '2026-05-04', type: '例行拜访', summary: 'Q2季度业务复盘，客户反馈服务响应及时，计划扩大ThinkStation工作站采购量。', nextPlan: '准备Q3采购计划，探讨技术合作' },
      { date: '2026-04-18', type: '问题处理', summary: '协助处理一起售后投诉，已圆满解决，客户满意度提升。', nextPlan: '定期服务回访' },
      { date: '2026-03-25', type: '专项沟通', summary: '介绍Lenovo Premier Support服务包，对方表示浓厚兴趣。', nextPlan: '发送服务包详细方案' },
    ],
  },
  '浦东新区商会': {
    companyName: '浦东新区商会', contact: '钱秘书长', lastVisit: '2026-05-02', visitCount: 4, status: '已签约',
    recentVisits: [
      { date: '2026-05-02', type: '专项沟通', summary: '商讨联合举办数字化转型沙龙计划，预计覆盖50家会员企业。', nextPlan: '确定活动时间及议程' },
      { date: '2026-04-15', type: '例行拜访', summary: '了解会员企业IT采购需求，反馈热烈，已收集12家企业的初步意向。', nextPlan: '跟进意向转化' },
    ],
  },
  '上海软件行业协会': {
    companyName: '上海软件行业协会', contact: '周会长', lastVisit: '2026-04-28', visitCount: 6, status: '洽谈中',
    recentVisits: [
      { date: '2026-04-28', type: '例行拜访', summary: '探讨在协会年会中植入联想产品展示环节，会长表示支持。', nextPlan: '提交年会合作方案' },
      { date: '2026-03-30', type: '签约拜访', summary: '已签约战略合作协议，联合开展会员企业IT培训。', nextPlan: '启动培训课程' },
    ],
  },
  '张江高科技园区': {
    companyName: '张江高科技园区', contact: '郑主任', lastVisit: '2026-04-30', visitCount: 2, status: '待开发',
    recentVisits: [
      { date: '2026-04-30', type: '专项沟通', summary: '首次深入对接，了解园区内企业IT现状及痛点，园区方希望联想能提供打包解决方案。', nextPlan: '制定园区专属方案' },
    ],
  },
}

const quickReplies = [
  '查询订单 E011847924',
  '查询物流 SF1234567890',
  '查询上海恒盈科技有限公司',
]

// ── Render Helpers ─────────────────────────────────────────────
function StatusDot({ done, active }: { done: boolean; active: boolean }) {
  if (done) return <div className="flow-dot done" />
  if (active) return <div className="flow-dot active" />
  return <div className="flow-dot pending" />
}

function OrderCard({ order }: { order: OrderItem }) {
  const statusColor = order.status === '已签收' ? 'var(--success)' : order.status === '生产中' ? 'var(--warning)' : 'var(--accent)'
  return (
    <div className="ai-result-card">
      <div className="result-card-header">
        <span>📦 订单详情</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {order.expedited && <span style={{ background: 'var(--danger-light)', color: 'var(--danger)', fontSize: 10, padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>加急</span>}
          <span style={{ color: statusColor, fontWeight: 600 }}>{order.status}</span>
        </div>
      </div>
      <div className="result-card-body">
        <table className="detail-table">
          <tbody>
            <tr><td>订单编号</td><td style={{ fontFamily: 'monospace' }}>{order.orderId}</td></tr>
            <tr><td>客户名称</td><td>{order.customerName}</td></tr>
            <tr><td>产品信息</td><td>{order.products}</td></tr>
            <tr><td>订单数量</td><td>{order.quantity}台</td></tr>
            <tr><td>订单金额</td><td>¥{order.amount.toLocaleString()}</td></tr>
            <tr><td>下单时间</td><td>{order.orderDate}</td></tr>
            <tr><td>预计交付</td><td>{order.estimatedDelivery}</td></tr>
            <tr><td>SO号</td><td style={{ fontFamily: 'monospace' }}>{order.soNumber}</td></tr>
            <tr><td>SN号</td><td style={{ fontFamily: 'monospace' }}>{order.sn}</td></tr>
          </tbody>
        </table>
        {order.milestones && (
          <div className="flow-chart" style={{ marginTop: 12 }}>
            {order.milestones.map((m, i) => (
              <div key={i} className="flow-step">
                <div className="flow-step-ind">
                  <StatusDot done={m.completed} active={false} />
                  {i < order.milestones!.length - 1 && <div className={`flow-line ${m.completed ? 'done' : ''}`} />}
                </div>
                <div className="flow-step-content">
                  <div className={`flow-step-title ${m.completed ? 'done' : ''}`}>{m.stage}</div>
                  {m.date && <div className="flow-step-date">{m.date}</div>}
                  {m.description && <div className="flow-step-desc">{m.description}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function LogisticsCard({ data }: { data: LogisticsData }) {
  return (
    <div className="ai-result-card">
      <div className="result-card-header">
        <span>🚚 物流追踪</span>
        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{data.logisticsCompany} · {data.logisticsNo}</span>
      </div>
      <div className="result-card-body">
        <table className="detail-table">
          <tbody>
            <tr><td>订单编号</td><td>{data.orderId}</td></tr>
            <tr><td>当前地点</td><td>{data.currentLocation}</td></tr>
            <tr><td>预计到达</td><td>{data.estimatedArrival}</td></tr>
          </tbody>
        </table>
        <div className="logistics-timeline" style={{ marginTop: 12 }}>
          {data.milestones.map((m, i) => (
            <div key={i} className="logistics-item">
              <div className="logistics-time">{m.time}</div>
              <div className="logistics-status">{m.status}</div>
              <div className="logistics-location">{m.location}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProductionCard({ data }: { data: ProductionData }) {
  return (
    <div className="ai-result-card">
      <div className="result-card-header">
        <span>🏭 生产进度</span>
        <span style={{ color: 'var(--warning)', fontWeight: 600 }}>{data.currentStage}</span>
      </div>
      <div className="result-card-body">
        <div className="production-stages">
          {data.stages.map((s, i) => (
            <span key={i} className={`prod-pill ${s.status}`}>{s.name}</span>
          ))}
        </div>
        <table className="detail-table">
          <tbody>
            {data.details.map((d, i) => (
              <tr key={i}><td>{d.label}</td><td>{d.value}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function VisitCard({ card }: { card: VisitInfoCard }) {
  const statusColor = card.status === '已签约' ? 'var(--success)' : card.status === '洽谈中' ? 'var(--warning)' : 'var(--text-muted)'
  const statusBg = card.status === '已签约' ? 'var(--success-light)' : card.status === '洽谈中' ? 'var(--warning-light)' : 'var(--bg-body)'
  return (
    <div className="visit-info-card">
      <div className="visit-card-header">
        <div className="visit-card-company">{card.companyName}</div>
        <span className="visit-card-status" style={{ color: statusColor, background: statusBg }}>{card.status}</span>
      </div>
      <div className="visit-card-meta">
        <span>👤 {card.contact}</span>
        <span>📅 最近：{card.lastVisit}</span>
        <span>📊 共{card.visitCount}次拜访</span>
      </div>
      <div className="visit-card-history">
        {card.recentVisits.map((v, i) => (
          <div key={i} className="visit-card-visit">
            <div className="visit-card-visit-head">
              <span className="visit-card-visit-type">{v.type}</span>
              <span className="visit-card-visit-date">{v.date}</span>
            </div>
            <div className="visit-card-visit-summary">📋 {v.summary}</div>
            <div className="visit-card-visit-next">📌 待办：{v.nextPlan}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────
export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'assistant', content: '您好！我是您的AI销售助手，可以帮您：\n• 查询订单（如：E011847924）\n• 追踪物流（如：SF1234567890）\n• 查看生产进度（如：E012498733）\n• 查询公司拜访记录\n\n请输入您要查询的内容～' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement
        if (!target.closest('.ai-floating-btn')) {
          setIsOpen(false)
        }
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    const query = input.trim()
    setInput('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))

    // Extract potential ID from query (remove common prefixes like "查询订单", "订单", etc.)
    const extractId = (text: string): string => {
      const cleaned = text.toLowerCase()
        .replace(/查询/g, '')
        .replace(/订单/g, '')
        .replace(/物流/g, '')
        .replace(/运单/g, '')
        .replace(/生产/g, '')
        .replace(/进度/g, '')
        .replace(/拜访/g, '')
        .replace(/记录/g, '')
        .replace(/[：:]/g, ' ')
        .trim()
      // Try to find an ID pattern (alphanumeric like E011847924, SF1234567890, SO-2026-05821)
      const idMatch = cleaned.match(/\b([a-zA-Z0-9\-]+)\b/)
      return idMatch ? idMatch[1] : cleaned
    }

    const q = query.toLowerCase()
    const extractedId = extractId(query)
    const extractedIdLower = extractedId.toLowerCase()
    let cardData: ChatCardData | undefined
    let reply = ''

    // 1. Order ID query - check both full query and extracted ID
    const order = mockOrders.find(o =>
      o.orderId.toLowerCase() === q ||
      o.soNumber.toLowerCase() === q ||
      o.orderId.toLowerCase() === extractedIdLower ||
      o.soNumber.toLowerCase() === extractedIdLower
    )
    if (order) {
      cardData = { type: 'order', order }
      reply = `为您找到订单 **${order.orderId}**，客户：${order.customerName}，状态：${order.status}`
    }
    // 2. Logistics query - check both full query and extracted ID
    else if (logisticsMap[q] || logisticsMap[extractedIdLower]) {
      const logistics = logisticsMap[q] || logisticsMap[extractedIdLower]
      cardData = { type: 'logistics', logisticsData: logistics }
      reply = `为您找到物流信息，运单号：${logistics.logisticsNo}`
    }
    // 3. Production query - check both full query and extracted ID
    else if (productionMap[q] || productionMap[extractedIdLower]) {
      const production = productionMap[q] || productionMap[extractedIdLower]
      cardData = { type: 'production', productionData: production }
      reply = `为您找到生产进度信息，订单：${production.orderId}`
    }
    // 4. Visit record query (by company name)
    else {
      const companyName = Object.keys(mockVisitData).find(k =>
        k.includes(query) ||
        query.includes(k) ||
        k.includes(extractedId) ||
        extractedId.includes(k)
      )
      if (companyName) {
        cardData = { type: 'visit', visitCard: mockVisitData[companyName] }
        reply = `为您找到 **${companyName}** 的拜访信息：`
      } else {
        reply = `未找到与"${query}"相关的信息。\n\n您可以尝试：\n• 输入订单号（如 E011847924）\n• 输入运单号（如 SF1234567890）\n• 输入公司名称查询拜访记录`
      }
    }

    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: reply, cardData }])
    setLoading(false)
  }

  const handleQuickReply = (text: string) => { setInput(text) }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button className="ai-floating-btn" onClick={() => setIsOpen(true)} title="AI助手">
          <img src="/logo.png" alt="AI" className="ai-floating-icon" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="ai-floating-panel" ref={panelRef}>
          <div className="ai-floating-header">
            <div className="ai-floating-header-left">
              <img src="/logo.png" alt="AI" className="ai-floating-header-icon" />
              <div>
                <div className="ai-floating-title">🤖 AI 助手</div>
                <div className="ai-floating-subtitle">智能销售助理</div>
              </div>
            </div>
            <button className="ai-floating-close" onClick={() => setIsOpen(false)} title="关闭">✕</button>
          </div>
          <div className="ai-floating-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`ai-message ${msg.role}`}>
                <div className="ai-message-bubble">
                  {msg.content.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                  {msg.cardData?.type === 'order' && msg.cardData.order && <OrderCard order={msg.cardData.order} />}
                  {msg.cardData?.type === 'logistics' && msg.cardData.logisticsData && <LogisticsCard data={msg.cardData.logisticsData} />}
                  {msg.cardData?.type === 'production' && msg.cardData.productionData && <ProductionCard data={msg.cardData.productionData} />}
                  {msg.cardData?.type === 'visit' && msg.cardData.visitCard && <VisitCard card={msg.cardData.visitCard} />}
                </div>
              </div>
            ))}
            {loading && (
              <div className="ai-message assistant">
                <div className="ai-message-bubble">
                  <div className="ai-loading"><span className="ai-dot" /><span className="ai-dot" /><span className="ai-dot" /></div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="ai-floating-quick-replies">
            {quickReplies.map((r, i) => (
              <button key={i} className="ai-quick-btn" onClick={() => handleQuickReply(r)}>{r}</button>
            ))}
          </div>
          <div className="ai-floating-input-row">
            <input className="ai-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="输入订单号/运单号/公司名称..." />
            <button className="ai-send-btn" onClick={handleSend} disabled={!input.trim()}>发送</button>
          </div>
        </div>
      )}
    </>
  )
}
