"use client";
import React, { useState, useEffect } from "react";
import ProductItemOrder from "./ProductItemOrder"; // <-- pakai komponen khusus order
import GlobalApi from "../_utils/GlobalApi";

const OrderSection = ({ selectedItems = {}, onAddItem, onRemoveItem }) => {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCategory, setOpenCategory] = useState(null);

  useEffect(() => {
    getProductList();
  }, []);

  const getProductList = async () => {
    try {
      const resp = await GlobalApi.getProduct();
      setProductList(resp);
      setLoading(false);
      if (resp && resp.length > 0) {
        const firstCategory =
          resp[0]?.attributes?.category?.data?.attributes?.name ??
          resp[0]?.category?.name;
        if (firstCategory) setOpenCategory(firstCategory);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  };

  const toggleCategory = (categoryName) => {
    setOpenCategory((prev) => (prev === categoryName ? null : categoryName));
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  const groups = productList.reduce((acc, p) => {
    const cat =
      p?.attributes?.category?.data?.attributes?.name ?? p?.category?.name ?? "Other";
    acc[cat] = acc[cat] || [];
    acc[cat].push(p);
    return acc;
  }, {});

  const categoryOrder = ["Makanan", "Minuman", "Snack"];
  const sortedCategories = Object.keys(groups).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="mt-2 max-w-4xl mx-auto px-4">
      {sortedCategories.map((category) => {
        const items = groups[category];
        const isOpen = openCategory === category;
        const arrowIcon = isOpen ? "∧" : "∨";

        return (
          <section key={category} className="mb-3">
            <div
              className={`flex items-center justify-between p-3 cursor-pointer rounded-2xl transition-all duration-300 ${
                isOpen ? "bg-[#faeed1]" : "bg-[#faeed1]"
              }`}
              onClick={() => toggleCategory(category)}
            >
              <span className="font-semibold text-lg text-[#382a25]">{category}</span>
              <span className="text-xl font-bold text-[#382a25]">{arrowIcon}</span>
            </div>

            <div
              className={`overflow-hidden rounded-3xl transition-all duration-500 ease-in-out bg-[#faeed1] ${
                isOpen ? "max-h-[5000px] opacity-100 p-4" : "max-h-0 opacity-0"
              }`}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((product) => {
                  const productId = product.id ?? product?.attributes?.id;
                  const count = selectedItems[productId]?.count ?? 0;
                  return (
                    <ProductItemOrder
                      key={productId}
                      product={product}
                      count={count}
                      onAddClick={() => onAddItem(product)}
                      onRemoveClick={() => onRemoveItem(product)}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default OrderSection;
