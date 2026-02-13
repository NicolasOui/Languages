(function (global, factory) {
    global.supabase = {};
    factory(global.supabase);
})(this, (function (exports) {
    class SupabaseClient {
        constructor(url, key) {
            this.url = url;
            this.key = key;
            this.headers = { 
                "Authorization": `Bearer ${key}`, 
                "apikey": key, 
                "Content-Type": "application/json" 
            };
            this.auth = new Auth(url, this.headers);
        }
        from(table) {
            const tUrl = `${this.url}/rest/v1/${table}`;
            return {
                insert: async (data) => {
                    const r = await fetch(tUrl, {
                        method: "POST",
                        headers: { ...this.headers, "Prefer": "return=minimal" },
                        body: JSON.stringify(data)
                    });
                    return { error: r.ok ? null : await r.json() };
                }
            };
        }
    }
    async signUp({ email, password }) {
            const r = await fetch(`${this.u}/signup`, { 
                method: "POST", 
                headers: this.h, 
                body: JSON.stringify({ email, password }) // Явно передаем объект
            });
            const d = await r.json();
            return { data: r.ok ? d : null, error: r.ok ? null : d };
        }
    exports.createClient = (url, key) => new SupabaseClient(url, key);
}));
