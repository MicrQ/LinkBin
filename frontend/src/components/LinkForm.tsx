import { useState } from "react";
import { useApi } from "../lib/api";

export default function LinkForm({ onSaved }: { onSaved: () => void }) {
  const { apiFetch } = useApi();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      await apiFetch("/links", {
        method: "POST",
        body: JSON.stringify({ title, url }),
      });

      setTitle("");
      setUrl("");
      onSaved();
    } catch (err) {
      console.error(err);
      alert("Failed to save link");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ width: "1000px", display: "flex", gap: "15px" }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
                    style={{ width: "20rem", padding: "18px" , backgroundColor: "#c968b444", fontSize: "16px", color: "black"}}

        />

        <input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: "20rem", padding: "18px" , backgroundColor: "#c968b444", fontSize: "16px", color: "black"}}

        />

        <button disabled={saving}>
          {saving ? "Adding…" : "Add Link"}
        </button>
      </form>
      <br />
      <br />
    </div>
  );
}
