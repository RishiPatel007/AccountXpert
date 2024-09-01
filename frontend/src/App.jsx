import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Pages/Home';
import Nav from './Pages/Nav';
import Login from './Pages/Login';
import SignUp from './Pages/Signup';
import Invoice from './Pages/Invoice';
import Clients from './Pages/Clients';
import Products from './Pages/Products';
import Stats from './Pages/Stats';
import CreateInvoice from './Pages/Invoice_Components/CreateInvoice';
import ShowInvoice from './Pages/Invoice_Components/ShowInvoice';
import UpdateInvoice from './Pages/Invoice_Components/UpdateInvoice';
function App() {
  return (
    <Router>
      <>
        <Nav/>
        <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/signup' element={<SignUp />}></Route>
            <Route path='/invoice' element={<Invoice />}></Route>
            <Route path='/invoice/create-invoice' element={<CreateInvoice />}></Route>
            <Route path="/invoice/show-invoice/:id" element={<ShowInvoice />} />
            <Route path="/invoice/update-invoice/:id" element={<UpdateInvoice />} />
            <Route path='/clients' element={<Clients />}></Route>
            <Route path='/products' element={<Products />}></Route>
            <Route path='/stats' element={<Stats />}></Route>
        </Routes>
      </>
    </Router>
  );
}

export default App;
