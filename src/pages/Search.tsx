import { useState, useMemo } from "react";
import { ArrowLeft, Search as SearchIcon, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductGrid from "@/components/ProductGrid";
import ProductModal from "@/components/ProductModal";
import BottomNav from "@/components/BottomNav";
import { Product } from "@/types/Product";

interface SearchProps {
  products: Product[];
  wishlist: number[];
  onBack: () => void;
  onProductClick: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  onAddToCart: (product: Product, size: string) => void;
  onHomeClick: () => void;
  onCartClick: () => void;
  onContactClick: () => void;
  cartCount: number;
}

const categoryData = {
  "নির্মাণ সামগ্রী": [
    "সিমেন্ট",
    "পাইপ ও ফিটিং", 
    "স্যানিটারি",
    "বোয়িং ও মিশ্রণ",
    "পানির ট্যাংক",
    "টাইলস ও মার্বেল"
  ],
  "মোবাইল ব্যাংকিং": [
    "বিকাশ সেবা",
    "নগদ সেবা",
    "রকেট সেবা"
  ]
};

// Flatten all categories for search
const allCategories = ["সকল", ...Object.keys(categoryData)];
const allSubcategories = Object.values(categoryData).flat();

const priceRanges = [
  { label: "সকল দাম", min: 0, max: Infinity },
  { label: "৳৫০ এর নিচে", min: 0, max: 50 },
  { label: "৳৫০ - ৳২০০", min: 50, max: 200 },
  { label: "৳২০০ - ৳৫০০", min: 200, max: 500 },
  { label: "৳৫০০ - ৳১০০০", min: 500, max: 1000 },
  { label: "৳১০০০ এর উপরে", min: 1000, max: Infinity }
];

const Search = ({ 
  products, 
  wishlist, 
  onBack, 
  onProductClick, 
  onToggleWishlist,
  onAddToCart,
  onHomeClick,
  onCartClick,
  onContactClick,
  cartCount
}: SearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("সকল");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(true);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "সকল" || product.category === selectedCategory;
      const matchesSubcategory = !selectedSubcategory || product.subcategory === selectedSubcategory;
      const matchesPrice = product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max;
      
      return matchesSearch && matchesCategory && matchesSubcategory && matchesPrice;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, searchQuery, selectedCategory, selectedSubcategory, selectedPriceRange, sortBy]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("সকল");
    setSelectedSubcategory(null);
    setSelectedPriceRange(priceRanges[0]);
    setSortBy("name");
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null); // Reset subcategory when main category changes
  };

  const currentSubcategories = selectedCategory !== "সকল" ? categoryData[selectedCategory as keyof typeof categoryData] || [] : [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-extralight tracking-wide">পণ্য খুঁজুন</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={`h-8 w-8 ${showFilters ? 'bg-black text-white' : ''}`}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="px-4 py-3 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="পণ্য, ব্র্যান্ড, ক্যাটাগরি খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filters Panel - Always visible now */}
        {showFilters && (
          <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">ফিল্টার</h3>
              <Button
                variant="ghost"
                onClick={clearAllFilters}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                সকল মুছুন
              </Button>
            </div>

            {/* Main Category Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">ক্যাটাগরি</label>
              <div className="w-full overflow-x-auto">
                <div className="flex gap-2 pb-2 min-w-max">
                  {allCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors flex-shrink-0 ${
                        selectedCategory === category
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Subcategory Filter */}
            {currentSubcategories.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">সাবক্যাটাগরি</label>
                <div className="w-full overflow-x-auto">
                  <div className="flex gap-2 pb-2 min-w-max">
                    <button
                      onClick={() => setSelectedSubcategory(null)}
                      className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors flex-shrink-0 ${
                        !selectedSubcategory
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      সকল {selectedCategory}
                    </button>
                    {currentSubcategories.map((subcategory) => (
                      <button
                        key={subcategory}
                        onClick={() => setSelectedSubcategory(subcategory)}
                        className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors flex-shrink-0 ${
                          selectedSubcategory === subcategory
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {subcategory}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Price Range Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">দামের পরিসর</label>
              <div className="w-full overflow-x-auto">
                <div className="flex gap-2 pb-2 min-w-max">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => setSelectedPriceRange(range)}
                      className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors flex-shrink-0 ${
                        selectedPriceRange.label === range.label
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">সাজান</label>
              <div className="w-full overflow-x-auto">
                <div className="flex gap-2 pb-2 min-w-max">
                  {[
                    { value: "name", label: "নাম" },
                    { value: "price-low", label: "দাম: কম থেকে বেশি" },
                    { value: "price-high", label: "দাম: বেশি থেকে কম" },
                    { value: "rating", label: "রেটিং" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors flex-shrink-0 ${
                        sortBy === option.value
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {(searchQuery || selectedCategory !== "সকল" || selectedSubcategory || selectedPriceRange.label !== "সকল দাম") && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-500">সক্রিয় ফিল্টার:</span>
            {searchQuery && (
              <span className="bg-black text-white px-2 py-1 rounded-full text-xs">
                "{searchQuery}"
              </span>
            )}
            {selectedCategory !== "সকল" && (
              <span className="bg-black text-white px-2 py-1 rounded-full text-xs">
                {selectedCategory}
              </span>
            )}
            {selectedSubcategory && (
              <span className="bg-black text-white px-2 py-1 rounded-full text-xs">
                {selectedSubcategory}
              </span>
            )}
            {selectedPriceRange.label !== "সকল দাম" && (
              <span className="bg-black text-white px-2 py-1 rounded-full text-xs">
                {selectedPriceRange.label}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-light">
            {searchQuery ? `"${searchQuery}" এর জন্য ফলাফল` : "সকল পণ্য"}
          </h2>
          <span className="text-xs text-gray-500">{filteredProducts.length} টি পণ্য</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <SearchIcon className="h-8 w-8 mx-auto mb-2" />
            </div>
            <h3 className="text-base font-light mb-1">কোনো পণ্য পাওয়া যায়নি</h3>
            <p className="text-gray-500 text-sm">অন্য কিওয়ার্ড বা ফিল্টার ব্যবহার করুন</p>
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="mt-3 rounded-full text-sm"
            >
              সকল ফিল্টার মুছুন
            </Button>
          </div>
        ) : (
          <ProductGrid 
            products={filteredProducts}
            wishlist={wishlist}
            onProductClick={onProductClick}
            onToggleWishlist={onToggleWishlist}
            onAddToCart={onAddToCart}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav 
        cartCount={cartCount}
        wishlistCount={0}
        onHomeClick={onHomeClick}
        onSearchClick={() => {}}
        onCartClick={onCartClick}
        onContactClick={onContactClick}
        onWishlistClick={() => {}}
        activeTab="search"
      />
    </div>
  );
};

export default Search;
