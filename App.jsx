import { useState, useEffect } from "react";

const ninjaModes = [
  "גריל",
  "צלייה",
  "טיגון באוויר",
  "אפייה",
  "מחבת",
  "חימום מחדש",
  "ייבוש מזון",
];

const basketTypes = [
  "סלסלת רשת רגילה",
  "סלסלת פיצה",
  "סלסלת ספגטי / פסטה",
  "סלסלת אפייה שטוחה",
  "סלסלת קבב / שיפודים",
  "מגש עם חורים",
  "מגש סגור (ללא חורים)",
  "סלסלת כפולה",
];

const initialForm = {
  dishName: "",
  ninjaMode: "",
  temperature: "",
  cookTime: "",
  basketType: "",
};

export default function NinjaCookingApp() {
  const [form, setForm] = useState(initialForm);
  const [recipes, setRecipes] = useState(() => {
    try {
      const saved = localStorage.getItem("ninja-recipes");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  // Save to localStorage whenever recipes change
  useEffect(() => {
    localStorage.setItem("ninja-recipes", JSON.stringify(recipes));
  }, [recipes]);

  const validate = () => {
    const e = {};
    if (!form.dishName.trim()) e.dishName = "נא להזין שם מאכל";
    if (!form.ninjaMode) e.ninjaMode = "נא לבחור מצב";
    if (!form.temperature || form.temperature < 50 || form.temperature > 260)
      e.temperature = "טמפרטורה בין 50°C ל-260°C";
    if (!form.cookTime || form.cookTime < 1 || form.cookTime > 300)
      e.cookTime = "זמן בין 1 ל-300 דקות";
    return e;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setRecipes((prev) => [{ ...form, id: Date.now() }, ...prev]);
    setForm(initialForm);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  const handleDelete = (id) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div style={styles.root} dir="rtl">
      <div style={styles.header}>
        <div style={styles.logoRow}>
          <span style={styles.logoIcon}>🥷</span>
          <div>
            <div style={styles.logoTitle}>NINJA KITCHEN</div>
            <div style={styles.logoSub}>מתכוני הנינג'ה שלך</div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>⚔️ הוסף מאכל חדש</div>

        <div style={styles.field}>
          <label style={styles.label}><span style={styles.num}>1</span> שם המאכל</label>
          <input
            style={{ ...styles.input, ...(errors.dishName ? styles.inputError : {}) }}
            placeholder="לדוגמה: כנפיים פריכות..."
            value={form.dishName}
            onChange={(e) => handleChange("dishName", e.target.value)}
          />
          {errors.dishName && <div style={styles.err}>{errors.dishName}</div>}
        </div>

        <div style={styles.field}>
          <label style={styles.label}><span style={styles.num}>2</span> מצב הנינג'ה</label>
          <div style={styles.modeGrid}>
            {ninjaModes.map((mode) => (
              <button key={mode} onClick={() => handleChange("ninjaMode", mode)}
                style={{ ...styles.modeBtn, ...(form.ninjaMode === mode ? styles.modeBtnActive : {}) }}>
                {mode}
              </button>
            ))}
          </div>
          {errors.ninjaMode && <div style={styles.err}>{errors.ninjaMode}</div>}
        </div>

        <div style={styles.field}>
          <label style={styles.label}><span style={styles.num}>3</span> טמפרטורה (°C)</label>
          <div style={styles.sliderRow}>
            <input type="range" min={50} max={260} step={5}
              value={form.temperature || 160}
              onChange={(e) => handleChange("temperature", e.target.value)}
              style={styles.slider} />
            <div style={styles.tempBadge}>{form.temperature ? `${form.temperature}°C` : "—"}</div>
          </div>
          <div style={styles.sliderLabels}><span>50°C</span><span>155°C</span><span>260°C</span></div>
          {errors.temperature && <div style={styles.err}>{errors.temperature}</div>}
        </div>

        <div style={styles.field}>
          <label style={styles.label}><span style={styles.num}>4</span> זמן הפעלה (דקות)</label>
          <div style={styles.timeRow}>
            <button style={styles.timeBtn}
              onClick={() => handleChange("cookTime", Math.max(1, parseInt(form.cookTime || 0) - 1))}>−</button>
            <input type="number" min={1} max={300} value={form.cookTime}
              onChange={(e) => handleChange("cookTime", e.target.value)}
              placeholder="0"
              style={{ ...styles.timeInput, ...(errors.cookTime ? styles.inputError : {}) }} />
            <button style={styles.timeBtn}
              onClick={() => handleChange("cookTime", Math.min(300, parseInt(form.cookTime || 0) + 1))}>+</button>
          </div>
          {errors.cookTime && <div style={styles.err}>{errors.cookTime}</div>}
        </div>

        <div style={styles.field}>
          <label style={styles.label}><span style={styles.num}>5</span> סוג הסלסלה</label>
          <div style={styles.modeGrid}>
            {basketTypes.map((basket) => (
              <button key={basket} onClick={() => handleChange("basketType", basket)}
                style={{ ...styles.modeBtn, ...(form.basketType === basket ? styles.modeBtnActive : {}) }}>
                {basket}
              </button>
            ))}
          </div>
        </div>

        <button style={styles.submitBtn} onClick={handleSubmit}>🥷 שמור מאכל</button>
        {submitted && <div style={styles.successBanner}>✅ המאכל נשמר בהצלחה!</div>}
      </div>

      {recipes.length > 0 && (
        <div style={styles.recipeSection}>
          <div style={styles.sectionTitle}>📋 המאכלים שלי ({recipes.length})</div>
          {recipes.map((r) => (
            <div key={r.id} style={styles.recipeCard}>
              <div style={styles.recipeTop}>
                <div style={styles.recipeName}>{r.dishName}</div>
                <button style={styles.deleteBtn} onClick={() => handleDelete(r.id)}>✕</button>
              </div>
              <div style={styles.recipeTags}>
                <span style={styles.tag}>⚙️ {r.ninjaMode}</span>
                <span style={styles.tag}>🌡️ {r.temperature}°C</span>
                <span style={styles.tag}>⏱️ {r.cookTime} דקות</span>
                {r.basketType && <span style={styles.tag}>🧺 {r.basketType}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  root: { minHeight: "100vh", background: "linear-gradient(145deg, #0d0d0d 0%, #1a1a2e 60%, #16213e 100%)", fontFamily: "'Segoe UI', Arial, sans-serif", padding: "0 0 60px 0", color: "#e0e0e0" },
  header: { background: "linear-gradient(90deg, #ff6b00, #e63946)", padding: "22px 24px 18px", marginBottom: 24 },
  logoRow: { display: "flex", alignItems: "center", gap: 14 },
  logoIcon: { fontSize: 42 },
  logoTitle: { fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: 3, textShadow: "0 2px 8px rgba(0,0,0,0.5)" },
  logoSub: { fontSize: 13, color: "rgba(255,255,255,0.85)", letterSpacing: 1, marginTop: 2 },
  card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,107,0,0.25)", borderRadius: 16, margin: "0 16px 24px", padding: "20px 18px" },
  cardTitle: { fontSize: 18, fontWeight: 700, color: "#ff6b00", marginBottom: 20 },
  field: { marginBottom: 22 },
  label: { display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "#ccc", marginBottom: 10 },
  num: { background: "#ff6b00", color: "#fff", borderRadius: "50%", width: 22, height: 22, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 },
  input: { width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "12px 14px", fontSize: 15, color: "#fff", outline: "none" },
  inputError: { border: "1.5px solid #e63946" },
  err: { color: "#e63946", fontSize: 12, marginTop: 5 },
  modeGrid: { display: "flex", flexWrap: "wrap", gap: 8 },
  modeBtn: { background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#ccc", padding: "7px 13px", fontSize: 13, cursor: "pointer" },
  modeBtnActive: { background: "#ff6b00", border: "1.5px solid #ff6b00", color: "#fff", fontWeight: 700, boxShadow: "0 0 12px rgba(255,107,0,0.5)" },
  sliderRow: { display: "flex", alignItems: "center", gap: 14 },
  slider: { flex: 1, accentColor: "#ff6b00", cursor: "pointer" },
  tempBadge: { background: "#ff6b00", color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 15, fontWeight: 700, minWidth: 66, textAlign: "center" },
  sliderLabels: { display: "flex", justifyContent: "space-between", fontSize: 11, color: "#777", marginTop: 4 },
  timeRow: { display: "flex", alignItems: "center", gap: 10 },
  timeBtn: { background: "rgba(255,107,0,0.15)", border: "1.5px solid #ff6b00", color: "#ff6b00", borderRadius: 8, width: 40, height: 40, fontSize: 20, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  timeInput: { width: 90, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 0", fontSize: 20, fontWeight: 700, color: "#fff", textAlign: "center", outline: "none" },
  submitBtn: { width: "100%", background: "linear-gradient(90deg, #ff6b00, #e63946)", border: "none", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 800, padding: "14px 0", cursor: "pointer", letterSpacing: 1, marginTop: 6, boxShadow: "0 4px 20px rgba(255,107,0,0.35)" },
  successBanner: { background: "rgba(39,174,96,0.18)", border: "1px solid #27ae60", borderRadius: 8, color: "#2ecc71", textAlign: "center", padding: "10px", marginTop: 14, fontSize: 14, fontWeight: 600 },
  recipeSection: { margin: "0 16px" },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: "#ff6b00", marginBottom: 12 },
  recipeCard: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,107,0,0.2)", borderRadius: 12, padding: "14px 16px", marginBottom: 12 },
  recipeTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  recipeName: { fontSize: 16, fontWeight: 700, color: "#fff" },
  deleteBtn: { background: "rgba(230,57,70,0.15)", border: "1px solid rgba(230,57,70,0.4)", borderRadius: 6, color: "#e63946", width: 28, height: 28, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" },
  recipeTags: { display: "flex", flexWrap: "wrap", gap: 8 },
  tag: { background: "rgba(255,107,0,0.12)", border: "1px solid rgba(255,107,0,0.3)", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "#ff9a50", fontWeight: 600 },
};
