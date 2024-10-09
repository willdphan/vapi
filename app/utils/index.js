export const isPublicKeyMissingError = ({ vapiError }) => {
    // Implement the logic to check if the error is due to a missing public key
    // This is a placeholder implementation
    return vapiError.message.includes("Public key is missing");
  };