import { HealthLogCard, HealthLogForm } from "./HealthLogComponents";
import { getLogValue } from "./useHealthLogs";
import { useHealthLogs } from "./useHealthLogs";

const HealthLogs = () => {
  const {
    logs,
    loading,
    modalOpen,
    saving,
    error,
    form,
    existingImages,
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
  } = useHealthLogs();

  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  return (
    <div className="health-log-panel">
      <div className="health-log-row">
        <div>
          {/* <p className="page-subtitle">Welcome back,</p> */}
          <h1 className="page-heading">My Health Logs</h1>
        </div>
        <button type="button" onClick={openCreateModal} className="btn-primary w-auto">
          + Create your logs
        </button>
      </div>

      <div>
        {loading ? (
          <p className="page-subtitle">Loading health logs...</p>
        ) : logs.length === 0 ? (
          <div className="health-log-empty">
            <p className="page-subtitle">No health logs found</p>
          </div>
        ) : (
          <div className="health-log-grid">
            {logs.map((log, index) => (
              <HealthLogCard
                key={getLogValue(log, "_id", "id") ?? index}
                log={log}
                index={index}
                onEdit={startEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <HealthLogForm
          editingLogId={editingLogId}
          form={form}
          existingImages={existingImages}
          error={error}
          saving={saving}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onInputChange={handleInputChange}
          toggleFeeling={toggleFeeling}
          handleFiles={handleFiles}
          removeExistingImage={removeExistingImage}
          removeImage={removeImage}
        />
      )}
    </div>
  );
};

export default HealthLogs;
