# Grafika Kompjuterike (CCS601) – Ushtrimet dhe detyrat

Ushtrimet e punuara në klasë (Three.js + Vite) dhe tri detyrat shtesë.

## Struktura

| Java | Ushtrimet nga klasa | Detyra |
|------|---------------------|--------|
| Java I | `java i/` – kubi që rrotullohet | `java i/detyra-shtepia/` – shtëpi me cilindra dhe kone |
| Java II | `java ii/` – kubi, sfera, drita, OrbitControls | `java ii/detyra-sistemi-solar/` – sistemi solar me Marsin dhe Phobos |
| Java III | `java iii/solar system/`, `java iii/robotic arm/` | `java iii/detyra-dora-robotike/` – dora robotike e modifikuar |

## Si ekzekutohet

```bash
npm install

npm run shtepia          # Detyra 1
npm run sistemi-solar    # Detyra 2
npm run dora-robotike    # Detyra 3

# ose çdo ushtrim tjetër, p.sh.:
npx vite "java iii/robotic arm"
```

Pastaj hapet adresa që shfaq Vite (zakonisht http://localhost:5173).

## Detyrat

### 1. Shtëpia (Java I)
Ndërtuar vetëm me `CylinderGeometry` dhe `ConeGeometry`:
- muret janë cilindër me 4 segmente (prizëm katror), çatia është kon me 4 segmente (piramidë);
- oxhaku, dera, dritaret e rrumbullakta dhe shkalla janë cilindra;
- kulla anësore është cilindër me kon si çati;
- pemët kanë trung cilindër dhe gjethe prej tre koneve.

### 2. Sistemi solar (Java II)
- U shtua **Marsi** në orbitën e vet (`marsOrbit`), më larg se Toka dhe më i ngadaltë (~1.88 herë).
- U shtua **Phobos**, i cili sillet rreth Marsit përmes `phobosOrbit` (fëmijë i Marsit), shumë shpejt dhe afër.
- U shtuan vija ndihmëse për orbitat.

### 3. Dora robotike (Java III)
- Gishtat kanë **madhësi të ndryshme** (gjatësi dhe gjerësi), secili me dy falanga.
- Gishtat **lëvizin**: perkulen në dy nyje me lëvizje të butë.
- **Gishti i madh** është zhvendosur në **anën e majtë** të shuplakës.

Tastet:

| Tasti | Veprimi |
|-------|---------|
| Q / A | supi |
| W / S | bërryli |
| E / D | kyçja e dorës |
| 1 – 5 | zgjedh gishtin (1 = gishti i madh, 5 = gishti i vogël) |
| 0 | zgjedh të gjithë gishtat |
| R / F | përkul / drejto gishtin e zgjedhur |
| G / H | mbyll grushtin / hap dorën |
