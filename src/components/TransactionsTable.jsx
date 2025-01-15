import { useLanguage } from '../contexts/LanguageContext'

function TransactionsTable() {
  const { t, formatMoney } = useLanguage()
  
  const transactions = [
    { id: 1, customer: 'John Doe', amount: 250.00, status: 'completed', date: '2/20/2024' },
    { id: 2, customer: 'Jane Smith', amount: 1250.00, status: 'processing', date: '2/19/2024' },
    { id: 3, customer: 'Bob Johnson', amount: 350.00, status: 'completed', date: '2/18/2024' },
    { id: 4, customer: 'Alice Brown', amount: 750.00, status: 'failed', date: '2/17/2024' },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="pb-4">{t('dashboard.table.customer')}</th>
            <th className="pb-4">{t('dashboard.table.amount')}</th>
            <th className="pb-4">{t('dashboard.table.status')}</th>
            <th className="pb-4">{t('dashboard.table.date')}</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-t">
              <td className="py-4">{transaction.customer}</td>
              <td className="py-4">{formatMoney(transaction.amount)}</td>
              <td className="py-4">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
                  {t(`dashboard.status.${transaction.status}`)}
                </span>
              </td>
              <td className="py-4">{transaction.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TransactionsTable 