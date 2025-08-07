import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "./App.css";

const RECAPTCHA_SITE_KEY = "6Lf-j3ErAAAAAJ1T6AVfBSLfdwweebKCnCoP4_gd"; // replace with your own

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState("");

  const recaptchaRef = useRef();

  const handleSubmit = async () => {
    // if (!selectedFile || !fileType) {
    //   setMessage("Please select a file and type");
    //   return;
    // }

    // Execute invisible reCAPTCHA
    const token = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset(); // reset for next use

    console.log("reCAPTCHA token:", token);

    const response = await fetch(`http://localhost:4000/verify-recaptcha`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    const { score } = data;

    console.log("reCAPTCHA data:", data);

    if (score < 0.5) {
      alert(`reCAPTCHA score: ${score} likely bot`);
      return;
    }
    alert(`reCAPTCHA score: ${score} likely human`);
  };

  return (
    <>
      <section className="card">
        <p>some patient details</p>
      </section>

      <section className="card">
        <p>another patient details</p>
      </section>

      <section className="card flex-card" id="form">
        <select
          value={fileType}
          id="dropdown_action"
          onChange={(e) => setFileType(e.target.value)}
          style={{ margin: "10px 0", width: "40%" }}
        >
          <option value="">Select file type</option>
          <option value="accept">Accept</option>
          <option value="reject">Reject</option>
        </select>

        <input
          type="file"
          id="fileInput"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />

        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{fileType}</td>
              <td>{selectedFile ? selectedFile.name : ""}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="card last-section" id="submit-section">
        <button className="primary" id="accept" onClick={handleSubmit}>
          Accept
        </button>
        <button className="danger">Reject</button>
        <ReCAPTCHA
          sitekey={RECAPTCHA_SITE_KEY}
          size="invisible"
          ref={recaptchaRef}
          badge="bottomright"
        />
      </section>
    </>
  );
}
