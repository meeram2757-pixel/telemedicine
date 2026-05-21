import { getLogArray, getLogImageUrls, getLogValue } from "./useHealthLogs";
import {
  CalendarIcon,
  ChartBarIcon,
  TargetIcon,
  SmileIcon,
  XIcon,
  TrashIcon,
  PencilIcon,
} from "../../../../components/Icons";

const feelingOptions = ["Pain", "Stressed", "Headache", "Tense", "Dizzy", "Nauseous"];

export const HealthLogCard = ({ log, index, onEdit, onDelete }) => {
  const title = getLogValue(log, "problem", "title", "reason") || "Health log entry";
  const feelings = getLogArray(log, "feelings", "feeling", "emotion", "mood");
  const images = getLogImageUrls(log);
  const intensity = getLogValue(log, "intensity", "severity", "level");
  const startedDate = getLogValue(log, "dateStarted", "startedAt", "date", "createdAt");

  return (
    <div className="health-log-card">
      <div className="">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl" style={{ color: 'rgb(26,26,26)' ,fontWeight:700}}>
                {title}
              </h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-lg text-red-700">
              <CalendarIcon className="h-4 w-4" />
              {startedDate ? new Date(startedDate).toLocaleDateString() : "No date"}
            </span>
          </div>

          <div className="grid lg:grid-cols-[1.05fr_0.85fr]">
            <div className="space-y-4">
              <div className="flex items-center gap-3" style={{ color: 'rgb(26,26,26)' }}>
                <ChartBarIcon className="text-red-600 h-4 w-4" />
                <span className="font-semibold">Intensity:</span>
                <span>{intensity ?? "—"}/100</span>
              </div>
              <div className="flex items-center gap-3" style={{ color: 'rgb(26,26,26)' }}>
                <TargetIcon className="text-red-600 h-4 w-4" />
                <span className="font-semibold">Problem Area:</span>
                <span>{getLogValue(log, "location", "bodyPart", "area", "problemArea") || "N/A"}</span>
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2 uppercase tracking-[0.18em]" style={{ color: 'rgb(26,26,26)' }}>
                  <SmileIcon className="h-4 w-4" />
                  <span className="font-semibold" style={{ color: 'rgb(26,26,26)' }}>FEELING</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {feelings.map((item, index) => (
                    <span key={index} className="inline-flex rounded-full bg-red-100 px-2 py-0.5 font-medium text-black-600">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="">
              <p className="uppercase font-semibold" style={{ color: 'rgb(26,26,26)' }} >DESCRIPTION</p>
              <p className="mt-3" style={{ color: 'rgb(26,26,26)' }}>
                {getLogValue(log, "symptoms", "description", "details", "notes") || "No description added."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="mt-6 grid grid-cols-9">
          {images.map((imageUrl, imageIndex) => (
            <img
              key={`${log.id ?? index}-card-img-${imageIndex}`}
              src={imageUrl}
              alt={`Health log image ${imageIndex + 1}`}
              className="h-24 w-24 rounded-2xl object-cover"
            />
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={() => onEdit(log)} className="btn-primary w-28 flex gap-2">
          <PencilIcon />
          <span>Edit</span>
        </button>
        <button type="button" onClick={() => onDelete(getLogValue(log, "_id", "id"))} className="btn-outline w-28 flex ">
          <TrashIcon />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export const HealthLogForm = ({
  editingLogId,
  form,
  existingImages,
  error,
  saving,
  onClose,
  onSubmit,
  onInputChange,
  toggleFeeling,
  handleFiles,
  removeExistingImage,
  removeImage,
}) => {
  return (
    <div className="health-log-modal-overlay">
      <div className="health-log-modal">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">
              {editingLogId ? "Update your Health Logs" : "Create your Health Logs"}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="health-log-modal-close">
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="health-log-form">
          <div>
            <label className="form-label">
              What is the problem? <span className="text-red-600">*</span>
            </label>
            <input
              value={form.problem}
              onChange={(e) => onInputChange("problem", e.target.value)}
              placeholder="e.g. sharp pain, cough, anxiety"
              className="form-input"
              required
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="form-label">
                Feeling <span className="text-red-600">*</span>
              </label>
            </div>
            <div className="health-log-feeling-group">
              {feelingOptions.map((option) => {
                const active = form.feelings.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleFeeling(option)}
                    className={`health-log-feeling-pill ${active ? "active" : "inactive"}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {form.feelings.length > 0 && (
              <p className="mt-3 text-sm text-gray-600">Selected: {form.feelings.join(", ")}</p>
            )}
          </div>

          <div>
            <label className="form-label">
              Where on your body?<span className="text-red-600">*</span>
            </label>
            <input
              value={form.location}
              onChange={(e) => onInputChange("location", e.target.value)}
              placeholder="e.g. head, chest, lower back"
              className="form-input"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <label className="form-label">
                Intensity <span className="text-red-600">*</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={form.intensity}
                onChange={(e) => onInputChange("intensity", Number(e.target.value))}
                className="w-full accent-red-600"
              />
            </div>
            <div className="text-sm font-semibold text-slate-900">{form.intensity}/100</div>
          </div>

          <div>
            <label className="form-label">
              Date Started <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              value={form.dateStarted}
              onChange={(e) => onInputChange("dateStarted", e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">
              Symptoms & extra detail <span className="text-red-600">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Different from above: add how it feels, when it happens, or anything else your doctor should know.
            </p>
            <textarea
              value={form.symptoms}
              onChange={(e) => onInputChange("symptoms", e.target.value)}
              placeholder="e.g. worse at night, started after exercise..."
              rows={4}
              className="form-input"
              required
            />
          </div>

          <div>
            <p className="form-label">Attach images from your device</p>
            <p className="text-sm text-gray-500 mb-3">Up to 5 images (JPEG, PNG, or WebP).</p>
            <label className="btn-primary w-auto">
              Choose images
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                multiple
                className="hidden"
                onChange={handleFiles}
              />
            </label>
            {existingImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-900 mb-2">Existing images</p>
                <div className="health-log-images-grid">
                  {existingImages.map((image) => (
                    <div key={image.id} className="health-log-image-card relative">
                      <img src={image.url} alt="Existing attached" className="health-log-image" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(image.id)}
                        className="health-log-image-remove"
                        style={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {form.images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-900 mb-2">Selected new images</p>
                <div className="health-log-images-grid">
                  {form.images.map((image) => (
                    <div key={image.id} className="health-log-image-card">
                      <img src={image.preview} alt={image.file.name} className="health-log-image" />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="health-log-image-remove"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                      <div className="health-log-image-meta">{image.file.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {error ? <p className="error-message">{error}</p> : null}
          <button type="submit" disabled={saving} className="btn-primary w-full disabled:cursor-not-allowed disabled:bg-red-300">
            {saving ? "Saving..." : editingLogId ? "Update Log" : "Save Log"}
          </button>
          
        </form>
      </div>
    </div>
  );
};
