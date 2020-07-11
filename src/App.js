import React, { useEffect, useState } from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow.js'

const URL  = 'https://api.exchangeratesapi.io/latest'

const App = () => {
  const [curList, setCurList] = useState([]);
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountFrom, setAmountFrom] = useState(true)

  let toAmount, fromAmount

  toAmount = amountFrom ? amount * exchangeRate || 0 : amount
  fromAmount = amountFrom ? amount : amount / exchangeRate

  useEffect(() => {
    fetch(URL)
      .then(res => res.json())
      .then(data => {
        const currency = Object.keys(data.rates)[0]
        setCurList([data.base, ...Object.keys(data.rates)])
        setFromCurrency(data.base)
        setToCurrency(currency)
        setExchangeRate(data.rates[currency])
      })
  }, []);

  const handleFromAmountChange = e => {
      setAmount(e.target.value)
      setAmountFrom(true)
  }

  const handleToAmountChange = e => {
    setAmount(e.target.value)
    setAmountFrom(false)
  }

  useEffect(() => {
    if (fromCurrency && toCurrency) {
    fetch(`${URL}?base=${fromCurrency}&symbols=${toCurrency}`)
    .then(res => res.json())
    .then(data => setExchangeRate(data.rates[toCurrency]))
    }
    
  },[fromCurrency, toCurrency])

  return (
    <>
      <h1>Converter</h1>
      <CurrencyRow 
        curList={curList}
        selectedCurrency={fromCurrency}
        onChangeCurrency={e => setFromCurrency(e.target.value)}
        amount={fromAmount}
        onChangeAmount={handleFromAmountChange}
      />
      <div className="equals">=</div>
      <CurrencyRow 
        curList={curList}
        selectedCurrency={toCurrency}
        onChangeCurrency={e => setToCurrency(e.target.value)}
        amount={toAmount}
        onChangeAmount={handleToAmountChange}
      />
    </>
  );
}

export default App;
