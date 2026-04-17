import Swal from "sweetalert2";

// Success alert
export const showSuccess = (msg) => {
  Swal.fire("Success", msg, "success");
};

// Error alert
export const showError = (msg) => {
  Swal.fire("Error", msg, "error");
};

// Loading alert
export const showLoading = () => {
  Swal.fire({
    title: "Loading...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

// Close loading
export const closeLoading = () => {
  Swal.close();
};