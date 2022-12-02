import jwt from 'jsonwebtoken';
import mg from 'mailgun-js';

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isStaff: user.isStaff,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};

export const isStaff = (req, res, next) => {
  if (req.user && req.user.isStaff) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Staff Token' });
  }
};

export const mailgun = () =>
  mg({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });

export const payOrderEmailTemplate = (order) => {
  function formatCash(str) {
    return str
      .toString()
      .split('')
      .reverse()
      .reduce((prev, next, index) => {
        return (index % 3 ? next : next + '.') + prev;
      });
  }
  return `<h1>Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi.</h1>
  <p>
  Xin chào ${order.user.name},</p>
  <p>Chúng tôi đang xử lý đơn hàng của bạn.</p>
  <h2>[Đơn hàng ${order._id}] (${order.createdAt
    .toString()
    .substring(0, 10)})</h2>
  <table>
  <thead>
  <tr>
  <td><strong>Sản phẩm</strong></td>
  <td><strong>Số lượng</strong></td>
  <td><strong align="right">Giá tiền</strong></td>
  </thead>
  <tbody>
  ${order.orderItems
    .map(
      (item) => `
    <tr>
    <td>${item.name}</td>
    <td align="center">${item.quantity}</td>
    <td align="right"> ${formatCash(item.price)}đ</td>
    </tr>
  `
    )
    .join('\n')}
  </tbody>
  <tfoot>
  <tr>
  <td colspan="2">Thuế:</td>
  <td align="right"> ${formatCash(order.taxPrice)}đ</td>
  </tr>
  <tr>
  <td colspan="2">Phí vận chuyển:</td>
  <td align="right"> ${formatCash(order.shippingPrice)}đ</td>
  </tr>
  <tr>
  <td colspan="2"><strong>Tổng tiền:</strong></td>
  <td align="right"><strong> ${formatCash(order.totalPrice)}đ</strong></td>
  </tr>
  <tr>
  <td colspan="2">Hình thức thanh toán:</td>
  <td align="right">${order.paymentMethod}</td>
  </tr>
  </table>
  <h2>Địa chỉ giao hàng</h2>
  <p>
  ${order.shippingAddress.fullName},<br/>
  ${order.shippingAddress.address},<br/>
  ${order.shippingAddress.city},<br/>
  ${order.shippingAddress.country},<br/>
  ${order.shippingAddress.postalCode}<br/>
  </p>
  <hr/>
  <p>
  Cảm ơn đã mua hàng. Chúc bạn một ngày tốt lành!
  </p>
  `;
};
