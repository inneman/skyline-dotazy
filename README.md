# Skyline Queries

## Spuštění klienta a serveru

1. Naklonujte repositář do lokálního počítače.
2. Přepněte se do složky projektu.
3. Nainstalujte knihovny pomocí příkazu `npm install` ve složkách `client` a `server`.
4. Spusťte server:

   ```bash
   cd server
   node index.js
   ```

   Backend poběží na adrese `http://localhost:3001`

5. Spusťte klientskou aplikaci:

   ```bash
   cd ../src
   npm start
   ```

   Frontend se otevře na `http://localhost:3000`

> Je třeba mít nainstalovaný Node.js (verze 14+) a npm.

---

## Popis projektu

Tento projekt implementuje interaktivní webovou aplikaci pro demonstraci konceptu **skyline dotazů** nad daty notebooků. Cílem je porovnání různých algoritmů pro výpočet skyline a jejich vizualizace.

Uživatel vybírá dvě vlastnosti notebooků (např. výkon a cena) a výsledkem je graf s body (notebooky) a schodovitou skyline křivkou, která zobrazuje nedominované produkty.

---

## Použité algoritmy

V aplikaci jsou implementovány 4 skyline algoritmy:

- **Brute-force** (O(n²))
- **Divide & Conquer** (O(n log² n))
- **Sort Filter Skyline (SFS)** (O(n log n))
- **Maxima Finding** (O(n log n))

---

## Implementace

- **Frontend:** React.js, D3.js, Bootstrap 5
- **Backend:** Node.js, Express.js
- **Benchmark:** `performance.now()` a Benchmark.js
- **Datový formát:** JSON
- **Zobrazení:** interaktivní scatter plot (Recharts) s vlastním tooltipem

---

## Vizualizace a interaktivita

- Zobrazení notebooků v 2D grafu podle zvolených atributů
- Schodovitá skyline čára spojující nedominované body
- Interaktivní legenda, tooltipy a tabulka dat
- Dynamické filtrování a změna směru optimalizace (např. max/min cena)

---

## Měření výkonu (Experimenty)

Součástí aplikace je komponenta `PerformanceChart`, která:

- Spouští výpočet skyline na **10 000 generovaných notebooků**
- Měří čas pomocí `performance.now()` s přesností na milisekundy
- Pro každý algoritmus zobrazí dobu v ns a počet bodů ve skyline

Ukázkové hodnoty:

| Algoritmus       | Čas (ns)   | Počet bodů |
|------------------|-------------|---------------|
| Maxima Finding   | 82 000 000 | 314           |
| SFS              | 110 000 000 | 314           |
| Divide & Conquer | 245 000 000 | 314           |
| Brute-force      | 890 000 000 | 314           |

> Data jsou generována pseudo-náhodně v realistických rozsazích (např. cena 15k–90k, výkon 60–100).

---

## Diskuze

Při návrhu řešení byla hlavní prioritou přehlednost a jednoduchost použití. Místo benchmarkovacích knihoven byl pro přesné měření doby výpočtu použit performance.now() s ručně měřeným jednorázovým průchodem algoritmu nad datasetem o 10 000 prvcích. Tato velikost byla zvolena záměrně jako kompromis — pro menší datasety jsou rozdíly mezi algoritmy velmi malé a hůře viditelné, zatímco větší datasety mohou způsobovat zátěž v prohlížeči nebo zbytečně zdržovat běh měření. Díky tomu lze porovnat algoritmy rychle a názorně bez potřeby složitého ladění nebo vícenásobného opakování. Kromě toho aplikace zachovává jednoduché a rychlé UI bez zatížení prohlížeče a měření se provádí okamžitě po kliknutí tlačítka.

## Závěr

Aplikace slouží jako demonstrační nástroj pro vizualizaci a testování skyline dotazů. Nabízí interaktivní grafické rozhraní, porovnání algoritmů, výkonové testy a podporuje přímou analýzu vztahů mezi atributy produktů.

Autor: **Šimon Inneman**

