import React, { useEffect } from "react";
import { toCommas } from "../../utils/utils";
import styles from "./Dashboard.module.css";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getInvoicesByUser } from "../../actions/invoiceActions";
import Empty from "../svgIcons/Empty";
import Chart from "./Chart";
// import Donut from './Donut'
import moment from "moment";
import { Check, Pie, Bag, Card, Clock, Frown } from "./Icons";
import Spinner from "../Spinner/Spinner";

const Dashboard = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));
  const { invoices, isLoading } = useSelector((state) => state?.invoices);
  // const unpaid = invoices?.filter((invoice) => (invoice.status === 'Unpaid') || (invoice.status === 'Partial'))
  const overDue = invoices?.filter(
    (invoice) => invoice.dueDate <= new Date().toISOString()
  );

  let paymentHistory = [];
  for (let i = 0; i < invoices.length; i++) {
    let history = [];
    if (invoices[i].paymentRecords !== undefined) {
      history = [...paymentHistory, invoices[i].paymentRecords];
      paymentHistory = [].concat.apply([], history);
    }
  }

  //sort payment history by date
  const sortHistoryByDate = paymentHistory.sort(function (a, b) {
    var c = new Date(a.datePaid);
    var d = new Date(b.datePaid);
    return d - c;
  });

  let totalPaid = 0;
  for (let i = 0; i < invoices.length; i++) {
    if (invoices[i].totalAmountReceived !== undefined) {
      totalPaid += invoices[i].totalAmountReceived;
    }
  }

  let totalAmount = 0;
  for (let i = 0; i < invoices.length; i++) {
    totalAmount += invoices[i].total;
  }

  useEffect(() => {
    dispatch(
      getInvoicesByUser({ search: user?.result._id || user?.result?.googleId })
    );
    // eslint-disable-next-line
  }, [location, dispatch]);

  const unpaidInvoice = invoices?.filter(
    (invoice) => invoice.status === "Unpaid"
  );
  const paid = invoices?.filter((invoice) => invoice.status === "Paid");
  const partial = invoices?.filter((invoice) => invoice.status === "Partial");

  if (!user) {
    history.push("/login");
  }

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          paddingTop: "20px",
        }}
      >
        <Spinner />
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          paddingTop: "20px",
        }}
      >
        {/* <Spinner /> */}
        <Empty />
        <p style={{ padding: "40px", color: "gray" }}>
          Tidak ada yang bisa di tampilkan disini. Klik ikon tambah untuk
          memulai menambahkan Invoice
        </p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <section className={styles.stat}>
        <ul className={styles.autoGrid}>
          <li
            className={styles.listItem}
            style={{ backgroundColor: "#1976d2", color: "white" }}
          >
            <div>
              <p>{toCommas(totalPaid)}</p>
              <h2 style={{ color: "white" }}>Pembayaran Di Terima</h2>
            </div>
            <div>
              <Check />
            </div>
          </li>

          <li className={styles.listItem}>
            <div>
              <p>{toCommas(totalAmount - totalPaid)}</p>
              <h2>Pembayaran yang Belum di bayar</h2>
            </div>
            <div>
              <Pie />
            </div>
          </li>

          <li className={styles.listItem}>
            <div>
              <p>{toCommas(totalAmount)}</p>
              <h2>Total Masukan</h2>
            </div>
            <div>
              <Bag />
            </div>
          </li>

          <li className={styles.listItem}>
            <div>
              <p>{invoices.length}</p>
              <h2>Jumlah Invoices</h2>
            </div>
            <div>
              <Card />
            </div>
          </li>

          <li
            className={styles.listItem}
            style={{ backgroundColor: "#206841", color: "white" }}
          >
            <div>
              <p>{paid.length}</p>
              <h2 style={{ color: "white" }}>Invoice Lunas</h2>
            </div>
            <div>
              <Check />
            </div>
          </li>

          <li className={styles.listItem}>
            <div>
              <p>{partial.length}</p>
              <h2>Invoice Angsuran</h2>
            </div>
            <div>
              <Pie />
            </div>
          </li>

          <li className={styles.listItem}>
            <div>
              <p>{unpaidInvoice.length}</p>
              <h2>Pending Invoice</h2>
            </div>
            <div>
              <Frown />
            </div>
          </li>

          <li className={styles.listItem}>
            <div>
              <p>{overDue.length}</p>
              <h2>Invoice Jatuh Tempo</h2>
            </div>
            <div>
              <Clock />
            </div>
          </li>
        </ul>
      </section>

      {paymentHistory.length !== 0 && (
        <section>
          <Chart paymentHistory={paymentHistory} />
        </section>
      )}

      <section>
        <h1 style={{ textAlign: "center", padding: "30px" }}>
          {paymentHistory.length
            ? "Pembayaran Terbaru"
            : "No payment received yet"}
        </h1>
        <div>
          <div className={styles.table}>
            <table>
              <tbody>
                {paymentHistory.length !== 0 && (
                  <tr>
                    <th style={{ padding: "15px" }}></th>
                    <th style={{ padding: "15px" }}>Dibayar Oleh</th>
                    <th style={{ padding: "15px" }}>Tanggal Pembayaran</th>
                    <th style={{ padding: "15px" }}>Jumlah Pembayaran</th>
                    <th style={{ padding: "15px" }}>Metode Pembayaran</th>
                    <th style={{ padding: "15px" }}>Note</th>
                  </tr>
                )}

                {sortHistoryByDate.slice(-10).map((record) => (
                  <tr className={styles.tableRow} key={record._id}>
                    <td>
                      <button>{record?.paidBy?.charAt(0)}</button>
                    </td>
                    <td>{record.paidBy}</td>
                    <td>{moment(record.datePaid).format("MMMM Do YYYY")}</td>
                    <td>
                      <h3 style={{ color: "#00A86B", fontSize: "14px" }}>
                        {toCommas(record.amountPaid)}
                      </h3>
                    </td>
                    <td>{record.paymentMethod}</td>
                    <td>{record.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
