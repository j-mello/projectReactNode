import './App.css';
import React from 'react';
import { BrowserRouter, Route, Link} from "react-router-dom";
import AuthService from "./services/AuthService";
import Index from "./components/Index";
import Login from "./components/Login";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
      <BrowserRouter>
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

                {
                  user == null ?
                      (<ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
                        <li className="nav-item">
                          <Link className="nav-link active" aria-current="page" to="/login">Se connecter</Link>
                        </li>
                        <li className="nav-item">
                          <Link className="nav-link active" aria-current="page" to="/register">S'inscrire</Link>
                        </li>
                      </ul>)
                      :
                      (<ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
                        <li className="nav-item">
                          <a className="nav-link active" aria-current="page" href="#" onClick={() => AuthService.logout()}>Se déconnecter</a>
                        </li>
                      </ul>)
                }
              </div>
            </div>
          </nav>
        </header>
        <main>
            <Route exact path="/" component={Index}/>
            <Route exact path="/login" component={Login}/>
        </main>

      </BrowserRouter>
  );
}

export default App;