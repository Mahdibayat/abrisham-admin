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
  short_description: yup.string().required("اجباری")
});

export const contactUsValidator = yup.object({
  id: yup.string(),
  phone1: yup.string().required("اجباری"),
  phone2: yup.string().required("اجباری"),
  phone3: yup.string().required("اجباری"),
  phone4: yup.string().required("اجباری"),
  phone5: yup.string().required("اجباری"),
  lat: yup.string().required("اجباری"),
  long: yup.string().required("اجباری"),
  address: yup.string().required("اجباری"),
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

export const homeSliderValidator = yup.object({
  title: yup.string().required("اجباری"),
  description: yup.string().min('20', 'باید بیشتر از 20 کلمه باشد'),
});

