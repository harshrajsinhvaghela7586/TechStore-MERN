"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import {
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

export default function EditProductPage() {
  const params = useParams();

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      price: "",
      category: "",
      brand: "",
      stock: "",
      images: [] as string[],
    });

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        "/api/products/get"
      );

      const product = res.data.products.find(
        (p: any) => p._id === params.id
      );

      if (product) {
        setFormData(product);
      }
    } catch (error) {
      toast.error("Failed to load product");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
const handleImageUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  try {
    setUploading(true);

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const res = await axios.post(
          "/api/upload",
          {
            file: reader.result,
          }
        );

        setFormData((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            res.data.url,
          ],
        }));

        toast.success(
          "Image uploaded successfully"
        );
      } catch (error: any) {
        console.log(
          "IMAGE UPLOAD ERROR:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
            "Image upload failed"
        );
      } finally {
        setUploading(false);
      }
    };

    reader.onerror = () => {
      toast.error(
        "Failed to read image file"
      );

      setUploading(false);
    };

    reader.readAsDataURL(file);
  } catch (error) {
    console.log(error);

    toast.error("Upload failed");

    setUploading(false);
  }
};

const handleSubmit = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  try {
    setLoading(true);

    const payload = {
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      brand: formData.brand,
      stock: Number(formData.stock),
      images: formData.images,
    };

    await axios.put(
      `/api/products/update/${params.id}`,
      payload
    );

    toast.success(
      "Product updated successfully"
    );

    router.push("/admin/products");
  } catch (error: any) {
    console.log(
      "PRODUCT UPDATE ERROR:",
      error
    );

    toast.error(
      error?.response?.data?.message ||
        "Update failed"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <div className="mb-10">
        <h1 className="text-5xl font-black">
          Edit Product
        </h1>

        <p className="text-gray-400 mt-3">
          Update product details
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid lg:grid-cols-2 gap-8"
      >
        <div className="space-y-6">
          <input
            type="text"
            name="title"
            placeholder="Product Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full h-14 rounded-2xl bg-[#111827] border border-gray-800 px-5"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full h-40 rounded-2xl bg-[#111827] border border-gray-800 px-5 py-5"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full h-14 rounded-2xl bg-[#111827] border border-gray-800 px-5"
          />
        </div>

        <div className="space-y-6">
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="w-full h-14 rounded-2xl bg-[#111827] border border-gray-800 px-5"
          />

          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full h-14 rounded-2xl bg-[#111827] border border-gray-800 px-5"
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full h-14 rounded-2xl bg-[#111827] border border-gray-800 px-5"
          />

          {/* Upload Image */}
          <div className="rounded-3xl border border-dashed border-gray-700 p-6 bg-[#111827]">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full"
            />

            {uploading && (
              <p className="text-cyan-400 mt-3">
                Uploading image...
              </p>
            )}
          </div>

          {/* Preview Images */}
          <div className="grid grid-cols-3 gap-4">
            {formData.images.map(
              (image, index) => (
                <div
                  key={index}
                  className="relative"
                >
                  <img
                    src={image}
                    className="w-full h-28 rounded-2xl object-cover border border-gray-800"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        images:
                          formData.images.filter(
                            (_, i) =>
                              i !== index
                          ),
                      })
                    }
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600 text-sm"
                  >
                    ×
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        <button
          type="submit"
          className="h-14 px-10 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold"
        >
          {loading
            ? "Updating..."
            : "Update Product"}
        </button>
      </form>
    </div>
  );
}