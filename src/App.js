import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";

// Register the necessary components of Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const App = () => {
  const [doctor, setDoctor] = useState("");
  const [patient, setPatient] = useState("");
  const [parameter1, setParameter1] = useState("");
  const [parameter2, setParameter2] = useState("");
  const [plot, setPlot] = useState("");
  const [chartData, setChartData] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8000/api/simulate/", {
        doctor,
        patient,
        parameter1,
        parameter2,
      })
      .then((response) => {
        setPlot(`data:image/png;base64,${response.data.plot}`);
        const { x, y } = response.data.result;
        setChartData({
          labels: x,
          datasets: [
            {
              label: `Simulation: ${doctor} - ${patient}`,
              data: y,
              borderColor: "#6200EE", // Modern purple color
              borderWidth: 3,
              fill: false,
            },
          ],
        });
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    return () => {
      if (chartData) {
        // Cleanup: Optionally destroy chart if needed
      }
    };
  }, [chartData]);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Apollo Information Centre - Simulation</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Doctor Name:</label>
          <input
            type="text"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Patient Name:</label>
          <input
            type="text"
            value={patient}
            onChange={(e) => setPatient(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Parameter 1:</label>
          <input
            type="number"
            value={parameter1}
            onChange={(e) => setParameter1(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Parameter 2:</label>
          <input
            type="number"
            value={parameter2}
            onChange={(e) => setParameter2(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          Run Simulation
        </button>
      </form>

      {plot && <img src={plot} alt="Simulation Plot" style={styles.plotImage} />}
      {chartData && (
        <div style={styles.chartContainer}>
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "50px 20px",
    backgroundColor: "#f8f9fa", // Soft background color
    minHeight: "100vh",
    fontFamily: "'Helvetica Neue', sans-serif", // Sleek modern font
    transition: "all 0.3s ease",
  },
  heading: {
    fontSize: "3rem",
    color: "#333",
    marginBottom: "40px",
    textAlign: "center",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1px",
    animation: "fadeIn 1.5s ease-in-out", // Added fade-in animation
  },
  form: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "700px",
    transition: "box-shadow 0.3s ease",
  },
  inputGroup: {
    marginBottom: "25px",
  },
  label: {
    display: "block",
    fontSize: "1.2rem",
    color: "#555",
    marginBottom: "10px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "15px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    fontSize: "1.1rem",
    outline: "none",
    transition: "border-color 0.3s ease-in-out",
    marginBottom: "15px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.05)",
  },
  button: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#6200EE", // Deep purple color
    color: "#fff",
    fontSize: "1.3rem",
    fontWeight: "600",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out, transform 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#3700B3", // Darker purple on hover
    transform: "scale(1.05)",
  },
  plotImage: {
    marginTop: "30px",
    maxWidth: "100%",
    borderRadius: "15px",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
  },
  chartContainer: {
    marginTop: "50px",
    width: "100%",
    maxWidth: "700px",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
    borderRadius: "15px",
    padding: "20px",
    backgroundColor: "#fff",
    animation: "fadeIn 2s ease-in-out",
  },
};

export default App;
