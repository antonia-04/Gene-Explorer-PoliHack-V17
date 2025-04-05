// src/utils/formatBioGPTResponse.js
export function formatBioGPTResponse(rawText) {
  if (!rawText) return "";

  // ✅ Eliminăm antetul de la LLM
  let text = rawText.replace(/<\|start_header_id\|>.*?(?=\n|$)/gis, "").trim();

  // ✅ Titluri boldate
  text = text.replace(/\*\*(.*?)\*\*/g, "<h3 class='text-sm font-semibold text-blue-800 mb-2 mt-4'>$1</h3>");

  // ✅ Liste fără numerotare
  text = text.replace(/(\*|-)\s+(.*?)(?=\n\*|\n-|$)/gs, (_, bullet, item) => {
    return `<li class='ml-4 list-none text-xs text-gray-700'>${item.trim()}</li>`;
  });

  // ✅ Învelim <li> în <ul> (fără bullets)
  text = text.replace(/(<li.*?>[\s\S]*?<\/li>)+/g, match => `<ul class='pl-4 mb-3'>${match}</ul>`);

  // ✅ Paragrafe clasice
  text = text
    .split(/\n+/)
    .map(p => {
      if (p.startsWith("<h3") || p.startsWith("<ul>") || p.startsWith("<li>")) return p;
      return `<p class='text-xs text-gray-800 mb-2 leading-snug'>${p.trim()}</p>`;
    })
    .join("\n");

  return text;
}
