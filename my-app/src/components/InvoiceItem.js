import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

class InvoiceItem extends React.Component {
    render() {
        const { onItemizedItemEdit, currency, items, onRowAdd, onRowDel } = this.props;
        
        return (
            <div className="invoice-items">
                <div className="row clearfix">
                    <div className="col-12">
                        <table className="table table-hover align-middle" style={{ width: '100%', margin: '20px 0' }}>
                            <thead>
                                <tr>
                                    <th style={{ width: '15%', textAlign: 'left'  }}>ITEM</th>
                                    <th style={{ width: '20%', textAlign: 'left'  }}>DESCRIPTION</th>
                                    <th style={{ width: '7%', textAlign: 'left' }}>QTY</th>
                                    <th style={{ width: '10%', textAlign: 'left' }}>UNIT PRICE</th>
                                    <th style={{ width: '10%', textAlign: 'left' }}>DISCOUNT %</th>
                                    <th style={{ width: '10%', textAlign: 'left' }}>TAX %</th>
                                    <th style={{ width: '10%', textAlign: 'left' }}>FREIGHT</th>
                                    <th style={{ width: '8%', textAlign: 'left' }}>SUBTOTAL</th>
                                    <th style={{ width: '8%', textAlign: 'left' }}>GROSS</th>
                                    <th style={{ width: '5%', textAlign: 'left' }}>DELETE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <Form.Control type="text" name="name" value={item.name} 
                                                onChange={(e) => onItemizedItemEdit({
                                                    target: { id: item.id, name: 'name', value: e.target.value }
                                                })}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control type="text" name="description" value={item.description} 
                                                onChange={(e) => onItemizedItemEdit({
                                                    target: { id: item.id, name: 'description', value: e.target.value }
                                                })}
                                            />
                                        </td>
                                        <td className="text-center">
                                            <Form.Control type="number" name="quantity" value={item.quantity} min="1"
                                                onChange={(e) => onItemizedItemEdit({
                                                    target: { id: item.id, name: 'quantity', value: e.target.value }
                                                })}
                                            />
                                        </td>
                                        <td>
                                            <InputGroup>
                                                <InputGroup.Text>{currency}</InputGroup.Text>
                                                <Form.Control type="number" name="unitPrice" value={item.unitPrice} min="0.00" step="0.01"
                                                    onChange={(e) => onItemizedItemEdit({
                                                        target: { id: item.id, name: 'unitPrice', value: e.target.value }
                                                    })}
                                                />
                                            </InputGroup>
                                        </td>
                                        <td>
                                            <InputGroup>
                                                <Form.Control type="number" name="itemDiscountPercentage" value={item.itemDiscountPercentage} min="0" max="100" step="0.1"
                                                    onChange={(e) => onItemizedItemEdit({
                                                        target: { id: item.id, name: 'itemDiscountPercentage', value: e.target.value }
                                                    })}
                                                />
                                                <InputGroup.Text>%</InputGroup.Text>
                                            </InputGroup>
                                        </td>
                                        <td>
                                            <InputGroup>
                                                <Form.Control type="number" name="itemTaxPercentage" value={item.itemTaxPercentage} min="0" max="100" step="0.1"
                                                    onChange={(e) => onItemizedItemEdit({
                                                        target: { id: item.id, name: 'itemTaxPercentage', value: e.target.value }
                                                    })}
                                                />
                                                <InputGroup.Text>%</InputGroup.Text>
                                            </InputGroup>
                                        </td>
                                        <td>
                                            <InputGroup>
                                                <InputGroup.Text>{currency}</InputGroup.Text>
                                                <Form.Control type="number" name="freight" value={item.freight} min="0.00" step="0.01"
                                                    onChange={(e) => onItemizedItemEdit({
                                                        target: { id: item.id, name: 'freight', value: e.target.value }
                                                    })}
                                                />
                                            </InputGroup>
                                        </td>
                                        <td>
                                            <InputGroup>
                                                <Form.Control plaintext readOnly value={item.subTotal} />
                                            </InputGroup>
                                        </td>
                                        <td>
                                            <InputGroup>
                                                <Form.Control plaintext readOnly value={item.grossAmount} />
                                            </InputGroup>
                                        </td>
                                        <td className="text-center">
                                            <Button variant="danger" onClick={() => onRowDel(item)}>
                                                ×
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row clearfix">
                    <div className="col-12 text-end">
                        <Button className="btn btn-primary" onClick={onRowAdd}>
                            Add Item
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default InvoiceItem;