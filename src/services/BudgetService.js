import { transactionService, categoryService, reminderService, authService } from './supabase';

class BudgetService {
  constructor() {
    this.transactions = transactionService;
    this.categories = categoryService;
    this.reminders = reminderService;
    this.auth = authService;
    this._currentUser = null;
    this._initAuthListener();
  }

  // Initialize auth state listener
  _initAuthListener() {
    this.auth.onAuthStateChange((event, session) => {
      this._currentUser = session?.user || null;
      this._notifyAuthStateChange(event, session?.user);
    });
  }

  // Auth state change subscribers
  _authSubscribers = new Set();
  onAuthStateChange(callback) {
    this._authSubscribers.add(callback);
    return () => this._authSubscribers.delete(callback);
  }

  _notifyAuthStateChange(event, user) {
    this._authSubscribers.forEach(callback => callback(event, user));
  }

  // Dashboard data
  async getDashboardData(filters = {}) {
    try {
      const [transactions, stats, upcomingReminders, categories] = await Promise.all([
        this.transactions.getAll({ ...filters, limit: 5 }),
        this.transactions.getStats(filters),
        this.reminders.getUpcoming(7),
        this.categories.getWithTransactionCounts()
      ]);

      return {
        recentTransactions: transactions,
        stats,
        upcomingReminders,
        categories
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  // Budget summary
  async getBudgetSummary(month = new Date()) {
    const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    try {
      const stats = await this.transactions.getStats({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      return {
        ...stats,
        month: month.toISOString(),
        balance: stats.totalIncome - stats.totalExpenses
      };
    } catch (error) {
      console.error('Error fetching budget summary:', error);
      throw error;
    }
  }

  // Category management
  async getCategoryAnalytics(categoryId, timeRange = 'month') {
    const now = new Date();
    let startDate, endDate;

    switch (timeRange) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        endDate = new Date();
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    try {
      const transactions = await this.transactions.getAll({
        categoryId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      const stats = transactions.reduce((acc, t) => ({
        totalAmount: acc.totalAmount + t.amount,
        count: acc.count + 1,
        averageAmount: (acc.totalAmount + t.amount) / (acc.count + 1)
      }), { totalAmount: 0, count: 0, averageAmount: 0 });

      return {
        ...stats,
        transactions,
        timeRange,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };
    } catch (error) {
      console.error('Error fetching category analytics:', error);
      throw error;
    }
  }

  // User preferences
  async getUserPreferences() {
    const user = await this.auth.getCurrentUser();
    return user?.user_metadata || {};
  }

  async updateUserPreferences(preferences) {
    try {
      await this.auth.updateProfile(preferences);
      return await this.getUserPreferences();
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const budgetService = new BudgetService();
export default budgetService; 