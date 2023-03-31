import React from "react";
import { FormProvider, useForm } from "react-hook-form";

import { ChangeUserDataDto } from "@/api/types";
import { Api } from "@/api/index";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import { yupResolver } from "@hookform/resolvers/yup";

import { editProfileFormSchema } from "@/utils/validations";

import { FormField } from "@/components/FormField";

import { Alert } from "@mui/material";
import { Button } from "@material-ui/core";

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
  const [date, setDate] = React.useState<Date>(birthDate);
  const [localName, setLocalName] = React.useState("");
  const [localSurname, setLocalSurname] = React.useState("");
  const [isValid, setIsValid] = React.useState(false);

  const form = useForm({
    mode: "onChange",
    resolver: yupResolver(editProfileFormSchema),
  });

  const userData = useAppSelector(selectUserData);

  const onSubmit = async (dto: ChangeUserDataDto) => {
    try {
      const data = await Api().user.changeUserData(
        { name: dto.name, surname: dto.surname, birthDate: date },
        userData.id
      );

      await setDate(dto.birthDate);

      handleSubmit(data);
    } catch (err: any) {
      console.warn("Auth error", err);

      if (err.response) {
        setErrorMessage(err.response.data.message);
      }
    }
  };

  React.useEffect(() => {
    if (typeof form.getValues().birthDate === "object") {
      if (
        birthDate?.toLocaleDateString("ru-Ru")?.replaceAll(".", "/") !==
          form
            .getValues()
            .birthDate?.toLocaleDateString("ru-Ru")
            ?.replaceAll(".", "/") ||
        form.getValues().name !== name ||
        form.getValues().surname !== surname
      ) {
        setIsValid(true);
      }
    } else {
      if (
        birthDate !== form.getValues() ||
        form.getValues().name !== name ||
        form.getValues().surname !== surname
      ) {
        setIsValid(true);
      }
    }
  }, [localName, localSurname, date]);

  return (
    <div>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
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
              handleChangeTextField={(value) => setLocalName(value)}
              type="editProfile"
            />
            <FormField
              name="surname"
              label="Фамилия"
              initialText={surname}
              handleChangeTextField={(value) => setLocalSurname(value)}
              type="editProfile"
            />
            <FormField
              name="birthDate"
              label="Дата рождения"
              initialDate={date}
              handleChangeDate={(date: any) => setDate(date)}
            />
            <Button
              disabled={
                !isValid ||
                !form.formState.errors ||
                form.formState.isSubmitting
              }
              type="submit"
              variant="contained"
              fullWidth
            >
              Сохранить
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
