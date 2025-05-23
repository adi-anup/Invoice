import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import InvoiceItem from './InvoiceItem';
import InvoiceModal from './InvoiceModal';

class InvoiceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      currency: '₹',
      currentDate: '',
      invoiceNumber: 1,
      dateOfIssue: '',
      billTo: '',
      billToEmail: '',
      billToAddress: '',
      billFrom: '',
      billFromEmail: '',
      billFromAddress: '',
      notes: '',
      PO_Number: '',
      total: '0.00',
      subTotal: '0.00',
      taxRate: '',
      taxAmount: '0.00',
      discountRate: '',
      discountAmount: '0.00',
      net_amount: '',
      totalFreight: '0.00',
      totalGrossAmount: '0.00'
    };
    this.state.items = [
      {
        id: 0,
        name: '',
        description: '',
        quantity: 1,
        unitPrice: '1.00',
        itemDiscount: '0.00',
        itemDiscountPercentage: '0',
        itemTaxPercentage: '0',
        itemTax: '0.00',
        freight: '0.00',
        grossAmount: '0.00',
        subTotal: '0.00'
      }
    ];
    this.editField = this.editField.bind(this);
  }

  componentDidMount() {
    this.handleCalculateTotal();
  }

  handleRowDel(item) {
    this.setState(prevState => {
      const items = prevState.items.filter(i => i.id !== item.id);
      return { items };
    }, this.handleCalculateTotal);
  }

  handleAddEvent() {
    const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newItem = {
      id,
      name: '',
      description: '',
      quantity: 1,
      unitPrice: '1.00',
      itemDiscount: '0.00',
      itemDiscountPercentage: '0',
      itemTaxPercentage: '0',
      itemTax: '0.00',
      freight: '0.00',
      grossAmount: '0.00',
      subTotal: '0.00'
    };

    this.setState(prevState => ({ items: [...prevState.items, newItem] }), this.handleCalculateTotal);
  }

  calculateItemTotals(item) {
    const quantity = parseFloat(item.quantity) || 0;
    const unitPrice = parseFloat(item.unitPrice) || 0;
    const itemDiscountPercentage = parseFloat(item.itemDiscountPercentage) || 0;
    const itemTaxPercentage = parseFloat(item.itemTaxPercentage) || 0;
    const freight = parseFloat(item.freight) || 0;

    // Calculate subtotal before discount
    const subTotal = quantity * unitPrice;

    // Calculate discount amount
    const itemDiscount = (subTotal * itemDiscountPercentage) / 100;

    // Calculate amount after discount
    const afterDiscount = subTotal - itemDiscount;

    // Calculate tax amount
    const itemTax = (afterDiscount * itemTaxPercentage) / 100;

    // Calculate gross amount (subtotal - discount + tax + freight)
    const grossAmount = afterDiscount + itemTax + freight;

    return {
      subTotal: subTotal.toFixed(2),
      itemDiscount: itemDiscount.toFixed(2),
      itemTax: itemTax.toFixed(2),
      grossAmount: grossAmount.toFixed(2)
    };
  }

  handleCalculateTotal() {
    let totalSubTotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    let totalFreight = 0;
    let totalGrossAmount = 0;

    // Calculate totals for each item
    const updatedItems = this.state.items.map(item => {
      const totals = this.calculateItemTotals(item);
      
      totalSubTotal += parseFloat(totals.subTotal);
      totalDiscount += parseFloat(totals.itemDiscount);
      totalTax += parseFloat(totals.itemTax);
      totalFreight += parseFloat(item.freight) || 0;
      totalGrossAmount += parseFloat(totals.grossAmount);

      return {
        ...item,
        subTotal: totals.subTotal,
        itemDiscount: totals.itemDiscount,
        itemTax: totals.itemTax,
        grossAmount: totals.grossAmount
      };
    });

    // Add any additional net amount
    const netAmount = parseFloat(this.state.net_amount) || 0;
    totalGrossAmount += netAmount;

    this.setState({
      items: updatedItems,
      subTotal: totalSubTotal.toFixed(2),
      discountAmount: totalDiscount.toFixed(2),
      taxAmount: totalTax.toFixed(2),
      totalFreight: totalFreight.toFixed(2),
      total: totalGrossAmount.toFixed(2),
      totalGrossAmount: totalGrossAmount.toFixed(2)
    });
  }

  onItemizedItemEdit(evt) {
    const { id, name, value } = evt.target;
    
    const items = this.state.items.map(item => {
      if (item.id === id) {
        return { ...item, [name]: value };
      }
      return item;
    });

    this.setState({ items }, this.handleCalculateTotal);
  }

  editField = (event) => {
    this.setState(
      { [event.target.name]: event.target.value },
      this.handleCalculateTotal
    );
  };

  onCurrencyChange = (selectedOption) => {
    this.setState(selectedOption);
  };

  openModal = (event) => {
    event.preventDefault();
    this.handleCalculateTotal();
    this.setState({ isOpen: true });
  };

  closeModal = (event) => this.setState({ isOpen: false });

  render() {
    return (
      <Form onSubmit={this.openModal}>
        <Row>
          <Col md={12} lg={15}>
            <Card className="p-4 p-xl-5 my-3 my-xl-4">
              {/* Previous header content remains the same */}
              <div className="d-flex flex-row align-items-start justify-content-between mb-3">
                <div className="d-flex flex-column">
                  <div className="d-flex flex-column">
                    <div className="mb-2">
                      <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                      <span className="current-date">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="d-flex flex-row align-items-center">
                    <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
                    <Form.Control type="text" value={this.state.dateOfIssue} name="dateOfIssue" onChange={this.editField} style={{ maxWidth: '150px' }}/>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center">
                  <span className="fw-bold me-2">Invoice&nbsp;Number:&nbsp;</span>
                  <Form.Control type="text" value={this.state.invoiceNumber} name="invoiceNumber" onChange={this.editField} min="1" style={{ maxWidth: '70px' }} required="required"/>
                </div>
              </div>
              <hr className="my-4"/>
              
              {/* Billing information remains the same */}
              <Row className="mb-5">
                <Col>
                  <Form.Label className="fw-bold">Bill to:</Form.Label>
                  <Form.Control placeholder="Who is this invoice to?" rows={3} value={this.state.billTo} type="text" name="billTo" className="my-2" onChange={this.editField} autoComplete="name" required="required"/>
                  <Form.Control placeholder="Email address" value={this.state.billToEmail} type="email" name="billToEmail" className="my-2" onChange={this.editField} autoComplete="email"/>
                  <Form.Control placeholder="Billing address" value={this.state.billToAddress} type="text" name="billToAddress" className="my-2" autoComplete="address" onChange={this.editField} required="required"/>
                </Col>
                <Col>
                  <Form.Label className="fw-bold">Bill from :</Form.Label>
                  <Form.Control placeholder="Who is this invoice from?" rows={3} value={this.state.billFrom} type="text" name="billFrom" className="my-2" onChange={this.editField} autoComplete="name" required="required"/>
                  <Form.Control placeholder="Email address" value={this.state.billFromEmail} type="email" name="billFromEmail" className="my-2" onChange={this.editField} autoComplete="email"/>
                  <Form.Control placeholder="Billing address" value={this.state.billFromAddress} type="text" name="billFromAddress" className="my-2" autoComplete="address" onChange={this.editField} required="required"/>
                </Col>
              </Row>

              <InvoiceItem 
                onItemizedItemEdit={this.onItemizedItemEdit.bind(this)}
                onRowAdd={this.handleAddEvent.bind(this)}
                onRowDel={this.handleRowDel.bind(this)}
                currency={this.state.currency}
                items={this.state.items}
              />

              {/* Updated totals section */}
              <Row className="mt-4 justify-content-end">
                <Col lg={6}>
                  <div className="d-flex flex-row align-items-start justify-content-between">
                    <span className="fw-bold">Net Amount:</span>
                    <div className="d-flex justify-content-end align-items-center">
                      <span style={{ textAlign: 'right', minWidth: '50px' }}>{this.state.currency}</span>
                      <Form.Control
                        type="text"
                        value={this.state.net_amount}
                        name="net_amount"
                        onChange={this.editField}
                        style={{ maxWidth: '80px', marginLeft: '8px' }}
                      />
                    </div>
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                    <span className="fw-bold">Subtotal:</span>
                    <span>{this.state.currency}{this.state.subTotal}</span>
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                    <span className="fw-bold">Total Discount:</span>
                    <span>{this.state.currency}{this.state.discountAmount}</span>
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                    <span className="fw-bold">Total Tax:</span>
                    <span>{this.state.currency}{this.state.taxAmount}</span>
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                    <span className="fw-bold">Total Freight:</span>
                    <span>{this.state.currency}{this.state.totalFreight}</span>
                  </div>
                  <hr/>
                  <div className="d-flex flex-row align-items-start justify-content-between" style={{ fontSize: '1.125rem' }}>
                    <span className="fw-bold">Total Gross Amount:</span>
                    <span className="fw-bold">{this.state.currency}{this.state.totalGrossAmount}</span>
                  </div>
                </Col>
              </Row>

              <hr className="my-4"/>
              <Form.Label className="fw-bold">Notes:</Form.Label>
              <Form.Control 
                placeholder="Thanks for your business!" 
                name="notes" 
                value={this.state.notes} 
                onChange={this.editField} 
                as="textarea" 
                className="my-2" 
                rows={1}
              />
              <hr className="my-4"/>
              <Form.Label className="fw-bold">PO Number:</Form.Label>
              <Form.Control 
                placeholder="Please Provide the PO_id if present" 
                name="PO_Number" 
                value={this.state.PO_Number} 
                onChange={this.editField} 
                as="textarea" 
                className="my-2" 
                rows={1}
              />
            <Col md={2} lg={12}>
            <div className="sticky-top pt-md-3 pt-xl-4">
              <Button variant="primary" type="submit" className="d-block w-100">Review Invoice</Button>
              <InvoiceModal 
                showModal={this.state.isOpen} 
                closeModal={this.closeModal} 
                info={this.state} 
                items={this.state.items} 
                currency={this.state.currency} 
                subTotal={this.state.subTotal}
                net_amount={this.state.net_amount}
                taxAmount={this.state.taxAmount}
                discountAmount={this.state.discountAmount}
                totalFreight={this.state.totalFreight}
                totalGrossAmount={this.state.totalGrossAmount}
              />
              
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Currency:</Form.Label>
                <Form.Select 
                  onChange={event => this.onCurrencyChange({currency: event.target.value})} 
                  className="btn btn-light my-1" 
                  aria-label="Change Currency"
                >
                  <option value="₹">Rs (Rupees)</option>
                  <option value="$">USD (United States Dollar)</option>
                  <option value="£">GBP (British Pound Sterling)</option>
                  <option value="¥">JPY (Japanese Yen)</option>
                  <option value="$">CAD (Canadian Dollar)</option>
                  <option value="$">AUD (Australian Dollar)</option>
                  <option value="$">SGD (Singapore Dollar)</option>
                  <option value="¥">CNY (Chinese Renminbi)</option>
                  <option value="₿">BTC (Bitcoin)</option>
                </Form.Select>
              </Form.Group>
            </div>
          </Col>
          </Card>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default InvoiceForm;