import React, { useState } from 'react';
import BarcodeSearch from './components/barCodeSearch';
import HeldInvoices from './components/HeldInvoices';
import ReOrderManagement from './components/ReOrderManagement';
import  SettlementTable from './components/receivedPayments'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { InvoiceProvider } from './components/InvoiceContext'; // Import the provider

import './App.css';
import { BrowserRouter, Switch } from 'react-router-dom';


const App = () => {
  const [token, setToken] = useState();
  const [barcode, setBarcode] = useState('');
  
  return (
    <InvoiceProvider>
    <Router>
      <Routes>
        <Route path="/" element={<BarcodeSearch />} />
        <Route path="/held-invoices" element={<HeldInvoices />} />
        <Route path= "/re-order-management" element={<ReOrderManagement />} />
        <Route path="/received-payments" element={<SettlementTable />} />
     
      </Routes>
    </Router>
    </InvoiceProvider>
  );
};

export default App;
