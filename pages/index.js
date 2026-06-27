import { useState, useEffect } from "react";
import Head from "next/head";

function StarRating({ score }) {
  const filled = Math.round(score);
  return (
    <span>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= filled ? "#f5a623" : "#ccc" }}>★</span>
      ))}
    </span>
  );
}

function ProductCard({ product }) {
  const [addedToCart, setAddedToCart] = useState(false);

  function handleCartClick() {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  }

  return (
    <div className="card h-100 shadow-sm border-0" style={{ borderRadius: "12px", overflow: "hidden" }}>
      <div
        className="d-flex align-items-center justify-content-center bg-light"
        style={{ height: "200px", padding: "20px" }}
      >
        <img
          src={product.image}
          alt={product.title}
          style={{ maxHeight: "160px", maxWidth: "100%", objectFit: "contain" }}
          loading="lazy"
        />
      </div>

      <div className="card-body d-flex flex-column">
        <span className="badge bg-warning text-dark mb-2" style={{ width: "fit-content", fontSize: "11px" }}>
          {product.category}
        </span>

        <p
          className="fw-semibold mb-2"
          style={{
            fontSize: "0.88rem",
            lineHeight: "1.4",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
          title={product.title}
        >
          {product.title}
        </p>

        {product.rating && (
          <div className="d-flex align-items-center gap-1 mb-3" style={{ fontSize: "0.8rem", color: "#666" }}>
            <StarRating score={product.rating.rate} />
            <span>{product.rating.rate} ({product.rating.count})</span>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
          <span className="fw-bold fs-5">${product.price.toFixed(2)}</span>
          <button
            className="btn btn-sm btn-dark"
            onClick={handleCartClick}
            style={{ borderRadius: "20px", fontSize: "0.78rem" }}
          >
            {addedToCart ? "✓ Added!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home({ products, error }) {
  const [searchText, setSearchText] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products || []);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      let result = products;

      if (activeCategory !== "All") {
        result = result.filter((p) => p.category === activeCategory);
      }

      if (searchText.trim() !== "") {
        result = result.filter((p) =>
          p.title.toLowerCase().includes(searchText.toLowerCase())
        );
      }

      setFilteredProducts(result);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText, activeCategory, products]);

  return (
    <>
      <Head>
        <title>Product Listing</title>
        <meta name="description" content="Browse products" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* navbar */}
      <nav className="navbar navbar-dark bg-dark px-4 sticky-top">
        <span className="navbar-brand fw-bold fs-4">🛒 ShopNow</span>
        <span className="text-white-50" style={{ fontSize: "0.82rem" }}>
          {products.length} Products
        </span>
      </nav>

      {/* search bar section */}
      <div className="bg-dark py-5 px-3 text-center">
        <h1 className="text-white fw-bold mb-1" style={{ fontSize: "clamp(1.6rem, 4vw, 2.5rem)" }}>
          Find Your Product
        </h1>
        <p className="text-white-50 mb-4">Browse our collection</p>
        <div className="mx-auto position-relative" style={{ maxWidth: "500px" }}>
          <input
            type="text"
            className="form-control form-control-lg rounded-pill"
            placeholder="Search products..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ paddingLeft: "20px", paddingRight: searchText ? "40px" : "20px" }}
          />
          {searchText && (
            <button
              className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 text-muted p-0"
              onClick={() => setSearchText("")}
              style={{ fontSize: "1.2rem", lineHeight: 1 }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="container mt-4">
          <div className="alert alert-danger">
            Failed to load products: {error}
          </div>
        </div>
      )}

      <div className="container-lg py-4">
        <div className="d-flex flex-wrap gap-2 mb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm ${activeCategory === cat ? "btn-dark" : "btn-outline-secondary"}`}
              onClick={() => setActiveCategory(cat)}
              style={{ borderRadius: "20px", textTransform: "capitalize" }}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="text-muted mb-3" style={{ fontSize: "0.85rem" }}>
          {isLoading ? "Searching..." : `${filteredProducts.length} results`}
        </p>

        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-dark" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <p style={{ fontSize: "2.5rem" }}>🔍</p>
            <h5>No products found for "{searchText}"</h5>
            <p className="text-muted">Try searching something else</p>
          </div>
        ) : (
          <div className="row g-3">
            {filteredProducts.map((product) => (
              <div key={product.id} className="col-12 col-sm-6 col-md-4 col-xl-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="bg-dark text-center py-3 mt-5">
        <small className="text-white-50">
          Data from fakestoreapi.com · Made with Next.js + Bootstrap 5
        </small>
      </footer>
    </>
  );
}


//

export async function getServerSideProps() {
  const URLS = [
    "https://fakestoreapi.com/products",
    "https://dummyjson.com/products?limit=20", // fallback API
  ];

  for (const url of URLS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      const products = Array.isArray(data) ? data : data.products.map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        category: p.category,
        image: p.thumbnail,
        rating: { rate: p.rating, count: p.stock },
      }));

      return { props: { products, error: null } };

    } catch (err) {
      console.error(`Failed to fetch from ${url}:`, err.message);
    }
  }

  return { props: { products: [], error: "Could not load products. Please try again later." } };
}