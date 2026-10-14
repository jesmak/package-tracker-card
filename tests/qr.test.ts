import { describe, expect, it } from "vitest";

import { qrPath } from "../src/qr";

describe("a QR code", () => {
    it("is the smallest version for a short code, with a margin of four modules", () => {
        const { size, path } = qrPath("582917");
        // Version 1 is 21 modules a side.
        expect(size).toBe(21 + 8);
        // The corner of the top left finder pattern is dark, and the margin before it is not.
        expect(path).toContain("M4 4h1v1h-1z");
        expect(path).not.toMatch(/M[0-3] /);
        expect(path).not.toMatch(/M\d+ [0-3]h/);
    });

    it("grows for a longer text", () => {
        expect(qrPath("JJFI64250000012345678901234567890").size).toBeGreaterThan(29);
    });

    it("differs for a different code", () => {
        expect(qrPath("582917").path).not.toBe(qrPath("582918").path);
    });
});
