'use client'
import VendorLayout from "@/components/vendor/VendorLayout"
import { useAuth } from "@/contexts/AuthContext"
import { getProducts, getOrders } from "@/lib/firestore"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, Package, ShoppingCart, TrendingUp, Eye, Plus } from "lucide-react"
import Link from "next/link"


const VendorDashboardPage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({ totalRevenue: 0, totalProducts: 0, totalOrders: 0, conversionRate: 0 })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      if (user) {
        setLoading(true)
        try {
          const products = await getProducts({ vendorId: user.uid })
          setStats((prev) => ({
            ...prev,
            totalProducts: products.length,
          }))
          setLowStockProducts(products.filter((p: any) => p.stock > 0 && p.stock < 5))

          const orders = await getOrders({ vendorId: user.uid, limitCount: 3 })
          setStats((prev) => ({
            ...prev,
            totalOrders: orders.length,
            totalRevenue: orders.reduce((sum: number, o: any) => sum + o.totalAmount, 0),
          }))
          setRecentOrders(orders)
        } catch (error) {
          setStats({ totalRevenue: 0, totalProducts: 0, totalOrders: 0, conversionRate: 0 })
          setRecentOrders([])
          setLowStockProducts([])
        } finally {
          setLoading(false)
        }
      }
    }
    fetchDashboard()
  }, [user])
  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/vendor/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/vendor/store">
                <Eye className="mr-2 h-4 w-4" />
                View Store
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">+2 new this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">+0.5% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">Loading orders...</div>
                ) : recentOrders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No orders yet.</div>
                ) : (
                  recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{order.products?.[0]?.title || "Order"}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.customerId} • {order.createdAt?.toDate?.().toLocaleDateString?.() || ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">${order.totalAmount}</span>
                        <Badge
                          variant={
                            order.status === "delivered"
                              ? "default"
                              : order.status === "shipped"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
                <Link href="/vendor/orders">View All Orders</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Alert</CardTitle>
              <CardDescription>Products running low on inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">Loading products...</div>
                ) : lowStockProducts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No low stock products.</div>
                ) : (
                  lowStockProducts.map((product) => (
                    <div key={product.sku} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{product.title}</p>
                        <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                      </div>
                      <Badge variant="destructive">{product.stock} left</Badge>
                    </div>
                  ))
                )}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
                <Link href="/vendor/products">Manage Inventory</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </VendorLayout>
  )
}

export default VendorDashboardPage
