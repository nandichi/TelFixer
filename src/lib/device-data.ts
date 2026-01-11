// Complete device database with brands and models for 2024-2026
// Last updated: January 2026

export const deviceTypes = [
  { value: "telefoon", label: "Telefoon" },
  { value: "tablet", label: "Tablet" },
  { value: "laptop", label: "Laptop" },
  { value: "accessoire", label: "Accessoire" },
];

export const brandsByType: Record<string, { value: string; label: string }[]> =
  {
    telefoon: [
      { value: "apple", label: "Apple" },
      { value: "samsung", label: "Samsung" },
      { value: "google", label: "Google" },
      { value: "oneplus", label: "OnePlus" },
      { value: "xiaomi", label: "Xiaomi" },
      { value: "huawei", label: "Huawei" },
      { value: "oppo", label: "OPPO" },
      { value: "motorola", label: "Motorola" },
      { value: "sony", label: "Sony" },
      { value: "nokia", label: "Nokia" },
      { value: "honor", label: "Honor" },
      { value: "realme", label: "Realme" },
      { value: "vivo", label: "Vivo" },
      { value: "nothing", label: "Nothing" },
      { value: "fairphone", label: "Fairphone" },
      { value: "anders", label: "Anders" },
    ],
    tablet: [
      { value: "apple", label: "Apple" },
      { value: "samsung", label: "Samsung" },
      { value: "microsoft", label: "Microsoft" },
      { value: "lenovo", label: "Lenovo" },
      { value: "huawei", label: "Huawei" },
      { value: "xiaomi", label: "Xiaomi" },
      { value: "amazon", label: "Amazon" },
      { value: "anders", label: "Anders" },
    ],
    laptop: [
      { value: "apple", label: "Apple" },
      { value: "lenovo", label: "Lenovo" },
      { value: "hp", label: "HP" },
      { value: "dell", label: "Dell" },
      { value: "asus", label: "ASUS" },
      { value: "acer", label: "Acer" },
      { value: "microsoft", label: "Microsoft" },
      { value: "msi", label: "MSI" },
      { value: "razer", label: "Razer" },
      { value: "samsung", label: "Samsung" },
      { value: "huawei", label: "Huawei" },
      { value: "anders", label: "Anders" },
    ],
    accessoire: [
      { value: "apple", label: "Apple" },
      { value: "samsung", label: "Samsung" },
      { value: "sony", label: "Sony" },
      { value: "bose", label: "Bose" },
      { value: "jabra", label: "Jabra" },
      { value: "anders", label: "Anders" },
    ],
  };

// Complete models database organized by device type and brand
export const modelsByTypeAndBrand: Record<string, Record<string, string[]>> = {
  telefoon: {
    apple: [
      // iPhone 16 serie (2024)
      "iPhone 16",
      "iPhone 16 Plus",
      "iPhone 16 Pro",
      "iPhone 16 Pro Max",
      // iPhone 15 serie (2023)
      "iPhone 15",
      "iPhone 15 Plus",
      "iPhone 15 Pro",
      "iPhone 15 Pro Max",
      // iPhone 14 serie (2022)
      "iPhone 14",
      "iPhone 14 Plus",
      "iPhone 14 Pro",
      "iPhone 14 Pro Max",
      // iPhone 13 serie (2021)
      "iPhone 13",
      "iPhone 13 Mini",
      "iPhone 13 Pro",
      "iPhone 13 Pro Max",
      // iPhone 12 serie (2020)
      "iPhone 12",
      "iPhone 12 Mini",
      "iPhone 12 Pro",
      "iPhone 12 Pro Max",
      // iPhone 11 serie (2019)
      "iPhone 11",
      "iPhone 11 Pro",
      "iPhone 11 Pro Max",
      // iPhone X serie
      "iPhone XS",
      "iPhone XS Max",
      "iPhone XR",
      "iPhone X",
      // iPhone SE serie
      "iPhone SE (2024)",
      "iPhone SE (2022)",
      "iPhone SE (2020)",
      // Oudere modellen
      "iPhone 8",
      "iPhone 8 Plus",
      "iPhone 7",
      "iPhone 7 Plus",
      "iPhone 6s",
      "iPhone 6s Plus",
    ],
    samsung: [
      // Galaxy S26 serie (2026)
      "Galaxy S26",
      "Galaxy S26+",
      "Galaxy S26 Ultra",
      // Galaxy S25 serie (2025)
      "Galaxy S25",
      "Galaxy S25+",
      "Galaxy S25 Ultra",
      // Galaxy S24 serie (2024)
      "Galaxy S24",
      "Galaxy S24+",
      "Galaxy S24 Ultra",
      "Galaxy S24 FE",
      // Galaxy S23 serie (2023)
      "Galaxy S23",
      "Galaxy S23+",
      "Galaxy S23 Ultra",
      "Galaxy S23 FE",
      // Galaxy S22 serie (2022)
      "Galaxy S22",
      "Galaxy S22+",
      "Galaxy S22 Ultra",
      // Galaxy S21 serie (2021)
      "Galaxy S21",
      "Galaxy S21+",
      "Galaxy S21 Ultra",
      "Galaxy S21 FE",
      // Galaxy S20 serie
      "Galaxy S20",
      "Galaxy S20+",
      "Galaxy S20 Ultra",
      "Galaxy S20 FE",
      // Galaxy Z serie (Foldables)
      "Galaxy Z Fold 6",
      "Galaxy Z Fold 5",
      "Galaxy Z Fold 4",
      "Galaxy Z Fold 3",
      "Galaxy Z Flip 6",
      "Galaxy Z Flip 5",
      "Galaxy Z Flip 4",
      "Galaxy Z Flip 3",
      // Galaxy A serie (2024-2026)
      "Galaxy A56",
      "Galaxy A55",
      "Galaxy A54",
      "Galaxy A53",
      "Galaxy A52",
      "Galaxy A36",
      "Galaxy A35",
      "Galaxy A34",
      "Galaxy A33",
      "Galaxy A25",
      "Galaxy A24",
      "Galaxy A16",
      "Galaxy A15",
      "Galaxy A14",
      // Galaxy M serie
      "Galaxy M55",
      "Galaxy M54",
      "Galaxy M34",
      "Galaxy M14",
      // Galaxy Note serie
      "Galaxy Note 20 Ultra",
      "Galaxy Note 20",
      "Galaxy Note 10+",
      "Galaxy Note 10",
    ],
    google: [
      // Pixel 9 serie (2024)
      "Pixel 9",
      "Pixel 9 Pro",
      "Pixel 9 Pro XL",
      "Pixel 9 Pro Fold",
      // Pixel 8 serie (2023)
      "Pixel 8",
      "Pixel 8 Pro",
      "Pixel 8a",
      // Pixel 7 serie (2022)
      "Pixel 7",
      "Pixel 7 Pro",
      "Pixel 7a",
      // Pixel 6 serie (2021)
      "Pixel 6",
      "Pixel 6 Pro",
      "Pixel 6a",
      // Pixel Fold
      "Pixel Fold",
      // Oudere modellen
      "Pixel 5",
      "Pixel 5a",
      "Pixel 4",
      "Pixel 4 XL",
      "Pixel 4a",
    ],
    oneplus: [
      // OnePlus 13 serie (2025)
      "OnePlus 13",
      "OnePlus 13 Pro",
      // OnePlus 12 serie (2024)
      "OnePlus 12",
      "OnePlus 12R",
      // OnePlus 11 serie (2023)
      "OnePlus 11",
      "OnePlus 11R",
      // OnePlus Open (Foldable)
      "OnePlus Open",
      // OnePlus Nord serie
      "OnePlus Nord 4",
      "OnePlus Nord 3",
      "OnePlus Nord CE 4",
      "OnePlus Nord CE 3 Lite",
      "OnePlus Nord N30",
      // Oudere modellen
      "OnePlus 10 Pro",
      "OnePlus 10T",
      "OnePlus 9 Pro",
      "OnePlus 9",
      "OnePlus 8 Pro",
      "OnePlus 8T",
    ],
    xiaomi: [
      // Xiaomi 14 serie (2024)
      "Xiaomi 14",
      "Xiaomi 14 Pro",
      "Xiaomi 14 Ultra",
      // Xiaomi 13 serie (2023)
      "Xiaomi 13",
      "Xiaomi 13 Pro",
      "Xiaomi 13 Ultra",
      "Xiaomi 13T",
      "Xiaomi 13T Pro",
      // Xiaomi 12 serie
      "Xiaomi 12",
      "Xiaomi 12 Pro",
      "Xiaomi 12 Lite",
      // Xiaomi Mix serie
      "Xiaomi Mix Fold 4",
      "Xiaomi Mix Fold 3",
      "Xiaomi Mix Flip",
      // Redmi Note serie
      "Redmi Note 14 Pro+",
      "Redmi Note 14 Pro",
      "Redmi Note 14",
      "Redmi Note 13 Pro+",
      "Redmi Note 13 Pro",
      "Redmi Note 13",
      "Redmi Note 12 Pro+",
      "Redmi Note 12 Pro",
      "Redmi Note 12",
      // Redmi serie
      "Redmi 14C",
      "Redmi 13C",
      "Redmi 13",
      "Redmi 12",
      // POCO serie
      "POCO F6 Pro",
      "POCO F6",
      "POCO X6 Pro",
      "POCO X6",
      "POCO M6 Pro",
    ],
    huawei: [
      // P serie
      "P60 Pro",
      "P60",
      "P50 Pro",
      "P50",
      "P40 Pro+",
      "P40 Pro",
      "P40",
      "P30 Pro",
      "P30",
      // Mate serie
      "Mate 60 Pro+",
      "Mate 60 Pro",
      "Mate 60",
      "Mate 50 Pro",
      "Mate 50",
      "Mate X5",
      "Mate X3",
      "Mate 40 Pro",
      "Mate 30 Pro",
      // Nova serie
      "Nova 12 Ultra",
      "Nova 12 Pro",
      "Nova 12",
      "Nova 11 Pro",
      "Nova 11",
      "Nova 10 Pro",
    ],
    oppo: [
      // Find serie
      "Find X7 Ultra",
      "Find X7 Pro",
      "Find X7",
      "Find X6 Pro",
      "Find X5 Pro",
      "Find N3 Flip",
      "Find N3",
      // Reno serie
      "Reno 12 Pro",
      "Reno 12",
      "Reno 11 Pro",
      "Reno 11",
      "Reno 10 Pro+",
      "Reno 10 Pro",
      "Reno 10",
      // A serie
      "A98",
      "A79",
      "A78",
      "A60",
      "A38",
    ],
    motorola: [
      // Edge serie
      "Edge 50 Ultra",
      "Edge 50 Pro",
      "Edge 50",
      "Edge 40 Pro",
      "Edge 40",
      // Razr serie (Foldables)
      "Razr 50 Ultra",
      "Razr 50",
      "Razr 40 Ultra",
      "Razr 40",
      // Moto G serie
      "Moto G85",
      "Moto G84",
      "Moto G54",
      "Moto G34",
      "Moto G Power (2024)",
      "Moto G Stylus (2024)",
      // ThinkPhone
      "ThinkPhone",
    ],
    sony: [
      "Xperia 1 VI",
      "Xperia 1 V",
      "Xperia 5 V",
      "Xperia 5 IV",
      "Xperia 10 VI",
      "Xperia 10 V",
      "Xperia Pro-I",
    ],
    nokia: [
      "Nokia X30",
      "Nokia G60",
      "Nokia G42",
      "Nokia G22",
      "Nokia C32",
      "Nokia C22",
    ],
    honor: [
      "Honor Magic 6 Pro",
      "Honor Magic 6",
      "Honor Magic V3",
      "Honor Magic V2",
      "Honor 200 Pro",
      "Honor 200",
      "Honor 90",
      "Honor X9b",
      "Honor X8b",
    ],
    realme: [
      "Realme GT 6",
      "Realme GT 5 Pro",
      "Realme 12 Pro+",
      "Realme 12 Pro",
      "Realme 12",
      "Realme C67",
      "Realme C55",
      "Realme Narzo 70 Pro",
    ],
    vivo: [
      "Vivo X100 Pro",
      "Vivo X100",
      "Vivo X Fold 3 Pro",
      "Vivo X Fold 3",
      "Vivo V30 Pro",
      "Vivo V30",
      "Vivo Y100",
      "Vivo Y36",
    ],
    nothing: [
      "Nothing Phone (2a) Plus",
      "Nothing Phone (2a)",
      "Nothing Phone (2)",
      "Nothing Phone (1)",
    ],
    fairphone: ["Fairphone 5", "Fairphone 4"],
    anders: [],
  },
  tablet: {
    apple: [
      // iPad Pro (2024)
      "iPad Pro 13-inch (M4, 2024)",
      "iPad Pro 11-inch (M4, 2024)",
      // iPad Pro (2022)
      "iPad Pro 12.9-inch (M2, 2022)",
      "iPad Pro 11-inch (M2, 2022)",
      // iPad Air
      "iPad Air 13-inch (M2, 2024)",
      "iPad Air 11-inch (M2, 2024)",
      "iPad Air (M1, 2022)",
      "iPad Air (2020)",
      // iPad
      "iPad (10e generatie, 2022)",
      "iPad (9e generatie, 2021)",
      "iPad (8e generatie, 2020)",
      "iPad (7e generatie, 2019)",
      // iPad Mini
      "iPad Mini (A17 Pro, 2024)",
      "iPad Mini (2021)",
      "iPad Mini (2019)",
    ],
    samsung: [
      // Galaxy Tab S9 serie
      "Galaxy Tab S9 Ultra",
      "Galaxy Tab S9+",
      "Galaxy Tab S9",
      "Galaxy Tab S9 FE+",
      "Galaxy Tab S9 FE",
      // Galaxy Tab S8 serie
      "Galaxy Tab S8 Ultra",
      "Galaxy Tab S8+",
      "Galaxy Tab S8",
      // Galaxy Tab S7 serie
      "Galaxy Tab S7+",
      "Galaxy Tab S7",
      "Galaxy Tab S7 FE",
      // Galaxy Tab A serie
      "Galaxy Tab A9+",
      "Galaxy Tab A9",
      "Galaxy Tab A8 (2022)",
      "Galaxy Tab A7 Lite",
      // Galaxy Tab Active
      "Galaxy Tab Active 5",
      "Galaxy Tab Active 4 Pro",
    ],
    microsoft: [
      // Surface Pro
      "Surface Pro 10",
      "Surface Pro 9",
      "Surface Pro 8",
      "Surface Pro 7+",
      "Surface Pro 7",
      // Surface Go
      "Surface Go 4",
      "Surface Go 3",
    ],
    lenovo: [
      // Tab P serie
      "Tab P12 Pro",
      "Tab P12",
      "Tab P11 Pro (2nd Gen)",
      "Tab P11 (2nd Gen)",
      // Yoga Tab
      "Yoga Tab 13",
      "Yoga Tab 11",
      // Tab M serie
      "Tab M11",
      "Tab M10 Plus (3rd Gen)",
      "Tab M10 (3rd Gen)",
      "Tab M9",
      "Tab M8 (4th Gen)",
    ],
    huawei: [
      "MatePad Pro 13.2",
      "MatePad Pro 11 (2024)",
      'MatePad 11.5" PaperMatte',
      "MatePad Air",
      "MatePad SE",
      "MatePad T10s",
    ],
    xiaomi: [
      "Xiaomi Pad 6S Pro",
      "Xiaomi Pad 6 Pro",
      "Xiaomi Pad 6",
      "Xiaomi Pad 5 Pro",
      "Xiaomi Pad 5",
      "Redmi Pad Pro",
      "Redmi Pad SE",
    ],
    amazon: [
      "Fire Max 11",
      "Fire HD 10 (2023)",
      "Fire HD 10 Plus",
      "Fire HD 8 (2024)",
      "Fire HD 8 Plus",
      "Fire 7 (2024)",
    ],
    anders: [],
  },
  laptop: {
    apple: [
      // MacBook Pro (2024-2025)
      "MacBook Pro 16-inch (M4 Max, 2025)",
      "MacBook Pro 16-inch (M4 Pro, 2025)",
      "MacBook Pro 14-inch (M4 Max, 2025)",
      "MacBook Pro 14-inch (M4 Pro, 2025)",
      "MacBook Pro 14-inch (M4, 2024)",
      // MacBook Pro (2023)
      "MacBook Pro 16-inch (M3 Max, 2023)",
      "MacBook Pro 16-inch (M3 Pro, 2023)",
      "MacBook Pro 14-inch (M3 Max, 2023)",
      "MacBook Pro 14-inch (M3 Pro, 2023)",
      "MacBook Pro 14-inch (M3, 2023)",
      // MacBook Pro (2022)
      "MacBook Pro 16-inch (M2 Max, 2023)",
      "MacBook Pro 14-inch (M2 Pro, 2023)",
      "MacBook Pro 13-inch (M2, 2022)",
      // MacBook Air
      "MacBook Air 15-inch (M4, 2025)",
      "MacBook Air 13-inch (M4, 2025)",
      "MacBook Air 15-inch (M3, 2024)",
      "MacBook Air 13-inch (M3, 2024)",
      "MacBook Air 15-inch (M2, 2023)",
      "MacBook Air 13-inch (M2, 2022)",
      "MacBook Air (M1, 2020)",
      // Oudere modellen
      "MacBook Pro 16-inch (Intel, 2019)",
      "MacBook Pro 13-inch (Intel, 2020)",
    ],
    lenovo: [
      // ThinkPad X serie
      "ThinkPad X1 Carbon Gen 12",
      "ThinkPad X1 Carbon Gen 11",
      "ThinkPad X1 Yoga Gen 9",
      "ThinkPad X1 Yoga Gen 8",
      "ThinkPad X1 Nano Gen 3",
      "ThinkPad X13 Gen 5",
      // ThinkPad T serie
      "ThinkPad T16 Gen 3",
      "ThinkPad T14 Gen 5",
      "ThinkPad T14s Gen 5",
      // ThinkPad E serie
      "ThinkPad E16 Gen 2",
      "ThinkPad E14 Gen 6",
      // ThinkPad P serie (Workstations)
      "ThinkPad P1 Gen 7",
      "ThinkPad P16 Gen 2",
      "ThinkPad P14s Gen 5",
      // ThinkBook
      "ThinkBook 16 G7",
      "ThinkBook 14 G7",
      "ThinkBook Plus Gen 5",
      // IdeaPad
      "IdeaPad Pro 5 16",
      "IdeaPad Slim 5 16",
      "IdeaPad Slim 5 14",
      "IdeaPad Slim 3 15",
      "IdeaPad Flex 5 14",
      "IdeaPad Gaming 3",
      // Yoga
      "Yoga 9i Gen 9",
      "Yoga 7i Gen 9",
      "Yoga Slim 7 Pro X",
      "Yoga Slim 9i",
      // Legion (Gaming)
      "Legion Pro 7i Gen 9",
      "Legion Pro 5i Gen 9",
      "Legion 5i Pro Gen 8",
      "Legion 5 Gen 8",
      "Legion Go",
    ],
    hp: [
      // HP Spectre
      "Spectre x360 16 (2024)",
      "Spectre x360 14 (2024)",
      "Spectre x360 13.5 (2024)",
      // HP Envy
      "Envy x360 16 (2024)",
      "Envy x360 15 (2024)",
      "Envy x360 14 (2024)",
      "Envy 17 (2024)",
      // HP Pavilion
      "Pavilion Plus 16",
      "Pavilion Plus 14",
      "Pavilion x360 15",
      "Pavilion x360 14",
      "Pavilion 15",
      // HP OmniBook
      "OmniBook Ultra 14",
      "OmniBook X 14",
      // HP EliteBook
      "EliteBook 1040 G11",
      "EliteBook 860 G11",
      "EliteBook 840 G11",
      "EliteBook 640 G11",
      // HP ProBook
      "ProBook 450 G11",
      "ProBook 440 G11",
      // HP OMEN (Gaming)
      "OMEN 17",
      "OMEN 16",
      "OMEN MAX 16",
      "OMEN Transcend 16",
      "OMEN Transcend 14",
      // HP Victus (Gaming)
      "Victus 16",
      "Victus 15",
      // HP Chromebook
      "Chromebook Plus x360 14",
      "Chromebook 14",
      "Chromebook x360",
    ],
    dell: [
      // XPS
      "XPS 16 (2024)",
      "XPS 14 (2024)",
      "XPS 13 Plus (2024)",
      "XPS 13 (2024)",
      "XPS 15 (2023)",
      "XPS 17 (2023)",
      // Latitude
      "Latitude 9450 2-in-1",
      "Latitude 7450",
      "Latitude 7350",
      "Latitude 5550",
      "Latitude 5450",
      "Latitude 3450",
      // Inspiron
      "Inspiron 16 Plus (7640)",
      "Inspiron 16 (5640)",
      "Inspiron 15 (3540)",
      "Inspiron 14 Plus (7440)",
      "Inspiron 14 2-in-1 (7445)",
      // Precision (Workstations)
      "Precision 7780",
      "Precision 7680",
      "Precision 5690",
      "Precision 5490",
      // Alienware (Gaming)
      "Alienware m18 R2",
      "Alienware m16 R2",
      "Alienware x16 R2",
      "Alienware x14 R2",
      // G-series (Gaming)
      "G16 (7630)",
      "G15 (5535)",
    ],
    asus: [
      // ZenBook
      "ZenBook 14 OLED (UX3405)",
      "ZenBook 14X OLED (UX3404)",
      "ZenBook Pro 14 OLED",
      "ZenBook S 16 (UM5606)",
      "ZenBook S 14 (UX5406)",
      "ZenBook Duo 2024",
      // VivoBook
      "Vivobook Pro 16X OLED",
      "Vivobook Pro 15 OLED",
      "Vivobook S 16 OLED",
      "Vivobook S 14 OLED",
      "Vivobook 16X",
      "Vivobook Go 15 OLED",
      "Vivobook Flip 14",
      // ProArt (Creator)
      "ProArt Studiobook 16 OLED",
      "ProArt P16",
      "ProArt PX13",
      // ExpertBook
      "ExpertBook B9 OLED",
      "ExpertBook P5",
      "ExpertBook B5",
      "ExpertBook B3",
      // ROG (Gaming)
      "ROG Zephyrus G16 (2024)",
      "ROG Zephyrus G14 (2024)",
      "ROG Strix SCAR 18",
      "ROG Strix SCAR 16",
      "ROG Strix G16",
      "ROG Flow Z13",
      "ROG Flow X13",
      // TUF Gaming
      "TUF Gaming A16",
      "TUF Gaming A15",
      "TUF Gaming F15",
      // Chromebook
      "Chromebook Plus CX34",
      "Chromebook Flip CX5",
    ],
    acer: [
      // Swift
      "Swift Go 16 (2024)",
      "Swift Go 14 (2024)",
      "Swift X 16",
      "Swift X 14",
      "Swift Edge 16",
      // Aspire
      "Aspire 5 (2024)",
      "Aspire 3 (2024)",
      "Aspire Vero 16",
      // Spin
      "Spin 5 (2024)",
      "Spin 3 (2024)",
      // TravelMate
      "TravelMate P6",
      "TravelMate P4",
      // Predator (Gaming)
      "Predator Helios Neo 18",
      "Predator Helios Neo 16",
      "Predator Helios 16",
      "Predator Triton 17 X",
      // Nitro (Gaming)
      "Nitro V 16",
      "Nitro V 15",
      "Nitro 5",
      // Chromebook
      "Chromebook Plus 515",
      "Chromebook Spin 714",
    ],
    microsoft: [
      // Surface Laptop
      "Surface Laptop 7 (15-inch)",
      "Surface Laptop 7 (13.8-inch)",
      "Surface Laptop 6 (15-inch)",
      "Surface Laptop 6 (13.5-inch)",
      "Surface Laptop 5",
      "Surface Laptop 4",
      "Surface Laptop 3",
      // Surface Book
      "Surface Book 3 (15-inch)",
      "Surface Book 3 (13.5-inch)",
      // Surface Studio
      "Surface Laptop Studio 2",
      "Surface Laptop Studio",
    ],
    msi: [
      // Creator
      "Creator Z17 HX Studio",
      "Creator Z16 HX Studio",
      "Prestige 16 AI Studio",
      "Prestige 14 AI",
      // Gaming - Stealth
      "Stealth 18 Mercedes-AMG",
      "Stealth 17 Studio",
      "Stealth 16 Studio",
      "Stealth 14 Studio",
      // Gaming - Titan
      "Titan 18 HX",
      // Gaming - Raider
      "Raider GE78 HX",
      "Raider GE68 HX",
      // Gaming - Vector
      "Vector GP78 HX",
      "Vector GP68 HX",
      // Gaming - Katana
      "Katana 17",
      "Katana 15",
      // Cyborg
      "Cyborg 15",
      // Modern
      "Modern 15",
      "Modern 14",
    ],
    razer: [
      "Blade 18 (2024)",
      "Blade 17 (2024)",
      "Blade 16 (2024)",
      "Blade 15 (2024)",
      "Blade 14 (2024)",
      "Razer Book 13",
    ],
    samsung: [
      "Galaxy Book4 Ultra",
      "Galaxy Book4 Pro 360",
      "Galaxy Book4 Pro",
      "Galaxy Book4 360",
      "Galaxy Book4",
      "Galaxy Book3 Ultra",
      "Galaxy Book3 Pro 360",
      "Galaxy Book3 Pro",
      "Galaxy Book Go",
    ],
    huawei: [
      "MateBook X Pro (2024)",
      "MateBook 16s (2024)",
      "MateBook 14s (2024)",
      "MateBook D 16 (2024)",
      "MateBook D 15 (2024)",
      "MateBook D 14 (2024)",
    ],
    anders: [],
  },
  accessoire: {
    apple: [
      "AirPods Pro (2e generatie)",
      "AirPods (3e generatie)",
      "AirPods Max",
      "Apple Watch Ultra 2",
      "Apple Watch Series 10",
      "Apple Watch SE (2024)",
      "Apple Pencil Pro",
      "Apple Pencil (2e generatie)",
      "Magic Keyboard",
      "MagSafe Charger",
    ],
    samsung: [
      "Galaxy Buds3 Pro",
      "Galaxy Buds3",
      "Galaxy Buds FE",
      "Galaxy Watch 7",
      "Galaxy Watch Ultra",
      "Galaxy Ring",
      "S Pen Pro",
    ],
    sony: [
      "WH-1000XM5",
      "WH-1000XM4",
      "WF-1000XM5",
      "WF-1000XM4",
      "LinkBuds S",
    ],
    bose: [
      "QuietComfort Ultra Headphones",
      "QuietComfort Headphones",
      "QuietComfort Ultra Earbuds",
      "QuietComfort Earbuds II",
    ],
    jabra: ["Elite 10", "Elite 8 Active", "Elite 85t", "Elite 75t"],
    anders: [],
  },
};

// Helper function to get models for a specific device type and brand
export function getModelsForBrand(deviceType: string, brand: string): string[] {
  const typeModels = modelsByTypeAndBrand[deviceType];
  if (!typeModels) return [];

  const brandModels = typeModels[brand];
  if (!brandModels) return [];

  return brandModels;
}

// Helper function to check if a brand has models available
export function hasPredefinedModels(
  deviceType: string,
  brand: string
): boolean {
  const models = getModelsForBrand(deviceType, brand);
  return models.length > 0;
}
