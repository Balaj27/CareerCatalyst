import { TextField } from '@mui/material';

export const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <TextField
      variant="outlined"
      size="small"
      fullWidth
      inputRef={ref}
      {...props}
    />
  );
});