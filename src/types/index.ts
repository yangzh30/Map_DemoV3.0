export interface KPIItem {
  label: string
  value: string | number
  unit?: string
  trend: 'up' | 'down' | 'flat'
  trendValue: string
}

export interface LeadItem {
  id: string
  companyName: string
  contact: string
  phone: string
  source: '官网' | 'IS Sales' | '400电话' | '渠道推荐' | '园区活动' | '转介绍'
  status: '新线索' | '跟进中' | '已转化' | '已关闭'
  createTime: string
  estimatedValue: number
  industry: string
}

export interface OpportunityItem {
  id: string
  name: string
  companyName: string
  contact: string
  source: string
  stage: '初步接触' | '需求确认' | '方案报价' | '商务谈判' | '赢单' | '输单'
  probability: number
  expectedAmount: number
  expectedCloseDate: string
  owner: string
}

export interface OrderItem {
  orderId: string
  customerName: string
  productLine: string
  products: string
  quantity: number
  amount: number
  orderDate: string
  status: '待排产' | '排产中' | '生产中' | '已发货' | '运输中' | '已签收'
  isg: boolean
  expedited: boolean
  sn?: string
  soNumber?: string
  logisticsCompany?: string
  logisticsNo?: string
  estimatedDelivery: string
  milestones: OrderMilestone[]
}

export interface OrderMilestone {
  stage: string
  date: string
  completed: boolean
  description: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  cardData?: OrderCardData | LogisticsCardData | ProductionCardData | null
  sessionId: string
}

export interface ChatSession {
  id: string
  title: string
  lastMessage: string
  time: string
  messages: ChatMessage[]
}

export interface OrderCardData {
  type: 'order'
  order: OrderItem
}

export interface LogisticsCardData {
  type: 'logistics'
  orderId: string
  logisticsCompany: string
  logisticsNo: string
  currentLocation: string
  estimatedArrival: string
  milestones: { time: string; status: string; location: string }[]
}

export interface ProductionCardData {
  type: 'production'
  orderId: string
  productName: string
  currentStage: string
  stages: { name: string; status: 'completed' | 'active' | 'pending'; date: string }[]
  details: { label: string; value: string }[]
}

export interface STIDataPoint {
  month: string
  目标: number
  实际: number
}

export interface SODataPoint {
  month: string
  激活量: number
  目标: number
}

export interface TwoAssociationsItem {
  id: string
  name: string
  type: '协会' | '商会' | '园区'
  contactPerson: string
  memberCount: number
  potentialCustomers: number
  lastActivity: string
  status: '已签约' | '洽谈中' | '待开发'
}

export interface ChannelPartner {
  id: string
  name: string
  level: '钻石' | '金牌' | '银牌' | '铜牌' | '注册'
  contactPerson: string
  monthlySTI: number
  monthlySO: number
  lockRate: number
  attachRate: number
  status: '活跃' | '一般' | '沉默'
}

export interface RegionPerformance {
  region: string
  stiTarget: number
  stiActual: number
  soTarget: number
  soActual: number
  lockRate: number
  attachRate: number
}

export interface NewsItem {
  id: number
  text: string
  time: string
  tag: string
  tagColor: string
  url: string
}

export interface VisitItem {
  id: string
  companyName: string
  contact: string
  purpose: string
  date: string
  time: string
  status: '待拜访' | '已拜访' | '已取消'
  address: string
}

export interface BidItem {
  id: string
  title: string
  publishOrg: string
  budget: number
  deadline: string
  matchScore: number
  status: '可投标' | '已投标' | '已过期'
  industry: string
}

export interface TaskItem {
  id: string
  content: string
  priority: '高' | '中' | '低'
  dueDate: string
  status: '待处理' | '处理中' | '已完成'
  relatedCompany?: string
}

export interface PartnerVisit {
  partnerId: string
  partnerName: string
  visitDate: string
  visitType: '例行拜访' | '专项沟通' | '问题处理' | '签约拜访'
  summary: string
  nextPlan: string
  attendees: string
}

export interface CpsIndicator {
  key: string
  label: string
  target: number
  actual: number
  unit: string
  weight: number
  trend: 'up' | 'down' | 'flat'
  trendValue: string
  rank: string
  topAction: string
}
