import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function CheckoutSteps(props) {
  return (
    <Row className="checkout-step">
      <Col className={props.step1 ? 'active' : ''}>Đăng nhập</Col>
      <Col className={props.step2 ? 'active' : ''}>Thông tin vận chuyển</Col>
      <Col className={props.step3 ? 'active' : ''}>Hình thức thanh toán</Col>
      <Col className={props.step4 ? 'active' : ''}>Đặt hàng</Col>
    </Row>
  );
}
