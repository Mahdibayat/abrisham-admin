import * as yup from "yup";

export const loginValidator = yup.object({
  username: yup.string().required("اجباری"),
  password: yup.string().required("اجباری"),
});

export const socialValidator = yup.object({
  name: yup.string().required("اجباری"),
  link: yup.string().url("فرمت وارد شده اشتباه است باید به فرمت آدرس url باشد").required("اجباری"),
});

export const aboutUsValidator = yup.object({
  description: yup.string().min(25, "برای توضیحات مقاله به تعداد کاراکتر بیشتری نیاز است"),
});

export const blogValidator = yup.object({
  title: yup.string().required("اجباری"),
});
