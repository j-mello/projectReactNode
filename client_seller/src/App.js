import { BrowserRouter, Route, Link} from "react-router-dom";
import Login from './components/Login';
import React from 'react';
import './App.css';
import Index from "./components/Index";

function App() {
  const seller = JSON.parse(localStorage.getItem('seller'));

  const disconnect = async () => {
      const res = await fetch('http://'+window.location.hostname+':3001/auth/logout-oauth2?token='+seller.accessToken, {
          method: "POST"
      });
      if (res.status === 200) {
          localStorage.removeItem('seller');
          window.location.href = "/";
      }
  }

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
                    seller == null ?
                        (<>
                          <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/login">Se connecter</Link>
                          </li>
                        </>)
                        :
                        (<>
                          <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#" onClick={disconnect}>Se déconnecter</a>
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
        </main>

      </BrowserRouter>
  );
}

export default App;
