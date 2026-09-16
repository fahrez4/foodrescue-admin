import { adminApi } from '../api'

class AdminDataServiceClass {
  constructor() {
    this.users = []
    this.stores = []
    this.products = []
    this.orders = []
    this.logs = []
    this.loading = false
    this.error = null
    this.listeners = new Set()
  }

  subscribe(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  notify() {
    this.listeners.forEach((l) => l())
  }

  async loadAll() {
    this.loading = true
    this.error = null
    this.notify()

    try {
      const [usersRes, productsRes, logsRes] = await Promise.allSettled([
        adminApi.users(),
        adminApi.products(),
        adminApi.logs(),
      ])

      if (usersRes.status === 'fulfilled') {
        this.users = usersRes.value?.data || []
      }
      if (productsRes.status === 'fulfilled') {
        this.products = productsRes.value?.data || []
      }
      if (logsRes.status === 'fulfilled') {
        this.logs = logsRes.value?.data || []
      }
    } catch (err) {
      this.error = err.message
    } finally {
      this.loading = false
      this.notify()
    }
  }

  async deleteUser(id) {
    await adminApi.deleteUser(id)
    this.users = this.users.filter((u) => u.id !== id)
    this.notify()
  }

  // Aggregates untuk dashboard
  get totalUsers() { return this.users.length }
  get totalStores() { return this.stores.length }
  get totalOrders() { return this.orders.length }
  get totalRevenue() {
    return this.orders.reduce((sum, o) => sum + (o.total || 0), 0)
  }
  get activeUsers() {
    return this.users.filter((u) => u.status === 'active').length
  }
  get pendingOrders() {
    return this.orders.filter((o) => o.status === 'Menunggu').length
  }
}

const AdminDataService = new AdminDataServiceClass()
export default AdminDataService