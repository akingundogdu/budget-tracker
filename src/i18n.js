import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      common: {
        save: 'Save',
        saving: 'Saving...',
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
        loading: 'Loading...',
        auth: {
          login: {
            title: 'Login',
            email: 'Email',
            password: 'Password',
            submit: 'Login',
            forgotPassword: 'Forgot Password?',
            noAccount: 'Don\'t have an account?',
            signUp: 'Sign up'
          },
          register: {
            title: 'Register',
            email: 'Email',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            submit: 'Register',
            hasAccount: 'Already have an account?',
            signIn: 'Sign in',
            verificationEmailSent: 'Please check your email to verify your account'
          },
          forgotPassword: {
            title: 'Reset your password',
            description: 'Enter your email address and we\'ll send you a link to reset your password.',
            submit: 'Send reset link',
            success: 'If an account exists with that email, we\'ve sent a password reset link.',
            backToLogin: 'Back to login'
          },
          validation: {
            emailRequired: 'Email is required',
            emailInvalid: 'Please enter a valid email',
            passwordRequired: 'Password is required',
            passwordMinLength: 'Password must be at least 6 characters',
            passwordMatch: 'Passwords must match'
          }
        },
        confirm: 'Confirm'
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
        noTransactions: 'No transactions found',
        budgetSpent: 'of the budget spent',
        monthlyIncome: 'Monthly Income',
        loadMore: 'Load More',
        emptyState: {
          title: 'No transactions yet',
          description: 'Start tracking your finances by adding your first transaction'
        },
        categories: {
          // Category Groups
          regular: 'Regular Income',
          investments: 'Investments',
          other: 'Other',
          bills: 'Bills & Utilities',
          food: 'Food & Shopping',
          health: 'Health & Fitness',

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
          rent: 'Rent',
          phone: 'Phone Bill',
          water: 'Water Bill',
          gas: 'Gas Bill',
          internet: 'Internet Bill',
          tv: 'TV',

          // Expense Categories - Food & Shopping
          grocery: 'Grocery',
          restaurants: 'Restaurants',
          coffee: 'Tea & Coffee',
          drinks: 'Drinks',

          // Expense Categories - Health & Fitness
          doctor: 'Doctor',
          medicine: 'Medicine',
          exercise: 'Exercise',
          run: 'Run',
          cycling: 'Cycling',
          swim: 'Swim',

          // Other Expense Categories
          entertainment: 'Entertainment',
          education: 'Education',
          shopping: 'Shopping',
          transportation: 'Transportation'
        },
        form: {
          amount: 'Amount',
          category: 'Category',
          description: 'Description',
          descriptionPlaceholder: 'Enter custom category name (optional)',
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
        },
        deleteTitle: 'Delete Transaction',
        deleteButton: 'Delete',
        deleteConfirmation: 'Are you sure you want to delete {{type}} transaction of {{amount}}?',
        deleteSuccess: 'Transaction deleted successfully',
        deleteError: 'Failed to delete transaction'
      },
      profile: {
        title: 'Profile',
        defaultName: 'User',
        menu: {
          fullName: {
            title: 'Full Name',
            label: 'Your full name',
            placeholder: 'Enter your full name',
            setName: 'Set your name'
          },
          username: {
            title: 'Username',
            label: 'Your username',
            placeholder: 'Enter your username',
            setUsername: 'Set your username'
          },
          password: {
            title: 'Change Password',
            subtitle: 'Update your password',
            current: 'Current Password',
            new: 'New Password',
            confirm: 'Confirm New Password',
            currentPlaceholder: 'Enter current password',
            newPlaceholder: 'Enter new password',
            confirmPlaceholder: 'Confirm new password'
          },
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
          },
          logout: 'Logout',
          logoutSubtitle: 'Sign out from your account',
          feedback: {
            title: 'Send Feedback',
            subtitle: 'Help us improve your experience',
            fullName: 'Full Name',
            fullNamePlaceholder: 'Enter your full name',
            email: 'Email',
            emailPlaceholder: 'Enter your email',
            message: 'Your Feedback',
            messagePlaceholder: 'Tell us what you think about the app...',
            submit: 'Submit Feedback'
          }
        },
        notifications: {
          nameUpdated: 'Your name has been updated successfully',
          usernameUpdated: 'Your username has been updated successfully',
          passwordUpdated: 'Your password has been updated successfully',
          feedbackSubmitted: 'Thank you for your feedback!'
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
        saving: 'Kaydediliyor...',
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
        setReminder: 'Hatırlatıcı Ayarla',
        loading: 'Yükleniyor...',
        auth: {
          login: {
            title: 'Giriş',
            email: 'E-posta',
            password: 'Şifre',
            submit: 'Giriş Yap',
            forgotPassword: 'Şifremi Unuttum?',
            noAccount: 'Hesabınız yok mu?',
            signUp: 'Kayıt ol'
          },
          register: {
            title: 'Kayıt',
            email: 'E-posta',
            password: 'Şifre',
            confirmPassword: 'Şifre Tekrar',
            submit: 'Kayıt Ol',
            hasAccount: 'Zaten hesabınız var mı?',
            signIn: 'Giriş yap',
            verificationEmailSent: 'Lütfen hesabınızı doğrulamak için e-postanızı kontrol edin'
          },
          forgotPassword: {
            title: 'Şifreni sıfırla',
            description: 'E-posta adresini gir ve sana şifre sıfırlama bağlantısı gönderelim.',
            submit: 'Sıfırlama bağlantısı gönder',
            success: 'Bu e-posta ile bir hesap varsa, şifre sıfırlama bağlantısı gönderdik.',
            backToLogin: 'Giriş sayfasına dön'
          },
          validation: {
            emailRequired: 'E-posta zorunludur',
            emailInvalid: 'Geçerli bir e-posta adresi giriniz',
            passwordRequired: 'Şifre zorunludur',
            passwordMinLength: 'Şifre en az 6 karakter olmalıdır',
            passwordMatch: 'Şifreler eşleşmiyor'
          }
        },
        confirm: 'Onayla'
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
        noTransactions: 'İşlem bulunamadı',
        budgetSpent: 'bütçeden harcandı',
        monthlyIncome: 'Aylık Gelir',
        loadMore: 'Daha Fazla',
        emptyState: {
          title: 'Henüz işlem yok',
          description: 'İlk işleminizi ekleyerek finansal takibinize başlayın'
        },
        categories: {
          // Category Groups
          regular: 'Düzenli Gelir',
          investments: 'Yatırımlar',
          other: 'Diğer',
          bills: 'Faturalar & Ödemeler',
          food: 'Yemek & Alışveriş',
          health: 'Sağlık & Spor',

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
          rent: 'Kira',
          phone: 'Telefon Faturası',
          water: 'Su Faturası',
          gas: 'Doğalgaz Faturası',
          internet: 'İnternet Faturası',
          tv: 'TV',

          // Expense Categories - Food & Shopping
          grocery: 'Market',
          restaurants: 'Restoranlar',
          coffee: 'Çay & Kahve',
          drinks: 'İçecekler',

          // Expense Categories - Health & Fitness
          doctor: 'Doktor',
          medicine: 'İlaç',
          exercise: 'Egzersiz',
          run: 'Koşu',
          cycling: 'Bisiklet',
          swim: 'Yüzme',

          // Other Expense Categories
          entertainment: 'Eğlence',
          education: 'Eğitim',
          shopping: 'Alışveriş',
          transportation: 'Ulaşım'
        },
        form: {
          amount: 'Tutar',
          category: 'Kategori',
          description: 'Açıklama',
          descriptionPlaceholder: 'Özel kategori adı girin (opsiyonel)',
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
        },
        deleteTitle: 'İşlemi Sil',
        deleteButton: 'Sil',
        deleteConfirmation: '{{amount}} tutarındaki {{type}} işlemini silmek istediğinize emin misiniz?',
        deleteSuccess: 'İşlem başarıyla silindi',
        deleteError: 'İşlem silinirken bir hata oluştu'
      },
      profile: {
        title: 'Profil',
        defaultName: 'Kullanıcı',
        menu: {
          fullName: {
            title: 'Ad Soyad',
            label: 'Adınız ve soyadınız',
            placeholder: 'Adınızı ve soyadınızı girin',
            setName: 'İsminizi belirleyin'
          },
          username: {
            title: 'Kullanıcı Adı',
            label: 'Kullanıcı adınız',
            placeholder: 'Kullanıcı adınızı girin',
            setUsername: 'Kullanıcı adı belirleyin'
          },
          password: {
            title: 'Şifre Değiştir',
            subtitle: 'Şifrenizi güncelleyin',
            current: 'Mevcut Şifre',
            new: 'Yeni Şifre',
            confirm: 'Yeni Şifre Tekrar',
            currentPlaceholder: 'Mevcut şifrenizi girin',
            newPlaceholder: 'Yeni şifrenizi girin',
            confirmPlaceholder: 'Yeni şifrenizi tekrar girin'
          },
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
          },
          logout: 'Çıkış Yap',
          logoutSubtitle: 'Hesabından çıkış yap',
          feedback: {
            title: 'Geri Bildirim Gönder',
            subtitle: 'Deneyiminizi iyileştirmemize yardımcı olun',
            fullName: 'Ad Soyad',
            fullNamePlaceholder: 'Adınızı ve soyadınızı girin',
            email: 'E-posta',
            emailPlaceholder: 'E-posta adresinizi girin',
            message: 'Geri Bildiriminiz',
            messagePlaceholder: 'Uygulama hakkında ne düşündüğünüzü bize anlatın...',
            submit: 'Gönder'
          }
        },
        notifications: {
          nameUpdated: 'İsminiz başarıyla güncellendi',
          usernameUpdated: 'Kullanıcı adınız başarıyla güncellendi',
          passwordUpdated: 'Şifreniz başarıyla güncellendi',
          feedbackSubmitted: 'Geri bildiriminiz için teşekkür ederiz!'
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