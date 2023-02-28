import React from "react";
import { TextField } from "@material-ui/core";
import { useFormContext } from "react-hook-form";
import styles from "./FormField.module.scss";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface FormFieldProps {
  name: string;
  label: string;
  initialDate?: Date;
  initialText?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  initialDate,
  initialText,
}) => {
  const [value, setValue] = React.useState<Dayjs | null | Date>(
    dayjs(new Date())
  );
  const [yearError, setYearError] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");

  const { register, formState } = useFormContext();

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);

    Number(newValue?.year()) <= 2099 && Number(newValue?.year()) >= 1900
      ? setYearError("")
      : setYearError("wrong year");
  };

  React.useEffect(() => {
    initialDate && setValue(initialDate);

    initialText && setInputValue(initialText);
  }, []);

  return (
    <>
      {name === "birthDate" ? (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label={label}
            inputFormat="DD/MM/YYYY"
            value={value}
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
      ) : (
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
      )}
    </>
  );
};
