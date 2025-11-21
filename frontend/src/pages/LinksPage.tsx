import { useEffect, useState } from "react";
import { useApi } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../config/supabase";
import LinkForm from "../components/LinkForm";

export default function LinksPage() {
  const { apiFetch } = useApi();
  const { setAccessToken } = useAuth();
  const [links, setLinks] = useState<any[]>([]);

  async function loadLinks() {
    const items = await apiFetch("/links");
    setLinks(items);
  }

  useEffect(() => {
    loadLinks();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setAccessToken(null);
    window.location.href = "/";
  }

  return (
    <div className="flex w-screen justify-center items-center flex-col pt-[80px]">

    <div className="min-h-screen bg-gray-50 p-8 m-8  w-[1200px]">
      <div className="max-w-3xl mx-auto bg-white ">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 ">Your Links</h1>
          <div>
            <button
              onClick={logout}
              className="py-1 px-3 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Logout
            </button>
          </div>
        </div>

        <section className="mt-6">
          <h3 className="text-lg font-medium text-gray-800">Add a new link</h3>
          <div className="mt-3">
            <LinkForm onSaved={loadLinks} />
          </div>
        </section>

        <ul className="mt-6 space-y-3">
          {links.map((l, i) => (
            <li style={{listStyle: "none", padding: "10px 30px", backgroundColor: `${i%2 === 0 ? '#ff040410' : '#eee'}`}} key={l.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="flex items-center justify-between">
                <div >
                  <div className="font-semibold text-gray-900 dark:text-gray-100"><strong>{l.title}</strong></div>
                  <a className="text-indigo-600" href={l.url} target="_blank" rel="noreferrer">{l.url}</a>
                </div>
                <div className="text-sm text-gray-500">{new Date(l.created_at).toLocaleString()}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  );
}
