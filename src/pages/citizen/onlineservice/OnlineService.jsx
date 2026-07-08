import React, { useMemo, useState } from "react";
import {
  Building2,
  CheckCircle,
  CreditCard,
  Landmark,
  Upload,
} from "lucide-react";
import api from "../../../api/api";

const createInitialFormData = () => ({
  fullName: "",
  phoneNumber: "",
  wardNumber: "",
  buildingNumber: "",
  houseNumber: "",
  area: "",
  colony: "",
  street: "",
  pincode: "",
  serviceType: "",
  subCategory: "",
  duration: "",
  startMonth: new Date().toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  }),
  paymentMethod: "Bank Transfer",
  transactionReference: "",
  paymentDate: "",
  paymentRemarks: "",
  paymentProof: null,
});

const ServiceBookingApp = () => {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [receiptId, setReceiptId] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(createInitialFormData());

  const bankDetails = useMemo(
    () => ({
      bankName: "Indian Overseas Bank",
      branch: "Polosara",
      accountName: "POLOSARA NAC ULB",
      accountNumber: "104901000312100",
      ifsc: "IOBA0001049",
      micr: "761020501",
    }),
    []
  );

  const serviceCategories = {
    Residential: ["House Tax", "Guest House", "Hostel"],
    "Commercial Establishment": [
      "Shops",
      "Food Court",
      "Restaurant/Bar",
      "5 Star Hotel",
      "3 Star Hotel",
      "2 Star Hotel",
    ],
    "Commercial Offices": [
      "Government Offices",
      "Private Offices",
      "Banks",
      "Insurance Company",
    ],
    "Educational Institutions": [
      "Play School",
      "Coaching Classes",
      "Schools",
      "Non-Residential Educational Institution",
    ],
    "Other Services": [
      "Beauty/Salon Shop",
      "Petrol Pump",
      "Automated Food Sale Vendor",
      "Taxi Service",
      "Vehicle Service Center",
      "Vehicle Parking",
      "Cinema Hall",
      "Home Theater",
    ],
  };

  const durations = [
    { value: "1", label: "1 Month", price: 500 },
    { value: "3", label: "3 Months", price: 1400, discount: "7% OFF" },
    { value: "6", label: "6 Months", price: 2700, discount: "10% OFF" },
    { value: "12", label: "12 Months (Annual)", price: 5000, discount: "17% OFF" },
  ];

  const handleInputChange = (e) => {
    setError("");
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const calculateTotal = () => {
    const duration = durations.find((entry) => entry.value === formData.duration);
    return duration ? duration.price : 0;
  };

  const formatCurrency = (value) => `Rs. ${Number(value).toLocaleString("en-IN")}`;

  const isStep1Valid =
    formData.fullName.trim() &&
    /^[6-9]\d{9}$/.test(formData.phoneNumber) &&
    formData.wardNumber.trim() &&
    formData.houseNumber.trim() &&
    formData.street.trim() &&
    formData.area.trim() &&
    /^\d{6}$/.test(formData.pincode);

  const isPaymentValid =
    formData.transactionReference.trim() &&
    formData.paymentDate &&
    formData.paymentProof;

  const handleSubmitPayment = async () => {
    if (!formData.subCategory || !formData.duration || !isPaymentValid) return;

    setSaving(true);
    setError("");

    try {
      const payload = new FormData();
      Object.entries({
        ...formData,
        amount: calculateTotal(),
      }).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });

      const response = await api.post("/citizen/online-services", payload);
      setReceiptId(response?.data?.data?.receiptId || "");
      setStep(5);
    } catch (err) {
      console.error("Error saving online service booking", err);
      setError(
        err?.response?.data?.message ||
          "Failed to submit payment details. Please check the form and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setReceiptId("");
    setError("");
    setFormData(createInitialFormData());
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Applicant & Property Information</h2>
        <p className="text-gray-600">Enter your contact and property details to continue</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="Enter applicant name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number *</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="10-digit mobile number"
            maxLength="10"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Ward Number *</label>
          <input
            type="text"
            name="wardNumber"
            value={formData.wardNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="Enter ward number"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Building Number <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <input
            type="text"
            name="buildingNumber"
            value={formData.buildingNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="Enter building number"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">House Number / Plot No *</label>
          <input
            type="text"
            name="houseNumber"
            value={formData.houseNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="House/Plot/Flat number"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Street / Sector *</label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="Street or Sector"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Area / Colony *</label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="Area or Colony name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Landmark / Colony Detail <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <input
            type="text"
            name="colony"
            value={formData.colony}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="Additional address detail"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode *</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="6-digit pincode"
            maxLength="6"
            required
          />
        </div>
      </div>

      <button
        onClick={() => setStep(2)}
        disabled={!isStep1Valid}
        className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
      >
        Next: Select Service Type
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Select Service Type</h2>
        <p className="text-gray-600">Choose the type of property or establishment</p>
      </div>

      {Object.entries(serviceCategories).map(([category, services]) => (
        <div key={category} className="bg-white rounded-lg border-2 border-gray-200 p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Building2 size={20} className="text-blue-600" />
            {category}
          </h3>
          <div className="grid md:grid-cols-2 gap-2">
            {services.map((service) => (
              <button
                key={service}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, serviceType: category, subCategory: service }));
                  setStep(3);
                }}
                className="text-left px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                {service}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={() => setStep(1)}
        className="w-full bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-all"
      >
        Back
      </button>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Select Payment Duration</h2>
        <p className="text-gray-600">Choose your payment plan</p>
      </div>

      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-700">
          <strong>Selected Service:</strong> {formData.subCategory}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Location:</strong> {formData.houseNumber}, {formData.street}, {formData.area}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {durations.map((duration) => (
          <button
            key={duration.value}
            onClick={() => setFormData((prev) => ({ ...prev, duration: duration.value }))}
            className={`p-6 border-[3px] rounded-lg transition-all relative ${
              formData.duration === duration.value
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            {duration.discount && (
              <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                {duration.discount}
              </span>
            )}
            <div className="text-lg font-bold text-gray-800 mb-2">{duration.label}</div>
            <div className="text-3xl font-bold text-blue-600">{formatCurrency(duration.price)}</div>
            {duration.value !== "1" && (
              <div className="text-sm text-gray-500 mt-1">
                {formatCurrency(Math.round(duration.price / parseInt(duration.value, 10)))}/month
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep(2)}
          className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-all"
        >
          Back
        </button>
        <button
          onClick={() => setStep(4)}
          disabled={!formData.duration}
          className="flex-1 bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Summary</h2>
        <p className="text-gray-600">Transfer the amount to the municipal bank account and submit your payment details</p>
      </div>

      <div className="bg-white border-2 border-gray-300 rounded-lg p-6 space-y-4">
        <div className="border-b pb-4">
          <h3 className="font-bold text-lg text-gray-800 mb-3">Property Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600">Applicant:</div>
            <div className="font-semibold">{formData.fullName}</div>

            <div className="text-gray-600">Mobile:</div>
            <div className="font-semibold">{formData.phoneNumber}</div>

            <div className="text-gray-600">Ward Number:</div>
            <div className="font-semibold">{formData.wardNumber}</div>

            <div className="text-gray-600">House/Plot Number:</div>
            <div className="font-semibold">{formData.houseNumber}</div>

            <div className="text-gray-600">Address:</div>
            <div className="font-semibold">{formData.street}, {formData.area}</div>

            <div className="text-gray-600">Pincode:</div>
            <div className="font-semibold">{formData.pincode}</div>
          </div>
        </div>

        <div className="border-b pb-4">
          <h3 className="font-bold text-lg text-gray-800 mb-3">Service Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600">Category:</div>
            <div className="font-semibold">{formData.serviceType}</div>

            <div className="text-gray-600">Service Type:</div>
            <div className="font-semibold">{formData.subCategory}</div>

            <div className="text-gray-600">Duration:</div>
            <div className="font-semibold">
              {durations.find((entry) => entry.value === formData.duration)?.label}
            </div>

            <div className="text-gray-600">Start Date:</div>
            <div className="font-semibold">{formData.startMonth}</div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center text-lg">
            <span className="font-bold text-gray-800">Total Amount:</span>
            <span className="font-bold text-blue-600 text-2xl">{formatCurrency(calculateTotal())}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Landmark size={20} className="text-amber-600" />
            Bank Transfer Details
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>Bank:</strong> {bankDetails.bankName}</p>
            <p><strong>Branch:</strong> {bankDetails.branch}</p>
            <p><strong>Account Name:</strong> {bankDetails.accountName}</p>
            <p><strong>Account Number:</strong> {bankDetails.accountNumber}</p>
            <p><strong>IFSC:</strong> {bankDetails.ifsc}</p>
            <p><strong>MICR:</strong> {bankDetails.micr}</p>
            <p><strong>Amount to Transfer:</strong> {formatCurrency(calculateTotal())}</p>
          </div>
          <p className="text-xs text-amber-700 mt-4">
            After making the transfer, enter the UTR or transaction number and upload the payment screenshot below.
          </p>
        </div>

        <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-5 space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Submit Payment Proof</h3>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
            <input
              type="text"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-600 focus:outline-none"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">UTR / Transaction Reference *</label>
            <input
              type="text"
              name="transactionReference"
              value={formData.transactionReference}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="Enter bank transfer reference number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Date *</label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Remarks</label>
            <textarea
              name="paymentRemarks"
              value={formData.paymentRemarks}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="Optional note for verification team"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Screenshot *</label>
            <label className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-all bg-white text-center">
              <Upload size={22} className="text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">
                {formData.paymentProof ? formData.paymentProof.name : "Upload payment proof"}
              </span>
              <span className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP up to 5MB</span>
              <input
                type="file"
                name="paymentProof"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleInputChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => setStep(3)}
          className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-all"
        >
          Back
        </button>
        <button
          onClick={handleSubmitPayment}
          disabled={saving || !formData.subCategory || !formData.duration || !isPaymentValid}
          className="flex-1 bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          <CreditCard size={20} />
          {saving ? "Submitting..." : "Submit for Verification"}
        </button>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="text-center py-12">
      <div className="mb-6 flex justify-center">
        <CheckCircle size={80} className="text-green-500" />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment Submitted</h2>
      <p className="text-gray-600 mb-2">Your application is waiting for municipal payment verification</p>
      <p className="text-sm text-gray-500 mb-8">Receipt ID: {receiptId || "Pending generation"}</p>

      <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 max-w-md mx-auto mb-8">
        <div className="text-left space-y-2 text-sm">
          <p><strong>Service:</strong> {formData.subCategory}</p>
          <p><strong>Duration:</strong> {durations.find((entry) => entry.value === formData.duration)?.label}</p>
          <p><strong>Amount Submitted:</strong> {formatCurrency(calculateTotal())}</p>
          <p><strong>Valid From:</strong> {formData.startMonth}</p>
          <p><strong>Transaction Ref:</strong> {formData.transactionReference}</p>
          <p><strong>Status:</strong> Pending Verification</p>
        </div>
      </div>

      <button
        onClick={resetForm}
        className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all"
      >
        Make Another Booking
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-cyan-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Online Service Booking</h1>
            <p className="text-gray-600">Municipal Services Manual Payment Portal</p>
          </div>

          <div className="flex justify-center items-center mb-8 gap-6">
            {[1, 2, 3, 4].map((entry, idx) => (
              <div key={entry} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= entry ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {entry}
                </div>
                {idx < 3 && (
                  <div
                    className={`w-24 h-1 ${step > entry ? "bg-blue-600" : "bg-gray-300"} mx-4`}
                  />
                )}
              </div>
            ))}
          </div>

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>Need help? Contact support: support@municipal.gov.in | 1800-XXX-XXXX</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceBookingApp;
