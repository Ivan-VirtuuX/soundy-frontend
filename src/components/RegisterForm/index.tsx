import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import Image from "next/image";
import { useRouter } from "next/router";

import { setCookie } from "nookies";

import { useAppDispatch } from "@/redux/hooks";
import { setUserData } from "@/redux/slices/user";

import { RegisterFormSchema } from "@/utils/validations";
import { capitalize } from "@/utils/capitalizeString";

import { yupResolver } from "@hookform/resolvers/yup";

import { Api } from "@/api";
import { CreateUserDto } from "@/api/types";

import { Alert } from "@mui/material";
import { Button } from "@material-ui/core";

import { FormField } from "@/components/FormField";
import { ArrowLeftIcon } from "@/components/ui/Icons/ArrowLeftIcon";

import helloSticker from "@/images/helloSticker.png";
import wrongSticker from "@/images/wrongSticker.png";
import logo from "@/images/logo.svg";

import styles from "./RegisterForm.module.scss";

interface RegisterFormProps {
  onOpenLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onOpenLogin }) => {
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isCorrect, setIsCorrect] = React.useState(true);
  const [date, setDate] = React.useState<Date>();

  const dispatch = useAppDispatch();

  const form = useForm({
    mode: "onChange",
    resolver: yupResolver(RegisterFormSchema),
  });

  const router = useRouter();

  const onSubmit = async (dto: CreateUserDto) => {
    try {
      const data = await Api().user.register({
        name: capitalize(dto.name),
        surname: capitalize(dto.surname),
        birthDate: date,
        login: dto.login.toLowerCase(),
        password: dto.password,
      });

      if (data.token) {
        setCookie(null, "authToken", data.token, {
          maxAge: 30 * 24 * 60,
          path: "/",
        });
        setErrorMessage("");
        dispatch(setUserData(data));

        await router.push("/posts");
      }

      data.response.message && setErrorMessage(data.response.message);
    } catch (err) {
      console.warn("Auth error", err);

      if (err.response) {
        setErrorMessage(err.response.data.message);
      }
    }
  };

  useEffect(() => {
    !form.formState.isDirty && setIsCorrect(true);

    form.formState.isDirty && !form.formState.isValid
      ? setIsCorrect(false)
      : setIsCorrect(true);
  }, [form.formState]);

  return (
    <div className={styles.form}>
      {isCorrect ? (
        <Image
          className={styles.sticker}
          src={helloSticker}
          alt="helloSticker"
          quality={100}
        />
      ) : (
        <Image
          className={styles.sticker}
          src={wrongSticker}
          alt="wrongSticker"
          quality={100}
        />
      )}
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className={styles.formWrapper}>
            <Image src={logo} alt="logo" quality={100} />
            <div className={styles.head}>
              <ArrowLeftIcon handleClick={onOpenLogin} />
              <p>Регистрация</p>
            </div>
            {errorMessage && (
              <div style={{ width: "100%" }}>
                <Alert
                  severity="error"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 20,
                    marginTop: 20,
                    borderRadius: 17,
                    height: 50,
                    width: "100%",
                  }}
                >
                  {errorMessage}
                </Alert>
              </div>
            )}
            <FormField name="login" label="Логин" />
            <div className={styles.nameSurnameInputBlock}>
              <FormField name="name" label="Имя" />
              <FormField name="surname" label="Фамилия" />
            </div>
            <FormField
              name="birthDate"
              label="Дата рождения"
              handleChangeDate={(date: any) => setDate(date)}
            />
            <FormField name="password" label="Пароль" />
            <FormField name="secondPassword" label="Повторите пароль" />
            <div className={styles.formActions}>
              <Button
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
                type="submit"
                variant="contained"
                fullWidth
              >
                Зарегистрироваться
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
