import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setProfileSetup } from "../store/authSlice";
import { apiCallWithAuth } from "../api/client";
import API_URLS from "../utils/apiUrls";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/login.webp";

const ProfileSetup = () => {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    gender: "",
    heightInCm: "",
    weightInKg: "",
    bloodType: "",
    activeDrinker: "",
    activeSmoker: "",
    allergies: "",
    conditions: "",
    medications: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNext = () => {
    if (
      !values.firstName ||
      !values.lastName ||
      !values.gender ||
      !values.dob ||
      !values.weightInKg ||
      !values.heightInCm ||
      !values.bloodType ||
      !values.phone
    ) {
      setError("Please complete all required fields before continuing.");
      return;
    }

    setError("");
    setSuccess("");
    setStep(2);
  };

  const handleComplete = async () => {
    if (!values.activeDrinker || !values.activeSmoker) {
      setError("Please answer the alcohol and smoking questions.");
      return;
    }

    setError("");
    const response = await apiCallWithAuth(API_URLS.SAVE_PROFILE, "POST", {
      phone: values.phone,
      firstName: values.firstName,
      lastName: values.lastName,
      dob: values.dob,
      gender: values.gender,
      heightInCm: values.heightInCm ? Number(values.heightInCm) : null,
      weightInKg: values.weightInKg ? Number(values.weightInKg) : null,
      bloodType: values.bloodType,
      activeDrinker: values.activeDrinker === "true",
      activeSmoker: values.activeSmoker === "true",
      allergies: values.allergies ? values.allergies.split(",").map((item) => item.trim()).filter(Boolean) : [],
      conditions: values.conditions ? values.conditions.split(",").map((item) => item.trim()).filter(Boolean) : [],
      medications: values.medications ? values.medications.split(",").map((item) => item.trim()).filter(Boolean) : [],
    });

    if (response.success) {
      setSuccess("Profile saved successfully.");
      dispatch(setProfileSetup(true));
      navigate("/patient/dashboard");
      return;
    }

    setSuccess("");
    setError(response.message || "Failed to save profile. Please try again.");
  };

  return (
    <div className="auth-container" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="auth-form-section">
        <p className="text-sm font-semibold mb-2" style={{ color: "rgb(198, 40, 40)" }}>
          STEP {step} OF 2
        </p>
        <h2 className="auth-title">{step === 1 ? "Few more details" : "Medical details"}</h2>
        <p className="auth-subtitle">
          {step === 1
            ? "Create your profile to get started"
            : "Help us personalize your care"}
        </p>

        {step === 1 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">First name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="First name"
                  value={values.firstName}
                  onChange={(e) => setValues({ ...values, firstName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Last name"
                  value={values.lastName}
                  onChange={(e) => setValues({ ...values, lastName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Gender *</label>
                <select
                  className="form-input"
                  value={values.gender}
                  onChange={(e) => setValues({ ...values, gender: e.target.value })}
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date of birth *</label>
                <input
                  type="date"
                  className="form-input"
                  value={values.dob}
                  onChange={(e) => setValues({ ...values, dob: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone number *</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Phone number"
                  value={values.phone}
                  onChange={(e) => setValues({ ...values, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Blood group *</label>
                <select
                  className="form-input"
                  value={values.bloodType}
                  onChange={(e) => setValues({ ...values, bloodType: e.target.value })}
                >
                  <option value="">Select blood group</option>
                  <option value="A_POSITIVE">A+</option>
                  <option value="A_NEGATIVE">A-</option>
                  <option value="B_POSITIVE">B+</option>
                  <option value="B_NEGATIVE">B-</option>
                  <option value="AB_POSITIVE">AB+</option>
                  <option value="AB_NEGATIVE">AB-</option>
                  <option value="O_POSITIVE">O+</option>
                  <option value="O_NEGATIVE">O-</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Weight (kg) *</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 70"
                  value={values.weightInKg}
                  onChange={(e) => setValues({ ...values, weightInKg: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Height (cm) *</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 170"
                  value={values.heightInCm}
                  onChange={(e) => setValues({ ...values, heightInCm: e.target.value })}
                />
              </div>
            </div>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <button className="btn-primary" onClick={handleNext}>
              Next
            </button>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Do you consume alcohol? *</label>
                <select
                  className="form-input"
                  value={values.activeDrinker}
                  onChange={(e) => setValues({ ...values, activeDrinker: e.target.value })}
                >
                  <option value="">Select answer</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Do you smoke or have ever smoked? *</label>
                <select
                  className="form-input"
                  value={values.activeSmoker}
                  onChange={(e) => setValues({ ...values, activeSmoker: e.target.value })}
                >
                  <option value="">Select answer</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="form-group sm:col-span-2">
                <label className="form-label">Allergies</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Type & press Enter"
                  value={values.allergies}
                  onChange={(e) => setValues({ ...values, allergies: e.target.value })}
                />
              </div>
              <div className="form-group sm:col-span-2">
                <label className="form-label">Medical conditions</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Type & press Enter"
                  value={values.conditions}
                  onChange={(e) => setValues({ ...values, conditions: e.target.value })}
                />
              </div>
              <div className="form-group sm:col-span-2">
                <label className="form-label">Current medications</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Type & press Enter"
                  value={values.medications}
                  onChange={(e) => setValues({ ...values, medications: e.target.value })}
                />
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="btn-secondary" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="btn-primary" onClick={handleComplete}>
                Save & continue
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileSetup;
