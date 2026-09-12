export function createAcademyFinance() {
    return {
        balance: 0,

        revenue: {
            tuition: 0,
            privateLessons: 0,
            camps: 0,
            sponsorship: 0,
            events: 0,
            other: 0
        },

        expenses: {
            rent: 0,
            utilities: 0,
            payroll: 0,
            maintenance: 0,
            equipment: 0,
            marketing: 0,
            taxes: 0,
            other: 0
        },

        history: [],
        monthlyProfit: 0
    };
}

export function addAcademyRevenue(
    finance,
    category,
    amount,
    description = ""
) {
    if (finance.revenue[category] === undefined) {
        finance.revenue[category] = 0;
    }

    finance.revenue[category] += amount;
    finance.balance += amount;

    finance.history.push({
        type: "revenue",
        category,
        amount,
        description,
        date: null
    });

    return finance;
}

export function addAcademyExpense(
    finance,
    category,
    amount,
    description = ""
) {
    if (finance.expenses[category] === undefined) {
        finance.expenses[category] = 0;
    }

    finance.expenses[category] += amount;
    finance.balance -= amount;

    finance.history.push({
        type: "expense",
        category,
        amount,
        description,
        date: null
    });

    return finance;
}

export function calculateAcademyRevenue(finance) {
    return Object.values(finance.revenue)
        .reduce((sum, value) => sum + value, 0);
}

export function calculateAcademyExpenses(finance) {
    return Object.values(finance.expenses)
        .reduce((sum, value) => sum + value, 0);
}

export function calculateAcademyProfit(finance) {
    return (
        calculateAcademyRevenue(finance) -
        calculateAcademyExpenses(finance)
    );
}

export function processAcademyFinance(
    academy,
    finance,
    students = [],
    staff = []
) {
    const tuition = students
        .filter(student => student.active && student.paid)
        .reduce(
            (sum, student) => sum + student.monthlyFee,
            0
        );

    const payroll = staff
        .filter(member => member.active)
        .reduce(
            (sum, member) => sum + member.salary,
            0
        );

    addAcademyRevenue(
        finance,
        "tuition",
        tuition,
        "Mensalidades"
    );

    addAcademyExpense(
        finance,
        "payroll",
        payroll,
        "Folha de pagamento"
    );

    finance.monthlyProfit =
        calculateAcademyProfit(finance);

    academy.finance.balance = finance.balance;
    academy.finance.monthlyRevenue =
        calculateAcademyRevenue(finance);
    academy.finance.monthlyExpenses =
        calculateAcademyExpenses(finance);
    academy.finance.monthlyProfit =
        finance.monthlyProfit;

    return {
        revenue: calculateAcademyRevenue(finance),
        expenses: calculateAcademyExpenses(finance),
        profit: finance.monthlyProfit,
        balance: finance.balance
    };
}
