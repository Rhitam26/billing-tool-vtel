import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import ProdSearchableDropdown from './prodSearch';
// import Select from 'react-select';
import e from 'cors';


// Styled components for layout and styling
const Container = styled.div`
  width: 80%;
  margin: 0 auto;
  margin-top: 50px;
  position: relative;
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
`;


const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  margin-right: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 200px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: #28a745;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
`;

const SubmitButton = styled(Button)`
  background-color: #007bff;
`;

const Table = styled.table`
  background-color: ${(props) => props.theme ? 'white' : 'yellow'};
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  background-color: #f2f2f2;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const EditableInput = styled.input`
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
`;

const DeleteButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TotalRow = styled.tr`
  background-color: #f9f9f9;
  font-weight: bold;
`;

const Dropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 1;
`;

const DropdownItem = styled.li`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f2f2f2;
  }
`;

const SearchContainer = styled.div`
  position: fixed;
  top: 10px;
  left: 10px;
  width: 3000px; /* Adjust the width as needed */
  z-index: 1000; /* Ensure it stays on top of other elements */
  display: flex;
  flex-direction: column;
  align-items: left;
  border: 1px solid 
  edge-radius: 12px;
`;


const CustomerContainer = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  width: 3000px; /* Adjust the width as needed */
  z-index: 1000; /* Ensure it stays on top of other elements */
  display: flex;
  flex-direction: column;
  align-items: right;
  border: 1px solid
  edge-radius: 12px;
`;

const DiscountRow = styled.tr`
  background-color: #f1f1f1;
  font-weight: bold;
`;


const ProductSelecet = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
`;

const HoldInvoicesButton = styled(Button)`
  background-color: #ffc107;
`;

const ReceiptButton = styled(Button)`
  background-color: #28a745;
`;

const ReOrderManagemntButton = styled(Button)`
  background-color: #007bff;
`;

// call the API to get the products






const BarcodeSearch = () => {
  const [barcode, setBarcode] = useState('');
  const [products, setProducts] = useState([]);
  let [totalPrice, setTotalPrice] = useState(0);
  let [selectedOption, setSelectedOption] = useState(null);
  let [options, setOptions] = useState([]);
  let [overallDiscount, setOverallDiscount] = useState(0);
  const [customerName, setCustomerName] = useState('Anonymous#'+Date.now());
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [transactionType, setTransactionType] = useState('Cash');
  const [paymentOption, setPaymentOption] = useState('');
  let [invoiceId, setInvoiceId] = useState('');
  let [submissionType, setSubmissionType] = useState('Fresh');
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // get current unix timestamp
  console.log("PRODUCTS", products);
  const emptyProductRow ={
    id : '',
    name : '',
    price : '',
    quantity : '',
    discount : ''
  }

  useEffect(() => {
    
    console.log('location:', location);

    if (options.length === 0){
      console.log('Fetching options...');
      getOptions();

    }
    if (location.state && location.state.invoiceData){
      const { invoiceData } = location.state;
      console.log('invoiceData:', invoiceData.data.products);
      console.log(products)
      invoiceId = invoiceData.invoiceId;
      setInvoiceId(invoiceId);
      console.log('invoiceId:', invoiceId);

    
      const newProducts = invoiceData.data.products.map((product) => ({
        id : product.id,
        name : product.name,
        price : product.price,
        quantity : product.quantity,
        discount : product.discount,
      }));
      console.log('newProducts:', newProducts);
      setProducts(newProducts);
      sessionStorage.removeItem('invoiceData');
      submissionType = 'Hold';
      setSubmissionType(submissionType);

    }
      
  }, [location.state]);

  const handleTransactionTypeChange = (e) => {
    setTransactionType(e.target.value);
    setPaymentOption(''); // Reset payment option when transaction type changes
  };

  const handlePaymentOptionChange = (e) => {
    setPaymentOption(e.target.value);
  };
  const handleHoldInvoicesClick = () => {
    navigate('/held-invoices');
  };

 
  const handleReOrderManagement = () => {
    navigate('/re-order-management');
  };

  const handleRecievePayments = () => {
    navigate('/received-payments');
  };
  

  sessionStorage.removeItem('invoiceData');



  const handleOverallDiscount = async () => {
    console.log('overallDiscount:', overallDiscount);
    totalPrice = totalPrice - overallDiscount;
    setTotalPrice(totalPrice);
  }
  const fetchSearchResults = async (query) => {
    console.log('query:', query);
    query = query.toLowerCase();
    try {
      const response = await axios.get(
        'https://sheets.googleapis.com/v4/spreadsheets/1YvUhfiX6oBVpl67x7gD4iiChZPis17aNgMVSSEHRak4/values/Sheet1!A:C?key=AIzaSyCCSlM3bNmnEd0CqUbX5C7znDyh2jKFQGU'
      );
  
      const rows = response.data.values;
      console.log('rows:', rows);
      // get the list of products that contains query in either name or id
      // let foundProduct = rows.filter((row) => String(row[0]).includes(query) || String(row[2]).includes(query));
      let foundProduct=[]
      for (let i = 0; i < rows.length; i++) {
        console.log('ID:', rows[i][0]);
        console.log('Name:', rows[i][2]);

        if (String(rows[i][0]).toLowerCase().includes(query) || String(rows[i][2]).toLowerCase().includes(query)){
          foundProduct.push(rows[i]);
        }
      }
      console.log('foundProduct:', foundProduct)
      setSearchResults(foundProduct);
      if (foundProduct)
        console.log('results:', foundProduct);
      else
        console.log('No results found');
      foundProduct ? setSearchResults([foundProduct]) : setSearchResults([]);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };
  
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    // check if the query is undefined or empty
    if (query && query.length > 0) {
      fetchSearchResults(query);
    } else {
      setSearchResults([]);
    } 
  }

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        'https://sheets.googleapis.com/v4/spreadsheets/1YvUhfiX6oBVpl67x7gD4iiChZPis17aNgMVSSEHRak4/values/Sheet1!A:C?key=AIzaSyCCSlM3bNmnEd0CqUbX5C7znDyh2jKFQGU'
      );

      const rows = response.data.values;
      const foundProduct = rows.find((row) => row[0] === barcode);

      if (foundProduct) {
        
        setProducts((prevProducts) => [
          ...prevProducts,
          {
            name: foundProduct[2],
            id : foundProduct[0],
            price: foundProduct[1],
            quantity: 1,
            discount: 0,
          },
          
        ]);
        setBarcode(''); // Clear input after search
        // Calculate the total price

        for (let i = 0; i < products.length; i++) {
          totalPrice += (parseFloat(products[i].price)- parseFloat(products[i].discount)) * parseInt(products[i].quantity);
        }
        setTotalPrice(totalPrice);
        console.log('SearchtotalPrice:', totalPrice);
      } else {
        alert('Product not found!');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = (id) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
  };

  const handleEdit = (id, key, value) => {

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, [key]: value } : product
      )
    );
    // get the latest quantity and price
    let price = products.find((product) => product.id === id).price;
    let quantity = products.find((product) => product.id === id).quantity;
    let discount = products.find((product) => product.id === id).discount;
    let product_total = (parseFloat(price)-parseFloat(discount)) * parseInt(quantity);
    console.log('product_total:', product_total);
    console.log("quantity:", quantity);

    
    let price_till_now = 0;
    // get the sum of the price till no
    for (let i = 0; i < products.length; i++) {
      price_till_now += (parseFloat(products[i].price)- parseFloat(products[i].discount)) * parseInt(products[i].quantity);
    }
    console.log('price_till_now:', price_till_now);
    for (let i = 0; i < products.length; i++) {
      totalPrice = (parseFloat(products[i].price)- parseFloat(products[i].discount)) * parseInt(products[i].quantity);
    }

    console.log('totalPrice:', totalPrice);


  

  };


  const handleSubmit = async () => {
    // generate the invoice number
    if (invoiceId === ''){
      invoiceId = Date.now();
      setInvoiceId(invoiceId);
    }
    const formattedProducts = products.map((product) => [product.name, product.price, product.quantity]);
    console.log('formattedProducts:', formattedProducts);

    const url ='http://127.0.0.1:5000/webhook'
    try {
      if (submissionType === 'Fresh'){
        submissionType = 'Fresh';
      }
      else{
        submissionType = 'Hold';
      }
      const response = await axios.post(url, {
        values: formattedProducts,
        invoice_id: invoiceId,
        Submission_Type :submissionType
      });

      // show alert after submission
      alert('Invoice ID: ' + invoiceId + ' submitted successfully');
   
    // Clear products array after submission
    setTotalPrice(0);
    // Clear input after submission
    setBarcode('');
    sessionStorage.removeItem('invoiceData');

    // remove the data from the table
    setProducts([]);
    setTotalPrice(0);
    setOverallDiscount(0);
    setBarcode('');
    // Reload the page to create a new session

    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error submitting data:', error);
    }
    if (submissionType === 'Hold'){
      // remove the invoice from the sheet
      console.log('Deleting invoice...:', invoiceId);
      
      try{
        console.log('Trying Deleting invoice...:', invoiceId);
        const response = await axios.post('http://127.0.0.1:5000/chnage_held_invocies', {
          invoiceId:invoiceId ,
          values: formattedProducts
        });
      console.log('response:', response); 
        
    }
    catch (error) {
      console.error('Error deleting invoice:', error);
    }
  }

 
  };

  const handleNewHoldInvoice =async () => {
    console.log('Hold Invoice');
    console.log('products:', products);
    // generate the invoice number
    invoiceId = Date.now();

    const url ='http://127.0.0.1:5000/hold_invoice'
    try {
      const response = await axios.post(url, {
        values: products,
        invoice_id: String(invoiceId),
      });

      alert('Invoice ID: ' + invoiceId + ' held successfully and is in HOLD state');


      console.log('response:', response);
    // Clear products array after submission
    setTotalPrice(0);
    // Clear input after submission
    setBarcode('');
    sessionStorage.removeItem('invoiceData');

    // remove the data from the table
    setProducts([]);
    setTotalPrice(0);
    setOverallDiscount(0);
    setBarcode('');
    // Reload the page to create a new session

    } catch (error) {
      console.error('Error submitting data:', error);
      if (submissionType === 'Hold'){
        alert("THIS IS A HOLD INVOICE, PLEASE SUBMIT THE INVOICE TO SAVE IT");
        console.log(error);
      }
      alert('Error submitting data:', error);
    }
    

  };

  const getOptions = async () => {
    try {
      const response = await axios.get(
        'https://sheets.googleapis.com/v4/spreadsheets/1YvUhfiX6oBVpl67x7gD4iiChZPis17aNgMVSSEHRak4/values/Sheet1!A:C?key=AIzaSyCCSlM3bNmnEd0CqUbX5C7znDyh2jKFQGU'
      );
      const rows = response.data.values;
      console.log('rowsqwe:', rows);
      // set the options
      options = rows;
      setOptions(options);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    

  };

  const fetchProducts = async (e) => {
    console.log('selectedOption:', e);
    setSelectedOption(selectedOption);
    console.log('selectedOption:', e);


  }

  return (

    <Container>
      <SearchContainer>
        <div className='search-inner'>
          <input type="text" placeholder="Search Products" value={searchTerm} onChange={handleSearchChange} />
          <button onClick={()=> fetchProducts(searchTerm)}>Search</button>
          {options.length > 0 && (
            <Dropdown>
              {options.filter(results =>{
                console.log('results:', searchTerm);
                if (searchTerm === ''){
                  console.log('No results found');
                  return results
                }
                else if (results[0].toLowerCase().includes(searchTerm.toLowerCase()) || results[2].toLowerCase().includes(searchTerm.toLowerCase())){
                  return results
                }
                
              }).map((result) => (

                <DropdownItem>
                  {result[0]} - {result[2]}
                </DropdownItem>

))}
            </Dropdown>
          )}
        </div>

        
 
      </SearchContainer>
      <CustomerContainer>

      </CustomerContainer>
      <HoldInvoicesButton onClick={handleHoldInvoicesClick}>
          Old Held Invoices
        </HoldInvoicesButton>
        <ReceiptButton onClick={handleRecievePayments}>
          Receipt\Received Payments
        </ReceiptButton>
        <ReOrderManagemntButton onClick={handleReOrderManagement}>
          Re-Order Management
        </ReOrderManagemntButton>
      <Header>
        <Input
          type="text"
          placeholder="Enter barcode number"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          
        />
        <Button onClick={handleSearch}>Search</Button>
        <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
        <HoldInvoicesButton onClick={handleNewHoldInvoice}>
          Hold Invoices
        </HoldInvoicesButton>
      </Header>

      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Price</Th>
            <Th>Quantity</Th>
            <Th>Discount</Th>
            <Th>Total</Th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <Td>
                <EditableInput
                  type="text"
                  value={product.name}
                  onChange={(e) => handleEdit(product.id, 'name', e.target.value)}
                />
              </Td>
              <Td>
                <EditableInput
                  type="text"
                  value={product.price}
                  onChange={(e) => handleEdit(product.id, 'price', e.target.value)}
                />
              </Td>
              <Td>
                <EditableInput
                  type="number"
                  min="1"
                  value={product.quantity}
                  onChange={(e) => handleEdit(product.id, 'quantity', e.target.value)}
                />
              </Td>
              <Td>
                <EditableInput
                  type="number"
                  min="0"
                  value={product.discount}
                  onChange={(e) => handleEdit(product.id, 'discount', e.target.value)}
                />
              </Td>
              <Td>{((parseFloat(product.price)-parseFloat(product.discount)) * parseInt(product.quantity)).toFixed(2)}</Td>
              <Td>
                <DeleteButton onClick={() => handleDelete(product.id)}>===</DeleteButton>
              </Td>
            </tr>
          ))}
          <tr>
            <Td colSpan="5">Transaction Type</Td>
            <Td>
              <Select value={transactionType} onChange={handleTransactionTypeChange}>
                <option value="Cash">Cash</option>
                <option value="Credit">Credit</option>
              </Select>
            </Td>
          </tr>
          {transactionType === 'Cash' && (
            <tr>
              <Td colSpan="5">Payment Option</Td>
              <Td>
                <Select value={paymentOption} onChange={handlePaymentOptionChange}>
                  <option value="Multiple Payment">Multiple Payment</option>
                  <option value="Card">Card</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                </Select>
              </Td>
            </tr>
          )}
          {transactionType === 'Credit' && (
            <tr>
              <Td colSpan="5">Payment Option</Td>
              <Td>
                <Select value={paymentOption} onChange={handlePaymentOptionChange}>
                  <option value="Partial">Partial</option>
                  <option value="Full">Full</option>
                </Select>
              </Td>
            </tr>
          )}
          <DiscountRow>
            <Td colSpan="3">Overall Discount</Td>
            <Td colSpan="2">
              <EditableInput
                type="number"
                min="0"
                max="100"
                value={overallDiscount}
                onChange={(e) => setOverallDiscount(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleOverallDiscount()}
              />
            </Td>
            <Td></Td>
          </DiscountRow>
          <TotalRow>
            <Td>Total</Td>
   
            <Td>{
              products.reduce((acc, product) => acc + (parseFloat(product.price)-parseFloat(product.discount)) * parseInt(product.quantity), 0).toFixed(2)
              }</Td>
          </TotalRow>
        </tbody>
      </Table>
    </Container>
  );
};

export default BarcodeSearch;
