import { useState, useMemo, useEffect } from "react";
import { Heart, Filter, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductGrid from "@/components/ProductGrid";
import ProductDetailPage from "@/components/ProductDetailPage";
import WishlistPage from "@/components/WishlistPage";
import CartPage from "@/components/CartPage";
import BottomNav from "@/components/BottomNav";
import Contact from "@/pages/Contact";
import Search from "@/pages/Search";
import CategoryDropdown from "@/components/CategoryDropdown";
import { Product } from "@/types/Product";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const mockProducts: Product[] = [
  // নির্মাণ সামগ্রী - সিমেন্ট
  {
    id: 1,
    name: "শাহ সিমেন্ট ৫০ কেজি",
    price: 550,
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "সিমেন্ট",
    description: "উচ্চ মানের পোর্টল্যান্ড সিমেন্ট। নির্মাণ কাজের জন্য আদর্শ।",
    brand: "শাহ সিমেন্ট",
    rating: 4.8,
    inStock: true
  },
  {
    id: 2,
    name: "হাইডেলবার্গ সিমেন্ট ৫০ কেজি",
    price: 580,
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "সিমেন্ট",
    description: "জার্মান প্রযুক্তিতে তৈরি উন্নত মানের সিমেন্ট।",
    brand: "হাইডেলবার্গ",
    rating: 4.9,
    inStock: true
  },
  {
    id: 3,
    name: "সেভেন রিং সিমেন্ট ৫০ কেজি",
    price: 560,
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "সিমেন্ট",
    description: "শক্তিশালী এবং টেকসই নির্মাণের জন্য সেভেন রিং সিমেন্ট।",
    brand: "সেভেন রিং",
    rating: 4.7,
    inStock: true
  },

  // প্লাস্টিক পাইপ
  {
    id: 4,
    name: "প্রাণ RFL পাইপ ১ ইঞ্চি",
    price: 85,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "প্লাস্টিক পাইপ",
    description: "উচ্চ মানের পিভিসি পাইপ। পানি সরবরাহের জন্য আদর্শ।",
    brand: "প্রাণ RFL",
    rating: 4.6,
    inStock: true
  },
  {
    id: 5,
    name: "এসিআই পাইপ ১/২ ইঞ্চি",
    price: 45,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "প্লাস্টিক পাইপ",
    description: "দীর্ঘস্থায়ী এবং মজবুত প্লাস্টিক পাইপ।",
    brand: "এসিআই",
    rating: 4.5,
    inStock: true
  },
  {
    id: 6,
    name: "নভেম পাইপ ২ ইঞ্চি",
    price: 120,
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "প্লাস্টিক পাইপ",
    description: "ভারী ব্যবহারের জন্য উপযুক্ত মোটা পাইপ।",
    brand: "নভেম",
    rating: 4.4,
    inStock: true
  },

  // বোরিং সামগ্রী
  {
    id: 7,
    name: "সাবমার্সিবল পাম্প ১ এইচপি",
    price: 8500,
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "বোরিং সামগ্রী",
    description: "গভীর নলকূপের জন্য শক্তিশালী সাবমার্সিবল পাম্প।",
    brand: "পেডরোলো",
    rating: 4.7,
    inStock: true
  },
  {
    id: 8,
    name: "বোরিং পাইপ ৩ ইঞ্চি",
    price: 180,
    image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "বোরিং সামগ্রী",
    description: "নলকূপের জন্য বিশেষভাবে তৈরি স্টিল পাইপ।",
    brand: "লোকাল",
    rating: 4.3,
    inStock: true
  },
  {
    id: 9,
    name: "স্ট্রেইনার পাইপ ৩ ইঞ্চি",
    price: 220,
    image: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "বোরিং সামগ্রী",
    description: "পানি ফিল্টার করার জন্য ছিদ্রযুক্ত স্পেশাল পাইপ।",
    brand: "লোকাল",
    rating: 4.2,
    inStock: true
  },

  // পাইপ ফিটিং
  {
    id: 10,
    name: "প্রাণ RFL এলবো ১ ইঞ্চি",
    price: 15,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "পাইপ ফিটিং",
    description: "পাইপের কোণা বাঁকানোর জন্য এলবো ফিটিং।",
    brand: "প্রাণ RFL",
    rating: 4.5,
    inStock: true
  },
  {
    id: 11,
    name: "টি-জয়েন্ট ১/২ ইঞ্চি",
    price: 12,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "পাইপ ফিটিং",
    description: "তিনদিকে পাইপ সংযোগের জন্য টি-জয়েন্ট।",
    brand: "এসিআই",
    rating: 4.4,
    inStock: true
  },
  {
    id: 12,
    name: "রিডিউসার ২ ইঞ্চি টু ১ ইঞ্চি",
    price: 25,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "পাইপ ফিটিং",
    description: "বড় পাইপ থেকে ছোট পাইপে সংযোগের জন্য।",
    brand: "নভেম",
    rating: 4.3,
    inStock: true
  },

  // থ্রেড পাইপ ফিটিং
  {
    id: 13,
    name: "জিআই এলবো ১/২ ইঞ্চি",
    price: 35,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "থ্রেড পাইপ ফিটিং",
    description: "গ্যালভানাইজড আয়রন এলবো ফিটিং।",
    brand: "লোকাল",
    rating: 4.6,
    inStock: true
  },
  {
    id: 14,
    name: "জিআই নিপল ১ ইঞ্চি",
    price: 28,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "থ্রেড পাইপ ফিটিং",
    description: "পাইপ সংযোগের জন্য থ্রেডেড নিপল।",
    brand: "লোকাল",
    rating: 4.5,
    inStock: true
  },
  {
    id: 15,
    name: "ইউনিয়ন জয়েন্ট ৩/৪ ইঞ্চি",
    price: 45,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "থ্রেড পাইপ ফিটিং",
    description: "সহজে খোলা যায় এমন পাইপ জয়েন্ট।",
    brand: "লোকাল",
    rating: 4.4,
    inStock: true
  },

  // সেনেটারি সামগ্রী
  {
    id: 16,
    name: "কমোড সেট",
    price: 3500,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "সেনেটারি",
    description: "আধুনিক ডিজাইনের কমোড ফ্লাশ ট্যাংক সহ।",
    brand: "সিরামিক",
    rating: 4.7,
    inStock: true
  },
  {
    id: 17,
    name: "বেসিন সেট",
    price: 1800,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=600&fit=crop",
    category: "নির্মাণ সামগ্রী",
    subcategory: "সেনেটারি",
    description: "হাত ধোয়ার জন্য আকর্ষণীয় বেসিন।",
    brand: "সিরামিক",
    rating: 4.6,
    inStock: true
  },

  // মোবাইল ব্যাংকিং সেবা - বিকাশ
  {
    id: 18,
    name: "বিকাশ ক্যাশ ইন সেবা",
    price: 0,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop",
    category: "মোবাইল ব্যাংকিং",
    subcategory: "বিকাশ",
    description: "বিকাশ একাউন্টে টাকা জমা দেওয়ার সেবা। সার্ভিস চার্জ প্রযোজ্য।",
    brand: "বিকাশ",
    rating: 4.8,
    inStock: true
  },
  {
    id: 19,
    name: "বিকাশ ক্যাশ আউট সেবা",
    price: 0,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=600&fit=crop",
    category: "মোবাইল ব্যাংকিং",
    subcategory: "বিকাশ",
    description: "বিকাশ একাউন্ট থেকে টাকা উত্তোলনের সেবা। সার্ভিস চার্জ প্রযোজ্য।",
    brand: "বিকাশ",
    rating: 4.8,
    inStock: true
  },
  {
    id: 20,
    name: "বিকাশ পেমেন্ট সেবা",
    price: 0,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=600&fit=crop",
    category: "মোবাইল ব্যাংকিং",
    subcategory: "বিকাশ",
    description: "বিকাশের মাধ্যমে বিল পেমেন্ট ও অনলাইন কেনাকাটার সেবা।",
    brand: "বিকাশ",
    rating: 4.7,
    inStock: true
  },

  // নগদ সেবা
  {
    id: 21,
    name: "নগদ ক্যাশ ইন সেবা",
    price: 0,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop",
    category: "মোবাইল ব্যাংকিং",
    subcategory: "নগদ",
    description: "নগদ একাউন্টে টাকা জমা দেওয়ার সেবা।",
    brand: "নগদ",
    rating: 4.6,
    inStock: true
  },
  {
    id: 22,
    name: "নগদ ক্যাশ আউট সেবা",
    price: 0,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=600&fit=crop",
    category: "মোবাইল ব্যাংকিং",
    subcategory: "নগদ",
    description: "নগদ একাউন্ট থেকে টাকা উত্তোলনের সেবা।",
    brand: "নগদ",
    rating: 4.6,
    inStock: true
  },
  {
    id: 23,
    name: "নগদ সেন্ড মানি সেবা",
    price: 0,
    image: "https://images.unsplash.com/photo-1566479179817-3d823a12ad96?w=400&h=600&fit=crop",
    category: "মোবাইল ব্যাংকিং",
    subcategory: "নগদ",
    description: "নগদের মাধ্যমে টাকা পাঠানোর সেবা।",
    brand: "নগদ",
    rating: 4.5,
    inStock: true
  },

  // রকেট সেবা
  {
    id: 24,
    name: "রকেট ক্যাশ ইন সেবা",
    price: 0,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop",
    category: "মোবাইল ব্যাংকিং",
    subcategory: "রকেট",
    description: "রকেট একাউন্টে টাকা জমা দেওয়ার সেবা।",
    brand: "রকেট",
    rating: 4.5,
    inStock: true
  },
  {
    id: 25,
    name: "রকেট ক্যাশ আউট সেবা",
    price: 0,
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=600&fit=crop",
    category: "মোবাইল ব্যাংকিং",
    subcategory: "রকেট",
    description: "রকেট একাউন্ট থেকে টাকা উত্তোলনের সেবা।",
    brand: "রকেট",
    rating: 4.5,
    inStock: true
  }
];

const categoryData = {
  "নির্মাণ সামগ্রী": [
    "সিমেন্ট",
    "প্লাস্টিক পাইপ",
    "বোরিং সামগ্রী",
    "পাইপ ফিটিং",
    "থ্রেড পাইপ ফিটিং",
    "সেনেটারি"
  ],
  "মোবাইল ব্যাংকিং": [
    "বিকাশ",
    "নগদ",
    "রকেট"
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
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <h1 className="text-xl font-extralight tracking-widest">জিসান ট্রেডার্স</h1>
          
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
              সব পণ্য
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
                {selectedCategory === "All" ? "সব পণ্য" : selectedCategory}
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
              <h3 className="text-lg font-medium mb-2">কোন পণ্য পাওয়া যায়নি</h3>
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
