import './App.css';
import React from 'react';
import { BrowserRouter, Route, Link} from "react-router-dom";
import Index from "./components/Index";
import Login from "./components/Login";
import RegisterSeller from "./components/RegisterSeller";
import Infos from "./components/Infos";
import Transactions from "./components/Transactions";
import ListProvider from "./contexts/ListContext";
import SellerProvider from "./contexts/SellerContext";
import SessionProvider, {SessionContext} from "./contexts/SessionContext";

function App() {
  return (
      <BrowserRouter>
          <SessionProvider>
            <header>
              <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                  <a className="navbar-brand">Backoffice</a>
                  <div className="collapse navbar-collapse" id="navbarScroll">
                    <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
                      <li className="nav-item">
                        <Link className="nav-link active" aria-current="page" to="/">Accueil</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="d-flex">
                      <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
                          <SessionContext.Consumer>
                              {
                                  ({user,logout}) =>
                                      user == null ?
                                          (<>
                                              <li className="nav-item">
                                                  <Link className="nav-link active" aria-current="page" to="/login">Se connecter</Link>
                                              </li>
                                              <li className="nav-item">
                                                  <Link className="nav-link active" aria-current="page" to="/register-seller">S'inscrire (marchant)</Link>
                                              </li>
                                          </>)
                                          :
                                          (<>
                                              <li className="nav-item">
                                                  <Link className="nav-link active" aria-current="page" to="/infos">Informations</Link>
                                              </li>
                                              <li className="nav-item">
                                                  <Link className="nav-link active" aria-current="page" to="/transactions">Transactions</Link>
                                              </li>
                                              <li className="nav-item">
                                                  <a className="nav-link active" aria-current="page" href="#" onClick={logout}>Se déconnecter</a>
                                              </li>
                                          </>)
                              }
                          </SessionContext.Consumer>
                      </ul>
                  </div>
                </div>
              </nav>
            </header>
            <main>
                <Route exact path="/register-seller" component={RegisterSeller}/>
                <Route exact path="/login" component={Login}/>
                <SessionContext.Consumer>
                    {
                        ({user}) =>
                            <SellerProvider user={user}>
                                <Route exact path="/" component={Index}/>
                            </SellerProvider>
                    }
                </SessionContext.Consumer>
                <Route exact path="/infos" component={Infos}/>
                <ListProvider>
                    <Route exact path="/transactions" component={Transactions} />
                </ListProvider>
            </main>
          </SessionProvider>

      </BrowserRouter>
  );
}

export default App;
