// Recadre une image sur un rectangle donné (en pixels de l'image d'origine)
// et renvoie un nouveau File. La compression/redimensionnement final est fait
// plus tard à l'upload par compressImage().
export async function cropImage(file, rect) {
    if (!file || !file.type.startsWith("image/")) return file;

    let bitmap;
    try {
        bitmap = await createImageBitmap(file);
    } catch {
        return file;
    }

    const x = Math.max(0, Math.round(rect.x));
    const y = Math.max(0, Math.round(rect.y));
    const width = Math.min(bitmap.width - x, Math.round(rect.width));
    const height = Math.min(bitmap.height - y, Math.round(rect.height));

    if (width <= 0 || height <= 0) {
        bitmap.close?.();
        return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, x, y, width, height, 0, 0, width, height);
    bitmap.close?.();

    const isPng = file.type === "image/png";
    const mime = isPng ? "image/png" : "image/jpeg";
    const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, mime, isPng ? undefined : 0.92)
    );
    if (!blob) return file;

    const ext = isPng ? "png" : "jpg";
    const name = file.name.replace(/\.[^.]+$/, "") + `-recadre.${ext}`;
    return new File([blob], name, { type: mime, lastModified: Date.now() });
}
