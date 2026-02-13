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
    class Auth {
        constructor(url, headers) {
            this.u = `${url}/auth/v1`;
            this.h = headers;
        }
        async signUp(c) {
            const r = await fetch(`${this.u}/signup`, { method: "POST", headers: this.h, body: JSON.stringify(c) });
            const d = await r.json();
            return { data: r.ok ? d : null, error: r.ok ? null : d };
        }
        async signInWithPassword(c) {
            const r = await fetch(`${this.u}/token?grant_type=password`, { method: "POST", headers: this.h, body: JSON.stringify(c) });
            const d = await r.json();
            return { data: r.ok ? d : null, error: r.ok ? null : d };
        }
        async getUser() {
            const r = await fetch(`${this.u}/user`, { headers: this.h });
            const d = await r.json();
            return { data: { user: r.ok ? d : null }, error: r.ok ? null : d };
        }
        onAuthStateChange(cb) { return { data: { subscription: { unsubscribe: () => {} } } }; }
        async signOut() { return { error: null }; }
    }
    exports.createClient = (url, key) => new SupabaseClient(url, key);
}));
