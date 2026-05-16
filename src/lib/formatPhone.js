export const formatPhone = (phone) => {
     if (!phone) return "";
     
     // Remove all non-digit characters
     const cleaned = phone.replace(/\D/g, "");
     
     // Format as xxx-xxx-xxxx (0999-999-9999)
     if (cleaned.length === 10) {
          return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, "$1-$2-$3");
     }
     
     return phone;
};
