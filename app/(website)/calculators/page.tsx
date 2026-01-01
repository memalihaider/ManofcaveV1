'use client'

import { useState, useEffect } from 'react'
import { CalculatorIcon, CurrencyDollarIcon, PercentBadgeIcon, ClockIcon } from '@heroicons/react/24/outline'

export default function MortgageCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(2500000)
  const [interestRate, setInterestRate] = useState(8.5)
  const [loanTerm, setLoanTerm] = useState(20)
  const [downPayment, setDownPayment] = useState(500000)
  const [currency, setCurrency] = useState('AED')

  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalPayment, setTotalPayment] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)

  useEffect(() => {
    calculateMortgage()
  }, [loanAmount, interestRate, loanTerm, downPayment, currency])

  const calculateMortgage = () => {
    const principal = loanAmount - downPayment
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12

    if (principal <= 0 || monthlyRate <= 0 || numberOfPayments <= 0) {
      setMonthlyPayment(0)
      setTotalPayment(0)
      setTotalInterest(0)
      return
    }

    const monthlyPaymentCalc = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    const totalPaymentCalc = monthlyPaymentCalc * numberOfPayments
    const totalInterestCalc = totalPaymentCalc - principal

    setMonthlyPayment(Math.round(monthlyPaymentCalc))
    setTotalPayment(Math.round(totalPaymentCalc))
    setTotalInterest(Math.round(totalInterestCalc))
  }

  const formatCurrency = (amount: number) => {
    const currencyConfig = {
      AED: { locale: 'en-AE', currency: 'AED' },
      USD: { locale: 'en-US', currency: 'USD' },
      EUR: { locale: 'en-EU', currency: 'EUR' },
      GBP: { locale: 'en-GB', currency: 'GBP' },
      PKR: { locale: 'en-PK', currency: 'PKR' }
    }

    const config = currencyConfig[currency as keyof typeof currencyConfig] || currencyConfig.AED

    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const presetScenarios = [
    { name: 'First Home', amount: 2000000, downPayment: 400000, rate: 8.5, term: 20 },
    { name: 'Family Home', amount: 5000000, downPayment: 1000000, rate: 8.0, term: 25 },
    { name: 'Luxury Property', amount: 15000000, downPayment: 3000000, rate: 7.5, term: 30 },
    { name: 'Investment Property', amount: 8000000, downPayment: 1600000, rate: 9.0, term: 15 }
  ]

  const applyScenario = (scenario: typeof presetScenarios[0]) => {
    setLoanAmount(scenario.amount)
    setDownPayment(scenario.downPayment)
    setInterestRate(scenario.rate)
    setLoanTerm(scenario.term)
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Mortgage <span className="text-[#d4af37]">Calculator</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#a3a3a3] max-w-3xl mx-auto leading-relaxed">
              Calculate your monthly mortgage payments and understand the true cost
              of your home loan with our comprehensive mortgage calculator.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Calculator Inputs */}
          <div className="space-y-8">
            <div className="bg-[#141414] rounded-lg border border-[#333333] p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <CalculatorIcon className="h-6 w-6 text-[#d4af37] mr-3" />
                Loan Details
              </h2>

              {/* Currency Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-3 bg-[#262626] border border-[#333333] rounded-lg text-[#f5f5f5] focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                >
                  <option value="AED">AED - UAE Dirham</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="PKR">PKR - Pakistani Rupee</option>
                </select>
              </div>

              {/* Property Price */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">
                  Property Price ({currency})
                </label>
                <div className="relative">
                  <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#a3a3a3]" />
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-[#262626] border border-[#333333] rounded-lg text-[#f5f5f5] focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                    min="0"
                  />
                </div>
                <div className="mt-2 text-sm text-[#a3a3a3]">
                  Range: {formatCurrency(500000)} - {formatCurrency(50000000)}
                </div>
              </div>

              {/* Down Payment */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">
                  Down Payment ({currency})
                </label>
                <div className="relative">
                  <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#a3a3a3]" />
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-[#262626] border border-[#333333] rounded-lg text-[#f5f5f5] focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                    min="0"
                  />
                </div>
                <div className="mt-2 text-sm text-[#a3a3a3]">
                  Minimum: 20% of property price ({formatCurrency(loanAmount * 0.2)})
                </div>
              </div>

              {/* Interest Rate */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">
                  Interest Rate (%)
                </label>
                <div className="relative">
                  <PercentBadgeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#a3a3a3]" />
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    step="0.1"
                    className="w-full pl-10 pr-4 py-3 bg-[#262626] border border-[#333333] rounded-lg text-[#f5f5f5] focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                    min="0"
                    max="20"
                  />
                </div>
                <div className="mt-2 text-sm text-[#a3a3a3]">
                  Current market rates: 7.5% - 9.5%
                </div>
              </div>

              {/* Loan Term */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">
                  Loan Term (Years)
                </label>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#a3a3a3]" />
                  <select
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-[#262626] border border-[#333333] rounded-lg text-[#f5f5f5] focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                  >
                    <option value="5">5 years</option>
                    <option value="10">10 years</option>
                    <option value="15">15 years</option>
                    <option value="20">20 years</option>
                    <option value="25">25 years</option>
                    <option value="30">30 years</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Preset Scenarios */}
            <div className="bg-[#141414] rounded-lg border border-[#333333] p-8">
              <h3 className="text-xl font-bold mb-4">Quick Scenarios</h3>
              <div className="grid grid-cols-2 gap-3">
                {presetScenarios.map((scenario, index) => (
                  <button
                    key={index}
                    onClick={() => applyScenario(scenario)}
                    className="p-3 bg-[#262626] hover:bg-[#333333] rounded-lg border border-[#333333] text-left transition-colors"
                  >
                    <div className="font-medium text-[#f5f5f5]">{scenario.name}</div>
                    <div className="text-sm text-[#a3a3a3]">
                      {formatCurrency(scenario.amount)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-8">
            {/* Monthly Payment */}
            <div className="bg-[#141414] rounded-lg border border-[#333333] p-8">
              <h3 className="text-xl font-bold mb-6">Monthly Payment</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#d4af37] mb-2">
                  {formatCurrency(monthlyPayment)}
                </div>
                <div className="text-[#a3a3a3]">per month</div>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="bg-[#141414] rounded-lg border border-[#333333] p-8">
              <h3 className="text-xl font-bold mb-6">Payment Breakdown</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-[#333333]">
                  <span className="text-[#a3a3a3]">Loan Amount</span>
                  <span className="font-semibold">{formatCurrency(loanAmount - downPayment)}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-[#333333]">
                  <span className="text-[#a3a3a3]">Down Payment</span>
                  <span className="font-semibold">{formatCurrency(downPayment)}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-[#333333]">
                  <span className="text-[#a3a3a3]">Total Interest</span>
                  <span className="font-semibold text-red-400">{formatCurrency(totalInterest)}</span>
                </div>

                <div className="flex justify-between items-center py-3">
                  <span className="text-[#f5f5f5] font-medium">Total Payment</span>
                  <span className="font-bold text-[#d4af37]">{formatCurrency(totalPayment)}</span>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-[#141414] rounded-lg border border-[#333333] p-8">
              <h3 className="text-xl font-bold mb-6">Important Notes</h3>

              <div className="space-y-4 text-sm text-[#a3a3a3]">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                  <p>This calculator provides estimates only. Actual payments may vary based on your credit score and lender terms.</p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                  <p>Most Pakistani banks require a minimum 20% down payment for home loans.</p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                  <p>Interest rates are subject to change. Current rates shown are approximate.</p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                  <p>This calculation does not include property taxes, insurance, or maintenance costs.</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-[#d4af37]/20 to-[#d4af37]/5 rounded-lg border border-[#d4af37]/30 p-8 text-center">
              <h3 className="text-xl font-bold mb-4">Ready to Apply?</h3>
              <p className="text-[#a3a3a3] mb-6">
                Get pre-approved for your mortgage and find the best rates available.
              </p>
              <button className="bg-[#d4af37] hover:bg-[#b8941f] text-[#1a1a1a] font-semibold px-8 py-3 rounded-lg transition-colors">
                Get Pre-Approved
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}