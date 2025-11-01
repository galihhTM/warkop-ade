"use client";
import React, { useState, useEffect } from "react";
import ProductItem from "./ProductItem";
import GlobalApi from "../_utils/GlobalApi";
import { Skeleton } from "@/components/ui/skeleton";
import ModelViewer from "@/components/ModelViewer";
import { motion } from "framer-motion";

const listVariant = {
  enter: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.06, when: "beforeChildren" },
  },
  exit: { opacity: 0, y: 8, transition: { when: "afterChildren" } },
};

const itemVariant = {
  enter: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.32, ease: "easeOut" } },
  exit: { opacity: 0, y: 8, scale: 0.995, transition: { duration: 0.22, ease: "easeIn" } },
};

const variantsLeft = {
  enter: { opacity: 1, x: 0, transition: { duration: 2.5, ease: "easeOut" } },
  exit: { opacity: 0, x: -60, transition: { duration: 0.35, ease: "easeIn" } },
};

const variantsRight = {
  enter: { opacity: 1, x: 0, transition: { duration: 2.5, ease: "easeOut" } },
  exit: { opacity: 0, x: 60, transition: { duration: 0.35, ease: "easeIn" } },
};

const Section2 = () => {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCategory, setOpenCategory] = useState(null);

  // Fetch data produk
  useEffect(() => {
    GlobalApi.getProduct()
      .then((resp) => {
        setProductList(resp);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    const fakeCategories = ["Makanan", "Minuman", "Snack"];
    return (
      <div className="mt-10 max-w-4xl mx-auto px-4 md:px-0 ">
        {fakeCategories.map((category) => (
          <section key={category} className="mb-4">
            <div
              onClick={() => setOpenCategory(openCategory === category ? null : category)}
              className="flex items-center justify-between p-4 cursor-pointer rounded-3xl shadow-sm bg-[#faeed1] text-black"
            >
              <Skeleton className="h-6 w-32 rounded-full" />
              <span className="text-xl font-bold">{openCategory === category ? "∧" : "∨"}</span>
            </div>

            <div
              className={`overflow-hidden rounded-3xl transition-all duration-500 ease-in-out bg-[#faeed1] ${
                openCategory === category ? "max-h-[5000px] opacity-100 p-4" : "max-h-0 opacity-0"
              }`}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col p-2 border border-gray-200 rounded-3xl bg-[#382a25] space-y-3"
                  >
                    <Skeleton className="w-full aspect-square rounded-md" />
                    <Skeleton className="h-5 w-4/5 ml-2 rounded" />
                    <Skeleton className="h-6 w-1/2 ml-2 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    );
  }

  // === DATA SUDAH ADA: RENDER PRODUK ASLI ===
  const groups = productList.reduce((acc, p) => {
    const cat =
      p?.attributes?.category?.data?.attributes?.name ??
      p?.category?.name ??
      "Other";
    acc[cat] = acc[cat] || [];
    acc[cat].push(p);
    return acc;
  }, {});

  const categoryOrder = ["Makanan", "Minuman", "Snack"];
  const sortedCategories = Object.keys(groups).sort((a, b) => {
    const iA = categoryOrder.indexOf(a);
    const iB = categoryOrder.indexOf(b);
    if (iA !== -1 && iB !== -1) return iA - iB;
    if (iA !== -1) return -1;
    if (iB !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="flex flex-col lg:flex-row items-start gap-8 mt-10 max-w-7xl mx-auto px-4 md:px-6">
      <motion.div
        className="w-full lg:w-1/2 flex flex-col gap-4"
        variants={variantsLeft}
        initial="exit"
        whileInView="enter"
        viewport={{ once: false, amount: 0.18 }}
      >
        {sortedCategories.map((category) => {
          const items = groups[category];
          const isOpen = openCategory === category;

          return (
            <section id="menu" key={category} className="mb-4">
              <div
                onClick={() => setOpenCategory(isOpen ? null : category)}
                className="flex items-center justify-between p-4 cursor-pointer rounded-3xl shadow-sm bg-[#faeed1] text-black"
              >
                <span className="font-semibold text-lg">{category}</span>
                <span
                  className={`transition-transform duration-300 text-xl font-bold ${
                    isOpen ? "rotate-0" : "rotate-180"
                  }`}
                >
                  {isOpen ? "∧" : "∨"}
                </span>
              </div>

              <div
                className={`overflow-hidden rounded-3xl transition-all duration-500 ease-in-out bg-[#faeed1] ${
                  isOpen ? "max-h-[5000px] opacity-100 p-4" : "max-h-0 opacity-0"
                }`}
              >
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4"
                  variants={listVariant}
                  initial="exit"
                  whileInView="enter"
                  viewport={{ once: false, amount: 0.12 }}
                >
                  {items.map((product) => (
                    <motion.div key={product.id ?? product?.attributes?.id} variants={itemVariant}>
                      <ProductItem product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>
          );
        })}
      </motion.div>

      <motion.div
        className="w-full lg:w-1/2 flex justify-center self-start sticky top-32"
        variants={variantsRight}
        initial="exit"
        whileInView="enter"
        viewport={{ once: false, amount: 0.18 }}
      >
        <div className="w-full max-w-md h-[520px] p-8 rounded-3xl bg-[#171717] shadow-xl flex items-center justify-center">
          <ModelViewer
            url="/models/coffee_mug.glb"
            alt="Model Kopi 3D"
            autoRotate
            cameraControls
            exposure={1.2}
            style={{
              width: "85%",
              height: "85%",
              maxWidth: "400px",
              maxHeight: "450px",
              backgroundColor: "transparent",
              borderRadius: "1.5rem",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Section2;
