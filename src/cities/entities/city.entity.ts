// To parse this data:
//
//   import { Convert, City } from "./file";
//
//   const city = Convert.toCity(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface City {
    readonly name:           string;
    readonly nameAlt:        string;
    readonly label:          string;
    readonly type:           string;
    readonly typeShort:      string;
    readonly contentType:    string;
    readonly id:             string;
    readonly okato:          string;
    readonly oktmo:          string;
    readonly guid:           string;
    readonly isDualName:     boolean;
    readonly isCapital:      boolean;
    readonly zip:            number;
    readonly population:     number;
    readonly yearFounded:    number;
    readonly yearCityStatus: number;
    readonly nameEn:         string;
    readonly namecase:       Namecase;
    readonly coords:         Coords;
    readonly timezone:       Timezone;
    readonly region:         Region;
}

export interface Coords {
    readonly lat: number;
    readonly lon: number;
}

export interface Namecase {
    readonly nominative:    string;
    readonly genitive:      string;
    readonly dative:        string;
    readonly accusative:    string;
    readonly ablative:      string;
    readonly prepositional: string;
    readonly locative:      string;
}

export interface Region {
    readonly name:           string;
    readonly label:          string;
    readonly type:           string;
    readonly typeShort:      string;
    readonly contentType:    string;
    readonly id:             string;
    readonly okato:          string;
    readonly oktmo:          string;
    readonly guid:           string;
    readonly code:           string;
    readonly iso31662:       string;
    readonly population:     number;
    readonly yearFounded:    number;
    readonly area:           number;
    readonly fullname:       string;
    readonly unofficialName: string;
    readonly nameEn:         string;
    readonly district:       string;
    readonly namecase:       Namecase;
    readonly capital:        Capital;
}

export interface Capital {
    readonly name:        string;
    readonly label:       string;
    readonly id:          string;
    readonly okato:       string;
    readonly oktmo:       string;
    readonly contentType: string;
}

export interface Timezone {
    readonly tzid:         string;
    readonly abbreviation: string;
    readonly utcOffset:    string;
    readonly mskOffset:    string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toCity(json: string): City {
        return cast(JSON.parse(json), r("City"));
    }

    public static cityToJson(value: City): string {
        return JSON.stringify(uncast(value, r("City")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "City": o([
        { json: "name", js: "name", typ: "" },
        { json: "name_alt", js: "nameAlt", typ: "" },
        { json: "label", js: "label", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "typeShort", js: "typeShort", typ: "" },
        { json: "contentType", js: "contentType", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "okato", js: "okato", typ: "" },
        { json: "oktmo", js: "oktmo", typ: "" },
        { json: "guid", js: "guid", typ: "" },
        { json: "isDualName", js: "isDualName", typ: true },
        { json: "isCapital", js: "isCapital", typ: true },
        { json: "zip", js: "zip", typ: 0 },
        { json: "population", js: "population", typ: 0 },
        { json: "yearFounded", js: "yearFounded", typ: 0 },
        { json: "yearCityStatus", js: "yearCityStatus", typ: 0 },
        { json: "name_en", js: "nameEn", typ: "" },
        { json: "namecase", js: "namecase", typ: r("Namecase") },
        { json: "coords", js: "coords", typ: r("Coords") },
        { json: "timezone", js: "timezone", typ: r("Timezone") },
        { json: "region", js: "region", typ: r("Region") },
    ], false),
    "Coords": o([
        { json: "lat", js: "lat", typ: 3.14 },
        { json: "lon", js: "lon", typ: 3.14 },
    ], false),
    "Namecase": o([
        { json: "nominative", js: "nominative", typ: "" },
        { json: "genitive", js: "genitive", typ: "" },
        { json: "dative", js: "dative", typ: "" },
        { json: "accusative", js: "accusative", typ: "" },
        { json: "ablative", js: "ablative", typ: "" },
        { json: "prepositional", js: "prepositional", typ: "" },
        { json: "locative", js: "locative", typ: "" },
    ], false),
    "Region": o([
        { json: "name", js: "name", typ: "" },
        { json: "label", js: "label", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "typeShort", js: "typeShort", typ: "" },
        { json: "contentType", js: "contentType", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "okato", js: "okato", typ: "" },
        { json: "oktmo", js: "oktmo", typ: "" },
        { json: "guid", js: "guid", typ: "" },
        { json: "code", js: "code", typ: "" },
        { json: "iso_3166-2", js: "iso31662", typ: "" },
        { json: "population", js: "population", typ: 0 },
        { json: "yearFounded", js: "yearFounded", typ: 0 },
        { json: "area", js: "area", typ: 0 },
        { json: "fullname", js: "fullname", typ: "" },
        { json: "unofficialName", js: "unofficialName", typ: "" },
        { json: "name_en", js: "nameEn", typ: "" },
        { json: "district", js: "district", typ: "" },
        { json: "namecase", js: "namecase", typ: r("Namecase") },
        { json: "capital", js: "capital", typ: r("Capital") },
    ], false),
    "Capital": o([
        { json: "name", js: "name", typ: "" },
        { json: "label", js: "label", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "okato", js: "okato", typ: "" },
        { json: "oktmo", js: "oktmo", typ: "" },
        { json: "contentType", js: "contentType", typ: "" },
    ], false),
    "Timezone": o([
        { json: "tzid", js: "tzid", typ: "" },
        { json: "abbreviation", js: "abbreviation", typ: "" },
        { json: "utcOffset", js: "utcOffset", typ: "" },
        { json: "mskOffset", js: "mskOffset", typ: "" },
    ], false),
};
