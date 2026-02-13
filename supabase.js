(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.supabase = {}));
})(this, (function (exports) { 'use strict';

    class SupabaseClient {
        constructor(supabaseUrl, supabaseKey, options = {}) {
            this.supabaseUrl = supabaseUrl;
            this.supabaseKey = supabaseKey;
            this.headers = { 
                "X-Client-Info": "supabase-js/2.39.7", 
                Authorization: `Bearer ${supabaseKey}`, 
                apikey: supabaseKey, 
                ...options.headers 
            };
            this.auth = this._initAuth(options);
        }

        _initAuth(options) {
            const authUrl = `${this.supabaseUrl}/auth/v1`;
            return new SupabaseAuthClient({ url: authUrl, headers: this.headers, storage: options.storage });
        }

        // МЕТОД ДЛЯ РАБОТЫ С ТАБЛИЦАМИ
        from(tableName) {
            const tableUrl = `${this.supabaseUrl}/rest/v1/${tableName}`;
            return {
                insert: async (data) => {
                    const res = await fetch(tableUrl, {
                        method: "POST",
                        headers: { 
                            ...this.headers, 
                            "Content-Type": "application/json",
                            "Prefer": "return=minimal" 
                        },
                        body: JSON.stringify(data)
                    });
                    const resData = res.ok ? null : await res.json();
                    return { error: resData };
                },
                select: async () => {
                    const res = await fetch(tableUrl, {
                        method: "GET",
                        headers: this.headers
                    });
                    const data = await res.json();
                    return { data: res.ok ? data : null, error: res.ok ? null : data };
                }
            };
        }
    }

    class SupabaseAuthClient {
        constructor(options) {
            this.url = options.url;
            this.headers = options.headers;
        }

        async getUser() {
            try {
                const res = await fetch(`${this.url}/user`, {
                    method: "GET",
                    headers: this.headers
                });
                const data = await res.json();
                return { data: { user: res.ok ? data : null }, error: res.ok ? null : data };
            } catch (e) {
                return { data: { user: null }, error: e };
            }
        }

        onAuthStateChange(callback) {
            return { data: { subscription: { unsubscribe: () => {} } } };
        }

        async signUp(credentials) {
            const res = await fetch(`${this.url}/signup`, {
                method: "POST",
                headers: { ...this.headers, "Content-Type": "application/json" },
                body: JSON.stringify(credentials)
            });
            const data = await res.json();
            return { data: res.ok ? data : null, error: res.ok ? null : data };
        }

        async signInWithPassword(credentials) {
            const res = await fetch(`${this.url}/token?grant_type=password`, {
                method: "POST",
                headers: { ...this.headers, "Content-Type": "application/json" },
                body: JSON.stringify(credentials)
            });
            const data = await res.json();
            return { data: res.ok ? data : null, error: res.ok ? null : data };
        }

        async resetPasswordForEmail(email, options = {}) {
            const res = await fetch(`${this.url}/recover`, {
                method: "POST",
                headers: { ...this.headers, "Content-Type": "application/json" },
                body: JSON.stringify({ email, ...options })
            });
            const data = await res.json();
            return { data: res.ok ? data : null, error: res.ok ? null : data };
        }

        async updateUser(attributes) {
            const res = await fetch(`${this.url}/user`, {
                method: "PUT",
                headers: { ...this.headers, "Content-Type": "application/json" },
                body: JSON.stringify(attributes)
            });
            const data = await res.json();
            return { data: res.ok ? data : null, error: res.ok ? null : data };
        }

        async signOut() {
            return { error: null };
        }
    }

    const createClient = (supabaseUrl, supabaseKey, options = {}) => {
        return new SupabaseClient(supabaseUrl, supabaseKey, options);
    };

    exports.createClient = createClient;
    exports.SupabaseClient = SupabaseClient;
    Object.defineProperty(exports, '__esModule', { value: true });
}));
