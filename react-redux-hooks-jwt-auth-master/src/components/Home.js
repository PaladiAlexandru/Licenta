import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";

const Home = () => {
  const [content, setContent] = useState("");

  return (
    <div className="container">
 <header className="jumbotron text-center">
  <div className="d-flex align-items-center">
    <img src="/images/logo.png" alt="Books" width="100" height="100" className="mr-3" />
    <h1 className="title m-0">Welcome to the Catalog-Live experience</h1>
  </div>
  <img src="/images/student1.png" alt="Books" className="centered-img" />
</header>

    </div>
  );
};

export default Home;
