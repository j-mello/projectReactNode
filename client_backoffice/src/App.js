import './App.css';
import React from 'react';
import { BrowserRouter, Route, Link} from "react-router-dom";
import AuthService from "./services/AuthService";
import Index from "./components/Index";
import Login from "./components/Login";
import RegisterSeller from "./components/RegisterSeller";
import Infos from "./components/Infos";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
      <BrowserRouter>
        <header>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <a className="navbar-brand">Navbar scroll</a>
              <div className="collapse navbar-collapse" id="navbarScroll">
                <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
                  <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                  </li>
                </ul>
              </div>
              <div className="d-flex">
                  <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
                      {
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
                                      <a className="nav-link active" aria-current="page" href="#" onClick={() => AuthService.logout()}>Se déconnecter</a>
                                  </li>
                              </>)
                      }
                  </ul>
              </div>
            </div>
          </nav>
        </header>
        <main>
            <Route exact path="/" component={Index}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/register-seller" component={RegisterSeller}/>
            <Route exact path="/infos" component={Infos}/>
        </main>

      </BrowserRouter>
  );
}

export default App;
