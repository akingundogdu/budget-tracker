import { transactionService, reminderService, authService } from './supabase';

class BudgetService {
  constructor() {
    this.transactions = transactionService;
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
      const user = await this.auth.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { startDate, endDate, page = 1, limit = 10 } = filters;
      
      const transactions = await this.transactions.getAllForDashboard({
        startDate,
        endDate,
        page,
        limit
      });

      return {
        recentTransactions: transactions
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.message === 'User not authenticated') {
        // Redirect to login or handle auth error
        window.location.href = '/login';
        return { recentTransactions: [] };
      }
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

  // Category analytics
  async getCategoryAnalytics(category, timeRange = 'month') {
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
        category,
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

  // Dashboard summary cards
  async getSummaryCards(filters = {}) {
    try {
      const user = await this.auth.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const stats = await this.transactions.getStats(filters);

      return {
        totalBalance: stats.totalIncome - stats.totalExpenses,
        totalIncome: stats.totalIncome,
        totalExpenses: stats.totalExpenses,
        regularExpenses: stats.regularExpenses
      };
    } catch (error) {
      console.error('Error fetching summary cards:', error);
      if (error.message === 'User not authenticated') {
        // Redirect to login or handle auth error
        window.location.href = '/login';
        return {
          totalBalance: 0,
          totalIncome: 0,
          totalExpenses: 0,
          regularExpenses: 0
        };
      }
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