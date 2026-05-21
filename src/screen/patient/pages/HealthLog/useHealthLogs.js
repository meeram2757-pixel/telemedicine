import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchHealthLogs } from "../../../../store/healthLogsSlice";
import { apiCallWithAuth } from "../../../../api/client";
import API_URLS from "../../../../utils/apiUrls";

const initialFormState = {
  problem: "",
  feelings: ["Pain"],
  location: "",
  intensity: 50,
  dateStarted: "",
  symptoms: "",
  images: [],
};

const unwrapLogEntry = (entry) => {
  if (!entry || typeof entry !== "object") return entry;
  if (entry.healthLog && typeof entry.healthLog === "object") {
    return unwrapLogEntry(entry.healthLog);
  }
  if (entry.data && typeof entry.data === "object" && !Array.isArray(entry.data)) {
    return unwrapLogEntry(entry.data);
  }
  return entry;
};

export const getLogValue = (entry, ...keys) => {
  if (!entry) return undefined;
  const unwrapped = unwrapLogEntry(entry);

  for (const key of keys) {
    if (unwrapped[key] !== undefined && unwrapped[key] !== null) {
      return unwrapped[key];
    }
  }

  return undefined;
};

export const getLogArray = (entry, ...keys) => {
  const value = getLogValue(entry, ...keys);
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return value !== undefined ? [value] : [];
};

export const getLogImageUrls = (entry) => {
  const value = getLogValue(entry, "images", "attachments", "photos", "files");
  if (!value) {
    const unwrapped = unwrapLogEntry(entry);
    const fallbackValue = getLogValue(unwrapped, "images", "attachments", "photos", "files");
    if (!fallbackValue) return [];
    return getLogImageUrls({ images: fallbackValue });
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item;
        if (item?.url) return item.url;
        if (item?.path) return item.path;
        if (item?.src) return item.src;
        return undefined;
      })
      .filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const formatDateForInput = (value) => {
  if (!value) return "";
  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.valueOf())) {
      return parsed.toISOString().slice(0, 10);
    }
    if (value.includes("T")) {
      return value.split("T")[0];
    }
    return value;
  }
  if (typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.valueOf())) {
      return parsed.toISOString().slice(0, 10);
    }
  }
  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value.toISOString().slice(0, 10);
  }
  return "";
};

export const useHealthLogs = () => {
  const dispatch = useDispatch();
  const { logs, status, error: reduxError } = useSelector((state) => state.healthLogs);
  const [localLoading, setLocalLoading] = useState(false);
  const loading = status === "loading" || status === "refreshing" || localLoading;
  
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingLogId, setEditingLogId] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  useEffect(() => {
    dispatch(fetchHealthLogs());
  }, [dispatch]);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleFeeling = (option) => {
    setForm((prev) => {
      const alreadySelected = prev.feelings.includes(option);
      const nextFeelings = alreadySelected
        ? prev.feelings.filter((item) => item !== option)
        : [...prev.feelings, option];

      return {
        ...prev,
        feelings: nextFeelings.length > 0 ? nextFeelings : [option],
      };
    });
  };

  const handleFiles = (event) => {
    const selectedFiles = Array.from(event.target.files || []).slice(0, 5);
    const filesWithPreview = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${file.name}-${file.size}-${file.lastModified}`,
    }));
    setForm((prev) => ({ ...prev, images: filesWithPreview }));
  };

  const removeExistingImage = (id) => {
    setExistingImages((prev) => prev.filter((image) => image.id !== id));
    setRemovedImages((prev) => [...prev, id]);
  };

  const removeImage = (id) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((image) => {
        if (image.id === id) {
          URL.revokeObjectURL(image.preview);
          return false;
        }
        return true;
      }),
    }));
  };

  const resetForm = () => {
    form.images.forEach((image) => URL.revokeObjectURL(image.preview));
    setForm(initialFormState);
    setExistingImages([]);
    setRemovedImages([]);
    setEditingLogId(null);
    setError("");
  };

  const openCreateModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const startEdit = (log) => {
    const entry = log.healthLog || log.data || log;
    const logId = getLogValue(entry, "_id", "id");

    setEditingLogId(logId);
    setForm({
      problem: getLogValue(entry, "problem", "title", "reason") || "",
      feelings: getLogArray(entry, "feelings", "feeling", "emotion", "mood") || ["Pain"],
      location: getLogValue(entry, "location", "bodyPart", "area", "problemArea") || "",
      intensity: getLogValue(entry, "intensity", "severity", "level") ?? 50,
      dateStarted: formatDateForInput(
        getLogValue(entry, "dateStarted", "startedAt", "date", "createdAt")
      ),
      symptoms: getLogValue(entry, "symptoms", "description", "details", "notes") || "",
      images: [],
    });

    const imageUrls = getLogImageUrls(entry);
    setExistingImages(
      imageUrls.map((url, index) => ({
        id: `existing-${index}-${url}`,
        url,
      }))
    );
    setRemovedImages([]);
    setModalOpen(true);
  };

  const handleDelete = async (logId) => {
    setLocalLoading(true);
    setError("");

    const result = await apiCallWithAuth(API_URLS.HEALTH_LOG(logId), "DELETE");
    setLocalLoading(false);

    if (result && typeof result === "object" && result.success === false) {
      setError(result.message || "Unable to delete health log.");
      return;
    }

    dispatch(fetchHealthLogs());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    let isoDate;
    try {
      isoDate = new Date(form.dateStarted).toISOString();
    } catch (e) {
      isoDate = form.dateStarted;
    }

    let finalUrls = [...existingImages.map((img) => img.url).filter(Boolean)];

    if (form.images.length > 0) {
      const generatePayload = {
        files: form.images.map(img => ({
          name: img.file.name,
          type: img.file.type,
          size: img.file.size
        }))
      };

      const generateResult = await apiCallWithAuth(API_URLS.GENERATE_UPLOAD_URLS, "POST", generatePayload);

      if (generateResult && generateResult.success && generateResult.data) {
        // Upload each file
        const uploadPromises = form.images.map(async (img, index) => {
          const fileData = generateResult.data[index];
          if (!fileData || !fileData.presignedUrl) return null;

          try {
            const res = await fetch(fileData.presignedUrl, {
              method: "PUT",
              body: img.file,
              headers: {
                "Content-Type": img.file.type
              }
            });

            if (!res.ok) {
              console.error("Upload failed with status", res.status);
              return null;
            }

            console.log("Upload URL generation data:", fileData);
            // The final URL is typically the presigned URL without the query parameters
            // Checking common property names backend might use for the final URL:
            return fileData.url || fileData.fileUrl || fileData.publicUrl || fileData.presignedUrl.split('?')[0];
          } catch (err) {
            console.error("Error uploading file", img.file.name, err);
            return null;
          }
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        finalUrls = [...finalUrls, ...uploadedUrls.filter(Boolean)];
      } else {
        setError("Failed to generate upload URLs for your images.");
        setSaving(false);
        return;
      }
    }

    // Optional: Delete removedImages from storage if needed.
    // For now, removing them from finalUrls ensures they are detached from the log.

    const payload = {
      problem: form.problem,
      feeling: form.feelings,
      problemArea: form.location,
      intensity: Number(form.intensity),
      dateStarted: isoDate,
      description: form.symptoms,
      files: finalUrls,
    };

    const endpoint = editingLogId ? API_URLS.HEALTH_LOG(editingLogId) : API_URLS.HEALTH_LOGS;
    const method = editingLogId ? "PATCH" : "POST";

    const result = await apiCallWithAuth(endpoint, method, payload);
    setSaving(false);

    if (result && typeof result === "object" && result.success === false) {
      setError(result.message || "Unable to save health log.");
      return;
    }

    dispatch(fetchHealthLogs());
    setModalOpen(false);
    resetForm();
  };

  return {
    logs,
    loading,
    modalOpen,
    saving,
    error: error || reduxError,
    form,
    existingImages,
    removedImages,
    editingLogId,
    openCreateModal,
    startEdit,
    handleDelete,
    handleInputChange,
    toggleFeeling,
    handleFiles,
    removeExistingImage,
    removeImage,
    resetForm,
    setModalOpen,
    handleSubmit,
  };
};



