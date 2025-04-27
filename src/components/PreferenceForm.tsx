import React, { useState } from 'react';
import { 
  FaCalendarAlt, 
  FaCloudSun, 
  FaTshirt, 
  FaUserAlt, 
  FaStickyNote,
  FaSpinner
} from 'react-icons/fa';

type PreferenceFormProps = {
  onSubmit: (preferences: {
    occasion: string;
    weather: string;
    style: string;
    gender: string;
    additionalNotes?: string;
  }) => void;
  isLoading: boolean;
};

export default function PreferenceForm({ onSubmit, isLoading }: PreferenceFormProps) {
  const [formData, setFormData] = useState({
    occasion: '',
    weather: '',
    style: '',
    gender: '',
    additionalNotes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <div className="space-y-4">
        <div>
          <label htmlFor="occasion" className="block text-sm font-medium mb-1 flex items-center gap-2">
            <FaCalendarAlt className="text-indigo-500" />
            Occasion
          </label>
          <input
            type="text"
            id="occasion"
            name="occasion"
            value={formData.occasion}
            onChange={handleChange}
            placeholder="Work, party, date night, casual outing..."
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label htmlFor="weather" className="block text-sm font-medium mb-1 flex items-center gap-2">
            <FaCloudSun className="text-indigo-500" />
            Weather
          </label>
          <select
            id="weather"
            name="weather"
            value={formData.weather}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          >
            <option value="">Select weather condition</option>
            <option value="Hot">Hot</option>
            <option value="Warm">Warm</option>
            <option value="Mild">Mild</option>
            <option value="Cool">Cool</option>
            <option value="Cold">Cold</option>
            <option value="Rainy">Rainy</option>
            <option value="Snowy">Snowy</option>
          </select>
        </div>

        <div>
          <label htmlFor="style" className="block text-sm font-medium mb-1 flex items-center gap-2">
            <FaTshirt className="text-indigo-500" />
            Preferred Style
          </label>
          <input
            type="text"
            id="style"
            name="style"
            value={formData.style}
            onChange={handleChange}
            placeholder="Casual, formal, bohemian, streetwear..."
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium mb-1 flex items-center gap-2">
            <FaUserAlt className="text-indigo-500" />
            Gender Style
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          >
            <option value="">Select gender style</option>
            <option value="Men's">Men's</option>
            <option value="Women's">Women's</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        <div>
          <label htmlFor="additionalNotes" className="block text-sm font-medium mb-1 flex items-center gap-2">
            <FaStickyNote className="text-indigo-500" />
            Additional Notes (Optional)
          </label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            placeholder="Color preferences, items to include/avoid, specific brands..."
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-indigo-400"
      >
        {isLoading ? (
          <>
            <FaSpinner className="animate-spin" />
            Generating recommendations...
          </>
        ) : (
          'Get Outfit Recommendations'
        )}
      </button>
    </form>
  );
} 