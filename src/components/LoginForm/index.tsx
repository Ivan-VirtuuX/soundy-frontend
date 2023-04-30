import React from "react";
import { FormProvider, useForm } from "react-hook-form";

import Image from "next/image";
import { useRouter } from "next/router";

import { setCookie } from "nookies";

import { useAppDispatch } from "@/redux/hooks";
import { setUserData } from "@/redux/slices/user";

import { LoginFormSchema } from "@/utils/validations";

import { yupResolver } from "@hookform/resolvers/yup";

import { Api } from "@/api";
import { LoginDto } from "@/api/types";

import { Alert } from "@mui/material";
import { Button } from "@material-ui/core";

import { FormField } from "@/components/FormField";

import helloSticker from "@/images/helloSticker.png";
import wrongSticker from "@/images/wrongSticker.png";
import logo from "@/images/logo.svg";

import styles from "./LoginForm.module.scss";

interface LoginFormProps {
  onOpenRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onOpenRegister }) => {
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isCorrect, setIsCorrect] = React.useState(true);

  const dispatch = useAppDispatch();

  const form = useForm({
    mode: "onChange",
    resolver: yupResolver(LoginFormSchema),
  });

  const router = useRouter();

  const onSubmit = async (dto: LoginDto) => {
    try {
      const data = await Api().user.login(dto);

      if (data.token) {
        setCookie(null, "authToken", data.token, {
          maxAge: 30 * 24 * 60 * 100,
          path: "/",
        });

        setErrorMessage("");

        dispatch(setUserData(data));

        await router.push("/posts");
      }
    } catch (err) {
      console.warn("Auth error", err);

      if (err.response) {
        setErrorMessage(err.response.data.message);
      }
    }
  };

  React.useEffect(() => {
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
          alt=""
          quality={100}
        />
      ) : (
        <Image
          className={styles.sticker}
          src={wrongSticker}
          alt=""
          quality={100}
        />
      )}
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className={styles.formWrapper}>
            <Image src={logo} alt="logo" quality={100} />
            <p className={styles.formType}>Вход в Soundy</p>
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
            <FormField name="password" label="Пароль" />
            <div className={styles.formActions}>
              <Button
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
                type="submit"
                variant="contained"
                fullWidth
              >
                Войти
              </Button>
            </div>
            <div className={styles.registerBlock}>
              <h2>Нет аккаунта?</h2>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                onClick={onOpenRegister}
                className={styles.registerButton}
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
