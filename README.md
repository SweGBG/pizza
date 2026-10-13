# Pizzeria dell'Anima – Pizza av själen

Napolitansk pizzeria i Göteborg. Next.js 16 + React 19, ren CSS (inga animationsbibliotek, ingen Tailwind).
Byggd av SweGBG.

## Kom igång

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

Packa upp zippen i en **tom** mapp (gamla filer ligger annars kvar och kan bryta bygget).

## Vad som finns

- **Filmen är heron** (`components/FilmHero.tsx`) – fast scen där scrollen spolar en H3-film i fyra kapitel:
  Impasto → Pomodoro → Fuoco → Anima. Bilden zoomar sakta ut medan texten byts, kapitelnavigering till höger
  (på mobil som ett Stories-band överst). Dator spelar `public/video/pizzeria-scene.mp4`, mobil ritar bildsekvensen i
  `public/video/m/` (via `manifest.json`). Saknas filmen visas riktiga foton per kapitel som tonar över i varandra.
- **Manifest** där orden tänds när du scrollar.
- **Meny** som vanlig, snygg meny: Margherita som stort utvalt kort, sedan rutnät med foto, pris med prickad linje och filter (Alla/Rossa/Bianca/Vegansk).
- **Råvaror** i bento-rutnät med foton, **Om oss** med parallax-bilder och siffror som räknar upp,
  **Hitta hit** med öppettider ("Öppet nu" räknat i Europe/Stockholm) och **bokningsformulär** (demo, skickar inget).
- SV/EN med val sparat i webbläsaren, `prefers-reduced-motion`, JSON-LD (Restaurant).

## Ändra innehåll

Allt innehåll – texter, pizzor, priser och öppettider – ligger i `lib/i18n.ts`.
Sätt `NEXT_PUBLIC_SITE_URL` i Vercel till den riktiga adressen (används för delningsbilder).

## Filmen

Genererad lokalt i ComfyUI (MiniMax H3), fyra kedjade 8-sekundersklipp från ovan: Unsplash-foto som startbild,
Figma-bild som slutbild. Workflowfilerna ligger i `ComfyUI/user/default/workflows/Series/Pizzeria/`.
Alla foton: Unsplash (gratislicens, kommersiell användning tillåten). Källor i `CREDITS.txt`.
