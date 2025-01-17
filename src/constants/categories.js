export const INCOME_CATEGORIES = [
  {
    id: 'salary',
    name: 'Salary',
    icon: '💰',
    group: 'regular'
  },
  {
    id: 'freelance',
    name: 'Freelance',
    icon: '💻',
    group: 'regular'
  },
  {
    id: 'investments',
    name: 'Investments',
    icon: '📈',
    group: 'investments'
  },
  {
    id: 'rental',
    name: 'Rental',
    icon: '🏠',
    group: 'investments'
  },
  {
    id: 'gifts',
    name: 'Gifts',
    icon: '🎁',
    group: 'other'
  },
  {
    id: 'refunds',
    name: 'Refunds',
    icon: '💸',
    group: 'other'
  },
  {
    id: 'lottery',
    name: 'Lottery',
    icon: '🎰',
    group: 'other'
  },
  {
    id: 'other',
    name: 'Other',
    icon: '📝',
    group: 'other'
  }
];

export const EXPENSE_CATEGORIES = [
  // Bills & Utilities
  {
    id: 'rent',
    name: 'Rent',
    icon: '🏠',
    group: 'bills'
  },
  {
    id: 'phone',
    name: 'Phone Bill',
    icon: '📱',
    group: 'bills'
  },
  {
    id: 'water',
    name: 'Water Bill',
    icon: '💧',
    group: 'bills'
  },
  {
    id: 'gas',
    name: 'Gas Bill',
    icon: '🔥',
    group: 'bills'
  },
  {
    id: 'internet',
    name: 'Internet Bill',
    icon: '🌐',
    group: 'bills'
  },
  {
    id: 'tv',
    name: 'TV',
    icon: '📺',
    group: 'bills'
  },

  // Food & Shopping
  {
    id: 'grocery',
    name: 'Grocery',
    icon: '🛒',
    group: 'food'
  },
  {
    id: 'restaurants',
    name: 'Restaurants',
    icon: '🍽️',
    group: 'food'
  },
  {
    id: 'coffee',
    name: 'Tea & Coffee',
    icon: '☕',
    group: 'food'
  },
  {
    id: 'drinks',
    name: 'Drinks',
    icon: '🥤',
    group: 'food'
  },

  // Health & Fitness
  {
    id: 'doctor',
    name: 'Doctor',
    icon: '👨‍⚕️',
    group: 'health'
  },
  {
    id: 'medicine',
    name: 'Medicine',
    icon: '💊',
    group: 'health'
  },
  {
    id: 'exercise',
    name: 'Exercise',
    icon: '🏋️‍♂️',
    group: 'health'
  },
  {
    id: 'run',
    name: 'Run',
    icon: '🏃‍♂️',
    group: 'health'
  },
  {
    id: 'cycling',
    name: 'Cycling',
    icon: '🚴‍♂️',
    group: 'health'
  },
  {
    id: 'swim',
    name: 'Swim',
    icon: '🏊‍♂️',
    group: 'health'
  },

  // Other
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎮',
    group: 'other'
  },
  {
    id: 'education',
    name: 'Education',
    icon: '📚',
    group: 'other'
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: '🛍️',
    group: 'other'
  },
  {
    id: 'transportation',
    name: 'Transportation',
    icon: '🚗',
    group: 'other'
  },
  {
    id: 'other',
    name: 'Other',
    icon: '📝',
    group: 'other'
  }
];

export const CATEGORY_GROUPS = {
  income: {
    regular: {
      id: 'regular',
      name: 'Regular Income',
      icon: '💰'
    },
    investments: {
      id: 'investments',
      name: 'Investments',
      icon: '📈'
    },
    other: {
      id: 'other',
      name: 'Other Income',
      icon: '📝'
    }
  },
  expense: {
    bills: {
      id: 'bills',
      name: 'Bills & Utilities',
      icon: '📄'
    },
    food: {
      id: 'food',
      name: 'Food & Shopping',
      icon: '🍽️'
    },
    health: {
      id: 'health',
      name: 'Health & Fitness',
      icon: '🏥'
    },
    other: {
      id: 'other',
      name: 'Other Expenses',
      icon: '📝'
    }
  }
}; 