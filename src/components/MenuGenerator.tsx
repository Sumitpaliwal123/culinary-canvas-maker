import React, { useMemo, useState } from "react";

// =============================
// Restaurant Menu Generator App
// Elegant design using project's design system
// =============================

// Button component with variants
function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";
  const variants: Record<string, string> = {
    primary:
      "bg-primary-gold text-primary-gold-foreground hover:opacity-90 focus:ring-primary-gold",
    secondary:
      "bg-primary text-primary-foreground hover:opacity-90 focus:ring-primary",
    ghost:
      "bg-transparent text-menu-header hover:bg-secondary focus:ring-primary-gold",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// Types
type Dish = { name: string; description: string; price: string };
type MenuCategory = { name: string; dishes: Dish[] };

type GeneratedMenu = {
  restaurantName: string;
  cuisineType: string;
  categories: MenuCategory[];
};

// Utility: currency to INR by default
const formatINR = (num: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    num
  );

// Sample curated dishes for 3 cuisines + fallback
const curatedDishes: Record<string, Record<string, Dish[]>> = {
  Italian: {
    Starters: [
      {
        name: "Burrata Caprese",
        description:
          "Creamy burrata, heirloom tomatoes, basil oil, aged balsamic",
        price: formatINR(850),
      },
      {
        name: "Antipasto Royale",
        description: "Cured meats, cheeses, marinated vegetables",
        price: formatINR(1200),
      },
      {
        name: "Arancini Trio",
        description: "Crispy risotto balls: truffle, mushroom, spinach",
        price: formatINR(750),
      },
    ],
    "Main Course": [
      {
        name: "Osso Buco Milanese",
        description: "Braised veal shank, saffron risotto, gremolata",
        price: formatINR(2400),
      },
      {
        name: "Lobster Ravioli",
        description: "Handmade pasta, champagne cream sauce",
        price: formatINR(2200),
      },
      {
        name: "Bistecca Fiorentina",
        description: "Grilled T-bone, rosemary, Tuscan herbs",
        price: formatINR(2800),
      },
    ],
    Desserts: [
      {
        name: "Tiramisu Perfetto",
        description: "Espresso-soaked ladyfingers, mascarpone",
        price: formatINR(650),
      },
      {
        name: "Gelato Affogato",
        description: "Vanilla gelato with hot espresso",
        price: formatINR(550),
      },
    ],
  },
  Japanese: {
    Starters: [
      {
        name: "Tuna Tataki",
        description: "Seared tuna, ponzu, daikon, microgreens",
        price: formatINR(1400),
      },
      {
        name: "Gyoza Selection",
        description: "Pork, shrimp and vegetable dumplings",
        price: formatINR(850),
      },
      {
        name: "Miso Soup Premium",
        description: "Wakame, tofu, seasonal mushrooms",
        price: formatINR(450),
      },
    ],
    "Main Course": [
      {
        name: "Omakase Sushi",
        description: "Chef's 12-piece premium nigiri & rolls",
        price: formatINR(3200),
      },
      {
        name: "Wagyu Teppanyaki",
        description: "A5 Wagyu, grilled with seasonal vegetables",
        price: formatINR(4500),
      },
      {
        name: "Black Cod Miso",
        description: "Miso-marinated cod, shiitake, bok choy",
        price: formatINR(2600),
      },
    ],
    Desserts: [
      {
        name: "Matcha Mille-feuille",
        description: "Delicate pastry, matcha cream, red bean",
        price: formatINR(750),
      },
      {
        name: "Mochi Ice Cream",
        description: "Trio of seasonal flavors",
        price: formatINR(550),
      },
    ],
  },
  French: {
    Starters: [
      {
        name: "Foie Gras Terrine",
        description: "Fig compote, toasted brioche",
        price: formatINR(1800),
      },
      {
        name: "Escargots de Bourgogne",
        description: "Burgundy snails, garlic–parsley butter",
        price: formatINR(1200),
      },
      {
        name: "Soupe à l'Oignon",
        description: "French onion soup, Gruyère crouton",
        price: formatINR(650),
      },
    ],
    "Main Course": [
      {
        name: "Coq au Vin",
        description: "Chicken braised in red wine, mushrooms",
        price: formatINR(2200),
      },
      {
        name: "Bouillabaisse Marseillaise",
        description: "Saffron fish stew, rouille, bread",
        price: formatINR(2800),
      },
      {
        name: "Duck Confit",
        description: "Slow-cooked leg, garlic potatoes, cherry gastrique",
        price: formatINR(2400),
      },
    ],
    Desserts: [
      {
        name: "Crème Brûlée",
        description: "Vanilla custard, caramelized sugar",
        price: formatINR(750),
      },
      {
        name: "Tarte Tatin",
        description: "Upside-down apple tart, cinnamon ice cream",
        price: formatINR(650),
      },
    ],
  },
};

const fallbackByCategory: Record<string, Dish[]> = {
  Starters: [
    {
      name: "Chef's Special Appetizer",
      description: "Seasonal ingredients with artistic flair",
      price: formatINR(750),
    },
    {
      name: "Artisan Soup",
      description: "House-made soup with local produce",
      price: formatINR(550),
    },
  ],
  "Main Course": [
    {
      name: "Signature Entrée",
      description: "Classic technique, modern flavors",
      price: formatINR(1800),
    },
    {
      name: "Premium Selection",
      description: "Curated seasonal specialty",
      price: formatINR(2200),
    },
  ],
  Desserts: [
    {
      name: "Decadent Finale",
      description: "Exquisite dessert to end your meal",
      price: formatINR(650),
    },
  ],
  Beverages: [
    {
      name: "Craft Cocktail",
      description: "Artisanal blend with premium spirits",
      price: formatINR(750),
    },
    {
      name: "Premium Wine",
      description: "Sommelier-selected pairing",
      price: formatINR(1200),
    },
  ],
};

function pickDish(cuisine: string, category: string): Dish {
  const cuisineData = curatedDishes[cuisine as keyof typeof curatedDishes];
  if (cuisineData && cuisineData[category]) {
    const arr = cuisineData[category];
    return arr[Math.floor(Math.random() * arr.length)];
  }
  const fb = fallbackByCategory[category] || fallbackByCategory["Main Course"];
  return fb[Math.floor(Math.random() * fb.length)];
}

const defaultCategoryNames = [
  "Starters",
  "Main Course",
  "Desserts",
  "Beverages",
  "Appetizers",
  "Soups",
  "Salads",
  "Specialties",
  "Signature Dishes",
  "Seasonal Menu",
  "Chef's Selection",
  "Premium Selection",
];

export function MenuGenerator() {
  const [form, setForm] = useState({
    restaurantName: "",
    cuisineType: "Italian",
    categories: 3,
    dishesPerCategory: 3,
  });

  const [menu, setMenu] = useState<GeneratedMenu | null>(null);

  const handleGenerate = () => {
    const cats: MenuCategory[] = [];
    for (let i = 0; i < Math.max(1, Math.min(form.categories, 12)); i++) {
      const name = defaultCategoryNames[i] || `Category ${i + 1}`;
      const dishes: Dish[] = [];
      for (
        let j = 0;
        j < Math.max(1, Math.min(form.dishesPerCategory, 10));
        j++
      ) {
        dishes.push(pickDish(form.cuisineType, name));
      }
      cats.push({ name, dishes });
    }
    setMenu({
      restaurantName: form.restaurantName || "Fine Dining Restaurant",
      cuisineType: form.cuisineType || "International",
      categories: cats,
    });
  };

  const today = useMemo(
    () => new Date().toLocaleDateString("en-IN", { dateStyle: "medium" }),
    []
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@500;600;700&display=swap');
        .font-display{font-family:'Playfair Display',serif}
        .font-sans{font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,'Helvetica Neue',Arial,'Noto Sans','Apple Color Emoji','Segoe UI Emoji',sans-serif}
        @media print{ .no-print{ display:none !important } body{ background:white } }
      `}</style>

      {/* Header */}
      <header className="no-print sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent shadow-elegant" />
            <div>
              <h1 className="font-display text-xl tracking-wide text-menu-header">Menu Designer</h1>
              <p className="text-xs text-muted-foreground">Professional Restaurant Menu Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => window.print()}>Print / Export PDF</Button>
            <Button variant="secondary" onClick={handleGenerate}>Generate Menu</Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-2">
        {/* Config Panel */}
        <section className="no-print rounded-lg border bg-card p-5 shadow-elegant">
          <div className="mb-4">
            <h2 className="font-display text-lg text-menu-header">Menu Configuration</h2>
            <p className="text-sm text-muted-foreground">
              Customize your restaurant menu specifications
            </p>
          </div>

          <form
            className="grid grid-cols-1 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerate();
            }}
          >
            <label className="grid gap-1">
              <span className="text-sm font-medium">Restaurant Name</span>
              <input
                value={form.restaurantName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, restaurantName: e.target.value }))
                }
                placeholder="e.g., La Maison de Sumit"
                className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium">Cuisine Type</span>
              <input
                value={form.cuisineType}
                onChange={(e) =>
                  setForm((p) => ({ ...p, cuisineType: e.target.value }))
                }
                placeholder="Italian / Japanese / French / Custom"
                className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="grid gap-1">
                <span className="text-sm font-medium">Number of Categories</span>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={form.categories}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      categories: Math.max(1, Math.min(12, Number(e.target.value) || 1)),
                    }))
                  }
                  className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-sm font-medium">Dishes per Category</span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.dishesPerCategory}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      dishesPerCategory: Math.max(
                        1,
                        Math.min(10, Number(e.target.value) || 1)
                      ),
                    }))
                  }
                  className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            </div>

            <div className="mt-2 flex gap-3">
              <Button type="submit" variant="primary">
                Generate Menu
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setMenu(null)}
              >
                Clear
              </Button>
            </div>
          </form>
        </section>

        {/* Menu Preview (Printable) */}
        <section className="rounded-lg border bg-card p-6 shadow-elegant print:shadow-none">
          {/* Cover / Header */}
          <div className="border-b pb-5">
            <h2 className="font-display text-3xl tracking-wide text-menu-header">
              {menu?.restaurantName || "Fine Dining Restaurant"}
            </h2>
            <div className="mt-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {menu?.cuisineType || form.cuisineType} Cuisine
              </span>
              <span className="text-muted-foreground">{today}</span>
            </div>
          </div>

          {/* Body */}
          <div className="mt-6 space-y-8">
            {(menu?.categories || []).length === 0 && (
              <p className="text-sm text-muted-foreground">
                Configure your menu on the left, then click <strong>Generate Menu</strong>.
              </p>
            )}

            {(menu?.categories || []).map((cat, idx) => (
              <div key={idx}>
                <div className="mb-3 flex items-end justify-between">
                  <h3 className="font-display text-2xl text-menu-category">
                    {cat.name}
                  </h3>
                  <div className="h-px flex-1 mx-4 bg-gradient-to-r from-primary-gold to-transparent" />
                </div>

                <ul className="grid gap-3">
                  {cat.dishes.map((d, i) => (
                    <li
                      key={i}
                      className="grid grid-cols-[1fr_auto] items-start gap-4 rounded-lg px-3 py-2 hover:bg-muted/50"
                    >
                      <div>
                        <div className="font-display text-lg leading-tight text-menu-header">
                          {d.name}
                        </div>
                        <p className="font-sans text-sm text-menu-description">
                          {d.description}
                        </p>
                      </div>
                      <div className="font-sans text-sm font-medium text-menu-price">
                        {d.price}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Empty state */}
            {!menu && (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <h3 className="font-display text-xl text-menu-header">Your menu will appear here</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter details and click <em>Generate Menu</em> to preview a beautifully formatted menu.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="mt-8 border-t pt-4 text-right text-xs text-muted-foreground">
            Designed with care • Menu Designer
          </footer>
        </section>
      </main>
    </div>
  );
}