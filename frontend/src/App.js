import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext } from 'react';
import { Store } from './Store';
import { Link } from 'react-router-dom';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import SignupScreen from './screens/SignupScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/DashboardScreen';
import AdminRoute from './components/AdminRoute';
import StaffRoute from './components/StaffRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  return (
    <BrowserRouter>
      <ToastContainer position="bottom-center" limit={1} />
      <div className="site-container">
        <header>
          <Navbar bg="primary gradient" variant="dark" expand="lg">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>
                  <img
                    src="https://res.cloudinary.com/dk845ibfo/image/upload/v1669978962/logo_ms7bv7.png"
                    style={{ width: '80px' }}
                    alt="logo"
                  />{' '}
                  NhatAnh's Store
                </Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto  w-100  justify-content-end">
                  <Link to="/cart" className="nav-link text-white">
                    <i className="fas fa-shopping-cart"></i>
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown
                      title={userInfo.name}
                      id="basic-nav-dropdown"
                      className="header-info"
                    >
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>
                          Th??ng tin Ng?????i d??ng
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>L???ch s??? ????n h??ng</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        ????ng xu???t
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      ????ng nh???p
                    </Link>
                  )}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown
                      title="Qu???n tr??? vi??n"
                      id="admin-nav-dropdown"
                      className="header-info"
                    >
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Th???ng k??</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Qu???n l?? Ng?????i d??ng</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                  {userInfo && userInfo.isStaff && (
                    <NavDropdown
                      title="Nh??n vi??n"
                      id="staff-nav-dropdown"
                      className="header-info"
                    >
                      <LinkContainer to="/staff/products">
                        <NavDropdown.Item>Qu???n l?? S???n ph???m</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/staff/orders">
                        <NavDropdown.Item>Qu???n l?? ????n h??ng</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              ></Route>
              {/* Staff Routes */}
              <Route
                path="/staff/orders"
                element={
                  <StaffRoute>
                    <OrderListScreen />
                  </StaffRoute>
                }
              ></Route>
              <Route
                path="/staff/products"
                element={
                  <StaffRoute>
                    <ProductListScreen />
                  </StaffRoute>
                }
              ></Route>
              <Route
                path="/staff/product/:id"
                element={
                  <StaffRoute>
                    <ProductEditScreen />
                  </StaffRoute>
                }
              ></Route>
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center text-white bg-primary bg-gradient">
            <h1 style={{ fontSize: '20px', color: '#c70000' }}>
              Ni??n lu???n ng??nh K??? thu???t ph???n m???m 2022
            </h1>
            <p style={{ marginBottom: '5px' }}>
              Nguy???n ?????t Nh???t Anh - B1906622
            </p>
            <p style={{ marginBottom: '5px' }}>
              K??? thu???t ph???n m???m K45 - ?????i h???c C???n Th??
            </p>
            <p style={{ marginBottom: '5px' }}>Email: ndnhatanh33@gmail.com</p>
            <p style={{ marginBottom: '0' }}>S??? ??i???n tho???i: 0979300469</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
