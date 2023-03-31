import React, { ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";

import { TextField } from "@material-ui/core";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { Dayjs } from "dayjs";

import styles from "./FormField.module.scss";

interface FormFieldProps {
  name: string;
  label: string;
  initialDate?: Date;
  initialText?: string;
  type?: string;
  handleChangeDate?: (date: Dayjs | Date) => void;
  handleChangeTextField?: (value: string) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  initialDate,
  initialText,
  type,
  handleChangeDate,
  handleChangeTextField,
}) => {
  const [yearError, setYearError] = React.useState("");
  const [date, setDate] = React.useState<Dayjs | Date>();

  const { register, formState, setValue } = useFormContext();

  const handleChange = (newValue: any) => {
    if (newValue?.$d) {
      setDate(new Date(newValue?.$d));

      handleChangeDate && handleChangeDate(new Date(newValue?.$d));

      setValue(name, new Date(newValue?.$d));
    }

    Number(newValue?.year()) <= 2099 && Number(newValue?.year()) >= 1900
      ? setYearError("")
      : setYearError("wrong year");
  };

  const onChangeTextField = (e: ChangeEvent<HTMLInputElement>) => {
    handleChangeTextField(e.target.value);

    setValue(name, e.target.value);
  };

  React.useEffect(() => {
    setValue(name, initialText ? initialText : initialDate);

    if (initialDate) {
      setDate(initialDate);
    }
  }, []);

  return (
    <>
      {name === "birthDate" ? (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label={label}
            inputFormat="DD/MM/YYYY"
            value={date}
            onChange={handleChange}
            renderInput={(params: any) => (
              <TextField
                className={`${styles.formField}`}
                {...params}
                {...register(name)}
                helperText={yearError && formState.errors[name]?.message}
                name={name}
                label={label}
                fullWidth
                variant="outlined"
              />
            )}
          />
        </LocalizationProvider>
      ) : type === "editProfile" ? (
        <TextField
          className={styles.formField}
          {...register(name)}
          helperText={formState.errors[name]?.message}
          error={!!formState.errors[name]?.message}
          name={name}
          label={label}
          fullWidth
          onChange={onChangeTextField}
          variant="outlined"
          InputProps={{
            className: styles.textField,
            type:
              name === "password" || name === "secondPassword"
                ? "password"
                : "text",
          }}
        />
      ) : (
        <TextField
          type=""
          className={styles.formField}
          {...register(name)}
          helperText={formState.errors[name]?.message}
          error={!!formState.errors[name]?.message}
          name={name}
          label={label}
          fullWidth
          variant="outlined"
          InputProps={{
            className: styles.textField,
            type:
              name === "password" || name === "secondPassword"
                ? "password"
                : "text",
          }}
        />
      )}
    </>
  );
};
