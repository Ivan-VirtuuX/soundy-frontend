import * as yup from "yup";
import parse from "date-fns/parse";

export const LoginFormSchema = yup.object().shape({
  login: yup
    .string()
    .required("Введите логин")
    .min(6, "Длина логина меньше 6 символов")
    .max(10, "Длина логина больше 10 символов"),
  password: yup
    .string()
    .required("Введите пароль")
    .min(6, "Длина пароля менее 6 символов"),
});

export const RegisterFormSchema = yup
  .object()
  .shape({
    name: yup
      .string()
      .required("Введите имя")
      .max(10, "Длина имени больше 10 символов"),
    surname: yup
      .string()
      .required("Введите фамилию")
      .max(20, "Длина фамилии больше 20 символов"),
    birthDate: yup
      .date()
      .typeError("Введите дату рождения")
      .required("Введите дату рождения")
      .transform(function (value, originalValue) {
        this.isType(value) && value;

        const result = parse(
          originalValue.slice(0, 10).replaceAll("/", "."),
          "dd.mm.yyyy",
          new Date()
        );

        return (
          String(result.getFullYear()).length === 4 &&
          result.getFullYear() <= 2099 &&
          result.getFullYear() >= 1900 &&
          result
        );
      }),
    secondPassword: yup
      .string()
      .required("Повторите пароль")
      .min(6, "Длина пароля менее 6 символов")
      .oneOf([yup.ref("password")], "Пароли не совпадают"),
  })
  .concat(LoginFormSchema);
