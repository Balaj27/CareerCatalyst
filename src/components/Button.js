import { Button as MuiButton } from '@mui/material';
import { styled } from '@mui/material/styles';

// You can create a custom styled button if needed
const StyledButton = styled(MuiButton)(({ theme, variant, size }) => ({
  // Add custom styling here if needed
}));

export const Button = React.forwardRef(({ variant = "contained", size = "medium", children, ...props }, ref) => {
  return (
    <MuiButton
      variant={variant === "default" ? "contained" : variant}
      size={size === "default" ? "medium" : size}
      ref={ref}
      {...props}
    >
      {children}
    </MuiButton>
  );
});

