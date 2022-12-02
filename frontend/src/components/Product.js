import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';
import { formatCash } from '../utils';

function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get('/api/products/' + item._id);
    if (data.countInStock < quantity) {
      window.alert('Xin thứ lỗi! Sản phẩm đã hết hàng.');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  return (
    <Card>
      <Link to={'/product/' + product.slug}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={'/product/' + product.slug}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>{formatCash(product.price)}đ</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Hết hàng
          </Button>
        ) : (
          <Button onClick={() => addCartHandler(product)}>
            Thêm Vào Giỏ Hàng
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default Product;
