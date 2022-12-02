import { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products/categories');
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <Helmet>
        <title>NhatAnh's Store</title>
      </Helmet>
      <Carousel>
        <Carousel.Item>
          <LinkContainer to={'/search'}>
            <img
              className="d-block w-100"
              src="images\dienthoai.png"
              alt="First slide"
            />
          </LinkContainer>
        </Carousel.Item>
        <Carousel.Item>
          <LinkContainer to={'/search/?query=iphone%2014'}>
            <img
              className="d-block w-100"
              src="images\iPhone14.gif"
              alt="Second slide"
            />
          </LinkContainer>
        </Carousel.Item>
        <Carousel.Item>
          <LinkContainer to={'/search/?query=samsung%20galaxy%20z'}>
            <img
              className="d-block w-100"
              src="images/samsung.png"
              alt="Third slide"
            />
          </LinkContainer>
        </Carousel.Item>
      </Carousel>
      <h1
        className="text-center"
        style={{ margin: '10px 0', color: '#c70000' }}
      >
        Danh mục sản phẩm
      </h1>
      <Nav className="d-flex">
        {categories.map((category) => (
          <Button variant="success" className="btn-home" key={category}>
            <Nav.Item>
              <LinkContainer to={'/search?category=' + category}>
                <Nav.Link className="text-white">{category}</Nav.Link>
              </LinkContainer>
            </Nav.Item>
          </Button>
        ))}
      </Nav>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => {
              return (
                <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                  <Product product={product}></Product>
                </Col>
              );
            })}
          </Row>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
