import React, { ChangeEvent } from "react";
import { TextField } from "@material-ui/core";
import { useFormContext } from "react-hook-form";
import styles from "./FormField.module.scss";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

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
  const [date, setDate] = React.useState<Dayjs | Date>();
  const [yearError, setYearError] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");

  const { register, formState, setValue, getValues, setError } =
    useFormContext();

  const handleChange = (newValue: any) => {
    if (newValue?.$d) {
      setDate(new Date(newValue?.$d));

      handleChangeDate(new Date(newValue?.$d));

      setValue(name, new Date(newValue?.$d));
    }

    Number(newValue?.year()) <= 2099 && Number(newValue?.year()) >= 1900
      ? setYearError("")
      : setYearError("wrong year");
  };

  React.useEffect(() => {
    setValue(name, initialText ? initialText : initialDate);

    if (initialDate) {
      setDate(initialDate);

      setInputValue(initialText);
    }
  }, []);

  const onChangeTextField = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    handleChangeTextField(e.target.value);

    setValue(name, e.target.value);
  };

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
