import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      common: {
        save: 'Save',
        cancel: 'Cancel',
        add: 'Add',
        edit: 'Edit',
        delete: 'Delete',
        search: 'Search',
        filter: 'Filter',
        apply: 'Apply',
        back: 'Back',
        new: 'New',
        comingSoon: 'Coming Soon',
        refresh: 'Refresh',
        setDate: 'Set Date',
        setReminder: 'Set Reminder',
        loading: 'Loading...'
      },
      navigation: {
        dashboard: 'Dashboard',
        expenses: 'Expenses',
        profile: 'Profile',
      },
      dashboard: {
        title: 'Dashboard',
        welcome: 'Welcome',
        stats: {
          totalBalance: {
            title: 'Total Balance',
          },
          totalIncome: {
            title: 'Total Income',
          },
          totalExpenses: {
            title: 'Total Expenses',
          },
          regularExpenses: {
            title: 'Regular Expenses',
          },
        },
        recentTransactions: 'Recent Transactions',
        emptyState: {
          title: 'No transactions yet',
          description: 'Start adding your expenses and income to track your finances'
        },
        filter: {
          period: 'Period',
          total: 'Total',
          monthly: 'Monthly',
          year: 'Year',
          month: 'Month',
          apply: 'Apply Filter',
          months: {
            1: 'January',
            2: 'February',
            3: 'March',
            4: 'April',
            5: 'May',
            6: 'June',
            7: 'July',
            8: 'August',
            9: 'September',
            10: 'October',
            11: 'November',
            12: 'December'
          }
        }
      },
      expenses: {
        title: 'Expenses',
        addNew: 'Add New Expense',
        menu: {
          income: 'Income',
          expense: 'Expense',
          addNewIncome: 'Add New Income',
          addNewExpense: 'Add New Expense'
        },
        categories: {
          // Category Groups
          billsAndIncome: 'Bills & Income',
          otherIncome: 'Other Income',
          billsAndUtilities: 'Bills & Utilities',
          healthAndFitness: 'Health & Fitness',
          foodAndShopping: 'Food & Shopping',

          // Income Categories
          salary: 'Salary',
          freelance: 'Freelance',
          investments: 'Investments',
          rental: 'Rental',
          gifts: 'Gifts',
          refunds: 'Refunds',
          lottery: 'Lottery',
          other: 'Other',

          // Expense Categories - Bills & Utilities
          phone: 'Phone Bill',
          water: 'Water Bill',
          gas: 'Gas Bill',
          internet: 'Internet Bill',
          rent: 'Rent',
          tv: 'TV',

          // Expense Categories - Health & Fitness
          run: 'Run',
          doctor: 'Doctor',
          medicine: 'Medicine',
          exercise: 'Exercise',
          cycling: 'Cycling',
          swim: 'Swim',

          // Expense Categories - Food & Shopping
          grocery: 'Grocery',
          coffee: 'Tea & Coffee',
          drinks: 'Drinks',
          restaurants: 'Restaurants'
        },
        form: {
          amount: 'Amount',
          category: 'Category',
          description: 'Description',
          date: 'Date',
          regularExpense: 'Regular Expense',
          regularExpenseHint: 'Mark this as a recurring expense',
          regularIncome: 'Regular Income',
          regularIncomeHint: 'Mark this as a recurring income',
          regularPeriod: {
            title: 'Recurrence Period',
            weekly: 'Weekly',
            monthly: 'Monthly',
            quarterly: 'Quarterly',
            yearly: 'Yearly'
          }
        },
        filter: {
          sortBy: 'Sort by',
          dateDesc: 'Latest first',
          dateAsc: 'Oldest first',
          amountDesc: 'Highest amount',
          amountAsc: 'Lowest amount',
          dateRange: {
            all: 'All time',
            today: 'Today',
            week: 'This week',
            month: 'This month',
            year: 'This year'
          }
        }
      },
      profile: {
        title: 'Profile',
        menu: {
          notifications: {
            title: 'Notifications',
            subtitle: 'Manage your notification preferences'
          },
          language: {
            title: 'Language',
            subtitle: 'Change language'
          },
          paymentMethods: {
            title: 'Payment Methods',
            subtitle: 'Manage your payment options'
          },
          emailPreferences: {
            title: 'Email Preferences',
            subtitle: 'Manage your email settings'
          },
          settings: {
            title: 'Settings',
            subtitle: 'App preferences and more'
          }
        }
      },
      reminders: {
        title: 'Reminders',
        onTheDay: 'On the day',
        dayBefore: '1 day before',
        weekBefore: '1 week before',
        daysBeforeFormat: '3 days before',
        notificationTypes: {
          title: 'Notification Types',
          push: 'Push Notification',
          email: 'Email Notification',
          viaFormat: {
            pushAndEmail: 'via Push & Email',
            pushOnly: 'via Push',
            emailOnly: 'via Email'
          }
        }
      }
    }
  },
  tr: {
    translation: {
      common: {
        save: 'Kaydet',
        cancel: 'İptal',
        add: 'Ekle',
        edit: 'Düzenle',
        delete: 'Sil',
        search: 'Ara',
        filter: 'Filtrele',
        apply: 'Uygula',
        back: 'Geri',
        new: 'Yeni',
        comingSoon: 'Çok Yakında',
        refresh: 'Yenile',
        setDate: 'Tarih Seç',
        setReminder: 'Hatırlatıcı Ekle',
        loading: 'Yükleniyor...'
      },
      navigation: {
        dashboard: 'Ana Sayfa',
        expenses: 'Harcamalar',
        profile: 'Profil',
      },
      dashboard: {
        title: 'Ana Sayfa',
        welcome: 'Hoşgeldin',
        stats: {
          totalBalance: {
            title: 'Toplam Bakiye',
          },
          totalIncome: {
            title: 'Toplam Gelir',
          },
          totalExpenses: {
            title: 'Toplam Gider',
          },
          regularExpenses: {
            title: 'Düzenli Giderler',
          },
        },
        recentTransactions: 'Son İşlemler',
        emptyState: {
          title: 'Henüz işlem yok',
          description: 'Finansal durumunuzu takip etmek için gelir ve giderlerinizi eklemeye başlayın'
        },
        filter: {
          period: 'Dönem',
          total: 'Toplam',
          monthly: 'Aylık',
          year: 'Yıl',
          month: 'Ay',
          apply: 'Filtreyi Uygula',
          months: {
            1: 'Ocak',
            2: 'Şubat',
            3: 'Mart',
            4: 'Nisan',
            5: 'Mayıs',
            6: 'Haziran',
            7: 'Temmuz',
            8: 'Ağustos',
            9: 'Eylül',
            10: 'Ekim',
            11: 'Kasım',
            12: 'Aralık'
          }
        }
      },
      expenses: {
        title: 'Harcamalar',
        addNew: 'Yeni Harcama Ekle',
        menu: {
          income: 'Gelir',
          expense: 'Gider',
          addNewIncome: 'Yeni Gelir Ekle',
          addNewExpense: 'Yeni Gider Ekle'
        },
        categories: {
          // Category Groups
          billsAndIncome: 'Faturalar & Gelir',
          otherIncome: 'Diğer Gelirler',
          billsAndUtilities: 'Faturalar & Ödemeler',
          healthAndFitness: 'Sağlık & Spor',
          foodAndShopping: 'Yemek & Alışveriş',

          // Income Categories
          salary: 'Maaş',
          freelance: 'Serbest Çalışma',
          investments: 'Yatırımlar',
          rental: 'Kira Geliri',
          gifts: 'Hediyeler',
          refunds: 'İadeler',
          lottery: 'Şans Oyunları',
          other: 'Diğer',

          // Expense Categories - Bills & Utilities
          phone: 'Telefon Faturası',
          water: 'Su Faturası',
          gas: 'Doğalgaz Faturası',
          internet: 'İnternet Faturası',
          rent: 'Kira',
          tv: 'TV',

          // Expense Categories - Health & Fitness
          run: 'Koşu',
          doctor: 'Doktor',
          medicine: 'İlaç',
          exercise: 'Egzersiz',
          cycling: 'Bisiklet',
          swim: 'Yüzme',

          // Expense Categories - Food & Shopping
          grocery: 'Market',
          coffee: 'Çay & Kahve',
          drinks: 'İçecekler',
          restaurants: 'Restoranlar'
        },
        form: {
          amount: 'Tutar',
          category: 'Kategori',
          description: 'Açıklama',
          date: 'Tarih',
          regularExpense: 'Düzenli Gider',
          regularExpenseHint: 'Bu gideri düzenli gider olarak işaretle',
          regularIncome: 'Düzenli Gelir',
          regularIncomeHint: 'Bu geliri düzenli gelir olarak işaretle',
          regularPeriod: {
            title: 'Tekrar Periyodu',
            weekly: 'Haftalık',
            monthly: 'Aylık',
            quarterly: '3 Aylık',
            yearly: 'Yıllık'
          }
        },
        filter: {
          sortBy: 'Sıralama',
          dateDesc: 'En yeni',
          dateAsc: 'En eski',
          amountDesc: 'En yüksek tutar',
          amountAsc: 'En düşük tutar',
          dateRange: {
            all: 'Tüm zamanlar',
            today: 'Bugün',
            week: 'Bu hafta',
            month: 'Bu ay',
            year: 'Bu yıl'
          }
        }
      },
      profile: {
        title: 'Profil',
        menu: {
          notifications: {
            title: 'Bildirimler',
            subtitle: 'Bildirim tercihlerini yönet'
          },
          language: {
            title: 'Dil',
            subtitle: 'Dil değiştir'
          },
          paymentMethods: {
            title: 'Ödeme Yöntemleri',
            subtitle: 'Ödeme seçeneklerini yönet'
          },
          emailPreferences: {
            title: 'E-posta Tercihleri',
            subtitle: 'E-posta ayarlarını yönet'
          },
          settings: {
            title: 'Ayarlar',
            subtitle: 'Uygulama tercihleri ve daha fazlası'
          }
        }
      },
      reminders: {
        title: 'Hatırlatıcılar',
        onTheDay: 'Aynı gün',
        dayBefore: '1 gün önce',
        weekBefore: '1 hafta önce',
        daysBeforeFormat: '3 gün önce',
        notificationTypes: {
          title: 'Bildirim Türleri',
          push: 'Push Bildirimi',
          email: 'E-posta Bildirimi',
          viaFormat: {
            pushAndEmail: 'Push ve E-posta ile',
            pushOnly: 'Push ile',
            emailOnly: 'E-posta ile'
          }
        }
      }
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('preferredLanguage') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

console.log('Current i18n language:', i18n.language)

export default i18n 