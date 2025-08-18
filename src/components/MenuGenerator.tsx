import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChefHat, Utensils, Sparkles } from "lucide-react";

interface Dish {
  name: string;
  description: string;
  price: string;
}

interface MenuCategory {
  name: string;
  dishes: Dish[];
}

interface MenuData {
  restaurantName: string;
  cuisineType: string;
  categories: MenuCategory[];
}

const generateDish = (cuisineType: string, categoryName: string): Dish => {
  const dishes: Record<string, Record<string, Dish[]>> = {
    "Italian": {
      "Starters": [
        { name: "Burrata Caprese", description: "Creamy burrata with heirloom tomatoes, basil oil, and aged balsamic", price: "₹850" },
        { name: "Antipasto Royale", description: "Curated selection of Italian meats, cheeses, and marinated vegetables", price: "₹1200" },
        { name: "Arancini Trio", description: "Crispy risotto balls with truffle, mushroom, and spinach fillings", price: "₹750" }
      ],
      "Main Course": [
        { name: "Osso Buco Milanese", description: "Slow-braised veal shank with saffron risotto and gremolata", price: "₹2400" },
        { name: "Lobster Ravioli", description: "Handmade pasta filled with Maine lobster in champagne cream sauce", price: "₹2200" },
        { name: "Bistecca Fiorentina", description: "Grilled T-bone steak with rosemary, garlic, and Tuscan herbs", price: "₹2800" }
      ],
      "Desserts": [
        { name: "Tiramisu Perfetto", description: "Classic layered dessert with espresso-soaked ladyfingers and mascarpone", price: "₹650" },
        { name: "Gelato Affogato", description: "Vanilla gelato 'drowned' in hot espresso with amaretti crumbles", price: "₹550" }
      ]
    },
    "Japanese": {
      "Starters": [
        { name: "Tuna Tataki", description: "Seared bluefin tuna with ponzu, daikon radish, and microgreens", price: "₹1400" },
        { name: "Gyoza Selection", description: "Pan-fried dumplings with pork, shrimp, and vegetable varieties", price: "₹850" },
        { name: "Miso Soup Premium", description: "Traditional soup with wakame, tofu, and seasonal mushrooms", price: "₹450" }
      ],
      "Main Course": [
        { name: "Omakase Sushi", description: "Chef's selection of 12 pieces of premium nigiri and specialty rolls", price: "₹3200" },
        { name: "Wagyu Teppanyaki", description: "A5 grade wagyu beef grilled tableside with seasonal vegetables", price: "₹4500" },
        { name: "Black Cod Miso", description: "Miso-marinated cod with shiitake mushrooms and baby bok choy", price: "₹2600" }
      ],
      "Desserts": [
        { name: "Matcha Mille-feuille", description: "Delicate pastry layers with matcha cream and red bean filling", price: "₹750" },
        { name: "Mochi Ice Cream", description: "Traditional rice cake filled with premium ice cream, three flavors", price: "₹550" }
      ]
    },
    "French": {
      "Starters": [
        { name: "Foie Gras Terrine", description: "House-made terrine with fig compote and toasted brioche", price: "₹1800" },
        { name: "Escargots de Bourgogne", description: "Six Burgundy snails in garlic-parsley butter", price: "₹1200" },
        { name: "Soup à l'Oignon", description: "Classic French onion soup with Gruyère crouton", price: "₹650" }
      ],
      "Main Course": [
        { name: "Coq au Vin", description: "Braised chicken in red wine with pearl onions and mushrooms", price: "₹2200" },
        { name: "Bouillabaisse Marseillaise", description: "Traditional fish stew with saffron rouille and crusty bread", price: "₹2800" },
        { name: "Duck Confit", description: "Slow-cooked duck leg with garlic potatoes and cherry gastrique", price: "₹2400" }
      ],
      "Desserts": [
        { name: "Crème Brûlée", description: "Vanilla custard with caramelized sugar and fresh berries", price: "₹750" },
        { name: "Tarte Tatin", description: "Upside-down apple tart with cinnamon ice cream", price: "₹650" }
      ]
    }
  };

  const fallbackDishes: Record<string, Dish[]> = {
    "Starters": [
      { name: "Chef's Special Appetizer", description: "Seasonal ingredients prepared with culinary expertise and artistic flair", price: "₹750" },
      { name: "Artisan Soup", description: "House-made soup featuring fresh, locally-sourced ingredients", price: "₹550" }
    ],
    "Main Course": [
      { name: "Signature Entrée", description: "Our chef's masterpiece combining traditional techniques with modern flavors", price: "₹1800" },
      { name: "Premium Selection", description: "Carefully curated dish showcasing the finest seasonal ingredients", price: "₹2200" }
    ],
    "Desserts": [
      { name: "Decadent Finale", description: "Exquisite dessert crafted to provide the perfect end to your meal", price: "₹650" }
    ],
    "Beverages": [
      { name: "Craft Cocktail", description: "Artisanal cocktail made with premium spirits and fresh ingredients", price: "₹750" },
      { name: "Premium Wine", description: "Carefully selected wine to complement your dining experience", price: "₹1200" }
    ]
  };

  const cuisineDishes = dishes[cuisineType];
  if (cuisineDishes && cuisineDishes[categoryName]) {
    const availableDishes = cuisineDishes[categoryName];
    return availableDishes[Math.floor(Math.random() * availableDishes.length)];
  }
  
  const fallback = fallbackDishes[categoryName] || fallbackDishes["Main Course"];
  return fallback[Math.floor(Math.random() * fallback.length)];
};

const generateCategoryName = (index: number): string => {
  const categoryNames = [
    "Starters", "Main Course", "Desserts", "Beverages",
    "Appetizers", "Soups", "Salads", "Specialties",
    "Signature Dishes", "Seasonal Menu", "Chef's Selection", "Premium Selection"
  ];
  return categoryNames[index] || `Category ${index + 1}`;
};

export function MenuGenerator() {
  const [formData, setFormData] = useState({
    restaurantName: "",
    cuisineType: "",
    numberOfCategories: 3,
    dishesPerCategory: 3
  });
  
  const [generatedMenu, setGeneratedMenu] = useState<MenuData | null>(null);

  const handleGenerate = () => {
    const categories: MenuCategory[] = [];
    
    for (let i = 0; i < formData.numberOfCategories; i++) {
      const categoryName = generateCategoryName(i);
      const dishes: Dish[] = [];
      
      for (let j = 0; j < formData.dishesPerCategory; j++) {
        dishes.push(generateDish(formData.cuisineType, categoryName));
      }
      
      categories.push({
        name: categoryName,
        dishes
      });
    }

    setGeneratedMenu({
      restaurantName: formData.restaurantName || "Fine Dining Restaurant",
      cuisineType: formData.cuisineType || "International",
      categories
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ChefHat className="h-10 w-10 text-primary-gold" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-menu-header to-primary-gold bg-clip-text text-transparent" 
                style={{ fontFamily: 'var(--font-elegant)' }}>
              Menu Designer
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create beautiful, professional restaurant menus with elegant formatting and compelling descriptions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Generator Form */}
          <Card className="shadow-elegant">
            <CardHeader className="bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                Menu Configuration
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Customize your restaurant menu specifications
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="restaurantName">Restaurant Name</Label>
                <Input
                  id="restaurantName"
                  placeholder="Enter restaurant name..."
                  value={formData.restaurantName}
                  onChange={(e) => setFormData(prev => ({ ...prev, restaurantName: e.target.value }))}
                  className="focus:ring-primary-gold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cuisineType">Cuisine Type</Label>
                <Input
                  id="cuisineType"
                  placeholder="e.g., Italian, Japanese, French..."
                  value={formData.cuisineType}
                  onChange={(e) => setFormData(prev => ({ ...prev, cuisineType: e.target.value }))}
                  className="focus:ring-primary-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categories">Number of Categories</Label>
                  <Input
                    id="categories"
                    type="number"
                    min="1"
                    max="8"
                    value={formData.numberOfCategories}
                    onChange={(e) => setFormData(prev => ({ ...prev, numberOfCategories: parseInt(e.target.value) || 3 }))}
                    className="focus:ring-primary-gold"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dishes">Dishes per Category</Label>
                  <Input
                    id="dishes"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.dishesPerCategory}
                    onChange={(e) => setFormData(prev => ({ ...prev, dishesPerCategory: parseInt(e.target.value) || 3 }))}
                    className="focus:ring-primary-gold"
                  />
                </div>
              </div>

              <Button 
                onClick={handleGenerate}
                className="w-full bg-gradient-to-r from-primary-gold to-primary-gold/80 hover:from-primary-gold/90 hover:to-primary-gold/70 text-primary-gold-foreground font-semibold py-3"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Menu
              </Button>
            </CardContent>
          </Card>

          {/* Generated Menu Display */}
          {generatedMenu && (
            <Card className="shadow-menu">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-menu-header mb-2" 
                      style={{ fontFamily: 'var(--font-elegant)' }}>
                    {generatedMenu.restaurantName}
                  </h2>
                  <p className="text-lg text-primary-gold font-medium">
                    {generatedMenu.cuisineType} Cuisine
                  </p>
                  <Separator className="mt-4 bg-gradient-to-r from-transparent via-primary-gold to-transparent" />
                </div>

                <div className="space-y-8">
                  {generatedMenu.categories.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="space-y-4">
                      <h3 className="text-2xl font-semibold text-menu-category text-center" 
                          style={{ fontFamily: 'var(--font-elegant)' }}>
                        {category.name}
                      </h3>
                      
                      <div className="space-y-3">
                        {category.dishes.map((dish, dishIndex) => (
                          <div key={dishIndex} className="border-b border-border/50 pb-3 last:border-b-0">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground mb-1">
                                  {dish.name}
                                </h4>
                                <p className="text-sm text-menu-description leading-relaxed">
                                  {dish.description}
                                </p>
                              </div>
                              <div className="text-lg font-bold text-menu-price flex-shrink-0">
                                {dish.price}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {categoryIndex < generatedMenu.categories.length - 1 && (
                        <Separator className="my-6 bg-gradient-to-r from-transparent via-border to-transparent" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}