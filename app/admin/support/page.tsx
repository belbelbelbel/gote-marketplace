"use client"

import AdminLayout from "@/components/admin/AdminLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Clock, Filter, ArrowUp } from "lucide-react"
import { useState } from "react"

// Mock admin support tickets (escalated from vendors/AI)
const mockAdminTickets = [
  {
    id: "TKT-A001",
    customerId: "customer_123",
    customerName: "John Doe",
    vendorId: "vendor_456",
    vendorName: "TechStore",
    subject: "Refund dispute - Product not as described",
    description: "Customer claims product doesn't match description, vendor refuses refund",
    status: "open",
    priority: "high",
    escalatedFrom: "vendor",
    escalationReason: "Vendor-customer dispute",
    createdAt: new Date("2024-01-15"),
    lastUpdate: new Date("2024-01-15"),
    messages: [
      {
        senderId: "customer_123",
        senderRole: "customer",
        message:
          "The vendor is refusing to refund my money even though the product doesn't have the advertised features.",
        timestamp: new Date("2024-01-15T10:30:00"),
      },
      {
        senderId: "vendor_456",
        senderRole: "vendor",
        message: "The product description is accurate. Customer is trying to return a used item.",
        timestamp: new Date("2024-01-15T11:00:00"),
      },
    ],
  },
  {
    id: "TKT-A002",
    customerId: "customer_789",
    customerName: "Sarah Wilson",
    vendorId: "vendor_123",
    vendorName: "FashionHub",
    subject: "Payment processing error",
    description: "Customer charged twice for same order, vendor can't resolve",
    status: "in-progress",
    priority: "urgent",
    escalatedFrom: "ai",
    escalationReason: "Technical payment issue beyond AI capability",
    createdAt: new Date("2024-01-14"),
    lastUpdate: new Date("2024-01-15"),
    messages: [
      {
        senderId: "ai_system",
        senderRole: "ai",
        message: "I've detected a duplicate payment charge. This requires manual intervention from the admin team.",
        timestamp: new Date("2024-01-14T16:20:00"),
      },
    ],
  },
]

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState(mockAdminTickets)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [replyMessage, setReplyMessage] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredTickets = tickets.filter((ticket) => {
    const statusMatch = statusFilter === "all" || ticket.status === statusFilter
    const priorityMatch = priorityFilter === "all" || ticket.priority === priorityFilter
    return statusMatch && priorityMatch
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      open: "destructive",
      "in-progress": "default",
      resolved: "secondary",
    }
    return <Badge variant={variants[status] || "outline"}>{status.replace("-", " ")}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      low: "outline",
      medium: "secondary",
      high: "destructive",
      urgent: "destructive",
    }
    return <Badge variant={variants[priority] || "outline"}>{priority}</Badge>
  }

  const getEscalationBadge = (escalatedFrom: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      ai: "default",
      vendor: "secondary",
      customer: "outline",
    }
    return (
      <Badge variant={variants[escalatedFrom] || "outline"} className="flex items-center gap-1">
        <ArrowUp className="h-3 w-3" />
        From {escalatedFrom}
      </Badge>
    )
  }

  const handleReply = (ticketId: string) => {
    if (!replyMessage.trim()) return

    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            messages: [
              ...ticket.messages,
              {
                senderId: "admin_current",
                senderRole: "admin",
                message: replyMessage,
                timestamp: new Date(),
              },
            ],
            lastUpdate: new Date(),
            status: "in-progress",
          }
        }
        return ticket
      }),
    )

    setReplyMessage("")
  }

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            status: newStatus,
            lastUpdate: new Date(),
          }
        }
        return ticket
      }),
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Support Management</h1>
          <p className="text-muted-foreground">Handle escalated tickets and complex customer issues</p>
        </div>

        <Tabs defaultValue="escalated" className="space-y-6">
          <TabsList>
            <TabsTrigger value="escalated">Escalated Tickets</TabsTrigger>
            <TabsTrigger value="analytics">Support Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="escalated" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tickets Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Tickets List */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Escalated Tickets ({filteredTickets.length})</h2>
                {filteredTickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedTicket?.id === ticket.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(ticket.status)}
                            <span className="font-medium">{ticket.id}</span>
                          </div>
                          <h3 className="font-semibold text-balance">{ticket.subject}</h3>
                          <p className="text-sm text-muted-foreground">
                            Customer: {ticket.customerName} • Vendor: {ticket.vendorName}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(ticket.status)}
                          {getPriorityBadge(ticket.priority)}
                          {getEscalationBadge(ticket.escalatedFrom)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground line-clamp-2">{ticket.description}</p>
                        <p className="text-xs text-muted-foreground">Escalation reason: {ticket.escalationReason}</p>
                        <div className="text-xs text-muted-foreground">
                          Last updated: {ticket.lastUpdate.toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Ticket Details */}
              <div className="space-y-4">
                {selectedTicket ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Ticket Details</h2>
                      <Select
                        value={selectedTicket.status}
                        onValueChange={(value) => handleStatusChange(selectedTicket.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Card>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-balance">{selectedTicket.subject}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {selectedTicket.id} • Escalated from {selectedTicket.escalatedFrom}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {getStatusBadge(selectedTicket.status)}
                            {getPriorityBadge(selectedTicket.priority)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Parties Involved</h4>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>Customer: {selectedTicket.customerName}</p>
                              <p>Vendor: {selectedTicket.vendorName}</p>
                              <p>Created: {selectedTicket.createdAt.toLocaleDateString()}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Issue Description</h4>
                            <p className="text-sm text-muted-foreground">{selectedTicket.description}</p>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Escalation Details</h4>
                            <p className="text-sm text-muted-foreground">{selectedTicket.escalationReason}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Messages */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Conversation History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {selectedTicket.messages.map((message: any, index: number) => (
                            <div
                              key={index}
                              className={`flex ${message.senderRole === "admin" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[80%] rounded-lg p-3 ${
                                  message.senderRole === "admin"
                                    ? "bg-primary text-primary-foreground"
                                    : message.senderRole === "ai"
                                      ? "bg-blue-100 text-blue-900"
                                      : message.senderRole === "vendor"
                                        ? "bg-green-100 text-green-900"
                                        : "bg-muted"
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-medium capitalize">{message.senderRole}</span>
                                </div>
                                <p className="text-sm">{message.message}</p>
                                <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Admin Reply Form */}
                        <div className="mt-4 space-y-2">
                          <textarea
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            placeholder="Type your admin response..."
                            className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                            rows={3}
                          />
                          <div className="flex justify-end">
                            <Button
                              onClick={() => handleReply(selectedTicket.id)}
                              disabled={!replyMessage.trim()}
                              className="px-4 py-2"
                            >
                              Send Admin Response
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-64">
                      <p className="text-muted-foreground">Select a ticket to view details</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle>Total Escalated</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{tickets.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>From AI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {tickets.filter((t) => t.escalatedFrom === "ai").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>From Vendors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {tickets.filter((t) => t.escalatedFrom === "vendor").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resolved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-600">
                    {tickets.filter((t) => t.status === "resolved").length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
