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

export const contactUsValidator = yup.object({
  key: yup.string().required("اجباری"),
  value: yup.string().required("اجباری")
});

export const blogValidator = yup.object({
  title: yup.string().required("اجباری"),
});

export const serviceValidator = yup.object({
  title: yup.string().required("اجباری"),
  status: yup.bool().required("اجباری")
});

export const serviceAttrValidator = yup.object({
  title: yup.string().required("اجباری"),
});

export const faqValidator = yup.object({
  question: yup.string().required("اجباری"),
  answer: yup.string().required("اجباری"),
  priority: yup.number().required("اجباری")
});

