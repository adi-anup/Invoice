import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function GenerateInvoice() {
  html2canvas(document.querySelector("#invoiceCapture"), { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [612, 792]
    });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('invoice.pdf');
  });
}



class InvoiceModal extends React.Component {
            
  render() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.closeModal} size="lg" centered>
        <div id="invoiceCapture">
            <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
              <div className="w-100">
                <h4 className="fw-bold my-2">{this.props.info.billFrom || 'John Uberbacher'}</h4>
                <div>{this.props.info.billFromAddress || ''}</div>
                <div>{this.props.info.billFromEmail || ''}</div>
                <h6 className="fw-bold text-secondary mb-1">Invoice #: {this.props.info.invoiceNumber || ''}</h6>
              </div>
              <div className="text-end ms-4">
                <h6 className="fw-bold mt-1 mb-2">Amount Due:</h6>
                <h5 className="fw-bold text-secondary"> {this.props.currency} {this.props.totalGrossAmount}</h5>
              </div>
            </div>
          <div className="p-4">
            <Row className="mb-4">
            <Col md={4}>
                  <div className="fw-bold">Billed to:</div>
                  <div>{this.props.info.billTo||''}</div>
                  <div>{this.props.info.billToAddress||''}</div>
                  <div>{this.props.info.billToEmail||''}</div>
                </Col>
                <Col md={4}>
                  <div className="fw-bold">Billed From:</div>
                  <div>{this.props.info.billFrom||''}</div>
                  <div>{this.props.info.billFromAddress||''}</div>
                  <div>{this.props.info.billFromEmail||''}</div>
                </Col>
              <Col md={4}><b>Date:</b><div>{this.props.info.dateOfIssue || ''}</div></Col>
            </Row>
            <Table bordered>
              <thead>
                <tr>
                  <th>ITEM</th>
                  <th>DESCRIPTION</th>
                  <th>QTY</th>
                  <th>UNIT PRICE</th>
                  <th>DISCOUNT %</th>
                  <th>TAX %</th>
                  <th>FREIGHT</th>
                  <th>SUBTOTAL</th>
                  <th>GROSS</th>
                </tr>
              </thead>
              <tbody>
                {this.props.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>{this.props.currency} {item.unitPrice}</td>
                    <td>{item.itemDiscountPercentage}%</td>
                    <td>{item.itemTaxPercentage}%</td>
                    <td>{this.props.currency} {item.freight}</td>
                    <td>{this.props.currency} {item.subTotal}</td>
                    <td>{this.props.currency} {item.grossAmount}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Table className="mt-3">
              <tbody>
                <tr className="text-end">
                  <td className="fw-bold">SUBTOTAL</td>
                  <td>{this.props.currency} {this.props.subTotal}</td>
                </tr>
                {this.props.taxAmount !== 0 && (
                  <tr className="text-end">
                    <td className="fw-bold">TAX</td>
                    <td>{this.props.currency} {this.props.taxAmount}</td>
                  </tr>
                )}
                {this.props.discountAmount !== 0 && (
                  <tr className="text-end">
                    <td className="fw-bold">DISCOUNT</td>
                    <td>{this.props.currency} {this.props.discountAmount}</td>
                  </tr>
                )}
                <tr className="text-end">
                  <td className="fw-bold">TOTAL</td>
                  <td>{this.props.currency} {this.props.totalGrossAmount}</td>
                </tr>
              </tbody>
            </Table>
            {this.props.info.notes && <div className="bg-light p-3 rounded">{this.props.info.notes}</div>}
          </div>
        </div>
        <div className="pb-4 px-4">
          <Row>
            <Col md={6}>
              <Button variant="primary" className="d-block w-100" onClick={GenerateInvoice}>
                <BiPaperPlane className="me-2" />Send Invoice
              </Button>
            </Col>
            <Col md={6}>
              <Button variant="outline-primary" className="d-block w-100 mt-3 mt-md-0" onClick={GenerateInvoice}>
                <BiCloudDownload className="me-2" />Download Copy
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default InvoiceModal;