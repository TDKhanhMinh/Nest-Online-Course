"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useUsers } from "@/features/user/presentation/hooks/use-users"
import {
  useAdminCampaignsQuery,
  useAdminSendNotificationMutation,
} from "@/features/notifications/presentation/hooks/use-admin-notifications"
import { NotificationPriority } from "@/features/notifications/types"
import {
  Search,
  Bell,
  Send,
  RefreshCw,
  Clock,
  Users as UsersIcon,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
  BarChart3,
  TrendingUp,
  XCircle,
  Copy,
  Check,
} from "lucide-react"
import { format } from "date-fns"

export default function AdminNotificationsPage() {
  const t = useTranslations("Admin.notifications")

  // Form states
  const [targetType, setTargetType] = useState<'ALL' | 'USER'>('ALL')
  const [recipientId, setRecipientId] = useState("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [actionUrl, setActionUrl] = useState("")
  const [priority, setPriority] = useState<NotificationPriority>(NotificationPriority.NORMAL)

  // User list search states
  const [lookupOpen, setLookupOpen] = useState(false)
  const [userSearch, setUserSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)

  // Query campaigns pagination & filters
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [targetTypeFilter, setTargetTypeFilter] = useState<string>("")

  // Dialog details state
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Custom search API for single user lookup
  const { data: usersData, isLoading: isUsersLoading } = useUsers({
    search: userSearch.length >= 2 ? userSearch : undefined,
    limit: 20,
  })
  const searchedUsers = usersData?.users || []

  // Fetch campaigns
  const {
    data: campaignsData,
    isLoading: isCampaignsLoading,
    refetch: refetchCampaigns,
    isRefetching: isCampaignsRefetching,
  } = useAdminCampaignsQuery({
    page,
    limit: 10, // Increased to 10 for better desktop density
    keyword: keyword || undefined,
    status: statusFilter || undefined,
    targetType: targetTypeFilter || undefined,
  })

  // Mutation to send campaign
  const sendMutation = useAdminSendNotificationMutation()

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      toast.error("Vui lòng điền đầy đủ tiêu đề và nội dung.")
      return
    }

    if (targetType === 'USER' && !recipientId.trim()) {
      toast.error("Vui lòng chọn hoặc nhập mã học viên.")
      return
    }

    const requestId = crypto.randomUUID()

    sendMutation.mutate(
      {
        targetType,
        recipientId: targetType === 'USER' ? recipientId : undefined,
        title,
        content,
        actionUrl: actionUrl.trim() || undefined,
        priority,
        requestId,
      },
      {
        onSuccess: () => {
          toast.success(t("success_send"))
          // Reset form fields
          setTitle("")
          setContent("")
          setActionUrl("")
          setRecipientId("")
          setSelectedUser(null)
          setTargetType('ALL')
          setPriority(NotificationPriority.NORMAL)
          refetchCampaigns()
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || err.message || "Không thể gửi thông báo.")
        },
      }
    )
  }

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    toast.success("Đã sao chép ID vào bộ nhớ tạm.")
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">{t('status_completed')}</Badge>
      case 'PROCESSING':
        return <Badge className="bg-blue-500/10 text-blue-500 border border-blue-500/20 animate-pulse">{t('status_processing')}</Badge>
      case 'PARTIAL_FAILED':
        return <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20">{t('status_partial_failed')}</Badge>
      case 'FAILED':
        return <Badge className="bg-rose-500/10 text-rose-500 border border-rose-500/20">{t('status_failed')}</Badge>
      default:
        return <Badge className="bg-white/10 text-muted-foreground">{status}</Badge>
    }
  }

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'HIGH':
        return <Badge className="bg-rose-500/15 text-rose-400 border border-rose-500/20 font-bold text-[10px]">HIGH</Badge>
      case 'NORMAL':
        return <Badge className="bg-blue-500/15 text-blue-400 border border-blue-500/20 text-[10px]">NORMAL</Badge>
      case 'LOW':
        return <Badge className="bg-white/5 text-muted-foreground border border-white/10 text-[10px]">LOW</Badge>
      default:
        return <Badge className="bg-white/15 text-foreground text-[10px]">{p}</Badge>
    }
  }

  const campaigns = campaignsData?.items || []
  const totalCampaigns = campaignsData?.total || 0
  const totalPages = Math.ceil(totalCampaigns / 10)

  // Calculate statistics from the loaded items page
  const pageInAppCount = campaigns.reduce((sum, c) => sum + (c.inAppCreatedCount || 0), 0)
  const pagePushSuccessCount = campaigns.reduce((sum, c) => sum + (c.pushSuccessCount || 0), 0)
  const pagePushFailureCount = campaigns.reduce((sum, c) => sum + (c.pushFailureCount || 0), 0)
  const totalPageTokens = pagePushSuccessCount + pagePushFailureCount
  const pushSuccessPercent = totalPageTokens > 0 ? Math.round((pagePushSuccessCount / totalPageTokens) * 100) : 100

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8 max-w-[1600px] mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-2xl">
              Trung tâm quản trị chiến dịch truyền thông của hệ thống. Tạo, theo dõi tiến trình gửi và phân tích tỷ lệ tiếp cận người dùng.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchCampaigns()}
            disabled={isCampaignsLoading || isCampaignsRefetching}
            className="border-white/10 hover:bg-white/5 h-10 px-4 rounded-xl gap-2 font-semibold text-xs transition-all"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isCampaignsRefetching && "animate-spin")} />
            Làm mới danh sách
          </Button>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-white/5 bg-white/5 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-foreground"><Bell className="w-16 h-16" /></div>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tổng số chiến dịch</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-foreground mt-1">{totalCampaigns}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Cập nhật thời gian thực
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-white/5 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-primary"><UsersIcon className="w-16 h-16" /></div>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lượt In-App đã tạo</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-emerald-400 mt-1">{pageInAppCount}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-[10px] text-muted-foreground/60">
              Tổng số thông báo phát hành trên trang hiện tại
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-white/5 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-blue-500"><TrendingUp className="w-16 h-16" /></div>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">FCM đẩy thành công</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-blue-400 mt-1">{pagePushSuccessCount}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-[10px] text-muted-foreground/60 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Đạt tỷ lệ tiếp cận ~{pushSuccessPercent}%
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-white/5 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-rose-500"><AlertCircle className="w-16 h-16" /></div>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Số lượt lỗi đẩy FCM</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-rose-400 mt-1">{pagePushFailureCount}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-[10px] text-muted-foreground/60 flex items-center gap-1.5">
              <XCircle className="w-3 h-3 text-rose-500" /> Tự động dọn dẹp các token hỏng
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Form Left, Campaign List / Table Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container */}
        <Card className="lg:col-span-4 border-white/5 bg-white/5 p-4 sm:p-5 lg:p-6 rounded-xl shadow-lg backdrop-blur-md">
          <CardHeader className="p-0 pb-6">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Send className="w-4 h-4 text-primary" />
              {t('send_new')}
            </CardTitle>
            <CardDescription className="text-xs">Soạn nội dung và phát hành thông báo tức thì.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSend} className="space-y-5">
              {/* Recipient Type */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('target_type')}</label>
                <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => setTargetType('ALL')}
                    className={cn(
                      "py-2.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer min-h-[44px]",
                      targetType === 'ALL'
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    {t('target_all')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetType('USER')}
                    className={cn(
                      "py-2.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer min-h-[44px]",
                      targetType === 'USER'
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    {t('target_user')}
                  </button>
                </div>
              </div>

              {/* Recipient Search Dialog */}
              {targetType === 'USER' && (
                <div className="space-y-2 animate-in slide-in-from-top-3 duration-250">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('recipient_id')}</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder={t('input_recipient_id')}
                      value={recipientId}
                      onChange={(e) => setRecipientId(e.target.value)}
                      className="bg-white/5 border-white/10 h-11 focus-visible:ring-primary/20 text-xs"
                      required
                    />
                    <Dialog open={lookupOpen} onOpenChange={setLookupOpen}>
                      <DialogTrigger
                        render={
                          <Button type="button" variant="outline" className="border-white/10 shrink-0 h-11 min-h-[44px] text-xs font-bold px-3">
                            <Search className="w-3.5 h-3.5 mr-1" />
                            Tìm học viên
                          </Button>
                        }
                      />
                      <DialogContent className="max-w-md bg-popover border-white/10 rounded-2xl">
                        <DialogHeader>
                          <DialogTitle className="font-extrabold text-base">Tìm kiếm học viên</DialogTitle>
                          <DialogDescription className="text-xs">Nhập tên hoặc email học viên để tự động trích xuất mã ID.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              placeholder="Nhập tên hoặc email..."
                              value={userSearch}
                              onChange={(e) => setUserSearch(e.target.value)}
                              className="pl-10 bg-white/5 border-white/10 h-11 text-sm focus-visible:ring-primary/25"
                            />
                          </div>
                          <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                            {isUsersLoading ? (
                              <div className="text-center text-xs py-6 text-muted-foreground flex items-center justify-center gap-2">
                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" /> Đang tải học viên...
                              </div>
                            ) : searchedUsers.length === 0 ? (
                              <div className="text-center text-xs py-6 text-muted-foreground">Không tìm thấy kết quả nào phù hợp.</div>
                            ) : (
                              searchedUsers.map((u: any) => (
                                <button
                                  key={u.id}
                                  type="button"
                                  onClick={() => {
                                    setRecipientId(u.id)
                                    setSelectedUser(u)
                                    setLookupOpen(false)
                                  }}
                                  className="flex items-center justify-between w-full p-2.5 rounded-xl hover:bg-white/5 transition-all text-left cursor-pointer min-h-[46px]"
                                >
                                  <div>
                                    <div className="font-bold text-xs text-foreground">{u.fullName}</div>
                                    <div className="text-[10px] text-muted-foreground mt-0.5">{u.email}</div>
                                  </div>
                                  <Badge variant="outline" className="text-[9px] font-bold px-2 py-0.5">Chọn</Badge>
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  {selectedUser && recipientId === selectedUser.id && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 mt-1 flex items-center justify-between">
                      <span className="truncate pr-2">
                        ✓ Học viên: <span className="font-bold">{selectedUser.fullName}</span> ({selectedUser.email})
                      </span>
                      <button type="button" onClick={() => { setSelectedUser(null); setRecipientId(""); }} className="text-[10px] underline hover:text-white">Hủy</button>
                    </div>
                  )}
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('title_input')}</label>
                <Input
                  placeholder={t('input_title')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={120}
                  className="bg-white/5 border-white/10 h-11 focus-visible:ring-primary/20 text-sm"
                  required
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('content_input')}</label>
                  <span className="text-[10px] text-muted-foreground/60">{content.length}/1000</span>
                </div>
                <Textarea
                  placeholder={t('input_content')}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={1000}
                  rows={4}
                  className="bg-white/5 border-white/10 focus-visible:ring-primary/20 resize-none text-sm p-3"
                  required
                />
              </div>

              {/* Action URL */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('action_url')}</label>
                <Input
                  placeholder={t('input_action_url')}
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  maxLength={500}
                  className="bg-white/5 border-white/10 h-11 focus-visible:ring-primary/20 text-xs"
                />
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('priority')}</label>
                <div className="grid grid-cols-3 gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                  {Object.values(NotificationPriority).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={cn(
                        "py-2 text-[11px] font-bold rounded-lg transition-all duration-200 cursor-pointer min-h-[44px]",
                        priority === p
                          ? "bg-white/10 text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={sendMutation.isPending}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/95 transition-all duration-200 font-extrabold h-12 gap-2 flex items-center justify-center rounded-xl cursor-pointer"
              >
                {sendMutation.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {t('sending')}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {t('send')}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* History campaigns table & list Container */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-white/5 bg-white/5 p-4 sm:p-5 lg:p-6 rounded-xl shadow-lg backdrop-blur-md">
            <CardHeader className="p-0 pb-6 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    {t('campaign_history')}
                  </CardTitle>
                  <CardDescription className="text-xs">Theo dõi nhật ký phân phát tin nhắn của toàn hệ thống.</CardDescription>
                </div>
              </div>

              {/* Advanced Filter Panel */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                {/* Search Bar */}
                <div className="sm:col-span-6 relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder={t('search_placeholder')}
                    value={keyword}
                    onChange={(e) => {
                      setKeyword(e.target.value)
                      setPage(1)
                    }}
                    className="pl-10 bg-white/5 border-white/10 focus-visible:ring-primary/20 h-10 text-xs"
                  />
                </div>

                {/* Target Type Filter */}
                <div className="sm:col-span-3">
                  <select
                    value={targetTypeFilter}
                    onChange={(e) => {
                      setTargetTypeFilter(e.target.value)
                      setPage(1)
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl h-10 px-3 text-xs text-muted-foreground focus:text-foreground focus:ring-1 focus:ring-primary/30 outline-none"
                  >
                    <option value="" className="bg-popover text-foreground">Mọi đối tượng</option>
                    <option value="ALL" className="bg-popover text-foreground">Tất cả học viên</option>
                    <option value="USER" className="bg-popover text-foreground">Học viên cụ thể</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="sm:col-span-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value)
                      setPage(1)
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl h-10 px-3 text-xs text-muted-foreground focus:text-foreground focus:ring-1 focus:ring-primary/30 outline-none"
                  >
                    <option value="" className="bg-popover text-foreground">Mọi trạng thái</option>
                    <option value="COMPLETED" className="bg-popover text-foreground">Thành công</option>
                    <option value="PROCESSING" className="bg-popover text-foreground">Đang xử lý</option>
                    <option value="PARTIAL_FAILED" className="bg-popover text-foreground">Thất bại một phần</option>
                    <option value="FAILED" className="bg-popover text-foreground">Thất bại</option>
                  </select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 space-y-4">
              {isCampaignsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-16 w-full rounded-xl bg-white/5 animate-pulse" />
                  ))}
                </div>
              ) : campaigns.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-white/10 rounded-xl bg-white/5">
                  <Bell className="w-8 h-8 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm font-semibold text-muted-foreground">{t('no_campaigns')}</p>
                </div>
              ) : (
                <>
                  {/* MOBILE VIEW (Card Layout) */}
                  <div className="block md:hidden space-y-4">
                    {campaigns.map((c) => (
                      <div
                        key={c._id}
                        onClick={() => {
                          setSelectedCampaign(c)
                          setDetailOpen(true)
                        }}
                        className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] transition-all cursor-pointer flex flex-col gap-2.5 relative group"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-bold text-xs text-muted-foreground/60">
                            {c.createdAt ? format(new Date(c.createdAt), 'dd/MM/yyyy HH:mm') : ''}
                          </span>
                          {getStatusBadge(c.status)}
                        </div>
                        <div className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {c.title}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{c.content}</p>
                        <div className="flex items-center justify-between text-[10px] border-t border-white/5 pt-2 mt-1 text-muted-foreground/60">
                          <span className="flex items-center gap-1">
                            <UsersIcon className="w-3 h-3" />
                            Đã tạo: {c.inAppCreatedCount || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Send className="w-3 h-3" />
                            FCM: {c.pushSuccessCount || 0}/{c.totalTokens || 0}
                          </span>
                          <span className="font-semibold text-primary">Xem →</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* DESKTOP/TABLET VIEW (Table Layout) */}
                  <div className="hidden md:block overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02]">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          <th className="p-3.5 pl-4">Tiêu đề & Nội dung</th>
                          <th className="p-3.5">Đối tượng</th>
                          <th className="p-3.5">Độ ưu tiên</th>
                          <th className="p-3.5 text-center">In-App / FCM Push</th>
                          <th className="p-3.5">Trạng thái</th>
                          <th className="p-3.5">Thời gian tạo</th>
                          <th className="p-3.5 pr-4 text-right">Hành động</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs">
                        {campaigns.map((c) => (
                          <tr
                            key={c._id}
                            onClick={() => {
                              setSelectedCampaign(c)
                              setDetailOpen(true)
                            }}
                            className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                          >
                            <td className="p-3.5 pl-4 max-w-[200px]">
                              <div className="font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                {c.title}
                              </div>
                              <div className="text-muted-foreground line-clamp-1 mt-0.5 text-[11px]">
                                {c.content}
                              </div>
                            </td>
                            <td className="p-3.5">
                              {c.targetType === 'ALL' ? (
                                <Badge variant="outline" className="bg-emerald-500/5 text-emerald-400 border-emerald-500/10 text-[10px] font-semibold">TẤT CẢ ACTIVES</Badge>
                              ) : (
                                <div className="flex flex-col gap-0.5">
                                  <Badge variant="outline" className="bg-blue-500/5 text-blue-400 border-blue-500/10 text-[10px] font-semibold w-fit">CÁ NHÂN</Badge>
                                  <span className="text-[10px] text-muted-foreground/60 truncate max-w-[80px]" title={c.recipientId}>{c.recipientId}</span>
                                </div>
                              )}
                            </td>
                            <td className="p-3.5">{getPriorityBadge(c.priority)}</td>
                            <td className="p-3.5 text-center">
                              <div className="flex flex-col items-center">
                                <span className="font-bold text-foreground">{c.inAppCreatedCount || 0} in-app</span>
                                <span className="text-[10px] text-muted-foreground/70 mt-0.5">
                                  FCM: {c.pushSuccessCount || 0} / {c.totalTokens || 0}
                                </span>
                              </div>
                            </td>
                            <td className="p-3.5">{getStatusBadge(c.status)}</td>
                            <td className="p-3.5 text-muted-foreground">
                              {c.createdAt ? format(new Date(c.createdAt), 'dd/MM/yyyy HH:mm') : ''}
                            </td>
                            <td className="p-3.5 pr-4 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary rounded-lg transition-all"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Section */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-white/10 pt-4 mt-6">
                      <p>
                        Trang <span className="font-semibold text-foreground">{page}</span> / {totalPages} (Tổng {totalCampaigns} chiến dịch)
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="h-8 hover:bg-white/5 text-xs font-semibold cursor-pointer px-3 border-white/10"
                        >
                          Trước
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                          className="h-8 hover:bg-white/5 text-xs font-semibold cursor-pointer px-3 border-white/10"
                        >
                          Sau
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Campaign Detail Modal Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-3xl lg:max-w-4xl bg-popover border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
          {selectedCampaign && (
            <div className="space-y-6">
              <DialogHeader className="border-b border-white/10 pb-4">
                <div className="flex justify-between items-start gap-2">
                  <DialogTitle className="text-lg font-bold pr-8">{selectedCampaign.title}</DialogTitle>
                  <div className="shrink-0">{getStatusBadge(selectedCampaign.status)}</div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-2">
                  <span>ID Chiến dịch:</span>
                  <code className="bg-white/5 px-1.5 py-0.5 rounded border border-white/5 text-foreground/80">{selectedCampaign._id}</code>
                  <button
                    onClick={() => handleCopyId(selectedCampaign._id)}
                    className="p-1 hover:bg-white/5 rounded text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copiedId === selectedCampaign._id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </DialogHeader>

              {/* Campaign Content Card */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <div className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider">Nội dung gửi</div>
                <p className="text-xs leading-relaxed whitespace-pre-wrap text-foreground/90">{selectedCampaign.content}</p>
                {selectedCampaign.actionUrl && (
                  <div className="pt-2">
                    <a
                      href={selectedCampaign.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-semibold"
                    >
                      Liên kết hành động (Action URL) <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Progress visual metrics */}
              <div className="space-y-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-primary" />
                  Tiến trình gửi & Phân tích tiếp cận
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Metric in-app */}
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-muted-foreground">In-App Created</div>
                    <div className="text-lg font-extrabold mt-1 text-emerald-400">
                      {selectedCampaign.inAppCreatedCount || 0}
                      <span className="text-xs font-normal text-muted-foreground/70 ml-1">
                        / {selectedCampaign.totalRecipients || 0} học viên
                      </span>
                    </div>
                  </div>

                  {/* Metric FCM push */}
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-muted-foreground">FCM Deliveries</div>
                    <div className="text-lg font-extrabold mt-1 text-blue-400">
                      {selectedCampaign.pushSuccessCount || 0}
                      <span className="text-xs font-normal text-muted-foreground/70 ml-1">
                        / {selectedCampaign.totalTokens || 0} thiết bị
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress bar FCM success rate */}
                {selectedCampaign.totalTokens > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-muted-foreground">Tỷ lệ Push FCM thành công</span>
                      <span className="text-blue-400">
                        {Math.round((selectedCampaign.pushSuccessCount / selectedCampaign.totalTokens) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.round((selectedCampaign.pushSuccessCount / selectedCampaign.totalTokens) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Execution Info */}
              <div className="space-y-2 text-xs border-t border-white/5 pt-4">
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">Người gửi:</span>
                  <span className="font-bold">{selectedCampaign.senderEmail || "Hệ thống"}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">Phạm vi đối tượng:</span>
                  <span className="font-bold">
                    {selectedCampaign.targetType === 'ALL' ? 'Tất cả học viên active' : 'Học viên cụ thể'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">Độ ưu tiên:</span>
                  <span>{getPriorityBadge(selectedCampaign.priority)}</span>
                </div>
                {selectedCampaign.requestId && (
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Mã Request (Idempotency):</span>
                    <span className="font-mono text-[10px] text-muted-foreground/80">{selectedCampaign.requestId}</span>
                  </div>
                )}
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">Thời gian bắt đầu:</span>
                  <span className="font-medium">
                    {selectedCampaign.createdAt ? format(new Date(selectedCampaign.createdAt), 'dd/MM/yyyy HH:mm:ss') : ''}
                  </span>
                </div>
                {selectedCampaign.completedAt && (
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">Thời gian hoàn thành:</span>
                    <span className="font-medium text-emerald-400">
                      {format(new Date(selectedCampaign.completedAt), 'dd/MM/yyyy HH:mm:ss')}
                    </span>
                  </div>
                )}
              </div>

              {/* Error Summary Alert */}
              {selectedCampaign.errorSummary && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex gap-3 text-xs text-rose-400">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
                  <div>
                    <div className="font-bold">Nhật ký lỗi chiến dịch</div>
                    <p className="mt-1 leading-relaxed text-rose-300/90">{selectedCampaign.errorSummary}</p>
                  </div>
                </div>
              )}

              {/* Modal footer controls */}
              <div className="flex justify-end gap-2 border-t border-white/5 pt-4">
                <Button
                  onClick={() => {
                    // Pre-fill form fields with this campaign's settings to clone
                    setTargetType(selectedCampaign.targetType)
                    setRecipientId(selectedCampaign.recipientId || "")
                    setTitle(selectedCampaign.title)
                    setContent(selectedCampaign.content)
                    setActionUrl(selectedCampaign.actionUrl || "")
                    setPriority(selectedCampaign.priority)
                    setDetailOpen(false)
                    toast.success("Đã sao chép cấu hình chiến dịch sang biểu mẫu!")
                  }}
                  variant="outline"
                  className="border-white/10 hover:bg-white/5 text-xs font-semibold cursor-pointer h-10 px-4 rounded-xl"
                >
                  Sao chép chiến dịch
                </Button>
                <Button
                  onClick={() => setDetailOpen(false)}
                  className="bg-white/10 hover:bg-white/20 text-foreground text-xs font-semibold cursor-pointer h-10 px-4 rounded-xl"
                >
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// --- Hybrid Responsive Summary ---
// mobile  (default / sm):  Card-list layout optimized for touch-targets (≥ 44px min-h buttons). Show title, status, and compact counts on each card. Filters stack vertically.
// tablet  (md / lg):       Table-based layout displaying more columns (Title & Snippet, Scope badge, Priority badge, stats progress, status badge, created time). Dialog handles 2-column details.
// desktop (xl / 2xl):      Split layout with campaign creation form on the left (col-span-4) and historical table layout on the right (col-span-8). Stats summary cards at the top row. Action/details buttons have hover scales and high density formatting.
// Interaction:             Interactive stat cards, live pagination, hover indicators, clipboard copy controls with state change, and a direct form-population clone button.
