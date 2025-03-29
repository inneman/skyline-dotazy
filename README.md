# Skyline Query Explorer

## Semestrální práce z předmětu Algoritmy a datové struktury

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
   cd skyline-query-explorer```

