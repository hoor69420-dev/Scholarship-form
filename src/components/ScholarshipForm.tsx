import { useState } from 'react';
import { Upload, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FormData {
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  numStudents: string;
  gradeLevel: string;
  reason: string;
  confirmed: boolean;
}

export default function ScholarshipForm() {
  const [formData, setFormData] = useState<FormData>({
    organizationName: '',
    contactPerson: '',
    email: '',
    phone: '',
    numStudents: '',
    gradeLevel: '',
    reason: '',
    confirmed: false,
  });

  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, confirmed: e.target.checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.confirmed) {
      alert('Please confirm that the information provided is true.');
      return;
    }

    setIsSubmitting(true);

    try {
      let documentUrl = null;

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('scholarship-documents')
          .upload(fileName, file);

        if (uploadError) {
          console.error('File upload error:', uploadError);
        } else {
          const { data } = supabase.storage
            .from('scholarship-documents')
            .getPublicUrl(fileName);
          documentUrl = data.publicUrl;
        }
      }

      const { error } = await supabase.from('scholarship_applications').insert([
        {
          organization_name: formData.organizationName,
          contact_person: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
          num_students: parseInt(formData.numStudents),
          grade_level: formData.gradeLevel,
          reason: formData.reason,
          document_url: documentUrl,
          confirmed: formData.confirmed,
        },
      ]);

      if (error) throw error;

      setSubmitSuccess(true);
      setFormData({
        organizationName: '',
        contactPerson: '',
        email: '',
        phone: '',
        numStudents: '',
        gradeLevel: '',
        reason: '',
        confirmed: false,
      });
      setFile(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your scholarship application. We'll review it and get back to you soon.
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">
        Apply for a 100% <span className="text-orange-500">Scholarship</span>
      </h1>
      <div className="flex gap-1 mb-6">
        <div className="w-8 h-1 bg-orange-500 rounded-full"></div>
        <div className="w-8 h-1 bg-teal-400 rounded-full"></div>
        <div className="w-8 h-1 bg-orange-500 rounded-full"></div>
      </div>

      <div className="mb-6">
        <h2 className="text-orange-500 font-semibold mb-3">Organization Information</h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            name="organizationName"
            value={formData.organizationName}
            onChange={handleInputChange}
            placeholder="Organization Name"
            required
            className="col-span-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <input
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleInputChange}
            placeholder="Contact Person"
            required
            className="col-span-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter Email Address"
            required
            className="col-span-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter Phone Number"
            required
            className="col-span-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-orange-500 font-semibold mb-3">Student Information</h2>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            name="numStudents"
            value={formData.numStudents}
            onChange={handleInputChange}
            placeholder="Number of Students Applying for"
            required
            min="1"
            className="col-span-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <select
            name="gradeLevel"
            value={formData.gradeLevel}
            onChange={handleInputChange}
            required
            className="col-span-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700 bg-white"
          >
            <option value="">Grade Levels</option>
            <option value="K-2">K-2</option>
            <option value="3-5">3-5</option>
            <option value="6-8">6-8</option>
            <option value="9-12">9-12</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-orange-500 font-semibold mb-3">Reason for Requesting 100% Off</h2>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleInputChange}
          placeholder="Briefly explain your need"
          required
          rows={4}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-orange-500 font-semibold mb-3">Supporting Document (optional)</h2>
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-orange-500 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mb-2">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-gray-500">
              {file ? file.name : 'Upload file (if available)'}
            </p>
          </div>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
        </label>
      </div>

      <div className="mb-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.confirmed}
            onChange={handleCheckboxChange}
            required
            className="mt-1 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
          />
          <span className="text-sm text-gray-600">
            I confirm that the information provided is true and request consideration for a full scholarship.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Continue with AHS Today'}
      </button>
    </form>
  );
}
