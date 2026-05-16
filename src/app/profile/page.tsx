"use client";

import axios from "axios";

import {
  Camera,
  Save,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      profileImage: "",
    });

  const [originalData, setOriginalData] =
    useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile =
    async () => {
      try {
        const res =
          await axios.get(
            "/api/auth/me"
          );

        const user =
          res.data.user;

        const data = {
          name: user.name,
          email: user.email,
          password: "",
          profileImage:
            user.profileImage || "",
        };

        setFormData(data);

        setOriginalData(data);
      } catch (error) {
        console.log(error);

        toast.error(
          "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

  const handleChange = (
    e: any
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleImageUpload =
    async (
      e: any
    ) => {
      try {
        const file =
          e.target.files[0];

        if (!file) return;

        const reader =
          new FileReader();

        reader.readAsDataURL(
          file
        );

        reader.onloadend =
          async () => {
            try {
              const base64 =
                reader.result;

              const res =
                await axios.post(
                  "/api/upload",
                  {
                    file: base64,
                  }
                );

              setFormData((prev) => ({
                ...prev,
                profileImage:
                  res.data.url,
              }));

              toast.success(
                "Profile photo selected"
              );
            } catch (error) {
              console.log(error);

              toast.error(
                "Upload failed"
              );
            }
          };
      } catch (error) {
        console.log(error);

        toast.error(
          "Upload failed"
        );
      }
    };

  const handleSave =
    async () => {
      try {
        setSaving(true);

        const res =
          await axios.put(
            "/api/profile/update",
            formData
          );

        if (
          res.data.success
        ) {
          toast.success(
            "Profile updated"
          );

          const updatedData = {
            ...formData,
            password: "",
          };

          setOriginalData(
            updatedData
          );

          setFormData(
            updatedData
          );

          // instantly refresh navbar
window.dispatchEvent(
  new Event("refreshNavbar")
);

router.refresh();

toast.success(
  "Profile updated successfully"
);

setTimeout(() => {
  router.push("/");
}, 800);
        }
      } catch (error: any) {
        console.log(error);

        toast.error(
          error.response?.data
            ?.message ||
            "Update failed"
        );
      } finally {
        setSaving(false);
      }
    };

  const handleCancel = () => {
    setFormData({
      ...originalData,
      password: "",
    });

    toast.success(
      "Changes discarded"
    );
  };

  const hasChanges =
    JSON.stringify({
      ...formData,
      password: "",
    }) !==
      JSON.stringify({
        ...originalData,
        password: "",
      }) ||
    formData.password;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center text-3xl font-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white px-4 py-16">
      
      <div className="max-w-4xl mx-auto rounded-[40px] border border-gray-800 bg-[#111827] p-10">

        <div className="flex flex-col md:flex-row gap-10 items-center">
          
          {/* Profile Image */}
          <div className="relative">
            
            <img
              src={
                formData.profileImage ||
                "https://ui-avatars.com/api/?name=User&background=06b6d4&color=fff"
              }
              className="w-40 h-40 rounded-full object-cover border-4 border-cyan-500"
            />

            <label className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center cursor-pointer hover:scale-105 transition">
              
              <Camera className="text-black w-5 h-5" />

              <input
                type="file"
                hidden
                accept="image/*"
                onChange={
                  handleImageUpload
                }
              />
            </label>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-5xl font-black">
              My Profile
            </h1>

            <p className="text-gray-400 mt-4 text-lg">
              Manage your account settings
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="grid md:grid-cols-2 gap-6 mt-14">

          {/* Name */}
          <div>
            <label className="text-gray-400 text-sm block mb-3">
              Full Name
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full h-14 rounded-2xl bg-[#0B1120] border border-gray-800 px-5 outline-none focus:border-cyan-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-400 text-sm block mb-3">
              Email
            </label>

            <input
              value={formData.email}
              disabled
              className="w-full h-14 rounded-2xl bg-[#0B1120] border border-gray-800 px-5 opacity-60 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mt-8">
          
          <label className="text-gray-400 text-sm block mb-3">
            New Password
          </label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Leave empty if you don't want to change"
            className="w-full h-14 rounded-2xl bg-[#0B1120] border border-gray-800 px-5 outline-none focus:border-cyan-500"
          />

          <div className="mt-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5 text-sm text-yellow-300 leading-7">
            Password must contain:
            <br />
            • Minimum 8 characters
            <br />
            • 1 uppercase letter
            <br />
            • 1 lowercase letter
            <br />
            • 1 number
            <br />
            • 1 special character
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-5 mt-12">

          <button
            onClick={handleSave}
            disabled={
              !hasChanges || saving
            }
            className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-lg flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

          <button
            onClick={handleCancel}
            disabled={!hasChanges}
            className="flex-1 h-14 rounded-2xl border border-gray-700 hover:bg-[#1F2937] transition text-lg flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <X className="w-5 h-5" />

            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}