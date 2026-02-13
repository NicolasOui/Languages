(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.supabase = {}));
})(this, (function (exports) { 'use strict';
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
        for (var name in all) __defProp(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
            for (let key of __getOwnPropNames(from))
                if (!__hasOwnProp.call(to, key) && key !== except)
                    __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
    const STORAGE_KEY = "supabase.auth.token";
    const DEFAULT_HEADERS = { "X-Client-Info": "supabase-js/2.39.7" };
    class SupabaseClient {
        constructor(supabaseUrl, supabaseKey, options = {}) {
            this.supabaseUrl = supabaseUrl;
            this.supabaseKey = supabaseKey;
            this.headers = { ...DEFAULT_HEADERS, Authorization: `Bearer ${supabaseKey}`, apikey: supabaseKey, ...options.headers };
            this.auth = this._initAuth(options);
        }
        _initAuth(options) {
            const authUrl = `${this.supabaseUrl}/auth/v1`;
            return new SupabaseAuthClient({ url: authUrl, headers: this.headers, storage: options.storage });
        }
    }
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
                    return { error: res.ok ? null : await res.json() };
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
            console.log("Слушатель событий активен");
            return { data: { subscription: { unsubscribe: () => {} } } };
        }
        async signInWithPassword(credentials) {
            const res = await fetch(`${this.url}/token?grant_type=password`, {
                method: "POST",
                headers: { ...this.headers, "Content-Type": "application/json" },
                body: JSON.stringify(credentials)
            });
            return await res.json();
        }
        async resetPasswordForEmail(email, options = {}) {
            const res = await fetch(`${this.url}/recover`, {
                method: "POST",
                headers: { ...this.headers, "Content-Type": "application/json" },
                body: JSON.stringify({ email, ...options })
            });
            return await res.json();
        }
        async updateUser(attributes) {
            const res = await fetch(`${this.url}/user`, {
                method: "PUT",
                headers: { ...this.headers, "Content-Type": "application/json" },
                body: JSON.stringify(attributes)
            });
            return await res.json();
        }
    }
    const createClient = (supabaseUrl, supabaseKey, options = {}) => {
        return new SupabaseClient(supabaseUrl, supabaseKey, options);
    };
    exports.createClient = createClient;
    exports.SupabaseClient = SupabaseClient;
    Object.defineProperty(exports, '__esModule', { value: true });
}));
