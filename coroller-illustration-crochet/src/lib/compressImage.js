// Compression/redimensionnement d'image côté navigateur, sans dépendance.
// - réduit la plus grande dimension à `maxDim`
// - ré-encode en JPEG (ou PNG si la source est un PNG, pour garder la transparence)
// - renvoie le fichier d'origine si la « compression » ne fait pas gagner de poids
export async function compressImage(file, { maxDim = 1600, quality = 0.82 } = {}) {
    if (!file || !file.type.startsWith("image/") || file.type === "image/gif") {
        return file;
    }

    let bitmap;
    try {
        bitmap = await createImageBitmap(file);
    } catch {
        return file; // format illisible par le navigateur : on n'y touche pas
    }

    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));

    // Déjà petite et pas besoin de réduire : on garde l'original.
    if (scale === 1 && file.size < 500 * 1024) {
        bitmap.close?.();
        return file;
    }

    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const isPng = file.type === "image/png";
    const mime = isPng ? "image/png" : "image/jpeg";
    const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, mime, isPng ? undefined : quality)
    );

    if (!blob || blob.size >= file.size) return file;

    const ext = isPng ? "png" : "jpg";
    const name = file.name.replace(/\.[^.]+$/, "") + `.${ext}`;
    return new File([blob], name, { type: mime, lastModified: Date.now() });
}
