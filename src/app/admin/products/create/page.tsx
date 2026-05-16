"use client";

import axios from "axios";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

export default function CreateProductPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

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
    });

  const [images, setImages] = useState<
    string[]
  >([]);

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

  const onDrop = async (
    acceptedFiles: File[]
  ) => {
    try {
      setUploading(true);

      const uploadedUrls: string[] = [];

      for (const file of acceptedFiles) {
        const reader = new FileReader();

        const base64: string =
          await new Promise((resolve) => {
            reader.readAsDataURL(file);

            reader.onloadend = () => {
              resolve(reader.result as string);
            };
          });

        const res = await axios.post(
          "/api/upload",
          {
            file: base64,
          }
        );

        uploadedUrls.push(res.data.url);
      }

      setImages((prev) => [
        ...prev,
        ...uploadedUrls,
      ]);

      toast.success("Images uploaded");
    } catch (error) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const updated = [...images];

    updated.splice(index, 1);

    setImages(updated);
  };

  const { getRootProps, getInputProps } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [],
      },
      multiple: true,
    });

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        "/api/products/create",
        {
          ...formData,
          images,
        }
      );

      toast.success(
        "Product created successfully"
      );

      router.push("/admin/products");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-5xl font-black">
          Add Product
        </h1>

        <p className="text-gray-400 mt-3">
          Create new TechStore product
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
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full h-40 rounded-2xl bg-[#111827] border border-gray-800 px-5 py-5"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full h-14 rounded-2xl bg-[#111827] border border-gray-800 px-5"
            required
          />

          <div
            {...getRootProps()}
            className="border-2 border-dashed border-cyan-500 rounded-3xl p-10 text-center cursor-pointer hover:bg-[#111827] transition"
          >
            <input {...getInputProps()} />

            <p className="text-lg font-semibold">
              {uploading
                ? "Uploading..."
                : "Drag & Drop Images Here"}
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Upload multiple images
            </p>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative"
                >
                  <img
                    src={img}
                    alt="product"
                    className="w-full h-40 object-cover rounded-2xl"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeImage(index)
                    }
                    className="absolute top-2 right-2 bg-red-500 p-1 rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="w-full h-14 rounded-2xl bg-[#111827] border border-gray-800 px-5"
            required
          />

          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full h-14 rounded-2xl bg-[#111827] border border-gray-800 px-5"
            required
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full h-14 rounded-2xl bg-[#111827] border border-gray-800 px-5"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-lg"
          >
            {loading
              ? "Creating..."
              : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}