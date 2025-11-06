import React, { useEffect } from "react";

const readQuery = (key) => new URLSearchParams(window.location.search).get(key);
const safeDecode = (v) => {
  try { return v ? decodeURIComponent(v) : ""; } catch { return v; }
};
const parseComponents = (str) => {
  if (!str) return [];
  try { return JSON.parse(safeDecode(str)); } catch { return []; }
};

export default function App() {
  const problem_name_te = safeDecode(readQuery("problem_name_te")) || "";
  const problem_name_en = safeDecode(readQuery("problem_name_en")) || "Advisory";
  const category = safeDecode(readQuery("category")) || "-";
  const stage = safeDecode(readQuery("stage")) || "-";
  const symptoms_te = safeDecode(readQuery("symptoms_te")) || "";
  const notes_te = safeDecode(readQuery("notes_te")) || "";
  const components = parseComponents(readQuery("components"));
  const receipt_id = safeDecode(readQuery("receipt_id")) || `ADV-${Date.now()}`;
  const dateIST = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  useEffect(() => {
    (async () => {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      // give DOM & fonts a moment, then open print dialog
      setTimeout(() => window.print(), 800);
    })();
  }, []);

  return (
    <div className="receipt">
      <header>
        <img
          alt="CropSync Logo"
          src="https://app.cropsync.in/logo_v.jpeg"
          className="logo"
        />
        <h2>CropSync</h2>
        <p className="tag">Smart Agricultural Solutions</p>
        <small>www.cropsync.in | Tel: +91-9182867605</small>
      </header>

      <h3 className="title">{problem_name_te || problem_name_en}</h3>

      <p><strong>Category:</strong> {category}</p>
      <p><strong>Stage:</strong> {stage}</p>

      {symptoms_te && (
        <>
          <h4>Symptoms</h4>
          <div className="te">{symptoms_te.split("\n").map((s,i)=><div key={i}>{s}</div>)}</div>
        </>
      )}

      {notes_te && (
        <>
          <h4>Advisory</h4>
          <div className="te">{notes_te.split("\n").map((s,i)=><div key={i}>{s}</div>)}</div>
        </>
      )}

      {components.length > 0 && (
        <>
          <h4>Treatment</h4>
          {components.map((c,i)=>(
            <div key={i} className="block">
              <div><b>{c.component_type || "-"}</b></div>
              <div><b>Name:</b> <span className="te">{c.component_name_te}</span></div>
              {c.dose_te && <div><b>Dose:</b> <span className="te">{c.dose_te}</span></div>}
              {c.application_method_te && <div><b>Method:</b> <span className="te">{c.application_method_te}</span></div>}
              {c.notes_te && <div><b>Note:</b> <span className="te">{c.notes_te}</span></div>}
            </div>
          ))}
        </>
      )}

      <footer>
        <small>Receipt ID: {receipt_id}</small><br/>
        <small>Date: {dateIST} IST</small><br/>
        <small>Thank You for Using CropSync</small>
      </footer>
    </div>
  );
}
