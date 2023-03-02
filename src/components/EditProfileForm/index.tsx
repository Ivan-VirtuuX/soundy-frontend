import { ChangeUserDataDto } from "@/api/types";
import { Api } from "@/api/index";
import { useAppSelector } from "@/redux/hooks";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import { editProfileFormSchema } from "@/utils/validations";

import { FormField } from "@/components/FormField";

import { Alert } from "@mui/material";
import { Button } from "@material-ui/core";

import styles from "./EditProfileForm.module.scss";
import { selectUserData } from "@/redux/slices/user";

interface EditProfileFormProps {
  name: string;
  surname: string;
  birthDate: Date;
  handleSubmit: (data: ChangeUserDataDto) => void;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  name,
  surname,
  birthDate,
  handleSubmit,
}) => {
  const [errorMessage, setErrorMessage] = React.useState("");
  const [date, setDate] = React.useState<Date>(new Date(birthDate));

  const form = useForm({
    mode: "onChange",
    resolver: yupResolver(editProfileFormSchema),
  });

  const userData = useAppSelector(selectUserData);

  const onSubmit = async (dto: ChangeUserDataDto) => {
    try {
      const data = await Api().user.changeUserData(dto, userData.id);

      handleSubmit(data);
    } catch (err: any) {
      console.warn("Auth error", err);

      if (err.response) {
        setErrorMessage(err.response.data.message);
      }
    }
  };

  return (
    <div className={styles.form}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className={styles.formWrapper}>
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
            <FormField
              name="name"
              label="Имя"
              initialText={name}
              type="editProfile"
            />
            <FormField
              name="surname"
              label="Фамилия"
              initialText={surname}
              type="editProfile"
            />
            <FormField
              name="birthDate"
              label="Дата рождения"
              initialDate={date}
              handleChangeDate={(date: any) => setDate(date.$d)}
            />
            <Button
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
              type="submit"
              variant="contained"
              fullWidth
              className={styles.saveButton}
            >
              Сохранить
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
