import * as Yup from "yup";
export const AddFolder = Yup.object({
  subjectName: Yup.string().required(" Folder name is required"),
});

export const updateProfileSchema = Yup.object({
  name: Yup.string().required(" name is required"),
  email: Yup.string().required("email is required"),
  phone: Yup.number().required("phone number is required"),
  // department: Yup.string().required("department is required"),
  // empAddress: Yup.string().required("address is required"),
});
