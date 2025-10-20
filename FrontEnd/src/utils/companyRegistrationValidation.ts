export function validateCompanyRegistration({
  companyName,
  address,
  phoneNumber,
  email,
  userEmail,
  userPassword,
  userPasswordConfirmation,
  userFirstName,
  userLastName,
}: {
  companyName: string;
  address: string;
  phoneNumber: string;
  email: string;
  userEmail: string;
  userPassword: string;
  userPasswordConfirmation: string;
  userFirstName: string;
  userLastName: string;
}): string | null {
  // Required fields validation
  if (!companyName || !address || !phoneNumber || !email || !userEmail || !userFirstName || !userLastName || !userPassword || !userPasswordConfirmation) {
    return "Please fill in all required fields.";
  }

  // Password confirmation validation
  if (userPassword !== userPasswordConfirmation) {
    return "Passwords do not match.";
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid company email address.";
  }

  if (!emailRegex.test(userEmail)) {
    return "Please enter a valid user email address.";
  }

  // Password strength validation
  if (userPassword.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  // Company name length validation
  if (companyName.length > 30) {
    return "Company name must be 30 characters or less.";
  }

  // Address length validation
  if (address.length > 255) {
    return "Address must be 255 characters or less.";
  }

  // Phone number length validation
  if (phoneNumber.length > 20) {
    return "Phone number must be 20 characters or less.";
  }

  // First name and last name length validation
  if (userFirstName.length > 255) {
    return "First name must be 255 characters or less.";
  }

  if (userLastName.length > 255) {
    return "Last name must be 255 characters or less.";
  }

  return null;
}
