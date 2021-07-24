import { BrowserRouter, Route, Link} from "react-router-dom";
import Login from './components/Login';
import React from 'react';
import Index from "./components/Index";
import SessionProvider, {SessionContext} from "./contexts/SessionContext";
import './App.css';

function App() {
  return (
      <BrowserRouter>
          <SessionProvider>
            <header>
              <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                  <a className="navbar-brand" href="#">Navbar scroll</a>
                  <div className="collapse navbar-collapse" id="navbarScroll">
                    <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
                      <li className="nav-item">
                        <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="d-flex">
                    <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
                        <SessionContext.Consumer>
                            {
                                ({seller,logout}) =>
                                    seller == null ?
                                        (<>
                                            <li className="nav-item">
                                                <Link className="nav-link active" aria-current="page" to="/login">Se connecter</Link>
                                            </li>
                                        </>)
                                        :
                                        (<>
                                            <li className="nav-item">
                                                <a className="nav-link active" aria-current="page" href="#" onClick={() => logout(seller)}>Se déconnecter</a>
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
                <Route exact path="/" component={Index}/>
                <Route exact path="/login" component={Login}/>
            </main>
          </SessionProvider>

      </BrowserRouter>
  );
}

export default App;
