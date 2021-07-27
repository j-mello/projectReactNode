import './App.css';
import React from 'react';
import {BrowserRouter, Route} from "react-router-dom";
import Index from "./components/Index";
import Login from "./components/Login";
import RegisterSeller from "./components/RegisterSeller";
import Infos from "./components/Infos";
import Transactions from "./components/Transactions";
import TransactionProvider from "./contexts/TransactionContext";
import SellerProvider from "./contexts/SellerContext";
import SessionProvider, {SessionContext} from "./contexts/SessionContext";
import {Container, Nav, Navbar} from 'react-bootstrap';

function App() {
    return (
        <BrowserRouter>

            <SessionProvider>
                <header>
                    <Navbar bg="light" expand="lg">
                        <Container>
                            <Navbar.Brand href="/">Backoffice</Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                                <Nav>
                                    <SessionContext.Consumer>
                                        {
                                            ({user, logout}) =>
                                                user == null ?
                                                    (<>
                                                        <Nav.Link href="/login">Se connecter</Nav.Link>
                                                        <Nav.Link href="/register-seller">S'inscrire
                                                            (marchand)</Nav.Link>
                                                    </>)
                                                    :
                                                    (<>
                                                        <Nav.Link href="/infos">Informations</Nav.Link>
                                                        <Nav.Link href="/transactions">Transactions</Nav.Link>
                                                        <Nav.Link href="#" onClick={logout}>Se déconnecter</Nav.Link>
                                                    </>)
                                        }
                                    </SessionContext.Consumer>
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </header>
                <main>
                    <Route exact path="/register-seller" component={RegisterSeller}/>
                    <Route exact path="/login" component={Login}/>
                    <SessionContext.Consumer>
                        {
                            ({user}) =>
                                <SellerProvider user={user}>
                                    <Route exact path="/" component={Index}/>
                                    <TransactionProvider user={user}>
                                        <Route exact path="/transactions" component={Transactions}/>
                                    </TransactionProvider>
                                </SellerProvider>
                        }
                    </SessionContext.Consumer>
                    <Route exact path="/infos" component={Infos}/>

                </main>
            </SessionProvider>

        </BrowserRouter>
    );
}

export default App;
