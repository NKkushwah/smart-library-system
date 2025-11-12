import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function ModalForm({ formType, formData, setFormData, onSubmit, onClose, editId }) {
  const handleSave = async () => {

    await onSubmit();


    if (formType === "teachers") {
      try {
        const res = await fetch("http://localhost:5000/api/mail/send-mail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teacherEmail: formData.email,
            studentId: formData.username, // Teacher ka username as ID
            tempPassword: formData.password, // Teacher ka password
          }),
        });

        const data = await res.json();
        if (data.success) {
          alert(" Mail sent to teacher!");
        } else {
          alert("Failed to send mail.");
        }
      } catch (error) {
        console.error(error);
        alert(" Error while sending mail.");
      }
    }
  };

  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content rounded-3 shadow-lg">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              {editId ? "Edit" : "Add"} {formType.slice(0, -1)}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {/* Teacher Form */}
            {formType === "teachers" && (
              <>
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.username || ""}
                  className="form-control mb-2"
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email || ""}
                  className="form-control mb-2"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={formData.phone || ""}
                  className="form-control mb-2"
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password || ""}
                  className="form-control mb-2"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </>
            )}

            {/* Student Form */}
            {formType === "students" && (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name || ""}
                  className="form-control mb-2"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email || ""}
                  className="form-control mb-2"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </>
            )}

            {/* Course Form */}
            {formType === "courses" && (
              <>
                <input
                  type="text"
                  placeholder="Course Title"
                  value={formData.title || ""}
                  className="form-control mb-2"
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <textarea
                  placeholder="Course Description"
                  value={formData.description || ""}
                  className="form-control mb-2"
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                ></textarea>
              </>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalForm;
