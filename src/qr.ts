import qrcode from "qrcode-generator";

/** The modules of a QR code as one SVG path, with `size` the side of the code and its quiet zone, in modules. */
export interface QrPath {
    size: number;
    path: string;
}

/** Scanners want a margin of four light modules around the code. */
const QUIET_ZONE = 4;

/**
 * A QR code holding `text`, in the smallest version it fits, with medium error correction: a code read off a
 * phone screen at a counter loses more to glare than to damage.
 */
export function qrPath(text: string): QrPath {
    const code = qrcode(0, "M");
    code.addData(text);
    code.make();
    const count = code.getModuleCount();
    const parts: string[] = [];
    for (let row = 0; row < count; row++) {
        for (let column = 0; column < count; column++) {
            if (code.isDark(row, column)) {
                parts.push(`M${column + QUIET_ZONE} ${row + QUIET_ZONE}h1v1h-1z`);
            }
        }
    }
    return { size: count + 2 * QUIET_ZONE, path: parts.join("") };
}
