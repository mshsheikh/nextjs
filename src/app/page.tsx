"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@sanity/client";
import Image from "next/image";

// Sanity Client Setup
const sanityClient = createClient({
  projectId: "cturxqmc", // Replace with your Sanity project ID
  dataset: "production", // Replace with your Sanity dataset
  useCdn: true,
});

// Define a Product interface to avoid the 'any' type
interface Product {
  _id: string;
  name: string;
  imageUrl: string;
  price: number;
  description: string;
  discountPercentage: number;
  priceWithoutDiscount: number;
  rating: number;
  ratingCount: number;
  tags: string[];
  sizes: string[];
}

const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products asynchronously
  useEffect(() => {
    async function fetchProducts() {
      const query =
        '*[_type == "product"] {_id, name, "imageUrl": image.asset->url, price, description, discountPercentage, priceWithoutDiscount, rating, ratingCount, tags, sizes}';
      const fetchedProducts = await sanityClient.fetch(query);
      setProducts(fetchedProducts);
    }

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 py-10 px-5">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Exclusive Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              {product.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
              )}

              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition duration-200">
                  {product.name}
                </h2>
                <p className="text-gray-600 mt-2">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="text-sm text-red-500">
                      {product.discountPercentage}% OFF
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-yellow-500">⭐ {product.rating}</span>
                  <span className="text-gray-500">
                    ({product.ratingCount} reviews)
                  </span>
                </div>

                <div className="mt-3">
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap space-x-2">
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-sm px-3 py-1 bg-gray-200 text-gray-700 rounded-full hover:bg-blue-500 hover:text-white transition duration-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="flex space-x-2">
                      {product.sizes.map((size) => (
                        <span
                          key={size}
                          className="text-sm px-3 py-1 border border-gray-300 rounded-md hover:bg-blue-200 transition duration-200"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0">
                <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Loading products...</p>
        )}
      </div>
    </div>
  );
};

export default Page;
