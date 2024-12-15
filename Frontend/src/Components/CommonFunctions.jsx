import toast from "react-hot-toast";

export default function ShowToast() {
  toast("You have unsaved changes. Please save or cancel before proceeding !", {
    duration: 3000,
    style: {
      backgroundColor: "#f8d7da", // Example of background color
      color: "#721c24", // Example of text color
      border: "1px solid #f5c6cb", // Example of border
      padding: "10px", // Padding for the toast
      fontSize: "16px", // Font size
      borderRadius: "5px", // Rounded corners
    },
  });
}
