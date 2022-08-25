import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { Collapse } from "@material-ui/core";

const Home = () => {
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    setChecked(true);
  }, []);
  return (
    <div className={styles.pageContainer}>
      <Collapse
        in={checked}
        {...(checked ? { timeout: 1000 } : {})}
        collapsedHeight={30}
      >
        <section className={styles.hero}>
          <h1>Kemudahan Utilitas Accounting</h1>
          <div className={styles.paragraph}>
            <p>Accounting Application Made by Wikan Production</p>
          </div>
          <div className={styles.imgContainer}>
            <img
              src="https://img.freepik.com/free-vector/money-income-attraction_74855-6573.jpg?w=740&t=st=1661397303~exp=1661397903~hmac=9ce8d3ba1d2b9b0246a459ec41615bec9fba646c187687545301e83841378634"
              alt="invoicing-app"
            />
          </div>
        </section>
      </Collapse>
    </div>
  );
};

export default Home;
