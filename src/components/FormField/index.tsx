import React from "react";
import { TextField } from "@material-ui/core";
import { useFormContext } from "react-hook-form";
import styles from "./FormField.module.scss";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface FormFieldProps {
  name: string;
  label: string;
  initialDate?: Date;
  initialText?: string;
  type?: string;
  handleChangeDate?: (date: Date) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  initialDate,
  initialText,
  type,
  handleChangeDate,
}) => {
  const [date, setDate] = React.useState<Date>(initialDate);
  const [yearError, setYearError] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");

  const { register, formState, getValues, setValue } = useFormContext();

  const handleChange = (newValue: any) => {
    console.log("newvalue", newValue.$d);

    setDate(newValue.$d);

    handleChangeDate(newValue.$d);

    Number(newValue?.year()) <= 2099 && Number(newValue?.year()) >= 1900
      ? setYearError("")
      : setYearError("wrong year");
  };

  React.useEffect(() => {
    setValue(name, initialText ? initialText : initialDate);

    initialDate && setDate(initialDate);

    initialText && setInputValue(initialText);
  }, []);

  console.log(getValues());

  console.log("initialDate", initialDate);

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
                helperText={yearError !== "" && formState.errors[name]?.message}
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
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
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
