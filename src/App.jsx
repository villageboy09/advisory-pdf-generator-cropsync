import React, { useEffect, useRef, useState } from "react";

export default function App() {
  const pdfRef = useRef(null);
  const [printReady, setPrintReady] = useState(false);

  const readQuery = (key) => new URLSearchParams(window.location.search).get(key);
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

  const problem_name_te = safeDecode(readQuery("problem_name_te")) || "";
  const problem_name_en = safeDecode(readQuery("problem_name_en")) || "Advisory";
  const category = safeDecode(readQuery("category")) || "-";
  const stage = safeDecode(readQuery("stage")) || "-";
  const symptoms_te = safeDecode(readQuery("symptoms_te")) || "";
  const notes_te = safeDecode(readQuery("notes_te")) || "";
  const components = parseComponents(readQuery("components"));
  const receipt_id = safeDecode(readQuery("receipt_id")) || `ADV-${Date.now()}`;
  const dateIST = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const stage_id = readQuery("stage_id") || 3;

  // ✅ Try auto-print first; fallback to manual tap if blocked
  useEffect(() => {
    const autoPrint = async () => {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      setTimeout(() => {
        try {
          window.print();
          window.onafterprint = () => {
            window.location.href = `https://app.cropsync.in/view_problems_by_stage.php?stage_id=${stage_id}`;
          };
        } catch (e) {
          console.warn("Auto print blocked:", e);
          setPrintReady(true);
        }
      }, 400);
    };
    autoPrint();
  }, [stage_id]);

  // ✅ Manual print trigger (for blocked cases)
  const handleManualPrint = () => {
    window.print();
    window.onafterprint = () => {
      window.location.href = `https://app.cropsync.in/view_problems_by_stage.php?stage_id=${stage_id}`;
    };
  };

  const styles = {
    container: {
      width: "80mm",
      margin: "0 auto",
      padding: "5px",
      fontFamily: "Lexend, 'Noto Sans Telugu', sans-serif",
      fontSize: "9.5px",
      lineHeight: 1.25,
      color: "#000",
    },
    footer: {
      textAlign: "center",
      borderTop: "1px dashed #000",
      fontSize: "8.5px",
      marginTop: "6px",
      paddingTop: "4px",
    },
    telugu: {
      fontFamily: "'Noto Sans Telugu', Lexend",
      fontSize: "9px",
    },
    printBtn: {
      display: "block",
      margin: "20px auto",
      padding: "6px 12px",
      background: "#1976d2",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "12px",
    },
  };

  return (
    <div ref={pdfRef} style={styles.container}>
      {/* your existing content here ... */}
      {/* add fallback button if auto-print blocked */}
      {printReady && (
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <button onClick={handleManualPrint} style={styles.printBtn}>
            Open Print Preview
          </button>
        </div>
      )}
    </div>
  );
}
