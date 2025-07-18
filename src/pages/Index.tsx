import { useState, useMemo, useEffect } from "react";
import { Heart, Filter, X, ShoppingCart, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductGrid from "@/components/ProductGrid";
import ProductDetailPage from "@/components/ProductDetailPage";
import WishlistPage from "@/components/WishlistPage";
import CartPage from "@/components/CartPage";
import BottomNav from "@/components/BottomNav";
import Contact from "@/pages/Contact";
import Search from "@/pages/Search";
import OfflineIndicator from "@/components/OfflineIndicator";
import CategoryDropdown from "@/components/CategoryDropdown";
import { Product } from "@/types/Product";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useOfflineStorage } from "@/hooks/useOfflineStorage";
import PWAInstallPopup from "@/components/PWAInstallPopup";

const mockProducts: Product[] = [
  // নির্মাণ সামগ্রী - সিমেন্ট
  {
    id: 1,
    name: "পোর্টল্যান্ড সিমেন্ট ৫০ কেজি",
    price: 520,
    image: "https://images.unsplash.com/photo-1587739421484-1f0b30a7b5e8?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "সিমেন্ট",
    description: "উচ্চ মানের পোর্টল্যান্ড সিমেন্ট নির্মাণ কাজের জন্য।",
    brand: "এশিয়া সিমেন্ট",
    rating: 4.8,
    inStock: true
  },
  {
    id: 2,
    name: "অর্ডিনারি সিমেন্ট ৫০ কেজি",
    price: 480,
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "সিমেন্ট",
    description: "সাধারণ নির্মাণ কাজের জন্য উপযুক্ত অর্ডিনারি সিমেন্ট।",
    brand: "হোলসিম সিমেন্ট",
    rating: 4.6,
    inStock: true
  },
  {
    id: 3,
    name: "হাই স্ট্রেংথ সিমেন্ট ৫০ কেজি",
    price: 580,
    image: "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "সিমেন্ট",
    description: "দ্রুত শক্ত হওয়া এবং উচ্চ শক্তিসম্পন্ন সিমেন্ট।",
    brand: "লাফার্জ সিমেন্ট",
    rating: 4.9,
    inStock: true
  },

  // নির্মাণ সামগ্রী - পাইপ ও ফিটিং
  {
    id: 4,
    name: "পিভিসি পানির পাইপ ১/২ ইঞ্চি",
    price: 45,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "পাইপ ও ফিটিং",
    description: "উচ্চ মানের পিভিসি পানির পাইপ ঘরোয়া ব্যবহারের জন্য।",
    brand: "নোভা পাইপ",
    rating: 4.7,
    inStock: true
  },
  {
    id: 5,
    name: "পিভিসি নিকাশি পাইপ ৪ ইঞ্চি",
    price: 180,
    image: "https://images.unsplash.com/photo-1609205264050-0d4df4df72d3?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "পাইপ ও ফিটিং",
    description: "মজবুত পিভিসি নিকাশি পাইপ স্যানিটেশনের জন্য।",
    brand: "পেকো পাইপ",
    rating: 4.5,
    inStock: true
  },
  {
    id: 6,
    name: "পাইপ এলবো ১/২ ইঞ্চি",
    price: 8,
    image: "https://images.unsplash.com/photo-1621905252472-e8be5573c215?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "পাইপ ও ফিটিং",
    description: "পাইপ সংযোগের জন্য এলবো ফিটিং।",
    brand: "প্লাস্টো",
    rating: 4.4,
    inStock: true
  },
  {
    id: 7,
    name: "পাইপ টি-জয়েন্ট ৩/৪ ইঞ্চি",
    price: 15,
    image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "পাইপ ও ফিটিং",
    description: "তিন দিকে পাইপ সংযোগের জন্য টি-জয়েন্ট।",
    brand: "প্লাস্টো",
    rating: 4.3,
    inStock: true
  },
  {
    id: 8,
    name: "থ্রেটেড পাইপ ফিটিং ১ ইঞ্চি",
    price: 25,
    image: "https://images.unsplash.com/photo-1592833159057-55eb8b82d899?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "পাইপ ও ফিটিং",
    description: "স্ক্রু সংযোগের জন্য থ্রেটেড ফিটিং।",
    brand: "মেটাল টেক",
    rating: 4.6,
    inStock: true
  },

  // নির্মাণ সামগ্রী - স্যানিটারি
  {
    id: 9,
    name: "কমোড সিট সাদা রঙের",
    price: 3500,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "স্যানিটারি",
    description: "উচ্চ মানের সিরামিক কমোড সিট।",
    brand: "রাকা",
    rating: 4.8,
    inStock: true
  },
  {
    id: 10,
    name: "ওয়াশ বেসিন সেট",
    price: 2800,
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "স্যানিটারি",
    description: "আধুনিক ডিজাইনের ওয়াশ বেসিন ট্যাপ সহ।",
    brand: "রাকা",
    rating: 4.7,
    inStock: true
  },
  {
    id: 11,
    name: "শাওয়ার সেট",
    price: 1500,
    image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "স্যানিটারি",
    description: "সম্পূর্ণ শাওয়ার সেট হ্যান্ড শাওয়ার সহ।",
    brand: "সানিওয়ার",
    rating: 4.5,
    inStock: true
  },
  {
    id: 12,
    name: "রান্নাঘরের সিঙ্ক",
    price: 2200,
    image: "https://images.unsplash.com/photo-1607400201778-016296580852?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "স্যানিটারি",
    description: "স্টেইনলেস স্টিলের রান্নাঘরের সিঙ্ক।",
    brand: "স্টিল টেক",
    rating: 4.6,
    inStock: true
  },

  // নির্মাণ সামগ্রী - বোয়িং ও মিশ্রণ
  {
    id: 13,
    name: "নির্মাণ বালি ১ ট্রাক",
    price: 2500,
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "বোয়িং ও মিশ্রণ",
    description: "উচ্চ মানের নির্মাণ বালি।",
    brand: "স্থানীয় সাপ্লায়ার",
    rating: 4.4,
    inStock: true
  },
  {
    id: 14,
    name: "রড সিমেন্ট ৮ মিমি",
    price: 68,
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "বোয়িং ও মিশ্রণ",
    description: "স্ট্যান্ডার্ড রড সিমেন্ট নির্মাণের জন্য।",
    brand: "বিএসআরএম",
    rating: 4.7,
    inStock: true
  },
  {
    id: 15,
    name: "ইট প্রথম শ্রেণী",
    price: 12,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "বোয়িং ও মিশ্রণ",
    description: "উচ্চ মানের প্রথম শ্রেণীর ইট।",
    brand: "স্থানীয় সাপ্লায়ার",
    rating: 4.3,
    inStock: true
  },

  // মোবাইল ব্যাংকিং সেবা
  {
    id: 16,
    name: "বিকাশ ক্যাশ ইন সেবা",
    price: 0,
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=600&fit=crop",
    category: "মোবাইল ব্যাংকিং",
    subcategory: "বিকাশ সেবা",
    description: "বিকাশ অ্যাকাউন্টে টাকা জমা করার সেবা।",
    brand: "বিকাশ",
    rating: 4.9,
    inStock: true
  },
  {
    id: 17,
    name: "বিকাশ ক্যাশ আউট সেবা",
    price: 0,
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=600&fit=crop",
    category: "মোবাইল ব্যাংকিং",
    subcategory: "বিকাশ সেবা",
    description: "বিকাশ অ্যাকাউন্ট থেকে টাকা উত্তোলনের সেবা।",
    brand: "বিকাশ",
    rating: 4.8,
    inStock: true
  },
  {
    id: 18,
    name: "নগদ ক্যাশ ইন সেবা",
    price: 0,
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=600&fit=crop",
    category: "মোবাইল ব্যাংকিং",
    subcategory: "নগদ সেবা",
    description: "নগদ অ্যাকাউন্টে টাকা জমা করার সেবা।",
    brand: "নগদ",
    rating: 4.7,
    inStock: true
  },
  {
    id: 19,
    name: "নগদ ক্যাশ আউট সেবা",
    price: 0,
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=600&fit=crop",
    category: "মোবাইল ব্যাংকিং",
    subcategory: "নগদ সেবা",
    description: "নগদ অ্যাকাউন্ট থেকে টাকা উত্তোলনের সেবা।",
    brand: "নগদ",
    rating: 4.6,
    inStock: true
  },
  {
    id: 20,
    name: "রকেট ক্যাশ ইন সেবা",
    price: 0,
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=600&fit=crop",
    category: "মোবাইল ব্যাংকিং",
    subcategory: "রকেট সেবা",
    description: "রকেট অ্যাকাউন্টে টাকা জমা করার সেবা।",
    brand: "রকেট",
    rating: 4.8,
    inStock: true
  },
  {
    id: 21,
    name: "রকেট ক্যাশ আউট সেবা",
    price: 0,
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=600&fit=crop",
    category: "মোবাইল ব্যাংকিং",
    subcategory: "রকেট সেবা",
    description: "রকেট অ্যাকাউন্ট থেকে টাকা উত্তোলনের সেবা।",
    brand: "রকেট",
    rating: 4.7,
    inStock: true
  },

  // অতিরিক্ত নির্মাণ সামগ্রী
  {
    id: 22,
    name: "জিআই পাইপ ১ ইঞ্চি",
    price: 85,
    image: "https://images.unsplash.com/photo-1621905252472-e8be5573c215?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "পাইপ ও ফিটিং",
    description: "গ্যালভানাইজড আয়রন পাইপ পানির জন্য।",
    brand: "স্টিল টেক",
    rating: 4.5,
    inStock: true
  },
  {
    id: 23,
    name: "প্লাস্টিক ট্যাংক ৫০০ লিটার",
    price: 4500,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "পানির ট্যাংক",
    description: "উচ্চ মানের প্লাস্টিকের পানির ট্যাংক।",
    brand: "পার্ল পলিমার",
    rating: 4.6,
    inStock: true
  },
  {
    id: 24,
    name: "গেট ভালভ ২ ইঞ্চি",
    price: 450,
    image: "https://images.unsplash.com/photo-1592833159057-55eb8b82d899?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "পাইপ ও ফিটিং",
    description: "পানির পাইপ নিয়ন্ত্রণের জন্য গেট ভালভ।",
    brand: "ভালভ টেক",
    rating: 4.4,
    inStock: true
  },
  {
    id: 25,
    name: "টাইলস ১২x১২ ইঞ্চি",
    price: 35,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "টাইলস ও মার্বেল",
    description: "উন্নত মানের মেঝের টাইলস।",
    brand: "র‍্যাক সিরামিক",
    rating: 4.5,
    inStock: true
  }
];

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

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useLocalStorage<Array<{ product: Product; size: string; quantity: number }>>('cart-items', []);
  const [wishlist, setWishlist] = useLocalStorage<number[]>('wishlist', []);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<"home" | "search" | "contact" | "cart" | "product-detail">("home");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Use offline storage hook
  const { isOnline, addOfflineAction, cacheData, getCachedData } = useOfflineStorage();

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Scroll to top on page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, selectedProduct, isWishlistOpen]);

  // Redirect functionality
  useEffect(() => {
    const handleRedirect = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect');
      
      if (redirect) {
        switch (redirect) {
          case 'cart':
            setCurrentPage("cart");
            break;
          case 'search':
            setCurrentPage("search");
            break;
          case 'contact':
            setCurrentPage("contact");
            break;
          case 'home':
          default:
            setCurrentPage("home");
            break;
        }
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    handleRedirect();
  }, []);

  const navigationHandlers = useMemo(() => ({
    onHomeClick: () => {
      setCurrentPage("home");
      setSelectedProduct(null);
    },
    onSearchClick: () => {
      setCurrentPage("search");
      setSelectedProduct(null);
    },
    onCartClick: () => {
      setCurrentPage("cart");
    },
    onContactClick: () => {
      setCurrentPage("contact");
      setSelectedProduct(null);
    }
  }), []);

  const addToCart = (product: Product, size: string = "Default") => {
    const existingItem = cartItems.find(item => item.product.id === product.id && item.size === size);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.product.id === product.id && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { product, size, quantity: 1 }]);
    }

    // Cache the action for offline support
    if (!isOnline) {
      addOfflineAction('add-to-cart', { productId: product.id, size, quantity: 1 });
    }
    
    setSelectedProduct(null);
    setCurrentPage("home");
  };

  const buyNow = (product: Product, size: string = "Default") => {
    // Copy product details to clipboard
    const productDetails = `Product: ${product.name}\nSize: ${size}\nPrice: ৳${product.price}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(productDetails).catch(() => {
        // Fallback for browsers that don't support clipboard API
        console.log('Product details:', productDetails);
      });
    }
    
    // Open the Google Form URL directly
    window.open("https://forms.gle/pCunH9M1Z3ez9VnU9", "_blank");
  };

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => {
      const newWishlist = prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      // Cache the action for offline support
      if (!isOnline) {
        addOfflineAction('add-to-wishlist', { productId, action: prev.includes(productId) ? 'remove' : 'add' });
      }
      
      return newWishlist;
    });
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage("product-detail");
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
  };

  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      if (selectedCategory === "All") return true;
      
      const matchesCategory = product.category === selectedCategory;
      
      if (selectedSubcategory) {
        return matchesCategory && product.subcategory === selectedSubcategory;
      }
      
      return matchesCategory;
    });
  }, [selectedCategory, selectedSubcategory]);

  const wishlistProducts = mockProducts.filter(product => wishlist.includes(product.id));

  if (currentPage === "product-detail" && selectedProduct) {
    return (
      <div>
        <OfflineIndicator />
        <ProductDetailPage
          product={selectedProduct}
          allProducts={mockProducts}
          wishlist={wishlist}
          onBack={() => setCurrentPage("home")}
          onAddToCart={addToCart}
          onBuyNow={buyNow}
          onToggleWishlist={toggleWishlist}
          onProductClick={handleProductClick}
          onHomeClick={navigationHandlers.onHomeClick}
          onSearchClick={navigationHandlers.onSearchClick}
          onCartClick={navigationHandlers.onCartClick}
          onContactClick={navigationHandlers.onContactClick}
          cartCount={cartItemsCount}
        />
      </div>
    );
  }

  if (currentPage === "cart") {
    return (
      <div>
        <OfflineIndicator />
        <CartPage
          items={cartItems}
          wishlist={wishlist}
          onUpdateQuantity={(productId, size, quantity) => {
            if (quantity === 0) {
              setCartItems(cartItems.filter(item => !(item.product.id === productId && item.size === size)));
            } else {
              setCartItems(cartItems.map(item => 
                item.product.id === productId && item.size === size
                  ? { ...item, quantity }
                  : item
              ));
            }
          }}
          onToggleWishlist={toggleWishlist}
          onClose={() => {
            setCurrentPage("home");
          }}
          onHomeClick={navigationHandlers.onHomeClick}
          onSearchClick={navigationHandlers.onSearchClick}
          onContactClick={navigationHandlers.onContactClick}
          cartCount={cartItemsCount}
        />
      </div>
    );
  }

  if (currentPage === "contact") {
    return (
      <div>
        <OfflineIndicator />
        <Contact 
          onBack={() => setCurrentPage("home")}
          onHomeClick={navigationHandlers.onHomeClick}
          onSearchClick={navigationHandlers.onSearchClick}
          onCartClick={navigationHandlers.onCartClick}
          cartCount={cartItemsCount}
        />
      </div>
    );
  }

  if (currentPage === "search") {
    return (
      <div>
        <OfflineIndicator />
        <Search
          products={mockProducts}
          wishlist={wishlist}
          onBack={() => setCurrentPage("home")}
          onProductClick={handleProductClick}
          onToggleWishlist={toggleWishlist}
          onAddToCart={addToCart}
          onHomeClick={navigationHandlers.onHomeClick}
          onCartClick={navigationHandlers.onCartClick}
          onContactClick={navigationHandlers.onContactClick}
          cartCount={cartItemsCount}
        />
      </div>
    );
  }

  if (isWishlistOpen) {
    return (
      <div>
        <OfflineIndicator />
        <WishlistPage
          products={wishlistProducts}
          wishlist={wishlist}
          onProductClick={handleProductClick}
          onToggleWishlist={toggleWishlist}
          onAddToCart={addToCart}
          onBack={() => setIsWishlistOpen(false)}
          onHomeClick={navigationHandlers.onHomeClick}
          onSearchClick={navigationHandlers.onSearchClick}
          onCartClick={navigationHandlers.onCartClick}
          onContactClick={navigationHandlers.onContactClick}
          cartCount={cartItemsCount}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <OfflineIndicator />
      
      {/* PWA Install Popup */}
      <PWAInstallPopup />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <h1 className="text-xl font-extralight tracking-widest">Zisan Traders</h1>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-gray-50 h-8 w-8"
              onClick={() => setIsWishlistOpen(true)}
            >
              <Heart className="h-4 w-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                  {wishlist.length}
                </span>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-gray-50 h-8 w-8"
              onClick={() => setCurrentPage("cart")}
            >
              <ShoppingCart className="h-4 w-4" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                  {cartItemsCount}
                </span>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-gray-50 h-8 w-8"
              onClick={() => window.open("https://ridoan-zisan.netlify.app", "_blank")}
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Simple Category Navigation with better mobile scrolling */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="w-full overflow-x-auto max-w-7xl mx-auto">
          <div className="flex gap-2 pb-2 min-w-max">
            <Button
              variant="ghost"
              onClick={() => handleCategorySelect("All")}
              className={`px-3 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 hover:scale-105 flex-shrink-0 ${
                selectedCategory === "All"
                  ? "bg-black text-white hover:bg-gray-800 shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:text-black"
              }`}
            >
              সকল পণ্য
            </Button>
            
            {Object.keys(categoryData).map((category) => (
              <Button
                key={category}
                variant="ghost"
                onClick={() => handleCategorySelect(category)}
                className={`px-3 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 hover:scale-105 flex-shrink-0 ${
                  selectedCategory === category
                    ? "bg-black text-white hover:bg-gray-800 shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-black"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <section className="px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-medium">
                {selectedCategory === "All" ? "সকল পণ্য" : selectedCategory}
              </h2>
              {selectedSubcategory && (
                <p className="text-sm text-gray-600 mt-1">{selectedSubcategory}</p>
              )}
            </div>
            <span className="text-sm text-gray-500">{filteredProducts.length} টি পণ্য</span>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">কোনো পণ্য পাওয়া যায়নি</h3>
              <p className="text-gray-500">অন্য ক্যাটাগরি বা সাবক্যাটাগরি নির্বাচন করে দেখুন</p>
            </div>
          ) : (
            <ProductGrid 
              products={filteredProducts}
              wishlist={wishlist}
              onProductClick={handleProductClick}
              onToggleWishlist={toggleWishlist}
              onAddToCart={addToCart}
              onBuyNow={buyNow}
            />
          )}
        </div>
      </section>

      {/* Bottom Navigation */}
      <BottomNav 
        cartCount={cartItemsCount}
        wishlistCount={wishlist.length}
        onHomeClick={navigationHandlers.onHomeClick}
        onSearchClick={navigationHandlers.onSearchClick}
        onCartClick={navigationHandlers.onCartClick}
        onContactClick={navigationHandlers.onContactClick}
        onWishlistClick={() => setIsWishlistOpen(true)}
        activeTab={currentPage}
      />
    </div>
  );
};

export default Index;
