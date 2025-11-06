import React, { useEffect, useRef } from "react";

// --- START: NEW PRINT STYLES ---
// Add this new component. It injects CSS specifically for printing.
// This is the only part you need to update in App.js

const PrintStyles = () => (
  <style type="text/css" media="print">
    {`
      @page {
        /* This is the most important rule */
        size: 80mm auto; 
        
        /* Remove printer-added margins */
        margin: 0mm; 
      }
      
      /* Force the body and html to have no margins in print */
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 80mm; /* Be explicit */
      }
      
      /* Target your receipt container for printing */
      #receipt-container {
        /* Remove web-only styles for print */
        margin: 0 !important;
        padding: 5px !important; /* Keep your internal padding */
        box-shadow: none !important;
        border: none !important;
        
        /* Ensure it's the only thing visible */
        position: absolute;
        top: 0;
        left: 0;
      }
    `}
  </style>
);
// --- END: NEW PRINT STYLES ---


const readQuery = (key) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
};

// ... (Your other helper functions 'safeDecode' and 'parseComponents' are perfect) ...
const safeDecode = (v) => {
  try {
    return v ? decodeURIComponent(v) : null;
  } catch {
    return v;
  }
};

const parseComponents = (str) => {
  if (!str) return [];
  try {
    const decoded = safeDecode(str);
    return JSON.parse(decoded);
  } catch {
    return [];
  }
};


export default function App() {
  const pdfRef = useRef(null);

  const problem_name_te = safeDecode(readQuery("problem_name_te")) || "";
  const problem_name_en = safeDecode(readQuery("problem_name_en")) || "Advisory";
  const category = safeDecode(readQuery("category")) || "-";
  const stage = safeDecode(readQuery("stage")) || "-";
  const symptoms_te = safeDecode(readQuery("symptoms_te")) || "";
  const notes_te = safeDecode(readQuery("notes_te")) || "";
  const components = parseComponents(readQuery("components"));
  const receipt_id = safeDecode(readQuery("receipt_id")) || `ADV-${Date.now()}`;
  const dateIST = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  // 🔸 Auto-open print dialog after fonts load
  useEffect(() => {
    const triggerPrint = async () => {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      setTimeout(() => window.print(), 600);
    };
    triggerPrint();
  }, []);

  const styles = {
    container: {
      width: "80mm",
      maxWidth: "80mm",
      margin: "0 auto", // This is fine for web view
      padding: "5px",
      fontFamily: "Lexend, 'Noto Sans Telugu', sans-serif",
      fontSize: "9.5px",
      lineHeight: 1.25,
      color: "#000",
    },
    // ... (All your other 'styles' objects are perfect) ...
    header: {
      textAlign: "center",
      marginBottom: "6px",
      borderBottom: "1px dashed #000",
      paddingBottom: "6px",
    },
    logo: { height: "50px", display: "block", margin: "0 auto 4px" },
    companyName: { fontWeight: "700", fontSize: "12px", margin: "2px 0" },
    companyTag: { fontSize: "9px", fontStyle: "italic", margin: "2px 0" },
    teluguTitle: {
      fontFamily: "'Noto Sans Telugu', Lexend, sans-serif",
      textAlign: "center",
      fontSize: "11px",
      fontWeight: "700",
      marginBottom: "4px",
    },
    infoRow: { marginBottom: "4px" },
    h2: {
      fontSize: "10px",
      fontWeight: "700",
      margin: "6px 0 4px 0",
      borderBottom: "1px solid #000",
      paddingBottom: "2px",
    },
    treatmentItem: {
      margin: "4px 0",
      padding: "3px",
      backgroundColor: "#f5f5f5",
      border: "1px solid #ddd",
      fontSize: "9.5px",
    },
    footer: {
      textAlign: "center",
      borderTop: "1px dashed #000",
      fontSize: "8.5px",
      marginTop: "6px",
      paddingTop: "4px",
    },
    telugu: {
      fontFamily: "'Noto Sans Telugu', Lexend ",
      fontSize: "9px",
    },
  };

  return (
    // Use a React Fragment <> to wrap the styles and the main div
    <>
      {/* ADD THIS COMPONENT */}
      <PrintStyles />
      
      {/* ADD id="receipt-container" TO THIS DIV */}
      <div ref={pdfRef} id="receipt-container" style={styles.container}>
        
        {/* ... (All your existing receipt JSX content) ... */}
        
        <div style={styles.header}>
          <img
            alt="CropSync Logo"
            src="https://app.cropsync.in/logo_v.jpeg"
            style={styles.logo}
          />
          <div style={styles.companyName}>CropSync</div>
          <div style={styles.companyTag}>Smart Agricultural Solutions</div>
          <div style={{ fontSize: "9px" }}>
            www.cropsync.in | Tel: +91-9182867605
          </div>
        </div>

        <div style={styles.teluguTitle}>
          {problem_name_te || problem_name_en}
        </div>

        {/* ... (Rest of your code is perfect) ... */}

        <div style={styles.infoRow}>
          <strong>Category:</strong> {category}
        </div>
        <div style={styles.infoRow}>
          <strong>Stage:</strong> {stage}
        </div>

        {symptoms_te && (
          <>
            <div style={styles.h2}>Symptoms</div>
            <div style={styles.telugu}>
              {symptoms_te.split("\n").map((s, i) => (
                <div key={i}>{s}</div>
              ))}
            </div>
          </>
        )}

        {notes_te && (
          <>
            <div style={styles.h2}>Advisory</div>
            <div style={styles.telugu}>
              {notes_te.split("\n").map((s, i) => (
                <div key={i}>{s}</div>
              ))}
            </div>
          </>
        )}

        {components?.length > 0 && (
          <>
            <div style={styles.h2}>Treatment</div>
            {components.map((c, i) => (
              <div key={i} style={styles.treatmentItem}>
                <div style={{ fontWeight: "700" }}>{c.component_type || "-"}</div>
                <div>
                  <strong>Name:</strong>{" "}
                  <span style={styles.telugu}>{c.component_name_te || "-"}</span>
                </div>
                {c.dose_te && (
                  <div>
                    <strong>Dose:</strong>{" "}
                    <span style={styles.telugu}>{c.dose_te}</span>
                  </div>
                )}
                {c.application_method_te && (
                  <div>
                    <strong>Method:</strong>{" "}
                    <span style={styles.telugu}>{c.application_method_te}</span>
                  </div>
                )}
                {c.notes_te && (
                  <div>
                    <strong>Note:</strong>{" "}
                    <span style={styles.telugu}>{c.notes_te}</span>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        <div style={styles.footer}>
          <div>Receipt ID: {receipt_id}</div>
          <div>Date: {dateIST} IST</div>
          <div>Thank You for Using CropSync</div>
        </div>
      </div>
    </>
  );
}