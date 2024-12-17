import { useState } from "react";
import { FormDataType } from "../lib/types";
import axios from "axios";
import { toast } from "react-toastify";

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormDataType>({
    emp_name: "",
    emp_id: "",
    emp_email: "",
    emp_phone: "",
    emp_dept: "HR",
    emp_doj: "",
    emp_role: "",
  });

  const [Errors, setErrors] = useState<Record<string, string>>({
    emp_id: "",
    emp_phone: "",
  });

  const today = new Date().toISOString().split("T")[0];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.emp_phone.trim()) newErrors.emp_phone = "Phone number is required";
    else if (isNaN(Number(formData.emp_phone))) newErrors.emp_phone = "Phone number should be integer";
    else if (formData.emp_phone.length != 10) newErrors.emp_phone = "Phone number should be exactly 10 digits";

    if (!formData.emp_id.trim()) newErrors.emp_id = "Employee id is required";
    else if (isNaN(Number(formData.emp_id))) newErrors.emp_id = "Employee ID should be an integer";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log("Form submitted successfully:", formData);
    try {
      const res = await axios.post("https://form-backend-tuue.onrender.com/api", formData);
      if (res && res.status == 201) {
        toast.success(res.data.success);
        console.log("Form submitted successfully", res.data.result);
      } else if (res && res.status == 200) {
        toast.warn(res.data.warning);
      } else {
        toast.error(res.data.failure);
      }
    } catch (err) {
      toast.error("Internal Server Error");
      console.log("error", err);
    }
  };

  const handleReset=()=>{
    setFormData({
      ...formData,
      emp_name: "",
      emp_id: "",
      emp_email: "",
      emp_phone: "",
      emp_dept: "HR",
      emp_doj: "",
      emp_role: "",
    });

    setErrors({
      ...Errors,
      emp_id: "",
     emp_phone: "",
    });
    toast.warn("Form has been reset")
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...Errors,
      [name]: "",
    });
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
        <h1 className="text-center text-2xl flex justify-between font-bold text-gray-700 mb-6">
          Employee Registration
          <div onClick={handleReset} className="text-red-600 font-normal text-sm border-solid border-red-600 border rounded-lg p-1 hover:text-white hover:bg-red-600">Reset</div>
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label htmlFor="emp_name" className="block text-sm font-medium text-gray-700">
              Name:
            </label>
            <input
              type="text"
              name="emp_name"
              required
              value={formData.emp_name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="emp_id" className="block text-sm font-medium text-gray-700">
              Employee ID:
            </label>
            <input
              type="text"
              name="emp_id"
              value={formData.emp_id}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            {Errors.emp_id && <p className="text-red-500 text-sm">{Errors.emp_id}</p>}
          </div>
          <div>
            <label htmlFor="emp_email" className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              name="emp_email"
              required
              value={formData.emp_email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label htmlFor="emp_phone" className="block text-sm font-medium text-gray-700">
              Phone:
            </label>
            <input
              type="text"
              name="emp_phone"
              value={formData.emp_phone}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            {Errors.emp_phone && <p className="text-red-500 text-sm">{Errors.emp_phone}</p>}
          </div>
          <div>
            <label htmlFor="emp_role" className="block text-sm font-medium text-gray-700">
              Role:
            </label>
            <input
              type="text"
              name="emp_role"
              required
              value={formData.emp_role}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="emp_doj" className="block text-sm font-medium text-gray-700">
              Date of Joining:
            </label>
            <input
              type="date"
              name="emp_doj"
              max={today}
              required
              value={formData.emp_doj}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="emp_role" className="block text-sm font-medium text-gray-700">
              Department:
            </label>
            <select
              name="emp_dept"
              value={formData.emp_dept}
              required
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="HR">HR</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full border-2 border-blue-500 text-blue-500 font-medium py-2 rounded-md hover:bg-blue-500 hover:text-white"
          >
            SUBMIT
          </button>
        </form>
      </div>
    </section>
  );
};

export default App;
