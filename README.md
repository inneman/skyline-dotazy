# Vizualizace Skyline dotazů

### O projektu

Tento projekt implementuje interaktivní webovou aplikaci pro demonstraci konceptu **skyline dotazů** (skyline queries) a různých algoritmů pro jejich efektivní výpočet. Skyline dotazy umožňují nalezení objektů, které nejsou dominovány jinými objekty v datové sadě podle více kritérií současně.

### Demo

Aplikace je dostupná online na: [odkaz na live demo]

![Screenshot aplikace](screenshot.png)

### Funkce

- Vizualizace notebooků a jejich parametrů ve 2D grafu
- Implementace 4 algoritmů pro výpočet skyline:
  - Brute-force (O(n²))
  - Divide & Conquer (O(n·log²n))
  - Sort Filter Skyline (O(n·log n))
  - Maxima Finding (O(n·log n))
- Interaktivní výběr parametrů pro porovnání
- Pokročilé měření výkonu algoritmů s přesností na nanosekundy
- Vizualizace skyline pomocí "schodovitých" linií

### Instalace a spuštění

#### Požadavky
- Node.js (v14+)
- npm nebo yarn

#### Kroky pro spuštění

1. **Klonování repozitáře:**
   ```bash
   git clone https://github.com/username/skyline-query-explorer.git
   cd skyline-query-explorer
   
2. **Instalace závislostí:**
   ```bash
   npm install

3. **Spuštění vývojového serveru:**
   ```bash
   npm start

4. **Spuštění backend serveru:**
   ```bash
   cd server
   npm install
   npm start

5. **Aplikace dostupná na:**
    http://localhost:3000

### Použité technologie

- **Frontend:** React.js, D3.js, Bootstrap 5
- **Backend:** Node.js, Express.js
- **Datové struktury:** JSON

### Skyline algoritmy

Projekt implementuje následující algoritmy:

1. **Brute-force**  
   Nejjednodušší přístup porovnávající každý bod s každým. Časová složitost **O(n²)**.

2. **Divide & Conquer**  
   Rekurzivní algoritmus rozdělující problém na menší části. Časová složitost **O(n·log²n)**.

3. **Sort Filter Skyline (SFS)**  
   Využívá předřazení bodů podle součtu atributů. Časová složitost **O(n·log n)**.

4. **Maxima Finding**  
   Optimalizovaný algoritmus kombinující předběžné třídění a dynamickou eliminaci. Časová složitost **O(n·log n)**.

### Měření výkonu

Aplikace využívá pokročilý systém měření výkonu:
- Ultra-přesné měření pomocí API `performance.now()`
- Opakované měření (až 10 000 iterací) pro přesné výsledky
- Eliminace vlivu JIT kompilace pomocí "zahřívacích běhů"
- Výsledky měření v nanosekundách i milisekundách

### Autor

Šimon Inneman
